import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchAppliedJobs } from "../redux/applicationSlice.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/format.js";
import { ClipboardList } from "lucide-react";

const AppliedJobs = () => {
  const dispatch = useDispatch();
  const { appliedJobs, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchAppliedJobs());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="My applications"
        subtitle="Track every role you've applied to and recruiter decisions."
      />

      {appliedJobs.length ? (
        <div className="space-y-3">
          {appliedJobs.map((application, i) => (
            <motion.div
              key={application._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink">{application.job?.title}</p>
                <p className="text-sm text-ink-muted">{application.job?.company?.name}</p>
                <p className="mt-1 text-xs text-ink-faint">Applied {formatDate(application.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={application.status} />
                <Link to={`/jobs/${application.job?._id}`} className="btn-secondary !min-h-9 text-xs">
                  View job
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          message="Browse openings and apply when you find a role that fits."
          action={<Link className="btn-primary" to="/jobs">Browse jobs</Link>}
        />
      )}
    </div>
  );
};

export default AppliedJobs;
