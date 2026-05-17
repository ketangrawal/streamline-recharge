export type Pack = {
  id: string;
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
  name: string;
  phone: string;
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
  customPrice?: number;
};

export type Recharge = {
  id: string;
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
  title: string;
  body: string;
  type: "success" | "warning" | "info" | "error";
  date: string;
  read: boolean;
};

export const PACKS: Pack[] = [
  {
    id: "p1", name: "Basic SD", description: "Essential entertainment & news",
    channels: 120, monthly: 199, quarterly: 549, halfYearly: 999, yearly: 1799,
    type: "SD", active: true,
  },
  {
    id: "p2", name: "Family HD", description: "Best for families — HD quality",
    channels: 220, monthly: 399, quarterly: 1099, halfYearly: 1999, yearly: 3599,
    type: "HD", active: true, popular: true,
  },
  {
    id: "p3", name: "Sports HD", description: "Live sports & premium HD channels",
    channels: 280, monthly: 549, quarterly: 1499, halfYearly: 2799, yearly: 4999,
    type: "HD", active: true,
  },
  {
    id: "p4", name: "Premium All-Access", description: "Everything — movies, sports, regional",
    channels: 380, monthly: 799, quarterly: 2199, halfYearly: 3999, yearly: 7199,
    type: "HD", active: true,
  },
];

export const AREAS = ["Sector 12", "Sector 18", "Greenfield", "Lakeview", "Old Town", "Riverside"];

export const SUBSCRIBERS: Subscriber[] = Array.from({ length: 24 }).map((_, i) => {
  const pack = PACKS[i % PACKS.length];
  const daysToExpiry = (i * 3) - 10;
  const expiry = new Date(Date.now() + daysToExpiry * 86400000).toISOString();
  return {
    id: `s${i + 1}`,
    name: ["Rahul Sharma","Priya Patel","Amit Kumar","Sneha Reddy","Vikram Singh","Anita Das","Karan Mehta","Divya Iyer"][i % 8] + ` ${i + 1}`,
    phone: `98${String(10000000 + i * 137).slice(0, 8)}`,
    email: `user${i + 1}@example.com`,
    address: `${10 + i}, Main Road`,
    area: AREAS[i % AREAS.length],
    stbId: `STB${100000 + i}`,
    installDate: new Date(Date.now() - (200 + i * 7) * 86400000).toISOString(),
    whatsapp: `98${String(10000000 + i * 137).slice(0, 8)}`,
    notes: "",
    status: i % 7 === 0 ? "inactive" : "active",
    packId: pack.id,
    expiry,
    customPrice: i % 5 === 0 ? Math.round(pack.monthly * 0.85) : undefined,
  };
});

export const RECHARGES: Recharge[] = Array.from({ length: 18 }).map((_, i) => {
  const sub = SUBSCRIBERS[i % SUBSCRIBERS.length];
  const pack = PACKS.find(p => p.id === sub.packId)!;
  return {
    id: `r${i + 1}`,
    subscriberId: sub.id,
    subscriberName: sub.name,
    packId: pack.id,
    packName: pack.name,
    amount: sub.customPrice ?? pack.monthly,
    method: (["UPI","Razorpay","Cash","Card"] as const)[i % 4],
    date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    expiry: new Date(Date.now() + (30 - i) * 86400000).toISOString(),
    status: i % 8 === 0 ? "pending" : i % 11 === 0 ? "failed" : "success",
  };
});

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "Recharge successful", body: "Your Family HD plan is active until next month.", type: "success", date: new Date().toISOString(), read: false },
  { id: "n2", title: "Expiry reminder", body: "Your plan expires in 3 days. Recharge to avoid disconnection.", type: "warning", date: new Date(Date.now() - 86400000).toISOString(), read: false },
  { id: "n3", title: "Payment failed", body: "Last UPI attempt failed. Please retry.", type: "error", date: new Date(Date.now() - 86400000 * 2).toISOString(), read: true },
  { id: "n4", title: "Plan activated", body: "Welcome aboard! Premium All-Access is live.", type: "info", date: new Date(Date.now() - 86400000 * 5).toISOString(), read: true },
];

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

export const PLAN_POPULARITY = PACKS.map((p, i) => ({
  name: p.name,
  subs: [42, 128, 76, 58][i] ?? 30,
}));

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const daysBetween = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
