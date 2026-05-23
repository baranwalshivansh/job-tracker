const EmptyState = ({ title, message, action }) => {
  return (
    <div className="panel flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-brand">JP</div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {message && <p className="max-w-md text-sm text-slate-600">{message}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
