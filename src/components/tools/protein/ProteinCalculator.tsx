"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Copy,
  Download,
  Share,
  Spinner,
} from "@/components/ui/Icons";
import { ComingSoonToolCard } from "@/components/tools/ComingSoonToolCard";
import {
  calculateProtein,
  DEFAULT_PROTEIN_INPUT,
  validateProteinInput,
} from "@/lib/protein/calculate";
import type { ProteinInput, ProteinResult } from "@/lib/protein/types";
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  PREFERENCE_LABELS,
} from "@/lib/protein/types";
import {
  COMING_SOON_TOOLS,
  EXAMPLE_FOODS,
  PROTEIN_FAQS,
  SITE_URL,
} from "@/lib/tools/config";

/* ─── Design tokens (keeps JSX lean) ─────────────────────────── */

const inputCls =
  "w-full bg-site-bg border border-site-border rounded-xl px-4 py-3 text-site-text text-sm " +
  "focus:outline-none focus:border-site-accent focus:ring-2 focus:ring-site-accent/20 " +
  "transition-colors placeholder:text-site-muted/40 appearance-none";

const labelCls =
  "block text-[0.65rem] font-mono uppercase tracking-widest text-site-muted mb-2 select-none";

const actionBtnCls =
  "inline-flex items-center gap-2 text-sm font-medium bg-site-bg border border-site-border " +
  "px-4 py-2.5 rounded-xl transition-all hover:border-site-accent/60 hover:text-site-accent " +
  "focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:outline-none";

/* ─── Progress bar ────────────────────────────────────────────── */

const STEPS = [80, 100, 120, 140, 160, 180, 200, 220] as const;
const STEP_MIN = STEPS[0];
const STEP_MAX = STEPS[7];

function clampPercent(v: number, min: number, max: number) {
  return Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100));
}

function nearestStep(value: number): (typeof STEPS)[number] {
  return [...STEPS].reduce((best, s) =>
    Math.abs(s - value) < Math.abs(best - value) ? s : best
  );
}

function ProteinProgressBar({ value }: { value: number }) {
  const pct = clampPercent(value, STEP_MIN, STEP_MAX);
  const highlight = nearestStep(value);

  return (
    <div className="space-y-2.5" role="group" aria-label="Protein intake scale">
      {/* Labels */}
      <div className="flex justify-between text-[0.65rem] font-mono text-site-muted">
        <span>{STEP_MIN}g</span>
        <span className="text-site-accent font-semibold tabular-nums">
          {value}g target
        </span>
        <span>{STEP_MAX}g</span>
      </div>

      {/* Track */}
      <div className="relative h-2.5 bg-site-elevated rounded-full overflow-hidden border border-site-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-site-accent via-site-accent to-site-orange transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={STEP_MIN}
          aria-valuemax={STEP_MAX}
          aria-label={`${value}g daily protein`}
        />
        {/* Glow cap */}
        {pct > 3 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-site-accent shadow-[0_0_8px_rgba(200,255,0,0.8)] transition-[left] duration-700 ease-out pointer-events-none"
            style={{ left: `calc(${pct}% - 5px)` }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Step markers */}
      <div className="flex justify-between">
        {STEPS.map((step) => {
          const active = step === highlight;
          const filled = step <= value;
          return (
            <div
              key={step}
              className="flex flex-col items-center gap-1"
              aria-hidden="true"
            >
              <div
                className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                  filled ? "bg-site-accent" : "bg-site-steel"
                }`}
              />
              <span
                className={`text-[9px] font-mono transition-all duration-200 ${
                  active
                    ? "text-site-accent font-semibold scale-110"
                    : "text-site-muted/50"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── FAQ accordion ───────────────────────────────────────────── */

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${index}`;
  const btnId = `faq-btn-${index}`;

  return (
    <div className="border border-site-border rounded-xl overflow-hidden transition-colors duration-200 hover:border-site-border/60">
      <button
        id={btnId}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 font-medium text-site-text hover:text-site-accent transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-site-accent focus-visible:outline-none"
      >
        <span className="text-sm leading-snug">{question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-site-muted transition-transform duration-300 ${
            open ? "rotate-180 text-site-accent" : ""
          }`}
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pt-0 text-site-muted text-sm leading-relaxed border-t border-site-border/60">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast notification ──────────────────────────────────────── */

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-site-elevated border border-site-border/80 text-site-text text-sm px-4 py-3 rounded-xl shadow-card transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <CheckCircle size={14} className="text-protein-green shrink-0" />
      {message}
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="h-full min-h-[360px] flex flex-col items-center justify-center gap-5 border border-dashed border-site-border rounded-2xl p-8 text-center bg-site-card/20">
      <span
        className="text-5xl grayscale opacity-40 select-none"
        aria-hidden="true"
      >
        🥩
      </span>
      <div className="space-y-1.5 max-w-xs">
        <p className="font-medium text-site-text/50 text-sm">
          Your results will appear here
        </p>
        <p className="text-site-muted/60 text-xs leading-relaxed">
          Fill in your details on the left and press{" "}
          <kbd className="font-mono text-site-accent bg-site-accent/10 px-1 py-0.5 rounded text-[0.6rem]">
            Calculate
          </kbd>{" "}
          to see your personalised protein target.
        </p>
      </div>
    </div>
  );
}

/* ─── Result card ─────────────────────────────────────────────── */

function ResultCard({
  result,
  onCopy,
  onShare,
  onDownload,
}: {
  result: ProteinResult;
  onCopy: () => void;
  onShare: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="h-full bg-gradient-to-br from-site-card via-site-card to-site-elevated border border-site-accent/20 rounded-2xl p-6 sm:p-8 shadow-card animate-fade-up space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-site-muted mb-2 font-mono uppercase tracking-widest">
            Recommended Protein
          </p>
          <p className="font-display text-6xl sm:text-7xl text-site-accent leading-none tabular-nums">
            <AnimatedNumber value={result.recommendedProtein} />
            <span className="text-xl sm:text-2xl text-site-muted ml-2 font-body">
              g/day
            </span>
          </p>
        </div>
        <Badge variant="green" className="shrink-0 mt-1">
          <CheckCircle size={10} />
          Science-Based
        </Badge>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-site-bg/60 rounded-xl p-3.5 border border-site-border/60 space-y-0.5">
          <p className="text-[0.65rem] text-site-muted font-mono uppercase tracking-wider">
            Per meal
          </p>
          <p className="text-2xl font-bold text-site-text tabular-nums">
            <AnimatedNumber value={result.proteinPerMeal} suffix=" g" />
          </p>
          <p className="text-[0.65rem] text-site-muted">split over 4 meals</p>
        </div>
        <div className="bg-site-bg/60 rounded-xl p-3.5 border border-site-border/60 space-y-0.5">
          <p className="text-[0.65rem] text-site-muted font-mono uppercase tracking-wider">
            Per kg
          </p>
          <p className="text-2xl font-bold text-site-text tabular-nums">
            {result.proteinPerKg}
            <span className="text-sm font-normal text-site-muted ml-1">
              g/kg
            </span>
          </p>
          <p className="text-[0.65rem] text-site-muted">body weight</p>
        </div>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="accent">{GOAL_LABELS[result.fitnessGoal]}</Badge>
        <Badge variant="muted">{ACTIVITY_LABELS[result.activityLevel]}</Badge>
        <Badge variant="muted">
          {PREFERENCE_LABELS[result.proteinPreference]}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <p className="text-[0.65rem] font-mono uppercase tracking-widest text-site-muted">
          Intake scale
        </p>
        <ProteinProgressBar value={result.recommendedProtein} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-site-border/40">
        <button
          type="button"
          onClick={onCopy}
          className={actionBtnCls}
          aria-label="Copy results to clipboard"
        >
          <Copy size={14} />
          Copy
        </button>
        <button
          type="button"
          onClick={onShare}
          className={actionBtnCls}
          aria-label="Share results"
        >
          <Share size={14} />
          Share
        </button>
        <button
          type="button"
          onClick={onDownload}
          className={actionBtnCls}
          aria-label="Download results as text file"
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
}

/* ─── Food card grid ──────────────────────────────────────────── */

function FoodGrid({ target }: { target: number }) {
  return (
    <section
      className="animate-fade-up"
      aria-labelledby="food-examples-heading"
    >
      <div className="bg-site-card border border-site-border rounded-2xl p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h2
              id="food-examples-heading"
              className="font-display text-2xl tracking-wide"
            >
              How to Hit Your{" "}
              <span className="text-site-accent">Protein Goal</span>
            </h2>
            <p className="text-site-muted text-sm mt-1">
              Mix and match these to reach{" "}
              <span className="text-site-text font-semibold">~{target}g</span>{" "}
              per day
            </p>
          </div>
          <Badge variant="accent" className="self-start sm:self-auto shrink-0">
            {target}g target
          </Badge>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {EXAMPLE_FOODS.map((food) => (
            <div
              key={food.name}
              className="group flex items-center gap-3 bg-site-bg rounded-xl p-3.5 border border-site-border hover:border-site-accent/30 hover:bg-site-elevated transition-all duration-200"
            >
              <span
                className="text-xl shrink-0 transition-transform duration-200 group-hover:scale-110 select-none"
                aria-hidden="true"
              >
                {food.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-site-text truncate leading-tight">
                  {food.name}
                </p>
                <p className="text-site-accent font-mono text-sm font-bold mt-0.5">
                  ≈ {food.protein}g
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main ProteinCalculator ──────────────────────────────────── */

export function ProteinCalculator() {
  const [form, setForm] = useState<ProteinInput>(DEFAULT_PROTEIN_INPUT);
  const [result, setResult] = useState<ProteinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({
    msg: "",
    visible: false,
  });

  const resultRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback(
    <K extends keyof ProteinInput>(key: K, value: ProteinInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setError(null);
    },
    []
  );

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, visible: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2500
    );
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleCalculate = useCallback(() => {
    const err = validateProteinInput(form);
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    // Small artificial delay for perceived performance polish
    setTimeout(() => {
      setResult(calculateProtein(form));
      setLoading(false);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        80
      );
    }, 380);
  }, [form]);

  const handleReset = useCallback(() => {
    setForm(DEFAULT_PROTEIN_INPUT);
    setResult(null);
    setError(null);
  }, []);

  const shareText = useMemo(() => {
    if (!result) return "";
    return (
      `My protein target: ${result.recommendedProtein}g/day ` +
      `(${GOAL_LABELS[result.fitnessGoal]} · ${ACTIVITY_LABELS[result.activityLevel]}). ` +
      `Calculate yours free → ${SITE_URL}/tools/protein-calculator`
    );
  }, [result]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text =
      `Protein Intake Results\n` +
      `${"─".repeat(32)}\n` +
      `Recommended:  ${result.recommendedProtein} g/day\n` +
      `Per meal (×4):  ${result.proteinPerMeal} g\n` +
      `Per kg:  ${result.proteinPerKg} g/kg\n` +
      `Goal:  ${GOAL_LABELS[result.fitnessGoal]}\n` +
      `Activity:  ${ACTIVITY_LABELS[result.activityLevel]}\n` +
      `Preference:  ${PREFERENCE_LABELS[result.proteinPreference]}\n` +
      `${"─".repeat(32)}\n` +
      `${SITE_URL}/tools/protein-calculator`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch {
      showToast("Press Ctrl+C to copy");
    }
  }, [result, showToast]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Protein Intake Calculator",
          text: shareText,
          url: `${SITE_URL}/tools/protein-calculator`,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        showToast("Link copied — share it anywhere!");
      }
    } catch {
      // User dismissed the share sheet — no action needed
    }
  }, [result, shareText, showToast]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const lines = [
      "PROTEIN INTAKE RESULTS",
      "═".repeat(36),
      `Recommended Daily Protein:  ${result.recommendedProtein} g/day`,
      `Per Meal (÷ 4):             ${result.proteinPerMeal} g`,
      `Per kg Bodyweight:          ${result.proteinPerKg} g/kg`,
      `Fitness Goal:               ${GOAL_LABELS[result.fitnessGoal]}`,
      `Activity Level:             ${ACTIVITY_LABELS[result.activityLevel]}`,
      `Protein Preference:         ${PREFERENCE_LABELS[result.proteinPreference]}`,
      "═".repeat(36),
      "Science-Based Recommendation",
      `Generated at: ${SITE_URL}/tools/protein-calculator`,
      `Date: ${new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `protein-${result.recommendedProtein}g-${Date.now()}.txt`,
    });
    a.click();
    URL.revokeObjectURL(url);
    showToast("File downloaded!");
  }, [result, showToast]);

  // Keyboard shortcut — Ctrl/Cmd+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleCalculate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleCalculate]);

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      <Toast message={toast.msg} visible={toast.visible} />

      {/* ── Page Hero ───────────────────────────────────────── */}
      <section
        className="text-center max-w-3xl mx-auto"
        aria-labelledby="calc-hero-heading"
      >
        <Badge variant="green" className="mb-6 text-xs px-4 py-1.5">
          <CheckCircle size={11} />
          Science-Based Calculation
        </Badge>
        <h1
          id="calc-hero-heading"
          className="font-display text-5xl sm:text-6xl md:text-7xl tracking-wide text-site-text mb-4 leading-none"
        >
          Protein Intake
          <br />
          <span className="text-site-accent">Calculator</span>
        </h1>
        <p className="text-site-muted text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Find your scientifically recommended daily protein intake in seconds —
          based on your body, goals and activity level.
        </p>
      </section>

      {/* ── Calculator layout ────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* ── Input card ─────────────────────────────────────── */}
        <div className="bg-site-card border border-site-border rounded-2xl shadow-card overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-5 border-b border-site-border bg-site-elevated/40">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-base">Your Details</h2>
              <kbd className="hidden sm:inline text-[0.6rem] font-mono text-site-muted/60 bg-site-bg border border-site-border px-1.5 py-0.5 rounded">
                ⌘ Enter to calculate
              </kbd>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-5">
            {/* Age */}
            <div>
              <label htmlFor="age" className={labelCls}>
                Age
              </label>
              <input
                id="age"
                type="number"
                inputMode="numeric"
                min={13}
                max={100}
                value={form.age}
                onChange={(e) => update("age", Number(e.target.value))}
                className={inputCls}
                placeholder="e.g. 22"
                autoComplete="age"
              />
            </div>

            {/* Gender */}
            <div>
              <span id="gender-group-label" className={labelCls}>
                Gender
              </span>
              <div
                className="grid grid-cols-2 gap-2"
                role="group"
                aria-labelledby="gender-group-label"
              >
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => update("gender", g)}
                    aria-pressed={form.gender === g}
                    className={`py-3 rounded-xl text-sm font-medium capitalize transition-all focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:outline-none ${
                      form.gender === g
                        ? "bg-site-accent text-site-bg shadow-glow"
                        : "bg-site-bg border border-site-border text-site-muted hover:border-site-accent/40 hover:text-site-text"
                    }`}
                  >
                    {g === "male" ? "♂  Male" : "♀  Female"}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className={labelCls}>
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  value={form.weight}
                  onChange={(e) => update("weight", Number(e.target.value))}
                  className={`${inputCls} flex-1`}
                  placeholder={form.weightUnit === "kg" ? "e.g. 70" : "e.g. 154"}
                />
                <div
                  className="flex rounded-xl overflow-hidden border border-site-border shrink-0"
                  role="group"
                  aria-label="Weight unit"
                >
                  {(["kg", "lbs"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => update("weightUnit", u)}
                      aria-pressed={form.weightUnit === u}
                      className={`px-4 py-3 text-sm font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-site-accent ${
                        form.weightUnit === u
                          ? "bg-site-accent text-site-bg font-semibold"
                          : "bg-site-bg text-site-muted hover:text-site-text"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height" className={labelCls}>
                Height <span className="text-site-muted/60 normal-case font-sans">(cm)</span>
              </label>
              <input
                id="height"
                type="number"
                inputMode="numeric"
                min={100}
                max={250}
                value={form.height}
                onChange={(e) => update("height", Number(e.target.value))}
                className={inputCls}
                placeholder="e.g. 175"
              />
            </div>

            {/* Activity Level */}
            <div>
              <label htmlFor="activity" className={labelCls}>
                Activity Level
              </label>
              <div className="relative">
                <select
                  id="activity"
                  value={form.activityLevel}
                  onChange={(e) =>
                    update(
                      "activityLevel",
                      e.target.value as ProteinInput["activityLevel"]
                    )
                  }
                  className={`${inputCls} pr-10`}
                >
                  <option value="sedentary">Sedentary — desk job, no exercise</option>
                  <option value="lightly_active">Light — 1–2 days/week</option>
                  <option value="moderately_active">Moderate — 3–5 days/week</option>
                  <option value="very_active">Heavy — 6–7 days/week</option>
                  <option value="athlete">Athlete — 2× daily training</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-site-muted pointer-events-none"
                />
              </div>
            </div>

            {/* Fitness Goal */}
            <div>
              <label htmlFor="goal" className={labelCls}>
                Fitness Goal
              </label>
              <div className="relative">
                <select
                  id="goal"
                  value={form.fitnessGoal}
                  onChange={(e) =>
                    update(
                      "fitnessGoal",
                      e.target.value as ProteinInput["fitnessGoal"]
                    )
                  }
                  className={`${inputCls} pr-10`}
                >
                  <option value="lose_fat">Lose Fat</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="build_muscle">Gain Muscle</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-site-muted pointer-events-none"
                />
              </div>
            </div>

            {/* Protein Preference */}
            <div>
              <label htmlFor="preference" className={labelCls}>
                Protein Preference
              </label>
              <div className="relative">
                <select
                  id="preference"
                  value={form.proteinPreference}
                  onChange={(e) =>
                    update(
                      "proteinPreference",
                      e.target.value as ProteinInput["proteinPreference"]
                    )
                  }
                  className={`${inputCls} pr-10`}
                >
                  <option value="minimum">Minimum — 0.8 g/kg</option>
                  <option value="optimal">Optimal — goal-based</option>
                  <option value="high_performance">High Performance — 2.2 g/kg</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-site-muted pointer-events-none"
                />
              </div>
            </div>

            {/* Validation error */}
            {error && (
              <p
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-2 text-sm text-site-orange bg-site-orange/10 border border-site-orange/30 rounded-xl px-4 py-3"
              >
                <span aria-hidden="true" className="mt-0.5 shrink-0">⚠</span>
                {error}
              </p>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-site-accent to-site-orange text-site-bg font-bold py-3.5 rounded-xl transition-all hover:shadow-glow hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:outline-none text-sm"
              >
                {loading ? (
                  <>
                    <Spinner size={15} />
                    Calculating…
                  </>
                ) : (
                  "Calculate"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3.5 border border-site-border text-site-muted rounded-xl text-sm hover:border-site-text hover:text-site-text transition-colors focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:outline-none whitespace-nowrap"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Result panel ───────────────────────────────────── */}
        <div ref={resultRef} className="scroll-mt-24 min-h-[420px]">
          {loading && (
            <div
              aria-busy="true"
              aria-label="Calculating your protein intake"
              className="bg-site-card border border-site-border rounded-2xl p-8 shadow-card space-y-5 animate-pulse"
            >
              <div className="h-3 bg-site-steel rounded-full w-1/3" />
              <div className="h-14 bg-site-steel rounded-xl w-3/4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-site-steel rounded-xl" />
                <div className="h-20 bg-site-steel rounded-xl" />
              </div>
              <div className="h-3 bg-site-steel rounded-full w-full" />
              <div className="h-3 bg-site-steel rounded-full w-4/5" />
            </div>
          )}

          {!loading && result && (
            <ResultCard
              result={result}
              onCopy={handleCopy}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          )}

          {!loading && !result && <EmptyState />}
        </div>
      </div>

      {/* ── Food examples (revealed after calculation) ──────── */}
      {result && <FoodGrid target={result.recommendedProtein} />}

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto" aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="font-display text-3xl sm:text-4xl text-center mb-8"
        >
          Frequently Asked{" "}
          <span className="text-site-accent">Questions</span>
        </h2>
        <div className="space-y-2">
          {PROTEIN_FAQS.map((faq, i) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ── Disclaimer ──────────────────────────────────────── */}
      <div
        role="note"
        className="max-w-2xl mx-auto flex gap-3 items-start bg-site-elevated/50 border border-site-border/60 rounded-xl px-5 py-4"
      >
        <span
          className="text-site-muted/50 shrink-0 text-sm mt-0.5"
          aria-hidden="true"
        >
          ℹ
        </span>
        <p className="text-site-muted text-xs leading-relaxed">
          <strong className="text-site-muted/80 font-semibold">
            Disclaimer:
          </strong>{" "}
          This calculator provides general nutritional guidance based on current
          sports nutrition research and should not replace advice from a
          qualified healthcare professional or registered dietitian.
        </p>
      </div>

      {/* ── Related tools ───────────────────────────────────── */}
      <section aria-labelledby="related-tools-heading">
        <h2
          id="related-tools-heading"
          className="font-display text-2xl sm:text-3xl text-center mb-6"
        >
          Related Tools
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {COMING_SOON_TOOLS.map((tool) => (
            <ComingSoonToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── Back link ───────────────────────────────────────── */}
      <div className="text-center">
        <Link
          href="/tools"
          className="group inline-flex items-center gap-2 text-site-muted hover:text-site-accent text-sm font-mono transition-colors"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to all tools
        </Link>
      </div>
    </div>
  );
}
