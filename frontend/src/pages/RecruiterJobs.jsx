import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecruiterJobs } from "../redux/jobSlice.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const RecruiterJobs = () => {
  const dispatch = useDispatch();
  const { recruiterJobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <section className="page-shell py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Recruiter jobs</h1>
          <p className="mt-1 text-sm text-slate-600">Post, update, and review applicants.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn-primary">Post job</Link>
      </div>
      {recruiterJobs.length ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Salary</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recruiterJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-4 py-3 font-semibold text-ink">{job.title}</td>
                    <td className="px-4 py-3 text-slate-600">{job.company?.name}</td>
                    <td className="px-4 py-3 text-slate-600">{job.location}</td>
                    <td className="px-4 py-3 text-slate-600">Rs {Number(job.salary || 0).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-slate-600">{job.applications?.length || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link className="font-semibold text-brand" to={`/recruiter/jobs/${job._id}/edit`}>Edit</Link>
                        <Link className="font-semibold text-brand" to={`/recruiter/jobs/${job._id}/applicants`}>Applicants</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No jobs posted yet" message="Create your first job after setting up a company." action={<Link className="btn-primary" to="/recruiter/jobs/new">Post job</Link>} />
      )}
    </section>
  );
};

export default RecruiterJobs;
