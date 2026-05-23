import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, PlusCircle } from "lucide-react";
import { fetchRecruiterJobs } from "../redux/jobSlice.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatSalary } from "../utils/format.js";

const RecruiterJobs = () => {
  const dispatch = useDispatch();
  const { recruiterJobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Manage jobs"
        subtitle="Edit postings and review applicants for each role."
        actions={
          <Link to="/recruiter/jobs/new" className="btn-primary">
            <PlusCircle className="h-4 w-4" />
            Post job
          </Link>
        }
      />

      {recruiterJobs.length ? (
        <div className="space-y-3">
          {recruiterJobs.map((job) => (
            <article key={job._id} className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-ink">{job.title}</h2>
                <p className="text-sm text-ink-muted">
                  {job.company?.name} · {job.location} · {formatSalary(job.salary)}
                </p>
                <p className="mt-1 text-xs text-ink-faint">{job.jobType} · {job.applications?.length || 0} applicants</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn-secondary !min-h-9 text-xs">
                  Edit
                </Link>
                <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn-primary !min-h-9 text-xs">
                  Applicants ({job.applications?.length || 0})
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          message="Create your first job after setting up a company."
          action={<Link className="btn-primary" to="/recruiter/jobs/new">Post job</Link>}
        />
      )}
    </div>
  );
};

export default RecruiterJobs;
