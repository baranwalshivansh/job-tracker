import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Search,
  User,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn.js";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/jobs", label: "Browse jobs", icon: Search },
  { to: "/applied-jobs", label: "Applications", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: User },
];

const recruiterLinks = [
  { to: "/recruiter", label: "Overview", icon: LayoutDashboard },
  { to: "/recruiter/jobs", label: "Manage jobs", icon: Briefcase },
  { to: "/recruiter/jobs/new", label: "Post job", icon: PlusCircle },
  { to: "/recruiter/companies", label: "Companies", icon: Building2 },
];

const linkClass = ({ isActive }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-brand-light text-brand"
      : "text-ink-muted hover:bg-slate-100 hover:text-ink"
  );

const DashboardLayout = ({ role }) => {
  const links = role === "recruiter" ? recruiterLinks : studentLinks;
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-surface-border bg-surface p-4">
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {role === "recruiter" ? "Recruiter" : "Student"}
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={() => setMobileOpen(false)} end={to === "/recruiter" || to === "/dashboard"}>
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <div className="hidden w-60 shrink-0 lg:block">{sidebar}</div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-60 pt-16 lg:hidden"
            >
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 border-b border-surface-border bg-surface px-4 py-3 lg:hidden">
          <button
            type="button"
            className="btn-ghost !min-h-9 !px-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-ink">Menu</span>
          {mobileOpen && (
            <button type="button" className="ml-auto btn-ghost !min-h-9 !px-2" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="page-shell py-6 lg:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
