import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Star, Tv } from "lucide-react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PACKS, SUBSCRIBERS, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/subscriber/packs")({
  head: () => ({ meta: [{ title: "Choose a pack — CableHub" }] }),
  component: PacksPage,
});

function PacksPage() {
  const me = SUBSCRIBERS[0];
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Browse Packs" subtitle="Choose a plan that fits your viewing"/>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PACKS.map((p, i) => {
          const customPrice = me.packId === p.id ? me.customPrice : undefined;
          const display = customPrice ?? p.monthly;
          const yearlySavings = Math.round((1 - p.yearly / (p.monthly * 12)) * 100);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl p-6 border bg-card shadow-soft hover:shadow-elevate transition-all flex flex-col ${
                p.popular ? "border-primary/50 ring-1 ring-primary/30" : "border-border"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-semibold inline-flex items-center gap-1 shadow-glow">
                  <Star className="w-3 h-3"/> Recommended
                </div>
              )}
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-lg">{p.name}</h3>
                <Badge variant="outline">{p.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{p.description}</p>

              <div className="mt-5">
                {customPrice && <div className="text-xs text-muted-foreground line-through">{formatINR(p.monthly)}</div>}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-display">{formatINR(display)}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                {customPrice && <Badge className="mt-1 bg-success text-success-foreground">Custom price for you</Badge>}
              </div>

              <ul className="mt-5 space-y-2 text-sm flex-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success"/> <Tv className="w-3.5 h-3.5"/> {p.channels} channels</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success"/> {p.type === "HD" ? "HD streaming" : "SD streaming"}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success"/> Quarterly {formatINR(p.quarterly)}</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success"/> Yearly {formatINR(p.yearly)} (save {yearlySavings}%)</li>
              </ul>

              <Button onClick={() => navigate({ to: "/checkout", search: { pack: p.id } })} className="mt-6 bg-gradient-primary text-primary-foreground border-0">
                Recharge {p.name}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
