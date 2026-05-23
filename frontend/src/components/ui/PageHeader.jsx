import { motion } from "framer-motion";

const PageHeader = ({ title, subtitle, actions, badge }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div>
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </motion.div>
  );
};

export default PageHeader;
