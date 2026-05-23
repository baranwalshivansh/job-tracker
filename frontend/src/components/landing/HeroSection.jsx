import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";

const HeroSection = () => {
  const { user } = useSelector((state) => state.auth);
  const ctaTo = user?.role === "recruiter" ? "/recruiter" : user ? "/dashboard" : "/register";

  return (
    <section className="relative overflow-hidden border-b border-surface-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.12),transparent)]" />
      <div className="page-shell relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-sm font-semibold text-brand">
            <Sparkles className="h-4 w-4" />
            Built for campus hiring season
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
            Land your first role.{" "}
            <span className="gradient-text">Hire your next intern.</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-ink-muted">
            CampusHire connects students and freshers with internships and entry-level jobs — while giving recruiters a focused pipeline to review real applicants.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={ctaTo} className="btn-primary !px-6">
              {user ? "Go to dashboard" : "Start for free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={user ? "/jobs" : "/register"} className="btn-secondary">
              <Search className="h-4 w-4" />
              Explore openings
            </Link>
          </div>
          <p className="text-sm text-ink-faint">No credit card · Student & recruiter accounts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="panel overflow-hidden p-1 shadow-lift">
            <div className="rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
              <p className="text-sm font-medium text-blue-200">This week on CampusHire</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: "Internships", value: "84" },
                  { label: "Fresher roles", value: "56" },
                  { label: "Remote-friendly", value: "42" },
                  { label: "New today", value: "12" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 p-4">
              {[
                { title: "SDE Intern", company: "Fintech · Bengaluru", tag: "Internship" },
                { title: "Junior Analyst", company: "E-commerce · Remote", tag: "Fresher" },
                { title: "UI Design Intern", company: "SaaS · Hybrid", tag: "Design" },
              ].map((job) => (
                <div key={job.title} className="flex items-center justify-between rounded-lg border border-surface-border px-4 py-3">
                  <div>
                    <p className="font-semibold text-ink">{job.title}</p>
                    <p className="text-xs text-ink-muted">{job.company}</p>
                  </div>
                  <span className="badge bg-brand-light text-brand">{job.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
