import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../redux/companySlice.js";
import { fetchRecruiterJobs } from "../redux/jobSlice.js";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.companies);
  const { recruiterJobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

  const applicants = recruiterJobs.reduce((count, job) => count + (job.applications?.length || 0), 0);

  return (
    <section className="page-shell py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink">Recruiter dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Manage companies, jobs, and applicants.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/recruiter/companies/new" className="btn-secondary">New company</Link>
          <Link to="/recruiter/jobs/new" className="btn-primary">Post job</Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5"><p className="text-sm text-slate-500">Companies</p><p className="mt-2 text-3xl font-bold">{companies.length}</p></div>
        <div className="panel p-5"><p className="text-sm text-slate-500">Jobs</p><p className="mt-2 text-3xl font-bold">{recruiterJobs.length}</p></div>
        <div className="panel p-5"><p className="text-sm text-slate-500">Applicants</p><p className="mt-2 text-3xl font-bold">{applicants}</p></div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Recent jobs</h2>
            <Link to="/recruiter/jobs" className="text-sm font-semibold text-brand">View all</Link>
          </div>
          <div className="space-y-3">
            {recruiterJobs.slice(0, 5).map((job) => (
              <div key={job._id} className="rounded-md border border-slate-200 p-3">
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-slate-500">{job.company?.name} - {job.applications?.length || 0} applicants</p>
              </div>
            ))}
            {!recruiterJobs.length && <p className="text-sm text-slate-500">No jobs posted yet.</p>}
          </div>
        </div>
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Companies</h2>
            <Link to="/recruiter/companies" className="text-sm font-semibold text-brand">Manage</Link>
          </div>
          <div className="space-y-3">
            {companies.slice(0, 5).map((company) => (
              <div key={company._id} className="rounded-md border border-slate-200 p-3">
                <p className="font-semibold">{company.name}</p>
                <p className="text-sm text-slate-500">{company.location || "Location not set"}</p>
              </div>
            ))}
            {!companies.length && <p className="text-sm text-slate-500">Create a company before posting jobs.</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterDashboard;
