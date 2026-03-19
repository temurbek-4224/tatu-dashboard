"use client";

import { useState } from "react";

interface FormData {
  name: string;
  age: string;
  email: string;
}

interface FormErrors {
  name?: string;
  age?: string;
  email?: string;
}

const fields: {
  key: keyof FormData;
  label: string;
  type: string;
  placeholder: string;
}[] = [
  { key: "name", label: "Ism", type: "text", placeholder: "Sardor Aliyev" },
  { key: "age", label: "Yosh", type: "number", placeholder: "25" },
  { key: "email", label: "Email", type: "email", placeholder: "sardor@example.com" },
];

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Ism kiritilishi shart";
  const age = parseInt(form.age);
  if (!form.age || isNaN(age) || age < 1 || age > 120)
    errors.age = "To'g'ri yosh kiriting (1–120)";
  if (!form.email.includes("@") || !form.email.includes("."))
    errors.email = "To'g'ri email kiriting";
  return errors;
}

export default function InputOutput() {
  const [form, setForm] = useState<FormData>({ name: "", age: "", email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = () => {
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", age: "", email: "" });
    setErrors({});
    setSubmitted(false);
  };

  // ── Submitted state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-sm space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold text-emerald-700">Ma&apos;lumotlar saqlandi!</p>
          </div>
          <dl className="space-y-2">
            {fields.map(({ key, label }) => (
              <div key={key} className="flex justify-between items-center text-sm">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-800">
                  {key === "age" ? `${form[key]} yosh` : form[key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <button
          onClick={handleReset}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium
            py-2 rounded-lg text-sm transition-colors"
        >
          Qaytadan to&apos;ldirish
        </button>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-sm space-y-3">
      {fields.map(({ key, label, type, placeholder }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
          <input
            type={type}
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg text-slate-900 text-sm
              bg-slate-50 focus:bg-white outline-none transition-all
              ${errors[key]
                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
          />
          {errors[key] && (
            <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors[key]}
            </p>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium
          py-2 rounded-lg text-sm transition-colors mt-1"
      >
        Saqlash
      </button>
    </div>
  );
}
