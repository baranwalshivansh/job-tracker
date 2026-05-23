import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApplicants, updateApplicationStatus } from "../redux/applicationSlice.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import { applicationStatuses } from "../utils/constants.js";
import { Users } from "lucide-react";

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
    <div>
      <PageHeader
        title="Applicants"
        subtitle={applicantsJob.title}
        actions={
          <Link to={`/recruiter/jobs/${id}/edit`} className="btn-secondary text-sm">
            Edit job
          </Link>
        }
      />

      {applications.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {applications.map((application) => (
            <article key={application._id} className="panel p-5">
              <div className="flex items-start gap-4">
                <Avatar
                  src={application.applicant?.profile?.profilePhoto}
                  name={application.applicant?.fullname}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{application.applicant?.fullname}</p>
                  <p className="flex items-center gap-1 text-sm text-ink-muted">
                    <Mail className="h-3.5 w-3.5" />
                    {application.applicant?.email}
                  </p>
                  <p className="mt-2 text-xs text-ink-muted">
                    Skills: {application.applicant?.profile?.skills?.join(", ") || "Not listed"}
                  </p>
                  {application.applicant?.profile?.bio && (
                    <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{application.applicant.profile.bio}</p>
                  )}
                </div>
                <StatusBadge status={application.status} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-surface-border pt-4">
                {application.applicant?.profile?.resume ? (
                  <a
                    className="btn-secondary !min-h-9 text-xs"
                    href={application.applicant.profile.resume}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText className="h-4 w-4" />
                    Resume
                  </a>
                ) : (
                  <span className="text-xs text-ink-faint">No resume uploaded</span>
                )}
                <select
                  className="input ml-auto max-w-36 !min-h-9 text-xs"
                  value={application.status}
                  onChange={(e) => handleStatus(application._id, e.target.value)}
                >
                  {applicationStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          message="Applications will appear here when students apply to this role."
        />
      )}
    </div>
  );
};

export default Applicants;
