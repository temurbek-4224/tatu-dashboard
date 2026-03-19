/**
 * Kriptotahlil — 1-topshiriq
 * Klassik shifrlarni kriptoanalizi
 *
 * Static route — takes priority over [subjectSlug]/[assignmentSlug] dynamic route.
 * Only the interactive panel (CipherPanel) and Q&A (NazoratSavollari)
 * are client components; everything else is server-rendered.
 */

import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import NazoratSavollari from "@/components/assignments/kriptotahlil/NazoratSavollari";
import CipherPanel from "@/components/assignments/kriptotahlil/CipherPanel";

export const metadata: Metadata = {
  title: "1-topshiriq — Kriptotahlil",
};

// ── Polibey grid ──────────────────────────────────────────────────────────────
const polibeyGrid = [
  ["A", "B", "C", "D", "E"],
  ["F", "G", "H", "I/J", "K"],
  ["L", "M", "N", "O", "P"],
  ["Q", "R", "S", "T", "U"],
  ["V", "W", "X", "Y", "Z"],
];

// ── Vigenere worked example ───────────────────────────────────────────────────
const vigenereRows = [
  { label: "Ochiq matn", values: ["H", "E", "L", "L", "O"], color: "text-slate-700" },
  { label: "Kalit (KEY)", values: ["K", "E", "Y", "K", "E"], color: "text-indigo-600" },
  { label: "Shifr matn", values: ["R", "I", "J", "V", "S"], color: "text-rose-600" },
];

// ── Atbash alphabet mapping (first 7 + last) ──────────────────────────────────
const atbashPairs = [
  { plain: "A", cipher: "Z" },
  { plain: "B", cipher: "Y" },
  { plain: "C", cipher: "X" },
  { plain: "D", cipher: "W" },
  { plain: "E", cipher: "V" },
  { plain: "F", cipher: "U" },
  { plain: "G", cipher: "T" },
];

// ── Caesar shift example (k = 3) ─────────────────────────────────────────────
const caesarPairs = [
  { plain: "A", cipher: "D" },
  { plain: "B", cipher: "E" },
  { plain: "C", cipher: "F" },
  { plain: "D", cipher: "G" },
  { plain: "E", cipher: "H" },
  { plain: "X", cipher: "A" },
  { plain: "Y", cipher: "B" },
  { plain: "Z", cipher: "C" },
];

export default function Kriptotahlil1Page() {
  return (
    <div className="animate-slide-up max-w-4xl space-y-6 pb-12">
      <Breadcrumb
        items={[
          { label: "Bosh sahifa", href: "/dashboard" },
          { label: "Kriptotahlil", href: "/subjects/kriptotahlil" },
          { label: "1-topshiriq" },
        ]}
      />

      {/* ── 1. TITLE SECTION ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                1-topshiriq
              </h1>
              {/* Inline status badge */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                Jarayonda
              </span>
            </div>
            <p className="text-sm text-slate-500">
              <span className="font-medium text-indigo-600">Kriptotahlil</span>
              {" "}· Laboratoriya mashg&apos;uloti
            </p>
            <h2 className="text-lg font-semibold text-slate-800 mt-3 leading-snug">
              Klassik shifrlarni kriptoanalizi
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Atbash, Sezar, Polibey kvadrati va Vijiner shifrlarining
              tuzilishi, ishlash prinsipi va kriptoanaliz usullari bilan
              tanishish.
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 font-mono">
            #kr-01
          </div>
        </div>
      </div>

      {/* ── 2. MAQSAD ─────────────────────────────────────────────────────────── */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">
              Mashg&apos;ulot maqsadi
            </h3>
            <p className="text-indigo-900 text-sm leading-relaxed">
              Ushbu amaliy mashg&apos;ulotda klassik shifrlarni —{" "}
              <strong>Atbash</strong>, <strong>Sezar (Caesar)</strong>,{" "}
              <strong>Polibey kvadrati</strong> va{" "}
              <strong>Vijiner (Vigenère)</strong> — kriptoanaliz qilish
              bo&apos;yicha nazariy bilimlarga ega bo&apos;lish va ularni dasturiy tarzda
              amalga oshirish ko&apos;nikmalarini shakllantirish maqsad qilingan.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. NAZARIY QISM ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Nazariy qism
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ── ATBASH ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">
                01
              </span>
              <h3 className="font-semibold text-slate-900">Atbash shifri</h3>
              <span className="ml-auto text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 font-medium">
                1 variant
              </span>
            </div>

            {/* Card body */}
            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  Eng qadimiy shifr usullaridan biri. Dastlab ibroniy alifbosi
                  uchun ishlab chiqilgan.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  Har bir harf alifboning{" "}
                  <strong>teskari tartibidagi</strong> harfiga almashtiriladi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5 flex-shrink-0">▸</span>
                  <strong>Self-inverse</strong>: bir xil algoritm shifrlash va
                  deshifrlash uchun ishlatiladi (kalit yo&apos;q).
                </li>
              </ul>

              {/* Formula */}
              <div className="bg-rose-50 rounded-xl px-4 py-3 border border-rose-100">
                <p className="text-xs text-rose-600 font-semibold mb-1">Formula</p>
                <code className="text-sm font-mono text-rose-800">
                  C = (n − 1) − i
                </code>
                <p className="text-xs text-rose-500 mt-1">
                  n = alifbo uzunligi, i = harf indeksi (0 dan boshlab)
                </p>
              </div>

              {/* Alphabet mapping visual */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Harf almashish jadval (namuna)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left text-slate-500 font-medium pr-2 py-1 whitespace-nowrap">
                          Oddiy
                        </th>
                        {atbashPairs.map(({ plain }) => (
                          <td
                            key={plain}
                            className="px-2 py-1.5 bg-slate-50 border border-slate-100 font-mono font-semibold text-slate-700 rounded"
                          >
                            {plain}
                          </td>
                        ))}
                        <td className="px-2 py-1 text-slate-400">…</td>
                      </tr>
                      <tr>
                        <th className="text-left text-slate-500 font-medium pr-2 py-1 whitespace-nowrap">
                          Shifrlangan
                        </th>
                        {atbashPairs.map(({ cipher }) => (
                          <td
                            key={cipher}
                            className="px-2 py-1.5 bg-rose-50 border border-rose-100 font-mono font-semibold text-rose-700 rounded"
                          >
                            {cipher}
                          </td>
                        ))}
                        <td className="px-2 py-1 text-slate-400">…</td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Misol: <code className="font-mono">HELLO</code> →{" "}
                  <code className="font-mono text-rose-600">SVOOL</code>
                </p>
              </div>
            </div>
          </div>

          {/* ── CAESAR ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                02
              </span>
              <h3 className="font-semibold text-slate-900">Sezar (Caesar) shifri</h3>
              <span className="ml-auto text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-medium">
                25 variant
              </span>
            </div>

            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  Har bir harf alifboda <strong>k ta pozitsiya</strong> oldinga
                  suriladi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  Yagona kalit — <strong>k</strong> (siljish miqdori).
                  Lotin alifbosi uchun k ∈ {"{"}1 … 25{"}"}.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">▸</span>
                  Kriptoanaliz: brute-force (to&apos;liq qidiruv) yoki chastotaviy
                  tahlil bilan osonlik bilan buziladi.
                </li>
              </ul>

              {/* Formulas */}
              <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 space-y-1">
                <p className="text-xs text-amber-600 font-semibold">Formulalar</p>
                <code className="text-sm font-mono text-amber-800 block">
                  Shifrlash:&nbsp; C ≡ (P + k) mod 26
                </code>
                <code className="text-sm font-mono text-amber-800 block">
                  Deshifrlash: P ≡ (C − k) mod 26
                </code>
              </div>

              {/* Shift visual: k=3 */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Siljish diagrammasi (k = 3)
                </p>
                <div className="overflow-x-auto">
                  <table className="text-center text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left text-slate-500 font-medium pr-3 py-1 whitespace-nowrap">
                          Oddiy
                        </th>
                        {caesarPairs.map(({ plain }, i) => (
                          <td
                            key={i}
                            className="px-2 py-1.5 bg-slate-50 border border-slate-100 font-mono font-semibold text-slate-700"
                          >
                            {plain}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th className="text-left text-slate-500 font-medium pr-3 py-1 whitespace-nowrap">
                          Shifrlangan
                        </th>
                        {caesarPairs.map(({ cipher }, i) => (
                          <td
                            key={i}
                            className="px-2 py-1.5 bg-amber-50 border border-amber-100 font-mono font-semibold text-amber-700"
                          >
                            {cipher}
                          </td>
                        ))}
                      </tr>
                    </thead>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Misol (k=3): <code className="font-mono">HELLO</code> →{" "}
                  <code className="font-mono text-amber-600">KHOOR</code>
                </p>
              </div>
            </div>
          </div>

          {/* ── POLIBEY ─────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                03
              </span>
              <h3 className="font-semibold text-slate-900">Polibey kvadrati</h3>
              <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">
                5 × 5 jadval
              </span>
            </div>

            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                  Harflar 5×5 jadvali (kvadrat) ko&apos;rinishida joylashtiriladi.
                  I va J bir katakka yoziladi (25 harf).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                  Har bir harf <strong>(satr, ustun)</strong> koordinatlar
                  juftligi bilan ifodalanadi: A → (1,1), B → (1,2).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                  Kriptoanaliz: <strong>digraf chastota tahlili</strong> —
                  eng ko&apos;p uchraydigan koordinat juftlari tildagi eng
                  keng tarqalgan harflarga mos keladi.
                </li>
              </ul>

              {/* 5×5 Polibey grid */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Polibey kvadrati (5 × 5)
                </p>
                <div className="inline-block border border-emerald-200 rounded-xl overflow-hidden">
                  <table className="text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-50">
                        <th className="w-8 h-8 border border-emerald-200 text-emerald-600 font-bold" />
                        {[1, 2, 3, 4, 5].map((col) => (
                          <th
                            key={col}
                            className="w-8 h-8 border border-emerald-200 text-emerald-600 font-bold"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {polibeyGrid.map((row, ri) => (
                        <tr key={ri}>
                          <td className="w-8 h-8 border border-emerald-200 bg-emerald-50 text-emerald-600 font-bold">
                            {ri + 1}
                          </td>
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="w-8 h-8 border border-slate-100 font-mono font-semibold text-slate-700 hover:bg-emerald-50 transition-colors"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Misol: <code className="font-mono">H</code> → koordinat{" "}
                  <code className="font-mono text-emerald-600">(2, 3)</code>
                </p>
              </div>
            </div>
          </div>

          {/* ── VIGENERE ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-violet-100 text-violet-700 rounded-lg text-xs font-bold">
                04
              </span>
              <h3 className="font-semibold text-slate-900">Vijiner shifri</h3>
              <span className="ml-auto text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 font-medium">
                Ko&apos;p alifboli
              </span>
            </div>

            <div className="p-5 space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  Kalit so&apos;z takrorlanib matn uzunligiga yetkaziladi.
                  Har bir harf shu pozitsiyadagi kalit harfiga qarab suriladi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  Caesar shifriga qaraganda ancha{" "}
                  <strong>murakkab</strong> — chastotaviy tahlilni qiyinlashtiradi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  Kriptoanaliz:{" "}
                  <strong>Kasiski testi</strong> (kalit uzunligi) →
                  chastotaviy tahlil (har kalit pozitsiyasi alohida Caesar).
                </li>
              </ul>

              {/* Formula */}
              <div className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100 space-y-1">
                <p className="text-xs text-violet-600 font-semibold">Formula</p>
                <code className="text-sm font-mono text-violet-800 block">
                  C_i = (P_i + K_(i mod m)) mod 26
                </code>
                <p className="text-xs text-violet-500 mt-1">
                  m = kalit uzunligi, K = kalit so&apos;z
                </p>
              </div>

              {/* Vigenere worked example table */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Shifrlash namunasi — kalit: KEY
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border-collapse">
                    <tbody>
                      {vigenereRows.map(({ label, values, color }) => (
                        <tr key={label}>
                          <td className="text-left text-slate-400 font-medium pr-3 py-1.5 whitespace-nowrap text-xs">
                            {label}
                          </td>
                          {values.map((v, i) => (
                            <td
                              key={i}
                              className={`px-3 py-1.5 border border-slate-100 font-mono font-bold ${color}
                                ${label === "Shifr matn" ? "bg-violet-50" : "bg-slate-50"}`}
                            >
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  H+K=R, E+E=I, L+Y=J, L+K=V, O+E=S
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. NAZORAT SAVOLLARI ──────────────────────────────────────────────── */}
      <NazoratSavollari />

      {/* ── 5. DASTUR QISMI ───────────────────────────────────────────────────── */}
      <CipherPanel />
    </div>
  );
}
