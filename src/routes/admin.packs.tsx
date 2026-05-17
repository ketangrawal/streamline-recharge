import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tv, Star, MoreVertical, Edit, Power } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PACKS, formatINR, type Pack } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/packs")({
  head: () => ({ meta: [{ title: "Pack Management — CableHub" }] }),
  component: PacksPage,
});

function PacksPage() {
  const [packs, setPacks] = useState<Pack[]>(PACKS);

  const toggle = (id: string) => {
    setPacks(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    toast.success("Pack updated");
  };

  return (
    <div>
      <PageHeader
        title="Pack Management"
        subtitle="Create and manage your channel packs"
        action={<Button className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"><Plus className="w-4 h-4 mr-1.5"/>Create Pack</Button>}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {packs.map((p, i) => {
          const yearlySavings = Math.round((1 - p.yearly / (p.monthly * 12)) * 100);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl border p-5 bg-card shadow-soft hover:shadow-elevate transition-shadow ${p.popular ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`}
            >
              {p.popular && (
                <div className="absolute -top-2.5 left-5 px-2 py-0.5 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-semibold inline-flex items-center gap-1 shadow-glow">
                  <Star className="w-3 h-3"/> Most popular
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-lg">{p.name}</h3>
                    <Badge variant="outline" className="text-[10px] py-0">{p.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4"/></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Edit className="w-4 h-4 mr-2"/>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggle(p.id)}><Power className="w-4 h-4 mr-2"/>{p.active ? "Deactivate" : "Reactivate"}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tv className="w-3.5 h-3.5"/> {p.channels} channels
              </div>

              <div className="mt-4 space-y-1.5 text-sm">
                <PriceRow label="Monthly" v={formatINR(p.monthly)}/>
                <PriceRow label="Quarterly" v={formatINR(p.quarterly)} sub="3 mo"/>
                <PriceRow label="Half-yearly" v={formatINR(p.halfYearly)} sub="6 mo"/>
                <PriceRow label="Yearly" v={formatINR(p.yearly)} sub={`Save ${yearlySavings}%`} highlight/>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge variant={p.active ? "default" : "outline"} className={p.active ? "bg-success text-success-foreground" : ""}>
                  {p.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PriceRow({ label, v, sub, highlight }: { label: string; v: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${highlight ? "bg-gradient-primary text-primary-foreground" : "bg-muted/50"}`}>
      <span className="text-xs">{label}</span>
      <div className="text-right">
        <div className="font-semibold">{v}</div>
        {sub && <div className={`text-[10px] ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{sub}</div>}
      </div>
    </div>
  );
}
