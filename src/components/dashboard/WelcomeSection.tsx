"use client";

import { useAuth } from "@/hooks/useAuth";

interface WelcomeSectionProps {
  totalSubjects: number;
  totalAssignments: number;
}

export default function WelcomeSection({ totalSubjects, totalAssignments }: WelcomeSectionProps) {
  const { user } = useAuth();
  const name = user?.displayName ?? "Talaba";

  // Extract first name for the greeting
  const firstName = name.split(" ")[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700
      rounded-2xl p-6 sm:p-8 mb-8 text-white">

      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
      <div className="absolute -bottom-8 -right-2 w-48 h-48 bg-white/5 rounded-full" />

      <div className="relative">
        {/* Greeting */}
        <p className="text-indigo-200 text-sm font-medium mb-1">Xush kelibsiz,</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{name}</h1>
        <p className="text-indigo-200 text-sm">
          Magistratura dasturlash fanlari platformasi
        </p>

        {/* Quick stats inline */}
        <div className="flex items-center gap-5 mt-5 pt-5 border-t border-white/20">
          <div>
            <p className="text-2xl font-bold">{totalSubjects}</p>
            <p className="text-indigo-200 text-xs mt-0.5">ta fan</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-2xl font-bold">{totalAssignments}</p>
            <p className="text-indigo-200 text-xs mt-0.5">ta topshiriq</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-2xl font-bold">{new Date().getFullYear()}</p>
            <p className="text-indigo-200 text-xs mt-0.5">o&apos;quv yili</p>
          </div>
        </div>
      </div>
    </div>
  );
}
