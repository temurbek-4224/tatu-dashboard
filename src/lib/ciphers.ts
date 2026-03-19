/**
 * Classical cipher implementations — pure TypeScript functions.
 * All functions treat non-alpha characters as pass-through (unchanged).
 */

export interface CipherResults {
  atbash: string;
  caesar: string;
  polibey: string;
  vigenere: string;
}

export interface CipherStep {
  input: string;
  output: string;
  keyChar?: string;  // Vigenere: key letter used
  keyVal?: number;   // Vigenere: numeric shift value
}

const MAX_STEPS = 14; // max characters shown in step visualization

// ── Atbash ─────────────────────────────────────────────────────────────────────
// A↔Z, B↔Y, … (self-inverse). Non-alpha chars are unchanged.
export function atbashEncrypt(text: string): string {
  return text
    .split("")
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") return String.fromCharCode(90 - (ch.charCodeAt(0) - 65));
      if (ch >= "a" && ch <= "z") return String.fromCharCode(122 - (ch.charCodeAt(0) - 97));
      return ch;
    })
    .join("");
}

// Self-inverse — decrypt = encrypt
export const atbashDecrypt = atbashEncrypt;

// ── Caesar ─────────────────────────────────────────────────────────────────────
// Shift by key (mod 26). key is expected to be 1–25.
export function caesarEncrypt(text: string, key: number): string {
  const k = ((key % 26) + 26) % 26;
  return text
    .split("")
    .map((ch) => {
      if (ch >= "A" && ch <= "Z")
        return String.fromCharCode(((ch.charCodeAt(0) - 65 + k) % 26) + 65);
      if (ch >= "a" && ch <= "z")
        return String.fromCharCode(((ch.charCodeAt(0) - 97 + k) % 26) + 97);
      return ch;
    })
    .join("");
}

export function caesarDecrypt(text: string, key: number): string {
  const k = ((key % 26) + 26) % 26;
  return caesarEncrypt(text, 26 - k);
}

// Caesar step-by-step visualization
export function getCaesarSteps(
  text: string,
  key: number,
  mode: "encrypt" | "decrypt"
): CipherStep[] {
  const rawK = mode === "encrypt" ? ((key % 26) + 26) % 26 : ((26 - (key % 26)) + 26) % 26;
  const steps: CipherStep[] = [];
  for (const ch of text.toUpperCase()) {
    if (steps.length >= MAX_STEPS) break;
    if (ch >= "A" && ch <= "Z") {
      const outputCode = ((ch.charCodeAt(0) - 65 + rawK) % 26 + 26) % 26;
      steps.push({ input: ch, output: String.fromCharCode(outputCode + 65) });
    }
  }
  return steps;
}

// ── Polibey ─────────────────────────────────────────────────────────────────────
// 5×5 grid (I=J). Encrypt: each letter → "RC" pair, space → "/".
// Decrypt: space-separated "RC" tokens → letters, "/" → space.
const POLIBEY_GRID = [
  ["A", "B", "C", "D", "E"],
  ["F", "G", "H", "I", "K"],
  ["L", "M", "N", "O", "P"],
  ["Q", "R", "S", "T", "U"],
  ["V", "W", "X", "Y", "Z"],
];

const POLIBEY_LOOKUP: Record<string, string> = {};
for (let r = 0; r < POLIBEY_GRID.length; r++) {
  for (let c = 0; c < POLIBEY_GRID[r].length; c++) {
    POLIBEY_LOOKUP[POLIBEY_GRID[r][c]] = `${r + 1}${c + 1}`;
  }
}
POLIBEY_LOOKUP["J"] = POLIBEY_LOOKUP["I"]; // I and J share cell (2,4)

export function polibeyEncrypt(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return "/";
      return POLIBEY_LOOKUP[ch] ?? ch;
    })
    .join(" ");
}

export function polibeyDecrypt(text: string): string {
  const tokens = text.trim().split(/\s+/);
  return tokens
    .map((t) => {
      if (t === "/") return " ";
      if (/^\d{2}$/.test(t)) {
        const r = parseInt(t[0], 10) - 1;
        const c = parseInt(t[1], 10) - 1;
        if (r >= 0 && r < 5 && c >= 0 && c < 5) return POLIBEY_GRID[r][c];
      }
      return t;
    })
    .join("");
}

// ── Vigenere ───────────────────────────────────────────────────────────────────
// Key repeats; key index advances only on alpha characters. Case-preserving.
export function vigenereEncrypt(text: string, rawKey: string): string {
  const key = rawKey.toUpperCase().replace(/[^A-Z]/g, "");
  if (key.length === 0) return text;

  let ki = 0;
  return text
    .split("")
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") {
        const shift = key.charCodeAt(ki++ % key.length) - 65;
        return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      if (ch >= "a" && ch <= "z") {
        const shift = key.charCodeAt(ki++ % key.length) - 65;
        return String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      return ch;
    })
    .join("");
}

export function vigenereDecrypt(text: string, rawKey: string): string {
  const key = rawKey.toUpperCase().replace(/[^A-Z]/g, "");
  if (key.length === 0) return text;

  let ki = 0;
  return text
    .split("")
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") {
        const shift = key.charCodeAt(ki++ % key.length) - 65;
        return String.fromCharCode(((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      }
      if (ch >= "a" && ch <= "z") {
        const shift = key.charCodeAt(ki++ % key.length) - 65;
        return String.fromCharCode(((ch.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
      }
      return ch;
    })
    .join("");
}

// Vigenere step-by-step visualization
export function getVigenereSteps(
  text: string,
  rawKey: string,
  mode: "encrypt" | "decrypt"
): CipherStep[] {
  const key = rawKey.toUpperCase().replace(/[^A-Z]/g, "");
  if (key.length === 0) return [];

  const steps: CipherStep[] = [];
  let ki = 0;
  for (const ch of text.toUpperCase()) {
    if (steps.length >= MAX_STEPS) break;
    if (ch >= "A" && ch <= "Z") {
      const keyChar = key[ki % key.length];
      const keyVal = keyChar.charCodeAt(0) - 65;
      const inputCode = ch.charCodeAt(0) - 65;
      const outputCode =
        mode === "encrypt"
          ? (inputCode + keyVal) % 26
          : ((inputCode - keyVal + 26) % 26);
      steps.push({
        input: ch,
        output: String.fromCharCode(outputCode + 65),
        keyChar,
        keyVal,
      });
      ki++;
    }
  }
  return steps;
}

// ── Convenience ───────────────────────────────────────────────────────────────
export function encryptAll(
  text: string,
  caesarKey: number,
  vigenereKey: string
): CipherResults {
  return {
    atbash: atbashEncrypt(text),
    caesar: caesarEncrypt(text, caesarKey),
    polibey: polibeyEncrypt(text),
    vigenere: vigenereEncrypt(text, vigenereKey),
  };
}

export function decryptAll(
  text: string,
  caesarKey: number,
  vigenereKey: string
): CipherResults {
  return {
    atbash: atbashDecrypt(text),
    caesar: caesarDecrypt(text, caesarKey),
    polibey: polibeyDecrypt(text),
    vigenere: vigenereDecrypt(text, vigenereKey),
  };
}
