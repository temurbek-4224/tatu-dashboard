/**
 * Cryptoanalysis utilities — pure TypeScript, no side effects.
 * Used exclusively by the Kriptoanaliz mode in CipherPanel.
 */

import { caesarDecrypt, atbashEncrypt, vigenereDecrypt } from "@/lib/ciphers";

// ── Shared types ───────────────────────────────────────────────────────────────
export type CaType = "atbash" | "caesar" | "polibey" | "vigenere";

export interface CaesarVariant {
  k: number;
  text: string;
  /** 0-100 score relative to the best-scoring variant in this set */
  score: number;
}

export interface PolibeyDecodeResult {
  result: string;
  valid: boolean;
  error?: string;
  /** 0-indexed [row, col] pairs for grid highlight */
  highlightCells: Array<[number, number]>;
}

/** State shape bubbled up to CipherPanel for PDF export */
export interface CryptoanalysisData {
  cipher: CaType;
  ciphertext: string;
  // Atbash
  atbashResult?: string;
  // Caesar
  caesarVariants?: CaesarVariant[];
  caesarBestK?: number;
  // Polibey
  polibeyResult?: string;
  // Vigenere
  vigenereGuessedKey?: string;
  vigenereResult?: string;
}

// ── Atbash analysis ────────────────────────────────────────────────────────────
// Atbash is self-inverse — decryption === encryption
export const analyzeAtbash = (ciphertext: string): string => atbashEncrypt(ciphertext);

// ── Caesar brute-force ─────────────────────────────────────────────────────────
// English letter frequency table (%) from ETAOIN order
const LETTER_FREQ: Record<string, number> = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1, R: 6.0,
  D: 4.3,  L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2, G: 2.0, Y: 2.0,
  P: 1.9,  B: 1.5, V: 1.0, K: 0.8, J: 0.15, X: 0.15, Q: 0.1, Z: 0.07,
};

function scoreEnglish(text: string): number {
  const upper = text.toUpperCase().replace(/[^A-Z]/g, "");
  if (upper.length === 0) return 0;
  let total = 0;
  for (const ch of upper) total += LETTER_FREQ[ch] ?? 0;
  return total / upper.length; // avg frequency per letter
}

/**
 * Returns 25 variants (k=1…25) each with a 0-100 relative score.
 * The best-matching variant receives score=100; all others are normalised.
 */
export function caesarBruteForce(ciphertext: string): CaesarVariant[] {
  const raw: Array<{ k: number; text: string; rawScore: number }> = [];

  for (let k = 1; k <= 25; k++) {
    raw.push({ k, text: caesarDecrypt(ciphertext, k), rawScore: scoreEnglish(caesarDecrypt(ciphertext, k)) });
  }

  const maxScore = Math.max(...raw.map((r) => r.rawScore), 1);
  return raw.map((r) => ({
    k: r.k,
    text: r.text,
    score: Math.round((r.rawScore / maxScore) * 100),
  }));
}

export function bestCaesarK(variants: CaesarVariant[]): number {
  return variants.reduce((best, v) => (v.score > best.score ? v : best), variants[0]).k;
}

// ── Polibey decode ─────────────────────────────────────────────────────────────
export const POLIBEY_GRID_ROWS: readonly (readonly string[])[] = [
  ["A", "B", "C", "D", "E"],
  ["F", "G", "H", "I", "K"],
  ["L", "M", "N", "O", "P"],
  ["Q", "R", "S", "T", "U"],
  ["V", "W", "X", "Y", "Z"],
];

export function decodePolibey(text: string): PolibeyDecodeResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { result: "", valid: false, error: "Shifrmatn kiritilmagan.", highlightCells: [] };
  }

  const tokens = trimmed.split(/\s+/);
  const result: string[] = [];
  const highlightCells: Array<[number, number]> = [];

  for (const token of tokens) {
    if (token === "/") {
      result.push(" ");
      continue;
    }
    if (!/^\d{2}$/.test(token)) {
      return {
        result: "",
        valid: false,
        error: `"${token}" — noto'g'ri format. Faqat ikki xonali raqamlar (11–55) yoki "/" (bo'shliq) qabul qilinadi.`,
        highlightCells: [],
      };
    }
    const r = parseInt(token[0], 10) - 1;
    const c = parseInt(token[1], 10) - 1;
    if (r < 0 || r > 4 || c < 0 || c > 4) {
      return {
        result: "",
        valid: false,
        error: `"${token}" — jadval chegarasidan tashqarida. Raqamlar 1–5 oralig'ida bo'lishi kerak.`,
        highlightCells: [],
      };
    }
    result.push(POLIBEY_GRID_ROWS[r][c]);
    highlightCells.push([r, c]);
  }

  return { result: result.join(""), valid: true, highlightCells };
}

// ── Vigenere guessed-key decrypt ──────────────────────────────────────────────
export function vigenereGuessedKey(ciphertext: string, key: string): string {
  return vigenereDecrypt(ciphertext, key);
}
