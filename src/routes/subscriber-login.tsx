import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/subscriber-login")({
  head: () => ({ meta: [{ title: "Subscriber Login — CableHub" }] }),
  component: SubLogin,
});

function SubLogin() {
  const navigate = useNavigate();
  const { loginSubscriber } = useAuth();
  const [phone, setPhone] = useState("9810000000");
  const [password, setPassword] = useState("subscriber123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginSubscriber(phone, password);
      toast.success("Welcome back!");
      navigate({ to: "/subscriber" });
    } catch { toast.error("Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell title="Subscriber Login" subtitle="Sign in with your phone number">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={Phone} label="Phone number" value={phone} onChange={setPhone} type="tel" />
        <Field icon={Lock} label="Password" value={password} onChange={setPassword} type="password" />
        <div className="flex justify-between text-xs">
          <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
          <Link to="/login" className="text-muted-foreground hover:text-foreground">Operator login</Link>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          {loading ? "Signing in..." : <>Sign in <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          New subscriber? Contact your cable operator to get credentials.
        </p>
      </form>
    </AuthShell>
  );
}
