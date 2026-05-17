import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RECHARGES, SUBSCRIBERS, formatINR } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/subscriber/recharges")({
  head: () => ({ meta: [{ title: "My Recharges — CableHub" }] }),
  component: Page,
});

function Page() {
  const me = SUBSCRIBERS[0];
  const items = RECHARGES.filter(r => r.subscriberId === me.id);
  return (
    <div>
      <PageHeader title="My Recharges" subtitle="History and receipts"/>
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
            <tr>{["Pack","Method","Amount","Date","Expiry","Status",""].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">No recharges yet</td></tr>}
            {items.map(r => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-5 py-3 font-medium">{r.packName}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.method}</td>
                <td className="px-5 py-3 font-semibold">{formatINR(r.amount)}</td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(r.expiry).toLocaleDateString()}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status}/></td>
                <td className="px-5 py-3"><Button size="sm" variant="ghost" onClick={() => toast.success("Receipt downloaded")}><Download className="w-4 h-4"/></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
