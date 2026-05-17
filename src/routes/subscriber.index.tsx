import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, Tv, Wallet, CheckCircle2, ArrowRight, Bell } from "lucide-react";
import {
  getSubscriberById, getPacksByOperator, getRechargesForSubscriber,
  getNotificationsForSubscriber, getCustomPriceFor, formatINR, daysBetween,
} from "@/lib/mock-data";
import { readSession } from "@/lib/auth";

export const Route = createFileRoute("/subscriber/")({
  head: () => ({ meta: [{ title: "My Dashboard" }] }),
  component: SubHome,
});

function SubHome() {
  const u = readSession()!;
  const me = getSubscriberById(u.operator_id!, u.id)!;
  const pack = getPacksByOperator(u.operator_id!).find(p => p.id === me.packId)!;
  const remaining = daysBetween(me.expiry);
  const total = 30;
  const myRecharges = getRechargesForSubscriber(u.operator_id!, me.id).slice(0, 5);
  const cp = getCustomPriceFor(u.operator_id!, me.id, pack.id);
  const price = cp?.price ?? pack.monthly;
  const notifs = getNotificationsForSubscriber(u.operator_id!, me.id).slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${me.name.split(" ")[0]}`}
        subtitle="Here's a snapshot of your cable subscription"
        action={<Button asChild className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"><Link to="/subscriber/packs">Recharge now <ArrowRight className="w-4 h-4 ml-1"/></Link></Button>}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-primary text-primary-foreground p-6 lg:p-8 shadow-elevate mb-6"
      >
        <div className="absolute inset-0 bg-gradient-mesh opacity-40"/>
        <div className="relative flex flex-wrap items-center gap-6 justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80">Current plan</div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display mt-1">{pack.name}</h2>
            <p className="opacity-90 mt-1">{pack.channels} channels • {pack.type}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span>STB ID: <span className="font-semibold">{me.stbId}</span></span>
              <span>Phone: <span className="font-semibold">{me.phone}</span></span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest opacity-80">Days remaining</div>
            <div className="text-5xl font-bold font-display mt-1">{Math.max(0, remaining)}</div>
            <div className="text-xs opacity-80 mt-1">Expires {new Date(me.expiry).toLocaleDateString()}</div>
            <Progress value={Math.max(5, (remaining / total) * 100)} className="mt-3 w-48 bg-primary-foreground/20"/>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Current Price" value={formatINR(price)} icon={<Wallet className="w-5 h-5"/>} trend={cp ? { value: `Custom (was ${formatINR(pack.monthly)})`, up: true } : undefined}/>
        <StatCard label="Channels" value={pack.channels} icon={<Tv className="w-5 h-5"/>}/>
        <StatCard label="Status" value={<StatusBadge status={me.status}/>} icon={<CheckCircle2 className="w-5 h-5"/>}/>
        <StatCard label="Last Recharge" value={myRecharges[0] ? new Date(myRecharges[0].date).toLocaleDateString() : "—"} icon={<CalendarClock className="w-5 h-5"/>}/>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold">Recharge history</h3>
              <p className="text-xs text-muted-foreground">Your recent transactions</p>
            </div>
            <Button asChild variant="outline" size="sm"><Link to="/subscriber/recharges">View all</Link></Button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr><th className="text-left px-5 py-3 font-medium">Pack</th><th className="text-left px-5 py-3 font-medium">Amount</th><th className="text-left px-5 py-3 font-medium">Date</th><th className="text-left px-5 py-3 font-medium">Status</th></tr>
            </thead>
            <tbody>
              {myRecharges.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No recharges yet</td></tr>}
              {myRecharges.map(r => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{r.packName}</td>
                  <td className="px-5 py-3">{formatINR(r.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold inline-flex items-center gap-2"><Bell className="w-4 h-4"/>Notifications</h3>
            <Button asChild variant="ghost" size="sm"><Link to="/subscriber/notifications">All</Link></Button>
          </div>
          <ul className="space-y-3">
            {notifs.length === 0 && <li className="text-sm text-muted-foreground">No notifications.</li>}
            {notifs.map(n => (
              <li key={n.id} className="flex gap-3 text-sm">
                <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  n.type === "success" ? "bg-success" : n.type === "warning" ? "bg-warning" : n.type === "error" ? "bg-destructive" : "bg-primary"
                }`}/>
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
