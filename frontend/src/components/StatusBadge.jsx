import { cn } from "../utils/cn.js";

const styles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || "pending";
  return (
    <span className={cn("badge capitalize ring-1 ring-inset", styles[key] || styles.pending)}>
      {status || "pending"}
    </span>
  );
};

export default StatusBadge;
