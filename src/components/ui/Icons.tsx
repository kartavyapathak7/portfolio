/**
 * Inline SVG icon primitives — zero-dependency, tree-shakeable.
 * All icons use currentColor so they inherit text colour from context.
 */

export interface IconProps {
  className?: string;
  size?: number;
}

/* ── Stroke-based icons (line style) ───────────────────────────── */

function StrokeIcon({
  children,
  className = "",
  size = 16,
  strokeWidth = 2,
}: IconProps & { children: React.ReactNode; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ── Fill-based icons (solid style) ────────────────────────────── */

function FillIcon({
  children,
  className = "",
  size = 16,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ── Exported icons ─────────────────────────────────────────────── */

export function ArrowUpRight({ className, size }: IconProps) {
  return (
    <StrokeIcon className={className} size={size} strokeWidth={2.5}>
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </StrokeIcon>
  );
}

export function ArrowLeft({ className, size }: IconProps) {
  return (
    <StrokeIcon className={className} size={size}>
      <path d="M19 12H5M5 12l7-7M5 12l7 7" />
    </StrokeIcon>
  );
}

export function Copy({ className, size }: IconProps) {
  return (
    <StrokeIcon className={className} size={size}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </StrokeIcon>
  );
}

export function Share({ className, size }: IconProps) {
  return (
    <StrokeIcon className={className} size={size}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </StrokeIcon>
  );
}

export function Download({ className, size }: IconProps) {
  return (
    <StrokeIcon className={className} size={size}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </StrokeIcon>
  );
}

export function CheckCircle({ className, size }: IconProps) {
  return (
    <FillIcon className={className} size={size}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L12 12.586l3.293-3.293a1 1 0 011.414 0z"
      />
    </FillIcon>
  );
}

export function ChevronDown({ className, size }: IconProps) {
  return (
    <StrokeIcon className={className} size={size}>
      <polyline points="6 9 12 15 18 9" />
    </StrokeIcon>
  );
}

export function Spinner({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
