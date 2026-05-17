import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wallet, Save } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBSCRIBERS, PACKS, formatINR } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pricing")({
  head: () => ({ meta: [{ title: "Custom Pricing — CableHub" }] }),
  component: PricingPage,
});

function PricingPage() {
  const [subId, setSubId] = useState(SUBSCRIBERS[0].id);
  const [packId, setPackId] = useState(SUBSCRIBERS[0].packId);
  const [price, setPrice] = useState("");
  const [validity, setValidity] = useState("30");

  const sub = useMemo(() => SUBSCRIBERS.find(s => s.id === subId)!, [subId]);
  const pack = useMemo(() => PACKS.find(p => p.id === packId)!, [packId]);
  const base = pack.monthly;
  const custom = Number(price) || 0;
  const discount = base > 0 && custom > 0 ? Math.round((1 - custom / base) * 100) : 0;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custom) { toast.error("Enter a custom price"); return; }
    toast.success(`Custom pricing saved for ${sub.name}`);
  };

  return (
    <div>
      <PageHeader title="Custom Pricing" subtitle="Set per-subscriber pricing overrides"/>
      <div className="grid lg:grid-cols-3 gap-4">
        <form onSubmit={save} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Subscriber">
              <Select value={subId} onValueChange={setSubId}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
                <SelectContent>{SUBSCRIBERS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — {s.phone}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Pack">
              <Select value={packId} onValueChange={setPackId}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
                <SelectContent>{PACKS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Custom price (₹)">
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={String(base)} className="h-10 rounded-xl"/>
            </Field>
            <Field label="Validity (days)">
              <Input type="number" value={validity} onChange={e => setValidity(e.target.value)} className="h-10 rounded-xl"/>
            </Field>
          </div>
          <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
            <Save className="w-4 h-4 mr-1.5"/> Save override
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow"><Wallet className="w-5 h-5"/></div>
            <div>
              <h3 className="font-display font-semibold">Override summary</h3>
              <p className="text-xs text-muted-foreground">Live preview</p>
            </div>
          </div>
          <dl className="space-y-2 text-sm">
            <Row k="Subscriber" v={sub.name}/>
            <Row k="Pack" v={pack.name}/>
            <Row k="Base price" v={formatINR(base)}/>
            <Row k="Custom price" v={custom ? formatINR(custom) : "—"} accent/>
            <Row k="Discount" v={`${discount}%`}/>
            <Row k="Validity" v={`${validity} days`}/>
          </dl>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={`font-medium ${accent ? "text-primary" : ""}`}>{v}</dd>
    </div>
  );
}
