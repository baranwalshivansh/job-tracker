import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchCompanies } from "../redux/companySlice.js";
import { createJob, fetchJobById, updateJob } from "../redux/jobSlice.js";
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";

const initialForm = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  jobType: "Full Time",
  experience: "",
  position: "",
  companyId: "",
};

const JobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies } = useSelector((state) => state.companies);
  const { selectedJob, loading } = useSelector((state) => state.jobs);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchCompanies());
    if (isEdit) dispatch(fetchJobById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedJob?._id === id) {
      setForm({
        title: selectedJob.title || "",
        description: selectedJob.description || "",
        requirements: selectedJob.requirements?.join(", ") || "",
        salary: selectedJob.salary || "",
        location: selectedJob.location || "",
        jobType: selectedJob.jobType || "Full Time",
        experience: selectedJob.experienceLevel || "",
        position: selectedJob.position || "",
        companyId: selectedJob.company?._id || selectedJob.company || "",
      });
    }
  }, [isEdit, selectedJob, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = isEdit ? updateJob({ id, payload: form }) : createJob(form);
    const result = await dispatch(action);
    if (createJob.fulfilled.match(result) || updateJob.fulfilled.match(result)) {
      toast.success(isEdit ? "Job updated" : "Job posted");
      navigate("/recruiter/jobs");
    } else {
      toast.error(result.payload || "Job save failed");
    }
  };

  if (!companies.length) {
    return (
      <section className="page-shell py-8">
        <div className="panel p-6 text-center">
          <h1 className="text-xl font-bold">Create a company first</h1>
          <p className="mt-2 text-sm text-slate-600">Jobs must belong to one of your recruiter companies.</p>
          <Link className="btn-primary mt-5" to="/recruiter/companies/new">Create company</Link>
        </div>
      </section>
    );
  }

  if (isEdit && loading && !selectedJob) return <Loader />;

  return (
    <section className="page-shell py-8">
      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-5 p-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">{isEdit ? "Edit job" : "Post job"}</h1>
          <p className="mt-1 text-sm text-slate-600">Keep the details concise and searchable.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></FormField>
          <FormField label="Company">
            <select className="input" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} required>
              <option value="">Select company</option>
              {companies.map((company) => <option key={company._id} value={company._id}>{company.name}</option>)}
            </select>
          </FormField>
          <FormField label="Salary"><input className="input" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required /></FormField>
          <FormField label="Location"><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></FormField>
          <FormField label="Job type"><input className="input" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })} required /></FormField>
          <FormField label="Experience"><input className="input" type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required /></FormField>
          <FormField label="Open positions"><input className="input" type="number" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required /></FormField>
          <FormField label="Requirements"><input className="input" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="React, Node.js" required /></FormField>
        </div>
        <FormField label="Description"><textarea className="input min-h-32" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></FormField>
        <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save job"}</button>
      </form>
    </section>
  );
};

export default JobForm;
