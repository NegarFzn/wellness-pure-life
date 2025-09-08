import Link from "next/link";
import clsx from "clsx";
import classes from "./button.module.css";

export default function Button({
  children,
  onClick,
  link,
  size = "md",          // Options: "sm", "md", "lg"
  variant = "primary",  // Options: "primary", "secondary", "ghost"
  fullWidth = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const classNames = clsx(
    classes.button,
    classes[variant],
    classes[size],
    {
      [classes.fullWidth]: fullWidth,
      [classes.disabled]: disabled,
    }
  );

  if (link) {
    return (
      <Link href={link} legacyBehavior passHref>
        <a className={classNames} aria-disabled={disabled} {...props}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
