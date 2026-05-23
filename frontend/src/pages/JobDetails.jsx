import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { applyForJob } from "../redux/applicationSlice.js";
import { fetchJobById } from "../redux/jobSlice.js";
import Loader from "../components/Loader.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  const hasApplied = selectedJob?.applications?.some((application) => {
    const applicantId = application.applicant?._id || application.applicant;
    return applicantId === user?._id;
  });

  const handleApply = async () => {
    const result = await dispatch(applyForJob(id));
    if (applyForJob.fulfilled.match(result)) {
      toast.success("Application submitted");
      dispatch(fetchJobById(id));
    } else {
      toast.error(result.payload || "Unable to apply");
    }
  };

  if (loading || !selectedJob) return <Loader />;

  return (
    <section className="page-shell py-8">
      <div className="panel p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-semibold text-brand">{selectedJob.company?.name || "Company"}</p>
            <h1 className="mt-1 text-3xl font-bold text-ink">{selectedJob.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{selectedJob.location} - {selectedJob.jobType}</p>
          </div>
          {user.role === "student" ? (
            <button className="btn-primary" onClick={handleApply} disabled={hasApplied}>{hasApplied ? "Already applied" : "Apply now"}</button>
          ) : (
            <Link className="btn-secondary" to={`/recruiter/jobs/${selectedJob._id}/applicants`}>View applicants</Link>
          )}
        </div>
        <div className="mt-6 grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-4">
          <div><p className="text-xs text-slate-500">Salary</p><p className="font-semibold">Rs {Number(selectedJob.salary || 0).toLocaleString("en-IN")}</p></div>
          <div><p className="text-xs text-slate-500">Experience</p><p className="font-semibold">{selectedJob.experienceLevel} years</p></div>
          <div><p className="text-xs text-slate-500">Openings</p><p className="font-semibold">{selectedJob.position}</p></div>
          <div><p className="text-xs text-slate-500">Applicants</p><p className="font-semibold">{selectedJob.applications?.length || 0}</p></div>
        </div>
        <div className="mt-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-ink">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selectedJob.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">Requirements</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedJob.requirements?.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
