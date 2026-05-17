import { createFileRoute, Link } from "@tanstack/react-router";
import { Tv } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CableHub" },
      { name: "description", content: "CableHub helps cable operators run modern, profitable subscriber businesses." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <ContentShell title="About CableHub" subtitle="A modern operating system for cable operators">
      <p>CableHub was built to bring the polish, speed, and automation of modern SaaS to the cable TV industry. We help local operators manage subscribers, packs, and recharges from a single beautifully designed dashboard.</p>
      <p>From a single neighborhood franchise to a multi-area network with thousands of subscribers, CableHub scales with your business — and looks great doing it.</p>
      <h2>Our mission</h2>
      <p>Help every cable operator run their business like a modern subscription company — with great tools, fair pricing, and zero hassle.</p>
      <h2>Built with care</h2>
      <p>We're a small team obsessed with craft. Every screen you see is designed to save you time, reduce mistakes, and make your subscribers happier.</p>
    </ContentShell>
  );
}

export function ContentShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center"><Tv className="w-4 h-4 text-primary-foreground"/></div>
            <span className="font-display font-bold">CableHub</span>
          </Link>
          <nav className="ml-auto flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/faq" className="hover:text-foreground">FAQ</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </header>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none -z-10"/>
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-lg text-muted-foreground mt-3">{subtitle}</p>
          <div className="prose-content mt-10 space-y-5 text-foreground/90 [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_p]:leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
