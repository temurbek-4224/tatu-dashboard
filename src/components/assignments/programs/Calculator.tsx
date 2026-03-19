"use client";

import { useState } from "react";

interface Result {
  op: string;
  result: number | string;
}

export default function Calculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);

  const calculate = () => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    if (isNaN(a) || isNaN(b)) return;

    setResults([
      { op: "Yig'indi  (+)", result: a + b },
      { op: "Ayirma   (−)", result: a - b },
      { op: "Ko'paytma (×)", result: a * b },
      {
        op: "Bo'linma  (÷)",
        result: b !== 0 ? parseFloat((a / b).toFixed(6)) : "Nolga bo'lib bo'lmaydi",
      },
    ]);
  };

  const clear = () => {
    setNum1("");
    setNum2("");
    setResults(null);
  };

  return (
    <div className="space-y-4 max-w-sm">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "1-son", value: num1, setter: setNum1 },
          { label: "2-son", value: num2, setter: setNum2 },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-sm
                bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                outline-none transition-all"
            />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={calculate}
          disabled={!num1 || !num2}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200
            text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          Hisoblash
        </button>
        <button
          onClick={clear}
          className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium
            py-2 rounded-lg text-sm transition-colors"
        >
          Tozalash
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {results.map(({ op, result }) => (
            <div key={op} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <p className="text-xs text-slate-400 font-mono mb-1">{op}</p>
              <p className={`font-bold ${typeof result === "string" ? "text-red-500 text-xs" : "text-slate-900 text-lg"}`}>
                {result}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
