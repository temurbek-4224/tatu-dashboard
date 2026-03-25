/**
 * PDF Report Generator — Kriptotahlil 1-topshiriq
 * Uses jsPDF (dynamically imported, client-side only).
 * Generates a complete academic lab report in A4 format.
 */

import type { CipherResults } from "@/lib/ciphers";
import type { CryptoanalysisData } from "@/lib/cryptoanalysis";

export interface PDFExportOptions {
  inputText: string;
  caesarKey: number;
  vigenereKey: string;
  results: CipherResults;
  mode: "encrypt" | "decrypt" | "analyze";
  cryptoAnalysis?: CryptoanalysisData;
}

// ── Colour palette ─────────────────────────────────────────────────────────────
type RGB = [number, number, number];
const C = {
  indigo700: [67,  56,  202] as RGB,
  indigo600: [79,  70,  229] as RGB,
  indigo300: [165, 180, 252] as RGB,
  indigo200: [199, 210, 254] as RGB,
  indigo100: [224, 231, 255] as RGB,
  indigo50:  [238, 242, 255] as RGB,
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
  emerald600:[5,   150, 105] as RGB,
  emerald100:[209, 250, 229] as RGB,
  violet600: [124, 58,  237] as RGB,
  violet200: [221, 214, 254] as RGB,
  violet100: [237, 233, 254] as RGB,
  violet50:  [245, 243, 255] as RGB,
  amber200:  [253, 230, 138] as RGB,
  sky700:    [3,   105, 161] as RGB,
  sky600:    [2,   132, 199] as RGB,
  sky200:    [186, 230, 253] as RGB,
  sky50:     [240, 249, 255] as RGB,
  white:     [255, 255, 255] as RGB,
};

// ── Main export function ───────────────────────────────────────────────────────
export async function generateLabPDF(opts: PDFExportOptions): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW   = 210;
  const PH   = 297;
  const ML   = 18;          // left margin
  const MR   = 18;          // right margin
  const RX   = PW - MR;    // right boundary
  const CW   = RX - ML;    // content width (174 mm)
  const LH   = 5;           // standard line height (mm)
  let y      = 0;
  let pageNo = 1;

  // ── Low-level helpers ──────────────────────────────────────────────────────
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

  // Render array of strings with a custom line height
  const textLines = (lines: string[], x: number, startY: number, lineH = LH) =>
    lines.forEach((ln, i) => doc.text(ln, x, startY + i * lineH));

  // ── Page footer ────────────────────────────────────────────────────────────
  const footer = () => {
    const fy = PH - 10;
    sd(C.slate300); doc.setLineWidth(0.2);
    doc.line(ML, fy - 4, RX, fy - 4);
    normal(); ss(7.5); sc(C.slate400);
    doc.text("Kriptotahlil fanidan 1-topshiriq  |  Klassik shifrlarni kriptoanalizi", ML, fy);
    doc.text(`${pageNo}-bet`, RX, fy, { align: "right" });
  };

  // Add new page when content would overflow
  const need = (h: number) => {
    if (y + h > PH - 22) {
      footer();
      doc.addPage();
      pageNo++;
      y = 22;
    }
  };

  // ── Section heading with indigo bar ───────────────────────────────────────
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

  // ── Sub-heading (2.1 style) ────────────────────────────────────────────────
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

  // ── Body paragraph ─────────────────────────────────────────────────────────
  const para = (text: string, indent = 0, col: RGB = C.slate700) => {
    normal(); ss(9); sc(col);
    const lines = wrap(text, CW - indent);
    need(lines.length * LH + 2);
    textLines(lines, ML + indent, y);
    y += lines.length * LH + 2;
  };

  // ── Monospaced formula box ─────────────────────────────────────────────────
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

  // ── Question block (indigo banner) ─────────────────────────────────────────
  const questionBlock = (n: number, q: string) => {
    const qLines = wrap(q, CW - 22);
    const qH = qLines.length * 5 + 10;
    need(qH + 2);
    // Banner background
    sf(C.indigo50); sd(C.indigo100);
    doc.rect(ML, y, CW, qH, "FD");
    // Number badge
    sf(C.indigo700); sd(C.indigo700);
    doc.rect(ML, y, 10, qH, "F");
    bold(); ss(12); sc(C.white);
    doc.text(String(n), ML + 5, y + qH / 2 + 1.5, { align: "center" });
    // Question text
    bold(); ss(9.5); sc(C.slate900);
    textLines(qLines, ML + 14, y + 6);
    y += qH + 4;
  };

  // ── Answer block (light grey card with left strip) ─────────────────────────
  const answerBlock = (
    items: Array<{ tag: string; tagColor: RGB; text: string }>
  ) => {
    // Pre-calculate total height
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
      textLines(r.lines, ML + 10, iy, 4.5);
      iy += r.lines.length * 4.5 + 5;
    }
    y += innerH + 4;
  };

  // ── Practical result row ───────────────────────────────────────────────────
  const resultRow = (label: string, value: string, accent: RGB, noData: boolean) => {
    const LABEL_COL = 48; // fixed label column width (mm)
    const displayVal = noData ? "Ma'lumot kiritilmagan" : value;
    const valLines   = wrap(displayVal, CW - LABEL_COL - 10);
    const rowH       = Math.max(14, valLines.length * 4.5 + 8);

    need(rowH + 3);
    // Card background
    sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.25);
    doc.rect(ML, y, CW, rowH, "FD");
    doc.setLineWidth(0.2);
    // Left accent stripe
    sf(accent); sd(accent);
    doc.rect(ML, y, 4, rowH, "F");
    // Vertical divider
    sd(C.slate200); doc.setLineWidth(0.2);
    doc.line(ML + LABEL_COL, y + 2, ML + LABEL_COL, y + rowH - 2);

    const midY = y + rowH / 2 + 1.5;

    // Label
    bold(); ss(8.5); sc(accent);
    doc.text(label, ML + 8, midY);

    // Value
    const startValY = midY - ((valLines.length - 1) * 4.5) / 2;
    if (noData) {
      italic(); ss(8.5); sc(C.slate400);
    } else {
      mono(); ss(8); sc(C.slate900);
    }
    textLines(valLines, ML + LABEL_COL + 4, startValY, 4.5);

    y += rowH + 3;
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // ── PAGE 1 HEADER ─────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  sf(C.indigo700); sd(C.indigo700);
  doc.rect(0, 0, PW, 50, "F");
  sf(C.indigo600);
  doc.rect(0, 46, PW, 4, "F");

  bold(); ss(14); sc(C.white);
  doc.text("KRIPTOTAHLIL FANIDAN LABORATORIYA ISHI", PW / 2, 16, { align: "center" });

  normal(); ss(10.5); sc(C.indigo200);
  doc.text("1-topshiriq: Klassik shifrlarni kriptoanalizi", PW / 2, 28, { align: "center" });

  ss(8); sc(C.indigo300);
  doc.text("#kr-01", PW / 2, 38, { align: "center" });

  // ── Meta bar ──────────────────────────────────────────────────────────────
  sf(C.indigo50); sd(C.indigo100); doc.setLineWidth(0.3);
  doc.rect(ML, 55, CW, 16, "FD");
  doc.setLineWidth(0.2);

  const dateStr = new Date().toLocaleDateString("uz-UZ", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });

  const metaCols = [
    { label: "Talaba:",  value: "Temurbek Xaydarov" },
    { label: "Fan:",     value: "Kriptotahlil" },
    { label: "Sana:",    value: dateStr },
  ];
  const colW = CW / 3;
  metaCols.forEach((col, i) => {
    const cx = ML + i * colW + 4;
    bold(); ss(7.5); sc(C.indigo700);
    doc.text(col.label, cx, 62);
    normal(); ss(9.5); sc(C.slate900);
    doc.text(col.value, cx, 68);
  });

  y = 82;

  // ══════════════════════════════════════════════════════════════════════════════
  // ── 1. MAQSAD ─────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  sectionTitle("1", "MAQSAD");

  para(
    "Ushbu amaliy mashg'ulotda klassik shifrlarni — Atbash, Sezar (Caesar), " +
    "Polibey kvadrati va Vijiner (Vigenere) — kriptoanaliz qilish bo'yicha " +
    "nazariy bilimlarga ega bo'lish va ularni dasturiy tarzda amalga oshirish " +
    "ko'nikmalarini shakllantirish maqsad qilingan."
  );
  y += 3;

  // ══════════════════════════════════════════════════════════════════════════════
  // ── 2. NAZARIY QISM ───────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  sectionTitle("2", "NAZARIY QISM");

  // 2.1 Atbash
  subTitle("01", "Atbash shifri", C.rose600);
  para(
    "Eng qadimiy shifr usullaridan biri. Har bir harf alifboning teskari " +
    "tartibidagi harfiga almashtiriladi: A<->Z, B<->Y, C<->X, ... " +
    "Kalit talab qilinmaydi (self-inverse). Brute-force uchun faqat 1 ta variant.",
    4
  );
  codeBox(
    "Formula:  C = (n - 1) - i    [ n = alifbo uzunligi, i = harf indeksi (0 dan boshlab) ]",
    C.rose100, C.rose600
  );
  para("Misol: HELLO -> SVOOL", 4, C.slate500);
  y += 2;

  // 2.2 Caesar
  subTitle("02", "Sezar (Caesar) shifri", C.amber600);
  para(
    "Har bir harf alifboda k ta pozitsiya oldinga suriladi. " +
    "Yagona kalit: k siljish miqdori. Lotin alifbosi uchun k = 1...25 " +
    "(25 ta mumkin variant). Kriptoanaliz: brute-force yoki chastotaviy tahlil.",
    4
  );
  codeBox(
    "Shifrlash:   C = (P + k) mod 26    |    Deshifrlash:  P = (C - k) mod 26",
    C.amber100, C.amber600
  );
  para("Misol (k=3): A->D, B->E, ..., X->A, Y->B, Z->C. HELLO -> KHOOR", 4, C.slate500);
  y += 2;

  // 2.3 Polibey
  subTitle("03", "Polibey kvadrati", C.emerald600);
  para(
    "Harflar 5x5 jadvalda joylashtiriladi; I va J bitta katakni egallaydi (25 harf). " +
    "Har bir harf (satr, ustun) koordinatlar juftligi bilan ifodalanadi. " +
    "Bo'shliqlar '/' belgisi bilan almashtiriladi.",
    4
  );
  codeBox(
    "Misol:  H=23  E=15  L=31  L=31  O=34    =>    HELLO  ->  23 15 31 31 34",
    C.emerald100, C.emerald600
  );
  para(
    "Kriptoanaliz: digraf chastota tahlili — keng tarqalgan koordinat juftlari " +
    "tildagi umumiy harflarga mos keladi.",
    4, C.slate500
  );
  y += 2;

  // 2.4 Vigenere
  subTitle("04", "Vijiner (Vigenere) shifri", C.violet600);
  para(
    "Ko'p alifboli siljish shifri. Kalit so'z takrorlanib matn uzunligiga " +
    "yetkaziladi. Har bir harf shu pozitsiyadagi kalit harfi qiymatiga ko'ra " +
    "siljitiladi. Caesar shifridan ancha murakkab — oddiy chastota tahlili ishlamaydi.",
    4
  );
  codeBox(
    "C_i = (P_i + K_(i mod m)) mod 26    |    m = kalit uzunligi",
    C.violet100, C.violet600
  );
  para(
    "Misol (kalit=KEY): H+K=R, E+E=I, L+Y=J, L+K=V, O+E=S  =>  HELLO -> RIJVS",
    4, C.slate500
  );
  para(
    "Kriptoanaliz: (1) Kasiski testi: kalit uzunligini topadi; " +
    "(2) IC indeksi: tasdiqlaydi; " +
    "(3) Chastota tahlili: har pozitsiyani alohida Caesar sifatida yechadi.",
    4, C.slate500
  );
  y += 4;

  // ══════════════════════════════════════════════════════════════════════════════
  // ── 3. NAZORAT SAVOLLARI ──────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  sectionTitle("3", "NAZORAT SAVOLLARI");

  // Q1
  questionBlock(1, "Caesar va Atbash usullarida nechta variant bilan ochish mumkin?");
  answerBlock([
    {
      tag: "A — Atbash shifri: 1 ta variant",
      tagColor: C.rose600,
      text:
        "Atbash da kalit mavjud emas — har doim alifboning teskari tartibi " +
        "ishlatiladi (A<->Z, B<->Y, ...). Shuning uchun faqat bitta deshifrlash " +
        "varianti mavjud. Algoritmni o'zini qayta qo'llash deshifrlash hisoblanadi " +
        "(self-inverse xususiyati).",
    },
    {
      tag: "B — Caesar shifri: 25 ta variant (lotin) | 31 ta variant (o'zbek)",
      tagColor: C.amber600,
      text:
        "Kalit k qiymati 1 dan 25 gacha bo'lishi mumkin (k=0 asl matnni beradi). " +
        "Kriptoanalitik har bir k uchun deshifrlashni sinab ko'radi — to'liq " +
        "qidiruv (brute-force) usuli. Kompyuter uchun bir soniyada bajariladi. " +
        "O'zbek alifbosi (32 harf) uchun esa 31 ta variant tekshiriladi.",
    },
  ]);
  y += 3;

  // Q2
  questionBlock(2, "Polibey va Vigenere usullarini kalitsiz qanday tahlil qilish mumkin?");
  answerBlock([
    {
      tag: "P — Polibey kvadrati: Digraf chastota tahlili",
      tagColor: C.emerald600,
      text:
        "Polibey shifrmatni raqam juftlaridan iborat. Tabiiy tilda ba'zi harflar " +
        "(inglizchada E, T, A; o'zbekchada A, I, N) boshqalarga nisbatan ko'proq " +
        "uchraydi. Shifrmatnda tez-tez uchraydigan koordinat juftlari shu harflarga " +
        "mos kelishi ehtimoliy. Jadval (5x5) tuzilmasi ma'lum bo'lgani uchun " +
        "koordinatlarni chastota asosida tartiblash orqali jadvalni to'liq tiklash mumkin.",
    },
    {
      tag: "V — Vigenere shifri: Kasiski testi + Chastota tahlili",
      tagColor: C.violet600,
      text:
        "1) Kasiski testi: shifrmatnda takrorlanuvchi bo'laklar topiladi; ularning " +
        "orasidagi masofalar kalit uzunligining ko'paytmasi — EKUB kalit uzunligini beradi. " +
        "2) Index of Coincidence (IC): kalit uzunligini aniqlashning qo'shimcha usuli. " +
        "3) Chastota tahlili: kalit uzunligi m ma'lum bo'lsa, shifrmatn m ta guruhga " +
        "bo'linadi; har biri alohida Caesar shifri sifatida chastotaviy tahlil qilinadi.",
    },
  ]);
  y += 4;

  // ══════════════════════════════════════════════════════════════════════════════
  // ── 4. AMALIY QISM ────────────────────────────────────────────════════════
  // ══════════════════════════════════════════════════════════════════════════════
  sectionTitle("4", "AMALIY QISM");

  const modeLabel =
    opts.mode === "encrypt" ? "Shifrlash" :
    opts.mode === "decrypt" ? "Deshifrlash" : "Kriptoanaliz";

  if (opts.mode !== "analyze") {
    // ── Encrypt / Decrypt mode ──────────────────────────────────────────────
    const hasResults = opts.results.atbash !== "" || opts.results.caesar !== "";

    // Parameters summary box
    const paramH = 34;
    need(paramH + 2);
    sf(C.slate50); sd(C.slate200); doc.setLineWidth(0.25);
    doc.rect(ML, y, CW, paramH, "FD");
    doc.setLineWidth(0.2);

    const paramLeft  = ML + 5;
    const paramRight = ML + CW / 2 + 4;
    let py = y + 7;

    const paramKV = (key: string, val: string, x: number, vy: number, keyCol: RGB = C.slate600, mono_ = false) => {
      bold(); ss(8); sc(keyCol);
      doc.text(key, x, vy);
      const kw = tw(key) + 2;
      if (mono_) mono(); else normal();
      ss(9); sc(C.slate900);
      doc.text(val, x + kw, vy);
    };

    paramKV("Rejim:",          modeLabel,                paramLeft,  py, C.indigo700);
    paramKV("Sezar kaliti:",   `k = ${opts.caesarKey}`,  paramRight, py, C.amber600);
    py += 9;
    paramKV("Kirish matni:",   opts.inputText || "—",    paramLeft,  py, C.slate700, true);
    py += 9;
    paramKV("Vijiner kaliti:", opts.vigenereKey || "KEY", paramRight, py - 9, C.violet600, true);

    y += paramH + 6;

    bold(); ss(9); sc(C.slate500);
    doc.text("NATIJALAR:", ML, y);
    y += 7;

    resultRow("01  Atbash shifri",                            opts.results.atbash,   C.rose600,    !hasResults);
    resultRow("02  Sezar shifri  (k=" + opts.caesarKey + ")", opts.results.caesar,   C.amber600,   !hasResults);
    resultRow("03  Polibey kvadrati",                         opts.results.polibey,  C.emerald600, !hasResults);
    resultRow("04  Vijiner  (kalit: " + (opts.vigenereKey || "KEY") + ")", opts.results.vigenere, C.violet600, !hasResults);

    y += 6;
    need(8);
    italic(); ss(7.5); sc(C.slate400);
    doc.text(
      "* Natijalar dasturiy hisoblangan. Qo'lda tekshirish tavsiya etiladi.",
      ML, y
    );
  } else {
    // ── Kriptoanaliz mode ───────────────────────────────────────────────────
    const ca = opts.cryptoAnalysis;

    // Info box
    const infoH = 22;
    need(infoH + 2);
    sf(C.sky50); sd(C.sky200); doc.setLineWidth(0.25);
    doc.rect(ML, y, CW, infoH, "FD");
    bold(); ss(8); sc(C.sky700);
    doc.text("Rejim:", ML + 5, y + 8);
    normal(); ss(9); sc(C.slate900);
    doc.text(modeLabel, ML + 5 + tw("Rejim:") + 2, y + 8);
    if (ca) {
      const cipherNames: Record<string, string> = {
        atbash: "Atbash shifri", caesar: "Sezar shifri",
        polibey: "Polibey kvadrati", vigenere: "Vijiner shifri",
      };
      bold(); ss(8); sc(C.sky700);
      doc.text("Tanlangan algoritm:", ML + 5, y + 17);
      normal(); ss(9); sc(C.slate900);
      doc.text(cipherNames[ca.cipher] ?? ca.cipher, ML + 5 + tw("Tanlangan algoritm:") + 2, y + 17);
    }
    y += infoH + 6;

    if (!ca) {
      bold(); ss(9); sc(C.slate500);
      doc.text("NATIJALAR:", ML, y);
      y += 7;
      resultRow("Kriptoanaliz", "Ma'lumot kiritilmagan", C.sky600, true);
    } else {
      bold(); ss(9); sc(C.slate500);
      doc.text("KRIPTOANALIZ NATIJALARI:", ML, y);
      y += 7;

      // Ciphertext row
      need(14);
      italic(); ss(7.5); sc(C.slate500);
      doc.text("Shifrmatn:", ML, y);
      mono(); ss(8); sc(C.slate900);
      const ctDisplay = ca.ciphertext.length > 80 ? ca.ciphertext.slice(0, 80) + "…" : ca.ciphertext;
      doc.text(ctDisplay, ML + tw("Shifrmatn:") + 2, y);
      y += 8;

      if (ca.cipher === "atbash" && ca.atbashResult) {
        resultRow("01  Atbash — Ochiq matn (self-inverse)", ca.atbashResult, C.rose600, false);

      } else if (ca.cipher === "caesar" && ca.caesarVariants) {
        // Best variant hero row
        const best = ca.caesarVariants.find(v => v.k === ca.caesarBestK) ?? ca.caesarVariants[0];
        resultRow(
          `01  Sezar — Eng ehtimoliy variant  (k=${best.k}, ball=${best.score})`,
          best.text,
          C.amber600,
          false,
        );
        y += 2;

        // Compact table of all variants
        need(10);
        bold(); ss(8); sc(C.slate600);
        doc.text("Barcha 25 variant:", ML, y);
        y += 6;

        const colW = CW / 3;
        for (let i = 0; i < ca.caesarVariants.length; i += 3) {
          const rowVars = ca.caesarVariants.slice(i, i + 3);
          need(9);
          rowVars.forEach((v, ci) => {
            const isBest = v.k === ca.caesarBestK;
            const x = ML + ci * colW;
            if (isBest) { sf(C.amber100); sd(C.amber200); doc.rect(x, y - 5, colW - 1, 8, "FD"); }
            bold(); ss(7); sc(isBest ? C.amber600 : C.slate500);
            doc.text(`k=${v.k} (${v.score})`, x + 2, y);
            mono(); ss(7); sc(C.slate900);
            const txt = v.text.length > 22 ? v.text.slice(0, 22) + "…" : v.text;
            doc.text(txt, x + 2, y + 5);
          });
          y += 10;
        }

      } else if (ca.cipher === "polibey" && ca.polibeyResult) {
        resultRow("01  Polibey kvadrati — Dekodlangan matn", ca.polibeyResult, C.emerald600, false);

      } else if (ca.cipher === "vigenere") {
        if (ca.vigenereResult && ca.vigenereGuessedKey) {
          resultRow(
            `01  Vijiner — Taxminiy kalit: ${ca.vigenereGuessedKey}`,
            ca.vigenereResult,
            C.violet600,
            false,
          );
        } else {
          resultRow("01  Vijiner", "Taxminiy kalit kiritilmagan", C.violet600, true);
        }
        // Theory note
        y += 2;
        need(20);
        sf(C.violet50); sd(C.violet200); doc.setLineWidth(0.2);
        doc.rect(ML, y, CW, 18, "FD");
        italic(); ss(7.5); sc(C.violet600);
        doc.text(
          "Kasiski testi + IC indeksi + Chastota tahlili usullari qo'llaniladi.",
          ML + 4, y + 7
        );
        doc.text(
          "To'liq avtomatik yechish uchun kalit uzunligini aniqlash zarur.",
          ML + 4, y + 13
        );
        y += 20;
      } else {
        resultRow("01  Natija", "Ma'lumot kiritilmagan", C.sky600, true);
      }

      y += 4;
      need(8);
      italic(); ss(7.5); sc(C.slate400);
      doc.text(
        "* Kriptoanaliz natijalari taxminiy bo'lishi mumkin. Qo'lda tekshirish tavsiya etiladi.",
        ML, y
      );
    }
  }

  // ── Final page footer ──────────────────────────────────────────────────────
  footer();

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save("kriptotahlil-1-topshiriq-temurbek-xaydarov.pdf");
}
