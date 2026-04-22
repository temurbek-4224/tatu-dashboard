"use client";

import { useState, useCallback } from "react";
import {
  spnTrace, diffSpnTrace, runKeyRecovery, keySchedule, toBin4, toHex1,
  SPN_SBOX, SPN_PBOX, ATTACK_DX, ATTACK_DU,
  type SpnTrace, type DiffSpnTrace, type KeyRecoveryResult,
} from "@/lib/spn";
import { generateSpnPDF } from "@/lib/spnPdfExport";

type ActiveTab = "simulator" | "differential" | "recovery";

// ── Tiny helpers ───────────────────────────────────────────────────────────────

function BinBadge({ val, color = "slate" }: { val: number; color?: string }) {
  const cls: Record<string, string> = {
    slate:   "bg-slate-800 text-slate-200",
    sky:     "bg-sky-900 text-sky-200",
    amber:   "bg-amber-900 text-amber-200",
    rose:    "bg-rose-900 text-rose-200",
    emerald: "bg-emerald-900 text-emerald-200",
    violet:  "bg-violet-900 text-violet-200",
    indigo:  "bg-indigo-900 text-indigo-200",
  };
  return (
    <span className={`inline-flex items-center font-mono text-xs font-bold px-2 py-0.5 rounded-lg ${cls[color] ?? cls.slate}`}>
      {toHex1(val)}<span className="text-[10px] font-normal opacity-60 ml-1">({toBin4(val)})</span>
    </span>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center">
      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}

function StepBox({
  op, before, after, keyVal, colorBefore = "slate", colorAfter = "sky",
}: {
  op: string; before: number; after: number; keyVal?: number;
  colorBefore?: string; colorAfter?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-28 flex-shrink-0">{op}</span>
        <div className="flex items-center gap-2 flex-wrap">
          <BinBadge val={before} color={colorBefore} />
          {keyVal !== undefined && (
            <>
              <span className="text-slate-400 text-xs">⊕</span>
              <BinBadge val={keyVal} color="amber" />
            </>
          )}
          <span className="text-slate-400">→</span>
          <BinBadge val={after} color={colorAfter} />
        </div>
      </div>
    </div>
  );
}

function NumInput({
  label, val, set, color = "indigo",
}: {
  label: string; val: string; set: (v: string) => void; color?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className={`text-xs font-semibold text-${color}-600`}>{label}</label>
      <input
        type="number" min={0} max={15} value={val}
        onChange={(e) => set(e.target.value)}
        className={`w-full text-center text-lg font-mono font-bold py-2 rounded-xl border
          border-${color}-200 bg-${color}-50 text-${color}-800
          focus:outline-none focus:ring-2 focus:ring-${color}-400 focus:border-transparent`}
      />
      <p className={`text-[10px] font-mono text-${color}-400 text-center`}>
        {!isNaN(parseInt(val)) ? toBin4(parseInt(val)) : "????"}
      </p>
    </div>
  );
}

// ── Simulator Tab ──────────────────────────────────────────────────────────────
function SimulatorTab({ onResult }: { onResult?: (t: SpnTrace) => void }) {
  const [ptIn, setPtIn] = useState("6");
  const [kIn,  setKIn]  = useState("5");
  const [trace, setTrace] = useState<SpnTrace | null>(null);
  const [err,   setErr]   = useState("");

  const run = () => {
    const pt = parseInt(ptIn), k = parseInt(kIn);
    if (isNaN(pt) || pt < 0 || pt > 15) { setErr("Ochiq matn 0–15 oralig'ida bo'lishi kerak."); return; }
    if (isNaN(k)  || k  < 0 || k  > 15) { setErr("Kalit 0–15 oralig'ida bo'lishi kerak."); return; }
    setErr("");
    const t = spnTrace(pt, k);
    setTrace(t);
    onResult?.(t);
  };

  return (
    <div className="space-y-5">
      <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-xs text-sky-800">
        <strong>Maqsad:</strong> 2-raundli SPN shifri qadam-baqadam ko&apos;rsatiladi.
        Har bir bosqichda S-box almashish va P-box tarqatish amallari vizuallashtiriladi.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumInput label="Ochiq matn P (0–15)" val={ptIn} set={setPtIn} color="sky" />
        <NumInput label="Master kalit K (0–15)" val={kIn}  set={setKIn}  color="amber" />
      </div>

      {err && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{err}</p>}

      <button onClick={run}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          bg-sky-600 text-white hover:bg-sky-700 active:scale-[0.98] transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Simulatsiya qilish
      </button>

      {trace && (
        <div className="space-y-3">
          <div className="border-t border-slate-100" />

          {/* Key schedule */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-2">Kalit jadvali</p>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { k: "K1 = K", v: trace.k1 },
                { k: "K2 = rotL(K,1)", v: trace.k2 },
                { k: "K3 = ~K", v: trace.k3 },
              ].map(({ k, v }) => (
                <div key={k} className="text-center">
                  <div className="text-[9px] text-amber-500 mb-0.5">{k}</div>
                  <BinBadge val={v} color="amber" />
                </div>
              ))}
            </div>
          </div>

          {/* Start */}
          <div className="text-center">
            <span className="text-xs font-semibold text-slate-500">Kirish</span>
            <div className="mt-1"><BinBadge val={trace.plaintext} color="slate" /></div>
          </div>

          {/* Round 1 */}
          <div className="rounded-xl border border-sky-100 overflow-hidden">
            <div className="bg-sky-50 px-3 py-1.5 border-b border-sky-100">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Raund 1</span>
            </div>
            <div className="p-3 space-y-1.5">
              <Arrow />
              <StepBox op="AddKey (K1)" before={trace.plaintext} after={trace.r1_in} keyVal={trace.k1} colorBefore="slate" colorAfter="sky" />
              <Arrow />
              <StepBox op="SubBytes (S-box)" before={trace.r1_in} after={trace.r1_sbox} colorBefore="sky" colorAfter="violet" />
              <Arrow />
              <StepBox op="Permute (P-box)" before={trace.r1_sbox} after={trace.r1_pbox} colorBefore="violet" colorAfter="emerald" />
            </div>
          </div>

          {/* Round 2 */}
          <div className="rounded-xl border border-rose-100 overflow-hidden">
            <div className="bg-rose-50 px-3 py-1.5 border-b border-rose-100">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Raund 2</span>
            </div>
            <div className="p-3 space-y-1.5">
              <Arrow />
              <StepBox op="AddKey (K2)" before={trace.r1_pbox} after={trace.r2_in} keyVal={trace.k2} colorBefore="emerald" colorAfter="sky" />
              <Arrow />
              <StepBox op="SubBytes (S-box)" before={trace.r2_in} after={trace.r2_sbox} colorBefore="sky" colorAfter="violet" />
            </div>
          </div>

          {/* Final whitening */}
          <Arrow />
          <StepBox op="Yakuniy AddKey (K3)" before={trace.r2_sbox} after={trace.ciphertext} keyVal={trace.k3} colorBefore="violet" colorAfter="rose" />

          <div className="text-center">
            <span className="text-xs font-semibold text-slate-500">Shifrmatn</span>
            <div className="mt-1"><BinBadge val={trace.ciphertext} color="rose" /></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Differential Tab ───────────────────────────────────────────────────────────
function DifferentialTab({ onResult }: { onResult?: (d: DiffSpnTrace) => void }) {
  const [xIn,  setXIn]  = useState("3");
  const [xpIn, setXpIn] = useState("5");
  const [kIn,  setKIn]  = useState("5");
  const [res, setRes]   = useState<DiffSpnTrace | null>(null);
  const [err, setErr]   = useState("");

  const run = () => {
    const x = parseInt(xIn), xp = parseInt(xpIn), k = parseInt(kIn);
    if ([x, xp, k].some((v) => isNaN(v) || v < 0 || v > 15)) {
      setErr("Barcha qiymatlar 0–15 oralig'ida bo'lishi kerak."); return;
    }
    setErr("");
    const d = diffSpnTrace(x, xp, k);
    setRes(d);
    onResult?.(d);
  };

  return (
    <div className="space-y-5">
      <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-xs text-rose-800">
        <strong>Maqsad:</strong> Ikki kiritish (X, X&apos;) ni SPN orqali o&apos;tkazib, farqlarning
        har bosqichda qanday tarqalishini ko&apos;rsatish. Kalit aralashishi (AddKey) farqga ta&apos;sir qilmaydi.
      </div>

      <div className="grid grid-cols-3 gap-3">
        <NumInput label="X (0–15)"   val={xIn}  set={setXIn}  color="sky" />
        <NumInput label="X' (0–15)"  val={xpIn} set={setXpIn} color="emerald" />
        <NumInput label="Kalit K"    val={kIn}  set={setKIn}  color="amber" />
      </div>

      {err && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{err}</p>}

      <button onClick={run}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Differentsial tarqalishni ko&apos;rsatish
      </button>

      {res && (
        <div className="space-y-3">
          <div className="border-t border-slate-100" />
          <div className="bg-slate-900 rounded-xl px-4 py-4 font-mono text-xs space-y-2">
            <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">Differentsial zanjir</div>
            {[
              { label: "Kiritish farqi  ΔX",              val: res.dx,        color: "amber" },
              { label: "Raund 1 S-box → ΔY1",            val: res.dy_r1_sbox, color: "violet" },
              { label: "Raund 1 P-box → ΔU (R2 kirish)", val: res.dy_r1_pbox, color: "sky" },
              { label: "Raund 2 S-box → ΔY2",            val: res.dy_r2_sbox, color: "rose" },
              { label: "Shifrmatn farqi  ΔC",             val: res.dy_cipher,  color: "rose" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="text-slate-500 text-[11px]">{label}</span>
                <BinBadge val={val} color={color} />
              </div>
            ))}
          </div>

          {/* Individual traces */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {[
              { title: "X = " + toHex1(res.x), t: res.traceX, col: "sky" },
              { title: "X'= " + toHex1(res.xPrime), t: res.traceXPrime, col: "emerald" },
            ].map(({ title, t, col }) => (
              <div key={title} className={`rounded-xl border border-${col}-100 bg-${col}-50 p-3 font-mono space-y-1`}>
                <div className={`text-[10px] font-bold text-${col}-600 mb-1`}>{title}</div>
                {[
                  { s: "R1 in",  v: t.r1_in },
                  { s: "R1 sub", v: t.r1_sbox },
                  { s: "R1 perm",v: t.r1_pbox },
                  { s: "R2 in",  v: t.r2_in },
                  { s: "R2 sub", v: t.r2_sbox },
                  { s: "Cipher", v: t.ciphertext },
                ].map(({ s, v }) => (
                  <div key={s} className="flex justify-between gap-1">
                    <span className={`text-${col}-400`}>{s}</span>
                    <span className={`text-${col}-800 font-bold`}>{toHex1(v)} ({toBin4(v)})</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={`rounded-xl border px-4 py-3 text-xs leading-relaxed
            ${res.dy_r1_pbox === ATTACK_DU
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-slate-50 border-slate-100 text-slate-600"}`}>
            {res.dy_r1_pbox === ATTACK_DU
              ? <><strong>Differentsial xarakteristika ushlanadi:</strong> ΔU = {ATTACK_DU} (0111) — bu hujum uchun optimal farq. Kalit tiklovchi demoda ishlating.</>
              : <>ΔU = {res.dy_r1_pbox} — bu juft uchun differentsial zanjir. Optimal farq (ΔX={ATTACK_DX}) ni sinab ko&apos;ring.</>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Key Recovery Tab ───────────────────────────────────────────────────────────
function KeyRecoveryTab({ onResult }: { onResult?: (r: KeyRecoveryResult) => void }) {
  const [kIn,      setKIn]      = useState("5");
  const [numPairs, setNumPairs] = useState(8);
  const [result, setResult]     = useState<KeyRecoveryResult | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [err, setErr]           = useState("");

  const run = () => {
    const k = parseInt(kIn);
    if (isNaN(k) || k < 0 || k > 15) { setErr("Kalit 0–15 oralig'ida bo'lishi kerak."); return; }
    setErr("");
    setRevealed(false);
    const r = runKeyRecovery(k, numPairs);
    setResult(r);
    onResult?.(r);
  };

  const maxCount = result ? Math.max(...result.candidates.map((c) => c.count), 1) : 1;

  return (
    <div className="space-y-5">
      <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 text-xs text-violet-800">
        <strong>Maqsad:</strong> Differentsial hujum orqali oxirgi raund kaliti K3 tiklanadi.
        ΔX = {ATTACK_DX} ({toBin4(ATTACK_DX)}) bo&apos;lgan juftlar yig&apos;iladi va K3 ning har
        16 ta varianti sinab ko&apos;riladi.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumInput label="Haqiqiy master kalit K" val={kIn} set={setKIn} color="violet" />
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500">Juftlar soni: <strong>{numPairs}</strong></label>
          <input type="range" min={4} max={16} step={2} value={numPairs}
            onChange={(e) => setNumPairs(parseInt(e.target.value))}
            className="w-full accent-violet-600 h-2 rounded-full" />
          <p className="text-[10px] text-slate-400">4 ta dan 16 ta gacha. Ko&apos;proq juft = aniqroq natija.</p>
        </div>
      </div>

      {err && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{err}</p>}

      <button onClick={run}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Hujumni boshlash
      </button>

      {result && (
        <div className="space-y-4">
          <div className="border-t border-slate-100" />

          {/* Pairs table */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Yig&apos;ilgan juftlar (ΔX = {ATTACK_DX} = {toBin4(ATTACK_DX)}):
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="border-collapse text-xs font-mono w-full">
                <thead>
                  <tr className="bg-slate-50">
                    {["#", "P", "P'", "C", "C'", "ΔC"].map((h) => (
                      <th key={h} className="px-3 py-2 text-slate-500 font-semibold border-b border-slate-200 text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.pairs.map(({ p, pPrime, c, cPrime }, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 text-center text-slate-400 border-b border-slate-100">{i + 1}</td>
                      <td className="px-3 py-1.5 text-center text-sky-700 font-bold border-b border-slate-100">{toBin4(p)}</td>
                      <td className="px-3 py-1.5 text-center text-emerald-700 font-bold border-b border-slate-100">{toBin4(pPrime)}</td>
                      <td className="px-3 py-1.5 text-center text-slate-700 border-b border-slate-100">{toBin4(c)}</td>
                      <td className="px-3 py-1.5 text-center text-slate-700 border-b border-slate-100">{toBin4(cPrime)}</td>
                      <td className="px-3 py-1.5 text-center text-rose-600 font-bold border-b border-slate-100">{toBin4(c ^ cPrime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Candidate scores */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">
              K3 variantlari (maqsad ΔU = {ATTACK_DU} = {toBin4(ATTACK_DU)}):
            </p>
            <div className="space-y-1.5">
              {result.candidates.map(({ key, count, isCorrect }) => (
                <div key={key}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 border transition-all
                    ${revealed && isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"}`}>
                  <span className="font-mono text-xs font-bold text-slate-600 w-24 flex-shrink-0">
                    K3={toHex1(key)} ({toBin4(key)})
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        revealed && isCorrect ? "bg-emerald-500" : count === maxCount ? "bg-violet-500" : "bg-slate-400"
                      }`}
                      style={{ width: `${Math.max((count / maxCount) * 100, 2)}%` }}
                    />
                  </div>
                  <span className={`font-mono text-xs font-bold w-16 text-right flex-shrink-0
                    ${revealed && isCorrect ? "text-emerald-700" : count === maxCount ? "text-violet-700" : "text-slate-500"}`}>
                    {count}/{result.numPairs}
                  </span>
                  {revealed && isCorrect && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                      To&apos;g&apos;ri!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reveal button */}
          {!revealed ? (
            <button onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm
                border-2 border-dashed border-violet-300 text-violet-600 hover:bg-violet-50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              To&apos;g&apos;ri kalitni ko&apos;rsatish
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800">
              <strong>Tiklab olingan K3 = {toHex1(result.trueK3)} ({toBin4(result.trueK3)})</strong>
              <span className="text-emerald-600 text-xs ml-2">— haqiqiy kalit bilan mos!</span>
              <p className="text-xs mt-1 text-emerald-700">
                Master kalit K = {toHex1(result.masterKey)} ({toBin4(result.masterKey)}) dan
                K3 = ~K = {toHex1(result.trueK3)} ({toBin4(result.trueK3)}) hosil qilingan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────────────
export default function SpnPanel() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("simulator");
  const [simRecord,  setSimRecord]  = useState<SpnTrace         | null>(null);
  const [diffRecord, setDiffRecord] = useState<DiffSpnTrace     | null>(null);
  const [recRecord,  setRecRecord]  = useState<KeyRecoveryResult | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const anyResult = simRecord !== null || diffRecord !== null || recRecord !== null;

  const handlePDF = useCallback(async () => {
    setPdfLoading(true);
    try {
      await generateSpnPDF({ simTrace: simRecord ?? undefined, diffTrace: diffRecord ?? undefined, keyRecovery: recRecord ?? undefined });
    } finally { setPdfLoading(false); }
  }, [simRecord, diffRecord, recRecord]);

  const tabs: { id: ActiveTab; label: string; col: string }[] = [
    { id: "simulator",    label: "SPN Simulatori",    col: "sky"    },
    { id: "differential", label: "Differentsial",     col: "rose"   },
    { id: "recovery",     label: "Kalit Tiklovchi",   col: "violet" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">SP Tarmog&apos;i Laboratoriya Vositasi</h3>
          <p className="text-xs text-slate-400 mt-0.5">SPN simulatori · Differentsial tahlil · Kalit tiklovchi hujum</p>
        </div>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold border border-indigo-200">Interaktiv</span>
      </div>

      <div className="p-6 space-y-6">
        {/* SPN Config info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">SPN konfiguratsiyasi</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div><span className="text-slate-400">Blok:</span> <span className="font-bold text-slate-700">4 bit</span></div>
            <div><span className="text-slate-400">Raundlar:</span> <span className="font-bold text-slate-700">2</span></div>
            <div><span className="text-slate-400">S-box:</span> <span className="font-bold text-slate-700">PRESENT</span></div>
            <div><span className="text-slate-400">P-box:</span> <span className="font-bold text-slate-700">[2,0,3,1]</span></div>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-400">
            S-box: [{SPN_SBOX.map(toHex1).join(" ")}] &nbsp;|&nbsp; P-box: [{SPN_PBOX.join(",")}]
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-100 pb-px">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 -mb-px
                ${activeTab === t.id
                  ? `border-${t.col}-500 text-${t.col}-700 bg-${t.col}-50`
                  : "border-transparent text-slate-400 hover:text-slate-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "simulator"    && <SimulatorTab    onResult={(t) => setSimRecord(t)}  />}
          {activeTab === "differential" && <DifferentialTab onResult={(d) => setDiffRecord(d)} />}
          {activeTab === "recovery"     && <KeyRecoveryTab  onResult={(r) => setRecRecord(r)}  />}
        </div>

        {/* PDF footer */}
        {anyResult && (
          <>
            <div className="border-t border-slate-100" />
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400">Tayyor bo&apos;limlar:</span>
              {simRecord  && <span className="inline-flex items-center gap-1 bg-sky-50    text-sky-600    border border-sky-100    px-2 py-0.5 rounded-full font-medium"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Simulatsiya</span>}
              {diffRecord && <span className="inline-flex items-center gap-1 bg-rose-50   text-rose-600   border border-rose-100   px-2 py-0.5 rounded-full font-medium"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Differentsial</span>}
              {recRecord  && <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full font-medium"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Kalit tiklovchi</span>}
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-slate-400">Natijalar PDF hisobotga kiritiladi.</p>
              <button onClick={handlePDF} disabled={pdfLoading}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl border transition-all
                  ${pdfLoading ? "text-indigo-400 border-indigo-200 bg-indigo-50 cursor-not-allowed"
                    : "text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 active:scale-95"}`}>
                {pdfLoading ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Tayyorlanmoqda…</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>PDF yuklab olish</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
