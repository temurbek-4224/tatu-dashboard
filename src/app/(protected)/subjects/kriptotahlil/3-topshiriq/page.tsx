/**
 * Kriptotahlil — 3-topshiriq
 * S-box va kriptotahlil usullari
 *
 * Static route — overrides [subjectSlug]/[assignmentSlug] dynamic route.
 * Theory and Q&A are server-rendered; SboxPanel is a "use client" component.
 */

import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SboxNazoratSavollari from "@/components/assignments/kriptotahlil/sbox/SboxNazoratSavollari";
import SboxPanel from "@/components/assignments/kriptotahlil/sbox/SboxPanel";

export const metadata: Metadata = {
  title: "3-topshiriq — Kriptotahlil",
};

// PRESENT S-box worked example
const presentSbox = [12, 5, 6, 11, 9, 0, 10, 13, 3, 14, 15, 8, 4, 7, 1, 2];

export default function Kriptotahlil3Page() {
  return (
    <div className="animate-slide-up max-w-4xl space-y-6 pb-12">
      <Breadcrumb
        items={[
          { label: "Bosh sahifa", href: "/dashboard" },
          { label: "Kriptotahlil", href: "/subjects/kriptotahlil" },
          { label: "3-topshiriq" },
        ]}
      />

      {/* ── 1. TITLE ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">3-topshiriq</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                bg-amber-100 text-amber-700 border border-amber-200">
                Jarayonda
              </span>
            </div>
            <p className="text-sm text-slate-500">
              <span className="font-medium text-indigo-600">Kriptotahlil</span>
              {" "}· Laboratoriya mashg&apos;uloti
            </p>
            <h2 className="text-lg font-semibold text-slate-800 mt-3 leading-snug">
              S-box va kriptotahlil usullari
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              S-box ning kriptografik xususiyatlari, chiziqli approximatsiya jadvali (LAT),
              differentsial taqsimot jadvali (DDT) va ularning amaliy tahlili.
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 font-mono">
            #kr-03
          </div>
        </div>
      </div>

      {/* ── 2. MAQSAD ───────────────────────────────────────────────────────── */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">
              Mashg&apos;ulot maqsadi
            </h3>
            <p className="text-indigo-900 text-sm leading-relaxed">
              Ushbu amaliy mashg&apos;ulotda <strong>S-box (almashish quticha)</strong> tushunchasi
              va uning blok shifrlar (<strong>AES</strong>, <strong>DES</strong>, <strong>PRESENT</strong>)
              dagi roli o&apos;rganiladi. <strong>Chiziqli kriptotahlil</strong> (LAT — Chiziqli
              Approximatsiya Jadvali) va <strong>differentsial kriptotahlil</strong> (DDT —
              Differentsial Taqsimot Jadvali) usullari interaktiv vositalar yordamida amalda
              sinab ko&apos;riladi va S-box ning kriptografik sifati baholanadi.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. NAZARIY QISM ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Nazariy qism
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ── S-BOX ASOSLARI ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-sky-100 text-sky-700 rounded-lg text-xs font-bold">S</span>
              <h3 className="font-semibold text-slate-900">S-box tushunchasi</h3>
              <span className="ml-auto text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 font-medium">
                Almashish quticha
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span>S-box kirish bitlarini chiqish bitlariga almashtiruvchi <strong>nochiziqli</strong> funksiya.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span>AES: <strong>8→8 bit</strong> S-box, GF(2⁸) da multiplikativ inversiyaga asoslangan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span>DES: <strong>6→4 bit</strong> S-boxlar (S1…S8), har bir tur uchun alohida.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span>PRESENT: <strong>4→4 bit</strong> bijektiv S-box — bu mashg&apos;ulotda namuna.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span>Shannon&apos;ning <strong>confusion</strong> tamoyilini amalga oshiradi.</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-sky-50 rounded-xl px-4 py-3 border border-sky-100">
                    <p className="text-xs text-sky-600 font-semibold mb-2">PRESENT S-box namunasi</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse font-mono">
                        <tbody>
                          <tr>
                            <td className="text-sky-600 font-semibold pr-2 py-0.5">x</td>
                            {presentSbox.map((_, i) => (
                              <td key={i} className="text-center text-sky-500 px-1 py-0.5">
                                {i.toString(16).toUpperCase()}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="text-slate-600 font-semibold pr-2 py-0.5">S(x)</td>
                            {presentSbox.map((v, i) => (
                              <td key={i} className="text-center font-bold text-sky-800 px-1 py-0.5">
                                {v.toString(16).toUpperCase()}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 text-xs font-mono text-slate-600 space-y-0.5">
                    <div>SPN: AddKey → <strong>SubBytes</strong> → ShiftRows → MixCols</div>
                    <div className="text-slate-400">4-bit S-box: f: {"{"} 0..15 {"}"} → {"{"} 0..15 {"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CHIZIQLI KRIPTOTAHLIL ───────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">01</span>
              <h3 className="font-semibold text-slate-900">Chiziqli kriptotahlil</h3>
              <span className="ml-auto text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-medium">
                Matsui, 1993
              </span>
            </div>
            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Kirish maskasi <strong>α</strong> va chiqish maskasi <strong>β</strong> berilganda, <code className="font-mono text-xs bg-amber-50 px-1 rounded">α·x = β·S(x)</code> shartini tekshiradi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong>LAT[α][β]</strong> = #{"{"}x : α·x ⊕ β·S(x) = 0{"}"} − 8 (centrlangan bias).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Bias 0 = ideal; ±8 = to&apos;liq chiziqli bog&apos;liqlik (eng yomon).</span>
                </li>
              </ul>
              <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 space-y-1">
                <p className="text-xs text-amber-600 font-semibold">Formulalar</p>
                <code className="text-xs font-mono text-amber-800 block">LAT[α][β] = #{"{"} x : α·x = β·S(x) {"}"} − 8</code>
                <code className="text-xs font-mono text-amber-800 block">Bias ∈ [−8, +8]; NL = 8 − max|bias|</code>
                <code className="text-xs font-mono text-amber-800 block">Ehtimollik = (8 + bias) / 16</code>
              </div>
            </div>
          </div>

          {/* ── DIFFERENTSIAL KRIPTOTAHLIL ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">02</span>
              <h3 className="font-semibold text-slate-900">Differentsial kriptotahlil</h3>
              <span className="ml-auto text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 font-medium">
                Biham–Shamir, 1990
              </span>
            </div>
            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Ikkita kirish X va X&apos; uchun <strong>ΔX = X ⊕ X&apos;</strong> kiritish farqi hisoblanadi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong>ΔY = S(X) ⊕ S(X&apos;)</strong> — chiqish farqi S-box orqali o&apos;tgandan keyin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong>DDT[ΔX][ΔY]</strong> = bu farq juftini hosil qiluvchi juftlar soni.</span>
                </li>
              </ul>
              <div className="bg-rose-50 rounded-xl px-4 py-3 border border-rose-100 space-y-1">
                <p className="text-xs text-rose-600 font-semibold">Formulalar</p>
                <code className="text-xs font-mono text-rose-800 block">ΔX = X ⊕ X&apos;</code>
                <code className="text-xs font-mono text-rose-800 block">DDT[ΔX][ΔY] = #{"{"}x : S(x⊕ΔX)⊕S(x) = ΔY{"}"}</code>
                <code className="text-xs font-mono text-rose-800 block">Ehtimollik = DDT[ΔX][ΔY] / 16</code>
              </div>
            </div>
          </div>

          {/* ── S-BOX XUSUSIYATLARI ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">03</span>
              <h3 className="font-semibold text-slate-900">Yaxshi S-box xususiyatlari</h3>
              <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">
                Dizayn mezonlari
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Nochiziqlilik", abbr: "NL", desc: "max|LAT| kichik. 4-bit ideal: NL = 4", col: "indigo" },
                  { label: "Diff. uniformlik", abbr: "DU", desc: "max DDT kichik (ΔX≠0). Ideal: 2 (APN)", col: "sky" },
                  { label: "Balanslilik", abbr: "B", desc: "Bijeksiya: har qiymat bir marta.", col: "emerald" },
                  { label: "Avalanche (SAC)", abbr: "SAC", desc: "1 bit o'zgarsа ~50% chiqish o'zgaradi.", col: "amber" },
                ].map(({ label, abbr, desc, col }) => (
                  <div key={abbr} className={`rounded-xl border p-3.5 bg-${col}-50 border-${col}-100`}>
                    <div className={`text-2xl font-bold font-mono text-${col}-600 mb-1`}>{abbr}</div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">{label}</div>
                    <div className="text-[11px] text-slate-500">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. NAZORAT SAVOLLARI ────────────────────────────────────────────── */}
      <SboxNazoratSavollari />

      {/* ── 5. AMALIY (DASTUR) QISMI ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Amaliy (Dastur) qismi
          </h2>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium border border-indigo-200">
            Interaktiv
          </span>
        </div>
        <SboxPanel />
      </section>

    </div>
  );
}
