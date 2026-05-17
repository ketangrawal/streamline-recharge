// Multi-tenant mock data layer.
// All operator-scoped queries MUST go through the getByOperator* helpers
// so tenant isolation is enforced in a single place.

export type SubscriptionPlan = "Starter" | "Growth" | "Enterprise";

export type OperatorBranding = {
  logo?: string;       // optional URL (otherwise initials)
  primaryColor: string; // hex
  supportPhone: string;
  supportEmail: string;
  tagline?: string;
};

export type Operator = {
  id: string;
  code: string;          // e.g. STAR001
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gst: string;
  plan: SubscriptionPlan;
  status: "active" | "inactive";
  createdAt: string;
  branding: OperatorBranding;
  // mock auth
  adminEmail: string;
  adminPassword: string;
};

export type Pack = {
  id: string;
  operator_id: string;
  name: string;
  description: string;
  channels: number;
  monthly: number;
  quarterly: number;
  halfYearly: number;
  yearly: number;
  type: "HD" | "SD";
  active: boolean;
  popular?: boolean;
};

export type Subscriber = {
  id: string;
  operator_id: string;
  name: string;
  phone: string;
  password: string;
  email: string;
  address: string;
  area: string;
  stbId: string;
  installDate: string;
  whatsapp: string;
  notes: string;
  status: "active" | "inactive";
  packId: string;
  expiry: string;
};

export type CustomPrice = {
  id: string;
  operator_id: string;
  subscriber_id: string;
  pack_id: string;
  price: number;
  validityDays: number;
};

export type Recharge = {
  id: string;
  operator_id: string;
  subscriberId: string;
  subscriberName: string;
  packId: string;
  packName: string;
  amount: number;
  method: "UPI" | "Razorpay" | "Cash" | "Card";
  date: string;
  expiry: string;
  status: "success" | "pending" | "failed";
};

export type AppNotification = {
  id: string;
  operator_id: string;
  subscriber_id?: string;
  title: string;
  body: string;
  type: "success" | "warning" | "info" | "error";
  date: string;
  read: boolean;
};

// =================================================================
// SEED DATA — 3 operators, each with own subscribers / packs / recharges
// =================================================================

export const OPERATORS: Operator[] = [
  {
    id: "op-1", code: "STAR001",
    companyName: "StarVision Cable Network",
    contactPerson: "Ramesh Iyer",
    phone: "+91 98100 11111",
    email: "contact@starvision.in",
    address: "12 MG Road, Bangalore, KA 560001",
    gst: "29ABCDE1234F1Z5",
    plan: "Growth", status: "active",
    createdAt: new Date(Date.now() - 280 * 86400000).toISOString(),
    branding: {
      primaryColor: "#7C3AED",
      supportPhone: "+91 98100 11111",
      supportEmail: "support@starvision.in",
      tagline: "Crystal-clear entertainment for your home",
    },
    adminEmail: "admin@starvision.in",
    adminPassword: "operator123",
  },
  {
    id: "op-2", code: "GTPL002",
    companyName: "GTPL Broadband",
    contactPerson: "Anita Desai",
    phone: "+91 98200 22222",
    email: "ops@gtpl.in",
    address: "44 Ring Road, Ahmedabad, GJ 380001",
    gst: "24FGHIJ5678K2L9",
    plan: "Enterprise", status: "active",
    createdAt: new Date(Date.now() - 460 * 86400000).toISOString(),
    branding: {
      primaryColor: "#0EA5E9",
      supportPhone: "+91 98200 22222",
      supportEmail: "support@gtpl.in",
      tagline: "Bringing more to every screen",
    },
    adminEmail: "admin@gtpl.in",
    adminPassword: "operator123",
  },
  {
    id: "op-3", code: "SKY003",
    companyName: "SkyLine TV",
    contactPerson: "Vikram Singh",
    phone: "+91 98300 33333",
    email: "hello@skylinetv.in",
    address: "8 Park Street, Kolkata, WB 700016",
    gst: "19MNOPQ9012R3S4",
    plan: "Starter", status: "active",
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    branding: {
      primaryColor: "#F43F5E",
      supportPhone: "+91 98300 33333",
      supportEmail: "support@skylinetv.in",
      tagline: "Your neighbourhood cable, simplified",
    },
    adminEmail: "admin@skylinetv.in",
    adminPassword: "operator123",
  },
  {
    id: "op-4", code: "VSN004",
    companyName: "VisionNet Cable",
    contactPerson: "Karan Mehta",
    phone: "+91 98400 44444",
    email: "info@visionnet.in",
    address: "27 Sector 17, Chandigarh 160017",
    gst: "04TUVWX3456Y7Z8",
    plan: "Growth", status: "inactive",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    branding: {
      primaryColor: "#10B981",
      supportPhone: "+91 98400 44444",
      supportEmail: "support@visionnet.in",
    },
    adminEmail: "admin@visionnet.in",
    adminPassword: "operator123",
  },
];

export const AREAS_BY_OPERATOR: Record<string, string[]> = {
  "op-1": ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar"],
  "op-2": ["Navrangpura", "Satellite", "Bopal", "Vastrapur"],
  "op-3": ["Salt Lake", "Park Street", "Howrah", "Garia"],
  "op-4": ["Sector 17", "Sector 22", "Sector 35", "Manimajra"],
};

const PACK_TEMPLATES = [
  { name: "Basic SD", desc: "Essential entertainment & news", channels: 120, m: 199, type: "SD" as const },
  { name: "Family HD", desc: "Best for families — HD quality", channels: 220, m: 399, type: "HD" as const, popular: true },
  { name: "Sports HD", desc: "Live sports & premium HD channels", channels: 280, m: 549, type: "HD" as const },
  { name: "Premium All-Access", desc: "Everything — movies, sports, regional", channels: 380, m: 799, type: "HD" as const },
];

export const PACKS: Pack[] = OPERATORS.flatMap(op =>
  PACK_TEMPLATES.map((t, i) => ({
    id: `${op.id}-p${i + 1}`,
    operator_id: op.id,
    name: t.name,
    description: t.desc,
    channels: t.channels,
    monthly: t.m,
    quarterly: Math.round(t.m * 2.75),
    halfYearly: Math.round(t.m * 5),
    yearly: Math.round(t.m * 9),
    type: t.type,
    active: true,
    popular: t.popular,
  }))
);

const NAMES = ["Rahul Sharma","Priya Patel","Amit Kumar","Sneha Reddy","Vikram Singh","Anita Das","Karan Mehta","Divya Iyer","Manish Gupta","Neha Joshi"];

export const SUBSCRIBERS: Subscriber[] = OPERATORS.flatMap((op, opIdx) => {
  const areas = AREAS_BY_OPERATOR[op.id];
  const opPacks = PACKS.filter(p => p.operator_id === op.id);
  const count = [12, 16, 8, 5][opIdx];
  return Array.from({ length: count }).map((_, i) => {
    const pack = opPacks[i % opPacks.length];
    const daysToExpiry = (i * 3) - 8;
    // First subscriber of op-1 gets the demo credentials
    const isDemo = op.id === "op-1" && i === 0;
    const phone = isDemo ? "9810000000" : `9${String(800000000 + opIdx * 100000 + i * 137).slice(0, 9)}`;
    return {
      id: `${op.id}-s${i + 1}`,
      operator_id: op.id,
      name: `${NAMES[i % NAMES.length]}`,
      phone,
      password: isDemo ? "subscriber123" : "subscriber123",
      email: `user${opIdx}${i + 1}@example.com`,
      address: `${10 + i}, ${areas[i % areas.length]} Main Road`,
      area: areas[i % areas.length],
      stbId: `STB${op.code}${String(1000 + i).padStart(5, "0")}`,
      installDate: new Date(Date.now() - (200 + i * 7) * 86400000).toISOString(),
      whatsapp: phone,
      notes: "",
      status: i % 7 === 0 && !isDemo ? "inactive" : "active",
      packId: pack.id,
      expiry: new Date(Date.now() + daysToExpiry * 86400000).toISOString(),
    };
  });
});

export const CUSTOM_PRICES: CustomPrice[] = SUBSCRIBERS
  .filter((_, i) => i % 5 === 0)
  .map((s, i) => {
    const pack = PACKS.find(p => p.id === s.packId)!;
    return {
      id: `cp-${i + 1}`,
      operator_id: s.operator_id,
      subscriber_id: s.id,
      pack_id: pack.id,
      price: Math.round(pack.monthly * 0.85),
      validityDays: 30,
    };
  });

export const RECHARGES: Recharge[] = SUBSCRIBERS.flatMap((s, idx) =>
  Array.from({ length: (idx % 3) + 1 }).map((_, j) => {
    const pack = PACKS.find(p => p.id === s.packId)!;
    const cp = CUSTOM_PRICES.find(c => c.subscriber_id === s.id && c.pack_id === pack.id);
    const ts = idx * 4 + j;
    return {
      id: `r-${s.id}-${j}`,
      operator_id: s.operator_id,
      subscriberId: s.id,
      subscriberName: s.name,
      packId: pack.id,
      packName: pack.name,
      amount: cp?.price ?? pack.monthly,
      method: (["UPI","Razorpay","Cash","Card"] as const)[ts % 4],
      date: new Date(Date.now() - ts * 86400000 * 2).toISOString(),
      expiry: new Date(Date.now() + (30 - ts) * 86400000).toISOString(),
      status: ts % 9 === 0 ? "pending" : ts % 13 === 0 ? "failed" : "success",
    };
  })
);

export const NOTIFICATIONS: AppNotification[] = SUBSCRIBERS.flatMap(s => ([
  { id: `n-${s.id}-1`, operator_id: s.operator_id, subscriber_id: s.id, title: "Recharge successful", body: "Your plan is active for the next 30 days.", type: "success" as const, date: new Date(Date.now() - 86400000).toISOString(), read: false },
  { id: `n-${s.id}-2`, operator_id: s.operator_id, subscriber_id: s.id, title: "Expiry reminder", body: "Your plan expires soon. Recharge to avoid disconnection.", type: "warning" as const, date: new Date(Date.now() - 86400000 * 2).toISOString(), read: false },
])).slice(0, 40);

export const REVENUE_DATA = [
  { month: "Jan", revenue: 124000, subscribers: 180 },
  { month: "Feb", revenue: 138000, subscribers: 195 },
  { month: "Mar", revenue: 142000, subscribers: 210 },
  { month: "Apr", revenue: 156000, subscribers: 228 },
  { month: "May", revenue: 168000, subscribers: 245 },
  { month: "Jun", revenue: 184000, subscribers: 268 },
  { month: "Jul", revenue: 192000, subscribers: 282 },
  { month: "Aug", revenue: 208000, subscribers: 301 },
];

// =================================================================
// TENANT-ISOLATED ACCESSORS — use these in routes, NOT direct arrays
// =================================================================

export const getOperatorById = (id: string) => OPERATORS.find(o => o.id === id);
export const getOperatorByCode = (code: string) =>
  OPERATORS.find(o => o.code.toLowerCase() === code.toLowerCase());

export const getPacksByOperator = (operatorId: string) =>
  PACKS.filter(p => p.operator_id === operatorId);

export const getSubscribersByOperator = (operatorId: string) =>
  SUBSCRIBERS.filter(s => s.operator_id === operatorId);

export const getRechargesByOperator = (operatorId: string) =>
  RECHARGES.filter(r => r.operator_id === operatorId);

export const getCustomPricesByOperator = (operatorId: string) =>
  CUSTOM_PRICES.filter(c => c.operator_id === operatorId);

export const getCustomPriceFor = (operatorId: string, subscriberId: string, packId: string) =>
  CUSTOM_PRICES.find(c =>
    c.operator_id === operatorId &&
    c.subscriber_id === subscriberId &&
    c.pack_id === packId);

export const getSubscriberById = (operatorId: string, subscriberId: string) =>
  SUBSCRIBERS.find(s => s.operator_id === operatorId && s.id === subscriberId);

export const getRechargesForSubscriber = (operatorId: string, subscriberId: string) =>
  RECHARGES.filter(r => r.operator_id === operatorId && r.subscriberId === subscriberId);

export const getNotificationsForSubscriber = (operatorId: string, subscriberId: string) =>
  NOTIFICATIONS.filter(n =>
    n.operator_id === operatorId &&
    (!n.subscriber_id || n.subscriber_id === subscriberId));

// =================================================================
// HELPERS
// =================================================================

export const generateOperatorCode = (companyName: string): string => {
  const prefix = companyName.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "OPR";
  const existing = OPERATORS.filter(o => o.code.startsWith(prefix)).length;
  return `${prefix}${String(existing + 1).padStart(3, "0")}`;
};

export const generatePassword = () =>
  Math.random().toString(36).slice(2, 10);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const daysBetween = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);

// =================================================================
// SUPER ADMIN AGGREGATIONS
// =================================================================

export const platformStats = () => ({
  totalOperators: OPERATORS.length,
  activeOperators: OPERATORS.filter(o => o.status === "active").length,
  totalSubscribers: SUBSCRIBERS.length,
  totalRevenue: RECHARGES.filter(r => r.status === "success").reduce((a, r) => a + r.amount, 0),
  pendingPayments: RECHARGES.filter(r => r.status === "pending").length,
});
