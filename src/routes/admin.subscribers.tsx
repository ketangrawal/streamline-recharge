import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, MoreVertical, Edit, Receipt, Eye, Wallet, UserX, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SUBSCRIBERS, AREAS, PACKS, formatINR, daysBetween, type Subscriber } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subscribers")({
  head: () => ({ meta: [{ title: "Subscribers — CableHub" }] }),
  component: SubscribersPage,
});

function SubscribersPage() {
  const [list, setList] = useState<Subscriber[]>(SUBSCRIBERS);
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [pack, setPack] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<{ user: string; pwd: string } | null>(null);

  const filtered = useMemo(() => list.filter(s => {
    if (q && !`${s.name} ${s.phone} ${s.stbId}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (area !== "all" && s.area !== area) return false;
    if (status !== "all" && s.status !== status) return false;
    if (pack !== "all" && s.packId !== pack) return false;
    return true;
  }), [list, q, area, status, pack]);

  const toggleStatus = (id: string) => {
    setList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s));
    toast.success("Subscriber status updated");
  };

  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle={`${list.length} subscribers across ${AREAS.length} areas`}
        action={
          <Button onClick={() => { setCredentials(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
            <Plus className="w-4 h-4 mr-1.5"/> Add Subscriber
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 border-b border-border">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, STB ID..." className="pl-9 h-10 rounded-xl"/>
          </div>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Area"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All areas</SelectItem>
              {AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Status"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pack} onValueChange={setPack}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Pack"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All packs</SelectItem>
                {PACKS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Phone</th>
                <th className="text-left px-5 py-3 font-medium">STB ID</th>
                <th className="text-left px-5 py-3 font-medium">Pack</th>
                <th className="text-left px-5 py-3 font-medium">Expiry</th>
                <th className="text-left px-5 py-3 font-medium">Area</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const p = PACKS.find(p => p.id === s.packId)!;
                const d = daysBetween(s.expiry);
                return (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{s.phone}</td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{s.stbId}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{s.customPrice ? <span className="text-primary">{formatINR(s.customPrice)} (custom)</span> : formatINR(p.monthly)}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className={d < 0 ? "text-destructive font-medium" : d < 5 ? "text-warning-foreground font-medium" : ""}>
                        {new Date(s.expiry).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">{d < 0 ? `Expired ${Math.abs(d)}d ago` : `${d}d left`}</div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{s.area}</td>
                    <td className="px-5 py-3"><StatusBadge status={s.status}/></td>
                    <td className="px-5 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4"/></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2"/>View profile</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2"/>Edit</DropdownMenuItem>
                          <DropdownMenuItem><Receipt className="w-4 h-4 mr-2"/>Recharge</DropdownMenuItem>
                          <DropdownMenuItem><Wallet className="w-4 h-4 mr-2"/>Set custom pricing</DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem onClick={() => toggleStatus(s.id)}>
                            {s.status === "active" ? <><UserX className="w-4 h-4 mr-2"/>Deactivate</> : <><UserCheck className="w-4 h-4 mr-2"/>Reactivate</>}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-16 text-center text-muted-foreground">No subscribers match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddSubscriberDialog
        open={open} setOpen={setOpen}
        credentials={credentials} setCredentials={setCredentials}
        onCreate={s => setList(prev => [s, ...prev])}
      />
    </div>
  );
}

function AddSubscriberDialog({
  open, setOpen, credentials, setCredentials, onCreate,
}: {
  open: boolean; setOpen: (v: boolean) => void;
  credentials: { user: string; pwd: string } | null;
  setCredentials: (c: { user: string; pwd: string } | null) => void;
  onCreate: (s: Subscriber) => void;
}) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", area: AREAS[0],
    stbId: "", whatsapp: "", notes: "", packId: PACKS[0].id,
  });
  const u = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error("Name and phone are required"); return; }
    const pwd = Math.random().toString(36).slice(2, 10);
    const newSub: Subscriber = {
      id: `s${Date.now()}`,
      name: form.name, phone: form.phone, email: form.email, address: form.address,
      area: form.area, stbId: form.stbId || `STB${Math.floor(100000 + Math.random()*900000)}`,
      installDate: new Date().toISOString(),
      whatsapp: form.whatsapp || form.phone, notes: form.notes, status: "active",
      packId: form.packId, expiry: new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    onCreate(newSub);
    setCredentials({ user: form.phone, pwd });
    toast.success("Subscriber added");
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) setCredentials(null); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{credentials ? "Subscriber created" : "Add subscriber"}</DialogTitle>
          <DialogDescription>
            {credentials ? "Share these credentials with the subscriber" : "Credentials are generated automatically when you save."}
          </DialogDescription>
        </DialogHeader>

        {credentials ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/40 p-4 font-mono text-sm">
              <div>Username: <span className="font-semibold">{credentials.user}</span></div>
              <div>Password: <span className="font-semibold">{credentials.pwd}</span></div>
            </div>
            <p className="text-xs text-muted-foreground">These can also be sent via WhatsApp/SMS automatically.</p>
            <DialogFooter><Button onClick={() => setOpen(false)}>Done</Button></DialogFooter>
          </div>
        ) : (
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { k: "name", l: "Full name" }, { k: "phone", l: "Phone number" },
              { k: "email", l: "Email" }, { k: "address", l: "Address" },
              { k: "stbId", l: "STB ID" }, { k: "whatsapp", l: "WhatsApp" },
            ].map(f => (
              <div key={f.k} className="space-y-1.5">
                <Label className="text-xs">{f.l}</Label>
                <Input value={(form as any)[f.k]} onChange={e => u(f.k as any, e.target.value)} className="h-10 rounded-xl"/>
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs">Area</Label>
              <Select value={form.area} onValueChange={v => u("area", v)}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
                <SelectContent>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Initial pack</Label>
              <Select value={form.packId} onValueChange={v => u("packId", v)}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
                <SelectContent>{PACKS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Input value={form.notes} onChange={e => u("notes", e.target.value)} className="h-10 rounded-xl"/>
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">Save & Generate Credentials</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
