"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  /** The target value to animate to */
  value: number;
  /** Optional suffix appended after the number (e.g. " g") */
  suffix?: string;
  /** Additional class names */
  className?: string;
  /** Animation duration in ms */
  duration?: number;
}

/** Cubic ease-out easing */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a numeric value from its previous state to a new target.
 * Uses requestAnimationFrame for smooth, performant animation.
 */
export function AnimatedNumber({
  value,
  suffix = "",
  className = "",
  duration = 750,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const diff = value - start;

    // No animation needed
    if (diff === 0) return;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplay(Math.round(start + diff * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = value;
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className}`} aria-label={`${value}${suffix}`}>
      {display}
      {suffix}
    </span>
  );
}
