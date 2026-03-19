import { AuthSession, User } from "@/types";

const STORAGE_KEY = "masters-auth-session";
const COOKIE_NAME = "masters-auth";

/** Fixed credentials — replace with real auth later */
const CREDENTIALS = {
  username: "creative.teem4224@gmail.com",
  password: "2234224",
};

// ─── Login / Logout ───────────────────────────────────────────────────────────

export function login(username: string, password: string): boolean {
  if (username !== CREDENTIALS.username || password !== CREDENTIALS.password) {
    return false;
  }

  const session: AuthSession = {
    user: {
      username,
      displayName: "Temurbek Xaydarov",
    },
    authenticatedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

  // Set a JS-accessible cookie so Next.js middleware can check auth on the server.
  // For a real app this would be an httpOnly cookie set by the API.
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=true; path=/; expires=${expires}; SameSite=Strict`;

  return true;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
  // Expire the cookie immediately
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

// ─── Session Reads ────────────────────────────────────────────────────────────

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function getUser(): User | null {
  return getSession()?.user ?? null;
}
