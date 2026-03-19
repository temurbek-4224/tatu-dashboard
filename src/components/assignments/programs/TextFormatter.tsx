"use client";

import { useState } from "react";

const transformations = [
  {
    key: "upper",
    label: "KATTA HARFLAR",
    transform: (t: string) => t.toUpperCase(),
  },
  {
    key: "lower",
    label: "kichik harflar",
    transform: (t: string) => t.toLowerCase(),
  },
  {
    key: "title",
    label: "Sarlavha Uslubi",
    transform: (t: string) =>
      t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    key: "reversed",
    label: "desrever",
    transform: (t: string) => t.split("").reverse().join(""),
  },
] as const;

export default function TextFormatter() {
  const [text, setText] = useState("");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="max-w-lg space-y-4">
      {/* Textarea input */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Matn kiriting
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Bu yerga matn yozing..."
          rows={4}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm
            bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
            outline-none transition-all resize-none"
        />
        {/* Stats row */}
        <div className="flex gap-4 mt-1.5 text-xs text-slate-400">
          <span>{charCount} belgi</span>
          <span className="text-slate-200">|</span>
          <span>{wordCount} so&apos;z</span>
        </div>
      </div>

      {/* Transformed outputs */}
      {text && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {transformations.map(({ key, label, transform }) => {
            const result = transform(text);
            return (
              <div key={key} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <p className="text-xs font-medium text-slate-400 mb-1.5">{label}</p>
                <p className="text-sm text-slate-800 break-all leading-relaxed font-mono">
                  {result}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!text && (
        <div className="border-2 border-dashed border-slate-200 rounded-xl py-6 text-center text-slate-400 text-sm">
          Matn kiriting — transformatsiyalar shu yerda chiqadi
        </div>
      )}
    </div>
  );
}
