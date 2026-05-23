import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Briefcase, Building2, PlusCircle, Users } from "lucide-react";
import { fetchCompanies } from "../redux/companySlice.js";
import { fetchRecruiterJobs } from "../redux/jobSlice.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.companies);
  const { recruiterJobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

  const applicants = recruiterJobs.reduce((count, job) => count + (job.applications?.length || 0), 0);
  const pendingReview = recruiterJobs.reduce(
    (count, job) => count + (job.applications?.filter((a) => a.status === "pending")?.length || 0),
    0
  );

  const topJobsByApplicants = useMemo(
    () => [...recruiterJobs].sort((a, b) => (b.applications?.length || 0) - (a.applications?.length || 0)).slice(0, 5),
    [recruiterJobs]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Recruiter"
        title="Hiring overview"
        subtitle="Manage companies, postings, and applicant pipelines."
        actions={
          <>
            <Link to="/recruiter/companies/new" className="btn-secondary">
              <Building2 className="h-4 w-4" />
              New company
            </Link>
            <Link to="/recruiter/jobs/new" className="btn-primary">
              <PlusCircle className="h-4 w-4" />
              Post job
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Companies", value: companies.length, icon: Building2 },
          { label: "Active jobs", value: recruiterJobs.length, icon: Briefcase },
          { label: "Total applicants", value: applicants, icon: Users },
          { label: "Pending review", value: pendingReview, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="panel p-5">
            <Icon className="h-5 w-5 text-brand" />
            <p className="mt-4 text-2xl font-bold text-ink">{value}</p>
            <p className="text-sm text-ink-muted">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Jobs with most applicants</h2>
            <Link to="/recruiter/jobs" className="text-sm font-semibold text-brand">View all</Link>
          </div>
          <div className="space-y-3">
            {topJobsByApplicants.length ? (
              topJobsByApplicants.map((job) => (
                <Link
                  key={job._id}
                  to={`/recruiter/jobs/${job._id}/applicants`}
                  className="flex items-center justify-between rounded-lg border border-surface-border px-4 py-3 transition hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-ink">{job.title}</p>
                    <p className="text-xs text-ink-muted">{job.company?.name}</p>
                  </div>
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                    {job.applications?.length || 0} applicants
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-ink-muted">Post your first job to start receiving applications.</p>
            )}
          </div>
        </div>

        <div className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Your companies</h2>
            <Link to="/recruiter/companies" className="text-sm font-semibold text-brand">Manage</Link>
          </div>
          <div className="space-y-3">
            {companies.slice(0, 5).map((company) => (
              <div key={company._id} className="flex items-center justify-between rounded-lg border border-surface-border px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{company.name}</p>
                  <p className="text-xs text-ink-muted">{company.location || "Add location"}</p>
                </div>
                <Link to={`/recruiter/companies/${company._id}`} className="text-xs font-semibold text-brand">
                  Edit
                </Link>
              </div>
            ))}
            {!companies.length && (
              <p className="text-sm text-ink-muted">Create a company before posting jobs.</p>
            )}
          </div>
        </div>
      </div>

      {recruiterJobs.some((j) => j.applications?.length) && (
        <div className="panel p-6">
          <h2 className="mb-4 font-semibold text-ink">Recent application activity</h2>
          <div className="space-y-2">
            {recruiterJobs
              .flatMap((job) =>
                (job.applications || []).slice(0, 2).map((app) => ({
                  ...app,
                  jobTitle: job.title,
                  jobId: job._id,
                }))
              )
              .slice(0, 6)
              .map((app) => (
                <div key={app._id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{app.applicant?.fullname || "Applicant"}</span>
                    <span className="text-ink-muted"> applied to {app.jobTitle}</span>
                  </span>
                  <StatusBadge status={app.status} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
