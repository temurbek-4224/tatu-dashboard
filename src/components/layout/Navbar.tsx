"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo / Home link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center
              group-hover:bg-indigo-700 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-semibold text-slate-900 text-sm hidden sm:block">
              Magistratura
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* User chip */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200
                rounded-lg px-3 py-1.5">
                <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-xs font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-medium">{user.displayName}</span>
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600
                px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
              title="Chiqish"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block">Chiqish</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
