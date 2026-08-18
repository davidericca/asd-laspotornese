import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-600 shadow-sm shadow-accent-500/20",
  secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
  outline:
    "border-2 border-white/70 text-white hover:bg-white/10 backdrop-blur-sm",
  ghost: "text-primary-800 hover:bg-primary-50",
};

interface ButtonProps {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  target?: string;
}

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  target,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-200",
    VARIANT_CLASSES[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} target={target}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
