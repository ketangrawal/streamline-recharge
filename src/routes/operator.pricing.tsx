import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Wallet, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import {
  getCustomPricesByOperator, getPacksByOperator, getSubscribersByOperator,
  formatINR, type CustomPrice,
} from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/operator/pricing")({
  head: () => ({ meta: [{ title: "Custom Pricing" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const opId = user!.operator_id!;
  const subs = getSubscribersByOperator(opId);
  const packs = getPacksByOperator(opId);
  const [list, setList] = useState<CustomPrice[]>(() => getCustomPricesByOperator(opId));
  const [open, setOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<CustomPrice | null>(null);

  return (
    <div>
      <PageHeader title="Custom Pricing" subtitle="Set special prices for individual subscribers"
        action={<Button onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <Plus className="w-4 h-4 mr-1.5" /> Add Override
        </Button>} />

      {list.length === 0 ? (
        <EmptyState icon={<Wallet className="w-5 h-5" />} title="No custom prices yet"
          description="Subscribers will be billed at standard pack rates until you add an override." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>{["Subscriber", "Pack", "Standard Price", "Custom Price", "Validity", ""].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {list.map(cp => {
                const sub = subs.find(s => s.id === cp.subscriber_id);
                const pack = packs.find(p => p.id === cp.pack_id);
                const discount = pack ? Math.round((1 - cp.price / pack.monthly) * 100) : 0;
                return (
                  <tr key={cp.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{sub?.name ?? "—"}</td>
                    <td className="px-5 py-3">{pack?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground line-through">{formatINR(pack?.monthly ?? 0)}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold">{formatINR(cp.price)}</span>
                      {discount > 0 && <span className="ml-2 text-xs text-success">-{discount}%</span>}
                    </td>
                    <td className="px-5 py-3">{cp.validityDays} days</td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDel(cp)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddDialog open={open} setOpen={setOpen} operatorId={opId} subs={subs} packs={packs}
        onSave={cp => { setList(prev => [cp, ...prev]); toast.success("Custom price added"); setOpen(false); }} />
      <ConfirmDialog
        open={!!confirmDel} onOpenChange={v => !v && setConfirmDel(null)}
        title="Remove override?" description="Subscriber will revert to standard pack pricing." destructive confirmLabel="Remove"
        onConfirm={() => {
          if (confirmDel) { setList(prev => prev.filter(x => x.id !== confirmDel.id)); toast.success("Removed"); }
          setConfirmDel(null);
        }}
      />
    </div>
  );
}

function AddDialog({
  open, setOpen, operatorId, subs, packs, onSave,
}: {
  open: boolean; setOpen: (v: boolean) => void; operatorId: string;
  subs: ReturnType<typeof getSubscribersByOperator>; packs: ReturnType<typeof getPacksByOperator>;
  onSave: (cp: CustomPrice) => void;
}) {
  const [subId, setSubId] = useState(subs[0]?.id ?? "");
  const [packId, setPackId] = useState(packs[0]?.id ?? "");
  const [price, setPrice] = useState(packs[0]?.monthly ?? 0);
  const [days, setDays] = useState(30);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subId || !packId) { toast.error("Select subscriber and pack"); return; }
    onSave({
      id: `cp-${Date.now()}`, operator_id: operatorId,
      subscriber_id: subId, pack_id: packId, price: Number(price), validityDays: Number(days),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add custom price</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Subscriber</Label>
            <Select value={subId} onValueChange={setSubId}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select subscriber" /></SelectTrigger>
              <SelectContent>{subs.map(s => <SelectItem key={s.id} value={s.id}>{s.name} · {s.phone}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Pack</Label>
            <Select value={packId} onValueChange={v => { setPackId(v); const p = packs.find(x => x.id === v); if (p) setPrice(p.monthly); }}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{packs.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({formatINR(p.monthly)})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Custom price ₹</Label>
              <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Validity (days)</Label>
              <Input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="h-10 rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
