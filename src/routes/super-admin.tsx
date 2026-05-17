import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { readSession } from "@/lib/auth";

export const Route = createFileRoute("/super-admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = readSession();
    if (!u || u.role !== "super_admin") {
      throw redirect({ to: "/super-admin-login" });
    }
  },
  component: () => <DashboardLayout role="super_admin"><Outlet /></DashboardLayout>,
});
