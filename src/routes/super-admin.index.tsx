import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { Building2, Users, Wallet, Activity, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { OPERATORS, REVENUE_DATA, platformStats, formatINR, getSubscribersByOperator } from "@/lib/mock-data";

export const Route = createFileRoute("/super-admin/")({
  head: () => ({ meta: [{ title: "Platform Dashboard" }] }),
  component: Page,
});

function Page() {
  const s = platformStats();
  const colors = ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)"];
  const dist = OPERATORS.map(op => ({ name: op.code, subs: getSubscribersByOperator(op.id).length }));

  return (
    <div>
      <PageHeader title="Platform Dashboard" subtitle="Performance across all operators"
        action={<Button asChild className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"><Link to="/super-admin/operators">Manage operators <ArrowUpRight className="w-4 h-4 ml-1"/></Link></Button>}/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Operators" value={s.totalOperators} icon={<Building2 className="w-5 h-5"/>} trend={{ value: `${s.activeOperators} active`, up: true }}/>
        <StatCard label="Total Subscribers" value={s.totalSubscribers} icon={<Users className="w-5 h-5"/>} trend={{ value: "+18% MoM", up: true }}/>
        <StatCard label="Platform Revenue" value={formatINR(s.totalRevenue)} icon={<Wallet className="w-5 h-5"/>} trend={{ value: "+22% MoM", up: true }}/>
        <StatCard label="Pending Payments" value={s.pendingPayments} icon={<Activity className="w-5 h-5"/>}/>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Platform Revenue</h3>
          <p className="text-xs text-muted-foreground mb-3">Aggregated across operators</p>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={REVENUE_DATA}>
                <defs><linearGradient id="psa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                </linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false}/>
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12}/>
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12}/>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#psa)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Subscribers per Operator</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dist} dataKey="subs" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {dist.map((_, i) => <Cell key={i} fill={colors[i % colors.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
                <Legend wrapperStyle={{ fontSize: 11 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">Recent operator activity</h3>
            <p className="text-xs text-muted-foreground">Latest onboarded operators</p>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/super-admin/operators">All operators</Link></Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>{["Code","Company","Plan","Subscribers","Status","Joined"].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {OPERATORS.map(op => (
                <tr key={op.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs">{op.code}</td>
                  <td className="px-5 py-3 font-medium">{op.companyName}</td>
                  <td className="px-5 py-3">{op.plan}</td>
                  <td className="px-5 py-3">{getSubscribersByOperator(op.id).length}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${op.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{op.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(op.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
