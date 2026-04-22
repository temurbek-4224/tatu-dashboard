"use client";

import { useState } from "react";

interface QAItem { id: number; question: string; answer: React.ReactNode; }

const qaItems: QAItem[] = [
  {
    id: 1,
    question: "SP tarmog'ida S-box va P-box ning vazifalari nimadan iborat?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { sym: "S-box", title: "Confusion", def: "Kirishni nochiziqli almashtiradi. Kalit va shifrmatn o'rtasidagi bog'liqlikni murakkablashtiradi (Shannon).", col: "indigo" },
            { sym: "P-box", title: "Diffusion", def: "Bitlarni qayta tarqatadi. Bir S-box chiqishi keyingi raundda ko'plab S-boxlarga ta'sir qiladi.", col: "sky" },
            { sym: "AddKey", title: "Key mixing", def: "Kalit bilan XOR amaliyoti. Hujumchi kalit bilmay turib keyingi bosqichni oldindan ayta olmaydi.", col: "amber" },
            { sym: "Rounds", title: "Iteratsiya", def: "Har bir raundda S→P→K qo'llaniladi. Ko'proq raund = yuqori xavfsizlik.", col: "emerald" },
          ].map(({ sym, title, def, col }) => (
            <div key={sym} className={`rounded-xl border p-3 bg-${col}-50 border-${col}-100`}>
              <div className="flex items-center gap-2 mb-1">
                <code className={`text-xs font-bold font-mono text-${col}-700 bg-${col}-100 px-1.5 py-0.5 rounded`}>{sym}</code>
                <span className={`text-[10px] font-semibold text-${col}-500 uppercase tracking-wide`}>{title}</span>
              </div>
              <p className="text-xs text-slate-600">{def}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 font-mono text-xs text-slate-600">
          SPN = [AddKey → SubBytes → Permute] × rounds + AddKey
        </div>
      </div>
    ),
  },
  {
    id: 2,
    question: "Differentsial kriptotahlilning asosiy g'oyasi va SP tarmoqlariga ta'siri nima?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          <strong>Differentsial kriptotahlil</strong> (Biham–Shamir, 1990) kirishlar farqining
          (ΔX) chiqishlar farqiga (ΔY) qanday tarqalishini tahlil qiladi.
          SP tarmoqlarida bu tarqalish S-box va P-box orqali izlanadi.
        </p>
        <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-rose-700">Hujum bosqichlari</p>
          {[
            "ΔX = X ⊕ X' (kiritish farqi) aniqlanadi.",
            "S-box DDT jadvalidan eng yuqori ehtimollikli (ΔX→ΔY) juft topiladi.",
            "P-box orqali ΔY keyingi raundga qanday o'tishi hisoblanadi.",
            "Ko'p juft to'plash bilan oxirgi raund kaliti tiklanadi (exhaustive count).",
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-rose-800">
              <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-700 font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    question: "Chiziqli kriptotahlil differentsial kriptotahlildan qanday farq qiladi?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {["Xususiyat", "Chiziqli (LC)", "Differentsial (DC)"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 bg-slate-100 text-slate-600 font-semibold border border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Yil", "1993 (Matsui)", "1990 (Biham–Shamir)"],
                ["Tahlil ob'ekti", "XOR chiziqli korrelyatsiya", "Kiritish farqi tarqalishi"],
                ["Kalit", "Ochiq matn + shifrmatn", "Ochiq matn juftlari"],
                ["Ko'rsatkich", "Bias (LAT)", "Ehtimollik (DDT)"],
                ["Maqsad", "Bias > 0 topish", "Yuqori prob differential"],
              ].map(([feat, lc, dc]) => (
                <tr key={feat}>
                  <td className="px-3 py-1.5 border border-slate-100 font-medium text-slate-600 bg-slate-50">{feat}</td>
                  <td className="px-3 py-1.5 border border-slate-100 text-amber-700">{lc}</td>
                  <td className="px-3 py-1.5 border border-slate-100 text-rose-700">{dc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
          Ikkalasi ham blok shifrlarni tahlil qilishda ishlatiladi. DES ga qarshi LC va DC muvaffaqiyatli qo&apos;llanilgan.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    question: "Kalit tiklovchi differentsial hujum qanday ishlaydi va undan qanday himoyalanish mumkin?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <p>
          Kalit tiklovchi hujum oxirgi raund kalitini taxmin qilish va differentsial xarakteristikadan
          foydalanib to&apos;g&apos;ri taxminni aniqlash asosiga qurilgan.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-amber-700">Algoritm</p>
          <div className="font-mono text-xs text-amber-800 space-y-0.5">
            <div>1. N ta juft {"(P, P')"} to&apos;plash: P XOR P&apos; = DX</div>
            <div>2. Har bir juft uchun {"(C, C')"} — shifrmatn olish</div>
            <div>3. Har k &isin; {"{"} 0..15 {"}"} uchun:</div>
            <div className="pl-4">U = SBOX_inv[C XOR k]</div>
            <div className="pl-4">U&apos; = SBOX_inv[C&apos; XOR k]</div>
            <div className="pl-4">if U XOR U&apos; == target: count[k]++</div>
            <div>4. max(count[k]) → to&apos;g&apos;ri K3</div>
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { n: "1", t: "Ko'proq raund", d: "Har bir qo'shimcha raund differentsial ehtimollikni tushiradi (2⁻ⁿ)" },
            { n: "2", t: "Wide-trail strategiyasi", d: "P-box to'liq tarqatish: aktiv S-boxlar sonini maksimallashtirish (AES)." },
            { n: "3", t: "Random S-box", d: "Zaif differentsiallardan qochish uchun yaxshi DDT ko'rsatkichli S-box tanlash." },
          ].map(({ n, t, d }) => (
            <div key={n} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
              <div><span className="font-semibold text-slate-700">{t}: </span><span className="text-slate-600 text-xs">{d}</span></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function SpnNazoratSavollari() {
  const [openId, setOpenId] = useState<number | null>(null);
  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Nazorat savollari</h2>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">{qaItems.length} ta savol</span>
      </div>
      <div className="space-y-3">
        {qaItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                ${isOpen ? "border-indigo-200 shadow-md shadow-indigo-50" : "border-slate-100 shadow-sm hover:border-slate-200"}`}>
              <button onClick={() => toggle(item.id)} className="w-full flex items-start gap-4 p-5 text-left">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold flex-shrink-0 mt-0.5 transition-colors
                  ${isOpen ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>{item.id}</span>
                <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">{item.question}</p>
                <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-slate-100 pt-4">{item.answer}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
