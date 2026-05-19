import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Send, MessageSquare, Mail, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { getSubscribersByOperator, NOTIFICATIONS, type AppNotification } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/operator/notifications")({
  head: () => ({ meta: [{ title: "Notifications" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const opId = user!.operator_id!;
  const subs = getSubscribersByOperator(opId);
  const [log, setLog] = useState<AppNotification[]>(
    () => NOTIFICATIONS.filter(n => n.operator_id === opId)
  );
  const [target, setTarget] = useState<"all" | "expiring" | "inactive">("all");
  const [channel, setChannel] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  const [title, setTitle] = useState("Recharge reminder");
  const [body, setBody] = useState("Hi {name}, your plan expires soon. Recharge now to avoid disconnection.");

  const recipientCount = target === "all" ? subs.length :
    target === "expiring" ? subs.filter(s => new Date(s.expiry).getTime() - Date.now() < 7 * 86400000).length :
    subs.filter(s => s.status === "inactive").length;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const notif: AppNotification = {
      id: `n-${Date.now()}`, operator_id: opId,
      title, body, type: "info",
      date: new Date().toISOString(), read: false,
    };
    setLog(prev => [notif, ...prev]);
    toast.success(`Sent to ${recipientCount} subscribers via ${channel.toUpperCase()}`);
  };

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Send WhatsApp, SMS or email broadcasts" />

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={send} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Audience</Label>
              <Select value={target} onValueChange={v => setTarget(v as typeof target)}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subscribers ({subs.length})</SelectItem>
                  <SelectItem value="expiring">Expiring within 7 days</SelectItem>
                  <SelectItem value="inactive">Inactive subscribers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Channel</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ["whatsapp", "WhatsApp", MessageSquare],
                  ["sms", "SMS", Smartphone],
                  ["email", "Email", Mail],
                ] as const).map(([k, label, Icon]) => (
                  <button key={k} type="button" onClick={() => setChannel(k)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all ${
                      channel === k ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                    }`}>
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Message · use {"{name}"} for subscriber name</Label>
            <Textarea value={body} onChange={e => setBody(e.target.value)} className="rounded-xl" rows={4} />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Estimated reach: <span className="font-semibold text-foreground">{recipientCount}</span> subscribers
            </div>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
              <Send className="w-4 h-4 mr-1.5" /> Send now
            </Button>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold inline-flex items-center gap-2"><Bell className="w-4 h-4" /> Recent broadcasts</h3>
          <div className="mt-3 space-y-2 max-h-[420px] overflow-y-auto">
            {log.length === 0 && <div className="text-sm text-muted-foreground">No notifications yet.</div>}
            {log.map(n => (
              <div key={n.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(n.date).toLocaleDateString()}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
