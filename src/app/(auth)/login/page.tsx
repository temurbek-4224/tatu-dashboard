"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import type { Metadata } from "next";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay for UX (simulates network round-trip; remove in real auth)
    await new Promise((r) => setTimeout(r, 400));

    const success = login(username, password);
    if (success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Foydalanuvchi nomi yoki parol noto'g'ri.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Magistratura Loyihasi</h1>
          <p className="text-slate-500 text-sm mt-1">Dasturlash fanlari topshiriqlari platformasi</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Tizimga kirish</h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email manzil
              </label>
              <input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="email@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm
                  placeholder:text-slate-400 bg-slate-50
                  focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                  transition-all outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Parol
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm
                  placeholder:text-slate-400 bg-slate-50
                  focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                  transition-all outline-none"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700
                disabled:bg-indigo-300 disabled:cursor-not-allowed
                text-white font-semibold text-sm py-2.5 rounded-xl
                shadow-sm shadow-indigo-200 transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Kirish...
                </>
              ) : (
                "Kirish"
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Magistratura Dasturlash Fanlari &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
