const Loader = ({ label = "Loading" }) => {
  return (
    <div className="flex min-h-48 items-center justify-center" role="status" aria-label={label}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand" />
      </div>
    </div>
  );
};

export default Loader;
