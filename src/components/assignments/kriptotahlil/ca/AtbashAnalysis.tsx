"use client";

import { useState } from "react";
import { analyzeAtbash, type CryptoanalysisData } from "@/lib/cryptoanalysis";

interface Props {
  onDataChange: (data: CryptoanalysisData) => void;
}

export default function AtbashAnalysis({ onDataChange }: Props) {
  const [ciphertext, setCiphertext] = useState("");
  const [result, setResult]         = useState("");
  const [error, setError]           = useState("");
  const [analyzed, setAnalyzed]     = useState(false);

  const handleAnalyze = () => {
    const t = ciphertext.trim();
    if (!t) { setError("Shifrmatn kiriting."); return; }
    const out = analyzeAtbash(t);
    setResult(out);
    setError("");
    setAnalyzed(true);
    onDataChange({ cipher: "atbash", ciphertext: t, atbashResult: out });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); }
  };

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-rose-800 leading-relaxed">
          <strong>Atbash — Self-inverse:</strong> Shifrlash va deshifrlash bir xil operatsiya (A↔Z, B↔Y, …).
          Kalit talab qilinmaydi — yagona variant mavjud.
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {["Kalitsiz", "Self-inverse", "1 variant"].map((b) => (
          <span key={b}
            className="inline-flex items-center text-xs font-semibold bg-rose-100 text-rose-700
              border border-rose-200 px-2.5 py-1 rounded-full">
            {b}
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Atbash shifrmatn
        </label>
        <textarea
          value={ciphertext}
          onChange={(e) => { setCiphertext(e.target.value); if (error) setError(""); if (analyzed) setAnalyzed(false); }}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Masalan: SVOOL DLIOW"
          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm font-mono
            text-slate-800 placeholder-slate-400 bg-white outline-none transition-all
            focus:ring-2 focus:ring-rose-200 focus:border-rose-300
            ${error ? "border-rose-300 bg-rose-50/50" : "border-slate-200 hover:border-slate-300"}`}
        />
        {error && (
          <p className="text-xs text-rose-500 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>

      {/* Action */}
      <button
        onClick={handleAnalyze}
        disabled={!ciphertext.trim()}
        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl
          shadow-sm transition-all active:scale-95
          ${!ciphertext.trim()
            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Tahlil qilish
      </button>

      {/* Result */}
      {analyzed && (
        <div className="animate-result-in">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Kriptoanaliz natijasi
          </p>

          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden
            hover:shadow-md hover:shadow-rose-50 hover:border-rose-200 transition-all">
            {/* Terminal */}
            <div className="bg-slate-950 p-4 font-mono">
              <div className="flex gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
              <p className="text-slate-500 text-xs mb-2">
                <span className="text-slate-600">$</span> atbash_decode("{ciphertext.slice(0, 40)}{ciphertext.length > 40 ? "…" : ""}")"
              </p>
              <p className="text-green-400 text-sm break-all leading-relaxed">
                <span className="text-slate-500 mr-1">›</span>
                {result}
              </p>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed">
                Atbash usulida alohida kalit mavjud emas. Shifrlash va ochish bir xil teskari
                alifbo xaritasi orqali bajariladi: har bir A → Z, B → Y, … tartibida almashtiriladi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
