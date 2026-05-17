import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  label, value, icon, trend, delay = 0,
}: {
  label: string; value: ReactNode; icon: ReactNode; trend?: { value: string; up?: boolean }; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elevate transition-shadow"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-primary opacity-10 blur-2xl rounded-full" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold mt-2 font-display">{value}</p>
          {trend && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${trend.up ? "text-success" : "text-destructive"}`}>
              {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
