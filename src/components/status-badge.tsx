import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-success/15 text-success border-success/30",
    success: "bg-success/15 text-success border-success/30",
    inactive: "bg-muted text-muted-foreground border-border",
    pending: "bg-warning/15 text-warning-foreground border-warning/40",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <Badge variant="outline" className={`capitalize font-medium ${map[status] ?? ""}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 inline-block" />
      {status}
    </Badge>
  );
}
