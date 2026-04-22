/**
 * PDF Report Generator — Kriptotahlil 3-topshiriq
 * S-box va Kriptotahlil Usullari
 * Uses jsPDF (dynamically imported, client-side only).
 */

import type { SboxAnalysis, LinearResult, DifferentialResult } from "./sbox";
import { toBin } from "./sbox";

export interface SboxPDFOptions {
  sboxAnalysis: SboxAnalysis;
  linearResult?: LinearResult;
  diffResult?: DifferentialResult;
}

// ── Colour palette ─────────────────────────────────────────────────────────────
type RGB = [number, number, number];
const C = {
  indigo700: [67,  56,  202] as RGB,
  indigo600: [79,  70,  229] as RGB,
  indigo200: [199, 210, 254] as RGB,
  indigo100: [224, 231, 255] as RGB,
  indigo50:  [238, 242, 255] as RGB,
  sky700:    [3,   105, 161] as RGB,
  sky600:    [2,   132, 199] as RGB,
  sky200:    [186, 230, 253] as RGB,
  sky100:    [224, 242, 254] as RGB,
  sky50:     [240, 249, 255] as RGB,
  slate900:  [15,  23,  42]  as RGB,
  slate700:  [51,  65,  85]  as RGB,
  slate600:  [71,  85,  105] as RGB,
  slate500:  [100, 116, 139] as RGB,
  slate400:  [148, 163, 184] as RGB,
  slate300:  [203, 213, 225] as RGB,
  slate200:  [226, 232, 240] as RGB,
  slate100:  [241, 245, 249] as RGB,
  slate50:   [248, 250, 252] as RGB,
  rose600:   [225, 29,  72]  as RGB,
  rose100:   [255, 228, 230] as RGB,
  amber600:  [217, 119, 6]   as RGB,
  amber100:  [254, 243, 199] as RGB,
  amber50:   [255, 251, 235] as RGB,
  emerald600:[5,   150, 105] as RGB,
  emerald100:[209, 250, 229] as RGB,
  violet600: [124, 58,  237] as RGB,
  violet100: [237, 233, 254] as RGB,
  white:     [255, 255, 255] as RGB,
};

export async function generateSboxPDF(opts: SboxPDFOptions): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW   = 210;
  const PH   = 297;
  const ML   = 18;
  const MR   = 18;
  const RX   = PW - MR;
  const CW   = RX - ML;
  const LH   = 5;
  let y      = 0;
  let pageNo = 1;

  const sc   = (col: RGB) => doc.setTextColor(...col);
  const sf   = (col: RGB) => doc.setFillColor(...col);
  const sd   = (col: RGB) => doc.setDrawColor(...col);
  const ss   = (n: number) => doc.setFontSize(n);
  const bold   = () => doc.setFont("helvetica", "bold");
  const normal = () => doc.setFont("helvetica", "normal");
  const italic = () => doc.setFont("helvetica", "italic");
  const mono   = () => doc.setFont("courier", "normal");
  const monob  = () => doc.setFont("courier", "bold");
  const wrap   = (s: string, w: number): string[] => doc.splitTextToSize(s, w);
  const tw     = (s: string): number => doc.getTextWidth(s);
  const textLines = (lines: string[], x: number, startY: number, lh = LH) =>
    lines.forEach((ln, i) => doc.text(ln, x, startY + i * lh));

  const footer = () => {
    const fy = PH - 10;
    sd(C.slate300); doc.setLineWidth(0.2);
    doc.line(ML, fy - 4, RX, fy - 4);
    normal(); ss(7.5); sc(C.slate400);
    doc.text("Kriptotahlil — 3-topshiriq  |  S-box va Kriptotahlil Usullari", ML, fy);
    doc.text(`${pageNo}-bet`, RX, fy, { align: "right" });
  };

  const need = (h: number) => {
    if (y + h > PH - 22) {
      footer(); doc.addPage(); pageNo++; y = 22;
    }
  };

  const sectionTitle = (n: string, title: string, col: RGB = C.indigo700) => {
    need(18); y += 3;
    sf(col); sd(col);
    doc.rect(ML, y - 6, 3.5, 9.5, "F");
    bold(); ss(12); sc(col);
    doc.text(`${n}. ${title}`, ML + 7, y);
    y += 2;
    sd(C.indigo200); doc.setLineWidth(0.4);
    doc.line(ML, y + 1, RX, y + 1);
    doc.setLineWidth(0.2);
    y += 8;
  };

  const subTitle = (badge: string, title: string, col: RGB) => {
    need(14); y += 2;
    sf(col); sd(col); doc.setLineWidth(0);
    doc.rect(ML, y - 5.5, 8, 8, "F");
    bold(); ss(8); sc(C.white);
    doc.text(badge, ML + 4, y - 1, { align: "center" });
    bold(); ss(10.5); sc(col);
    doc.text(title, ML + 12, y);
    doc.setLineWidth(0.2);
    y += 6;
  };

  const para = (text: string, indent = 0, col: RGB = C.slate700) => {
    normal(); ss(9); sc(col);
    const lines = wrap(text, CW - indent);
    need(lines.length * LH + 2);
    textLines(lines, ML + indent, y);
    y += lines.length * LH + 2;
  };

  const codeBox = (text: string, bg: RGB, fg: RGB) => {
    const lines = wrap(text, CW - 10);
    const h = lines.length * 5 + 8;
    need(h + 3);
    sf(bg); sd(bg);
    doc.rect(ML, y, CW, h, "FD");
    monob(); ss(8.5); sc(fg);
    textLines(lines, ML + 5, y + 5);
    y += h + 4;
  };

  const questionBlock = (n: number, q: string) => {
    const qLines = wrap(q, CW - 22);
    const qH = qLines.length * 5 + 10;
    need(qH + 2);
    sf(C.indigo50); sd(C.indigo100);
    doc.rect(ML, y, CW, qH, "FD");
    sf(C.indigo700); sd(C.indigo700);
    doc.rect(ML, y, 10, qH, "F");
    bold(); ss(12); sc(C.white);
    doc.text(String(n), ML + 5, y + qH / 2 + 1.5, { align: "center" });
    bold(); ss(9.5); sc(C.slate900);
    textLines(qLines, ML + 14, y + 6);
    y += qH + 4;
  };

  const answerBlock = (items: Array<{ tag: string; tagColor: RGB; text: string }>) => {
    const rendered = items.map((it) => ({
      ...it,
      lines: wrap(it.text, CW - 18),
    }));
    const innerH = rendered.reduce((h, r) => h + r.lines.length * 4.5 + 10, 0) + 4;
    need(innerH + 2);
    sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.25);
    doc.rect(ML, y, CW, innerH, "FD");
    sf(C.indigo100); sd(C.indigo100);
    doc.rect(ML, y, 3.5, innerH, "F");
    doc.setLineWidth(0.2);
    let iy = y + 6;
    for (const r of rendered) {
      bold(); ss(8.5); sc(r.tagColor);
      doc.text(r.tag, ML + 7, iy); iy += 5;
      normal(); ss(8.5); sc(C.slate700);
      r.lines.forEach((ln) => { doc.text(ln, ML + 7, iy); iy += 4.5; });
      iy += 4;
    }
    y += innerH + 5;
  };

  const emptySection = () => {
    need(14);
    sf(C.slate100); sd(C.slate200); doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, 12, "FD");
    italic(); ss(9); sc(C.slate400);
    doc.text("Bu bo'lim bajarilmagan.", ML + 5, y + 7.5);
    y += 16;
  };

  const kvRow = (label: string, val: string, x: number, ky: number, lCol: RGB = C.slate600) => {
    bold(); ss(8); sc(lCol);
    doc.text(label, x, ky);
    mono(); ss(9); sc(C.slate900);
    doc.text(val, x + tw(label) + 2, ky);
  };

  // Render S-box as a compact horizontal row
  const sboxRow = (sbox: number[]) => {
    const rowH = 22;
    need(rowH + 4);
    sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, rowH, "FD");
    const cellW = CW / 16;
    // Header row
    for (let i = 0; i < 16; i++) {
      bold(); ss(7); sc(C.slate400);
      doc.text(i.toString(16).toUpperCase(), ML + i * cellW + cellW / 2, y + 6, { align: "center" });
    }
    // Values row
    for (let i = 0; i < 16; i++) {
      monob(); ss(9); sc(C.indigo700);
      doc.text(sbox[i].toString(16).toUpperCase(), ML + i * cellW + cellW / 2, y + 16, { align: "center" });
    }
    y += rowH + 5;
  };

  // ════════════════════════════════════════════════════════════════════════════
  // ── COVER ─────────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sf(C.indigo700); doc.rect(0, 0, PW, 42, "F");
  sf(C.indigo600); doc.rect(0, 38, PW, 4, "F");
  bold(); ss(9); sc(C.indigo200);
  doc.text("TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI", PW / 2, 10, { align: "center" });
  bold(); ss(8); sc(C.indigo200);
  doc.text("Kriptotahlil fani  —  3-topshiriq  |  S-box va Kriptotahlil Usullari", PW / 2, 17, { align: "center" });
  bold(); ss(18); sc(C.white);
  doc.text("3-TOPSHIRIQ", PW / 2, 30, { align: "center" });
  normal(); ss(9); sc(C.indigo200);
  doc.text("S-box va kriptotahlil usullari", PW / 2, 37, { align: "center" });

  // Student info bar
  sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.25);
  doc.rect(ML, 47, CW, 18, "FD");
  bold(); ss(8); sc(C.slate600); doc.text("Talaba:", ML + 4, 54);
  bold(); ss(9); sc(C.indigo700);
  doc.text("Temurbek Xaydarov", ML + 4 + tw("Talaba:") + 2, 54);
  bold(); ss(8); sc(C.slate600); doc.text("Fan:", ML + 4, 61);
  normal(); ss(8.5); sc(C.slate700);
  doc.text("Kriptotahlil  |  3-topshiriq — S-box va kriptotahlil usullari", ML + 4 + tw("Fan:") + 2, 61);

  y = 72;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 1. MAQSAD ─────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("1", "MAQSAD");
  para(
    "Ushbu amaliy mashg'ulotda S-box (almashish quticha) tushunchasi, " +
    "uning blok shifrlar (AES, DES) dagi roli va kriptografik xususiyatlari o'rganiladi. " +
    "Chiziqli kriptotahlil (LAT — Chiziqli Approximatsiya Jadvali) va differentsial " +
    "kriptotahlil (DDT — Differentsial Taqsimot Jadvali) usullari interaktiv vositalar " +
    "yordamida amalda sinab ko'riladi. S-box ning nochiziqlilik va differentsial " +
    "uniformlik ko'rsatkichlari tahlil qilinadi."
  );
  y += 2;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 2. NAZARIY QISM ───────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("2", "NAZARIY QISM");

  subTitle("A", "S-box tushunchasi va blok shifrlar", C.sky600);
  para(
    "S-box (Substitution Box) — kriptografik algoritmlarda kirish bitlarini chiqish bitlariga " +
    "almashtiruvchi nochiziqli funksiya. Blok shifrlarning asosiy kriptografik kuchi " +
    "(confusion xususiyati) S-boxdan keladi. " +
    "AES 8-bitli S-boxdan foydalanadi (256 ta kirish, GF(2^8) da multiplikativ inversiyaga asoslanadi). " +
    "DES har bir tur uchun 6->4 bit S-boxlarni ishlatadi (S1...S8). " +
    "PRESENT kabi engil shifrlar esa 4-bitli S-boxlarni afzal ko'radi."
  );
  codeBox(
    "SPN (Substitution-Permutation Network):\n" +
    "  Har bir turda: AddRoundKey -> SubBytes (S-box) -> ShiftRows -> MixColumns\n" +
    "4-bit S-box: f: {0,...,15} -> {0,...,15}  (bijeksiya/permutatsiya)",
    C.slate100, C.indigo700
  );
  y += 2;

  subTitle("B", "Chiziqli kriptotahlil (Matsui, 1993)", C.amber600);
  para(
    "Chiziqli kriptotahlil ochiq matn va shifrmatn bitlarining XOR bog'liqliklarini " +
    "statistik tahlil qilish orqali kalit bitlarini tiklash usuli. " +
    "LAT[alpha][beta] = #{x : alpha*x = beta*S(x)} - 8 formula bilan hisoblanadi. " +
    "Bias = 0 ideali anglatadi — S-box chiziqli korrelyatsiyadan xoli. " +
    "Yaxshi 4-bit S-box uchun maksimal |bias| <= 4 bo'lishi kerak."
  );
  codeBox(
    "LAT[a][b] = #{x : a*x XOR b*S(x) = 0} - 8\n" +
    "Bias: 0 = ideal, +-8 = to'liq chiziqli bog'liqlik\n" +
    "Ehtimollik = (8 + bias) / 16",
    C.amber50, C.amber600
  );
  y += 2;

  subTitle("C", "Differentsial kriptotahlil (Biham-Shamir, 1990)", C.rose600);
  para(
    "Differentsial kriptotahlil ochiq matn juftlarining farqi (DX) shifrmatn farqiga " +
    "(DY) qanday ta'sir qilishini tahlil qiladi. DDT jadvali bu ehtimolliklarni ko'rsatadi. " +
    "Differentsial uniformlik (max DDT qiymati DX!=0 uchun) kichik bo'lsa, S-box " +
    "differentsial hujumga chidamli. AES S-box uchun bu qiymat 4 ga teng."
  );
  codeBox(
    "DX = X XOR X'                  (kiritish farqi)\n" +
    "DY = S(X) XOR S(X')            (chiqish farqi)\n" +
    "DDT[DX][DY] = #{x : S(x XOR DX) XOR S(x) = DY}\n" +
    "Ehtimollik = DDT[DX][DY] / 16",
    C.rose100, C.rose600
  );
  y += 4;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 3. NAZORAT SAVOLLARI ──────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("3", "NAZORAT SAVOLLARI");

  questionBlock(1, "S-box nima va u kriptografiyada nima uchun ishlatiladi?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "S-box (Substitution Box) kriptografik algoritmlarda kirish bitlarini chiqish bitlariga " +
      "almashtiruvchi nochiziqli funksiya. Shannon'ning 'confusion' tamoyilini amalga oshiradi. " +
      "SPN sxemasida (AES): SubBytes bosqichi 256-elementli S-box dan foydalanadi. " +
      "4-bit S-box: {0,...,15} -> {0,...,15} bijeksiya. " +
      "Nochiziqlilik chiziqli va differentsial hujumlarga qarshi asosiy himoya beradi.",
  }]);

  questionBlock(2, "Chiziqli kriptotahlil qanday ishlaydi va maqsadi nima?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "Chiziqli kriptotahlil LAT = #{x: alpha*x = beta*S(x)} - 8 formulasi asosida " +
      "bias ni hisoblab, kuchli chiziqli korrelyatsiyalarni topadi. " +
      "Katta |bias| qiymatli (alpha, beta) juftliklari kalit bitlarini ochishda ishlatiladi. " +
      "Matsui AES ga qarshi hujumda bu usulni qo'llagan. " +
      "Himoya: NL (nochiziqlilik) yuqori bo'lishi kerak — ideal 4-bit S-box uchun NL = 4.",
  }]);

  questionBlock(3, "Differentsial kriptotahlil qanday ishlaydi?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "Biham va Shamir (1990) taklif qilgan usul: DX = X XOR X', DY = S(X) XOR S(X'). " +
      "DDT[DX][DY] = #{x: S(x XOR DX) XOR S(x) = DY} — bu juftlik qancha marta uchraydi. " +
      "Yuqori DDT qiymati differentsial zanjirni tuzishga imkon beradi. " +
      "Himoya: differentsial uniformlik <= 4 (AES S-box = 4, APN funksiya uchun = 2).",
  }]);

  questionBlock(4, "Kriptografik jihatdan yaxshi S-box qanday xususiyatlarga ega bo'lishi kerak?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "1) Yuqori nochiziqlilik (NL): max |LAT[a][b]| kichik (a,b != 0 uchun). Ideal 4-bit: NL = 4. " +
      "2) Past differentsial uniformlik: max DDT[DX][DY] kichik (DX != 0). Ideal: 2 (APN). " +
      "3) Balanslilik: bijeksiya bo'lishi shart. " +
      "4) SAC (Strict Avalanche Criterion): 1 bit o'zgarganda ~50% chiqish o'zgarishi. " +
      "5) BIC (Bit Independence Criterion): chiqish bitlari bir-biridan mustaqil.",
  }]);

  y += 4;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 4. AMALIY QISM ────────────────────────────────────────────════════════
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("4", "AMALIY QISM");

  // ── 4.1 S-box ─────────────────────────────────────────────────────────────
  subTitle("01", "S-box Tahlili", C.indigo700);
  {
    const a = opts.sboxAnalysis;
    need(10);
    bold(); ss(8); sc(C.slate500);
    doc.text("S-box qiymatlari (x = 0..F jadvalda):", ML, y); y += 7;
    sboxRow(a.sbox);

    // Stats
    const stats = [
      { lbl: "Nochiziqlilik (NL):", val: String(a.nonlinearity) },
      { lbl: "Maks. |LAT| bias:", val: String(a.maxAbsBias) },
      { lbl: "Differentsial uniformlik:", val: String(a.maxDiffUniformity) },
    ];
    const sH = 36;
    need(sH + 4);
    sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, sH, "FD");
    const c1 = ML + 6, c2 = ML + CW / 2 + 4;
    let py = y + 9;
    kvRow(stats[0].lbl, stats[0].val, c1, py, C.indigo600); py += 10;
    kvRow(stats[1].lbl, stats[1].val, c1, py, C.amber600);
    kvRow(stats[2].lbl, stats[2].val, c2, py, C.sky600); py += 10;
    italic(); ss(7.5); sc(a.nonlinearity >= 4 ? C.emerald600 : C.rose600);
    doc.text(a.nonlinearity >= 4 ? "Nochiziqlilik: Qabul qilinadi" : "Nochiziqlilik: Past (zaif)",
      c1, py);
    italic(); ss(7.5); sc(a.maxDiffUniformity <= 4 ? C.emerald600 : C.rose600);
    doc.text(a.maxDiffUniformity <= 4 ? "Diff. uniformlik: Qabul qilinadi" : "Diff. uniformlik: Yuqori (zaif)",
      c2, py);
    y += sH + 6;

    // Best linear / worst diff
    if (a.bestLinear) {
      need(10);
      kvRow("Eng kuchli chiziqli bog'liq:",
        `alpha=${a.bestLinear.alpha.toString(16).toUpperCase()} beta=${a.bestLinear.beta.toString(16).toUpperCase()} bias=${a.bestLinear.bias > 0 ? "+" : ""}${a.bestLinear.bias}`,
        ML, y, C.amber600); y += 8;
    }
    if (a.worstDiff) {
      need(10);
      kvRow("Eng yuqori differentsial:",
        `DX=${a.worstDiff.dx.toString(16).toUpperCase()} DY=${a.worstDiff.dy.toString(16).toUpperCase()} soni=${a.worstDiff.count}/16`,
        ML, y, C.sky600); y += 8;
    }
  }

  // ── 4.2 Chiziqli Tahlil ────────────────────────────────────────────────────
  subTitle("02", "Chiziqli Tahlil Natijasi", C.amber600);
  if (!opts.linearResult) {
    emptySection();
  } else {
    const l = opts.linearResult;
    const bH = 42;
    need(bH + 4);
    sf(C.amber50); sd(C.amber100); doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, bH, "FD");
    let ly = y + 9;
    kvRow("alpha (kiritish maskasi):", `${l.alpha.toString(16).toUpperCase()} = ${toBin(l.alpha)}`, ML + 5, ly, C.amber600); ly += 9;
    kvRow("beta  (chiqish maskasi):", `${l.beta.toString(16).toUpperCase()} = ${toBin(l.beta)}`, ML + 5, ly, C.violet600); ly += 9;
    kvRow("Mos x soni:", `${l.count} / 16`, ML + 5, ly, C.slate600);
    kvRow("Bias:", `${l.bias > 0 ? "+" : ""}${l.bias}`, ML + CW / 2 + 4, ly, l.bias === 0 ? C.emerald600 : C.amber600); ly += 9;
    kvRow("Ehtimollik:", `${l.count}/16 = ${l.probability.toFixed(4)}`, ML + 5, ly, C.sky700);
    y += bH + 4;
    need(10);
    italic(); ss(8); sc(C.slate500);
    doc.text(`Shart: alpha*x XOR beta*S(x) = 0   Mos x lar: {${l.matches.map((x) => x.toString(16).toUpperCase()).join(", ")}}`, ML, y);
    y += 8;
  }

  // ── 4.3 Differentsial Tahlil ───────────────────────────────────────────────
  subTitle("03", "Differentsial Tahlil Natijasi", C.rose600);
  if (!opts.diffResult) {
    emptySection();
  } else {
    const d = opts.diffResult;
    const dH = 56;
    need(dH + 4);
    sf(C.rose100); sd(C.rose600); doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, dH, "FD");
    let dy2 = y + 9;
    const c1 = ML + 5, c2 = ML + CW / 2 + 4;
    kvRow("X  =", `${d.x.toString(16).toUpperCase()} (${toBin(d.x)})`, c1, dy2, C.sky600);
    kvRow("X' =", `${d.xPrime.toString(16).toUpperCase()} (${toBin(d.xPrime)})`, c2, dy2, C.emerald600); dy2 += 10;
    kvRow("DX = X XOR X' =", `${d.dx.toString(16).toUpperCase()} (${toBin(d.dx)})`, c1, dy2, C.amber600); dy2 += 10;
    kvRow("S(X)  =", `${d.y.toString(16).toUpperCase()} (${toBin(d.y)})`, c1, dy2, C.sky600);
    kvRow("S(X') =", `${d.yPrime.toString(16).toUpperCase()} (${toBin(d.yPrime)})`, c2, dy2, C.emerald600); dy2 += 10;
    bold(); ss(9); sc(C.rose600);
    doc.text(`DY = S(X) XOR S(X') = ${d.dy.toString(16).toUpperCase()} (${toBin(d.dy)})`, c1, dy2); dy2 += 10;
    kvRow(`DDT[${d.dx.toString(16).toUpperCase()}][${d.dy.toString(16).toUpperCase()}] =`, `${d.ddtCount} / 16 = ${d.probability.toFixed(4)}`, c1, dy2, C.indigo700);
    y += dH + 5;
    italic(); ss(7.5); sc(d.probability <= 0.25 ? C.emerald600 : C.amber600);
    need(8);
    doc.text(
      d.probability <= 0.25
        ? `Differentsial ehtimollik past (${d.probability.toFixed(4)}) — S-box bu differentsialga chidamli.`
        : `Differentsial ehtimollik yuqori (${d.probability.toFixed(4)}) — bu juft differentsial hujumda ishlatilishi mumkin.`,
      ML, y
    );
    y += 8;
  }

  y += 4;
  need(8);
  italic(); ss(7.5); sc(C.slate400);
  doc.text("* Barcha hisoblashlar dasturiy amalga oshirilgan. PRESENT 4-bit S-box standart o'quv namunasi sifatida ishlatildi.", ML, y);

  footer();
  doc.save("kriptotahlil-3-topshiriq-sbox-temurbek-xaydarov.pdf");
}
