import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const requirements = job.requirements || [];

  return (
    <article className="panel flex h-full flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        {job.company?.logo ? (
          <img src={job.company.logo} alt={job.company.name} className="h-11 w-11 rounded-md object-cover" />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-sm font-bold text-brand">
            {(job.company?.name || "CO").slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">{job.title}</h3>
          <p className="truncate text-sm text-slate-600">{job.company?.name || "Company"} - {job.location}</p>
        </div>
      </div>
      <p className="line-clamp-3 text-sm text-slate-600">{job.description}</p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{job.jobType}</span>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{job.position} openings</span>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-brand">{job.experienceLevel} yrs</span>
      </div>
      {requirements.length > 0 && (
        <p className="text-xs text-slate-500">Skills: {requirements.slice(0, 4).join(", ")}</p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="text-sm font-semibold text-ink">Rs {Number(job.salary || 0).toLocaleString("en-IN")}</span>
        <Link to={`/jobs/${job._id}`} className="btn-secondary">View details</Link>
      </div>
    </article>
  );
};

export default JobCard;
