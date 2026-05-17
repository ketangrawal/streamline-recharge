import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Users, Package, Wallet, Receipt, BarChart3, Settings,
  Bell, Search, Moon, Sun, LogOut, Menu, X, Tv, User, Home, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { to: string; label: string; icon: typeof Home };

const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/packs", label: "Packs", icon: Package },
  { to: "/admin/pricing", label: "Custom Pricing", icon: Wallet },
  { to: "/admin/recharges", label: "Recharges", icon: Receipt },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const subscriberNav: NavItem[] = [
  { to: "/subscriber", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subscriber/packs", label: "Browse Packs", icon: Package },
  { to: "/subscriber/recharges", label: "Recharges", icon: Receipt },
  { to: "/subscriber/notifications", label: "Notifications", icon: Bell },
  { to: "/subscriber/profile", label: "Profile", icon: User },
];

export function DashboardLayout({ role, children }: { role: "admin" | "subscriber"; children: ReactNode }) {
  const nav = role === "admin" ? adminNav : subscriberNav;
  const path = useRouterState({ select: s => s.location.pathname });
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar h-full flex flex-col">
      <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Tv className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display font-bold text-sidebar-foreground">CableHub</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{role}</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {nav.map(item => {
          const active = path === item.to || (item.to !== `/${role}` && path.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2">
          <Home className="w-3.5 h-3.5" /> Back to site
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-30 flex items-center px-4 lg:px-6 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search subscribers, packs, transactions…"
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/60 border border-transparent focus:border-ring focus:bg-background outline-none text-sm transition-colors"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate({ to: role === "admin" ? "/admin" : "/subscriber/notifications" })}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
                    {user?.name?.[0] ?? "U"}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user?.name ?? "User"}</span>
                  <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{role === "admin" ? "Admin Account" : "Subscriber Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role === "subscriber" && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/subscriber/profile" })}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/" }); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-4 mb-6 flex-wrap"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  );
}

export { X };
