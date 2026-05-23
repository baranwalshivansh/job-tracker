import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchApplicants, updateApplicationStatus } from "../redux/applicationSlice.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { applicationStatuses } from "../utils/constants.js";

const Applicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { applicantsJob, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchApplicants(id));
  }, [dispatch, id]);

  const handleStatus = async (applicationId, status) => {
    const result = await dispatch(updateApplicationStatus({ id: applicationId, status }));
    if (updateApplicationStatus.fulfilled.match(result)) {
      toast.success("Status updated");
      dispatch(fetchApplicants(id));
    } else {
      toast.error(result.payload || "Status update failed");
    }
  };

  if (loading || !applicantsJob) return <Loader />;

  const applications = applicantsJob.applications || [];

  return (
    <section className="page-shell py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Applicants</h1>
        <p className="mt-1 text-sm text-slate-600">{applicantsJob.title}</p>
      </div>
      {applications.length ? (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Skills</th>
                  <th className="px-4 py-3">Resume</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-4 py-3 font-semibold text-ink">{application.applicant?.fullname}</td>
                    <td className="px-4 py-3 text-slate-600">{application.applicant?.email}</td>
                    <td className="px-4 py-3 text-slate-600">{application.applicant?.profile?.skills?.join(", ") || "Not added"}</td>
                    <td className="px-4 py-3">
                      {application.applicant?.profile?.resume ? (
                        <a className="font-semibold text-brand" href={application.applicant.profile.resume} target="_blank" rel="noreferrer">Resume</a>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                    <td className="px-4 py-3">
                      <select className="input max-w-36" value={application.status} onChange={(e) => handleStatus(application._id, e.target.value)}>
                        {applicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No applicants yet" message="Applications will appear here when students apply." />
      )}
    </section>
  );
};

export default Applicants;
