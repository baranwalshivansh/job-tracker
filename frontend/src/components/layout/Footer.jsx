import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-surface-border bg-surface">
      <div className="page-shell py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                <Briefcase className="h-4 w-4" />
              </span>
              CampusHire
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              The career platform built for students, freshers, and recruiters hiring for internships and early-career roles.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">For students</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li><Link className="hover:text-brand" to="/register">Create account</Link></li>
              <li><Link className="hover:text-brand" to="/jobs">Browse jobs</Link></li>
              <li><Link className="hover:text-brand" to="/login">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">For recruiters</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li><Link className="hover:text-brand" to="/register">Post openings</Link></li>
              <li><Link className="hover:text-brand" to="/login">Recruiter login</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface-border pt-8 text-sm text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} CampusHire. All rights reserved.</p>
          <p>Built for campus hiring — internships, fresher roles, and growth teams.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
