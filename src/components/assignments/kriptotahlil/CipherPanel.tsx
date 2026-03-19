"use client";

import { useState, useCallback, useRef } from "react";
import {
  encryptAll,
  decryptAll,
  getCaesarSteps,
  getVigenereSteps,
  type CipherResults,
  type CipherStep,
} from "@/lib/ciphers";
import { generateLabPDF } from "@/lib/pdfExport";
import CipherResultCard from "./CipherResultCard";

type Mode = "encrypt" | "decrypt";

const SAMPLE_TEXT = "HELLO WORLD";

const EMPTY_RESULTS: CipherResults = { atbash: "", caesar: "", polibey: "", vigenere: "" };

// howItWorks descriptions per cipher (mode-aware)
const HOW: Record<string, (mode: Mode, caesarKey: number, vigenereKey: string) => string> = {
  atbash: () =>
    "Har bir harf alifboning teskari tartibidagi harfiga almashtiriladi: A↔Z, B↔Y, …. " +
    "Kalit talab qilinmaydi. Shifrlash va deshifrlash operatsiyasi bir xil (self-inverse).",
  caesar: (mode, k) =>
    mode === "encrypt"
      ? `Har bir harf alifboda ${k} ta pozitsiya OLDINGA suriladi: A+${k}=${String.fromCharCode(((0 + k) % 26) + 65)}, B+${k}=${String.fromCharCode(((1 + k) % 26) + 65)}, … Kalit: k = ${k}.`
      : `Har bir harf alifboda ${k} ta pozitsiya ORQAGA suriladi: ${String.fromCharCode(((0 + k) % 26) + 65)}-${k}=A, … Kalit: k = ${k}.`,
  polibey: (mode) =>
    mode === "encrypt"
      ? "Har bir harf 5×5 jadvaldagi (satr, ustun) koordinatlari bilan almashtiriladi. " +
        "Misol: H→23, E→15, L→31. I va J bitta katakni egallaydi. Bo'shliq '/' belgisi bilan ifodalanadi."
      : "Koordinat juftlari (masalan: 23 15 31 31 34) harf jadvaliga qaytariladi. " +
        "Har bir 2 xonali raqam (satr)(ustun) tartibida o'qiladi.",
  vigenere: (mode, _k, vk) =>
    mode === "encrypt"
      ? `Kalit "${vk}" takrorlanib matn uzunligiga yetkaziladi. ` +
        "Har bir harf, shu pozitsiyadagi kalit harfining raqamiy qiymati kadar oldinga suriladi."
      : `Kalit "${vk}" yordamida har bir harf orqaga suriladi. ` +
        "Kasiski testi kalit uzunligini aniqlashga yordam beradi.",
};

export default function CipherPanel() {
  const [mode, setMode]               = useState<Mode>("encrypt");
  const [text, setText]               = useState("");
  const [caesarKey, setCaesarKey]     = useState(3);
  const [vigenereKey, setVigenereKey] = useState("KEY");
  const [results, setResults]         = useState<CipherResults>(EMPTY_RESULTS);
  const [error, setError]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showSteps, setShowSteps]     = useState(false);
  const [allCopied, setAllCopied]     = useState(false);
  const [resultKey, setResultKey]     = useState(0); // drives re-animation
  const textareaRef                   = useRef<HTMLTextAreaElement>(null);

  const hasResults = results.atbash !== "" || results.caesar !== "";
  const inputEmpty = text.trim() === "";

  // ── Compute cipher ────────────────────────────────────────────────────────
  const handleProcess = useCallback(() => {
    if (inputEmpty) {
      setError("Iltimos, matn kiriting.");
      textareaRef.current?.focus();
      return;
    }
    setError("");
    setIsLoading(true);
    // brief pause lets the UI paint the spinner before heavy work
    setTimeout(() => {
      const res =
        mode === "encrypt"
          ? encryptAll(text, caesarKey, vigenereKey)
          : decryptAll(text, caesarKey, vigenereKey);
      setResults(res);
      setResultKey((k) => k + 1);
      setIsLoading(false);
    }, 280);
  }, [text, caesarKey, vigenereKey, mode, inputEmpty]);

  // ── Enter to process ───────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleProcess();
    }
  };

  // ── Mode switch resets results ─────────────────────────────────────────────
  const switchMode = (m: Mode) => {
    setMode(m);
    setResults(EMPTY_RESULTS);
    setError("");
  };

  // ── Clear ──────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setText("");
    setCaesarKey(3);
    setVigenereKey("KEY");
    setResults(EMPTY_RESULTS);
    setError("");
    textareaRef.current?.focus();
  };

  // ── Sample text ────────────────────────────────────────────────────────────
  const handleSample = () => {
    setText(SAMPLE_TEXT);
    setError("");
    textareaRef.current?.focus();
  };

  // ── Copy all ───────────────────────────────────────────────────────────────
  const handleCopyAll = async () => {
    if (!hasResults) return;
    const label = mode === "encrypt" ? "Shifrlash" : "Deshifrlash";
    const formatted = [
      `Kriptotahlil — Klassik Shifrlar (${label})`,
      `Kirish: ${text}`,
      ``,
      `1. Atbash shifri`,
      `   ${results.atbash}`,
      ``,
      `2. Sezar shifri (k = ${caesarKey})`,
      `   ${results.caesar}`,
      ``,
      `3. Polibey kvadrati`,
      `   ${results.polibey}`,
      ``,
      `4. Vijiner shifri (kalit: ${vigenereKey})`,
      `   ${results.vigenere}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(formatted);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  // ── Export .txt ────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!hasResults) return;
    const label = mode === "encrypt" ? "Shifrlash" : "Deshifrlash";
    const date  = new Date().toLocaleDateString("uz-UZ");
    const content = [
      `=========================================`,
      `  KRIPTOTAHLIL — KLASSIK SHIFRLAR`,
      `  ${label.toUpperCase()} NATIJALARI`,
      `=========================================`,
      ``,
      `Sana      : ${date}`,
      `Rejim     : ${label}`,
      `Kirish    : ${text}`,
      `Sezar k   : ${caesarKey}`,
      `Vijiner k : ${vigenereKey}`,
      ``,
      `-----------------------------------------`,
      ``,
      `1. ATBASH SHIFRI`,
      `   ${results.atbash}`,
      ``,
      `2. SEZAR SHIFRI  (k = ${caesarKey})`,
      `   ${results.caesar}`,
      ``,
      `3. POLIBEY KVADRATI`,
      `   ${results.polibey}`,
      ``,
      `4. VIJINER SHIFRI  (kalit: ${vigenereKey})`,
      `   ${results.vigenere}`,
      ``,
      `-----------------------------------------`,
      `  Kriptotahlil laboratoriya dasturi`,
      `=========================================`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `shifrlash-natijalari-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export PDF ────────────────────────────────────────────────────────────
  const handlePDFExport = async () => {
    setIsPdfLoading(true);
    try {
      await generateLabPDF({ inputText: text, caesarKey, vigenereKey, results, mode });
    } finally {
      setIsPdfLoading(false);
    }
  };

  // ── Steps for cards ────────────────────────────────────────────────────────
  const caesarSteps: CipherStep[] = showSteps && hasResults
    ? getCaesarSteps(text, caesarKey, mode)
    : [];
  const vigenereSteps: CipherStep[] = showSteps && hasResults
    ? getVigenereSteps(text, vigenereKey, mode)
    : [];

  const processLabel = mode === "encrypt" ? "Shifrlash" : "Deshifrlash";

  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Amaliy (Dastur) qismi
      </h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* ── Panel header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 leading-none">
                Interaktiv Kriptografiya Laboratoriyasi
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                4 ta klassik shifr · shifrlash & deshifrlash · qadamlar
              </p>
            </div>
          </div>

          {/* Encrypt / Decrypt mode tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 flex-shrink-0">
            <button
              onClick={() => switchMode("encrypt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all
                ${mode === "encrypt"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Shifrlash
            </button>
            <button
              onClick={() => switchMode("decrypt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all
                ${mode === "decrypt"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Deshifrlash
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Mode banner ────────────────────────────────────────────────── */}
          {mode === "decrypt" && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 animate-fade-in">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-emerald-800 leading-relaxed">
                <strong>Deshifrlash rejimi:</strong> Atbash, Sezar va Vijiner uchun shifrmatnni kiriting.
                {" "}Polibey uchun koordinatlarni kiriting (masalan:{" "}
                <code className="font-mono bg-emerald-100 px-1 rounded">23 15 31 31 34</code>).
              </div>
            </div>
          )}

          {/* ── Textarea ───────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {mode === "encrypt" ? "Ochiq matn" : "Shifrmatn"}
              </label>
              <span className="text-xs text-slate-400 font-mono">
                Ctrl+Enter → {processLabel}
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => { setText(e.target.value); if (error) setError(""); }}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder={
                mode === "encrypt"
                  ? "Shifrlash uchun matn kiriting…"
                  : "Deshifrlash uchun shifrmatn kiriting…"
              }
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-800
                placeholder-slate-400 bg-white outline-none transition-all font-mono
                focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                ${error ? "border-rose-300 bg-rose-50/50" : "border-slate-200 hover:border-slate-300"}`}
            />
            {error && (
              <p className="text-xs text-rose-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* ── Key settings ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Caesar key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Sezar kaliti (k)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={caesarKey}
                  onChange={(e) =>
                    setCaesarKey(Math.max(1, Math.min(25, Number(e.target.value) || 1)))
                  }
                  className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono
                    text-slate-800 outline-none focus:ring-2 focus:ring-amber-200
                    focus:border-amber-300 hover:border-slate-300 transition-all text-center"
                />
                <span className="text-xs text-slate-400">1 — 25 oralig&apos;ida</span>
              </div>
            </div>

            {/* Vigenere key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
                Vijiner kaliti (so&apos;z)
              </label>
              <input
                type="text"
                value={vigenereKey}
                onChange={(e) =>
                  setVigenereKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
                }
                placeholder="KEY"
                maxLength={20}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono
                  text-slate-800 uppercase outline-none focus:ring-2 focus:ring-violet-200
                  focus:border-violet-300 hover:border-slate-300 transition-all"
              />
            </div>
          </div>

          {/* ── Action buttons ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary: Process */}
            <button
              onClick={handleProcess}
              disabled={inputEmpty || isLoading}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl
                shadow-sm transition-all active:scale-95
                ${mode === "encrypt"
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 text-white"
                }
                ${(inputEmpty || isLoading) ? "opacity-50 cursor-not-allowed active:scale-100" : ""}`}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Hisoblanmoqda…
                </>
              ) : mode === "encrypt" ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Shifrlash
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Deshifrlash
                </>
              )}
            </button>

            {/* Sample text */}
            {mode === "encrypt" && (
              <button
                onClick={handleSample}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 bg-slate-100
                  hover:bg-slate-200 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Namuna
              </button>
            )}

            {/* Steps toggle */}
            <button
              onClick={() => setShowSteps((v) => !v)}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl
                border transition-all
                ${showSteps
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : "text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h8" />
              </svg>
              Qadamlar
            </button>

            {/* Clear */}
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 bg-slate-50
                hover:bg-slate-100 border border-slate-200 text-sm font-medium px-4 py-2.5
                rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Tozalash
            </button>

            {/* Right-side actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Export */}
              <button
                onClick={handleExport}
                disabled={!hasResults}
                title="Natijani .txt fayl sifatida yuklab olish"
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2.5 rounded-xl
                  border transition-all
                  ${!hasResults
                    ? "text-slate-300 border-slate-100 cursor-not-allowed"
                    : "text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Yuklab olish</span>
              </button>

              {/* Copy all */}
              <button
                onClick={handleCopyAll}
                disabled={!hasResults}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2.5 rounded-xl
                  border transition-all
                  ${allCopied
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : !hasResults
                    ? "text-slate-300 border-slate-100 cursor-not-allowed"
                    : "text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                {allCopied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
                <span className="hidden sm:inline">
                  {allCopied ? "Nusxalandi!" : "Barchasini nusxalash"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Result cards ──────────────────────────────────────────────────────── */}
        <div className="border-t border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {mode === "encrypt" ? "Shifrlash natijalari" : "Deshifrlash natijalari"}
            </p>

            <div className="flex items-center gap-2">
              {hasResults && (
                <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-mono">
                  {text.replace(/\s/g, "").length} harf
                </span>
              )}

              {/* ── PDF Export button ──────────────────────────────────── */}
              <button
                onClick={handlePDFExport}
                disabled={isPdfLoading}
                title="To'liq akademik hisobotni PDF formatida yuklab olish"
                className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl
                  border transition-all
                  ${isPdfLoading
                    ? "text-rose-400 border-rose-200 bg-rose-50 cursor-not-allowed"
                    : "text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 active:scale-95"
                  }`}
              >
                {isPdfLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Tayyorlanmoqda…</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 10v6m0 0l-2-2m2 2l2-2" />
                    </svg>
                    <span>PDF yuklab olish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div key={resultKey} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-result-in">
            <CipherResultCard
              index={1}
              title="Atbash shifri"
              subtitle="A ↔ Z · self-inverse · kalitsiz"
              result={results.atbash}
              inputText={text}
              howItWorks={HOW.atbash(mode, caesarKey, vigenereKey)}
              accentColor="rose"
              isEmpty={!hasResults}
              resultKey={resultKey}
              mode={mode}
            />
            <CipherResultCard
              index={2}
              title="Sezar (Caesar) shifri"
              subtitle={`k = ${caesarKey} · siljish · 25 variant`}
              result={results.caesar}
              inputText={text}
              howItWorks={HOW.caesar(mode, caesarKey, vigenereKey)}
              accentColor="amber"
              isEmpty={!hasResults}
              steps={caesarSteps}
              resultKey={resultKey}
              mode={mode}
            />
            <CipherResultCard
              index={3}
              title="Polibey kvadrati"
              subtitle="5×5 · koordinat juftligi"
              result={results.polibey}
              inputText={text}
              howItWorks={HOW.polibey(mode, caesarKey, vigenereKey)}
              accentColor="emerald"
              isEmpty={!hasResults}
              resultKey={resultKey}
              mode={mode}
            />
            <CipherResultCard
              index={4}
              title="Vijiner (Vigenère) shifri"
              subtitle={`kalit: ${vigenereKey || "KEY"} · ko'p alifboli`}
              result={results.vigenere}
              inputText={text}
              howItWorks={HOW.vigenere(mode, caesarKey, vigenereKey)}
              accentColor="violet"
              isEmpty={!hasResults}
              steps={vigenereSteps}
              resultKey={resultKey}
              mode={mode}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
