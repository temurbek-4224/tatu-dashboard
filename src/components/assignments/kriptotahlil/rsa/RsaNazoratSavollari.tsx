"use client";

import { useState } from "react";

interface QAItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

const qaItems: QAItem[] = [
  {
    id: 1,
    question: "RSA algoritmida n, φ(n), e va d parametrlari nimani ifodalaydi?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { sym: "n", def: "p·q — modul. Barcha operatsiyalar shu modul bo'yicha. Ochiq.", col: "sky" },
            { sym: "φ(n)", def: "(p−1)(q−1) — Euler funksiyasi. Maxfiy saqlanadi.", col: "rose" },
            { sym: "e", def: "Ochiq eksponent. EKUB(e, φ(n)) = 1 bo'lishi shart.", col: "amber" },
            { sym: "d", def: "Shaxsiy kalit. d·e ≡ 1 (mod φ(n)). Hech kimga berilmaydi.", col: "violet" },
          ].map(({ sym, def, col }) => (
            <div key={sym} className={`rounded-xl border p-3 bg-${col}-50 border-${col}-100`}>
              <code className={`text-base font-bold font-mono text-${col}-700`}>{sym}</code>
              <p className="text-xs text-slate-600 mt-1">{def}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 text-xs font-mono text-slate-600">
          Ochiq kalit: (e, n) &nbsp;|&nbsp; Shaxsiy kalit: (d, n)
        </div>
      </div>
    ),
  },
  {
    id: 2,
    question: "Takroriy shifrlash hujumi qachon muvaffaqiyatli bo'ladi?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          Hujum C₀ = C, C₁ = C^e mod n, C₂ = C₁^e mod n, ... ketma-ketligini davom
          ettiradi. Cⱼ = C bo&apos;lganda sikl yopiladi va <strong>M = C_(j-1)</strong>.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-amber-700">Qachon samarali?</p>
          <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
            <li>e ning λ(n) bo'yicha tartibi kichik bo'lganda (kichik guruh tartibi)</li>
            <li>n kichik bo'lganda (o'quv maqsadlarida: p, q iki yoki uch xonali)</li>
            <li>Real kriptografiyada katta n uchun sikl uzunligi astronomik darajada katta</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    question: "Ko'r imzo (notarius) hujumidan qanday himoyalanish mumkin?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          Hujumchi notariusni <code className="font-mono text-xs bg-slate-100 px-1 rounded">y = r^e · M mod n</code> ni
          imzolashga majbur qiladi va undan M ning imzosini ajratib oladi.
        </p>
        <div className="space-y-2">
          {[
            { num: "1", text: "Imzodan oldin xabarga hash qo'llash — H(M) ni imzolash (M ni emas)" },
            { num: "2", text: "RSA-PSS (Probabilistic Signature Scheme) standartidan foydalanish" },
            { num: "3", text: "Imzolashdan avval xabar mazmunini insoniy tekshiruv (audit log)" },
          ].map(({ num, text }) => (
            <div key={num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {num}
              </span>
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    question: "Tanlangan shifrmatn hujumini qanday oldini olish mumkin?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          Hujumchi C' = r^e · C mod n ni deshifrlash orakuliga beradi va M = rM · r⁻¹ orqali
          asl matnni topadi. Plain (darslik) RSA bu hujumga himoyasiz.
        </p>
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-violet-700 mb-2">Himoya choralari</p>
          <ul className="text-xs text-violet-800 space-y-1.5 list-disc list-inside">
            <li><strong>OAEP</strong> (Optimal Asymmetric Encryption Padding) — IND-CCA2 xavfsizligi</li>
            <li>Deshifrlash orakuliga kirish ruxsatini cheklash</li>
            <li>RSA-PKCS#1 v2.1 va undan yuqori standartlarni qo'llash</li>
          </ul>
        </div>
        <p className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
          ⚠ Real tizimlarda hech qachon "textbook RSA" ishlatilmaydi — har doim padding sxemasi bilan.
        </p>
      </div>
    ),
  },
];

export default function RsaNazoratSavollari() {
  const [openId, setOpenId] = useState<number | null>(null);
  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Nazorat savollari
        </h2>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
          {qaItems.length} ta savol
        </span>
      </div>

      <div className="space-y-3">
        {qaItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                ${isOpen
                  ? "border-indigo-200 shadow-md shadow-indigo-50"
                  : "border-slate-100 shadow-sm hover:border-slate-200"
                }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-start gap-4 p-5 text-left"
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold flex-shrink-0 mt-0.5 transition-colors
                    ${isOpen ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {item.id}
                </span>
                <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">
                  {item.question}
                </p>
                <svg
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-200
                    ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-slate-100 pt-4">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
