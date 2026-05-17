# Multi-Tenant SaaS Refactor Plan

Refactor CableHub into a three-portal multi-tenant platform with strict tenant isolation. All data stays mock/frontend-only (no backend yet) — every entity carries `operator_id` and access is gated client-side per role.

## Architecture

Three completely separate portals, each with its own login + layout:

```text
/                          Marketing landing
/about /contact /faq       Public pages

/super-admin/login         Super Admin auth
/super-admin/*             Platform owner portal

/operator/login            Operator Admin auth
/operator/*                Tenant-isolated operator portal

/subscriber/login          Subscriber auth (requires operator code)
/subscriber/*              Customer portal (operator-branded)
```

Old `/admin/*` and `/login` routes are removed (replaced by `/operator/*` and `/operator/login`). Old `/subscriber-login` replaced by `/subscriber/login`.

## Auth model (`src/lib/auth.tsx`)

Session shape extended:
```ts
type Role = "super_admin" | "operator_admin" | "subscriber";
type Session = {
  id: string;
  role: Role;
  name: string;
  operator_id?: string;   // required for operator_admin + subscriber
  operator_code?: string; // for subscriber branding lookup
  email?: string;
  phone?: string;
};
```

Three login methods: `loginSuperAdmin`, `loginOperator`, `loginSubscriber(operatorCode, phone, password)`. Subscriber login resolves operator by code first, then validates credentials scoped to that operator.

Route guards in `beforeLoad` for each portal layout enforce role + (for subscriber/operator) presence of `operator_id`.

## Mock data layer (`src/lib/mock-data.ts`)

Add:
- `Operator { id, code, companyName, contactPerson, phone, email, address, gst, plan, status, branding: { logo, primaryColor, supportPhone, supportEmail } }`
- `Subscriber` gets `operator_id`, `password`, `stbId`, `area`, `whatsapp`, `installDate`, `notes`
- `Pack` gets `operator_id`, `channels`, `hd`, `monthly/quarterly/halfYearly/yearly` prices, `popular`
- `CustomPrice { operator_id, subscriber_id, pack_id, price, validityDays }`
- `Recharge` gets `operator_id`
- Seed 3 operators (STAR001, GTPL002, SKY003) each with their own subscribers/packs/recharges

Helper functions filter by `operator_id` — every operator-scoped query goes through `getByOperator(operatorId)` helpers so isolation is enforced in one place.

## Files

### New
- `src/routes/super-admin.tsx` (layout + guard)
- `src/routes/super-admin.login.tsx`
- `src/routes/super-admin.index.tsx` (dashboard)
- `src/routes/super-admin.operators.tsx` (CRUD)
- `src/routes/super-admin.settings.tsx`
- `src/routes/operator.tsx` (layout + guard, replaces admin.tsx)
- `src/routes/operator.login.tsx`
- `src/routes/operator.index.tsx`
- `src/routes/operator.subscribers.tsx`
- `src/routes/operator.packs.tsx`
- `src/routes/operator.pricing.tsx`
- `src/routes/operator.recharges.tsx`
- `src/routes/operator.reports.tsx`
- `src/routes/operator.notifications.tsx`
- `src/routes/operator.branding.tsx` (logo, colors, support info)
- `src/routes/operator.settings.tsx`
- `src/routes/subscriber.login.tsx` (3-field: operator code, phone, password)
- `src/components/operator-brand-provider.tsx` (CSS-var injection for subscriber portal)
- `src/components/empty-state.tsx`
- `src/components/confirm-dialog.tsx`
- `src/lib/operators.ts` (helpers, code generator)

### Modified
- `src/lib/auth.tsx` — 3 login methods, role union, operator_id
- `src/lib/mock-data.ts` — multi-tenant data + isolation helpers
- `src/components/dashboard-layout.tsx` — accept role `super_admin | operator_admin | subscriber`, dynamic nav, dynamic branding for subscriber
- `src/routes/index.tsx` — landing page with 3 login CTAs (Super Admin / Operator / Subscriber)
- `src/routes/subscriber.tsx` + children — read operator_id from session, filter all data, use OperatorBrandProvider
- `src/routes/checkout.tsx`, payment-success/failed — operator-branded

### Removed
- `src/routes/admin.tsx` and all `admin.*.tsx` (replaced by `operator.*`)
- `src/routes/login.tsx` (replaced by per-portal logins)
- `src/routes/subscriber-login.tsx` (replaced by `subscriber.login.tsx`)
- `src/routes/forgot-password.tsx` (kept simple: re-add later if needed)

## Tenant isolation enforcement

1. Every mock data query for operator/subscriber portals goes through `getByOperator(session.operator_id)` — direct array access is forbidden in route components.
2. `operator.tsx` `beforeLoad` redirects if `role !== "operator_admin"` or missing `operator_id`.
3. `subscriber.tsx` `beforeLoad` redirects if `role !== "subscriber"` or missing `operator_id`.
4. `super-admin.tsx` guards `role !== "super_admin"`.
5. Subscriber portal never imports operator/super-admin nav items; uses `OperatorBrandProvider` so logo/colors come from their operator only.

## Demo credentials (seeded)

- Super Admin: `owner@cablehub.app` / `super123`
- Operator (STAR001): `admin@starcable.com` / `operator123`
- Operator (GTPL002): `admin@gtpl.com` / `operator123`
- Subscriber: code `STAR001`, phone `9810000000`, password `subscriber123`

## Out of scope (this turn)

- Real backend / Lovable Cloud (mock data only, as in current project)
- Real payment gateway integration (UI placeholders remain)
- WhatsApp/email sending (UI only)

Ready to implement on approval.