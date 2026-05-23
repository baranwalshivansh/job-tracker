import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const target = user?.role === "recruiter" ? "/recruiter" : user ? "/jobs" : "/register";

  return (
    <section className="bg-white">
      <div className="page-shell grid min-h-[calc(100vh-64px)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-7">
          <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-brand">
            Find work. Hire talent. Move faster.
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
              JobPortal for students and recruiters
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Browse opportunities, manage applications, post jobs, and review candidates from one clean MERN workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={target} className="btn-primary">Get started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-3 pt-4">
            {[
              ["2 roles", "Student and recruiter"],
              ["JWT", "Secure cookie auth"],
              ["Cloud", "Resume and logo uploads"],
            ].map(([title, label]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-lg font-bold text-ink">{title}</div>
                <div className="mt-1 text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="relative">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-soft">
            <div className="rounded-md bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Recruiter dashboard</p>
                  <h2 className="text-xl font-bold text-ink">Active hiring pipeline</h2>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Live</span>
              </div>
              <div className="space-y-3">
                {["Frontend Developer", "Backend Engineer", "Product Designer"].map((role, index) => (
                  <div key={role} className="flex items-center justify-between rounded-md border border-slate-200 p-4">
                    <div>
                      <p className="font-semibold text-ink">{role}</p>
                      <p className="text-sm text-slate-500">{index + 4} applicants</p>
                    </div>
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-brand" style={{ width: `${80 - index * 18}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
