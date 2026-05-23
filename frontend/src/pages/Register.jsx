import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "../redux/authSlice.js";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import RoleSelector from "../components/auth/RoleSelector.jsx";
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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.fullname.trim()) next.fullname = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (!form.phoneNumber.trim()) next.phoneNumber = "Phone is required";
    if (!form.password || form.password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created — sign in to continue");
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join as a student or recruiter in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-brand hover:underline" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="I am a">
          <RoleSelector value={form.role} onChange={(role) => setForm({ ...form, role })} />
        </FormField>
        <FormField label="Full name" error={errors.fullname}>
          <input className="input" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Phone number" error={errors.phoneNumber}>
          <input className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
        </FormField>
        <FormField label="Password" error={errors.password} hint="At least 6 characters">
          <div className="relative">
            <input
              className="input pr-10"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        <FormField label="Profile photo (optional)">
          <input className="input" type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} />
        </FormField>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
