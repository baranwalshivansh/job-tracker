import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Bookmark, Building2, Clock, IndianRupee, MapPin, Users } from "lucide-react";
import toast from "react-hot-toast";
import { applyForJob } from "../redux/applicationSlice.js";
import { fetchJobById, fetchJobs } from "../redux/jobSlice.js";
import Loader from "../components/Loader.jsx";
import JobCard from "../components/JobCard.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import useSavedJobs from "../hooks/useSavedJobs.js";
import { formatSalary } from "../utils/format.js";

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, loading, jobs } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const { isSaved, toggleSave } = useSavedJobs();

  useEffect(() => {
    dispatch(fetchJobById(id));
    if (!jobs.length) dispatch(fetchJobs(""));
  }, [dispatch, id, jobs.length]);

  const hasApplied = selectedJob?.applications?.some((application) => {
    const applicantId = application.applicant?._id || application.applicant;
    return applicantId === user?._id;
  });

  const similarJobs = useMemo(() => {
    if (!selectedJob) return [];
    return jobs
      .filter((j) => j._id !== selectedJob._id && (j.jobType === selectedJob.jobType || j.location === selectedJob.location))
      .slice(0, 3);
  }, [jobs, selectedJob]);

  const handleApply = async () => {
    const result = await dispatch(applyForJob(id));
    if (applyForJob.fulfilled.match(result)) {
      toast.success("Application submitted!");
      dispatch(fetchJobById(id));
    } else {
      toast.error(result.payload || "Unable to apply");
    }
  };

  if (loading || !selectedJob) return <Loader />;

  const isStudent = user?.role === "student";
  const saved = isSaved(selectedJob._id);

  return (
    <div className="pb-24 lg:pb-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="panel p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar src={selectedJob.company?.logo} name={selectedJob.company?.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand">{selectedJob.company?.name || "Company"}</p>
              <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{selectedJob.title}</h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-muted">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedJob.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{selectedJob.jobType}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" />{selectedJob.applications?.length || 0} applicants</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-y border-surface-border py-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <IndianRupee className="h-5 w-5 text-brand" />
              <div>
                <p className="text-xs text-ink-muted">Salary</p>
                <p className="font-semibold">{formatSalary(selectedJob.salary)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-brand" />
              <div>
                <p className="text-xs text-ink-muted">Experience</p>
                <p className="font-semibold">{selectedJob.experienceLevel} years</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Openings</p>
              <p className="font-semibold">{selectedJob.position} positions</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-ink">About the role</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink-muted">{selectedJob.description}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">Skills & requirements</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedJob.requirements?.map((item) => (
                  <span key={item} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-ink-muted">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {selectedJob.company?.description && (
              <div>
                <h2 className="text-lg font-semibold text-ink">About {selectedJob.company.name}</h2>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{selectedJob.company.description}</p>
              </div>
            )}
          </div>
        </motion.div>

        <aside className="hidden lg:block">
          <div className="panel sticky top-24 space-y-4 p-6">
            {isStudent ? (
              <>
                <button className="btn-primary w-full" onClick={handleApply} disabled={hasApplied}>
                  {hasApplied ? "Already applied" : "Apply now"}
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full"
                  onClick={() => toggleSave(selectedJob._id)}
                >
                  <Bookmark className={`h-4 w-4 ${saved ? "fill-brand text-brand" : ""}`} />
                  {saved ? "Saved" : "Save job"}
                </button>
              </>
            ) : (
              <Link className="btn-primary w-full text-center" to={`/recruiter/jobs/${selectedJob._id}/applicants`}>
                View applicants
              </Link>
            )}
            <p className="text-center text-xs text-ink-muted">
              {selectedJob.applications?.length || 0} people have applied
            </p>
          </div>
        </aside>
      </div>

      {similarJobs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-lg font-semibold text-ink">Similar roles</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {similarJobs.map((job, i) => (
              <JobCard key={job._id} job={job} index={i} saved={isSaved(job._id)} onToggleSave={isStudent ? toggleSave : undefined} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-surface-border bg-surface/95 p-4 backdrop-blur lg:hidden">
        <div className="flex gap-2">
          {isStudent ? (
            <>
              <button className="btn-primary flex-1" onClick={handleApply} disabled={hasApplied}>
                {hasApplied ? "Applied" : "Apply"}
              </button>
              <button type="button" className="btn-secondary" onClick={() => toggleSave(selectedJob._id)}>
                <Bookmark className={`h-4 w-4 ${saved ? "fill-brand text-brand" : ""}`} />
              </button>
            </>
          ) : (
            <Link className="btn-primary flex-1 text-center" to={`/recruiter/jobs/${selectedJob._id}/applicants`}>
              Applicants
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
