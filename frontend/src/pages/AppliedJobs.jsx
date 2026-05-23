import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppliedJobs } from "../redux/applicationSlice.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const AppliedJobs = () => {
  const dispatch = useDispatch();
  const { appliedJobs, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchAppliedJobs());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <section className="page-shell py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Applied jobs</h1>
        <p className="mt-1 text-sm text-slate-600">Track every application and recruiter decision.</p>
      </div>
      {appliedJobs.length ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {appliedJobs.map((application) => (
                  <tr key={application._id}>
                    <td className="px-4 py-3 font-semibold text-ink">{application.job?.title}</td>
                    <td className="px-4 py-3 text-slate-600">{application.job?.company?.name}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                    <td className="px-4 py-3"><Link className="font-semibold text-brand" to={`/jobs/${application.job?._id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No applications yet" message="Browse jobs and apply when you find a match." action={<Link className="btn-primary" to="/jobs">Browse jobs</Link>} />
      )}
    </section>
  );
};

export default AppliedJobs;
