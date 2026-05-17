import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Tv, ShieldCheck, ArrowLeft, Wallet, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  getPacksByOperator, getSubscriberById, getCustomPriceFor, formatINR,
} from "@/lib/mock-data";
import { readSession } from "@/lib/auth";
import { toast } from "sonner";

const search = z.object({
  pack: z.string().optional(),
  duration: z.enum(["monthly","quarterly","halfYearly","yearly"]).optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => search.parse(s),
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = (() => { try { return JSON.parse(localStorage.getItem("cabletv_session_v2") ?? "null"); } catch { return null; } })();
    if (!u || u.role !== "subscriber" || !u.operator_id) {
      throw (require("@tanstack/react-router") as typeof import("@tanstack/react-router")).redirect({ to: "/subscriber-login" });
    }
  },
  head: () => ({ meta: [{ title: "Checkout" }] }),
  component: Checkout,
});

const DURATIONS = [
  { key: "monthly", label: "1 Month", mult: 1 },
  { key: "quarterly", label: "3 Months", mult: 3 },
  { key: "halfYearly", label: "6 Months", mult: 6 },
  { key: "yearly", label: "12 Months", mult: 12 },
] as const;

function Checkout() {
  const { pack: packId, duration } = Route.useSearch();
  const navigate = useNavigate();
  const u = readSession()!;
  const me = getSubscriberById(u.operator_id!, u.id)!;
  const packs = getPacksByOperator(u.operator_id!);
  const pack = packs.find(p => p.id === packId) ?? packs.find(p => p.popular) ?? packs[0];
  const [dur, setDur] = useState<typeof DURATIONS[number]["key"]>(duration ?? "monthly");
  const [method, setMethod] = useState("upi");

  const durObj = DURATIONS.find(d => d.key === dur)!;
  const cp = getCustomPriceFor(u.operator_id!, me.id, pack.id);
  const baseUnit = cp?.price ?? pack.monthly;
  const subtotal = cp ? baseUnit * durObj.mult : (pack[dur] ?? baseUnit * durObj.mult);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const pay = () => {
    toast.loading("Processing payment...");
    setTimeout(() => {
      toast.dismiss();
      const ok = Math.random() > 0.15;
      navigate({ to: ok ? "/payment-success" : "/payment-failed" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <header className="border-b border-border bg-background/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-16 flex items-center">
          <Link to="/subscriber/packs" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4"/> Back to packs
          </Link>
          <div className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="w-4 h-4 text-success"/> Secure checkout</div>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4 lg:px-8 py-10 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold">Choose duration</h2>
            <RadioGroup value={dur} onValueChange={v => setDur(v as typeof dur)} className="grid grid-cols-2 gap-3 mt-3">
              {DURATIONS.map(d => {
                const amount = cp ? baseUnit * d.mult : (pack[d.key] ?? baseUnit * d.mult);
                return (
                  <Label key={d.key} className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between ${dur === d.key ? "border-primary ring-1 ring-primary/30 bg-primary/5" : "border-border"}`}>
                    <div>
                      <RadioGroupItem value={d.key} className="sr-only"/>
                      <div className="font-medium">{d.label}</div>
                      <div className="text-xs text-muted-foreground">{formatINR(Math.round(amount / d.mult))}/mo</div>
                    </div>
                    <div className="font-bold">{formatINR(amount)}</div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold">Payment method</h2>
            <RadioGroup value={method} onValueChange={setMethod} className="space-y-2 mt-3">
              <MethodRow id="upi" icon={Smartphone} label="UPI" sub="Pay with any UPI app (GPay, PhonePe, Paytm)" v={method}/>
              <MethodRow id="razorpay" icon={CreditCard} label="Razorpay" sub="Cards, netbanking, wallets"  v={method}/>
              <MethodRow id="wallet" icon={Wallet} label="Wallet" sub="Pay using your CableHub wallet" v={method}/>
            </RadioGroup>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow"><Tv className="w-5 h-5"/></div>
            <div>
              <div className="font-display font-semibold">{pack.name}</div>
              <div className="text-xs text-muted-foreground">{pack.channels} channels • {pack.type}</div>
            </div>
          </div>
          <div className="text-sm space-y-2 border-t border-border pt-4">
            <Row k="Subscriber" v={me.name}/>
            <Row k="STB ID" v={me.stbId}/>
            <Row k="Duration" v={durObj.label}/>
            <Row k="Subtotal" v={formatINR(subtotal)}/>
            <Row k="GST (18%)" v={formatINR(gst)}/>
            <div className="flex justify-between pt-3 border-t border-border font-semibold text-base"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          <Button onClick={pay} className="w-full mt-5 h-11 bg-gradient-primary text-primary-foreground border-0 shadow-glow">Pay {formatINR(total)}</Button>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">By paying you agree to our Terms. Secured by 256-bit encryption.</p>
        </div>
      </motion.div>
    </div>
  );
}

function MethodRow({ id, icon: Icon, label, sub, v }: { id: string; icon: typeof Wallet; label: string; sub: string; v: string }) {
  const active = v === id;
  return (
    <Label className={`flex items-center gap-3 cursor-pointer rounded-xl border p-3 ${active ? "border-primary ring-1 ring-primary/30 bg-primary/5" : "border-border"}`}>
      <RadioGroupItem value={id}/>
      <div className="w-9 h-9 rounded-lg bg-muted grid place-items-center"><Icon className="w-4 h-4"/></div>
      <div className="flex-1"><div className="font-medium text-sm">{label}</div><div className="text-xs text-muted-foreground">{sub}</div></div>
    </Label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
