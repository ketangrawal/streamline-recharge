import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — CableHub" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("If an account exists, a reset link has been sent.");
  };

  return (
    <AuthShell title="Reset password" subtitle="We'll send you a reset link via email or SMS">
      {sent ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-5 text-sm">
          <div className="w-9 h-9 rounded-full bg-success text-success-foreground grid place-items-center mb-3">
            <Check className="w-5 h-5" />
          </div>
          <p className="font-medium">Check your inbox</p>
          <p className="text-muted-foreground mt-1">If an account exists for {email}, you'll receive a reset link shortly.</p>
          <Link to="/login" className="inline-block mt-4 text-sm font-medium text-primary">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field icon={Mail} label="Email or phone" value={email} onChange={setEmail} />
          <Button type="submit" className="w-full h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
            Send reset link <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Remembered it? <Link to="/login" className="text-foreground hover:underline">Back to login</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
