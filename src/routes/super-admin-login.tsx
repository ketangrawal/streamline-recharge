import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { AuthShell, AuthField } from "@/components/auth-shell";

export const Route = createFileRoute("/super-admin-login")({
  head: () => ({ meta: [{ title: "Super Admin Login — CableHub" }] }),
  component: SuperAdminLogin,
});

function SuperAdminLogin() {
  const navigate = useNavigate();
  const { loginSuperAdmin } = useAuth();
  const [email, setEmail] = useState("owner@cablehub.app");
  const [password, setPassword] = useState("super123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginSuperAdmin(email, password);
      toast.success("Welcome, Platform Owner");
      navigate({ to: "/super-admin" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <AuthShell
      title="Platform Owner"
      subtitle="Sign in to the CableHub control center"
      heroTitle="Run the platform that runs cable operators."
      heroSubtitle="Onboard operators, monitor revenue, and manage subscriptions across your network."
    >
      <div className="mb-5 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="w-3.5 h-3.5" /> Restricted access
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField icon={Mail} label="Email" value={email} onChange={setEmail} type="email" />
        <AuthField icon={Lock} label="Password" value={password} onChange={setPassword} type="password" />
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          {loading ? "Signing in..." : <>Sign in <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
        <div className="flex justify-between text-xs text-muted-foreground">
          <Link to="/operator-login" className="hover:text-foreground">Operator login</Link>
          <Link to="/" className="hover:text-foreground">Back to site</Link>
        </div>
      </form>
    </AuthShell>
  );
}
