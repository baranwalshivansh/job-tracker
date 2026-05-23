import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle2 } from "lucide-react";

const highlights = [
  "Apply with one profile & resume",
  "Track application status in real time",
  "Recruiters review skills & resumes",
];

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <section className="min-h-[calc(100vh-64px)] bg-surface-muted">
      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-brand-dark p-10 text-white lg:flex"
        >
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Briefcase className="h-5 w-5" />
            </span>
            CampusHire
          </Link>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Your career journey starts here.</h2>
            <p className="mt-4 max-w-md text-slate-300">
              Students discover internships. Recruiters post roles and manage applicants — all in one focused platform.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-slate-400">Trusted by students across India&apos;s top campuses.</p>
        </motion.div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-2 font-bold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                  <Briefcase className="h-4 w-4" />
                </span>
                CampusHire
              </Link>
            </div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-ink">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
            </div>
            <div className="panel p-6 shadow-soft">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
