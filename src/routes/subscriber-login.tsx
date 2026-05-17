import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Lock, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { AuthShell, AuthField } from "@/components/auth-shell";

export const Route = createFileRoute("/subscriber-login")({
  head: () => ({ meta: [{ title: "Subscriber Login — CableHub" }] }),
  component: SubLogin,
});

function SubLogin() {
  const navigate = useNavigate();
  const { loginSubscriber } = useAuth();
  const [code, setCode] = useState("STAR001");
  const [phone, setPhone] = useState("9810000000");
  const [password, setPassword] = useState("subscriber123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginSubscriber(code, phone, password);
      toast.success("Welcome back!");
      navigate({ to: "/subscriber" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <AuthShell
      title="Subscriber Login"
      subtitle="Sign in using credentials from your cable operator"
      heroTitle="Recharge your cable, anytime."
      heroSubtitle="View your plan, top up online, and get receipts — without calling anyone."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField icon={KeyRound} label="Operator code" value={code} onChange={setCode} placeholder="e.g. STAR001" />
        <AuthField icon={Phone} label="Phone number" value={phone} onChange={setPhone} type="tel" />
        <AuthField icon={Lock} label="Password" value={password} onChange={setPassword} type="password" />
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          {loading ? "Signing in..." : <>Sign in <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Don't have credentials? Contact your cable operator to get them.
        </p>
        <div className="mt-3 rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground space-y-0.5">
          <div className="font-medium text-foreground">Demo subscriber</div>
          <div>Code STAR001 · Phone 9810000000 · Password subscriber123</div>
        </div>
      </form>
    </AuthShell>
  );
}
