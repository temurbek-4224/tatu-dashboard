"use client";

import { useState } from "react";
import { vigenereGuessedKey, type CryptoanalysisData } from "@/lib/cryptoanalysis";

interface Props {
  onDataChange: (data: CryptoanalysisData) => void;
}

const THEORY_CARDS = [
  {
    step: "01",
    title: "Kasiski testi",
    color: "violet",
    text:
      "Shifrmatnda takrorlanuvchi bo'laklar (trigraflar) topiladi. Ularning orasidagi masofalar " +
      "kalit uzunligining ko'paytmasi bo'ladi. Bu masofalarning EKUB (GCD) kalit uzunligini beradi.",
    example: "Masofalar: 9, 6, 15 → EKUB = 3 → kalit uzunligi = 3",
  },
  {
    step: "02",
    title: "IC indeksi (Index of Coincidence)",
    color: "violet",
    text:
      "Ingliz tilining IC indeksi ≈ 0.065. Tasodifiy matn uchun IC ≈ 0.038. " +
      "Shifrmatnning IC qiymati kalit uzunligini taxmin qilishga yordam beradi: " +
      "qachonki m ta guruhga bo'lib hisoblangan IC 0.065 ga yaqinlashsa, o'm' to'g'ri.",
    example: "IC(shifrmatn) ≈ 0.045 → Vigenere (tasodifiy emas)",
  },
  {
    step: "03",
    title: "Chastota tahlili",
    color: "violet",
    text:
      "Kalit uzunligi m aniqlanganidan so'ng, shifrmatn m ta guruhga bo'linadi. " +
      "Har bir guruh alohida Sezar shifri sifatida qaraladi va chastotaviy tahlil " +
      "qo'llaniladi: eng ko'p uchraydigan harf E harfiga mos deb taxmin qilinadi.",
    example: "Guruh 1 (pozitsiyalar 0, m, 2m, ...): E → harfni almashtirish bilan Sezar yechiladi",
  },
];

export default function VigenereAnalysis({ onDataChange }: Props) {
  const [ciphertext, setCiphertext] = useState("");
  const [guessedKey, setGuessedKey] = useState("");
  const [result, setResult]         = useState("");
  const [error, setError]           = useState("");
  const [keyError, setKeyError]     = useState("");
  const [analyzed, setAnalyzed]     = useState(false);

  const handleAnalyze = () => {
    const ct = ciphertext.trim();
    const gk = guessedKey.trim();
    let hasError = false;

    if (!ct) { setError("Shifrmatn kiriting."); hasError = true; }
    else setError("");

    if (!gk) { setKeyError("Taxminiy kalit kiriting."); hasError = true; }
    else if (!/^[A-Za-z]+$/.test(gk)) { setKeyError("Kalit faqat lotin harflaridan iborat bo'lishi kerak."); hasError = true; }
    else setKeyError("");

    if (hasError) return;

    const out = vigenereGuessedKey(ct, gk);
    setResult(out);
    setAnalyzed(true);
    onDataChange({ cipher: "vigenere", ciphertext: ct, vigenereGuessedKey: gk.toUpperCase(), vigenereResult: out });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); }
  };

  return (
    <div className="space-y-6">
      {/* ── Theory block ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-violet-600 rounded-full" />
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Kriptoanaliz usullari
          </p>
        </div>

        <div className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-violet-900 leading-relaxed">
            <strong>Vijiner shifri avtomatik ochilmaydi.</strong> To&apos;liq kriptoanaliz qilish
            uchun kalit uzunligini aniqlash, so&apos;ngra har bir pozitsiyani alohida Sezar shifri
            sifatida tahlil qilish kerak. Quyida asosiy usullar keltirilgan:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {THEORY_CARDS.map((card) => (
            <div key={card.step}
              className="bg-white rounded-xl border border-violet-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-violet-50 border-b border-violet-100">
                <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white text-xs font-bold
                  rounded-lg flex items-center justify-center">
                  {card.step}
                </span>
                <p className="text-sm font-semibold text-violet-900">{card.title}</p>
              </div>
              <div className="px-4 py-3 space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">{card.text}</p>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <p className="text-xs font-mono text-slate-500">{card.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Demo layer ───────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-violet-400 rounded-full" />
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Taxminiy kalit bilan tahlil
          </p>
          <span className="text-[10px] font-medium bg-violet-100 text-violet-600 border border-violet-200
            px-2 py-0.5 rounded-full">Demo vosita</span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Kalit uzunligini Kasiski usuli bilan topgach, har bir pozitsiyani chastota tahlili
          orqali yechib, taxminiy kalitni kiriting — natijani ko&apos;ring.
        </p>

        {/* Ciphertext input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Vijiner shifrmatn
          </label>
          <textarea
            value={ciphertext}
            onChange={(e) => { setCiphertext(e.target.value); if (error) setError(""); if (analyzed) setAnalyzed(false); }}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Masalan: RIJVS WOFLK"
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm font-mono
              text-slate-800 placeholder-slate-400 bg-white outline-none transition-all
              focus:ring-2 focus:ring-violet-200 focus:border-violet-300
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

        {/* Guessed key + action */}
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
              Taxminiy kalit
            </label>
            <input
              type="text"
              value={guessedKey}
              onChange={(e) => { setGuessedKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, "")); if (keyError) setKeyError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Masalan: KEY"
              maxLength={20}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm font-mono text-slate-800 uppercase
                outline-none transition-all
                focus:ring-2 focus:ring-violet-200 focus:border-violet-300
                ${keyError ? "border-rose-300 bg-rose-50/50" : "border-slate-200 hover:border-slate-300"}`}
            />
            {keyError && (
              <p className="text-xs text-rose-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd" />
                </svg>
                {keyError}
              </p>
            )}
          </div>
          <div className="pt-6">
            <button
              onClick={handleAnalyze}
              disabled={!ciphertext.trim() || !guessedKey.trim()}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl
                shadow-sm transition-all active:scale-95 whitespace-nowrap
                ${!ciphertext.trim() || !guessedKey.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Tahlil qilish
            </button>
          </div>
        </div>

        {/* Result */}
        {analyzed && (
          <div className="animate-result-in">
            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden
              hover:shadow-md hover:shadow-violet-50 hover:border-violet-200 transition-all">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg
                  bg-violet-100 text-violet-700 border border-violet-200 text-xs font-bold">04</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Taxminiy natija</p>
                  <p className="text-xs text-violet-600 font-mono mt-0.5">
                    kalit: {guessedKey} · Vijiner deshifrlash
                  </p>
                </div>
                <span className="text-[10px] font-medium text-violet-700 bg-violet-50 border border-violet-200
                  px-2 py-0.5 rounded-full">Taxminiy kalit</span>
              </div>
              <div className="bg-slate-950 px-4 py-3 font-mono">
                <div className="flex gap-1.5 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <p className="text-slate-500 text-xs mb-2">
                  <span className="text-slate-600">$</span> vigenere_decrypt(key="{guessedKey}")
                </p>
                <p className="text-green-400 text-sm break-all leading-relaxed">
                  <span className="text-slate-500 mr-1">›</span>
                  {result}
                </p>
              </div>
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Kalit to&apos;g&apos;ri bo&apos;lsa, natija o&apos;qiladi. Agar mazmunli bo&apos;lmasa —
                  kalitni qayta ko&apos;rib chiqing yoki kalit uzunligini Kasiski usuli bilan aniqlang.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
