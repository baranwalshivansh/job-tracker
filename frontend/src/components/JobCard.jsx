import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, MapPin } from "lucide-react";
import Card from "./ui/Card.jsx";
import Avatar from "./ui/Avatar.jsx";
import { formatSalary } from "../utils/format.js";
import { cn } from "../utils/cn.js";

const JobCard = ({ job, saved, onToggleSave, index = 0 }) => {
  const requirements = job.requirements || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card hover className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar src={job.company?.logo} name={job.company?.name} size="md" />
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-ink">{job.title}</h3>
              <p className="truncate text-sm text-ink-muted">{job.company?.name || "Company"}</p>
            </div>
          </div>
          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(job._id)}
              className={cn(
                "shrink-0 rounded-lg p-2 transition",
                saved ? "bg-brand-light text-brand" : "text-slate-400 hover:bg-slate-100 hover:text-ink"
              )}
              aria-label={saved ? "Remove from saved" : "Save job"}
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
            </button>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">{job.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="badge bg-slate-100 text-slate-700">{job.jobType}</span>
          <span className="flex items-center gap-1 text-ink-muted">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          {job.experienceLevel !== undefined && (
            <span className="badge bg-brand-light text-brand">{job.experienceLevel} yrs exp</span>
          )}
        </div>

        {requirements.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {requirements.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-md bg-slate-50 px-2 py-0.5 text-xs text-ink-muted">
                {skill}
              </span>
            ))}
            {requirements.length > 3 && (
              <span className="text-xs text-ink-faint">+{requirements.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-surface-border pt-4">
          <div>
            <p className="text-sm font-semibold text-ink">{formatSalary(job.salary)}</p>
            <p className="text-xs text-ink-muted">{job.position} openings</p>
          </div>
          <Link to={`/jobs/${job._id}`} className="btn-secondary !min-h-9 text-xs">
            View role
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCard;
