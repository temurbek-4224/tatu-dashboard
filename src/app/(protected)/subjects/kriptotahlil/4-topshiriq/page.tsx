/**
 * Kriptotahlil — 4-topshiriq
 * SP tarmog'i va kriptotahlil
 *
 * Static route — overrides [subjectSlug]/[assignmentSlug] dynamic route.
 * Theory and Q&A are server-rendered; SpnPanel is a "use client" component.
 */

import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SpnNazoratSavollari from "@/components/assignments/kriptotahlil/spn/SpnNazoratSavollari";
import SpnPanel from "@/components/assignments/kriptotahlil/spn/SpnPanel";

export const metadata: Metadata = {
  title: "4-topshiriq — Kriptotahlil",
};

// PRESENT S-box (same as used in SPN)
const presentSbox = [12, 5, 6, 11, 9, 0, 10, 13, 3, 14, 15, 8, 4, 7, 1, 2];
// P-box: bit i → position pbox[i]
const pbox = [2, 0, 3, 1];

export default function Kriptotahlil4Page() {
  return (
    <div className="animate-slide-up max-w-4xl space-y-6 pb-12">
      <Breadcrumb
        items={[
          { label: "Bosh sahifa", href: "/dashboard" },
          { label: "Kriptotahlil", href: "/subjects/kriptotahlil" },
          { label: "4-topshiriq" },
        ]}
      />

      {/* ── 1. TITLE ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">4-topshiriq</h1>
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
              SP tarmog&apos;i va kriptotahlil
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Substitution-Permutation Network (SPN) tuzilmasi, differentsial va chiziqli
              kriptotahlil usullarini 2-raundli o&apos;quv shifri misolida o&apos;rganish va kalit
              tiklovchi hujumni amalda namoyish etish.
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 font-mono">
            #kr-04
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
              Ushbu amaliy mashg&apos;ulotda <strong>Substitution-Permutation Network (SPN)</strong>{" "}
              tuzilmasi — <strong>S-box</strong> (confusion), <strong>P-box</strong> (diffusion) va{" "}
              <strong>kalit qo&apos;shish</strong> bosqichlari — o&apos;rganiladi. 2-raundli 4-bitli
              o&apos;quv shifri misolida <strong>differentsial kriptotahlil</strong> va{" "}
              <strong>chiziqli kriptotahlil</strong> usullari amalda ko&apos;rsatiladi, shuningdek{" "}
              <strong>oxirgi raund kalitini tiklovchi hujum</strong> simulatsiya qilinadi.
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

          {/* ── SPN TUZILMASI ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">S</span>
              <h3 className="font-semibold text-slate-900">SP tarmog&apos;i tuzilmasi</h3>
              <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 font-medium">
                Shannon, 1949
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    SP tarmog&apos;i (SPN) blok shifrlarda ishlatiladigan ketma-ket almashtirish
                    va transpozitsiya (tartibini o&apos;zgartirish) operatsiyalaridan tashkil topadi.
                    Har bir raund uchta bosqichdan iborat:
                  </p>
                  <div className="space-y-2">
                    {[
                      { sym: "AddKey", col: "indigo", desc: "Kalit XOR — hujumchi kalitsiz davom eta olmaydi." },
                      { sym: "SubBytes", col: "sky", desc: "S-box: nochiziqli almashtirish (confusion)." },
                      { sym: "Permute", col: "emerald", desc: "P-box: bitlarni qayta tarqatish (diffusion)." },
                    ].map(({ sym, col, desc }) => (
                      <div key={sym} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 bg-${col}-50 border-${col}-100`}>
                        <code className={`text-xs font-bold font-mono text-${col}-700 bg-${col}-100 px-2 py-0.5 rounded flex-shrink-0`}>{sym}</code>
                        <span className="text-xs text-slate-600">{desc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 font-mono text-xs text-slate-600 space-y-0.5">
                    <div>Round 1: AddKey(K1) → SubBytes → Permute</div>
                    <div>Round 2: AddKey(K2) → SubBytes</div>
                    <div>Final:   AddKey(K3)</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-semibold mb-2">PRESENT S-box (4-bit)</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse font-mono">
                        <tbody>
                          <tr>
                            <td className="text-indigo-600 font-semibold pr-2 py-0.5 text-[10px]">x</td>
                            {presentSbox.map((_, i) => (
                              <td key={i} className="text-center text-indigo-500 px-0.5 py-0.5 text-[10px]">
                                {i.toString(16).toUpperCase()}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="text-slate-600 font-semibold pr-2 py-0.5 text-[10px]">S(x)</td>
                            {presentSbox.map((v, i) => (
                              <td key={i} className="text-center font-bold text-indigo-800 px-0.5 py-0.5 text-[10px]">
                                {v.toString(16).toUpperCase()}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold mb-2">P-box [2, 0, 3, 1]</p>
                    <div className="flex items-center gap-1 font-mono text-xs">
                      {pbox.map((dst, src) => (
                        <div key={src} className="flex flex-col items-center gap-1">
                          <span className="text-slate-400 text-[10px]">bit{src}</span>
                          <span className="text-indigo-600">↓</span>
                          <span className="text-[10px] font-bold text-slate-700">pos{dst}</span>
                        </div>
                      ))}
                      <span className="ml-2 text-[10px] text-slate-400">bit0→pos2, bit1→pos0, bit2→pos3, bit3→pos1</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 text-xs font-mono text-slate-600">
                    <div className="text-slate-400 mb-1">Kalit jadvali:</div>
                    <div>K1 = K</div>
                    <div>K2 = rotL(K, 1)</div>
                    <div>K3 = ~K (4-bit)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── DIFFERENTSIAL KRIPTOTAHLIL ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">01</span>
              <h3 className="font-semibold text-slate-900">Differentsial kriptotahlil</h3>
              <span className="ml-auto text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 font-medium">
                Biham–Shamir, 1990
              </span>
            </div>
            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Ikkita kirish X va X&apos; uchun <strong>ΔX = X ⊕ X&apos;</strong> kiritish farqi tanlanadi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>DDT jadvalidan <strong>eng yuqori ehtimollikli</strong> ΔX→ΔY juft topiladi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>P-box orqali ΔY qanday o&apos;tishi hisoblanadi (<strong>ΔU</strong>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Ko&apos;p juft to&apos;plash bilan oxirgi raund kaliti <strong>K3 tiklanadi</strong>.</span>
                </li>
              </ul>
              <div className="bg-rose-50 rounded-xl px-4 py-3 border border-rose-100 space-y-1">
                <p className="text-xs text-rose-600 font-semibold">Bu mashg&apos;ulot parametrlari</p>
                <code className="text-xs font-mono text-rose-800 block">ΔX = 6 = 0110</code>
                <code className="text-xs font-mono text-rose-800 block">DDT[6][11] = 4  (ehtimollik 4/16)</code>
                <code className="text-xs font-mono text-rose-800 block">ΔU = PBOX(11) = 7 = 0111</code>
              </div>
            </div>
          </div>

          {/* ── CHIZIQLI KRIPTOTAHLIL ───────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">02</span>
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
                  <span>Raundlar orasida bias ko&apos;paytmasi orqali <strong>xarakteristikalar biriktiriladi</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>SPN da P-box chiqish maskalari keyingi S-box kirish maskalari bo&apos;ladi.</span>
                </li>
              </ul>
              <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 space-y-1">
                <p className="text-xs text-amber-600 font-semibold">Formulalar</p>
                <code className="text-xs font-mono text-amber-800 block">LAT[α][β] = #{"{"}x : α·x = β·S(x){"}"} − 8</code>
                <code className="text-xs font-mono text-amber-800 block">Bias ∈ [−8, +8]</code>
                <code className="text-xs font-mono text-amber-800 block">p = (8 + bias) / 16</code>
              </div>
            </div>
          </div>

          {/* ── KALIT TIKLOVCHI HUJUM ────────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-violet-100 text-violet-700 rounded-lg text-xs font-bold">03</span>
              <h3 className="font-semibold text-slate-900">Kalit tiklovchi differentsial hujum</h3>
              <span className="ml-auto text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 font-medium">
                Last-round key recovery
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Oxirgi raund kalitini (K3) taxmin qilish va differentsial xarakteristikadan
                    foydalanib to&apos;g&apos;ri taxminni aniqlash asosiga qurilgan.
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { n: "1", t: "N ta juft (P, P') to'plash", d: "P ⊕ P' = ΔX = 6" },
                      { n: "2", t: "Har juft uchun (C, C') olish", d: "Chosen-plaintext attack" },
                      { n: "3", t: "Har k ∈ {0..15} uchun hisoblash", d: "SBOX⁻¹[C⊕k] ⊕ SBOX⁻¹[C'⊕k] = ΔU?" },
                      { n: "4", t: "max(count[k]) → to'g'ri K3", d: "To'g'ri kalit eng ko'p mos keladi" },
                    ].map(({ n, t, d }) => (
                      <div key={n} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                        <div>
                          <span className="text-xs font-semibold text-slate-700">{t}: </span>
                          <span className="text-xs text-slate-500">{d}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100 font-mono text-xs text-violet-800 space-y-0.5">
                    <div className="text-violet-600 font-semibold mb-1.5">Psevdokod</div>
                    <div>for each (P, P&apos;) pair:</div>
                    <div className="pl-4">(C, C&apos;) = encrypt(P), encrypt(P&apos;)</div>
                    <div>for k in 0..15:</div>
                    <div className="pl-4">U = SBOX_INV[C XOR k]</div>
                    <div className="pl-4">U&apos; = SBOX_INV[C&apos; XOR k]</div>
                    <div className="pl-4">if U XOR U&apos; == 7: count[k]++</div>
                    <div>K3 = argmax(count)</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { label: "Ko'proq raund", icon: "🔄", desc: "Differentsial ehtimollikni pasaytiradi" },
                      { label: "Wide-trail", icon: "🌊", desc: "Aktiv S-box sonini oshiradi (AES)" },
                      { label: "Yaxshi S-box", icon: "🛡", desc: "Kichik DDT maksimumi" },
                    ].map(({ label, icon, desc }) => (
                      <div key={label} className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-center">
                        <div className="text-lg mb-1">{icon}</div>
                        <div className="font-semibold text-slate-700 text-[11px]">{label}</div>
                        <div className="text-slate-500 text-[10px] mt-0.5">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. NAZORAT SAVOLLARI ────────────────────────────────────────────── */}
      <SpnNazoratSavollari />

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
        <SpnPanel />
      </section>

    </div>
  );
}
