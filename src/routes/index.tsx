import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Tv, Zap, ShieldCheck, BarChart3, Smartphone, Bell, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CableHub — Modern Cable TV Recharge Management" },
      { name: "description", content: "Run your cable TV operation like a SaaS. Manage subscribers, packs, recharges, and payments from one premium dashboard." },
      { property: "og:title", content: "CableHub — Modern Cable TV Recharge Management" },
      { property: "og:description", content: "Subscriber and recharge management built for modern cable operators." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Logos />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Tv className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">CableHub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 ml-10 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/subscriber-login">Subscriber</Link></Button>
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow border-0 hover:opacity-90">
            <Link to="/operator-login">Operator Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-80 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Built for modern cable operators
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto"
        >
          Run your cable network <br className="hidden md:block" />
          <span className="text-gradient">like a SaaS company.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Manage subscribers, packs, recharges and payments from one premium dashboard.
          UPI & Razorpay ready. WhatsApp notifications built in.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow border-0 hover:opacity-90 h-12 px-6">
            <Link to="/operator-login">Open Admin Dashboard <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6">
            <Link to="/subscriber-login">Subscriber Portal</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="mt-16 relative mx-auto max-w-5xl"
        >
          <div className="rounded-3xl glass shadow-elevate overflow-hidden">
            <div className="h-9 flex items-center gap-1.5 px-4 border-b border-border bg-muted/40">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-muted-foreground">cablehub.app/admin</span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Subscribers", v: "1,284" }, { l: "Active", v: "1,156" },
                { l: "Monthly Rev.", v: "₹2.08L" }, { l: "Expiring", v: "37" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-card p-4 text-left border border-border">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  <div className="text-xl font-bold font-display mt-1">{s.v}</div>
                  <div className="h-1.5 rounded-full bg-muted mt-3 overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${30 + i * 18}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section className="py-10 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Powering 500+ cable operators across India</p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 opacity-70 font-display font-semibold text-lg">
          <span>StarVision</span><span>UrbanCable</span><span>MetroNet</span>
          <span>SkyLine TV</span><span>NextGen Cable</span><span>InfoCast</span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Zap, title: "Instant Recharges", body: "UPI, Razorpay & cash recharges with auto-expiry tracking and receipts." },
    { icon: ShieldCheck, title: "Role-based Access", body: "Separate admin and subscriber dashboards with JWT-ready auth flow." },
    { icon: BarChart3, title: "Real-time Analytics", body: "Revenue, plan popularity, area-wise collection — all in one view." },
    { icon: Bell, title: "Smart Notifications", body: "WhatsApp, email, in-app alerts for expiry, payments, and activations." },
    { icon: Smartphone, title: "Mobile First", body: "Responsive layouts so your team and subscribers work from anywhere." },
    { icon: Tv, title: "Pack Management", body: "HD/SD packs, custom subscriber pricing, monthly to yearly billing." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything an operator needs</h2>
          <p className="mt-3 text-muted-foreground">From your first subscriber to your ten-thousandth recharge.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-6 bg-card border border-border shadow-soft hover:shadow-elevate transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Starter", price: "₹999", per: "/mo", desc: "For local operators getting started.", features: ["Up to 200 subscribers", "Recharge & pack management", "UPI payments", "Email support"] },
    { name: "Growth", price: "₹2,499", per: "/mo", desc: "Most popular for mid-size networks.", features: ["Up to 2,000 subscribers", "WhatsApp notifications", "Custom pricing per subscriber", "Razorpay integration", "Priority support"], popular: true },
    { name: "Enterprise", price: "Custom", per: "", desc: "Multi-area, multi-operator setups.", features: ["Unlimited subscribers", "Multi-area branches", "Dedicated manager", "SLA & API access"] },
  ];
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Pay for the operator features. Subscriber portals are always included.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl p-7 border ${t.popular ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow scale-[1.02]" : "bg-card border-border shadow-soft"}`}
            >
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-warning text-warning-foreground text-xs font-semibold">Most popular</div>}
              <h3 className="font-display font-semibold text-xl">{t.name}</h3>
              <p className={`text-sm mt-1 ${t.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-display">{t.price}</span>
                <span className={t.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>{t.per}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-7 w-full ${t.popular ? "bg-background text-foreground hover:bg-background/90" : "bg-gradient-primary text-primary-foreground border-0"}`}>
                <Link to="/operator-login">Get started</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl p-10 lg:p-16 text-center bg-gradient-primary text-primary-foreground shadow-elevate">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to modernize your cable business?</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl mx-auto">Launch your operator dashboard in minutes. No credit card required.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-background text-foreground h-12 px-7 hover:bg-background/90">
                <Link to="/operator-login">Try Admin Dashboard</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary grid place-items-center">
            <Tv className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-foreground">CableHub</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}
