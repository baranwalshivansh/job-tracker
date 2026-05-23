import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { logoutUser } from "../redux/authSlice.js";
import Avatar from "./ui/Avatar.jsx";
import { cn } from "../utils/cn.js";

const navClass = ({ isActive }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-brand-light text-brand" : "text-ink-muted hover:bg-slate-100 hover:text-ink"
  );

const publicLinks = [
  { to: "/#how-it-works", label: "How it works" },
  { to: "/#categories", label: "Categories" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDashboard =
    user &&
    (location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/jobs") ||
      location.pathname.startsWith("/applied") ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/recruiter"));

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/");
    setMenuOpen(false);
  };

  const studentLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/jobs", label: "Jobs" },
    { to: "/applied-jobs", label: "Applications" },
  ];

  const recruiterLinks = [
    { to: "/recruiter", label: "Dashboard" },
    { to: "/recruiter/jobs", label: "Jobs" },
  ];

  const authLinks = user?.role === "recruiter" ? recruiterLinks : studentLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/90 backdrop-blur-md">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-ink" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
            <Briefcase className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">CampusHire</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {!user &&
            publicLinks.map((link) => (
              <a key={link.to} href={link.to} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-slate-100">
                {link.label}
              </a>
            ))}
          {user &&
            authLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass} end={link.to === "/recruiter" || link.to === "/dashboard"}>
                {link.label}
              </NavLink>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to={user.role === "recruiter" ? "/recruiter" : "/profile"}
                className="hidden items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100 sm:flex"
              >
                <Avatar src={user.profile?.profilePhoto} name={user.fullname} size="sm" />
                <span className="max-w-28 truncate text-sm font-medium">{user.fullname}</span>
              </Link>
              <button type="button" className="btn-ghost hidden sm:inline-flex" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            className="btn-ghost !min-h-9 !px-2 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-surface-border md:hidden"
          >
            <nav className="page-shell flex flex-col gap-1 py-3">
              {!user &&
                publicLinks.map((link) => (
                  <a key={link.to} href={link.to} className="rounded-lg px-3 py-2.5 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                ))}
              {user &&
                authLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </NavLink>
                ))}
              {user ? (
                <button type="button" className="btn-secondary mt-2 w-full" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link to="/login" className="btn-secondary mt-2 text-center" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {!isDashboard && user && (
        <nav className="page-shell flex gap-1 overflow-x-auto pb-3 md:hidden">
          {authLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
