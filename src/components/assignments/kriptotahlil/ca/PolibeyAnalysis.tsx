"use client";

import { useState } from "react";
import { decodePolibey, POLIBEY_GRID_ROWS, type CryptoanalysisData } from "@/lib/cryptoanalysis";

interface Props {
  onDataChange: (data: CryptoanalysisData) => void;
}

function PolibeyGrid({ highlight }: { highlight: Array<[number, number]> }) {
  const isHighlighted = (r: number, c: number) =>
    highlight.some(([hr, hc]) => hr === r && hc === c);

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-center font-mono text-sm mx-auto">
        <thead>
          <tr>
            <th className="w-8 h-8" />
            {[1, 2, 3, 4, 5].map((c) => (
              <th key={c}
                className="w-10 h-8 text-xs font-bold text-slate-400 border-b border-slate-200">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {POLIBEY_GRID_ROWS.map((row, ri) => (
            <tr key={ri}>
              <td className="text-xs font-bold text-slate-400 border-r border-slate-200 pr-2">{ri + 1}</td>
              {row.map((cell, ci) => {
                const lit = isHighlighted(ri, ci);
                return (
                  <td
                    key={ci}
                    className={`w-10 h-10 border text-sm font-semibold transition-all rounded
                      ${lit
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-sm scale-105"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-center text-[10px] text-slate-400 mt-2">
        I va J bitta katakni egallaydi (2,4)
      </p>
    </div>
  );
}

export default function PolibeyAnalysis({ onDataChange }: Props) {
  const [ciphertext, setCiphertext] = useState("");
  const [decodeResult, setDecodeResult] = useState<ReturnType<typeof decodePolibey> | null>(null);
  const [showGrid, setShowGrid]         = useState(false);
  const [analyzed, setAnalyzed]         = useState(false);

  const handleAnalyze = () => {
    const result = decodePolibey(ciphertext);
    setDecodeResult(result);
    setAnalyzed(true);
    if (result.valid) {
      onDataChange({ cipher: "polibey", ciphertext: ciphertext.trim(), polibeyResult: result.result });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); }
  };

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 10h18M3 14h18M10 3v18M14 3v18" />
        </svg>
        <p className="text-xs text-emerald-900 leading-relaxed">
          <strong>Standart 5×5 jadval ishlatiladi.</strong> Koordinatlarni bo&apos;sh joy bilan ajrating.
          Bo&apos;shliq uchun <code className="bg-emerald-100 px-1 rounded font-mono">/</code> belgisidan foydalaning.
          Misol: <code className="bg-emerald-100 px-1 rounded font-mono">23 15 31 31 34</code>
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {["5×5 jadval", "Standart jadval", "I=J"].map((b) => (
          <span key={b}
            className="inline-flex items-center text-xs font-semibold bg-emerald-100 text-emerald-700
              border border-emerald-200 px-2.5 py-1 rounded-full">
            {b}
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Polibey koordinatlari
        </label>
        <textarea
          value={ciphertext}
          onChange={(e) => { setCiphertext(e.target.value); if (analyzed) setAnalyzed(false); }}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Masalan: 23 15 31 31 34 / 54 34 42 31 14"
          className="w-full resize-none rounded-xl border border-slate-200 hover:border-slate-300
            px-4 py-3 text-sm font-mono text-slate-800 placeholder-slate-400 bg-white
            outline-none transition-all focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
        />
      </div>

      {/* Action */}
      <button
        onClick={handleAnalyze}
        disabled={!ciphertext.trim()}
        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl
          shadow-sm transition-all active:scale-95
          ${!ciphertext.trim()
            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 10h18M3 14h18M10 3v18M14 3v18" />
        </svg>
        Jadval orqali dekodlash
      </button>

      {/* Validation error */}
      {analyzed && decodeResult && !decodeResult.valid && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 animate-fade-in">
          <svg className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          <p className="text-xs text-rose-700 font-medium leading-relaxed">{decodeResult.error}</p>
        </div>
      )}

      {/* Result */}
      {analyzed && decodeResult?.valid && (
        <div className="space-y-4 animate-result-in">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Kriptoanaliz natijalari
          </p>

          {/* Result card */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden
            hover:shadow-md hover:shadow-emerald-50 hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg
                bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold">03</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Polibey kvadrati — Ochilgan matn</p>
                <p className="text-xs text-emerald-600 font-mono mt-0.5">5×5 · Standart jadval</p>
              </div>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100
                px-2 py-0.5 rounded-full">Ochiq matn</span>
            </div>
            <div className="bg-slate-950 px-4 py-3 font-mono">
              <div className="flex gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
              <p className="text-slate-500 text-xs mb-2">
                <span className="text-slate-600">$</span> polibey_decode("{ciphertext.trim().slice(0, 30)}{ciphertext.trim().length > 30 ? "…" : ""}")
              </p>
              <p className="text-green-400 text-sm break-all leading-relaxed">
                <span className="text-slate-500 mr-1">›</span>
                {decodeResult.result}
              </p>
            </div>
          </div>

          {/* Grid toggle */}
          <button
            onClick={() => setShowGrid((v) => !v)}
            className="flex items-center gap-2 text-xs font-medium text-emerald-600
              hover:text-emerald-700 transition-colors"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showGrid ? "rotate-90" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showGrid ? "Jadvalni yashirish" : "Polibey jadvalini ko'rsatish"}
            {decodeResult.highlightCells.length > 0 && (
              <span className="text-[10px] text-emerald-500">
                ({decodeResult.highlightCells.length} katak belgilangan)
              </span>
            )}
          </button>

          {showGrid && (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 animate-fade-in">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Polibey 5×5 jadvali
                <span className="ml-2 text-emerald-500 normal-case font-normal">
                  (yashil = dekodlangan harflar)
                </span>
              </p>
              <PolibeyGrid highlight={decodeResult.highlightCells} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
