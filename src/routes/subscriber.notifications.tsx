import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Check, Bell, AlertTriangle, XCircle, Info } from "lucide-react";
import { getNotificationsForSubscriber } from "@/lib/mock-data";
import { readSession } from "@/lib/auth";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/subscriber/notifications")({
  head: () => ({ meta: [{ title: "Notifications" }] }),
  component: Page,
});

function Page() {
  const u = readSession()!;
  const [items, setItems] = useState(getNotificationsForSubscriber(u.operator_id!, u.id));
  const icons = { success: Check, warning: AlertTriangle, error: XCircle, info: Info };
  const colors = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    error: "bg-destructive/15 text-destructive",
    info: "bg-primary/15 text-primary",
  };

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Recharge updates, expiry reminders, and more"
        action={<Button variant="outline" onClick={() => setItems(items.map(n => ({...n, read: true})))}>Mark all read</Button>}/>
      {items.length === 0 ? (
        <EmptyState icon={<Bell className="w-5 h-5"/>} title="No notifications yet" description="You're all caught up."/>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-soft divide-y divide-border">
          {items.map(n => {
            const Icon = icons[n.type];
            return (
              <div key={n.id} className={`flex gap-4 p-5 ${!n.read ? "bg-muted/30" : ""}`}>
                <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${colors[n.type]}`}>
                  <Icon className="w-5 h-5"/>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary"/>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(n.date).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
