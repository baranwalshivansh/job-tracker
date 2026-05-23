import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../redux/authSlice.js";
import logo from "../assets/logo.svg";

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? "bg-blue-50 text-brand" : "text-slate-700 hover:bg-slate-100"}`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="JobPortal" className="h-10 w-auto" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {user?.role === "student" && (
            <>
              <NavLink to="/jobs" className={navClass}>Jobs</NavLink>
              <NavLink to="/applied-jobs" className={navClass}>Applied</NavLink>
              <NavLink to="/profile" className={navClass}>Profile</NavLink>
            </>
          )}
          {user?.role === "recruiter" && (
            <>
              <NavLink to="/recruiter" className={navClass}>Dashboard</NavLink>
              <NavLink to="/recruiter/companies" className={navClass}>Companies</NavLink>
              <NavLink to="/recruiter/jobs" className={navClass}>Jobs</NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-40 truncate text-sm font-medium text-slate-700 sm:block">{user.fullname}</span>
              <button type="button" className="btn-secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
      {user && (
        <nav className="page-shell flex gap-1 overflow-x-auto pb-3 md:hidden">
          {user.role === "student" ? (
            <>
              <NavLink to="/jobs" className={navClass}>Jobs</NavLink>
              <NavLink to="/applied-jobs" className={navClass}>Applied</NavLink>
              <NavLink to="/profile" className={navClass}>Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/recruiter" className={navClass}>Dashboard</NavLink>
              <NavLink to="/recruiter/companies" className={navClass}>Companies</NavLink>
              <NavLink to="/recruiter/jobs" className={navClass}>Jobs</NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
