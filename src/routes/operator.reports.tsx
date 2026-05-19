import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { BarChart3, Wallet, Users, Receipt } from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts";
import { useAuth } from "@/lib/auth";
import {
  getRechargesByOperator, getSubscribersByOperator, getPacksByOperator,
  REVENUE_DATA, formatINR,
} from "@/lib/mock-data";

export const Route = createFileRoute("/operator/reports")({
  head: () => ({ meta: [{ title: "Reports" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const opId = user!.operator_id!;
  const subs = getSubscribersByOperator(opId);
  const packs = getPacksByOperator(opId);
  const recharges = getRechargesByOperator(opId);

  const colors = ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)"];

  const packDist = packs.map(p => ({ name: p.name, value: subs.filter(s => s.packId === p.id).length }));
  const areaBuckets = subs.reduce<Record<string, number>>((acc, s) => { acc[s.area] = (acc[s.area] ?? 0) + 1; return acc; }, {});
  const areaData = Object.entries(areaBuckets).map(([name, count]) => ({ name, count }));
  const methodBuckets = recharges.reduce<Record<string, number>>((acc, r) => { acc[r.method] = (acc[r.method] ?? 0) + r.amount; return acc; }, {});
  const methodData = Object.entries(methodBuckets).map(([name, value]) => ({ name, value }));

  const collected = recharges.filter(r => r.status === "success").reduce((a, r) => a + r.amount, 0);
  const arpu = subs.length ? Math.round(collected / subs.length) : 0;

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Visualise revenue, plans and area performance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Collected" value={formatINR(collected)} icon={<Wallet className="w-5 h-5" />} trend={{ value: "+11%", up: true }} />
        <StatCard label="ARPU" value={formatINR(arpu)} icon={<BarChart3 className="w-5 h-5" />} delay={0.05} />
        <StatCard label="Subscribers" value={subs.length} icon={<Users className="w-5 h-5" />} delay={0.1} />
        <StatCard label="Recharges" value={recharges.length} icon={<Receipt className="w-5 h-5" />} delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Revenue & subscribers</h3>
          <p className="text-xs text-muted-foreground mb-3">Trailing 8 months</p>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#r1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Pack distribution</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={packDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {packDist.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Subscribers by area</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="count" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Collection by payment method</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <BarChart data={methodData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={70} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v: number) => formatINR(v)} />
                <Bar dataKey="value" fill="var(--chart-4)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
