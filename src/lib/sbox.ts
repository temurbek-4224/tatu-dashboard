/**
 * S-box mathematics library — Kriptotahlil 3-topshiriq
 * S-box tahlili, chiziqli va differentsial kriptotahlil
 */

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Bit parity of (a AND b): XOR of all bits of (a & b) → 1-bit dot product */
export function dotProduct(a: number, b: number): number {
  let x = a & b;
  let p = 0;
  while (x) { p ^= (x & 1); x >>= 1; }
  return p;
}

/** Format number as fixed-width binary string */
export function toBin(n: number, bits = 4): string {
  return n.toString(2).padStart(bits, "0");
}

// ── Default S-boxes ────────────────────────────────────────────────────────────

/** PRESENT lightweight cipher S-box (4-bit) */
export const PRESENT_SBOX: readonly number[] =
  [12, 5, 6, 11, 9, 0, 10, 13, 3, 14, 15, 8, 4, 7, 1, 2];

/** AES SubBytes nibble S-box — first 16 entries of the 8-bit AES S-box */
export const AES_NIBBLE_SBOX: readonly number[] =
  [9, 4, 10, 11, 13, 1, 8, 5, 6, 2, 0, 3, 12, 14, 15, 7];

// ── Validation ─────────────────────────────────────────────────────────────────

export interface SboxValidation {
  valid: boolean;
  error?: string;
}

export function validateSbox(sbox: number[]): SboxValidation {
  if (sbox.length !== 16)
    return { valid: false, error: "S-box 16 ta qiymatdan iborat bo'lishi kerak (4-bit)." };
  const seen = new Set<number>();
  for (const v of sbox) {
    if (!Number.isInteger(v) || v < 0 || v > 15)
      return { valid: false, error: `Noto'g'ri qiymat: ${v}. Har bir katak 0–15 oralig'ida bo'lishi kerak.` };
    if (seen.has(v))
      return { valid: false, error: `Takroriy qiymat: ${v}. S-box bijektiv (har bir qiymat bir marta) bo'lishi kerak.` };
    seen.add(v);
  }
  return { valid: true };
}

// ── Linear Approximation Table ─────────────────────────────────────────────────

/**
 * LAT[α][β] = #{x : α·x = β·S(x)} − 8
 * Centred bias: 0 = perfectly balanced, ±8 = perfect linear relation.
 */
export function computeLAT(sbox: number[]): number[][] {
  return Array.from({ length: 16 }, (_, alpha) =>
    Array.from({ length: 16 }, (_, beta) => {
      let count = 0;
      for (let x = 0; x < 16; x++) {
        if (dotProduct(alpha, x) === dotProduct(beta, sbox[x])) count++;
      }
      return count - 8;
    })
  );
}

// ── Differential Distribution Table ───────────────────────────────────────────

/**
 * DDT[ΔX][ΔY] = #{x : S(x ⊕ ΔX) ⊕ S(x) = ΔY}
 * Max value for ΔX≠0 is the differential uniformity.
 */
export function computeDDT(sbox: number[]): number[][] {
  const ddt: number[][] = Array.from({ length: 16 }, () => new Array(16).fill(0));
  for (let dx = 0; dx < 16; dx++) {
    for (let x = 0; x < 16; x++) {
      ddt[dx][sbox[x] ^ sbox[x ^ dx]]++;
    }
  }
  return ddt;
}

// ── Full S-box Analysis ────────────────────────────────────────────────────────

export interface SboxAnalysis {
  sbox: number[];
  lat: number[][];
  ddt: number[][];
  maxAbsBias: number;          // max |lat[α][β]| for α,β ∈ 1..15
  nonlinearity: number;        // 8 − maxAbsBias  (higher = better)
  maxDiffUniformity: number;   // max ddt[ΔX][ΔY] for ΔX ∈ 1..15 (lower = better)
  bestLinear: { alpha: number; beta: number; bias: number } | null;
  worstDiff: { dx: number; dy: number; count: number } | null;
}

export function analyzeSbox(sbox: number[]): SboxAnalysis {
  const lat = computeLAT(sbox);
  const ddt = computeDDT(sbox);

  let maxAbsBias = 0;
  let bestLinear: SboxAnalysis["bestLinear"] = null;
  for (let a = 1; a < 16; a++) {
    for (let b = 1; b < 16; b++) {
      const abs = Math.abs(lat[a][b]);
      if (abs > maxAbsBias) {
        maxAbsBias = abs;
        bestLinear = { alpha: a, beta: b, bias: lat[a][b] };
      }
    }
  }

  let maxDiffUniformity = 0;
  let worstDiff: SboxAnalysis["worstDiff"] = null;
  for (let dx = 1; dx < 16; dx++) {
    for (let dy = 0; dy < 16; dy++) {
      if (ddt[dx][dy] > maxDiffUniformity) {
        maxDiffUniformity = ddt[dx][dy];
        worstDiff = { dx, dy, count: ddt[dx][dy] };
      }
    }
  }

  return {
    sbox,
    lat,
    ddt,
    maxAbsBias,
    nonlinearity: 8 - maxAbsBias,
    maxDiffUniformity,
    bestLinear,
    worstDiff,
  };
}

// ── Linear Analysis ─────────────────────────────────────────────────────────────

export interface LinearResult {
  alpha: number;
  beta: number;
  count: number;        // #{x : α·x = β·S(x)}
  bias: number;         // count − 8
  probability: number;  // count / 16
  matches: number[];    // x values satisfying the relation
}

export function linearAnalysis(sbox: number[], alpha: number, beta: number): LinearResult {
  const matches: number[] = [];
  for (let x = 0; x < 16; x++) {
    if (dotProduct(alpha, x) === dotProduct(beta, sbox[x])) matches.push(x);
  }
  const count = matches.length;
  return { alpha, beta, count, bias: count - 8, probability: count / 16, matches };
}

// ── Differential Analysis ──────────────────────────────────────────────────────

export interface DifferentialResult {
  x: number;
  xPrime: number;
  dx: number;          // ΔX = x ⊕ x'
  y: number;           // S(x)
  yPrime: number;      // S(x')
  dy: number;          // ΔY = S(x) ⊕ S(x')
  ddtCount: number;    // DDT[ΔX][ΔY] — how many input pairs produce this output difference
  probability: number; // ddtCount / 16
}

export function differentialAnalysis(
  sbox: number[],
  x: number,
  xPrime: number
): DifferentialResult {
  const dx = x ^ xPrime;
  const y = sbox[x];
  const yPrime = sbox[xPrime];
  const dy = y ^ yPrime;
  let ddtCount = 0;
  for (let xi = 0; xi < 16; xi++) {
    if ((sbox[xi] ^ sbox[xi ^ dx]) === dy) ddtCount++;
  }
  return { x, xPrime, dx, y, yPrime, dy, ddtCount, probability: ddtCount / 16 };
}
