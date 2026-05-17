import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin/settings")({
  head: () => ({ meta: [{ title: "Platform Settings" }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Platform Settings" subtitle="Configure the CableHub platform"/>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft max-w-2xl space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Platform name"><Input defaultValue="CableHub" className="h-10 rounded-xl"/></Field>
          <Field label="Support email"><Input defaultValue="owner@cablehub.app" className="h-10 rounded-xl"/></Field>
          <Field label="Default operator plan"><Input defaultValue="Starter" className="h-10 rounded-xl"/></Field>
          <Field label="Operator code prefix length"><Input type="number" defaultValue="3" className="h-10 rounded-xl"/></Field>
        </div>
        <Button onClick={() => toast.success("Settings saved")} className="bg-gradient-primary text-primary-foreground border-0">
          <Save className="w-4 h-4 mr-1.5"/>Save
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
