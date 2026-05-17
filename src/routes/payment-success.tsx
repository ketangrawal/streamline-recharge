import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment-success")({
  head: () => ({ meta: [{ title: "Payment successful — CableHub" }] }),
  component: () => (
    <PaymentStatus
      icon={<CheckCircle2 className="w-12 h-12"/>}
      tone="success"
      title="Payment successful!"
      body="Your plan has been activated. A receipt has been sent to your email and WhatsApp."
      primary={{ to: "/subscriber", label: "Go to dashboard" }}
      secondary={{ label: "Download receipt" }}
    />
  ),
});

export function PaymentStatus({
  icon, tone, title, body, primary, secondary,
}: {
  icon: React.ReactNode; tone: "success" | "error" | "warning";
  title: string; body: string;
  primary: { to: string; label: string }; secondary?: { label: string };
}) {
  const toneCls = tone === "success" ? "bg-success text-success-foreground" : tone === "error" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground";
  return (
    <div className="min-h-screen bg-gradient-mesh grid place-items-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full rounded-3xl bg-card border border-border shadow-elevate p-8 text-center">
        <div className={`w-20 h-20 rounded-full ${toneCls} grid place-items-center mx-auto shadow-glow`}>{icon}</div>
        <h1 className="text-2xl font-bold font-display mt-5">{title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{body}</p>
        <div className="mt-7 flex flex-col gap-2">
          <Button asChild className="h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
            <Link to={primary.to}>{primary.label} <ArrowRight className="w-4 h-4 ml-1"/></Link>
          </Button>
          {secondary && <Button variant="outline" className="h-11"><Download className="w-4 h-4 mr-1.5"/>{secondary.label}</Button>}
        </div>
      </motion.div>
    </div>
  );
}
