import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser } from "../redux/authSlice.js";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import RoleSelector from "../components/auth/RoleSelector.jsx";
import FormField from "../components/FormField.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const expiredToastShown = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("session") === "expired" && !expiredToastShown.current) {
      expiredToastShown.current = true;
      toast.error("Session expired. Please sign in again.");
      navigate("/login", { replace: true, state: location.state });
    }
  }, [location.search, location.state, navigate]);

  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      const dest =
        user.role === "recruiter"
          ? "/recruiter"
          : redirect || location.state?.from?.pathname || "/dashboard";
      navigate(dest, { replace: true });
    }
  }, [user, navigate, location.state, location.search]);

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      expiredToastShown.current = false;
      toast.success("Welcome back!");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with the role you registered as."
      footer={
        <>
          New here?{" "}
          <Link className="font-semibold text-brand hover:underline" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="I am a">
          <RoleSelector value={form.role} onChange={(role) => setForm({ ...form, role })} />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input
            className="input"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </FormField>
        <FormField label="Password" error={errors.password}>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
