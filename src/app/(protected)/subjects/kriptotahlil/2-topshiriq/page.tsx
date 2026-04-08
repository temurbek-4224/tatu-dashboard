/**
 * Kriptotahlil — 2-topshiriq
 * RSA algoritmi kriptotahlili
 *
 * Static route — overrides [subjectSlug]/[assignmentSlug] dynamic route.
 * Theory and Q&A are server-rendered; RsaPanel is a "use client" component.
 */

import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RsaNazoratSavollari from "@/components/assignments/kriptotahlil/rsa/RsaNazoratSavollari";
import RsaPanel from "@/components/assignments/kriptotahlil/rsa/RsaPanel";

export const metadata: Metadata = {
  title: "2-topshiriq — Kriptotahlil",
};

// RSA key generation worked example (p=61, q=53, e=17)
const rsaExample = {
  p: 61, q: 53, n: 3233, phi: 3120, e: 17, d: 2753,
};

export default function Kriptotahlil2Page() {
  return (
    <div className="animate-slide-up max-w-4xl space-y-6 pb-12">
      <Breadcrumb
        items={[
          { label: "Bosh sahifa", href: "/dashboard" },
          { label: "Kriptotahlil", href: "/subjects/kriptotahlil" },
          { label: "2-topshiriq" },
        ]}
      />

      {/* ── 1. TITLE ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">2-topshiriq</h1>
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
              RSA algoritmi kriptotahlili
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              RSA ochiq kalitli kriptosistemasi, kalit hosil qilish, shifrlash/deshifrlash
              va shaxsiy kalit ma&apos;lum bo&apos;lmagan holatlarda kriptoanaliz usullari.
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 font-mono">
            #kr-02
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
              Ushbu amaliy mashg&apos;ulotda <strong>RSA (Rivest–Shamir–Adleman)</strong> ochiq
              kalitli kriptosistemasi bilan tanishish, uning matematik asoslarini — modulli
              arifmetika, Euler funksiyasi, kalit hosil qilish — o&apos;rganish va shaxsiy kalit
              ma&apos;lum bo&apos;lmagan holatlarda qo&apos;llaniladigan kriptoanaliz usullarini
              (<strong>takroriy shifrlash</strong>, <strong>notarius hujumi</strong>,
              <strong>tanlangan shifrmatn hujumi</strong>) amalda sinab ko&apos;rish maqsad qilingan.
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

          {/* ── RSA ASOSLARI ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-sky-100 text-sky-700 rounded-lg text-xs font-bold">
                RSA
              </span>
              <h3 className="font-semibold text-slate-900">RSA algoritmi asoslari</h3>
              <span className="ml-auto text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 font-medium">
                Ochiq kalitli
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span>Ikkita katta tub son <strong>p</strong> va <strong>q</strong> tanlanadi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span><strong>n = p·q</strong> modul hisoblanadi. Ochiq — barcha biladigan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span><strong>φ(n) = (p−1)(q−1)</strong> Euler funksiyasi — maxfiy saqlanadi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span><strong>e</strong> ochiq eksponent: EKUB(e, φ(n)) = 1 shartini qanoatlantiradi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">▸</span>
                      <span><strong>d = e⁻¹ mod φ(n)</strong> — shaxsiy kalit (Kengaytirilgan Evklid algoritmi).</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="bg-sky-50 rounded-xl px-4 py-3 border border-sky-100 space-y-1.5">
                    <p className="text-xs text-sky-600 font-semibold">Formulalar</p>
                    <code className="text-sm font-mono text-sky-800 block">Shifrlash:   C = M^e mod n</code>
                    <code className="text-sm font-mono text-sky-800 block">Deshifrlash: M = C^d mod n</code>
                    <code className="text-sm font-mono text-sky-800 block">Kalit:       d·e ≡ 1 (mod φ(n))</code>
                  </div>

                  {/* Worked example table */}
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Namuna: p={rsaExample.p}, q={rsaExample.q}, e={rsaExample.e}
                    </p>
                    <table className="w-full text-xs border-collapse">
                      <tbody>
                        {[
                          { label: "n = p·q",           val: String(rsaExample.n),  col: "sky" },
                          { label: "φ(n) = (p-1)(q-1)", val: String(rsaExample.phi), col: "slate" },
                          { label: "d = e⁻¹ mod φ(n)",  val: String(rsaExample.d),  col: "amber" },
                        ].map(({ label, val, col }) => (
                          <tr key={label}>
                            <td className={`text-${col}-600 font-medium py-1 pr-3 font-mono whitespace-nowrap`}>{label}</td>
                            <td className={`font-bold font-mono text-${col}-800 py-1`}>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── TAKRORIY SHIFRLASH ──────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                01
              </span>
              <h3 className="font-semibold text-slate-900">Takroriy shifrlash hujumi</h3>
              <span className="ml-auto text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-medium">
                Kalitsiz
              </span>
            </div>
            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  Faqat <strong>(e, n)</strong> va shifrmatn <strong>C</strong> ma&apos;lum.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  C₀ = C, Cⱼ = C_{"{j-1}"}^e mod n ketma-ketligi hisoblanadi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  Cⱼ = C bo&apos;lganda sikl yopiladi: <strong>M = C_{"{j-1}"}</strong>.
                </li>
              </ul>
              <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 space-y-1">
                <p className="text-xs text-amber-600 font-semibold">Algoritm</p>
                <code className="text-xs font-mono text-amber-800 block">C₁ = C^e mod n</code>
                <code className="text-xs font-mono text-amber-800 block">C₂ = C₁^e mod n</code>
                <code className="text-xs font-mono text-amber-800 block">... j qadam ...</code>
                <code className="text-xs font-mono text-amber-800 block">Cⱼ = C  →  M = C_{"{j-1}"}</code>
              </div>
            </div>
          </div>

          {/* ── NOTARIUS HUJUMI ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-violet-100 text-violet-700 rounded-lg text-xs font-bold">
                02
              </span>
              <h3 className="font-semibold text-slate-900">Notarius (Ko&apos;r imzo) hujumi</h3>
              <span className="ml-auto text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 font-medium">
                Imzo hujumi
              </span>
            </div>
            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  Hujumchi M ni notariusga bevosita imzolattira olmaydi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  Tasodifiy <strong>r</strong> tanlab, <strong>y = r^e · M mod n</strong>
                  ni notariusga beradi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  Notarius y ni imzolaydi: S = y^d = r · M^d mod n.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  Hujumchi: <strong>M^d = S · r⁻¹ mod n</strong> — M ning to&apos;liq imzosi.
                </li>
              </ul>
              <div className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100 space-y-1">
                <p className="text-xs text-violet-600 font-semibold">Qadam-baqadam</p>
                <code className="text-xs font-mono text-violet-800 block">y = r^e · M mod n</code>
                <code className="text-xs font-mono text-violet-800 block">S_y = y^d mod n = r·M^d mod n</code>
                <code className="text-xs font-mono text-violet-800 block">M^d = S_y · r⁻¹ mod n  ✓</code>
              </div>
            </div>
          </div>

          {/* ── TANLANGAN SHIFRMATN ─────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                03
              </span>
              <h3 className="font-semibold text-slate-900">Tanlangan shifrmatn hujumi</h3>
              <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">
                CCA hujumi
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                    Hujumchi C = M^e mod n shifrmatnga ega, lekin M ni bilmaydi.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                    Tasodifiy <strong>r</strong> tanlab, <strong>x = r^e mod n</strong>,
                    {" "}<strong>C&apos; = x·C mod n</strong> hisoblaydi.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                    Deshifrlash orakulidan C&apos; uchun M&apos; = C&apos;^d = rM mod n oladi.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                    <strong>M = M&apos; · r⁻¹ mod n</strong> — asl ochiq matn tiklanadi.
                  </li>
                </ul>
                <div className="bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100 space-y-1">
                  <p className="text-xs text-emerald-600 font-semibold">Hujum sxemasi</p>
                  <code className="text-xs font-mono text-emerald-800 block">x  = r^e mod n</code>
                  <code className="text-xs font-mono text-emerald-800 block">C&apos; = x·C mod n  = (rM)^e mod n</code>
                  <code className="text-xs font-mono text-emerald-800 block">M&apos; = C&apos;^d mod n = rM mod n</code>
                  <code className="text-xs font-mono text-emerald-800 block">M  = M&apos;·r⁻¹ mod n  ✓</code>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. NAZORAT SAVOLLARI ────────────────────────────────────────────── */}
      <RsaNazoratSavollari />

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
        <RsaPanel />
      </section>

    </div>
  );
}
