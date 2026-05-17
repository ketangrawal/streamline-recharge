import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { Wallet, Users, TrendingUp, MapPin } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { REVENUE_DATA, PLAN_POPULARITY, AREAS, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports & Analytics — CableHub" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const areaData = AREAS.map((a, i) => ({ area: a, collection: 18000 + i * 4200 + (i % 2) * 3000 }));
  const expiryBuckets = [
    { range: "Today", count: 4 }, { range: "1-3d", count: 11 },
    { range: "4-7d", count: 22 }, { range: "8-14d", count: 35 },
    { range: "15-30d", count: 58 },
  ];

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Performance, growth, and collection insights"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={formatINR(REVENUE_DATA.reduce((a, b) => a + b.revenue, 0))} icon={<Wallet className="w-5 h-5"/>} trend={{ value: "+22% YoY", up: true }}/>
        <StatCard label="Subscribers Added" value="+121" icon={<Users className="w-5 h-5"/>} trend={{ value: "+9%", up: true }}/>
        <StatCard label="Avg Growth/mo" value="14%" icon={<TrendingUp className="w-5 h-5"/>}/>
        <StatCard label="Top Area" value="Greenfield" icon={<MapPin className="w-5 h-5"/>}/>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Monthly Revenue" sub="₹ over time">
          <ResponsiveContainer>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="r2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false}/>
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12}/>
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12}/>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
              <Area type="monotone" dataKey="revenue" stroke="var(--chart-2)" fill="url(#r2)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Subscriber Growth" sub="Active subscribers per month">
          <ResponsiveContainer>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false}/>
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12}/>
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12}/>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
              <Bar dataKey="subscribers" fill="var(--chart-1)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Area-wise Collection" sub="₹ collected this month">
          <ResponsiveContainer>
            <BarChart data={areaData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false}/>
              <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12}/>
              <YAxis dataKey="area" type="category" stroke="var(--color-muted-foreground)" fontSize={12} width={90}/>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
              <Bar dataKey="collection" fill="var(--chart-3)" radius={[0,6,6,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Expiry Distribution" sub="Subscribers by days remaining">
          <ResponsiveContainer>
            <BarChart data={expiryBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false}/>
              <XAxis dataKey="range" stroke="var(--color-muted-foreground)" fontSize={12}/>
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12}/>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }}/>
              <Bar dataKey="count" fill="var(--chart-4)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3">
        <h3 className="font-display font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}
