"use client";

import { useState, useCallback } from "react";
import {
  validateSbox, analyzeSbox, linearAnalysis, differentialAnalysis, toBin,
  PRESENT_SBOX, AES_NIBBLE_SBOX,
  type SboxAnalysis, type LinearResult, type DifferentialResult,
} from "@/lib/sbox";
import { generateSboxPDF } from "@/lib/sboxPdfExport";

// ── Types ──────────────────────────────────────────────────────────────────────
type ActiveTab = "analyze" | "linear" | "differential";

// ── Tiny UI helpers ────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{children}</span>;
}

function MonoBadge({ children, color = "slate" }: { children: React.ReactNode; color?: string }) {
  const cls: Record<string, string> = {
    slate:   "bg-slate-100 text-slate-700 border-slate-200",
    sky:     "bg-sky-100 text-sky-700 border-sky-200",
    indigo:  "bg-indigo-100 text-indigo-700 border-indigo-200",
    amber:   "bg-amber-100 text-amber-700 border-amber-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rose:    "bg-rose-100 text-rose-700 border-rose-200",
    violet:  "bg-violet-100 text-violet-700 border-violet-200",
  };
  return (
    <span className={`inline-flex items-center font-mono text-xs font-bold px-2 py-0.5 rounded-lg border ${cls[color] ?? cls.slate}`}>
      {children}
    </span>
  );
}

// ── LAT / DDT heat-map cell colour ─────────────────────────────────────────────
function latCellCls(v: number, isHeader: boolean): string {
  if (isHeader) return "bg-slate-100 text-slate-500 font-semibold";
  const a = Math.abs(v);
  if (a === 0) return "bg-white text-slate-200";
  if (a <= 2)  return "bg-yellow-50 text-yellow-600";
  if (a <= 4)  return "bg-orange-100 text-orange-700 font-semibold";
  if (a <= 6)  return "bg-red-200 text-red-800 font-bold";
  return "bg-red-600 text-white font-bold";
}

function ddtCellCls(v: number, isHeader: boolean): string {
  if (isHeader) return "bg-slate-100 text-slate-500 font-semibold";
  if (v === 0)   return "bg-white text-slate-200";
  if (v <= 2)    return "bg-sky-50 text-sky-500";
  if (v <= 4)    return "bg-sky-100 text-sky-700 font-semibold";
  if (v <= 6)    return "bg-sky-300 text-sky-900 font-bold";
  return "bg-sky-600 text-white font-bold";
}

// ── HeatMap component ──────────────────────────────────────────────────────────
function HeatMap({
  data, cellFn, title, highlight,
}: {
  data: number[][];
  cellFn: (v: number, isHeader: boolean) => string;
  title: string;
  highlight?: { row: number; col: number };
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="border-collapse text-[10px] font-mono min-w-max">
          <thead>
            <tr>
              <th className="w-7 h-6 bg-slate-50 border-r border-b border-slate-200 text-slate-400 text-[9px]">↓\→</th>
              {Array.from({ length: 16 }, (_, i) => (
                <th key={i} className={`w-7 h-6 border-b border-slate-200 text-center ${cellFn(0, true)}`}>
                  {i.toString(16).toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, r) => (
              <tr key={r}>
                <td className={`w-7 h-6 border-r border-slate-200 text-center ${cellFn(0, true)}`}>
                  {r.toString(16).toUpperCase()}
                </td>
                {row.map((v, c) => {
                  const isHl = highlight?.row === r && highlight?.col === c;
                  return (
                    <td
                      key={c}
                      className={`w-7 h-6 text-center transition-all
                        ${isHl ? "ring-2 ring-rose-500 ring-inset z-10 relative" : ""}
                        ${cellFn(v, false)}`}
                    >
                      {v !== 0 ? v : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── S-box Setup Section ────────────────────────────────────────────────────────
function SboxSetup({
  inputs, setInputs, onAnalyze, error, analysisReady,
}: {
  inputs: string[];
  setInputs: (v: string[]) => void;
  onAnalyze: () => void;
  error: string;
  analysisReady: boolean;
}) {
  const preset = (arr: readonly number[]) => setInputs(arr.map(String));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label>S-box qiymatlari (0–15, har biri bir marta)</Label>
        <div className="flex gap-2">
          <button
            onClick={() => preset(PRESENT_SBOX)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
          >
            PRESENT S-box
          </button>
          <button
            onClick={() => preset(AES_NIBBLE_SBOX)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all"
          >
            AES nibble
          </button>
        </div>
      </div>

      {/* 16-cell input grid */}
      <div className="grid grid-cols-8 gap-1.5">
        {inputs.map((val, i) => (
          <div key={i} className="space-y-0.5">
            <div className="text-[10px] text-slate-400 font-mono text-center">{i.toString(16).toUpperCase()}</div>
            <input
              type="number"
              min={0}
              max={15}
              value={val}
              onChange={(e) => {
                const next = [...inputs];
                next[i] = e.target.value;
                setInputs(next);
              }}
              className="w-full text-center text-sm font-mono font-bold py-1.5 rounded-lg border border-slate-200
                bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                hover:border-slate-300 transition-all"
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        onClick={onAnalyze}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {analysisReady ? "S-boxni qayta tahlil qilish" : "S-boxni tahlil qilish"}
      </button>
    </div>
  );
}

// ── Analyzer Tab ───────────────────────────────────────────────────────────────
function AnalyzerTab({ result }: { result: SboxAnalysis }) {
  const [showLAT, setShowLAT] = useState(false);
  const [showDDT, setShowDDT] = useState(false);

  const stats = [
    { label: "Nochiziqlilik (NL)", value: String(result.nonlinearity), hint: result.nonlinearity >= 4 ? "Yaxshi" : "Zaif", good: result.nonlinearity >= 4, col: "indigo" },
    { label: "Maks. bias |LAT|", value: String(result.maxAbsBias), hint: result.maxAbsBias <= 4 ? "Qabul qilinadi" : "Yuqori", good: result.maxAbsBias <= 4, col: "amber" },
    { label: "Diff. uniformlik", value: String(result.maxDiffUniformity), hint: result.maxDiffUniformity <= 4 ? "Yaxshi" : "Zaif", good: result.maxDiffUniformity <= 4, col: "sky" },
  ];

  return (
    <div className="space-y-5">
      {/* Mapping table */}
      <div>
        <Label>S-box mos kelish jadvali</Label>
        <div className="mt-2 overflow-x-auto rounded-xl border border-slate-100">
          <table className="border-collapse text-xs font-mono min-w-max w-full">
            <thead>
              <tr>
                <td className="px-2 py-1.5 bg-slate-50 border-b border-r border-slate-200 text-slate-500 font-semibold text-[10px]">x</td>
                {result.sbox.map((_, i) => (
                  <td key={i} className="px-2 py-1.5 bg-slate-50 border-b border-slate-200 text-center text-slate-500 font-semibold">
                    {i.toString(16).toUpperCase()}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-2 border-r border-slate-100 text-slate-500 font-semibold text-[10px] bg-slate-50">S(x)</td>
                {result.sbox.map((v, i) => {
                  const hue = Math.round((v / 15) * 270);
                  return (
                    <td key={i} className="px-2 py-2 text-center font-bold text-slate-800"
                      style={{ backgroundColor: `hsla(${hue}, 80%, 95%, 0.8)` }}>
                      {v.toString(16).toUpperCase()}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, hint, good, col }) => (
          <div key={label} className={`rounded-xl border p-3 bg-${col}-50 border-${col}-100`}>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold font-mono text-${col}-700 mt-0.5`}>{value}</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-1
              ${good ? `text-emerald-600` : `text-rose-600`}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${good ? "bg-emerald-400" : "bg-rose-400"}`} />
              {hint}
            </span>
          </div>
        ))}
      </div>

      {/* Best linear / worst diff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {result.bestLinear && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 space-y-1">
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Eng kuchli chiziqli bog&apos;liqlik</p>
            <div className="font-mono text-xs text-amber-800 space-y-0.5">
              <div>α = {result.bestLinear.alpha.toString(16).toUpperCase()} ({toBin(result.bestLinear.alpha)})</div>
              <div>β = {result.bestLinear.beta.toString(16).toUpperCase()} ({toBin(result.bestLinear.beta)})</div>
              <div className="font-bold">Bias = {result.bestLinear.bias > 0 ? "+" : ""}{result.bestLinear.bias}</div>
            </div>
          </div>
        )}
        {result.worstDiff && (
          <div className="rounded-xl border border-sky-100 bg-sky-50 p-3 space-y-1">
            <p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wide">Eng yuqori differentsial</p>
            <div className="font-mono text-xs text-sky-800 space-y-0.5">
              <div>ΔX = {result.worstDiff.dx.toString(16).toUpperCase()} ({toBin(result.worstDiff.dx)})</div>
              <div>ΔY = {result.worstDiff.dy.toString(16).toUpperCase()} ({toBin(result.worstDiff.dy)})</div>
              <div className="font-bold">Soni = {result.worstDiff.count} / 16 = {(result.worstDiff.count / 16).toFixed(4)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle LAT */}
      <div className="space-y-2">
        <button
          onClick={() => setShowLAT((p) => !p)}
          className="flex items-center gap-2 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-all"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${showLAT ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showLAT ? "LAT jadvalini yashirish" : "Chiziqli Approximatsiya Jadvali (LAT) ko'rsatish"}
        </button>
        {showLAT && (
          <HeatMap
            data={result.lat}
            cellFn={latCellCls}
            title="LAT — chiziqli bog'liqlik (centrlangan, −8 … +8)"
            highlight={result.bestLinear ? { row: result.bestLinear.alpha, col: result.bestLinear.beta } : undefined}
          />
        )}
      </div>

      {/* Toggle DDT */}
      <div className="space-y-2">
        <button
          onClick={() => setShowDDT((p) => !p)}
          className="flex items-center gap-2 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-xl hover:bg-sky-100 transition-all"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${showDDT ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showDDT ? "DDT jadvalini yashirish" : "Differentsial Taqsimot Jadvali (DDT) ko'rsatish"}
        </button>
        {showDDT && (
          <HeatMap
            data={result.ddt}
            cellFn={ddtCellCls}
            title="DDT — differentsial juftlik soni (0 … 16)"
            highlight={result.worstDiff ? { row: result.worstDiff.dx, col: result.worstDiff.dy } : undefined}
          />
        )}
      </div>
    </div>
  );
}

// ── Linear Analysis Tab ────────────────────────────────────────────────────────
function LinearTab({
  sbox, onResult,
}: {
  sbox: number[];
  onResult?: (r: LinearResult) => void;
}) {
  const [alpha, setAlpha] = useState("5");
  const [beta, setBeta]   = useState("3");
  const [result, setResult] = useState<LinearResult | null>(null);
  const [error, setError]   = useState("");

  const handleCompute = () => {
    const a = parseInt(alpha);
    const b = parseInt(beta);
    if (isNaN(a) || a < 0 || a > 15) { setError("α qiymati 0–15 oralig'ida bo'lishi kerak."); return; }
    if (isNaN(b) || b < 0 || b > 15) { setError("β qiymati 0–15 oralig'ida bo'lishi kerak."); return; }
    if (a === 0 && b === 0) { setError("α = 0 va β = 0 trivial holat — kamida bittasi nol bo'lmasin."); return; }
    setError("");
    const r = linearAnalysis(sbox, a, b);
    setResult(r);
    onResult?.(r);
  };

  const biasGood = result ? Math.abs(result.bias) <= 2 : null;

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
        <strong>Maqsad:</strong> α kiritish maskasi va β chiqish maskasi berilganda,
        {" "}<code className="font-mono bg-amber-100 px-1 rounded">α·x = β·S(x)</code> shartini
        qanoatlantiruvchi x qiymatlarini toping va bias kuchini aniqlang.
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: "alpha", label: "α — kiritish maskasi", val: alpha, set: setAlpha, col: "amber" },
          { id: "beta",  label: "β — chiqish maskasi",  val: beta,  set: setBeta,  col: "violet" },
        ].map(({ id, label, val, set, col }) => (
          <div key={id} className="space-y-1.5">
            <label className={`text-xs font-semibold text-${col}-600`}>{label}</label>
            <input
              type="number" min={0} max={15} value={val}
              onChange={(e) => set(e.target.value)}
              className={`w-full text-center text-lg font-mono font-bold py-2 rounded-xl border
                border-${col}-200 bg-${col}-50 text-${col}-800
                focus:outline-none focus:ring-2 focus:ring-${col}-400 focus:border-transparent`}
            />
            <p className={`text-[10px] font-mono text-${col}-500 text-center`}>
              0–15 → {!isNaN(parseInt(val)) ? toBin(parseInt(val)) : "????"}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>
      )}

      <button
        onClick={handleCompute}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Chiziqli bog&apos;liqlikni hisoblash
      </button>

      {result && (
        <div className="space-y-4">
          <div className="border-t border-slate-100" />

          {/* Main result row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Mos x soni</p>
              <p className="text-3xl font-bold font-mono text-slate-800 mt-1">{result.count}<span className="text-sm text-slate-400"> / 16</span></p>
            </div>
            <div className={`rounded-xl border p-3 text-center
              ${biasGood ? "border-emerald-100 bg-emerald-50" : "border-orange-100 bg-orange-50"}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wide ${biasGood ? "text-emerald-500" : "text-orange-500"}`}>Bias</p>
              <p className={`text-3xl font-bold font-mono mt-1 ${biasGood ? "text-emerald-700" : "text-orange-700"}`}>
                {result.bias > 0 ? "+" : ""}{result.bias}
              </p>
            </div>
          </div>

          {/* Formula box */}
          <div className="bg-slate-900 rounded-xl px-4 py-3 font-mono text-xs space-y-1.5">
            <div className="text-slate-400">Shart: <span className="text-amber-300">α·x ⊕ β·S(x) = 0</span></div>
            <div className="text-slate-400">
              α = <span className="text-amber-200">{result.alpha.toString(16).toUpperCase()}</span>
              <span className="text-slate-600"> ({toBin(result.alpha)})</span>
              {"  "}β = <span className="text-violet-200">{result.beta.toString(16).toUpperCase()}</span>
              <span className="text-slate-600"> ({toBin(result.beta)})</span>
            </div>
            <div className="text-slate-400">
              Ehtimollik = <span className="text-green-300">{result.count}</span>/16 ={" "}
              <span className="text-green-300">{result.probability.toFixed(4)}</span>
            </div>
          </div>

          {/* Matching x values */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Shartni qanoatlantiruvchi x qiymatlari ({result.matches.length} ta):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 16 }, (_, i) => {
                const match = result.matches.includes(i);
                return (
                  <span key={i}
                    className={`inline-flex items-center gap-0.5 font-mono text-xs px-2 py-0.5 rounded-lg border font-semibold
                      ${match
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-white text-slate-300 border-slate-100"}`}>
                    {i.toString(16).toUpperCase()}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Interpretation */}
          <div className={`rounded-xl border px-4 py-3 text-xs leading-relaxed
            ${biasGood ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-orange-50 border-orange-100 text-orange-800"}`}>
            {biasGood
              ? <><strong>Yaxshi natija:</strong> Bias ={result.bias} kichik — bu S-box (α,β) juftligi uchun chiziqli bog&apos;liqlikdan yaxshi himoyalangan.</>
              : <><strong>Kuchli bog&apos;liqlik:</strong> Bias ={result.bias > 0 ? "+" : ""}{result.bias} — bu (α,β) juftligi hujumchi tomonidan chiziqli kriptotahlilda ishlatilishi mumkin.</>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Differential Analysis Tab ──────────────────────────────────────────────────
function DifferentialTab({
  sbox, onResult,
}: {
  sbox: number[];
  onResult?: (r: DifferentialResult) => void;
}) {
  const [xVal,  setXVal]  = useState("3");
  const [xpVal, setXpVal] = useState("5");
  const [result, setResult] = useState<DifferentialResult | null>(null);
  const [error,  setError]  = useState("");

  const handleCompute = () => {
    const x  = parseInt(xVal);
    const xp = parseInt(xpVal);
    if (isNaN(x)  || x  < 0 || x  > 15) { setError("X qiymati 0–15 oralig'ida bo'lishi kerak."); return; }
    if (isNaN(xp) || xp < 0 || xp > 15) { setError("X' qiymati 0–15 oralig'ida bo'lishi kerak."); return; }
    setError("");
    const r = differentialAnalysis(sbox, x, xp);
    setResult(r);
    onResult?.(r);
  };

  const probGood = result ? result.probability <= 0.25 : null;

  return (
    <div className="space-y-5">
      <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-xs text-rose-800">
        <strong>Maqsad:</strong> Ikkita kirish juftini (X va X&apos;) tahlil qilib,
        kiritish farqi ΔX va chiqish farqi ΔY ni aniqlang. DDT jadvalidagi
        ehtimollik S-box ning differentsial xavfsizligini ko&apos;rsatadi.
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: "x",  label: "X — birinchi kirish",  val: xVal,  set: setXVal,  col: "sky" },
          { id: "xp", label: "X\u2019 — ikkinchi kirish", val: xpVal, set: setXpVal, col: "emerald" },
        ].map(({ id, label, val, set, col }) => (
          <div key={id} className="space-y-1.5">
            <label className={`text-xs font-semibold text-${col}-600`}>{label}</label>
            <input
              type="number" min={0} max={15} value={val}
              onChange={(e) => set(e.target.value)}
              className={`w-full text-center text-lg font-mono font-bold py-2 rounded-xl border
                border-${col}-200 bg-${col}-50 text-${col}-800
                focus:outline-none focus:ring-2 focus:ring-${col}-400 focus:border-transparent`}
            />
            <p className={`text-[10px] font-mono text-${col}-500 text-center`}>
              0–15 → {!isNaN(parseInt(val)) ? toBin(parseInt(val)) : "????"}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>
      )}

      <button
        onClick={handleCompute}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Differentsial farqni hisoblash
      </button>

      {result && (
        <div className="space-y-4">
          <div className="border-t border-slate-100" />

          {/* Step-by-step breakdown */}
          <div className="bg-slate-900 rounded-xl px-4 py-4 font-mono text-xs space-y-2.5">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Hisoblash bosqichlari</div>
            {[
              {
                step: "1",
                label: "X  = " + result.x.toString(16).toUpperCase(),
                sub:   "(" + toBin(result.x) + ")",
                color: "sky",
              },
              {
                step: "2",
                label: "X' = " + result.xPrime.toString(16).toUpperCase(),
                sub:   "(" + toBin(result.xPrime) + ")",
                color: "emerald",
              },
              {
                step: "3",
                label: "ΔX = X ⊕ X' = " + result.dx.toString(16).toUpperCase(),
                sub:   "(" + toBin(result.dx) + ")",
                color: "amber",
              },
              {
                step: "4",
                label: "S(X)  = " + result.y.toString(16).toUpperCase(),
                sub:   "(" + toBin(result.y) + ")",
                color: "sky",
              },
              {
                step: "5",
                label: "S(X') = " + result.yPrime.toString(16).toUpperCase(),
                sub:   "(" + toBin(result.yPrime) + ")",
                color: "emerald",
              },
              {
                step: "6",
                label: "ΔY = S(X) ⊕ S(X') = " + result.dy.toString(16).toUpperCase(),
                sub:   "(" + toBin(result.dy) + ")",
                color: "rose",
              },
            ].map(({ step, label, sub, color }) => (
              <div key={step} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {step}
                </span>
                <span className={`text-${color}-300 font-bold`}>{label}</span>
                <span className="text-slate-600">{sub}</span>
              </div>
            ))}
            <div className="border-t border-slate-700 pt-2">
              <div className="text-slate-400">
                DDT[<span className="text-amber-300">{result.dx.toString(16).toUpperCase()}</span>][<span className="text-rose-300">{result.dy.toString(16).toUpperCase()}</span>]
                {" "}= <span className="text-white font-bold">{result.ddtCount}</span>
                {" "}→ ehtimollik = <span className="text-green-300 font-bold">{result.ddtCount}/{16} = {result.probability.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Key pair summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
              <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wide">Kiritish farqi ΔX</p>
              <p className="text-2xl font-bold font-mono text-amber-800 mt-1">
                {result.dx.toString(16).toUpperCase()}
              </p>
              <p className="text-[10px] font-mono text-amber-500 mt-0.5">{toBin(result.dx)}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-center">
              <p className="text-[10px] text-rose-500 font-semibold uppercase tracking-wide">Chiqish farqi ΔY</p>
              <p className="text-2xl font-bold font-mono text-rose-800 mt-1">
                {result.dy.toString(16).toUpperCase()}
              </p>
              <p className="text-[10px] font-mono text-rose-500 mt-0.5">{toBin(result.dy)}</p>
            </div>
          </div>

          {/* Interpretation */}
          <div className={`rounded-xl border px-4 py-3 text-xs leading-relaxed
            ${probGood ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-orange-50 border-orange-100 text-orange-800"}`}>
            {probGood
              ? <><strong>Yaxshi natija:</strong> DDT[{result.dx.toString(16).toUpperCase()}][{result.dy.toString(16).toUpperCase()}] = {result.ddtCount} — ehtimollik {result.probability.toFixed(3)} past, bu differentsial zanjir zaif.</>
              : <><strong>Yuqori ehtimollik:</strong> DDT = {result.ddtCount}/16 = {result.probability.toFixed(3)} — bu differentsial juft differentsial hujumda ishlatilishi mumkin (past qiymat afzal).</>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────────────
export default function SboxPanel() {
  // S-box setup state
  const [sboxInputs, setSboxInputs] = useState<string[]>(
    [...PRESENT_SBOX].map(String)
  );
  const [sboxResult,   setSboxResult]   = useState<SboxAnalysis | null>(null);
  const [sboxError,    setSboxError]    = useState("");
  const [activeTab,    setActiveTab]    = useState<ActiveTab>("analyze");

  // PDF record state (persists across tab switches)
  const [analyzeRecord, setAnalyzeRecord] = useState<SboxAnalysis | null>(null);
  const [linearRecord,  setLinearRecord]  = useState<LinearResult | null>(null);
  const [diffRecord,    setDiffRecord]    = useState<DifferentialResult | null>(null);
  const [isPdfLoading,  setPdfLoading]    = useState(false);

  const handleAnalyze = () => {
    const nums = sboxInputs.map((s) => parseInt(s));
    const validation = validateSbox(nums);
    if (!validation.valid) {
      setSboxError(validation.error ?? "Noto'g'ri S-box.");
      setSboxResult(null);
      return;
    }
    setSboxError("");
    const analysis = analyzeSbox(nums);
    setSboxResult(analysis);
    setAnalyzeRecord(analysis);
    setActiveTab("analyze");
  };

  const anyResult = analyzeRecord !== null || linearRecord !== null || diffRecord !== null;

  const handlePDF = useCallback(async () => {
    if (!analyzeRecord) return;
    setPdfLoading(true);
    try {
      await generateSboxPDF({
        sboxAnalysis: analyzeRecord,
        linearResult: linearRecord ?? undefined,
        diffResult:   diffRecord   ?? undefined,
      });
    } finally {
      setPdfLoading(false);
    }
  }, [analyzeRecord, linearRecord, diffRecord]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      {/* ── Panel header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900">S-box Laboratoriya Vositasi</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            S-box tahlili · Chiziqli tahlil · Differentsial tahlil
          </p>
        </div>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
          Interaktiv
        </span>
      </div>

      <div className="p-6 space-y-6">

        {/* ── S-box setup ──────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">S</span>
            <h4 className="text-sm font-semibold text-slate-700">S-box sozlash</h4>
            {sboxResult && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                S-box yuklangan
              </span>
            )}
          </div>
          <SboxSetup
            inputs={sboxInputs}
            setInputs={setSboxInputs}
            onAnalyze={handleAnalyze}
            error={sboxError}
            analysisReady={sboxResult !== null}
          />
        </section>

        {/* ── Analysis tabs (only after S-box is set) ──────────────────────────── */}
        {sboxResult && (
          <>
            <div className="border-t border-slate-100" />

            {/* Tab bar */}
            <div className="flex gap-1 border-b border-slate-100 pb-px -mb-2">
              {([
                { id: "analyze",      label: "S-box Tahlili",       col: "indigo" },
                { id: "linear",       label: "Chiziqli Tahlil",     col: "amber"  },
                { id: "differential", label: "Differentsial Tahlil", col: "rose"   },
              ] as const).map((t) => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 -mb-px
                    ${activeTab === t.id
                      ? `border-${t.col}-500 text-${t.col}-700 bg-${t.col}-50`
                      : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              {activeTab === "analyze" && (
                <AnalyzerTab result={sboxResult} />
              )}
              {activeTab === "linear" && (
                <LinearTab
                  sbox={sboxResult.sbox}
                  onResult={(r) => setLinearRecord(r)}
                />
              )}
              {activeTab === "differential" && (
                <DifferentialTab
                  sbox={sboxResult.sbox}
                  onResult={(r) => setDiffRecord(r)}
                />
              )}
            </div>
          </>
        )}

        {/* ── PDF footer ───────────────────────────────────────────────────────── */}
        {analyzeRecord && (
          <>
            <div className="border-t border-slate-100" />

            {/* Section badges */}
            {anyResult && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400">Tayyor bo&apos;limlar:</span>
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  S-box tahlili
                </span>
                {linearRecord && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Chiziqli tahlil
                  </span>
                )}
                {diffRecord && (
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Differentsial tahlil
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-slate-400">
                S-box tahlil qilingan. Natijalarni PDF ga eksport qiling.
              </p>
              <button
                onClick={handlePDF}
                disabled={isPdfLoading}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl
                  border transition-all
                  ${isPdfLoading
                    ? "text-indigo-400 border-indigo-200 bg-indigo-50 cursor-not-allowed"
                    : "text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 active:scale-95"}`}
              >
                {isPdfLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Tayyorlanmoqda…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF yuklab olish
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
