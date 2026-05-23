import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../redux/companySlice.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, loading } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <section className="page-shell py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Companies</h1>
          <p className="mt-1 text-sm text-slate-600">Create and maintain recruiter-owned companies.</p>
        </div>
        <Link to="/recruiter/companies/new" className="btn-primary">Create company</Link>
      </div>
      {companies.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <article key={company._id} className="panel p-5">
              <div className="flex items-center gap-3">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-12 w-12 rounded-md object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 font-bold text-brand">
                    {company.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-ink">{company.name}</h2>
                  <p className="text-sm text-slate-500">{company.location || "Location not set"}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-slate-600">{company.description || "No description yet."}</p>
              <Link className="btn-secondary mt-5 w-full" to={`/recruiter/companies/${company._id}`}>Edit company</Link>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No companies yet" message="Create a company before posting jobs." action={<Link className="btn-primary" to="/recruiter/companies/new">Create company</Link>} />
      )}
    </section>
  );
};

export default Companies;
