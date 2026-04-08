/**
 * RSA math helpers — Kriptotahlil 2-topshiriq
 * Uses BigInt for intermediate products to avoid overflow.
 * Safe for educational demo values: p, q ≤ 500.
 */

// ── Core arithmetic ────────────────────────────────────────────────────────────

export function gcd(a: number, b: number): number {
  while (b !== 0) { [a, b] = [b, a % b]; }
  return a;
}

/** Extended Euclidean → modular inverse of a mod m, or null if gcd ≠ 1 */
export function modInverse(a: number, m: number): number | null {
  let [old_r, r] = [a, m];
  let [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  if (old_r !== 1) return null;
  return ((old_s % m) + m) % m;
}

/** Multiplication mod m — uses BigInt to avoid overflow */
function mulmod(a: number, b: number, m: number): number {
  return Number(BigInt(a) * BigInt(b) % BigInt(m));
}

/** Fast modular exponentiation: base^exp mod mod */
export function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = mulmod(result, base, mod);
    exp = Math.floor(exp / 2);
    base = mulmod(base, base, mod);
  }
  return result;
}

/** Simple trial-division primality test (adequate for n ≤ 10000) */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// ── Key generation ─────────────────────────────────────────────────────────────

export interface RsaKeyResult {
  valid: true;
  p: number;
  q: number;
  e: number;
  n: number;
  phi: number;
  d: number;
}

export interface RsaKeyError {
  valid: false;
  error: string;
}

export type RsaKeyGen = RsaKeyResult | RsaKeyError;

export function rsaKeygen(p: number, q: number, e: number): RsaKeyGen {
  if (!Number.isInteger(p) || p <= 1) return { valid: false, error: `p = ${p} musbat butun son emas.` };
  if (!Number.isInteger(q) || q <= 1) return { valid: false, error: `q = ${q} musbat butun son emas.` };
  if (!isPrime(p)) return { valid: false, error: `p = ${p} tub son emas.` };
  if (!isPrime(q)) return { valid: false, error: `q = ${q} tub son emas.` };
  if (p === q)     return { valid: false, error: "p va q har xil tub son bo'lishi kerak." };
  const n   = p * q;
  const phi = (p - 1) * (q - 1);
  if (e <= 1)       return { valid: false, error: `e = ${e} shartga mos emas: e > 1 bo'lishi kerak.` };
  if (e >= phi)     return { valid: false, error: `e = ${e} shartga mos emas: e < φ(n) = ${phi} bo'lishi kerak.` };
  if (gcd(e, phi) !== 1)
    return { valid: false, error: `e = ${e} va φ(n) = ${phi} o'zaro tub emas. EKUB(e, φ(n)) = ${gcd(e, phi)}.` };
  const d = modInverse(e, phi);
  if (d === null) return { valid: false, error: "d = e⁻¹ mod φ(n) hisoblanmadi." };
  return { valid: true, p, q, e, n, phi, d };
}

// ── Encrypt / Decrypt ──────────────────────────────────────────────────────────

export function rsaEncrypt(M: number, e: number, n: number): number {
  return modPow(M, e, n);
}

export function rsaDecrypt(C: number, d: number, n: number): number {
  return modPow(C, d, n);
}

// ── Attack 1: Repeated encryption ──────────────────────────────────────────────

export interface RepEncStep {
  j: number;
  value: number;
  isStart: boolean; // value === C (cycle found)
}

export interface RepEncResult {
  steps: RepEncStep[];
  M: number | null;
  found: boolean;
  cycleLength: number | null;
}

/** Repeatedly apply C ← C^e mod n until we return to C₀.
 *  The step immediately before the cycle is M (the plaintext). */
export function repeatedEncryptionAttack(
  C: number,
  e: number,
  n: number,
  maxSteps = 300,
): RepEncResult {
  const steps: RepEncStep[] = [{ j: 0, value: C, isStart: false }];
  let cur = C;
  for (let j = 1; j <= maxSteps; j++) {
    cur = modPow(cur, e, n);
    const isStart = cur === C;
    steps.push({ j, value: cur, isStart });
    if (isStart) {
      return {
        steps,
        M: steps[j - 1].value,
        found: true,
        cycleLength: j,
      };
    }
  }
  return { steps, M: null, found: false, cycleLength: null };
}

// ── Attack 2: Signature (Notarius) attack ──────────────────────────────────────

export interface SignatureAttackResult {
  r: number;
  y: number;          // y = r^e * M mod n  (sent to signer)
  S_y: number;        // S_y = y^d mod n   (returned by signer)
  sig: number;        // sig = S_y * r^(-1) mod n  (= M^d mod n)
  rInv: number | null;
  valid: boolean;
  error?: string;
}

/** Blind signature / notarius attack demo.
 *  Attacker has M and (e, n, d) to simulate — in practice d comes from signer. */
export function signatureAttack(
  M: number, r: number, e: number, n: number, d: number,
): SignatureAttackResult {
  const rInv = modInverse(r % n, n);
  if (rInv === null) {
    return { r, y: 0, S_y: 0, sig: 0, rInv: null, valid: false, error: `r = ${r} va n = ${n} o'zaro tub emas.` };
  }
  const re  = modPow(r, e, n);
  const y   = mulmod(re, M % n, n);
  const S_y = modPow(y, d, n);               // signer returns this
  const sig = mulmod(S_y, rInv, n);           // M^d mod n
  return { r, y, S_y, sig, rInv, valid: true };
}

// ── Attack 3: Chosen ciphertext attack ─────────────────────────────────────────

export interface ChosenCiphertextResult {
  r: number;
  rInv: number | null;
  x: number;          // x = r^e mod n
  Cprime: number;     // C' = x * C mod n  = (rM)^e mod n
  Mprime: number;     // M' = C'^d mod n   = rM mod n
  M: number;          // M  = M' * r^(-1) mod n
  valid: boolean;
  error?: string;
}

export function chosenCiphertextAttack(
  C: number, r: number, e: number, n: number, d: number,
): ChosenCiphertextResult {
  const rInv = modInverse(r % n, n);
  if (rInv === null) {
    return { r, rInv: null, x: 0, Cprime: 0, Mprime: 0, M: 0, valid: false,
             error: `r = ${r} va n = ${n} o'zaro tub emas.` };
  }
  const x      = modPow(r, e, n);
  const Cprime = mulmod(x, C % n, n);
  const Mprime = modPow(Cprime, d, n);          // oracle decrypts C'
  const M      = mulmod(Mprime, rInv, n);
  return { r, rInv, x, Cprime, Mprime, M, valid: true };
}
