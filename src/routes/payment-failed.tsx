import { createFileRoute } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { PaymentStatus } from "./payment-success";

export const Route = createFileRoute("/payment-failed")({
  head: () => ({ meta: [{ title: "Payment failed — CableHub" }] }),
  component: () => (
    <PaymentStatus
      icon={<XCircle className="w-12 h-12"/>} tone="error"
      title="Payment failed"
      body="We couldn't process your payment. No money has been deducted. Please try again."
      primary={{ to: "/subscriber/packs", label: "Try again" }}
    />
  ),
});
