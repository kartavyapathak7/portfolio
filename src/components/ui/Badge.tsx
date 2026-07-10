import { type ReactNode } from "react";

type BadgeVariant = "accent" | "green" | "orange" | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  accent:
    "bg-site-accent/10 text-site-accent border-site-accent/20",
  green:
    "bg-protein-green-dim text-protein-green border-protein-green/20",
  orange:
    "bg-site-orange/10 text-site-orange border-site-orange/20",
  muted:
    "bg-site-bg text-site-muted border-site-border",
};

export function Badge({
  children,
  variant = "muted",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border text-[0.65rem] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
