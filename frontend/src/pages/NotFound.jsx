import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel max-w-md p-10 text-center"
      >
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-ink-muted">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          <Home className="h-4 w-4" />
          Back to home
        </Link>
      </motion.div>
    </section>
  );
};

export default NotFound;
