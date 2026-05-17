import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { readSession } from "@/lib/auth";

export const Route = createFileRoute("/operator")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = readSession();
    if (!u || u.role !== "operator_admin" || !u.operator_id) {
      throw redirect({ to: "/operator-login" });
    }
  },
  component: () => <DashboardLayout role="operator_admin"><Outlet /></DashboardLayout>,
});
