import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { getSubscriberById, getOperatorById } from "@/lib/mock-data";
import { readSession } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/subscriber/profile")({
  head: () => ({ meta: [{ title: "My Profile" }] }),
  component: Page,
});

function Page() {
  const u = readSession()!;
  const me = getSubscriberById(u.operator_id!, u.id)!;
  const op = getOperatorById(u.operator_id!)!;
  const [form, setForm] = useState({ name: me.name, email: me.email, address: me.address, whatsapp: me.whatsapp });
  const upd = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Keep your contact details up to date"/>
      <div className="grid lg:grid-cols-3 gap-4">
        <form onSubmit={e => { e.preventDefault(); toast.success("Profile saved"); }} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full name"><Input value={form.name} onChange={e => upd("name", e.target.value)} className="h-10 rounded-xl"/></Field>
            <Field label="Email"><Input value={form.email} onChange={e => upd("email", e.target.value)} className="h-10 rounded-xl"/></Field>
            <Field label="Address"><Input value={form.address} onChange={e => upd("address", e.target.value)} className="h-10 rounded-xl"/></Field>
            <Field label="WhatsApp"><Input value={form.whatsapp} onChange={e => upd("whatsapp", e.target.value)} className="h-10 rounded-xl"/></Field>
          </div>
          <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"><Save className="w-4 h-4 mr-1.5"/>Save changes</Button>
        </form>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft text-sm space-y-3">
          <h3 className="font-display font-semibold">Account info</h3>
          <Row k="Operator" v={op.companyName}/>
          <Row k="Phone" v={me.phone}/>
          <Row k="STB ID" v={me.stbId}/>
          <Row k="Area" v={me.area}/>
          <Row k="Installed" v={new Date(me.installDate).toLocaleDateString()}/>
          <div className="pt-3 border-t border-border space-y-1">
            <div className="font-medium">Need help?</div>
            <div className="text-muted-foreground">{op.branding.supportPhone}</div>
            <div className="text-muted-foreground">{op.branding.supportEmail}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between py-2 border-b border-border last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
