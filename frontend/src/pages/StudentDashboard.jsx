import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Briefcase, ClipboardList, Search, Upload } from "lucide-react";
import { fetchAppliedJobs } from "../redux/applicationSlice.js";
import { fetchJobs } from "../redux/jobSlice.js";
import JobCard from "../components/JobCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { JobGridSkeleton } from "../components/ui/Skeleton.jsx";
import { useProfileCompletion } from "../hooks/useProfileCompletion.js";
import useSavedJobs from "../hooks/useSavedJobs.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/format.js";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { appliedJobs, loading: appsLoading } = useSelector((state) => state.applications);
  const { percent, missing } = useProfileCompletion(user);
  const { savedIds, isSaved, toggleSave } = useSavedJobs();

  useEffect(() => {
    dispatch(fetchJobs(""));
    dispatch(fetchAppliedJobs());
  }, [dispatch]);

  const savedJobsList = useMemo(
    () => jobs.filter((j) => savedIds.includes(j._id)),
    [jobs, savedIds]
  );

  const recommended = useMemo(() => {
    const skills = user?.profile?.skills || [];
    if (!skills.length) return jobs.slice(0, 3);
    return jobs
      .filter((job) =>
        (job.requirements || []).some((req) =>
          skills.some((s) => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()))
        )
      )
      .slice(0, 3);
  }, [jobs, user]);

  const statusCounts = useMemo(() => {
    return appliedJobs.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      { pending: 0, accepted: 0, rejected: 0 }
    );
  }, [appliedJobs]);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Student dashboard"
        title={`Welcome back, ${user?.fullname?.split(" ")[0] || "there"}`}
        subtitle="Track applications, discover roles, and complete your profile."
        actions={
          <Link to="/jobs" className="btn-primary">
            <Search className="h-4 w-4" />
            Browse jobs
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Applications", value: appliedJobs.length, icon: ClipboardList, to: "/applied-jobs" },
          { label: "Saved jobs", value: savedIds.length, icon: Bookmark, to: "/jobs" },
          { label: "Open roles", value: jobs.length, icon: Briefcase, to: "/jobs" },
          { label: "Profile", value: `${percent}%`, icon: Upload, to: "/profile" },
        ].map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="panel group p-5 transition hover:shadow-soft">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-brand" />
              <ArrowRight className="h-4 w-4 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-brand" />
            </div>
            <p className="mt-4 text-2xl font-bold text-ink">{value}</p>
            <p className="text-sm text-ink-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-1">
          <h2 className="font-semibold text-ink">Profile completion</h2>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full rounded-full bg-brand"
            />
          </div>
          <p className="mt-2 text-sm text-ink-muted">{percent}% complete</p>
          {missing.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-ink-muted">
              {missing.slice(0, 4).map((item) => (
                <li key={item}>· Add {item.toLowerCase()}</li>
              ))}
            </ul>
          )}
          <Link to="/profile" className="btn-secondary mt-5 w-full">
            Complete profile
          </Link>
        </div>

        <div className="panel p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Application tracker</h2>
            <Link to="/applied-jobs" className="text-sm font-semibold text-brand">
              View all
            </Link>
          </div>
          <div className="mb-4 flex flex-wrap gap-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="rounded-lg bg-slate-50 px-4 py-2">
                <StatusBadge status={status} />
                <p className="mt-1 text-lg font-bold text-ink">{count}</p>
              </div>
            ))}
          </div>
          {appsLoading ? (
            <p className="text-sm text-ink-muted">Loading applications...</p>
          ) : appliedJobs.length ? (
            <div className="space-y-2">
              {appliedJobs.slice(0, 4).map((app) => (
                <div key={app._id} className="flex items-center justify-between rounded-lg border border-surface-border px-4 py-3">
                  <div>
                    <p className="font-medium text-ink">{app.job?.title}</p>
                    <p className="text-xs text-ink-muted">{app.job?.company?.name} · {formatDate(app.createdAt)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">No applications yet. Start browsing jobs.</p>
          )}
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Recommended for you</h2>
          <Link to="/jobs" className="text-sm font-semibold text-brand">See all</Link>
        </div>
        {jobsLoading ? (
          <JobGridSkeleton count={3} />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {recommended.map((job, i) => (
              <JobCard key={job._id} job={job} index={i} saved={isSaved(job._id)} onToggleSave={toggleSave} />
            ))}
          </div>
        )}
      </section>

      {savedJobsList.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-ink">Saved jobs</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {savedJobsList.slice(0, 3).map((job, i) => (
              <JobCard key={job._id} job={job} index={i} saved onToggleSave={toggleSave} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudentDashboard;
