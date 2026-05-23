import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

const EmptyState = ({ title, message, action, icon: Icon = Inbox }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel flex flex-col items-center justify-center gap-4 px-6 py-14 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {message && <p className="mt-2 max-w-md text-sm text-ink-muted">{message}</p>}
      </div>
      {action}
    </motion.div>
  );
};

export default EmptyState;
