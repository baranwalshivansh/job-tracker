import { cn } from "../../utils/cn.js";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const Button = ({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}) => {
  return (
    <button type={type} className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
