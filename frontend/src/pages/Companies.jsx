import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle } from "lucide-react";
import { fetchCompanies } from "../redux/companySlice.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import { Building2 } from "lucide-react";

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, loading } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Manage the organizations you hire for."
        actions={
          <Link to="/recruiter/companies/new" className="btn-primary">
            <PlusCircle className="h-4 w-4" />
            Create company
          </Link>
        }
      />

      {companies.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <article key={company._id} className="panel flex flex-col p-5">
              <div className="flex items-center gap-3">
                <Avatar src={company.logo} name={company.name} size="md" />
                <div>
                  <h2 className="font-semibold text-ink">{company.name}</h2>
                  <p className="text-sm text-ink-muted">{company.location || "Add location"}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 line-clamp-3 text-sm text-ink-muted">
                {company.description || "No description yet."}
              </p>
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="mt-2 text-xs font-medium text-brand hover:underline">
                  {company.website}
                </a>
              )}
              <Link className="btn-secondary mt-5 w-full" to={`/recruiter/companies/${company._id}`}>
                Edit company
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          message="Create a company before posting jobs."
          action={<Link className="btn-primary" to="/recruiter/companies/new">Create company</Link>}
        />
      )}
    </div>
  );
};

export default Companies;
