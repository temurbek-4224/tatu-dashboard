"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout as authLogout } from "@/lib/auth";
import { User } from "@/types";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    router.push("/login");
    router.refresh(); // Clear Next.js cache so middleware re-evaluates
  }, [router]);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    logout,
  };
}
