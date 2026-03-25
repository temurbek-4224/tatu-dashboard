"use client";

import { useState } from "react";
import { caesarBruteForce, bestCaesarK, type CaesarVariant, type CryptoanalysisData } from "@/lib/cryptoanalysis";

interface Props {
  onDataChange: (data: CryptoanalysisData) => void;
}

function ScoreBar({ score, isBest }: { score: number; isBest: boolean }) {
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isBest ? "bg-amber-400" : "bg-slate-300"}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-[10px] font-mono tabular-nums w-7 text-right ${isBest ? "text-amber-600 font-bold" : "text-slate-400"}`}>
        {score}%
      </span>
    </div>
  );
}

function VariantRow({ v, isBest }: { v: CaesarVariant; isBest: boolean }) {
  const displayText = v.text.length > 52 ? v.text.slice(0, 52) + "…" : v.text;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
        ${isBest
          ? "bg-amber-50 border border-amber-200 shadow-sm"
          : "hover:bg-slate-50 border border-transparent"
        }`}
    >
      {/* k badge */}
      <span
        className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-6 rounded-lg
          text-xs font-bold font-mono border
          ${isBest
            ? "bg-amber-100 text-amber-700 border-amber-200"
            : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
      >
        k={v.k}
      </span>

      {/* Decrypted text */}
      <span
        className={`flex-1 text-sm font-mono truncate
          ${isBest ? "text-slate-900 font-semibold" : "text-slate-600"}`}
      >
        {displayText}
      </span>

      {/* Best badge */}
      {isBest && (
        <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold
          bg-amber-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
          ⭐ Eng ehtimoliy
        </span>
      )}

      {/* Score bar */}
      <div className="flex-shrink-0">
        <ScoreBar score={v.score} isBest={isBest} />
      </div>
    </div>
  );
}

export default function CaesarAnalysis({ onDataChange }: Props) {
  const [ciphertext, setCiphertext] = useState("");
  const [error, setError]           = useState("");
  const [variants, setVariants]     = useState<CaesarVariant[]>([]);
  const [bestK, setBestK]           = useState<number | null>(null);
  const [analyzed, setAnalyzed]     = useState(false);

  const handleAnalyze = () => {
    const t = ciphertext.trim();
    if (!t) { setError("Shifrmatn kiriting."); return; }
    const v = caesarBruteForce(t);
    const bk = bestCaesarK(v);
    setVariants(v);
    setBestK(bk);
    setError("");
    setAnalyzed(true);
    onDataChange({ cipher: "caesar", ciphertext: t, caesarVariants: v, caesarBestK: bk });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); }
  };

  const bestVariant = variants.find((v) => v.k === bestK);

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>To'liq qidiruv (Brute-force):</strong> Sezar shifri uchun k = 1 dan 25 gacha bo'lgan
          barcha variantlar sinab ko'riladi. Ingliz harflari chastotasiga asoslanib eng ehtimoliy variant
          belgilanadi.
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {["25 variant", "Brute-force", "Chastota tahlili"].map((b) => (
          <span key={b}
            className="inline-flex items-center text-xs font-semibold bg-amber-100 text-amber-700
              border border-amber-200 px-2.5 py-1 rounded-full">
            {b}
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Sezar shifrmatn
        </label>
        <textarea
          value={ciphertext}
          onChange={(e) => { setCiphertext(e.target.value); if (error) setError(""); if (analyzed) { setAnalyzed(false); setVariants([]); } }}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Masalan: KHOOR ZRUOG"
          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm font-mono
            text-slate-800 placeholder-slate-400 bg-white outline-none transition-all
            focus:ring-2 focus:ring-amber-200 focus:border-amber-300
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
            : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h8" />
        </svg>
        Barcha 25 variantni ko&apos;rsatish
      </button>

      {/* Results */}
      {analyzed && variants.length > 0 && (
        <div className="space-y-4 animate-result-in">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kriptoanaliz natijalari
            </p>
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-mono">
              25 variant
            </span>
          </div>

          {/* Best variant hero card */}
          {bestVariant && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-100">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg
                  text-xs font-bold bg-amber-400 text-white">
                  ⭐
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">Eng ehtimoliy variant</p>
                  <p className="text-xs text-amber-600 font-mono">k = {bestVariant.k} · chastota ball: {bestVariant.score}%</p>
                </div>
                <span className="text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200
                  px-2 py-0.5 rounded-full">Ingliz chastotasi</span>
              </div>
              <div className="bg-slate-950 px-4 py-3 font-mono">
                <p className="text-xs text-slate-500 mb-1">
                  <span className="text-slate-600">$</span> caesar_decrypt(k={bestVariant.k})
                </p>
                <p className="text-green-400 text-sm break-all leading-relaxed">
                  <span className="text-slate-500 mr-1">›</span>
                  {bestVariant.text}
                </p>
              </div>
              <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
                <p className="text-xs text-amber-700">
                  Variantlarni foydalanuvchi mazmuniga qarab tahlil qiladi.
                  Chastota tahlili — yordam beruvchi heuristik usul.
                </p>
              </div>
            </div>
          )}

          {/* All 25 variants */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <p className="text-xs font-semibold text-slate-500">Barcha mumkin bo&apos;lgan variantlar (k = 1 … 25)</p>
            </div>

            {/* Column headers */}
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border-b border-slate-100">
              <span className="w-9 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kalit</span>
              <span className="flex-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ochilgan matn</span>
              <span className="flex-shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[90px] text-right pr-1">
                Ball
              </span>
            </div>

            <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-50 px-2 py-1.5">
              {variants.map((v) => (
                <VariantRow key={v.k} v={v} isBest={v.k === bestK} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
