import type { ReactNode } from "react";

export function EmptyState({
  icon, title, description, action,
}: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
      {icon && <div className="mx-auto w-12 h-12 rounded-2xl bg-muted grid place-items-center mb-3 text-muted-foreground">{icon}</div>}
      <h3 className="font-display font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
