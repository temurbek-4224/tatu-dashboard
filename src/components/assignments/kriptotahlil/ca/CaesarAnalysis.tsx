"use client";

import { useState } from "react";
import { caesarBruteForce, type CaesarVariant, type CryptoanalysisData } from "@/lib/cryptoanalysis";

interface Props {
  onDataChange: (data: CryptoanalysisData) => void;
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-slate-300 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[10px] font-mono tabular-nums w-7 text-right text-slate-400">
        {score}%
      </span>
    </div>
  );
}

function VariantRow({
  v,
  isSelected,
  onSelect,
}: {
  v: CaesarVariant;
  isSelected: boolean;
  onSelect: (k: number) => void;
}) {
  const displayText = v.text.length > 52 ? v.text.slice(0, 52) + "…" : v.text;

  return (
    <button
      onClick={() => onSelect(v.k)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
        ${isSelected
          ? "bg-amber-50 border border-amber-300 shadow-sm"
          : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
        }`}
    >
      {/* k badge */}
      <span
        className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-6 rounded-lg
          text-xs font-bold font-mono border transition-all
          ${isSelected
            ? "bg-amber-400 text-white border-amber-400"
            : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
      >
        k={v.k}
      </span>

      {/* Decrypted text */}
      <span
        className={`flex-1 text-sm font-mono truncate transition-colors
          ${isSelected ? "text-slate-900 font-semibold" : "text-slate-600"}`}
      >
        {displayText}
      </span>

      {/* Selected badge OR score bar */}
      {isSelected ? (
        <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold
          bg-amber-400 text-white px-2.5 py-0.5 rounded-full whitespace-nowrap">
          ✓ Tanlangan
        </span>
      ) : (
        <div className="flex-shrink-0">
          <ScoreBar score={v.score} />
        </div>
      )}
    </button>
  );
}

export default function CaesarAnalysis({ onDataChange }: Props) {
  const [ciphertext, setCiphertext] = useState("");
  const [error, setError]           = useState("");
  const [variants, setVariants]     = useState<CaesarVariant[]>([]);
  const [selectedK, setSelectedK]   = useState<number | null>(null);
  const [analyzed, setAnalyzed]     = useState(false);

  const handleAnalyze = () => {
    const t = ciphertext.trim();
    if (!t) { setError("Shifrmatn kiriting."); return; }
    const v = caesarBruteForce(t);
    setVariants(v);
    setSelectedK(null);
    setError("");
    setAnalyzed(true);
    // No auto-selection — caesarSelectedK is intentionally absent
    onDataChange({ cipher: "caesar", ciphertext: t, caesarVariants: v });
  };

  const handleSelect = (k: number) => {
    setSelectedK(k);
    const sel = variants.find((v) => v.k === k);
    onDataChange({
      cipher: "caesar",
      ciphertext: ciphertext.trim(),
      caesarVariants: variants,
      caesarSelectedK: k,
      caesarSelectedText: sel?.text,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); }
  };

  const selectedVariant = variants.find((v) => v.k === selectedK) ?? null;

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>To'liq qidiruv (Brute-force):</strong> k = 1 dan 25 gacha barcha variantlar
          ko'rsatiladi. Chastota balli — yo'naltiruvchi ko'rsatkich.{" "}
          <strong>To'g'ri variantni o'zingiz tanlang.</strong>
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {["25 variant", "Brute-force", "Foydalanuvchi tanlovi"].map((b) => (
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
          onChange={(e) => {
            setCiphertext(e.target.value);
            if (error) setError("");
            if (analyzed) { setAnalyzed(false); setVariants([]); setSelectedK(null); }
          }}
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

          {/* ── Selection summary card ────────────────────────────────────────── */}
          <div
            className={`rounded-2xl border px-4 py-3.5 transition-all duration-200
              ${selectedVariant
                ? "bg-amber-50 border-amber-300 shadow-sm shadow-amber-100"
                : "bg-slate-50 border-slate-200 border-dashed"
              }`}
          >
            {selectedVariant ? (
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-400 text-white text-xs font-bold
                  flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-0.5">
                    Tanlangan variant
                  </p>
                  <p className="text-sm font-mono text-slate-900 truncate">
                    k={selectedVariant.k}&nbsp;&nbsp;→&nbsp;&nbsp;{selectedVariant.text}
                  </p>
                </div>
                <span className="flex-shrink-0 text-[10px] font-semibold text-amber-700
                  bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  PDF uchun tayyor
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-xs text-slate-500">
                  PDFga kiritish uchun quyidagi ro&apos;yxatdan to&apos;g&apos;ri variantni tanlang
                </p>
              </div>
            )}
          </div>

          {/* ── All 25 variants ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <p className="text-xs font-semibold text-slate-500">
                Barcha mumkin bo&apos;lgan variantlar (k = 1 … 25)
              </p>
              <span className="ml-auto text-[10px] text-slate-400">
                Tanlash uchun qatorni bosing
              </span>
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
                <VariantRow
                  key={v.k}
                  v={v}
                  isSelected={v.k === selectedK}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-slate-400 leading-relaxed">
            * Chastota balli ingliz tilining harflar tezligiga asoslangan yordamchi ko&apos;rsatkich.
            To&apos;g&apos;ri variantni mazmuniga qarab foydalanuvchi belgilaydi.
          </p>
        </div>
      )}
    </div>
  );
}
