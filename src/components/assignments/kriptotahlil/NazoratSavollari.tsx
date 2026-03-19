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
    question:
      "Caesar va Atbash usullarida nechta variant bilan ochish mumkin?",
    answer: (
      <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-rose-100 text-rose-700 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
            A
          </span>
          <div>
            <p className="font-semibold text-slate-800 mb-1">Atbash shifri — 1 ta variant</p>
            <p>
              Atbash da kalit mavjud emas. Har doim alifboning teskari tartibi
              ishlatiladi (A↔Z, B↔Y, ...). Shuning uchun faqat{" "}
              <strong>bitta deshifrlash varianti</strong> mavjud va bu
              algoritmni qo&apos;llash — o&apos;zida deshifrlash hisoblanadi
              (self-inverse xususiyati).
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
            B
          </span>
          <div>
            <p className="font-semibold text-slate-800 mb-1">
              Caesar shifri — 25 ta variant (lotin alifbosi)
            </p>
            <p>
              Kalit k qiymati 1 dan 25 gacha bo&apos;lishi mumkin (k=0 asl
              matnni beradi). Krptoanalitik har bir k uchun deshifrlashni
              sinab ko&apos;radi — bu <strong>to&apos;liq qidiruv (brute-force)</strong>{" "}
              usuli. Kompyuter uchun bu bir soniya ichida bajariladi. O&apos;zbek
              alifbosi (32 harf) uchun esa 31 ta variant tekshiriladi.
            </p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-100 text-xs font-mono text-slate-600 mt-1">
          Atbash: 1 variant &nbsp;|&nbsp; Caesar (lotin): 25 variant &nbsp;|&nbsp; Caesar (o&apos;zbek): 31 variant
        </div>
      </div>
    ),
  },
  {
    id: 2,
    question:
      "Polibey va Vigenere usullarini kalitsiz qanday tahlil qilish mumkin?",
    answer: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
            P
          </span>
          <div>
            <p className="font-semibold text-slate-800 mb-1">
              Polibey kvadrati — Digraf chastota tahlili
            </p>
            <p>
              Polibey shifrmatni raqam juftlaridan iborat. Tabiiy tilda
              ba&apos;zi harflar (inglizchada E, T, A; o&apos;zbekchada A, I, N)
              boshqalarga nisbatan ko&apos;proq uchraydi. Shifrmatnda{" "}
              <strong>tez-tez uchraydigan koordinat juftlari</strong> shu
              harflarga mos kelishi ehtimoliy. Jadval tuzilmasi (5×5)
              ma&apos;lum bo&apos;lgani uchun koordinatlarni chastota asosida
              tartiblash orqali jadvalning to&apos;liq tiklash mumkin.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-violet-100 text-violet-700 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
            V
          </span>
          <div>
            <p className="font-semibold text-slate-800 mb-1">
              Vigenere shifri — Kasiski testi + Chastota tahlili
            </p>
            <ol className="list-decimal list-inside space-y-1.5 mt-1">
              <li>
                <strong>Kasiski testi</strong> — shifrmatnda takrorlanuvchi
                bo&apos;laklar topiladi. Ularning orasidagi masofalar kalit
                uzunligining ko&apos;paytmasi bo&apos;ladi. EKUB (eng katta
                umumiy bo&apos;luvchi) kalit uzunligini beradi.
              </li>
              <li>
                <strong>Indeks of Coincidence (IC)</strong> — kalit
                uzunligini aniqlashning yana bir usuli. Tabiiytil
                matnlarining IC qiymati shifrlangan matnnikidan yuqori
                bo&apos;ladi.
              </li>
              <li>
                <strong>Chastota tahlili</strong> — kalit uzunligi
                m ma&apos;lum bo&apos;lsa, shifrmatn m ta guruhga bo&apos;linadi.
                Har bir guruh alohida <em>Caesar shifri</em> sifatida
                chastotaviy tahlil bilan yechiladi.
              </li>
            </ol>
          </div>
        </div>
      </div>
    ),
  },
];

export default function NazoratSavollari() {
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
              {/* Question row */}
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-start gap-4 p-5 text-left"
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold flex-shrink-0 mt-0.5 transition-colors
                    ${isOpen
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500"
                    }`}
                >
                  {item.id}
                </span>
                <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">
                  {item.question}
                </p>
                <svg
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-200
                    ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Answer panel */}
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
