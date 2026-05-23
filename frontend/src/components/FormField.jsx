import { cn } from "../utils/cn.js";

const FormField = ({ label, error, hint, children, className }) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="block text-sm font-medium text-ink">{label}</label>}
      {children}
      {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
