import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Tv, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Operator Login — CableHub" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("admin@cablehub.app");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(email, password);
      toast.success("Welcome back, Admin");
      navigate({ to: "/admin" });
    } catch {
      toast.error("Login failed");
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Operator Login" subtitle="Sign in to your operator dashboard">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={Mail} label="Email" value={email} onChange={setEmail} type="email" />
        <Field icon={Lock} label="Password" value={password} onChange={setPassword} type="password" />
        <div className="flex justify-between text-xs">
          <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
          <Link to="/subscriber-login" className="text-muted-foreground hover:text-foreground">Subscriber login</Link>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          {loading ? "Signing in..." : <>Sign in <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
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
          <h2 className="text-4xl font-bold leading-tight">Premium control room for modern cable operators.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">Subscribers, recharges, packs and payments — beautifully unified.</p>
        </div>
        <div className="relative text-xs text-primary-foreground/70">© CableHub {new Date().getFullYear()}</div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
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

export function Field({
  icon: Icon, label, value, onChange, type = "text", placeholder,
}: { icon: typeof Mail; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="relative">
        <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required
          className="h-11 pl-9 rounded-xl"
        />
      </div>
    </div>
  );
}
