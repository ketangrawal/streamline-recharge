import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContentShell } from "./about";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — CableHub" }, { name: "description", content: "Get in touch with the CableHub team." }] }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <ContentShell title="Contact support" subtitle="We usually reply within a few business hours">
      <div className="not-prose grid md:grid-cols-3 gap-4 my-2">
        {[
          { icon: Mail, label: "Email", v: "support@cablehub.app" },
          { icon: Phone, label: "Phone", v: "+91 98000 00000" },
          { icon: MapPin, label: "Office", v: "Bengaluru, India" },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow mb-3"><c.icon className="w-4 h-4"/></div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
            <div className="font-medium">{c.v}</div>
          </div>
        ))}
      </div>
      <form onSubmit={e => { e.preventDefault(); toast.success("Message sent. We'll reply soon."); setForm({ name: "", email: "", message: "" }); }} className="not-prose mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">Name</Label><Input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="h-10 rounded-xl"/></div>
          <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="h-10 rounded-xl"/></div>
        </div>
        <div className="space-y-1.5"><Label className="text-xs">Message</Label><Textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className="rounded-xl"/></div>
        <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">Send message</Button>
      </form>
    </ContentShell>
  );
}
