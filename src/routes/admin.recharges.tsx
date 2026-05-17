import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RECHARGES, SUBSCRIBERS, PACKS, formatINR, type Recharge } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/recharges")({
  head: () => ({ meta: [{ title: "Recharges — CableHub" }] }),
  component: RechargesPage,
});

const DURATIONS = [
  { key: "monthly", label: "Monthly", mult: 1, days: 30 },
  { key: "quarterly", label: "Quarterly", mult: 3, days: 90 },
  { key: "halfYearly", label: "Half-yearly", mult: 6, days: 180 },
  { key: "yearly", label: "Yearly", mult: 12, days: 365 },
] as const;

function RechargesPage() {
  const navigate = useNavigate();
  const [list, setList] = useState<Recharge[]>(RECHARGES);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "success" | "pending" | "failed">("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => list.filter(r => {
    if (tab !== "all" && r.status !== tab) return false;
    if (q && !r.subscriberName.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [list, q, tab]);

  return (
    <div>
      <PageHeader title="Recharges" subtitle="Manual & online recharge history"
        action={<Button onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"><Plus className="w-4 h-4 mr-1.5"/>New Recharge</Button>}
      />

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-border">
          <Tabs value={tab} onValueChange={v => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative ml-auto min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search subscriber" className="pl-9 h-10 rounded-xl"/>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Subscriber","Pack","Method","Amount","Date","Expiry","Status",""].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{r.subscriberName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.packName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.method}</td>
                  <td className="px-5 py-3 font-semibold">{formatINR(r.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.expiry).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status}/></td>
                  <td className="px-5 py-3"><Button size="sm" variant="ghost"><Receipt className="w-4 h-4"/></Button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-16 text-center text-muted-foreground">No transactions.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <NewRechargeDialog open={open} setOpen={setOpen} onCreate={r => setList(prev => [r, ...prev])} navigate={navigate}/>
    </div>
  );
}

function NewRechargeDialog({ open, setOpen, onCreate, navigate }: {
  open: boolean; setOpen: (v: boolean) => void; onCreate: (r: Recharge) => void; navigate: ReturnType<typeof useNavigate>;
}) {
  const [subId, setSubId] = useState(SUBSCRIBERS[0].id);
  const [packId, setPackId] = useState(SUBSCRIBERS[0].packId);
  const [dur, setDur] = useState<typeof DURATIONS[number]["key"]>("monthly");
  const [method, setMethod] = useState<"UPI"|"Razorpay"|"Cash"|"Card">("UPI");

  const sub = SUBSCRIBERS.find(s => s.id === subId)!;
  const pack = PACKS.find(p => p.id === packId)!;
  const duration = DURATIONS.find(d => d.key === dur)!;
  const baseAmount = pack[dur] ?? pack.monthly * duration.mult;
  const amount = sub.customPrice ? Math.round(sub.customPrice * duration.mult) : baseAmount;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const rec: Recharge = {
      id: `r${Date.now()}`,
      subscriberId: sub.id, subscriberName: sub.name,
      packId: pack.id, packName: pack.name,
      amount, method,
      date: new Date().toISOString(),
      expiry: new Date(Date.now() + duration.days * 86400000).toISOString(),
      status: "success",
    };
    onCreate(rec);
    setOpen(false);
    toast.success("Recharge completed");
    if (method !== "Cash") navigate({ to: "/payment-success" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Recharge</DialogTitle>
          <DialogDescription>Create a manual or online recharge for a subscriber.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Subscriber">
            <Select value={subId} onValueChange={setSubId}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
              <SelectContent>{SUBSCRIBERS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — {s.phone}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pack">
              <Select value={packId} onValueChange={setPackId}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
                <SelectContent>{PACKS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Duration">
              <Select value={dur} onValueChange={v => setDur(v as any)}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
                <SelectContent>{DURATIONS.map(d => <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Payment method">
            <Select value={method} onValueChange={v => setMethod(v as any)}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
              <SelectContent>
                {["UPI","Razorpay","Cash","Card"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <div className="rounded-xl bg-muted/50 p-4 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Base price</span><span>{formatINR(baseAmount)}</span></div>
            {sub.customPrice && <div className="flex justify-between text-primary"><span>Custom override</span><span>{formatINR(amount)}</span></div>}
            <div className="flex justify-between font-semibold text-base pt-1 border-t border-border"><span>Total</span><span>{formatINR(amount)}</span></div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">Confirm Recharge</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
