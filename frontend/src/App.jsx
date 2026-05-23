import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import AppliedJobs from "./pages/AppliedJobs.jsx";
import Profile from "./pages/Profile.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import Companies from "./pages/Companies.jsx";
import CompanyForm from "./pages/CompanyForm.jsx";
import RecruiterJobs from "./pages/RecruiterJobs.jsx";
import JobForm from "./pages/JobForm.jsx";
import Applicants from "./pages/Applicants.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  const studentHome = user ? "/dashboard" : "/jobs";
  const recruiterHome = "/recruiter";

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="login"
          element={user ? <Navigate to={user.role === "recruiter" ? recruiterHome : studentHome} replace /> : <Login />}
        />
        <Route
          path="register"
          element={user ? <Navigate to={user.role === "recruiter" ? recruiterHome : studentHome} replace /> : <Register />}
        />

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout role="student" />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["student", "recruiter"]} />}>
          <Route path="jobs/:id" element={<JobDetails />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route element={<DashboardLayout role="recruiter" />}>
            <Route path="recruiter" element={<RecruiterDashboard />} />
            <Route path="recruiter/companies" element={<Companies />} />
            <Route path="recruiter/companies/new" element={<CompanyForm />} />
            <Route path="recruiter/companies/:id" element={<CompanyForm />} />
            <Route path="recruiter/jobs" element={<RecruiterJobs />} />
            <Route path="recruiter/jobs/new" element={<JobForm />} />
            <Route path="recruiter/jobs/:id/edit" element={<JobForm />} />
            <Route path="recruiter/jobs/:id/applicants" element={<Applicants />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
