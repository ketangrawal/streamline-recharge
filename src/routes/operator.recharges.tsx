import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Receipt, Download } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatCard } from "@/components/stat-card";
import { useAuth } from "@/lib/auth";
import {
  getRechargesByOperator, getSubscribersByOperator, getPacksByOperator,
  formatINR, type Recharge,
} from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/operator/recharges")({
  head: () => ({ meta: [{ title: "Recharges" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const opId = user!.operator_id!;
  const subs = getSubscribersByOperator(opId);
  const packs = getPacksByOperator(opId);
  const [list, setList] = useState<Recharge[]>(() => getRechargesByOperator(opId));
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Recharge["status"]>("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => list.filter(r => {
    const matchQ = !q || r.subscriberName.toLowerCase().includes(q.toLowerCase()) || r.packName.toLowerCase().includes(q.toLowerCase());
    const matchS = status === "all" || r.status === status;
    return matchQ && matchS;
  }), [list, q, status]);

  const totals = useMemo(() => ({
    total: list.length,
    revenue: list.filter(r => r.status === "success").reduce((a, r) => a + r.amount, 0),
    pending: list.filter(r => r.status === "pending").length,
    failed: list.filter(r => r.status === "failed").length,
  }), [list]);

  const exportCsv = () => {
    const rows = [["Date","Subscriber","Pack","Amount","Method","Status"]];
    list.forEach(r => rows.push([new Date(r.date).toLocaleDateString(), r.subscriberName, r.packName, String(r.amount), r.method, r.status]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "recharges.csv"; a.click();
    toast.success("Exported CSV");
  };

  return (
    <div>
      <PageHeader title="Recharges" subtitle="Manual & online transaction history"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}><Download className="w-4 h-4 mr-1.5" /> Export</Button>
            <Button onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
              <Plus className="w-4 h-4 mr-1.5" /> New Recharge
            </Button>
          </div>
        } />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Transactions" value={totals.total} icon={<Receipt className="w-5 h-5" />} />
        <StatCard label="Collected" value={formatINR(totals.revenue)} icon={<Receipt className="w-5 h-5" />} trend={{ value: "+8%", up: true }} delay={0.05} />
        <StatCard label="Pending" value={totals.pending} icon={<Receipt className="w-5 h-5" />} delay={0.1} />
        <StatCard label="Failed" value={totals.failed} icon={<Receipt className="w-5 h-5" />} delay={0.15} />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search subscriber or pack…" className="pl-10 h-10 rounded-xl" />
        </div>
        <Select value={status} onValueChange={v => setStatus(v as typeof status)}>
          <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Receipt className="w-5 h-5" />} title="No recharges" description="Recharges will appear here." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>{["Date","Subscriber","Pack","Amount","Method","Status","Expiry"].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-medium">{r.subscriberName}</td>
                  <td className="px-5 py-3">{r.packName}</td>
                  <td className="px-5 py-3 font-semibold">{formatINR(r.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.method}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "success" ? "bg-success/15 text-success" : r.status === "pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.expiry).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewRechargeDialog open={open} setOpen={setOpen} operatorId={opId} subs={subs} packs={packs}
        onSave={r => { setList(prev => [r, ...prev]); toast.success("Recharge recorded"); setOpen(false); }} />
    </div>
  );
}

function NewRechargeDialog({
  open, setOpen, operatorId, subs, packs, onSave,
}: {
  open: boolean; setOpen: (v: boolean) => void; operatorId: string;
  subs: ReturnType<typeof getSubscribersByOperator>;
  packs: ReturnType<typeof getPacksByOperator>;
  onSave: (r: Recharge) => void;
}) {
  const [subId, setSubId] = useState(subs[0]?.id ?? "");
  const [packId, setPackId] = useState(packs[0]?.id ?? "");
  const [amount, setAmount] = useState(packs[0]?.monthly ?? 0);
  const [method, setMethod] = useState<Recharge["method"]>("Cash");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subs.find(s => s.id === subId);
    const pack = packs.find(p => p.id === packId);
    if (!sub || !pack) { toast.error("Select subscriber and pack"); return; }
    onSave({
      id: `r-${Date.now()}`, operator_id: operatorId,
      subscriberId: sub.id, subscriberName: sub.name,
      packId: pack.id, packName: pack.name,
      amount: Number(amount), method,
      date: new Date().toISOString(),
      expiry: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "success",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>New manual recharge</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Subscriber</Label>
            <Select value={subId} onValueChange={setSubId}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{subs.map(s => <SelectItem key={s.id} value={s.id}>{s.name} · {s.phone}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Pack</Label>
            <Select value={packId} onValueChange={v => { setPackId(v); const p = packs.find(x => x.id === v); if (p) setAmount(p.monthly); }}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{packs.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({formatINR(p.monthly)})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Amount ₹</Label>
              <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Method</Label>
              <Select value={method} onValueChange={v => setMethod(v as Recharge["method"])}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Cash","UPI","Razorpay","Card"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">Record recharge</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
