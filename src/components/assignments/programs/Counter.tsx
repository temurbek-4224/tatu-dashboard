"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount((c) => c + step);
  const decrement = () => setCount((c) => c - step);
  const reset = () => setCount(0);

  // Determine the color based on sign
  const valueColor =
    count > 0 ? "text-emerald-600" : count < 0 ? "text-red-500" : "text-slate-700";

  return (
    <div className="max-w-xs space-y-5">
      {/* Display */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl py-8 text-center">
        <p className={`text-6xl font-bold tabular-nums transition-colors ${valueColor}`}>
          {count}
        </p>
        <p className="text-xs text-slate-400 mt-2">joriy qiymat</p>
      </div>

      {/* Step control */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Qadam (step): <span className="text-indigo-600 font-bold">{step}</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={step}
          onChange={(e) => setStep(parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-0.5">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={decrement}
          className="flex items-center justify-center bg-red-50 hover:bg-red-100
            text-red-600 font-bold py-3 rounded-xl transition-colors text-xl"
        >
          −
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center bg-slate-100 hover:bg-slate-200
            text-slate-600 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Nol
        </button>
        <button
          onClick={increment}
          className="flex items-center justify-center bg-emerald-50 hover:bg-emerald-100
            text-emerald-600 font-bold py-3 rounded-xl transition-colors text-xl"
        >
          +
        </button>
      </div>
    </div>
  );
}
