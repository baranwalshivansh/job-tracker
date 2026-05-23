import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginUser } from "../redux/authSlice.js";
import FormField from "../components/FormField.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "", role: "student" });

  useEffect(() => {
    if (user) {
      navigate(user.role === "recruiter" ? "/recruiter" : location.state?.from?.pathname || "/jobs", { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-64px)] items-center justify-center py-10">
      <form onSubmit={handleSubmit} className="panel w-full max-w-md space-y-5 p-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Use the same role you registered with.</p>
        </div>
        <FormField label="Email">
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
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
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <p className="text-center text-sm text-slate-600">New here? <Link className="font-semibold text-brand" to="/register">Create an account</Link></p>
      </form>
    </section>
  );
};

export default Login;
