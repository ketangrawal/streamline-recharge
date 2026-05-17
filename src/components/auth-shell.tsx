import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthShell({
  title, subtitle, accent, heroTitle, heroSubtitle, children,
}: {
  title: string;
  subtitle: string;
  accent?: "primary" | "indigo" | "rose";
  heroTitle?: string;
  heroSubtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-primary text-primary-foreground p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <Link to="/" className="relative flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-background/15 backdrop-blur grid place-items-center">
            <Tv className="w-5 h-5" />
          </div>
          <span className="font-display font-bold">CableHub</span>
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">
            {heroTitle ?? "Premium control room for modern cable operators."}
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            {heroSubtitle ?? "Subscribers, recharges, packs and payments — beautifully unified."}
          </p>
        </div>
        <div className="relative text-xs text-primary-foreground/70">© CableHub {new Date().getFullYear()}</div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center">
              <Tv className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">CableHub</span>
          </Link>
          <h1 className="text-2xl font-bold font-display">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-7">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function AuthField({
  icon: Icon, label, value, onChange, type = "text", placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="relative">
        <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="h-11 pl-9 rounded-xl"
        />
      </div>
    </div>
  );
}
