import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { useOperatorBrand } from "@/components/operator-brand-provider";
import {
  LayoutDashboard, Users, Package, Wallet, Receipt, BarChart3, Settings,
  Bell, Search, Moon, Sun, LogOut, Menu, Tv, User, Home, ChevronDown,
  Building2, Palette, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type LayoutRole = "super_admin" | "operator_admin" | "subscriber";

type NavItem = { to: string; label: string; icon: typeof Home };

const superAdminNav: NavItem[] = [
  { to: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/super-admin/operators", label: "Operators", icon: Building2 },
  { to: "/super-admin/settings", label: "Settings", icon: Settings },
];

const operatorNav: NavItem[] = [
  { to: "/operator", label: "Dashboard", icon: LayoutDashboard },
  { to: "/operator/subscribers", label: "Subscribers", icon: Users },
  { to: "/operator/packs", label: "Packs", icon: Package },
  { to: "/operator/pricing", label: "Custom Pricing", icon: Wallet },
  { to: "/operator/recharges", label: "Recharges", icon: Receipt },
  { to: "/operator/reports", label: "Reports", icon: BarChart3 },
  { to: "/operator/notifications", label: "Notifications", icon: Bell },
  { to: "/operator/branding", label: "Branding", icon: Palette },
  { to: "/operator/settings", label: "Settings", icon: Settings },
];

const subscriberNav: NavItem[] = [
  { to: "/subscriber", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subscriber/packs", label: "Browse Packs", icon: Package },
  { to: "/subscriber/recharges", label: "Recharges", icon: Receipt },
  { to: "/subscriber/notifications", label: "Notifications", icon: Bell },
  { to: "/subscriber/profile", label: "Profile", icon: User },
];

function navFor(role: LayoutRole) {
  if (role === "super_admin") return superAdminNav;
  if (role === "operator_admin") return operatorNav;
  return subscriberNav;
}

function brandLabel(role: LayoutRole) {
  if (role === "super_admin") return "Platform";
  if (role === "operator_admin") return "Operator";
  return "Subscriber";
}

function logoutTarget(role: LayoutRole) {
  if (role === "super_admin") return "/super-admin-login" as const;
  if (role === "operator_admin") return "/operator-login" as const;
  return "/subscriber-login" as const;
}

export function DashboardLayout({ role, children }: { role: LayoutRole; children: ReactNode }) {
  const nav = navFor(role);
  const path = useRouterState({ select: s => s.location.pathname });
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { operator } = useOperatorBrand();
  const [mobileOpen, setMobileOpen] = useState(false);

  const showBrand = role === "subscriber" && operator;
  const brandName = showBrand ? operator!.companyName : "CableHub";
  const brandSubtitle = showBrand ? operator!.code : brandLabel(role);

  const sidebar = (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar h-full flex flex-col">
      <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          {role === "super_admin"
            ? <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            : <Tv className="w-5 h-5 text-primary-foreground" />}
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-display font-bold text-sidebar-foreground truncate">{brandName}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{brandSubtitle}</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {nav.map(item => {
          const rootPath = nav[0].to;
          const active = path === item.to || (item.to !== rootPath && path.startsWith(item.to));
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
      {role !== "subscriber" && (
        <div className="p-3 border-t border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2">
            <Home className="w-3.5 h-3.5" /> Back to site
          </Link>
        </div>
      )}
      {showBrand && (
        <div className="p-3 border-t border-sidebar-border text-xs text-muted-foreground">
          <div className="px-3 py-1">Support</div>
          <div className="px-3">{operator!.branding.supportPhone}</div>
          <div className="px-3 truncate">{operator!.branding.supportEmail}</div>
        </div>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:block">{sidebar}</div>
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
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/60 border border-transparent focus:border-ring focus:bg-background outline-none text-sm transition-colors"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {role === "subscriber" && (
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate({ to: "/subscriber/notifications" })}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            )}
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
                <DropdownMenuLabel>{brandLabel(role)} Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role === "subscriber" && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/subscriber/profile" })}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => { const to = logoutTarget(role); logout(); navigate({ to }); }}>
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
