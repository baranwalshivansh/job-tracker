import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchCompanies } from "../redux/companySlice.js";
import { createJob, fetchJobById, updateJob } from "../redux/jobSlice.js";
import FormField from "../components/FormField.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import Loader from "../components/Loader.jsx";
import { jobTypes, locations } from "../utils/constants.js";

const initialForm = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  jobType: "Internship",
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
        jobType: selectedJob.jobType || "Internship",
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
      <div>
        <PageHeader title="Post a job" subtitle="You need a company profile first." />
        <div className="panel p-8 text-center">
          <p className="text-ink-muted">Jobs must belong to one of your recruiter companies.</p>
          <Link className="btn-primary mt-6 inline-flex" to="/recruiter/companies/new">
            Create company
          </Link>
        </div>
      </div>
    );
  }

  if (isEdit && loading && !selectedJob) return <Loader />;

  return (
    <div>
      <PageHeader title={isEdit ? "Edit job" : "Post a new job"} subtitle="Write clear details to attract the right candidates." />
      <form onSubmit={handleSubmit} className="panel mx-auto max-w-3xl space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Job title">
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="SDE Intern" />
          </FormField>
          <FormField label="Company">
            <select className="input" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} required>
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Salary (annual INR)">
            <input className="input" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
          </FormField>
          <FormField label="Location">
            <select className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required>
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Job type">
            <select className="input" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })} required>
              {jobTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Experience (years)">
            <input className="input" type="number" min="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
          </FormField>
          <FormField label="Open positions">
            <input className="input" type="number" min="1" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
          </FormField>
          <FormField label="Skills (comma-separated)">
            <input className="input" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="React, Node.js" required />
          </FormField>
        </div>
        <FormField label="Description">
          <textarea className="input min-h-36" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Describe responsibilities, team, and what you're looking for..." />
        </FormField>
        <div className="flex gap-3">
          <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save job"}</button>
          <Link to="/recruiter/jobs" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
