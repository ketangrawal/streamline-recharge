import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/subscriber")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("cabletv_session_v1");
    if (!raw) throw redirect({ to: "/subscriber-login" });
    try {
      const u = JSON.parse(raw);
      if (u.role !== "subscriber") throw redirect({ to: "/subscriber-login" });
    } catch { throw redirect({ to: "/subscriber-login" }); }
  },
  component: () => <DashboardLayout role="subscriber"><Outlet/></DashboardLayout>,
});
