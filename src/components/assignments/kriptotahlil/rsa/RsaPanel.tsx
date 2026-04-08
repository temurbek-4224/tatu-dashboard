"use client";

import { useState, useCallback } from "react";
import {
  rsaKeygen, rsaEncrypt, rsaDecrypt,
  repeatedEncryptionAttack, signatureAttack, chosenCiphertextAttack,
  type RsaKeyResult,
} from "@/lib/rsa";
import { generateRsaLabPDF, type RsaPDFOptions } from "@/lib/rsaPdfExport";

// ── Types ──────────────────────────────────────────────────────────────────────
type Mode       = "encrypt" | "decrypt" | "analyze";
type AttackTab  = "repeated" | "signature" | "chosen";

// ── Small UI helpers ───────────────────────────────────────────────────────────
function StepRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex items-baseline gap-2 font-mono text-sm py-0.5
      ${accent ? "text-sky-400" : "text-slate-400"}`}>
      <span className="text-slate-600 text-xs whitespace-nowrap">{label}</span>
      <span className={`ml-auto font-bold ${accent ? "text-sky-300" : "text-green-400"}`}>{value}</span>
    </div>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-950 rounded-xl px-4 py-3 font-mono text-xs leading-relaxed">
      {children}
    </div>
  );
}

function SectionBadge({ children, color = "sky" }: { children: React.ReactNode; color?: string }) {
  const cls: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-700 border-sky-200",
    amber:  "bg-amber-100 text-amber-700 border-amber-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    rose:   "bg-rose-100 text-rose-700 border-rose-200",
    emerald:"bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cls[color] ?? cls.sky}`}>
      {children}
    </span>
  );
}

// ── Number input helper ────────────────────────────────────────────────────────
function NumInput({
  label, value, onChange, placeholder, hint, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; error?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm font-mono text-slate-800
          placeholder-slate-300 bg-white outline-none transition-all
          focus:ring-2 focus:ring-sky-200 focus:border-sky-300
          ${error ? "border-rose-300 bg-rose-50/50" : "border-slate-200 hover:border-slate-300"}`}
      />
      {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ── Attack tabs ─────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

function RepeatedEncryptionTab({ rsaKey, C }: { rsaKey: RsaKeyResult; C: number }) {
  const [cipherInput, setCipherInput] = useState(String(C > 0 ? C : ""));
  const [result, setResult]           = useState<ReturnType<typeof repeatedEncryptionAttack> | null>(null);

  const run = () => {
    const cv = parseInt(cipherInput, 10);
    if (isNaN(cv) || cv < 0 || cv >= rsaKey.n) return;
    setResult(repeatedEncryptionAttack(cv, rsaKey.e, rsaKey.n));
  };

  const displaySteps = result ? result.steps.slice(0, 30) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Takroriy shifrlash:</strong> C₀ = C, Cⱼ = C_{"{j-1}"}^e mod n.
          Cⱼ = C bo&apos;lganda sikl tugaydi — <strong>M = C_{"{j-1}"}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumInput
          label="Shifrmatn C"
          value={cipherInput}
          onChange={setCipherInput}
          placeholder="0 dan n-1 gacha"
          hint={`0 ≤ C < n = ${rsaKey.n}`}
          error={cipherInput !== "" && (isNaN(parseInt(cipherInput)) || parseInt(cipherInput) < 0 || parseInt(cipherInput) >= rsaKey.n)}
        />
        <div className="flex items-end pb-0.5">
          <button
            onClick={run}
            disabled={cipherInput.trim() === "" || isNaN(parseInt(cipherInput))}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold
              px-4 py-2.5 rounded-xl transition-all active:scale-95
              ${cipherInput.trim() === "" || isNaN(parseInt(cipherInput))
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hujumni boshlash
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-3 animate-result-in">
          {result.found ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-emerald-100">
                <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">✓</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Ochiq matn topildi!</p>
                  <p className="text-xs text-emerald-600">Sikl uzunligi: j = {result.cycleLength}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-emerald-600 font-mono">M = C_{"{j-1}"}</p>
                  <p className="text-2xl font-bold font-mono text-emerald-700">{result.M}</p>
                </div>
              </div>
              <div className="px-4 py-2.5 bg-emerald-50">
                <p className="text-xs text-emerald-700">
                  Tekshirish: rsaEncrypt({result.M}, {rsaKey.e}, {rsaKey.n}) = {rsaEncrypt(result.M!, rsaKey.e, rsaKey.n)}
                  {rsaEncrypt(result.M!, rsaKey.e, rsaKey.n) === parseInt(cipherInput) ? " ✓ to'g'ri" : " ✗ xato"}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-rose-800">Sikl {300} qadamda topilmadi</p>
              <p className="text-xs text-rose-600 mt-1">Kalit uzunligi yoki e qiymati juda katta. Kichikroq p, q qiymatlarini sinab ko&apos;ring.</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500">Qadamlar (dastlabki 30 ta)</p>
              <span className="ml-auto text-[10px] text-slate-400 font-mono">{result.steps.length} qadam</span>
            </div>
            <div className="max-h-52 overflow-y-auto">
              <FormulaBox>
                {displaySteps.map((s) => (
                  <div key={s.j}
                    className={`flex items-center gap-2 py-0.5 px-1 rounded
                      ${s.isStart ? "bg-sky-900/40 text-sky-300" : s.j === (result.found && result.cycleLength ? result.cycleLength - 1 : -1) ? "bg-green-900/40 text-green-300" : ""}`}>
                    <span className="text-slate-600 text-[10px] w-10 flex-shrink-0">j={s.j}</span>
                    <span className="text-slate-500">C{s.j} =</span>
                    <span className={`font-mono font-bold ml-auto ${s.isStart ? "text-sky-300" : "text-green-400"}`}>{s.value}</span>
                    {s.isStart && s.j > 0 && <span className="text-[9px] text-sky-400 ml-1">← sikl</span>}
                    {result.found && s.j === result.cycleLength! - 1 && <span className="text-[9px] text-green-300 ml-1">← M</span>}
                  </div>
                ))}
              </FormulaBox>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SignatureAttackTab({ rsaKey }: { rsaKey: RsaKeyResult }) {
  const [mInput, setMInput] = useState("");
  const [rInput, setRInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof signatureAttack> | null>(null);
  const [error,  setError]  = useState("");

  const run = () => {
    setError(""); setResult(null);
    const M = parseInt(mInput, 10);
    const r = parseInt(rInput, 10);
    if (isNaN(M) || M <= 0 || M >= rsaKey.n) { setError(`M qiymati: 0 < M < n = ${rsaKey.n}`); return; }
    if (isNaN(r) || r <= 1 || r >= rsaKey.n) { setError(`r qiymati: 1 < r < n = ${rsaKey.n}`); return; }
    const res = signatureAttack(M, r, rsaKey.e, rsaKey.n, rsaKey.d);
    if (!res.valid) { setError(res.error ?? "Xato"); return; }
    setResult(res);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-xs text-violet-800 leading-relaxed">
          <strong>Notarius hujumi:</strong> Hujumchi notariusdan M xabarga imzo olishni xohlaydi.
          Tasodifiy r tanlab, y = r^e·M ni imzolattiradi va S·r⁻¹ orqali M^d ni ajratadi.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Xabar M" value={mInput} onChange={(v) => { setMInput(v); setResult(null); setError(""); }}
          placeholder="e.g. 42" hint={`0 < M < n = ${rsaKey.n}`} />
        <NumInput label="Tasodifiy r" value={rInput} onChange={(v) => { setRInput(v); setResult(null); setError(""); }}
          placeholder="e.g. 13" hint={`1 < r < n = ${rsaKey.n}, EKUB(r,n)=1`} />
      </div>

      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      <button
        onClick={run}
        disabled={!mInput.trim() || !rInput.trim()}
        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95
          ${!mInput.trim() || !rInput.trim()
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-violet-500 hover:bg-violet-600 text-white shadow-sm shadow-violet-200"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Imzo hujumini bajarish
      </button>

      {result && result.valid && (
        <div className="space-y-3 animate-result-in">
          <FormulaBox>
            <StepRow label="1.  r ="           value={String(result.r)} />
            <StepRow label="2.  r^e mod n ="   value={`${modPowDisplay(result.r, rsaKey.e, rsaKey.n)}`} />
            <StepRow label="3.  y = r^e·M mod n =" value={String(result.y)} />
            <div className="border-t border-slate-800 my-1.5" />
            <StepRow label="4.  Notarius imzolaydi: S_y = y^d mod n =" value={String(result.S_y)} />
            <div className="border-t border-slate-800 my-1.5" />
            <StepRow label="5.  r⁻¹ mod n ="  value={String(result.rInv)} />
            <StepRow label="6.  M^d = S_y · r⁻¹ mod n =" value={String(result.sig)} accent />
          </FormulaBox>
          <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-violet-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold text-violet-900">Imzo muvaffaqiyatli olindi</p>
              <p className="text-xs text-violet-600 font-mono">M^d mod n = {result.sig}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChosenCiphertextTab({ rsaKey, lastCipher }: { rsaKey: RsaKeyResult; lastCipher: number }) {
  const [cInput, setCInput] = useState(lastCipher > 0 ? String(lastCipher) : "");
  const [rInput, setRInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof chosenCiphertextAttack> | null>(null);
  const [error,  setError]  = useState("");

  const run = () => {
    setError(""); setResult(null);
    const cv = parseInt(cInput, 10);
    const r  = parseInt(rInput, 10);
    if (isNaN(cv) || cv < 0 || cv >= rsaKey.n) { setError(`C qiymati: 0 ≤ C < n = ${rsaKey.n}`); return; }
    if (isNaN(r)  || r  <= 1 || r  >= rsaKey.n) { setError(`r qiymati: 1 < r < n = ${rsaKey.n}`); return; }
    const res = chosenCiphertextAttack(cv, r, rsaKey.e, rsaKey.n, rsaKey.d);
    if (!res.valid) { setError(res.error ?? "Xato"); return; }
    setResult(res);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
        <p className="text-xs text-emerald-800 leading-relaxed">
          <strong>Tanlangan shifrmatn:</strong> Hujumchi C = M^e dan M ni topish uchun
          C&apos; = r^e·C ni orakulga beradi, M&apos; = C&apos;^d oladi va M = M&apos;·r⁻¹ hisoblaydi.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Shifrmatn C" value={cInput} onChange={(v) => { setCInput(v); setResult(null); setError(""); }}
          placeholder="e.g. 37" hint={`0 ≤ C < n = ${rsaKey.n}`} />
        <NumInput label="Tasodifiy r" value={rInput} onChange={(v) => { setRInput(v); setResult(null); setError(""); }}
          placeholder="e.g. 7" hint={`1 < r < n = ${rsaKey.n}`} />
      </div>

      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      <button
        onClick={run}
        disabled={!cInput.trim() || !rInput.trim()}
        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95
          ${!cInput.trim() || !rInput.trim()
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Hujumni bajarish
      </button>

      {result && result.valid && (
        <div className="space-y-3 animate-result-in">
          <FormulaBox>
            <StepRow label="1.  r ="              value={String(result.r)} />
            <StepRow label="2.  x = r^e mod n ="  value={String(result.x)} />
            <StepRow label="3.  C' = x·C mod n =" value={String(result.Cprime)} />
            <div className="border-t border-slate-800 my-1.5" />
            <StepRow label="4.  Orakul: M' = C'^d mod n =" value={String(result.Mprime)} />
            <div className="border-t border-slate-800 my-1.5" />
            <StepRow label="5.  r⁻¹ mod n ="     value={String(result.rInv)} />
            <StepRow label="6.  M = M'·r⁻¹ mod n =" value={String(result.M)} accent />
          </FormulaBox>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-900">Ochiq matn tiklandi</p>
              <p className="text-xs text-emerald-600 font-mono">M = {result.M}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Small helper just for the display step (doesn't need export from rsa.ts) */
function modPowDisplay(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  let result = 1; base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = Number(BigInt(result) * BigInt(base) % BigInt(mod));
    exp = Math.floor(exp / 2);
    base = Number(BigInt(base) * BigInt(base) % BigInt(mod));
  }
  return result;
}

// ════════════════════════════════════════════════════════════════════════════
// ── Main RsaPanel ────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

export default function RsaPanel() {
  // Key inputs
  const [pInput, setPInput] = useState("61");
  const [qInput, setQInput] = useState("53");
  const [eInput, setEInput] = useState("17");
  const [keyResult, setKeyResult] = useState<RsaKeyResult | null>(null);
  const [keyError, setKeyError]   = useState("");

  // Encrypt/Decrypt
  const [mode, setMode]               = useState<Mode>("encrypt");
  const [attackTab, setAttackTab]     = useState<AttackTab>("repeated");
  const [msgInput, setMsgInput]       = useState("");
  const [opResult, setOpResult]       = useState<number | null>(null);
  const [opError, setOpError]         = useState("");

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // Generate key
  const handleKeygen = () => {
    setKeyError(""); setOpResult(null); setOpError("");
    const p = parseInt(pInput, 10);
    const q = parseInt(qInput, 10);
    const e = parseInt(eInput, 10);
    if (isNaN(p) || isNaN(q) || isNaN(e)) { setKeyError("p, q, e sonlarni to'g'ri kiriting."); return; }
    const res = rsaKeygen(p, q, e);
    if (!res.valid) { setKeyError(res.error); setKeyResult(null); return; }
    setKeyResult(res);
  };

  // Encrypt / Decrypt operation
  const handleOperation = () => {
    setOpError(""); setOpResult(null);
    if (!keyResult) return;
    const v = parseInt(msgInput, 10);
    if (isNaN(v) || v < 0) { setOpError("Musbat butun son kiriting."); return; }
    if (mode === "encrypt" && v >= keyResult.n) {
      setOpError(`M < n = ${keyResult.n} bo'lishi kerak.`); return;
    }
    if (mode === "decrypt" && v >= keyResult.n) {
      setOpError(`C < n = ${keyResult.n} bo'lishi kerak.`); return;
    }
    const res = mode === "encrypt"
      ? rsaEncrypt(v, keyResult.e, keyResult.n)
      : rsaDecrypt(v, keyResult.d, keyResult.n);
    setOpResult(res);
  };

  // Switch mode — reset operation result
  const switchMode = (m: Mode) => {
    setMode(m);
    setOpResult(null);
    setOpError("");
    setMsgInput("");
  };

  // PDF export
  const handlePDF = useCallback(async () => {
    if (!keyResult) return;
    setIsPdfLoading(true);
    try {
      const opts: RsaPDFOptions = {
        p: keyResult.p, q: keyResult.q, e: keyResult.e,
        n: keyResult.n, phi: keyResult.phi, d: keyResult.d,
        mode: mode === "analyze" ? "encrypt" : mode,
        inputValue: parseInt(msgInput) || 0,
        outputValue: opResult ?? 0,
        attackType: mode === "analyze" ? attackTab : null,
        attackSummary: mode === "analyze"
          ? `Hujum turi: ${attackTab} | n=${keyResult.n}, e=${keyResult.e}`
          : undefined,
      };
      await generateRsaLabPDF(opts);
    } finally {
      setIsPdfLoading(false);
    }
  }, [keyResult, pInput, qInput, eInput, mode, msgInput, opResult, attackTab]);

  const inputLabel  = mode === "decrypt" ? "Shifrmatn C" : "Ochiq matn M";
  const outputLabel = mode === "decrypt" ? "Ochiq matn M" : "Shifrmatn C";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      {/* ── Panel header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">RSA Laboratoriya Vositasi</p>
          <p className="text-xs text-slate-500">Kalit generatsiya, shifrlash, deshifrlash va kriptoanaliz</p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap justify-end">
          <SectionBadge color="sky">Interaktiv</SectionBadge>
          <SectionBadge color="amber">p, q ≤ 500</SectionBadge>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* ── KEY GENERATION ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold items-center justify-center">1</span>
            Kalit generatsiya
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <NumInput label="p (tub son)" value={pInput}
              onChange={(v) => { setPInput(v); setKeyResult(null); setKeyError(""); }}
              placeholder="61" hint="Tub son" />
            <NumInput label="q (tub son)" value={qInput}
              onChange={(v) => { setQInput(v); setKeyResult(null); setKeyError(""); }}
              placeholder="53" hint="Tub son, p ≠ q" />
            <NumInput label="e (ochiq eksponent)" value={eInput}
              onChange={(v) => { setEInput(v); setKeyResult(null); setKeyError(""); }}
              placeholder="17" hint="EKUB(e, φ(n)) = 1" />
          </div>

          {keyError && (
            <p className="text-xs text-rose-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {keyError}
            </p>
          )}

          <button
            onClick={handleKeygen}
            disabled={!pInput.trim() || !qInput.trim() || !eInput.trim()}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl
              transition-all active:scale-95
              ${!pInput.trim() || !qInput.trim() || !eInput.trim()
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Kalitlarni hisoblash
          </button>

          {/* Key result card */}
          {keyResult && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-result-in">
              {[
                { label: "n = p·q", value: String(keyResult.n), col: "sky" },
                { label: "φ(n) = (p-1)(q-1)", value: String(keyResult.phi), col: "slate" },
                { label: "d = e⁻¹ mod φ(n)", value: String(keyResult.d), col: "amber" },
              ].map(({ label, value, col }) => (
                <div key={label} className={`rounded-xl border bg-${col}-50 border-${col}-100 px-4 py-3`}>
                  <p className={`text-[10px] font-semibold text-${col}-600 uppercase tracking-wider mb-1`}>{label}</p>
                  <p className={`text-lg font-bold font-mono text-${col}-800`}>{value}</p>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-3 rounded-xl border bg-indigo-50 border-indigo-100 px-4 py-2.5 flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">Ochiq kalit</p>
                  <code className="text-xs font-mono text-indigo-700">(e={keyResult.e}, n={keyResult.n})</code>
                </div>
                <div className="h-8 w-px bg-indigo-100" />
                <div>
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Shaxsiy kalit</p>
                  <code className="text-xs font-mono text-amber-700">(d={keyResult?.d}, n={keyResult?.n})</code>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── MODE TOGGLE ─────────────────────────────────────────────────── */}
        {keyResult && (
          <>
            <div className="border-t border-slate-100" />

            <section className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="inline-flex w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold items-center justify-center">2</span>
                Rejim
              </h3>

              <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
                {([
                  { id: "encrypt",  label: "Shifrlash",    color: "bg-indigo-600 text-white shadow-sm" },
                  { id: "decrypt",  label: "Deshifrlash",  color: "bg-sky-600 text-white shadow-sm" },
                  { id: "analyze",  label: "Kriptoanaliz", color: "bg-amber-500 text-white shadow-sm" },
                ] as const).map((m) => (
                  <button key={m.id} onClick={() => switchMode(m.id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all
                      ${mode === m.id ? m.color : "text-slate-500 hover:text-slate-700"}`}>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* ── Encrypt / Decrypt operation ─────────────────────────── */}
              {mode !== "analyze" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <NumInput
                      label={inputLabel}
                      value={msgInput}
                      onChange={(v) => { setMsgInput(v); setOpResult(null); setOpError(""); }}
                      placeholder={mode === "encrypt" ? `0 – ${keyResult.n - 1}` : "Shifrmatn"}
                      hint={mode === "encrypt" ? `M < n = ${keyResult.n}` : `C < n = ${keyResult.n}`}
                    />
                    <div className="flex items-end pb-0.5">
                      <button
                        onClick={handleOperation}
                        disabled={!msgInput.trim()}
                        className={`w-full flex items-center justify-center gap-2 text-sm font-semibold
                          px-4 py-2.5 rounded-xl transition-all active:scale-95
                          ${!msgInput.trim()
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : mode === "encrypt"
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                              : "bg-sky-600 hover:bg-sky-700 text-white shadow-sm"}`}
                      >
                        {mode === "encrypt" ? "Shifrlash" : "Deshifrlash"}
                      </button>
                    </div>
                  </div>

                  {opError && (
                    <p className="text-xs text-rose-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {opError}
                    </p>
                  )}

                  {opResult !== null && (
                    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden animate-result-in">
                      <div className="bg-slate-950 px-4 py-3 font-mono">
                        <p className="text-xs text-slate-500 mb-1">
                          <span className="text-slate-600">$</span>{" "}
                          {mode === "encrypt"
                            ? `rsa_encrypt(M=${msgInput}, e=${keyResult.e}, n=${keyResult.n})`
                            : `rsa_decrypt(C=${msgInput}, d=${keyResult.d}, n=${keyResult.n})`}
                        </p>
                        <p className="text-green-400 text-base font-bold break-all">
                          <span className="text-slate-500 mr-1">›</span>
                          {outputLabel} = <span className="text-green-300">{opResult}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 border-t border-indigo-100">
                        <span className="text-xs text-indigo-700 font-mono">
                          {mode === "encrypt"
                            ? `${msgInput}^${keyResult.e} mod ${keyResult.n} = ${opResult}`
                            : `${msgInput}^${keyResult.d} mod ${keyResult.n} = ${opResult}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Cryptoanalysis tabs ─────────────────────────────────── */}
              {mode === "analyze" && (
                <div className="space-y-4">
                  {/* Sub-tab bar */}
                  <div className="flex gap-1 border-b border-slate-100 pb-px">
                    {([
                      { id: "repeated",  label: "Takroriy shifrlash", col: "amber" },
                      { id: "signature", label: "Notarius hujumi",   col: "violet" },
                      { id: "chosen",    label: "Tanlangan shifrmatn", col: "emerald" },
                    ] as const).map((t) => (
                      <button key={t.id} onClick={() => setAttackTab(t.id)}
                        className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 -mb-px
                          ${attackTab === t.id
                            ? `border-${t.col}-500 text-${t.col}-700 bg-${t.col}-50`
                            : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    {attackTab === "repeated"  && <RepeatedEncryptionTab rsaKey={keyResult} C={opResult ?? 0} />}
                    {attackTab === "signature"  && <SignatureAttackTab rsaKey={keyResult} />}
                    {attackTab === "chosen"     && <ChosenCiphertextTab rsaKey={keyResult} lastCipher={opResult ?? 0} />}
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* ── PDF EXPORT ──────────────────────────────────────────────────── */}
        {keyResult && (
          <>
            <div className="border-t border-slate-100" />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-slate-400">
                {opResult !== null ? "Natijalar PDF ga kiritiladi." : "Shifrlash yoki deshifrlash bajaring, so'ng PDF yuklab oling."}
              </p>
              <button
                onClick={handlePDF}
                disabled={isPdfLoading}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl
                  border transition-all
                  ${isPdfLoading
                    ? "text-rose-400 border-rose-200 bg-rose-50 cursor-not-allowed"
                    : "text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 active:scale-95"}`}
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
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-2-2m2 2l2-2" />
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
