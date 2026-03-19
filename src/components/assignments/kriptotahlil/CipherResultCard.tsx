"use client";

import { useState } from "react";
import type { CipherStep } from "@/lib/ciphers";

export type AccentColor = "rose" | "amber" | "emerald" | "violet";

interface CipherResultCardProps {
  index: number;
  title: string;
  subtitle: string;
  result: string;
  inputText: string;
  howItWorks: string;
  accentColor: AccentColor;
  isEmpty: boolean;
  steps?: CipherStep[];
  resultKey?: number;    // increment to re-trigger flash animation
  mode: "encrypt" | "decrypt";
}

// All class strings written explicitly so Tailwind JIT detects them
const styles: Record<
  AccentColor,
  { badge: string; label: string; hoverBorder: string; hoverShadow: string; stepRow: string }
> = {
  rose: {
    badge:       "bg-rose-100 text-rose-700 border-rose-200",
    label:       "text-rose-600",
    hoverBorder: "hover:border-rose-200",
    hoverShadow: "hover:shadow-md hover:shadow-rose-50",
    stepRow:     "bg-rose-50 text-rose-800 border-rose-100",
  },
  amber: {
    badge:       "bg-amber-100 text-amber-700 border-amber-200",
    label:       "text-amber-600",
    hoverBorder: "hover:border-amber-200",
    hoverShadow: "hover:shadow-md hover:shadow-amber-50",
    stepRow:     "bg-amber-50 text-amber-800 border-amber-100",
  },
  emerald: {
    badge:       "bg-emerald-100 text-emerald-700 border-emerald-200",
    label:       "text-emerald-600",
    hoverBorder: "hover:border-emerald-200",
    hoverShadow: "hover:shadow-md hover:shadow-emerald-50",
    stepRow:     "bg-emerald-50 text-emerald-800 border-emerald-100",
  },
  violet: {
    badge:       "bg-violet-100 text-violet-700 border-violet-200",
    label:       "text-violet-600",
    hoverBorder: "hover:border-violet-200",
    hoverShadow: "hover:shadow-md hover:shadow-violet-50",
    stepRow:     "bg-violet-50 text-violet-800 border-violet-100",
  },
};

export default function CipherResultCard({
  index,
  title,
  subtitle,
  result,
  inputText,
  howItWorks,
  accentColor,
  isEmpty,
  steps,
  resultKey = 0,
  mode,
}: CipherResultCardProps) {
  const [copied, setCopied]       = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [howOpen, setHowOpen]     = useState(false);
  const s = styles[accentColor];

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const hasSteps = steps && steps.length > 0;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
        flex flex-col transition-all duration-200
        ${s.hoverBorder} ${s.hoverShadow}`}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border flex-shrink-0 ${s.badge}`}>
          {String(index).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
            {title}
          </p>
          <p className={`text-[11px] mt-0.5 font-mono ${s.label}`}>{subtitle}</p>
        </div>

        {/* Result label */}
        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap hidden sm:inline-flex">
          {mode === "encrypt" ? "Shifr matn" : "Ochiq matn"}
        </span>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          disabled={isEmpty}
          title="Nusxalash"
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg
            transition-all border flex-shrink-0
            ${copied
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : isEmpty
              ? "text-slate-300 border-transparent cursor-not-allowed"
              : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100 hover:border-slate-200"
            }`}
        >
          {copied ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          <span className="hidden sm:inline">{copied ? "Nusxalandi!" : "Nusxa"}</span>
        </button>
      </div>

      {/* ── Terminal ────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 p-4 font-mono">
        {/* macOS dots */}
        <div className="flex gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
        </div>

        {/* Input preview */}
        {!isEmpty && inputText && (
          <p className="text-slate-500 text-xs mb-2 truncate">
            <span className="text-slate-600">$</span> {inputText}
          </p>
        )}

        {/* Output */}
        {isEmpty ? (
          <p className="text-slate-600 text-sm">
            <span className="text-slate-500">›</span>{" "}
            <span className="animate-pulse text-slate-700">_</span>
          </p>
        ) : (
          <p
            key={resultKey}
            className="text-green-400 text-sm break-all leading-relaxed animate-result-flash"
          >
            <span className="text-slate-500 mr-1">›</span>
            {result}
          </p>
        )}
      </div>

      {/* ── Step visualization (Caesar / Vigenere only) ─────────────────────── */}
      {hasSteps && !isEmpty && (
        <div className="border-t border-slate-100">
          <button
            onClick={() => setStepsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left
              hover:bg-slate-50 transition-colors"
          >
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5l7 7-7 7" />
              </svg>
              Qadamlar bilan ko&apos;rsatish
              <span className="text-[10px] font-normal text-slate-400">
                ({steps.length} harf)
              </span>
            </span>
            <svg
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${stepsOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {stepsOpen && (
            <div className="px-4 pb-3 animate-fade-in">
              <div className="bg-slate-950 rounded-xl p-3 overflow-x-auto">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-1.5 font-mono text-xs whitespace-nowrap">
                      <span className="text-slate-400">{step.input}</span>
                      {step.keyChar ? (
                        <>
                          <span className="text-slate-600">
                            {mode === "encrypt" ? "+" : "−"}
                          </span>
                          <span className="text-violet-400">{step.keyChar}</span>
                          <span className="text-slate-600 text-[10px]">({step.keyVal})</span>
                          <span className="text-slate-600">=</span>
                        </>
                      ) : (
                        <span className="text-slate-600">→</span>
                      )}
                      <span className="text-green-400 font-semibold">{step.output}</span>
                    </div>
                  ))}
                  {steps.length >= 14 && (
                    <span className="text-slate-600 font-mono text-xs">…</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── How it works collapsible ─────────────────────────────────────────── */}
      <div className="border-t border-slate-100 mt-auto">
        <button
          onClick={() => setHowOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left
            hover:bg-slate-50 transition-colors"
        >
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Qanday ishlaydi?
          </span>
          <svg
            className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-150 ${howOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {howOpen && (
          <div className="px-4 pb-3 pt-0 animate-fade-in">
            <p className="text-xs text-slate-500 leading-relaxed">{howItWorks}</p>
          </div>
        )}
      </div>
    </div>
  );
}
