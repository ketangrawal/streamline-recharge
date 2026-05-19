import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { getSubscribersByOperator, getPacksByOperator, type Subscriber, daysBetween } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/operator/subscribers")({
  head: () => ({ meta: [{ title: "Subscribers" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const opId = user!.operator_id!;
  const [list, setList] = useState<Subscriber[]>(() => getSubscribersByOperator(opId));
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Subscriber | null>(null);
  const [confirmDel, setConfirmDel] = useState<Subscriber | null>(null);
  const packs = getPacksByOperator(opId);

  const filtered = useMemo(() => list.filter(s => {
    const matchQ = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.phone.includes(q) || s.stbId.toLowerCase().includes(q.toLowerCase());
    const matchS = status === "all" || s.status === status;
    return matchQ && matchS;
  }), [list, q, status]);

  const onSave = (s: Subscriber) => {
    setList(prev => {
      const exists = prev.find(x => x.id === s.id);
      return exists ? prev.map(x => x.id === s.id ? s : x) : [s, ...prev];
    });
    toast.success(editing ? "Subscriber updated" : "Subscriber added");
    setOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Subscribers" subtitle={`${list.length} total · ${list.filter(s => s.status === "active").length} active`}
        action={<Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <Plus className="w-4 h-4 mr-1.5" /> Add Subscriber
        </Button>} />

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, STB…" className="pl-10 h-10 rounded-xl" />
        </div>
        <Select value={status} onValueChange={v => setStatus(v as typeof status)}>
          <SelectTrigger className="w-40 h-10 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="w-5 h-5" />} title="No subscribers found" description="Adjust filters or add a new subscriber." />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>{["Subscriber", "STB ID", "Area", "Pack", "Expiry", "Status", ""].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const pack = packs.find(p => p.id === s.packId);
                const days = daysBetween(s.expiry);
                return (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.phone}</div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{s.stbId}</td>
                    <td className="px-5 py-3">{s.area}</td>
                    <td className="px-5 py-3">{pack?.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      <div className={days < 0 ? "text-destructive" : days <= 7 ? "text-warning" : ""}>
                        {new Date(s.expiry).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">{days < 0 ? `${-days}d overdue` : `${days}d left`}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${s.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDel(s)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <SubscriberDialog open={open} setOpen={setOpen} editing={editing} onSave={onSave} operatorId={opId} packs={packs} />
      <ConfirmDialog
        open={!!confirmDel}
        onOpenChange={v => !v && setConfirmDel(null)}
        title="Delete subscriber?"
        description={`${confirmDel?.name} will be removed permanently.`}
        confirmLabel="Delete" destructive
        onConfirm={() => {
          if (confirmDel) {
            setList(prev => prev.filter(x => x.id !== confirmDel.id));
            toast.success("Subscriber deleted");
          }
          setConfirmDel(null);
        }}
      />
    </div>
  );
}

function SubscriberDialog({
  open, setOpen, editing, onSave, operatorId, packs,
}: {
  open: boolean; setOpen: (v: boolean) => void;
  editing: Subscriber | null; onSave: (s: Subscriber) => void;
  operatorId: string; packs: ReturnType<typeof getPacksByOperator>;
}) {
  const [form, setForm] = useState<Partial<Subscriber>>(editing ?? {
    name: "", phone: "", email: "", address: "", area: "", stbId: "", packId: packs[0]?.id, status: "active",
  });

  // reset when editing changes
  useState(() => { setForm(editing ?? { name: "", phone: "", email: "", address: "", area: "", stbId: "", packId: packs[0]?.id, status: "active" }); });

  const u = <K extends keyof Subscriber>(k: K, v: Subscriber[K]) => setForm(p => ({ ...p, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error("Name and phone required"); return; }
    const id = editing?.id ?? `${operatorId}-s-${Date.now()}`;
    const s: Subscriber = {
      id, operator_id: operatorId,
      name: form.name!, phone: form.phone!, password: editing?.password ?? "subscriber123",
      email: form.email ?? "", address: form.address ?? "", area: form.area ?? "",
      stbId: form.stbId ?? `STB${Date.now().toString().slice(-6)}`,
      installDate: editing?.installDate ?? new Date().toISOString(),
      whatsapp: form.phone!, notes: editing?.notes ?? "",
      status: (form.status as Subscriber["status"]) ?? "active",
      packId: form.packId ?? packs[0]!.id,
      expiry: editing?.expiry ?? new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    onSave(s);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit subscriber" : "Add subscriber"}</DialogTitle>
          <DialogDescription>{editing ? "Update subscriber details" : "Credentials default to password: subscriber123"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          {([
            ["name", "Full name"], ["phone", "Phone"], ["email", "Email"],
            ["stbId", "STB ID"], ["area", "Area"], ["address", "Address"],
          ] as const).map(([k, l]) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-xs">{l}</Label>
              <Input value={(form[k] as string) ?? ""} onChange={e => u(k, e.target.value)} className="h-10 rounded-xl" />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label className="text-xs">Pack</Label>
            <Select value={form.packId} onValueChange={v => u("packId", v)}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{packs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={v => u("status", v as Subscriber["status"])}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">{editing ? "Save changes" : "Add subscriber"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
