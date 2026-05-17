import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContentShell } from "./about";

const FAQS = [
  { q: "How are subscriber credentials generated?", a: "When you add a subscriber from the admin dashboard, CableHub auto-generates a random password and uses the phone number as username. You can share these credentials via WhatsApp or SMS." },
  { q: "Do you support UPI payments?", a: "Yes. We support UPI and Razorpay for online recharges. Cash recharges are also tracked." },
  { q: "Can I set custom pricing per subscriber?", a: "Absolutely. Use the Custom Pricing module to set a per-subscriber override that automatically appears in their portal and at checkout." },
  { q: "What happens when a subscription expires?", a: "Subscribers are sent expiry reminders 7, 3, and 1 day before expiry via WhatsApp & email. After expiry, their pack becomes inactive until they recharge." },
  { q: "Is my data secure?", a: "All data is encrypted in transit (TLS) and at rest. We follow industry standards for authentication and authorization." },
  { q: "Can I cancel anytime?", a: "Yes. Operator subscriptions are month-to-month. Cancel anytime from the settings page." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — CableHub" }, { name: "description", content: "Common questions about using CableHub." }] }),
  component: FAQ,
});

function FAQ() {
  return (
    <ContentShell title="Frequently asked questions" subtitle="Answers to the things operators ask us most">
      <div className="not-prose mt-2">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card divide-y divide-border shadow-soft">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="px-5">
              <AccordionTrigger className="font-medium text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ContentShell>
  );
}
