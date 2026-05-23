export const USER_KEY = "job_portal_user";
export const SAVED_JOBS_KEY = "campushire_saved_jobs";

export const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];

export const locations = ["Remote", "Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurgaon"];

export const experienceLevels = [
  { label: "Fresher (0 yrs)", value: "0" },
  { label: "1–2 years", value: "1" },
  { label: "2–4 years", value: "3" },
  { label: "4+ years", value: "5" },
];

export const salaryRanges = [
  { label: "Any salary", min: 0, max: Infinity },
  { label: "Up to ₹3L", min: 0, max: 300000 },
  { label: "₹3L – ₹6L", min: 300000, max: 600000 },
  { label: "₹6L – ₹12L", min: 600000, max: 1200000 },
  { label: "₹12L+", min: 1200000, max: Infinity },
];

export const applicationStatuses = ["pending", "accepted", "rejected"];

export const jobCategories = [
  { name: "Software Engineering", icon: "Code", count: "120+" },
  { name: "Data & Analytics", icon: "BarChart3", count: "45+" },
  { name: "Design & UX", icon: "Palette", count: "30+" },
  { name: "Marketing", icon: "Megaphone", count: "55+" },
  { name: "Internships", icon: "GraduationCap", count: "200+" },
  { name: "Operations", icon: "Briefcase", count: "40+" },
];

export const landingStats = [
  { value: "2,400+", label: "Active openings" },
  { value: "180+", label: "Hiring companies" },
  { value: "12k+", label: "Student signups" },
  { value: "48h", label: "Avg. first response" },
];

export const testimonials = [
  {
    quote: "I landed my first internship within two weeks. The apply flow was straightforward and recruiters actually responded.",
    name: "Priya Sharma",
    role: "B.Tech CSE, 2025",
    company: "Placed at Razorpay",
  },
  {
    quote: "We filled three intern roles in one hiring cycle. Applicant profiles with resumes made shortlisting much faster.",
    name: "Arjun Mehta",
    role: "Talent Lead",
    company: "Growth-stage startup",
  },
  {
    quote: "Profile completion nudges helped me fix my resume before applying. Got two interview calls the same month.",
    name: "Rahul Verma",
    role: "Fresher, Delhi",
    company: "Product Analyst role",
  },
];

export const topCompanies = [
  "Razorpay",
  "Swiggy",
  "Flipkart",
  "Zomato",
  "PhonePe",
  "Meesho",
  "CRED",
  "Freshworks",
];
