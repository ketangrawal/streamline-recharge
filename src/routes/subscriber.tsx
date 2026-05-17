import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { OperatorBrandProvider } from "@/components/operator-brand-provider";
import { readSession } from "@/lib/auth";

export const Route = createFileRoute("/subscriber")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = readSession();
    if (!u || u.role !== "subscriber" || !u.operator_id) {
      throw redirect({ to: "/subscriber-login" });
    }
  },
  component: SubscriberLayout,
});

function SubscriberLayout() {
  const u = readSession();
  return (
    <OperatorBrandProvider operatorId={u?.operator_id}>
      <DashboardLayout role="subscriber">
        <Outlet />
      </DashboardLayout>
    </OperatorBrandProvider>
  );
}
