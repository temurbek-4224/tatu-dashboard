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
    question: "S-box nima va u kriptografiyada nima uchun ishlatiladi?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          <strong>S-box (Substitution box)</strong> — kriptografik algoritmlarda
          kirish bitlarini chiqish bitlariga almashtiruvchi nochiziqli funksiya.
          Blok shifrlarning asosiy kriptografik kuchi S-boxdan keladi.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { sym: "SPN", def: "Substitution-Permutation Network — AES asosi. S-box va P-box qatlamlaridan iborat.", col: "sky" },
            { sym: "Feistel", def: "DES kabi sxema. F-funksiyasi ichida S-box ishlatiladi.", col: "violet" },
            { sym: "Nochiziqlilik", def: "S-box chiziqli tahlil va differentsial hujumga qarshi himoya beradi.", col: "emerald" },
            { sym: "Bijeksiya", def: "4-bit S-box odatda 16→16 permutatsiya bo'ladi (hech bir qiymat yo'qolmaydi).", col: "amber" },
          ].map(({ sym, def, col }) => (
            <div key={sym} className={`rounded-xl border p-3 bg-${col}-50 border-${col}-100`}>
              <code className={`text-sm font-bold font-mono text-${col}-700`}>{sym}</code>
              <p className="text-xs text-slate-600 mt-1">{def}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    question: "Chiziqli kriptotahlil qanday ishlaydi va maqsadi nima?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          <strong>Chiziqli kriptotahlil</strong> (Matsui, 1993) — ochiq matn va shifrmatn bitlarining
          XOR bog'liqliklarini statistik tahlil qilish orqali kalit bitlarini tiklash usuli.
        </p>
        <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-sky-700">Asosiy g'oya</p>
          <div className="font-mono text-xs text-sky-800 space-y-1">
            <div>LAT[α][β] = #{"{"} x : α·x = β·S(x) {"}"} - 8</div>
            <div>Bias = count − 8   (0 = ideal, ±8 = to'liq chiziqli)</div>
            <div>Ehtimollik = (8 + bias) / 16</div>
          </div>
        </div>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li>Katta ehtimollikdagi chiziqli bog'liqliklar zaiflikni ko'rsatadi</li>
          <li>Yaxshi S-box barcha (α,β) juftliklari uchun biasni minimal ushlab turadi</li>
          <li>AES S-box maksimal biasi ±4 (ideal emas, ammo amalda xavfsiz)</li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    question: "Differentsial kriptotahlil qanday ishlaydi?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          <strong>Differentsial kriptotahlil</strong> (Biham va Shamir, 1990) — ochiq matn
          juftlarining farqi (ΔX) shifrmatn farqiga (ΔY) qanday ta'sir qilishini tahlil
          qiladi. DDT jadvalining baland qiymatlari differentsial zaiflikni ko'rsatadi.
        </p>
        <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-rose-700">Asosiy formula</p>
          <div className="font-mono text-xs text-rose-800 space-y-1">
            <div>ΔX = X ⊕ X&apos;   (kirish farqi)</div>
            <div>ΔY = S(X) ⊕ S(X&apos;)   (chiqish farqi)</div>
            <div>DDT[ΔX][ΔY] = #{"{"} x : S(x ⊕ ΔX) ⊕ S(x) = ΔY {"}"}</div>
            <div>Ehtimollik = DDT[ΔX][ΔY] / 16</div>
          </div>
        </div>
        <div className="flex items-start gap-3 text-xs text-slate-600">
          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center flex-shrink-0">!</span>
          <span>DDT maksimal qiymati (differential uniformity) kichik bo'lsa, S-box differentsial hujumga chidamli. Ideal: 2 (AES S-box = 4).</span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    question: "Kriptografik jihatdan yaxshi S-box qanday xususiyatlarga ega bo'lishi kerak?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          Zamonaviy blok shifrlar uchun S-box bir necha kriptografik xususiyatni bir vaqtda qondirishi
          kerak. Bu xususiyatlar Shannon&apos;ning &quot;confusion&quot; tamoyiliga asoslanadi.
        </p>
        <div className="space-y-2">
          {[
            {
              num: "1",
              title: "Yuqori nochiziqlilik",
              text: "Chiziqli approximatsiya jadvalidagi maksimal bias kichik bo'lishi kerak. 4-bit S-box uchun ideal: NL = 4.",
              col: "indigo",
            },
            {
              num: "2",
              title: "Past differentsial uniformlik",
              text: "DDT ning maksimal qiymati (ΔX≠0 uchun) kichik bo'lishi kerak. Ideal: 2 (APN funksiya).",
              col: "sky",
            },
            {
              num: "3",
              title: "Balanslilik",
              text: "Har bir chiqish qiymati teng sonli kirish qiymatiga ega bo'lishi kerak. Bijeksiya bu shartni avtomatik qondiradi.",
              col: "emerald",
            },
            {
              num: "4",
              title: "SAC va avalanche effekti",
              text: "Bir bit kirish o'zgarganda, chiqishning taxminan yarmi o'zgarishi kerak (Strict Avalanche Criterion).",
              col: "amber",
            },
          ].map(({ num, title, text, col }) => (
            <div key={num} className={`flex items-start gap-3 bg-${col}-50 border border-${col}-100 rounded-xl p-3`}>
              <span className={`w-6 h-6 rounded-full bg-${col}-200 text-${col}-800 text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                {num}
              </span>
              <div>
                <p className={`text-xs font-semibold text-${col}-700 mb-0.5`}>{title}</p>
                <p className="text-xs text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function SboxNazoratSavollari() {
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
                  : "border-slate-100 shadow-sm hover:border-slate-200"}`}
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
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
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
