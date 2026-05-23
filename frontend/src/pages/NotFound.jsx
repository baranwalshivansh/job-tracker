import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page-shell flex min-h-[calc(100vh-64px)] items-center justify-center py-10">
      <div className="panel max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you requested does not exist.</p>
        <Link className="btn-primary mt-6" to="/">Go home</Link>
      </div>
    </section>
  );
};

export default NotFound;
