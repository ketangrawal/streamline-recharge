import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Package as PackIcon, Pencil, Trash2, Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { getPacksByOperator, formatINR, type Pack } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/operator/packs")({
  head: () => ({ meta: [{ title: "Packs" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const opId = user!.operator_id!;
  const [list, setList] = useState<Pack[]>(() => getPacksByOperator(opId));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pack | null>(null);
  const [confirmDel, setConfirmDel] = useState<Pack | null>(null);

  const onSave = (p: Pack) => {
    setList(prev => {
      const exists = prev.find(x => x.id === p.id);
      return exists ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev];
    });
    toast.success(editing ? "Pack updated" : "Pack created");
    setOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Channel Packs" subtitle={`${list.length} packs · ${list.filter(p => p.active).length} active`}
        action={<Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <Plus className="w-4 h-4 mr-1.5" /> Create Pack
        </Button>} />

      {list.length === 0 ? (
        <EmptyState icon={<PackIcon className="w-5 h-5" />} title="No packs yet" description="Create your first channel pack to start onboarding subscribers." />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(p => (
            <div key={p.id} className={`relative rounded-2xl border ${p.popular ? "border-primary/40" : "border-border"} bg-card p-5 shadow-soft hover:shadow-elevate transition-shadow`}>
              {p.popular && <div className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-warning text-warning-foreground text-[10px] font-semibold inline-flex items-center gap-1"><Star className="w-3 h-3" /> POPULAR</div>}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.type} · {p.channels} channels</div>
                  <h3 className="font-display font-bold text-lg mt-1">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${p.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{p.active ? "active" : "off"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <Price label="Monthly" value={p.monthly} />
                <Price label="Quarterly" value={p.quarterly} />
                <Price label="Half-yearly" value={p.halfYearly} />
                <Price label="Yearly" value={p.yearly} />
              </div>
              <div className="mt-4 flex justify-end gap-1">
                <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDel(p)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PackDialog open={open} setOpen={setOpen} editing={editing} onSave={onSave} operatorId={opId} />
      <ConfirmDialog
        open={!!confirmDel} onOpenChange={v => !v && setConfirmDel(null)}
        title="Delete pack?" description={`${confirmDel?.name} will be removed.`} destructive confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDel) { setList(prev => prev.filter(x => x.id !== confirmDel.id)); toast.success("Pack deleted"); }
          setConfirmDel(null);
        }}
      />
    </div>
  );
}

function Price({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-muted/40 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display font-semibold mt-0.5">{formatINR(value)}</div>
    </div>
  );
}

function PackDialog({
  open, setOpen, editing, onSave, operatorId,
}: {
  open: boolean; setOpen: (v: boolean) => void;
  editing: Pack | null; onSave: (p: Pack) => void; operatorId: string;
}) {
  const [form, setForm] = useState<Partial<Pack>>(editing ?? {
    name: "", description: "", channels: 100, monthly: 199, quarterly: 549, halfYearly: 999, yearly: 1799,
    type: "SD", active: true, popular: false,
  });
  useState(() => { setForm(editing ?? { name: "", description: "", channels: 100, monthly: 199, quarterly: 549, halfYearly: 999, yearly: 1799, type: "SD", active: true, popular: false }); });
  const u = <K extends keyof Pack>(k: K, v: Pack[K]) => setForm(p => ({ ...p, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Name required"); return; }
    const id = editing?.id ?? `${operatorId}-p-${Date.now()}`;
    onSave({
      id, operator_id: operatorId,
      name: form.name!, description: form.description ?? "",
      channels: Number(form.channels) || 0,
      monthly: Number(form.monthly) || 0,
      quarterly: Number(form.quarterly) || 0,
      halfYearly: Number(form.halfYearly) || 0,
      yearly: Number(form.yearly) || 0,
      type: (form.type as Pack["type"]) ?? "SD",
      active: form.active ?? true,
      popular: form.popular ?? false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{editing ? "Edit pack" : "Create pack"}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs">Pack name</Label>
            <Input value={form.name ?? ""} onChange={e => u("name", e.target.value)} className="h-10 rounded-xl" />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description ?? ""} onChange={e => u("description", e.target.value)} className="rounded-xl" rows={2} />
          </div>
          {([
            ["channels", "Channels"], ["monthly", "Monthly ₹"], ["quarterly", "Quarterly ₹"],
            ["halfYearly", "Half-yearly ₹"], ["yearly", "Yearly ₹"],
          ] as const).map(([k, l]) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-xs">{l}</Label>
              <Input type="number" value={(form[k] as number) ?? 0} onChange={e => u(k, Number(e.target.value) as Pack[typeof k])} className="h-10 rounded-xl" />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={form.type} onValueChange={v => u("type", v as Pack["type"])}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SD">SD</SelectItem>
                <SelectItem value="HD">HD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.active} onCheckedChange={v => u("active", v)} /> Active</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.popular} onCheckedChange={v => u("popular", v)} /> Mark popular</label>
          </div>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
