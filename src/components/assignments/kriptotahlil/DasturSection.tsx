"use client";

import { useState, useEffect } from "react";

export default function DasturSection() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Amaliy (Dastur) qismi
      </h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1">
              Interaktiv shifrlash dasturi
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Ushbu bo&apos;limda Sezar va Vigenère shifrlarini real vaqtda sinab
              ko&apos;rish, shifrlash va deshifrlash natijalarini ko&apos;rish imkonini
              beruvchi interaktiv dastur joylashtiriladi.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700
                  text-white text-sm font-medium px-4 py-2 rounded-xl
                  shadow-sm shadow-indigo-200 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Dasturni ochish
              </button>

              {/* Status pill */}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                Ishlab chiqilmoqda
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Interaktiv Shifrlash Dasturi
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400
                  hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body — placeholder */}
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h4 className="font-bold text-slate-900 text-lg mb-2">
                Dastur tayyorlanmoqda
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                Bu yerda keyingi bosqichda{" "}
                <span className="font-medium text-indigo-600">
                  Sezar va Vigenère shifrlash/deshifrlash
                </span>{" "}
                interaktiv dasturi joylashtiriladi. Foydalanuvchi matn va
                kalit kiritib, natijani real vaqtda ko&apos;rishi mumkin bo&apos;ladi.
              </p>

              {/* Planned features */}
              <div className="mt-6 text-left bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Rejalashtirilgan funksiyalar
                </p>
                {[
                  "Sezar shifri — shifrlash va deshifrlash",
                  "Vigenère shifri — kalit bilan shifrlash",
                  "Chastotaviy tahlil vizualizatsiyasi",
                  "Brute-force (to'liq qidiruv) ko'rsatish",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                    <svg
                      className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4"
                      />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium
                  px-4 py-2 rounded-xl transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
