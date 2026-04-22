/**
 * SP Network (Substitution-Permutation Network) — Kriptotahlil 4-topshiriq
 * 2-raundli 4-bitli o'quv maqsadli SPN shifri
 *
 * Round structure:
 *   Round 1: AddKey(K1) → SubBytes(SBOX) → Permute(PBOX)
 *   Round 2: AddKey(K2) → SubBytes(SBOX)
 *   Final:   AddKey(K3)
 *
 * Key schedule: K1=K, K2=rotL(K,1), K3=~K (4-bit)
 */

// ── Constants ──────────────────────────────────────────────────────────────────

/** PRESENT lightweight cipher S-box (4-bit) */
export const SPN_SBOX: readonly number[] =
  [12, 5, 6, 11, 9, 0, 10, 13, 3, 14, 15, 8, 4, 7, 1, 2];

/** Inverse S-box: SPN_SBOX_INV[SPN_SBOX[x]] = x */
export const SPN_SBOX_INV: readonly number[] = (() => {
  const inv = new Array<number>(16).fill(0);
  SPN_SBOX.forEach((v, i) => { inv[v] = i; });
  return inv as readonly number[];
})();

/**
 * P-box: SPN_PBOX[i] = j means bit i of input goes to position j of output.
 * [2, 0, 3, 1]: bit0→pos2, bit1→pos0, bit2→pos3, bit3→pos1
 */
export const SPN_PBOX: readonly number[] = [2, 0, 3, 1];

/** Chosen input difference for the attack demo (ΔX = 6 = 0110) */
export const ATTACK_DX = 6;
/** Best S-box output difference for ΔX=6 (DDT[6][11]=4, prob=4/16) */
export const ATTACK_DY1 = 11;
/** Target difference entering round 2 after P-box: PBOX(11) = 7 = 0111 */
export const ATTACK_DU = 7;

// ── Helpers ────────────────────────────────────────────────────────────────────

export function toBin4(n: number): string {
  return (n & 0xF).toString(2).padStart(4, "0");
}

export function toHex1(n: number): string {
  return (n & 0xF).toString(16).toUpperCase();
}

// ── Primitive operations ────────────────────────────────────────────────────────

export function addKey(block: number, key: number): number {
  return (block ^ key) & 0xF;
}

export function subBytes(block: number, sbox: readonly number[]): number {
  return sbox[block & 0xF];
}

export function applyPbox(block: number, pbox: readonly number[]): number {
  let result = 0;
  for (let i = 0; i < pbox.length; i++) {
    result |= ((block >> i) & 1) << pbox[i];
  }
  return result & 0xF;
}

// ── Key schedule ────────────────────────────────────────────────────────────────

export function keySchedule(masterKey: number): [number, number, number] {
  const k = masterKey & 0xF;
  return [
    k,                           // K1 = K
    ((k << 1) | (k >> 3)) & 0xF, // K2 = rotateLeft(K, 1)
    (~k) & 0xF,                  // K3 = ~K (4-bit complement)
  ];
}

// ── SPN trace ──────────────────────────────────────────────────────────────────

export interface SpnTrace {
  plaintext: number;
  masterKey: number;
  k1: number; k2: number; k3: number;
  r1_in:   number; // P XOR K1
  r1_sbox: number; // SubBytes(r1_in)
  r1_pbox: number; // Permute(r1_sbox)
  r2_in:   number; // r1_pbox XOR K2
  r2_sbox: number; // SubBytes(r2_in)
  ciphertext: number; // r2_sbox XOR K3
}

export function spnTrace(plaintext: number, masterKey: number): SpnTrace {
  const [k1, k2, k3] = keySchedule(masterKey);
  const p      = plaintext & 0xF;
  const r1_in   = addKey(p, k1);
  const r1_sbox = subBytes(r1_in, SPN_SBOX);
  const r1_pbox = applyPbox(r1_sbox, SPN_PBOX);
  const r2_in   = addKey(r1_pbox, k2);
  const r2_sbox = subBytes(r2_in, SPN_SBOX);
  const ciphertext = addKey(r2_sbox, k3);
  return { plaintext: p, masterKey, k1, k2, k3, r1_in, r1_sbox, r1_pbox, r2_in, r2_sbox, ciphertext };
}

export function spnEncrypt(plaintext: number, masterKey: number): number {
  return spnTrace(plaintext, masterKey).ciphertext;
}

// ── Differential trace ─────────────────────────────────────────────────────────

export interface DiffSpnTrace {
  x: number; xPrime: number; dx: number;
  dy_r1_sbox: number; // S(x^K1) XOR S(x'^K1)
  dy_r1_pbox: number; // PBOX output difference
  dy_r2_sbox: number; // S(r2_in) XOR S(r2_in')
  dy_cipher:  number; // final ciphertext difference
  traceX:     SpnTrace;
  traceXPrime:SpnTrace;
}

export function diffSpnTrace(x: number, xPrime: number, masterKey: number): DiffSpnTrace {
  const traceX      = spnTrace(x,      masterKey);
  const traceXPrime = spnTrace(xPrime, masterKey);
  return {
    x, xPrime, dx: (x ^ xPrime) & 0xF,
    dy_r1_sbox: traceX.r1_sbox ^ traceXPrime.r1_sbox,
    dy_r1_pbox: traceX.r1_pbox ^ traceXPrime.r1_pbox,
    dy_r2_sbox: traceX.r2_sbox ^ traceXPrime.r2_sbox,
    dy_cipher:  traceX.ciphertext ^ traceXPrime.ciphertext,
    traceX, traceXPrime,
  };
}

// ── Key recovery (differential attack on last-round key K3) ───────────────────

export interface KeyCandidate {
  key: number;
  count: number;
  isCorrect: boolean;
}

export interface KeyRecoveryResult {
  trueK3: number;
  masterKey: number;
  numPairs: number;
  pairs: Array<{ p: number; pPrime: number; c: number; cPrime: number }>;
  candidates: KeyCandidate[]; // sorted descending by count
}

/**
 * Simulate a differential attack targeting the final round key K3.
 * Generates numPairs random plaintexts with ΔX = ATTACK_DX,
 * encrypts them, then tries all 16 candidate K3 values.
 * Correct key will maximise pairs where partial_decrypt difference = ATTACK_DU.
 */
export function runKeyRecovery(masterKey: number, numPairs: number): KeyRecoveryResult {
  const [,, k3] = keySchedule(masterKey);

  // Generate distinct pairs
  const used = new Set<number>();
  const pairs: KeyRecoveryResult["pairs"] = [];
  let attempts = 0;
  while (pairs.length < numPairs && attempts < 200) {
    attempts++;
    const p = Math.floor(Math.random() * 16);
    const pP = (p ^ ATTACK_DX) & 0xF;
    if (used.has(p) || used.has(pP)) continue;
    used.add(p); used.add(pP);
    pairs.push({ p, pPrime: pP, c: spnEncrypt(p, masterKey), cPrime: spnEncrypt(pP, masterKey) });
  }

  // Score each candidate K3
  const candidates: KeyCandidate[] = Array.from({ length: 16 }, (_, k) => {
    let count = 0;
    for (const { c, cPrime } of pairs) {
      const u  = SPN_SBOX_INV[addKey(c,  k)];
      const uP = SPN_SBOX_INV[addKey(cPrime, k)];
      if ((u ^ uP) === ATTACK_DU) count++;
    }
    return { key: k, count, isCorrect: k === k3 };
  });
  candidates.sort((a, b) => b.count - a.count);

  return { trueK3: k3, masterKey, numPairs: pairs.length, pairs, candidates };
}
