const styles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const StatusBadge = ({ status }) => {
  const value = status || "pending";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${styles[value] || styles.pending}`}>
      {value}
    </span>
  );
};

export default StatusBadge;
