import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Code,
  GraduationCap,
  Megaphone,
  Palette,
  Quote,
  UserCheck,
} from "lucide-react";
import HeroSection from "../components/landing/HeroSection.jsx";
import { jobCategories, landingStats, testimonials, topCompanies } from "../utils/constants.js";

const iconMap = {
  Code,
  BarChart3,
  Palette,
  Megaphone,
  GraduationCap,
  Briefcase,
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4 },
};

const Home = () => {
  return (
    <>
      <HeroSection />

      <section className="border-b border-surface-border bg-surface py-10">
        <div className="page-shell">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {landingStats.map((stat) => (
              <motion.div key={stat.label} {...fadeUp} className="text-center md:text-left">
                <p className="text-2xl font-bold text-ink sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div {...fadeUp} className="panel p-8">
            <span className="badge bg-brand-light text-brand">For students</span>
            <h2 className="section-title mt-4">From campus to your first offer</h2>
            <p className="section-subtitle">
              Build a complete profile, upload your resume, and apply to internships and fresher roles with one click. Track every application status.
            </p>
            <Link to="/register" className="btn-primary mt-6">
              Join as student
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div {...fadeUp} className="panel p-8">
            <span className="badge bg-emerald-50 text-emerald-700">For recruiters</span>
            <h2 className="section-title mt-4">Hire interns without the noise</h2>
            <p className="section-subtitle">
              Create companies, post targeted openings, and review applicants with skills, bios, and resumes — no fake metrics, just your pipeline.
            </p>
            <Link to="/register" className="btn-primary mt-6">
              Join as recruiter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="categories" className="border-y border-surface-border bg-surface-muted py-16">
        <div className="page-shell">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <h2 className="section-title">Explore by category</h2>
            <p className="section-subtitle mx-auto">Find roles that match your degree, skills, and career goals.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobCategories.map((cat) => {
              const Icon = iconMap[cat.icon] || Briefcase;
              return (
                <motion.div key={cat.name} {...fadeUp} className="panel flex items-center gap-4 p-5 transition hover:shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{cat.name}</p>
                    <p className="text-sm text-ink-muted">{cat.count} openings</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <motion.div {...fadeUp} className="mb-8 text-center">
          <h2 className="section-title">Companies hiring on CampusHire</h2>
          <p className="section-subtitle mx-auto">Startups and growth teams actively recruiting students.</p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {topCompanies.map((name) => (
            <span key={name} className="rounded-lg border border-surface-border bg-surface px-5 py-3 text-sm font-semibold text-ink-muted shadow-sm">
              {name}
            </span>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-surface-border bg-surface py-16">
        <div className="page-shell">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle mx-auto">Three steps from sign-up to application — or hire.</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Create your profile", desc: "Students add skills & resume. Recruiters set up company profiles.", icon: UserCheck },
              { step: "02", title: "Discover or post roles", desc: "Search internships and jobs with filters. Recruiters publish openings.", icon: Briefcase },
              { step: "03", title: "Apply or review", desc: "One-click apply with tracking. Recruiters update applicant status.", icon: GraduationCap },
            ].map(({ step, title, desc, icon: Icon }) => (
              <motion.div key={step} {...fadeUp} className="relative panel p-6">
                <span className="text-4xl font-bold text-slate-100">{step}</span>
                <Icon className="mt-4 h-6 w-6 text-brand" />
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <motion.div {...fadeUp} className="mb-10 text-center">
          <h2 className="section-title">What people say</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <motion.blockquote key={t.name} {...fadeUp} className="panel flex flex-col p-6">
              <Quote className="h-8 w-8 text-brand/30" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 border-t border-surface-border pt-4">
                <p className="font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-ink-muted">{t.role} · {t.company}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand to-blue-600 py-16 text-white">
        <div className="page-shell text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold">Ready to move your career forward?</h2>
            <p className="mx-auto mt-3 max-w-lg text-blue-100">
              Join thousands of students and recruiters already using CampusHire.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="inline-flex min-h-10 items-center rounded-lg bg-white px-6 py-2 text-sm font-semibold text-brand hover:bg-blue-50">
                Create free account
              </Link>
              <Link to="/login" className="inline-flex min-h-10 items-center rounded-lg border border-white/40 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10">
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
