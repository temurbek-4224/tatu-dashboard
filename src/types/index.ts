// ─── Assignment ───────────────────────────────────────────────────────────────

/** Workflow status shown as a badge on assignment cards */
export type AssignmentStatus = "tayyor" | "jarayonda" | "demo";

/**
 * Maps to the interactive React component rendered on the assignment page.
 * Add new program types here as new mini-programs are developed.
 * "placeholder" = assignment page exists but the interactive program is not yet implemented.
 */
export type ProgramType =
  | "calculator"
  | "counter"
  | "textFormatter"
  | "inputOutput"
  | "placeholder";

export interface Assignment {
  id: string;
  slug: string;            // URL segment, e.g. "1-topshiriq"
  title: string;           // Display title, e.g. "1-topshiriq"
  description: string;     // Short description shown on cards
  taskDetails: string;     // Full task description on the assignment page
  status: AssignmentStatus;
  programType: ProgramType;
  notes: string;           // Teacher/student notes shown below the program
}

// ─── Subject ──────────────────────────────────────────────────────────────────

/** Controls the accent color of a subject card and detail page */
export type SubjectColor = "indigo" | "violet" | "blue" | "emerald" | "rose";

export interface Subject {
  id: string;
  slug: string;            // URL segment, e.g. "fan-1"
  name: string;
  description: string;
  color: SubjectColor;
  assignments: Assignment[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  username: string;
  displayName: string;
}

export interface AuthSession {
  user: User;
  authenticatedAt: number; // Unix timestamp — useful for session expiry later
}
