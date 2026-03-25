"use client";

import { useState } from "react";
import type { CaType, CryptoanalysisData } from "@/lib/cryptoanalysis";
import AtbashAnalysis   from "./ca/AtbashAnalysis";
import CaesarAnalysis   from "./ca/CaesarAnalysis";
import PolibeyAnalysis  from "./ca/PolibeyAnalysis";
import VigenereAnalysis from "./ca/VigenereAnalysis";

interface Props {
  onDataChange:  (data: CryptoanalysisData | null) => void;
  onPDFExport:   () => void;
  isPdfLoading:  boolean;
}

// ── Cipher selector metadata ──────────────────────────────────────────────────
const CIPHERS: Array<{
  id: CaType;
  label: string;
  shortLabel: string;
  tagline: string;
  method: string;
  icon: React.ReactNode;
  accent: {
    card: string;      // border + bg when selected
    badge: string;     // badge background
    label: string;     // label text colour
    idle: string;      // unselected card
  };
}> = [
  {
    id: "atbash",
    label: "Atbash shifri",
    shortLabel: "Atbash",
    tagline: "Teskari alifbo",
    method: "Self-inverse · Kalitsiz",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    accent: {
      card:  "border-rose-300 bg-rose-50 shadow-rose-100",
      badge: "bg-rose-100 text-rose-700 border-rose-200",
      label: "text-rose-700",
      idle:  "border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50/40",
    },
  },
  {
    id: "caesar",
    label: "Sezar shifri",
    shortLabel: "Sezar",
    tagline: "25 variant brute-force",
    method: "To'liq qidiruv · Chastota",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    accent: {
      card:  "border-amber-300 bg-amber-50 shadow-amber-100",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      label: "text-amber-700",
      idle:  "border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/40",
    },
  },
  {
    id: "polibey",
    label: "Polibey kvadrati",
    shortLabel: "Polibey",
    tagline: "5×5 jadval dekodlash",
    method: "Koordinat yechish",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M3 14h18M10 3v18M14 3v18" />
      </svg>
    ),
    accent: {
      card:  "border-emerald-300 bg-emerald-50 shadow-emerald-100",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      label: "text-emerald-700",
      idle:  "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40",
    },
  },
  {
    id: "vigenere",
    label: "Vijiner shifri",
    shortLabel: "Vijiner",
    tagline: "Kasiski + Chastota",
    method: "Kalit taxmini · Demo",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    accent: {
      card:  "border-violet-300 bg-violet-50 shadow-violet-100",
      badge: "bg-violet-100 text-violet-700 border-violet-200",
      label: "text-violet-700",
      idle:  "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40",
    },
  },
];

export default function CryptoanalysisPanel({ onDataChange, onPDFExport, isPdfLoading }: Props) {
  const [selected, setSelected]   = useState<CaType>("atbash");
  const [caData, setCaData]       = useState<CryptoanalysisData | null>(null);

  const handleSelect = (id: CaType) => {
    if (id === selected) return;
    setSelected(id);
    // Reset data when cipher changes
    setCaData(null);
    onDataChange(null);
  };

  const handleDataChange = (data: CryptoanalysisData) => {
    setCaData(data);
    onDataChange(data);
  };

  const activeCipher = CIPHERS.find((c) => c.id === selected)!;

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <div>
          <p className="text-xs font-semibold text-sky-900">Kriptoanaliz rejimi</p>
          <p className="text-xs text-sky-700 mt-0.5 leading-relaxed">
            Shifrmatnni qaysi usul bilan shifrlangan deb taxmin qilsangiz, o&apos;sha algoritmni
            tanlang va analiz qiling. Algoritmlar mustaqil ravishda ishlaydi.
          </p>
        </div>
      </div>

      {/* ── Cipher selector (Radio cards) ────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Shifrlash algoritmini tanlang
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CIPHERS.map((cipher) => {
            const isSelected = cipher.id === selected;
            return (
              <button
                key={cipher.id}
                onClick={() => handleSelect(cipher.id)}
                className={`relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2
                  text-left transition-all duration-150 group
                  ${isSelected
                    ? `${cipher.accent.card} shadow-md`
                    : `${cipher.accent.idle} shadow-sm`
                  }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-current opacity-60" />
                )}

                {/* Icon */}
                <div className={`transition-colors ${isSelected ? cipher.accent.label : "text-slate-400 group-hover:text-slate-600"}`}>
                  {cipher.icon}
                </div>

                {/* Name */}
                <div>
                  <p className={`text-sm font-bold leading-none transition-colors
                    ${isSelected ? cipher.accent.label : "text-slate-700"}`}>
                    {cipher.shortLabel}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{cipher.tagline}</p>
                </div>

                {/* Method badge */}
                <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5
                  rounded-full border transition-all
                  ${isSelected ? cipher.accent.badge : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                  {cipher.method}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border
          ${activeCipher.accent.badge}`}>
          {activeCipher.label}
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* ── Active analysis panel ────────────────────────────────────────── */}
      <div>
        {selected === "atbash"   && <AtbashAnalysis   onDataChange={handleDataChange} />}
        {selected === "caesar"   && <CaesarAnalysis   onDataChange={handleDataChange} />}
        {selected === "polibey"  && <PolibeyAnalysis  onDataChange={handleDataChange} />}
        {selected === "vigenere" && <VigenereAnalysis onDataChange={handleDataChange} />}
      </div>

      {/* ── Results footer with PDF ──────────────────────────────────────── */}
      {(() => {
        const caesarNeedsSelection =
          caData?.cipher === "caesar" &&
          caData.caesarVariants != null &&
          caData.caesarSelectedK == null;
        const pdfBlocked = isPdfLoading || caesarNeedsSelection;

        return (
          <div className="border-t border-slate-100 pt-5 space-y-3">
            {/* Caesar selection warning */}
            {caesarNeedsSelection && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-800">
                  <strong>Variant tanlanmagan.</strong> PDF yaratish uchun yuqoridagi ro&apos;yxatdan
                  to&apos;g&apos;ri Sezar variantini tanlang.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-slate-400">
                {caData && !caesarNeedsSelection
                  ? "Kriptoanaliz natijalari tayyor — PDF ga kiritiladi."
                  : caesarNeedsSelection
                  ? "Variantni tanlagach PDF yuklab olish mumkin bo'ladi."
                  : "Tahlil qilish tugmachasini bosing — natija PDF ga kiradi."}
              </p>

              <button
                onClick={onPDFExport}
                disabled={pdfBlocked}
                title={
                  caesarNeedsSelection
                    ? "Avval to'g'ri Sezar variantini tanlang"
                    : "To'liq akademik hisobotni PDF formatida yuklab olish"
                }
                className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl
                  border transition-all
                  ${isPdfLoading
                    ? "text-rose-400 border-rose-200 bg-rose-50 cursor-not-allowed"
                    : caesarNeedsSelection
                    ? "text-amber-400 border-amber-200 bg-amber-50 cursor-not-allowed"
                    : "text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 active:scale-95"
                  }`}
              >
                {isPdfLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Tayyorlanmoqda…
                  </>
                ) : caesarNeedsSelection ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Variant tanlang
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 10v6m0 0l-2-2m2 2l2-2" />
                    </svg>
                    PDF yuklab olish
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
