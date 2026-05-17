import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("cabletv_session_v1");
    if (!raw) throw redirect({ to: "/login" });
    try {
      const u = JSON.parse(raw);
      if (u.role !== "admin") throw redirect({ to: "/login" });
    } catch { throw redirect({ to: "/login" }); }
  },
  component: () => (
    <DashboardLayout role="admin"><Outlet /></DashboardLayout>
  ),
});
