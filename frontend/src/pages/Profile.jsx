import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateProfile } from "../redux/authSlice.js";
import FormField from "../components/FormField.jsx";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
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
    <section className="page-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="panel p-6">
          <div className="flex items-center gap-4">
            {user?.profile?.profilePhoto ? (
              <img src={user.profile.profilePhoto} alt={user.fullname} className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-50 text-xl font-bold text-brand">
                {user?.fullname?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-ink">{user?.fullname}</h1>
              <p className="text-sm capitalize text-slate-600">{user?.role}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Phone:</span> {user?.phoneNumber}</p>
            {user?.profile?.resume && (
              <a className="font-semibold text-brand" href={user.profile.resume} target="_blank" rel="noreferrer">
                View resume
              </a>
            )}
          </div>
        </aside>
        <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
          <div>
            <h2 className="text-xl font-bold text-ink">Update profile</h2>
            <p className="text-sm text-slate-600">Upload an image to change your avatar, or a document to set your resume.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name"><input className="input" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} /></FormField>
            <FormField label="Email"><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
            <FormField label="Phone number"><input className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></FormField>
            <FormField label="Skills"><input className="input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, MongoDB" /></FormField>
          </div>
          <FormField label="Bio"><textarea className="input min-h-28" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></FormField>
          <FormField label="Resume or profile image"><input className="input" type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} /></FormField>
          <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save profile"}</button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
