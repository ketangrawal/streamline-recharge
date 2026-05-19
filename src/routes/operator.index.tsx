import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { Users, Package, Wallet, AlertTriangle, ArrowUpRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import { useAuth } from "@/lib/auth";
import {
  getSubscribersByOperator, getPacksByOperator, getRechargesByOperator,
  formatINR, daysBetween, REVENUE_DATA,
} from "@/lib/mock-data";

export const Route = createFileRoute("/operator/")({
  head: () => ({ meta: [{ title: "Operator Dashboard" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const opId = user!.operator_id!;
  const subs = getSubscribersByOperator(opId);
  const packs = getPacksByOperator(opId);
  const recharges = getRechargesByOperator(opId);

  const active = subs.filter(s => s.status === "active").length;
  const expiringSoon = subs.filter(s => { const d = daysBetween(s.expiry); return d <= 7 && d >= 0; }).length;
  const monthRev = recharges
    .filter(r => r.status === "success" && new Date(r.date).getMonth() === new Date().getMonth())
    .reduce((a, r) => a + r.amount, 0);

  const packPop = packs.map(p => ({ name: p.name.split(" ")[0], subs: subs.filter(s => s.packId === p.id).length }));
  const recent = [...recharges].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 6);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user!.name.split(" ")[0]}`}
        subtitle="Your network at a glance"
        action={<Button asChild className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <Link to="/operator/subscribers">Manage subscribers <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
        </Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Subscribers" value={subs.length} icon={<Users className="w-5 h-5" />} trend={{ value: `${active} active`, up: true }} />
        <StatCard label="Active Packs" value={packs.filter(p => p.active).length} icon={<Package className="w-5 h-5" />} delay={0.05} />
        <StatCard label="This Month" value={formatINR(monthRev)} icon={<Wallet className="w-5 h-5" />} trend={{ value: "+12%", up: true }} delay={0.1} />
        <StatCard label="Expiring (7d)" value={expiringSoon} icon={<AlertTriangle className="w-5 h-5" />} delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Revenue trend</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 8 months</p>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="opRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#opRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Plan popularity</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={packPop}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="subs" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold inline-flex items-center gap-2"><Receipt className="w-4 h-4" /> Recent recharges</h3>
            <p className="text-xs text-muted-foreground">Latest activity from your network</p>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/operator/recharges">View all</Link></Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>{["Subscriber", "Pack", "Amount", "Method", "Status", "Date"].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{r.subscriberName}</td>
                  <td className="px-5 py-3">{r.packName}</td>
                  <td className="px-5 py-3">{formatINR(r.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.method}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "success" ? "bg-success/15 text-success" : r.status === "pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
