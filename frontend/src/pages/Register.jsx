import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { registerUser } from "../redux/authSlice.js";
import FormField from "../components/FormField.jsx";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created");
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-64px)] items-center justify-center py-10">
      <form onSubmit={handleSubmit} className="panel w-full max-w-2xl space-y-5 p-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Create account</h1>
          <p className="mt-1 text-sm text-slate-600">Register as a student or recruiter.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name">
            <input className="input" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} required />
          </FormField>
          <FormField label="Email">
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </FormField>
          <FormField label="Phone number">
            <input className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
          </FormField>
          <FormField label="Password">
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </FormField>
          <FormField label="Role">
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </FormField>
          <FormField label="Profile image">
            <input className="input" type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} />
          </FormField>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        <p className="text-center text-sm text-slate-600">Already have an account? <Link className="font-semibold text-brand" to="/login">Login</Link></p>
      </form>
    </section>
  );
};

export default Register;
