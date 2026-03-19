import { AssignmentStatus, SubjectColor } from "@/types";

/** Lightweight className joiner — no external dependency needed */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Status Badge Config ──────────────────────────────────────────────────────

export function getStatusConfig(status: AssignmentStatus): {
  label: string;
  className: string;
} {
  const map: Record<AssignmentStatus, { label: string; className: string }> = {
    tayyor: {
      label: "Tayyor",
      className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    },
    jarayonda: {
      label: "Jarayonda",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
    },
    demo: {
      label: "Demo",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
    },
  };
  return map[status];
}

// ─── Subject Color Config ────────────────────────────────────────────────────
// Full class names are written as literals so Tailwind JIT detects them.

export function getSubjectColorConfig(color: SubjectColor): {
  bg: string;
  text: string;
  border: string;
  accent: string;
  progressBg: string;
} {
  const map: Record<SubjectColor, { bg: string; text: string; border: string; accent: string; progressBg: string }> = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      accent: "bg-indigo-600",
      progressBg: "bg-indigo-100",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
      accent: "bg-violet-600",
      progressBg: "bg-violet-100",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      accent: "bg-blue-600",
      progressBg: "bg-blue-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      accent: "bg-emerald-600",
      progressBg: "bg-emerald-100",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      accent: "bg-rose-600",
      progressBg: "bg-rose-100",
    },
  };
  return map[color];
}
