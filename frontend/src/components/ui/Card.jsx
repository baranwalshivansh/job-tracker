import { motion } from "framer-motion";
import { cn } from "../../utils/cn.js";

const Card = ({ children, className, hover = false, as: Component = "div", ...props }) => {
  const Wrapper = hover ? motion.div : Component;
  const motionProps = hover
    ? {
        whileHover: { y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Wrapper
      className={cn("panel", hover && "transition-shadow hover:shadow-soft", className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
};

export default Card;
