"use client";

/**
 * Placeholder — shown when an assignment page exists but the interactive
 * program has not been implemented yet.
 *
 * Replace this component by:
 * 1. Creating the real component in src/components/assignments/programs/
 * 2. Adding its ProgramType to src/types/index.ts
 * 3. Registering it in src/components/assignments/InteractiveArea.tsx
 * 4. Updating the assignment's programType in src/data/subjects.ts
 */
export default function Placeholder() {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-6 h-6 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </div>
      <p className="font-semibold text-slate-700 mb-1">Dastur tayyorlanmoqda</p>
      <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
        Bu topshiriq uchun interaktiv dastur hozirda ishlab chiqilmoqda. Tez orada
        bu yerda to&apos;liq ishlayotgan dastur ko&apos;rinadi.
      </p>
      <div className="mt-5 inline-flex items-center gap-2 bg-amber-50 border border-amber-200
        text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
        Ishlab chiqilmoqda
      </div>
    </div>
  );
}
