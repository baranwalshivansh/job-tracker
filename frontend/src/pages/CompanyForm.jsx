import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createCompany, fetchCompanyById, updateCompany } from "../redux/companySlice.js";
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";

const CompanyForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCompany, loading } = useSelector((state) => state.companies);
  const [form, setForm] = useState({ name: "", description: "", website: "", location: "", file: null });

  useEffect(() => {
    if (isEdit) dispatch(fetchCompanyById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedCompany?._id === id) {
      setForm({
        name: selectedCompany.name || "",
        description: selectedCompany.description || "",
        website: selectedCompany.website || "",
        location: selectedCompany.location || "",
        file: null,
      });
    }
  }, [selectedCompany, isEdit, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;
    if (isEdit) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      result = await dispatch(updateCompany({ id, formData }));
    } else {
      result = await dispatch(createCompany({ companyName: form.name }));
    }

    if (createCompany.fulfilled.match(result) || updateCompany.fulfilled.match(result)) {
      toast.success(isEdit ? "Company updated" : "Company created");
      navigate(isEdit ? "/recruiter/companies" : `/recruiter/companies/${result.payload._id}`);
    } else {
      toast.error(result.payload || "Company save failed");
    }
  };

  if (isEdit && loading && !selectedCompany) return <Loader />;

  return (
    <section className="page-shell py-8">
      <form onSubmit={handleSubmit} className="panel mx-auto max-w-2xl space-y-5 p-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">{isEdit ? "Edit company" : "Create company"}</h1>
          <p className="mt-1 text-sm text-slate-600">{isEdit ? "Update public company details and logo." : "Start with a company name, then add details."}</p>
        </div>
        <FormField label="Company name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        {isEdit && (
          <>
            <FormField label="Description"><textarea className="input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Website"><input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></FormField>
              <FormField label="Location"><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
            </div>
            <FormField label="Company logo"><input className="input" type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} /></FormField>
          </>
        )}
        <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save company"}</button>
      </form>
    </section>
  );
};

export default CompanyForm;
