/**
 * PDF Report Generator — Kriptotahlil 2-topshiriq
 * RSA Algoritmi Kriptotahlili
 * Uses jsPDF (dynamically imported, client-side only).
 */

export interface RsaPDFOptions {
  // Key parameters
  p: number;
  q: number;
  e: number;
  n: number;
  phi: number;
  d: number;
  // Operation
  mode: "encrypt" | "decrypt";
  inputValue: number;
  outputValue: number;
  // Cryptoanalysis
  attackType?: "repeated" | "signature" | "chosen" | null;
  attackSummary?: string;
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

// ── Main export function ───────────────────────────────────────────────────────
export async function generateRsaLabPDF(opts: RsaPDFOptions): Promise<void> {
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

  const sc   = (c: RGB) => doc.setTextColor(...c);
  const sf   = (c: RGB) => doc.setFillColor(...c);
  const sd   = (c: RGB) => doc.setDrawColor(...c);
  const ss   = (n: number) => doc.setFontSize(n);
  const bold   = () => doc.setFont("helvetica", "bold");
  const normal = () => doc.setFont("helvetica", "normal");
  const italic = () => doc.setFont("helvetica", "italic");
  const mono   = () => doc.setFont("courier", "normal");
  const monob  = () => doc.setFont("courier", "bold");
  const wrap   = (s: string, w: number): string[] => doc.splitTextToSize(s, w);
  const tw     = (s: string): number => doc.getTextWidth(s);
  const textLines = (lines: string[], x: number, startY: number, lineH = LH) =>
    lines.forEach((ln, i) => doc.text(ln, x, startY + i * lineH));

  const footer = () => {
    const fy = PH - 10;
    sd(C.slate300); doc.setLineWidth(0.2);
    doc.line(ML, fy - 4, RX, fy - 4);
    normal(); ss(7.5); sc(C.slate400);
    doc.text("Kriptotahlil fanidan 2-topshiriq  |  RSA algoritmi kriptotahlili", ML, fy);
    doc.text(`${pageNo}-bet`, RX, fy, { align: "right" });
  };

  const need = (h: number) => {
    if (y + h > PH - 22) {
      footer();
      doc.addPage();
      pageNo++;
      y = 22;
    }
  };

  const sectionTitle = (n: string, title: string) => {
    need(18);
    y += 3;
    sf(C.indigo700); sd(C.indigo700);
    doc.rect(ML, y - 6, 3.5, 9.5, "F");
    bold(); ss(12); sc(C.indigo700);
    doc.text(`${n}. ${title}`, ML + 7, y);
    y += 2;
    sd(C.indigo200); doc.setLineWidth(0.4);
    doc.line(ML, y + 1, RX, y + 1);
    doc.setLineWidth(0.2);
    y += 8;
  };

  const subTitle = (badge: string, title: string, col: RGB) => {
    need(14);
    y += 2;
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
    const rendered = items.map((it) => {
      const lines = wrap(it.text, CW - 18);
      return { ...it, lines };
    });
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
      doc.text(r.tag, ML + 7, iy);
      iy += 5;
      normal(); ss(8.5); sc(C.slate700);
      r.lines.forEach((ln) => { doc.text(ln, ML + 7, iy); iy += 4.5; });
      iy += 4;
    }
    y += innerH + 5;
  };

  const kv = (label: string, val: string, x: number, ky: number, lCol: RGB = C.slate600) => {
    bold(); ss(8); sc(lCol);
    doc.text(label, x, ky);
    const kw = tw(label) + 2;
    mono(); ss(9); sc(C.slate900);
    doc.text(val, x + kw, ky);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // ── COVER HEADER ──────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sf(C.indigo700); doc.rect(0, 0, PW, 42, "F");
  sf(C.indigo600); doc.rect(0, 38, PW, 4, "F");

  bold(); ss(9); sc(C.indigo200);
  doc.text("TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI", PW / 2, 10, { align: "center" });
  bold(); ss(8); sc(C.indigo200);
  doc.text("Kriptotahlil fani  —  Laboratoriya ishi", PW / 2, 17, { align: "center" });

  bold(); ss(20); sc(C.white);
  doc.text("2-TOPSHIRIQ", PW / 2, 30, { align: "center" });
  normal(); ss(10); sc(C.indigo200);
  doc.text("RSA Algoritmi Kriptotahlili", PW / 2, 37, { align: "center" });

  // Student info bar
  sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.25);
  doc.rect(ML, 47, CW, 18, "FD");
  bold(); ss(8); sc(C.slate600);
  doc.text("Talaba:", ML + 4, 54);
  bold(); ss(9); sc(C.indigo700);
  doc.text("Temurbek Xaydarov", ML + 4 + tw("Talaba:") + 2, 54);
  bold(); ss(8); sc(C.slate600);
  doc.text("Fan:", ML + 4, 61);
  normal(); ss(8.5); sc(C.slate700);
  doc.text("Kriptotahlil  |  RSA algoritmi kriptotahlili", ML + 4 + tw("Fan:") + 2, 61);

  y = 72;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 1. MAQSAD ─────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("1", "MAQSAD");
  para(
    "Ushbu amaliy mashg'ulotda RSA (Rivest–Shamir–Adleman) ochiq kalitli kriptosistemasi " +
    "bilan tanishish, uning matematik asoslarini (modulli arifmetika, Euler funksiyasi, " +
    "kalit hosil qilish) o'rganish va shaxsiy kalit ma'lum bo'lmagan holatlarda " +
    "qo'llaniladigan kriptoanaliz usullarini amalda sinab ko'rish maqsad qilingan."
  );
  y += 2;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 2. NAZARIY QISM ───────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("2", "NAZARIY QISM");

  // A — RSA asoslari
  subTitle("A", "RSA algoritmi asoslari", C.sky600);
  para(
    "RSA ochiq kalitli kriptotizim bo'lib, ikkita katta tub son p va q asosida ishlaydi. " +
    "n = p·q modulni, φ(n) = (p−1)(q−1) Euler funksiyasini, e ochiq eksponentni, " +
    "d = e⁻¹ mod φ(n) shaxsiy kalitni ifodalaydi."
  );
  codeBox(
    "Shifrlash:   C = M^e mod n\n" +
    "Deshifrlash: M = C^d mod n\n" +
    "Kalit:       d·e ≡ 1 (mod φ(n))",
    C.slate100, C.indigo700
  );
  y += 2;

  // B — Takroriy shifrlash
  subTitle("B", "Takroriy shifrlash hujumi (kalitsiz ochish)", C.sky600);
  para(
    "Agar (e, n) va C ma'lum bo'lsa, quyidagi ketma-ketlikni hisoblang: " +
    "C₀ = C, Cⱼ = C_{j−1}^e mod n. Cⱼ = C bo'lganda sikl tugaydi. " +
    "M = C_{j−1} — ya'ni siklning oxirgi bosqichdagi qiymat ochiq matndir. " +
    "Bu usul faqat e ning ord_{λ(n)}(e) kichik bo'lganda samarali."
  );
  codeBox(
    "C₁ = C^e mod n\n" +
    "C₂ = C₁^e mod n\n" +
    "...  (j qadam)\n" +
    "Cⱼ = C  →  M = C_{j-1}",
    C.amber50, C.amber600
  );
  y += 2;

  // C — Notarius hujumi
  subTitle("C", "Notarius (ko'r imzo) hujumi", C.sky600);
  para(
    "Maqsad: notarius (imzochi)dan M xabarga imzo olish, lekin u M ni bevosita imzolamaslik. " +
    "1) Tasodifiy r tanlanadi (r < n, EKUB(r,n)=1). " +
    "2) y = r^e · M mod n hisoblanadi. " +
    "3) Notarius y ni imzolaydi: S_y = y^d mod n = r · M^d mod n. " +
    "4) Hujumchi: M^d = S_y · r⁻¹ mod n — bu M ning to'liq imzosi."
  );
  codeBox(
    "y = r^e * M mod n          (notariusga yuboriladi)\n" +
    "S_y = y^d mod n           (notarius imzo qaytaradi)\n" +
    "M^d = S_y * r^(-1) mod n  (hujumchi hisoblaydi)",
    C.indigo50, C.indigo700
  );
  y += 2;

  // D — Tanlangan shifrmatn
  subTitle("D", "Tanlangan shifrmatn hujumi", C.sky600);
  para(
    "Maqsad: C = M^e mod n shifrmatan egaliga M ni oshkor qilish. " +
    "1) Tasodifiy r tanlanadi (r < n, EKUB(r,n)=1). " +
    "2) x = r^e mod n, C' = x·C mod n = (rM)^e mod n hisoblanadi. " +
    "3) Deshifrlash orakuli C' ni ochadi: M' = C'^d = rM mod n. " +
    "4) Hujumchi: M = M' · r⁻¹ mod n."
  );
  codeBox(
    "x = r^e mod n                   (r ni yashiradi)\n" +
    "C' = x * C mod n = (rM)^e mod n (oraculega yuboriladi)\n" +
    "M' = C'^d mod n = rM mod n      (orakuldan)\n" +
    "M  = M' * r^(-1) mod n          (hujumchi hisoblaydi)",
    C.emerald100, C.emerald600
  );
  y += 4;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 3. NAZORAT SAVOLLARI ──────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("3", "NAZORAT SAVOLLARI");

  questionBlock(1, "RSA algoritmida n, φ(n), e va d parametrlari nimani ifodalaydi?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "n = p·q — modul (ochiq). φ(n) = (p−1)(q−1) — Euler funksiyasi (maxfiy). " +
      "e — ochiq eksponent (EKUB(e,φ(n))=1 shartni qanoatlantirishi kerak). " +
      "d = e⁻¹ mod φ(n) — shaxsiy kalit. Ochiq kalit: (e,n). Shaxsiy kalit: (d,n).",
  }]);

  questionBlock(2, "Takroriy shifrlash hujumi qachon muvaffaqiyatli bo'ladi?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "Hujum muvaffaqiyatli bo'lishi uchun e ning n modulida Karmaikl funksiyasi λ(n) " +
      "bo'yicha tartibi (ord_{λ(n)}(e)) nisbatan kichik bo'lishi kerak. " +
      "Aks holda sikl juda uzun bo'lib, hujum amaliy jihatdan imkonsiz bo'ladi.",
  }]);

  questionBlock(3, "Ko'r imzo hujumidan qanday himoyalanish mumkin?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "Himoya usullari: 1) Imzodan oldin xabarga hash qo'llash (M → H(M)). " +
      "2) Deterministic padding sxemalari (PSS). " +
      "3) Imzolashdan oldin xabar mazmunini tekshirish. " +
      "RSA-PKCS#1 v2.1 (OAEP/PSS) standartlari bu hujumga chidamli.",
  }]);

  questionBlock(4, "Tanlangan shifrmatn hujumini qanday oldini olish mumkin?");
  answerBlock([{
    tag: "Javob:",
    tagColor: C.indigo700,
    text:
      "Himoya: OAEP (Optimal Asymmetric Encryption Padding) yoki IND-CCA2 xususiyatiga " +
      "ega bo'lgan sxemalardan foydalanish. Darchali deshifrlash orakulidan foydalanishni " +
      "cheklash. Plain RSA (textbook RSA) hech qachon real tizimda ishlatilmasligi kerak.",
  }]);

  y += 4;

  // ════════════════════════════════════════════════════════════════════════════
  // ── 4. AMALIY QISM ────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  sectionTitle("4", "AMALIY QISM");

  // Key parameters summary box
  const paramH = 52;
  need(paramH + 4);
  sf(C.sky50); sd(C.sky200); doc.setLineWidth(0.25);
  doc.rect(ML, y, CW, paramH, "FD");

  bold(); ss(8); sc(C.sky700);
  doc.text("RSA KALIT PARAMETRLARI", ML + 5, y + 7);

  const col1 = ML + 5;
  const col2 = ML + CW / 2 + 4;
  let py = y + 15;
  kv("p =", String(opts.p),   col1, py, C.rose600);
  kv("q =", String(opts.q),   col2, py, C.rose600);
  py += 9;
  kv("n = p·q =",  String(opts.n),   col1, py, C.sky700);
  kv("φ(n) =",     String(opts.phi), col2, py, C.sky700);
  py += 9;
  kv("e =", String(opts.e),   col1, py, C.amber600);
  kv("d =", String(opts.d),   col2, py, C.amber600);
  py += 9;
  italic(); ss(7.5); sc(C.sky600);
  doc.text("Ochiq kalit: (e, n)   |   Shaxsiy kalit: (d, n)", col1, py);

  y += paramH + 8;

  // Operation result
  const modeLabel  = opts.mode === "encrypt" ? "Shifrlash" : "Deshifrlash";
  const inputLabel = opts.mode === "encrypt" ? "Ochiq matn M" : "Shifrmatn C";
  const outLabel   = opts.mode === "encrypt" ? "Shifrmatn C" : "Ochiq matn M";
  const formula    = opts.mode === "encrypt"
    ? `C = M^e mod n = ${opts.inputValue}^${opts.e} mod ${opts.n} = ${opts.outputValue}`
    : `M = C^d mod n = ${opts.inputValue}^${opts.d} mod ${opts.n} = ${opts.outputValue}`;

  bold(); ss(9); sc(C.slate500);
  doc.text("HISOBLASH NATIJASI:", ML, y);
  y += 7;

  const resH = 36;
  need(resH + 2);
  sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.2);
  doc.rect(ML, y, CW, resH, "FD");
  let ry = y + 8;
  kv("Rejim:", modeLabel, ML + 5, ry, C.indigo700);
  kv(inputLabel + ":", String(opts.inputValue), ML + CW / 2 + 4, ry, C.slate600);
  ry += 9;
  monob(); ss(9); sc(C.sky700);
  doc.text(formula, ML + 5, ry);
  ry += 9;
  kv(outLabel + ":", String(opts.outputValue), ML + 5, ry, C.emerald600);

  y += resH + 8;

  // Cryptoanalysis section if present
  if (opts.attackType && opts.attackSummary) {
    const attackLabels: Record<string, string> = {
      repeated: "Takroriy shifrlash hujumi natijalari",
      signature: "Notarius (ko'r imzo) hujumi natijalari",
      chosen: "Tanlangan shifrmatn hujumi natijalari",
    };
    bold(); ss(9); sc(C.slate500);
    doc.text("KRIPTOANALIZ NATIJALARI:", ML, y);
    y += 7;
    subTitle("►", attackLabels[opts.attackType] ?? "Hujum natijalari", C.sky600);
    const aLines = wrap(opts.attackSummary, CW - 10);
    const aH = aLines.length * 4.5 + 10;
    need(aH + 2);
    sf(C.sky50); sd(C.sky200); doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, aH, "FD");
    mono(); ss(8); sc(C.slate900);
    aLines.forEach((ln, i) => doc.text(ln, ML + 5, y + 6 + i * 4.5));
    y += aH + 6;
  }

  y += 4;
  need(8);
  italic(); ss(7.5); sc(C.slate400);
  doc.text("* Barcha hisoblashlar dasturiy amalga oshirilgan. Katta sonlar uchun qo'lda tekshirish tavsiya etilmaydi.", ML, y);

  footer();
  doc.save("kriptotahlil-2-topshiriq-temurbek-xaydarov.pdf");
}

// ════════════════════════════════════════════════════════════════════════════
// ── Combined (all-sections) PDF export ────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

export interface CombinedEncryptData {
  inputMode: "number" | "text";
  // number mode
  inputValue?: number;
  outputValue?: number;
  // text mode
  originalText?: string;
  asciiCodes?: number[];
  encrypted?: number[];
}

export interface CombinedDecryptData {
  inputMode: "number" | "text";
  inputValue?: number;
  outputValue?: number;
  // text mode
  cipherNums?: number[];
  decryptedCodes?: number[];
  decodedText?: string;
}

export interface CombinedAttackData {
  type: "repeated" | "signature" | "chosen";
  summary: string;
  found: boolean;
}

export interface CombinedRsaPDFOptions {
  key: { p: number; q: number; e: number; n: number; phi: number; d: number };
  encrypt?: CombinedEncryptData;
  decrypt?: CombinedDecryptData;
  attack?: CombinedAttackData;
}

export async function generateCombinedRsaPDF(opts: CombinedRsaPDFOptions): Promise<void> {
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
    doc.text("Kriptotahlil — 2-topshiriq  |  RSA To'liq Laboratoriya Hisoboti", ML, fy);
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

  const resultBox = (label: string, content: string, bg: RGB, fg: RGB, border: RGB) => {
    const lines = wrap(content, CW - 10);
    const h = lines.length * 5 + 10;
    need(h + 4);
    bold(); ss(8); sc(C.slate600);
    doc.text(label, ML, y); y += 5;
    sf(bg); sd(border); doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, h, "FD");
    monob(); ss(8.5); sc(fg);
    textLines(lines, ML + 5, y + 6, 5);
    y += h + 5;
  };

  const asciiGrid = (codes: number[], labelFn: (c: number) => string, accent: RGB) => {
    // Render up to 32 per row in a compact grid
    const perRow = 16;
    const cellW  = Math.min(CW / perRow, 11);
    const rows   = Math.ceil(codes.length / perRow);
    const gridH  = rows * 12 + 4;
    need(gridH + 4);
    for (let r = 0; r < rows; r++) {
      const slice = codes.slice(r * perRow, (r + 1) * perRow);
      slice.forEach((code, ci) => {
        const cx = ML + ci * cellW;
        const cy = y + r * 12;
        // char label
        bold(); ss(7); sc(accent);
        doc.text(labelFn(code), cx + cellW / 2, cy + 5, { align: "center" });
        // code number
        normal(); ss(6); sc(C.slate500);
        doc.text(String(code), cx + cellW / 2, cy + 10, { align: "center" });
      });
    }
    y += gridH + 3;
  };

  // ── Cover ─────────────────────────────────────────────────────────────────
  sf(C.indigo700); doc.rect(0, 0, PW, 42, "F");
  sf(C.indigo600); doc.rect(0, 38, PW, 4, "F");
  bold(); ss(9); sc(C.indigo200);
  doc.text("TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI", PW / 2, 10, { align: "center" });
  bold(); ss(8); sc(C.indigo200);
  doc.text("Kriptotahlil fani  —  2-topshiriq  |  RSA Algoritmi Kriptotahlili", PW / 2, 17, { align: "center" });
  bold(); ss(18); sc(C.white);
  doc.text("TO'LIQ LABORATORIYA HISOBOTI", PW / 2, 30, { align: "center" });
  normal(); ss(9); sc(C.indigo200);
  doc.text("Shifrlash · Deshifrlash · Kriptoanaliz", PW / 2, 37, { align: "center" });

  // Student info bar
  sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.25);
  doc.rect(ML, 47, CW, 18, "FD");
  bold(); ss(8); sc(C.slate600); doc.text("Talaba:", ML + 4, 54);
  bold(); ss(9); sc(C.indigo700);
  doc.text("Temurbek Xaydarov", ML + 4 + tw("Talaba:") + 2, 54);
  bold(); ss(8); sc(C.slate600); doc.text("Fan:", ML + 4, 61);
  normal(); ss(8.5); sc(C.slate700);
  doc.text("Kriptotahlil  |  2-topshiriq — RSA algoritmi kriptotahlili", ML + 4 + tw("Fan:") + 2, 61);

  y = 72;

  // ── Section 1: Key parameters ─────────────────────────────────────────────
  sectionTitle("1", "RSA KALIT PARAMETRLARI");
  const kH = 40;
  need(kH + 2);
  sf(C.sky50); sd(C.sky200); doc.setLineWidth(0.2);
  doc.rect(ML, y, CW, kH, "FD");
  const c1 = ML + 5, c2 = ML + CW / 2 + 4;
  let py = y + 10;
  kvRow("p =", String(opts.key.p), c1, py, C.rose600);
  kvRow("q =", String(opts.key.q), c2, py, C.rose600);
  py += 10;
  kvRow("n = p·q =", String(opts.key.n), c1, py, C.sky700);
  kvRow("φ(n) =", String(opts.key.phi), c2, py, C.sky700);
  py += 10;
  kvRow("e =", String(opts.key.e), c1, py, C.amber600);
  kvRow("d =", String(opts.key.d), c2, py, C.amber600);
  y += kH + 8;

  // ── Section 2: Shifrlash ──────────────────────────────────────────────────
  sectionTitle("2", "SHIFRLASH NATIJASI", C.indigo700);
  if (!opts.encrypt) {
    emptySection();
  } else if (opts.encrypt.inputMode === "number") {
    need(12);
    kvRow("Kirish (M):", String(opts.encrypt.inputValue ?? "—"), ML, y, C.slate600); y += 7;
    kvRow("Natija (C):", String(opts.encrypt.outputValue ?? "—"), ML, y, C.emerald600); y += 7;
    need(10);
    italic(); ss(8); sc(C.slate500);
    doc.text(
      `${opts.encrypt.inputValue}^${opts.key.e} mod ${opts.key.n} = ${opts.encrypt.outputValue}`,
      ML, y
    );
    y += 8;
  } else {
    // text mode
    if (opts.encrypt.originalText) {
      resultBox("Asl matn:", opts.encrypt.originalText, C.slate50, C.slate900, C.slate200);
    }
    if (opts.encrypt.asciiCodes && opts.encrypt.asciiCodes.length > 0) {
      need(10);
      bold(); ss(8); sc(C.indigo600);
      doc.text("Raqamli ko'rinish (ASCII):", ML, y); y += 6;
      asciiGrid(
        opts.encrypt.asciiCodes,
        (c) => c >= 32 && c < 127 ? String.fromCharCode(c) : "?",
        C.indigo600,
      );
    }
    if (opts.encrypt.encrypted && opts.encrypt.encrypted.length > 0) {
      resultBox(
        "Shifrlangan natija:",
        opts.encrypt.encrypted.join("  "),
        C.slate100, C.indigo700, C.indigo200,
      );
    }
  }

  // ── Section 3: Deshifrlash ────────────────────────────────────────────────
  sectionTitle("3", "DESHIFRLASH NATIJASI", C.sky700);
  if (!opts.decrypt) {
    emptySection();
  } else if (opts.decrypt.inputMode === "number") {
    need(12);
    kvRow("Kirish (C):", String(opts.decrypt.inputValue ?? "—"), ML, y, C.slate600); y += 7;
    kvRow("Natija (M):", String(opts.decrypt.outputValue ?? "—"), ML, y, C.emerald600); y += 7;
    need(10);
    italic(); ss(8); sc(C.slate500);
    doc.text(
      `${opts.decrypt.inputValue}^${opts.key.d} mod ${opts.key.n} = ${opts.decrypt.outputValue}`,
      ML, y
    );
    y += 8;
  } else {
    // text mode
    if (opts.decrypt.cipherNums && opts.decrypt.cipherNums.length > 0) {
      resultBox(
        "Shifrlangan raqamlar:",
        opts.decrypt.cipherNums.join("  "),
        C.slate100, C.slate600, C.slate200,
      );
    }
    if (opts.decrypt.decryptedCodes && opts.decrypt.decryptedCodes.length > 0) {
      need(10);
      bold(); ss(8); sc(C.sky600);
      doc.text("Deshifrlangan ASCII kodlar:", ML, y); y += 6;
      asciiGrid(
        opts.decrypt.decryptedCodes,
        (c) => c >= 32 && c < 127 ? String.fromCharCode(c) : "?",
        C.sky600,
      );
    }
    if (opts.decrypt.decodedText) {
      resultBox("Ochiq matn:", opts.decrypt.decodedText, C.emerald100, C.emerald600, C.emerald100);
    }
  }

  // ── Section 4: Kriptoanaliz ────────────────────────────────────────────────
  const attackLabels: Record<string, string> = {
    repeated:  "Takroriy shifrlash hujumi",
    signature: "Notarius (ko'r imzo) hujumi",
    chosen:    "Tanlangan shifrmatn hujumi",
  };
  sectionTitle("4", "KRIPTOANALIZ NATIJALARI", C.amber600);
  if (!opts.attack) {
    emptySection();
  } else {
    need(12);
    bold(); ss(9); sc(C.amber600);
    doc.text(`Hujum turi: ${attackLabels[opts.attack.type] ?? opts.attack.type}`, ML, y); y += 7;
    const statusColor = opts.attack.found ? C.emerald600 : C.rose600;
    bold(); ss(8.5); sc(statusColor);
    doc.text(opts.attack.found ? "Natija: Muvaffaqiyatli" : "Natija: Topilmadi", ML, y); y += 7;
    const sumLines = wrap(opts.attack.summary, CW - 10);
    const sumH = sumLines.length * 5 + 10;
    need(sumH + 2);
    sf(opts.attack.found ? C.emerald100 : C.rose100);
    sd(opts.attack.found ? C.emerald600 : C.rose600);
    doc.setLineWidth(0.2);
    doc.rect(ML, y, CW, sumH, "FD");
    mono(); ss(8); sc(C.slate900);
    textLines(sumLines, ML + 5, y + 6, 5);
    y += sumH + 6;
  }

  y += 4;
  need(8);
  italic(); ss(7.5); sc(C.slate400);
  doc.text("* Barcha hisoblashlar dasturiy amalga oshirilgan. Katta sonlar uchun qo'lda tekshirish tavsiya etilmaydi.", ML, y);

  footer();
  doc.save("kriptotahlil-2-topshiriq-tolik-hisobot-temurbek-xaydarov.pdf");
}
