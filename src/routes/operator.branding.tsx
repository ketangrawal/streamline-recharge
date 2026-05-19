import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Palette, Save, Tv } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { getOperatorById } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/operator/branding")({
  head: () => ({ meta: [{ title: "Branding" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const op = getOperatorById(user!.operator_id!)!;
  const [form, setForm] = useState({
    companyName: op.companyName,
    tagline: op.branding.tagline ?? "",
    primaryColor: op.branding.primaryColor,
    supportPhone: op.branding.supportPhone,
    supportEmail: op.branding.supportEmail,
    logo: op.branding.logo ?? "",
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    // mutate in-memory mock
    op.companyName = form.companyName;
    op.branding = { ...op.branding, tagline: form.tagline, primaryColor: form.primaryColor, supportPhone: form.supportPhone, supportEmail: form.supportEmail, logo: form.logo || undefined };
    toast.success("Branding updated");
  };

  const swatches = ["#7C3AED","#0EA5E9","#F43F5E","#10B981","#F59E0B","#3B82F6","#EC4899","#6366F1"];

  return (
    <div>
      <PageHeader title="Branding" subtitle="Customise how your subscribers see your portal" />

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={save} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Company name</Label>
              <Input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tagline</Label>
              <Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Support phone</Label>
              <Input value={form.supportPhone} onChange={e => setForm({ ...form, supportPhone: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Support email</Label>
              <Input value={form.supportEmail} onChange={e => setForm({ ...form, supportEmail: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Logo URL (optional)</Label>
              <Input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="https://…" className="h-10 rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs inline-flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Primary color</Label>
            <div className="flex flex-wrap gap-2">
              {swatches.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, primaryColor: c })}
                  className={`w-9 h-9 rounded-xl border-2 transition-all ${form.primaryColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ background: c }} aria-label={c} />
              ))}
              <Input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })} className="w-12 h-9 p-1 rounded-xl" />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
              <Save className="w-4 h-4 mr-1.5" /> Save branding
            </Button>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Live preview</div>
          <div className="rounded-2xl overflow-hidden border border-border">
            <div className="h-20 grid place-items-center text-primary-foreground" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.primaryColor}aa)` }}>
              {form.logo
                ? <img src={form.logo} alt="logo" className="h-10" />
                : <div className="flex items-center gap-2"><Tv className="w-5 h-5" /><span className="font-display font-bold">{form.companyName || "Your Brand"}</span></div>}
            </div>
            <div className="p-4 bg-background">
              <div className="font-display font-semibold">{form.companyName || "Your Brand"}</div>
              <div className="text-xs text-muted-foreground">{form.tagline || "Your tagline shows here"}</div>
              <div className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-2">
                Support · {form.supportPhone}<br />{form.supportEmail}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
