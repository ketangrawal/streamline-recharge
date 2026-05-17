import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Building2, Power } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { OPERATORS, generateOperatorCode, getSubscribersByOperator, type Operator } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin/operators")({
  head: () => ({ meta: [{ title: "Operators" }] }),
  component: Page,
});

function Page() {
  const [list, setList] = useState<Operator[]>(OPERATORS);
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    setList(prev => prev.map(o => o.id === id ? { ...o, status: o.status === "active" ? "inactive" : "active" } : o));
    toast.success("Operator status updated");
  };

  return (
    <div>
      <PageHeader title="Operators" subtitle={`${list.length} operators on the platform`}
        action={<Button onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"><Plus className="w-4 h-4 mr-1.5"/>Add Operator</Button>}/>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
            <tr>{["Code","Company","Contact","Plan","Subscribers","Status",""].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map(o => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-5 py-3 font-mono text-xs">{o.code}</td>
                <td className="px-5 py-3">
                  <div className="font-medium">{o.companyName}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </td>
                <td className="px-5 py-3">
                  <div>{o.contactPerson}</div>
                  <div className="text-xs text-muted-foreground">{o.phone}</div>
                </td>
                <td className="px-5 py-3">{o.plan}</td>
                <td className="px-5 py-3">{getSubscribersByOperator(o.id).length}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${o.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{o.status}</span></td>
                <td className="px-5 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => toggle(o.id)}><Power className="w-4 h-4"/></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateDialog open={open} setOpen={setOpen} onCreate={op => setList(prev => [op, ...prev])}/>
    </div>
  );
}

function CreateDialog({ open, setOpen, onCreate }: { open: boolean; setOpen: (v: boolean) => void; onCreate: (op: Operator) => void }) {
  const [form, setForm] = useState({
    companyName: "", contactPerson: "", phone: "", email: "", address: "", gst: "", plan: "Starter",
  });
  const u = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.email) { toast.error("Company and email required"); return; }
    const code = generateOperatorCode(form.companyName);
    const op: Operator = {
      id: `op-${Date.now()}`, code,
      companyName: form.companyName, contactPerson: form.contactPerson,
      phone: form.phone, email: form.email, address: form.address, gst: form.gst,
      plan: form.plan as Operator["plan"], status: "active",
      createdAt: new Date().toISOString(),
      branding: { primaryColor: "#7C3AED", supportPhone: form.phone, supportEmail: form.email },
      adminEmail: form.email, adminPassword: "operator123",
    };
    onCreate(op);
    toast.success(`Operator created with code ${code}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2"><Building2 className="w-4 h-4"/>Onboard new operator</DialogTitle>
          <DialogDescription>Operator code is generated automatically from the company name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          {[
            { k: "companyName", l: "Company name" },
            { k: "contactPerson", l: "Contact person" },
            { k: "phone", l: "Phone number" },
            { k: "email", l: "Email" },
            { k: "address", l: "Address" },
            { k: "gst", l: "GST number" },
          ].map(f => (
            <div key={f.k} className="space-y-1.5">
              <Label className="text-xs">{f.l}</Label>
              <Input value={(form as Record<string, string>)[f.k]} onChange={e => u(f.k as keyof typeof form, e.target.value)} className="h-10 rounded-xl"/>
            </div>
          ))}
          <div className="space-y-1.5">
            <Label className="text-xs">Subscription plan</Label>
            <Select value={form.plan} onValueChange={v => u("plan", v)}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue/></SelectTrigger>
              <SelectContent>
                {["Starter","Growth","Enterprise"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">Create Operator</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
