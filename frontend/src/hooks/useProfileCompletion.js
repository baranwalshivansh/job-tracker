import { useMemo } from "react";

export const useProfileCompletion = (user) => {
  return useMemo(() => {
    if (!user) return { percent: 0, missing: [] };

    const checks = [
      { label: "Full name", done: Boolean(user.fullname) },
      { label: "Email", done: Boolean(user.email) },
      { label: "Phone", done: Boolean(user.phoneNumber) },
      { label: "Bio", done: Boolean(user.profile?.bio?.trim()) },
      { label: "Skills", done: (user.profile?.skills?.length || 0) > 0 },
      { label: "Resume", done: Boolean(user.profile?.resume) },
      { label: "Profile photo", done: Boolean(user.profile?.profilePhoto) },
    ];

    const done = checks.filter((c) => c.done).length;
    const percent = Math.round((done / checks.length) * 100);
    const missing = checks.filter((c) => !c.done).map((c) => c.label);

    return { percent, missing, checks };
  }, [user]);
};

export default useProfileCompletion;
