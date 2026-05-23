import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./layout/Footer.jsx";

const authPaths = ["/login", "/register"];
const dashboardPrefixes = ["/dashboard", "/jobs", "/applied-jobs", "/profile", "/recruiter"];

const Layout = () => {
  const { pathname } = useLocation();
  const isAuthPage = authPaths.includes(pathname);
  const isDashboard = dashboardPrefixes.some((p) => pathname.startsWith(p));
  const showFooter = pathname === "/" || (!isAuthPage && !isDashboard);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
