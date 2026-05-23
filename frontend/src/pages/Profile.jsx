import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../redux/authSlice.js";
import FormField from "../components/FormField.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import { useProfileCompletion } from "../hooks/useProfileCompletion.js";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { percent, missing } = useProfileCompletion(user);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  return (
    <div>
      <PageHeader title="Your profile" subtitle="Keep your details updated so recruiters can review you faster." />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="panel p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar src={user?.profile?.profilePhoto} name={user?.fullname} size="xl" />
            <h2 className="mt-4 text-lg font-bold text-ink">{user?.fullname}</h2>
            <p className="text-sm capitalize text-ink-muted">{user?.role}</p>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Completion</span>
              <span className="font-semibold text-brand">{percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${percent}%` }} />
            </div>
            {missing.length > 0 && (
              <p className="mt-3 text-xs text-ink-muted">Missing: {missing.join(", ")}</p>
            )}
          </div>
          <div className="mt-6 space-y-2 border-t border-surface-border pt-6 text-sm">
            <p className="text-ink-muted">{user?.email}</p>
            <p className="text-ink-muted">{user?.phoneNumber}</p>
            {user?.profile?.resume && (
              <a className="flex items-center gap-2 font-semibold text-brand hover:underline" href={user.profile.resume} target="_blank" rel="noreferrer">
                <FileText className="h-4 w-4" />
                View resume
              </a>
            )}
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="panel space-y-6 p-6">
          <div>
            <h3 className="font-semibold text-ink">Personal information</h3>
            <p className="text-sm text-ink-muted">Update your contact details and bio.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name">
              <input className="input" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormField>
            <FormField label="Phone">
              <input className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            </FormField>
            <FormField label="Skills" hint="Comma-separated">
              <input className="input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, MongoDB" />
            </FormField>
          </div>
          <FormField label="Bio">
            <textarea className="input min-h-28" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell recruiters about your background..." />
          </FormField>

          <FormField label="Resume or profile photo" hint="Upload a PDF for resume or an image for your avatar">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-ink-faint" />
              <input className="input flex-1" type="file" accept="image/*,.pdf" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} />
            </div>
            <p className="mt-1 text-xs text-ink-muted">Upload an image for avatar or PDF for resume.</p>
          </FormField>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
