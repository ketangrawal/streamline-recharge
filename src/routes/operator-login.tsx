import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { AuthShell, AuthField } from "@/components/auth-shell";

export const Route = createFileRoute("/operator-login")({
  head: () => ({ meta: [{ title: "Operator Login — CableHub" }] }),
  component: OperatorLogin,
});

function OperatorLogin() {
  const navigate = useNavigate();
  const { loginOperator } = useAuth();
  const [email, setEmail] = useState("admin@starvision.in");
  const [password, setPassword] = useState("operator123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginOperator(email, password);
      toast.success("Welcome back");
      navigate({ to: "/operator" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Operator Login" subtitle="Sign in to your operator dashboard">
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField icon={Mail} label="Email" value={email} onChange={setEmail} type="email" />
        <AuthField icon={Lock} label="Password" value={password} onChange={setPassword} type="password" />
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          {loading ? "Signing in..." : <>Sign in <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
        <div className="flex justify-between text-xs text-muted-foreground">
          <Link to="/subscriber-login" className="hover:text-foreground">Subscriber login</Link>
          <Link to="/contact" className="hover:text-foreground">Become an operator</Link>
        </div>
        <div className="mt-4 rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground space-y-0.5">
          <div className="font-medium text-foreground">Demo operators</div>
          <div>admin@starvision.in · admin@gtpl.in · admin@skylinetv.in</div>
          <div>Password: operator123</div>
        </div>
      </form>
    </AuthShell>
  );
}
