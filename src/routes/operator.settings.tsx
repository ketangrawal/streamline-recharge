import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Building2, KeyRound, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import { getOperatorById } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/operator/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const op = getOperatorById(user!.operator_id!)!;
  const [form, setForm] = useState({
    companyName: op.companyName, contactPerson: op.contactPerson,
    phone: op.phone, email: op.email, address: op.address, gst: op.gst,
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [prefs, setPrefs] = useState({ expiryReminders: true, paymentReceipts: true, dailySummary: false });

  const saveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    Object.assign(op, form);
    toast.success("Company info saved");
  };

  const changePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.current !== op.adminPassword) { toast.error("Current password incorrect"); return; }
    if (pw.next.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (pw.next !== pw.confirm) { toast.error("Passwords do not match"); return; }
    op.adminPassword = pw.next;
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password updated");
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your operator account" />

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveCompany} className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-display font-semibold inline-flex items-center gap-2"><Building2 className="w-4 h-4" /> Company profile</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {([
              ["companyName","Company name"], ["contactPerson","Contact person"],
              ["phone","Phone"], ["email","Email"], ["gst","GST number"],
            ] as const).map(([k,l]) => (
              <div key={k} className="space-y-1.5">
                <Label className="text-xs">{l}</Label>
                <Input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="h-10 rounded-xl" />
              </div>
            ))}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Address</Label>
              <Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="rounded-xl" rows={2} />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-border">
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0"><Save className="w-4 h-4 mr-1.5" /> Save</Button>
          </div>
        </form>

        <form onSubmit={changePw} className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h3 className="font-display font-semibold inline-flex items-center gap-2"><KeyRound className="w-4 h-4" /> Change password</h3>
          {([
            ["current","Current password"], ["next","New password"], ["confirm","Confirm new password"],
          ] as const).map(([k,l]) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-xs">{l}</Label>
              <Input type="password" value={pw[k]} onChange={e => setPw({ ...pw, [k]: e.target.value })} className="h-10 rounded-xl" />
            </div>
          ))}
          <div className="flex justify-end pt-2 border-t border-border">
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">Update password</Button>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4 lg:col-span-2">
          <h3 className="font-display font-semibold inline-flex items-center gap-2"><FileText className="w-4 h-4" /> Notification preferences</h3>
          {([
            ["expiryReminders","Expiry reminders","Automatic reminders 7 days before plan expiry"],
            ["paymentReceipts","Payment receipts","WhatsApp & email receipts after every successful recharge"],
            ["dailySummary","Daily summary","Get a daily report email with collections and expiries"],
          ] as const).map(([k,l,d]) => (
            <div key={k} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <div className="font-medium text-sm">{l}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
              <Switch checked={prefs[k]} onCheckedChange={v => { setPrefs({ ...prefs, [k]: v }); toast.success(`${l} ${v ? "enabled" : "disabled"}`); }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
