import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Wallet, AlertTriangle, Clock, Receipt, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { SUBSCRIBERS, RECHARGES, REVENUE_DATA, PLAN_POPULARITY, formatINR, daysBetween } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — CableHub" }] }),
  component: AdminHome,
});

function AdminHome() {
  const active = SUBSCRIBERS.filter(s => s.status === "active").length;
  const inactive = SUBSCRIBERS.length - active;
  const expiring = SUBSCRIBERS.filter(s => {
    const d = daysBetween(s.expiry);
    return d >= 0 && d <= 7;
  }).length;
  const pending = RECHARGES.filter(r => r.status === "pending").length;
  const monthlyRev = RECHARGES.filter(r => r.status === "success").reduce((a, r) => a + r.amount, 0);

  const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your cable operation"
        action={
          <Button asChild className="bg-gradient-primary border-0 text-primary-foreground shadow-glow">
            <Link to="/admin/recharges">New Recharge</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Subscribers" value={SUBSCRIBERS.length} icon={<Users className="w-5 h-5" />} trend={{ value: "+12% MoM", up: true }} delay={0.05} />
        <StatCard label="Active" value={active} icon={<UserCheck className="w-5 h-5" />} trend={{ value: "+8% MoM", up: true }} delay={0.1} />
        <StatCard label="Inactive" value={inactive} icon={<UserX className="w-5 h-5" />} trend={{ value: "-3% MoM", up: false }} delay={0.15} />
        <StatCard label="Monthly Revenue" value={formatINR(monthlyRev)} icon={<Wallet className="w-5 h-5" />} trend={{ value: "+18% MoM", up: true }} delay={0.2} />
        <StatCard label="Expiring (7d)" value={expiring} icon={<AlertTriangle className="w-5 h-5" />} delay={0.25} />
        <StatCard label="Pending Recharges" value={pending} icon={<Clock className="w-5 h-5" />} delay={0.3} />
        <StatCard label="Recharges (mo)" value={RECHARGES.length} icon={<Receipt className="w-5 h-5" />} delay={0.35} />
        <StatCard label="Avg ARPU" value={formatINR(Math.round(monthlyRev / Math.max(active, 1)))} icon={<ArrowUpRight className="w-5 h-5" />} delay={0.4} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Revenue & Subscribers</h3>
              <p className="text-xs text-muted-foreground">Last 8 months</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false}/>
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12}/>
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12}/>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#rev)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Plan Popularity</h3>
          <p className="text-xs text-muted-foreground">Subscribers per pack</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PLAN_POPULARITY} dataKey="subs" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {PLAN_POPULARITY.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
                <Legend wrapperStyle={{ fontSize: 11 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <div>
            <h3 className="font-display font-semibold">Recent Transactions</h3>
            <p className="text-xs text-muted-foreground">Latest recharges across all areas</p>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/admin/recharges">View all</Link></Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Subscriber</th>
                <th className="text-left px-5 py-3 font-medium">Pack</th>
                <th className="text-left px-5 py-3 font-medium">Method</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECHARGES.slice(0, 6).map(r => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{r.subscriberName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.packName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.method}</td>
                  <td className="px-5 py-3 font-semibold">{formatINR(r.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
