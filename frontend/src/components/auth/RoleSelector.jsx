import { GraduationCap, Users } from "lucide-react";
import { cn } from "../../utils/cn.js";

const roles = [
  {
    value: "student",
    label: "Student / Fresher",
    description: "Browse jobs, apply, track applications",
    icon: GraduationCap,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs, manage companies & applicants",
    icon: Users,
  },
];

const RoleSelector = ({ value, onChange }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roles.map(({ value: roleValue, label, description, icon: Icon }) => (
        <button
          key={roleValue}
          type="button"
          onClick={() => onChange(roleValue)}
          className={cn(
            "rounded-xl border-2 p-4 text-left transition",
            value === roleValue
              ? "border-brand bg-brand-light/50"
              : "border-surface-border hover:border-slate-300"
          )}
        >
          <Icon className={cn("h-5 w-5", value === roleValue ? "text-brand" : "text-slate-400")} />
          <p className="mt-2 font-semibold text-ink">{label}</p>
          <p className="mt-1 text-xs text-ink-muted">{description}</p>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
