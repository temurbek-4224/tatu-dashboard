/**
 * PDF Report Generator — Kriptotahlil 4-topshiriq
 * SP tarmog'i va kriptotahlil
 */

import type { SpnTrace, DiffSpnTrace, KeyRecoveryResult } from "./spn";
import { toBin4, toHex1, ATTACK_DX, ATTACK_DU } from "./spn";

export interface SpnPDFOptions {
  simTrace?:   SpnTrace;
  diffTrace?:  DiffSpnTrace;
  keyRecovery?: KeyRecoveryResult;
}

type RGB = [number, number, number];
const C = {
  indigo700:[67,56,202] as RGB, indigo600:[79,70,229] as RGB, indigo200:[199,210,254] as RGB,
  indigo100:[224,231,255] as RGB, indigo50:[238,242,255] as RGB,
  sky700:[3,105,161] as RGB, sky600:[2,132,199] as RGB, sky200:[186,230,253] as RGB,
  sky100:[224,242,254] as RGB, sky50:[240,249,255] as RGB,
  slate900:[15,23,42] as RGB, slate700:[51,65,85] as RGB, slate600:[71,85,105] as RGB,
  slate500:[100,116,139] as RGB, slate400:[148,163,184] as RGB,
  slate300:[203,213,225] as RGB, slate200:[226,232,240] as RGB,
  slate100:[241,245,249] as RGB, slate50:[248,250,252] as RGB,
  rose600:[225,29,72] as RGB, rose100:[255,228,230] as RGB,
  amber600:[217,119,6] as RGB, amber100:[254,243,199] as RGB, amber50:[255,251,235] as RGB,
  emerald600:[5,150,105] as RGB, emerald100:[209,250,229] as RGB,
  violet600:[124,58,237] as RGB, violet100:[237,233,254] as RGB,
  white:[255,255,255] as RGB,
};

export async function generateSpnPDF(opts: SpnPDFOptions): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW=210, PH=297, ML=18, MR=18, RX=PW-MR, CW=RX-ML, LH=5;
  let y=0, pageNo=1;

  const sc=(col:RGB)=>doc.setTextColor(...col);
  const sf=(col:RGB)=>doc.setFillColor(...col);
  const sd=(col:RGB)=>doc.setDrawColor(...col);
  const ss=(n:number)=>doc.setFontSize(n);
  const bold=()=>doc.setFont("helvetica","bold");
  const normal=()=>doc.setFont("helvetica","normal");
  const italic=()=>doc.setFont("helvetica","italic");
  const mono=()=>doc.setFont("courier","normal");
  const monob=()=>doc.setFont("courier","bold");
  const wrap=(s:string,w:number):string[]=>doc.splitTextToSize(s,w);
  const tw=(s:string):number=>doc.getTextWidth(s);
  const tl=(lines:string[],x:number,sy:number,lh=LH)=>lines.forEach((l,i)=>doc.text(l,x,sy+i*lh));

  const footer=()=>{
    const fy=PH-10; sd(C.slate300); doc.setLineWidth(0.2);
    doc.line(ML,fy-4,RX,fy-4); normal(); ss(7.5); sc(C.slate400);
    doc.text("Kriptotahlil — 4-topshiriq  |  SP tarmog'i va kriptotahlil",ML,fy);
    doc.text(`${pageNo}-bet`,RX,fy,{align:"right"});
  };
  const need=(h:number)=>{
    if(y+h>PH-22){footer();doc.addPage();pageNo++;y=22;}
  };
  const sectionTitle=(n:string,title:string,col:RGB=C.indigo700)=>{
    need(18);y+=3; sf(col);sd(col);
    doc.rect(ML,y-6,3.5,9.5,"F");
    bold();ss(12);sc(col); doc.text(`${n}. ${title}`,ML+7,y);
    y+=2; sd(C.indigo200);doc.setLineWidth(0.4);
    doc.line(ML,y+1,RX,y+1);doc.setLineWidth(0.2);y+=8;
  };
  const subTitle=(badge:string,title:string,col:RGB)=>{
    need(14);y+=2; sf(col);sd(col);doc.setLineWidth(0);
    doc.rect(ML,y-5.5,8,8,"F");
    bold();ss(8);sc(C.white);doc.text(badge,ML+4,y-1,{align:"center"});
    bold();ss(10.5);sc(col);doc.text(title,ML+12,y);
    doc.setLineWidth(0.2);y+=6;
  };
  const para=(text:string,indent=0,col:RGB=C.slate700)=>{
    normal();ss(9);sc(col); const lines=wrap(text,CW-indent);
    need(lines.length*LH+2); tl(lines,ML+indent,y);
    y+=lines.length*LH+2;
  };
  const codeBox=(text:string,bg:RGB,fg:RGB)=>{
    const lines=wrap(text,CW-10); const h=lines.length*5+8;
    need(h+3); sf(bg);sd(bg); doc.rect(ML,y,CW,h,"FD");
    monob();ss(8.5);sc(fg); tl(lines,ML+5,y+5); y+=h+4;
  };
  const questionBlock=(n:number,q:string)=>{
    const qL=wrap(q,CW-22); const qH=qL.length*5+10;
    need(qH+2); sf(C.indigo50);sd(C.indigo100);
    doc.rect(ML,y,CW,qH,"FD"); sf(C.indigo700);sd(C.indigo700);
    doc.rect(ML,y,10,qH,"F"); bold();ss(12);sc(C.white);
    doc.text(String(n),ML+5,y+qH/2+1.5,{align:"center"});
    bold();ss(9.5);sc(C.slate900); tl(qL,ML+14,y+6); y+=qH+4;
  };
  const answerBlock=(items:Array<{tag:string;tagColor:RGB;text:string}>)=>{
    const rendered=items.map((it)=>({...it,lines:wrap(it.text,CW-18)}));
    const innerH=rendered.reduce((h,r)=>h+r.lines.length*4.5+10,0)+4;
    need(innerH+2); sf(C.slate50);sd(C.slate200);doc.setLineWidth(0.25);
    doc.rect(ML,y,CW,innerH,"FD"); sf(C.indigo100);sd(C.indigo100);
    doc.rect(ML,y,3.5,innerH,"F"); doc.setLineWidth(0.2);
    let iy=y+6;
    for(const r of rendered){
      bold();ss(8.5);sc(r.tagColor); doc.text(r.tag,ML+7,iy); iy+=5;
      normal();ss(8.5);sc(C.slate700);
      r.lines.forEach((l)=>{doc.text(l,ML+7,iy);iy+=4.5;}); iy+=4;
    }
    y+=innerH+5;
  };
  const emptySection=()=>{
    need(14); sf(C.slate100);sd(C.slate200);doc.setLineWidth(0.2);
    doc.rect(ML,y,CW,12,"FD"); italic();ss(9);sc(C.slate400);
    doc.text("Bu bo'lim bajarilmagan.",ML+5,y+7.5); y+=16;
  };
  const kvRow=(label:string,val:string,x:number,ky:number,lCol:RGB=C.slate600)=>{
    bold();ss(8);sc(lCol); doc.text(label,x,ky);
    mono();ss(9);sc(C.slate900); doc.text(val,x+tw(label)+2,ky);
  };

  // ── Cover ──────────────────────────────────────────────────────────────────
  sf(C.indigo700);doc.rect(0,0,PW,42,"F");
  sf(C.indigo600);doc.rect(0,38,PW,4,"F");
  bold();ss(9);sc(C.indigo200);
  doc.text("TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI",PW/2,10,{align:"center"});
  bold();ss(8);sc(C.indigo200);
  doc.text("Kriptotahlil fani  —  4-topshiriq  |  SP tarmog'i va kriptotahlil",PW/2,17,{align:"center"});
  bold();ss(18);sc(C.white);
  doc.text("4-TOPSHIRIQ",PW/2,30,{align:"center"});
  normal();ss(9);sc(C.indigo200);
  doc.text("SP tarmog'i va kriptotahlil",PW/2,37,{align:"center"});
  sf(C.slate50);sd(C.slate200);doc.setLineWidth(0.25);
  doc.rect(ML,47,CW,18,"FD");
  bold();ss(8);sc(C.slate600);doc.text("Talaba:",ML+4,54);
  bold();ss(9);sc(C.indigo700);
  doc.text("Temurbek Xaydarov",ML+4+tw("Talaba:")+2,54);
  bold();ss(8);sc(C.slate600);doc.text("Fan:",ML+4,61);
  normal();ss(8.5);sc(C.slate700);
  doc.text("Kriptotahlil  |  4-topshiriq — SP tarmog'i va kriptotahlil",ML+4+tw("Fan:")+2,61);
  y=72;

  // ── 1. Maqsad ─────────────────────────────────────────────────────────────
  sectionTitle("1","MAQSAD");
  para("Ushbu amaliy mashg'ulotda Substitution-Permutation Network (SPN) shifrining tuzilishi " +
    "va ishlash tamoyillari o'rganiladi. 2-raundli 4-bitli o'quv SPN yordamida " +
    "differentsial kriptotahlil usuli amalda qo'llaniladi: differentsial zanjirlar " +
    "kuzatiladi, kalit tiklovchi hujum simulatsiya qilinadi va natijalar tahlil qilinadi.");
  y+=2;

  // ── 2. Nazariy qism ───────────────────────────────────────────────────────
  sectionTitle("2","NAZARIY QISM");

  subTitle("A","SP tarmog'i tuzilishi",C.sky600);
  para("Substitution-Permutation Network (SPN) blok shifrlar arxitekturasining asosiy " +
    "turi bo'lib, Shannon'ning confusion va diffusion tamoyillariga asoslanadi. " +
    "Har bir raund uch bosqichdan iborat: AddKey (kalit aralashishi), SubBytes (S-box " +
    "yordamida nochiziqli almashtirish), Permute (P-box yordamida bitlarni tarqatish). " +
    "AES (Rijndael) eng mashhur SPN shifridir.");
  codeBox(
    "SPN raund:  AddKey(K_i) -> SubBytes(SBOX) -> Permute(PBOX)\n" +
    "AddKey:  state = state XOR K_i        (kalit aralashishi)\n" +
    "SubBytes: state = SBOX[state]          (nochiziqli almashtirish)\n" +
    "Permute: state = PBOX(state)           (bitlarni tarqatish)",
    C.slate100,C.indigo700);
  y+=2;

  subTitle("B","Differentsial kriptotahlil",C.rose600);
  para("Differentsial kriptotahlil (Biham-Shamir, 1990) kirishlar farqini (DX) kuzatib, " +
    "uning shifrmatn farqiga (DC) qanday tarqalishini tahlil qiladi. " +
    "AddKey bosqichi farqga ta'sir qilmaydi (XOR bilan bekor bo'ladi). " +
    "S-box DDT jadvalidan eng yuqori ehtimollikli differentsial juft (DX->DY1) tanlanadi. " +
    "P-box orqali bu farq keyingi raundga DU sifatida o'tadi. " +
    "Ko'p juft to'plash orqali oxirgi raund kaliti tiklanadi.");
  codeBox(
    `DX = X XOR X'               (kiritish farqi, masalan DX=${ATTACK_DX}=0110)\n` +
    "After AddKey: DX o'zgarmaydi (XOR K XOR K = 0)\n" +
    "After S-box:  DY1 = SBOX[X^K] XOR SBOX[X'^K]  (DDT dan)\n" +
    `After P-box:  DU = PBOX(DY1)  (masalan, DU=${ATTACK_DU}=0111)`,
    C.rose100,C.rose600);
  y+=2;

  subTitle("C","Chiziqli kriptotahlil",C.amber600);
  para("Chiziqli kriptotahlil (Matsui, 1993) kiritish va chiqish bitlarining XOR " +
    "chiziqli korrelyatsiyasini tahlil qiladi. LAT[a][b] = #{x: a*x = b*S(x)} - 8 " +
    "formula bilan bias hisoblanadi. SPN ning chiziqli kriptotahliliga qarshi " +
    "chidamliligi S-box nochiziqliligiga va P-box tarqatish xususiyatlariga bog'liq.");
  codeBox(
    "LAT[a][b] = #{x: a*x XOR b*S(x) = 0} - 8\n" +
    "Bias: 0 = ideal (chiziqli korrelyatsiya yo'q), +-8 = to'liq chiziqli\n" +
    "Ehtimollik = (8 + bias) / 16",
    C.amber50,C.amber600);
  y+=4;

  // ── 3. Nazorat savollari ─────────────────────────────────────────────────
  sectionTitle("3","NAZORAT SAVOLLARI");
  questionBlock(1,"SP tarmog'ida S-box va P-box ning vazifalari nimadan iborat?");
  answerBlock([{tag:"Javob:",tagColor:C.indigo700,text:
    "S-box (SubBytes): Shannon'ning confusion tamoyilini amalga oshiradi — " +
    "kirish bitlarini nochiziqli almashtiradi, kalit va shifrmatn bog'liqligini murakkablashtiradi. " +
    "P-box (Permute): diffusion tamoyilini amalga oshiradi — bitlarni tarqatadi, " +
    "bir S-box chiqishi keyingi raundda ko'plab S-boxlarga ta'sir qiladi. " +
    "AddKey: kalit bilan XOR aralashishi, hujumchining oldindan aytib berishini imkonsiz qiladi."}]);

  questionBlock(2,"Differentsial kriptotahlilning asosiy g'oyasi va SP tarmoqlariga ta'siri nima?");
  answerBlock([{tag:"Javob:",tagColor:C.indigo700,text:
    "Differentsial kriptotahlil DX=X XOR X' kiritish farqini kuzatib, eng yuqori " +
    "ehtimollikli DX->DY differentsial juftlarni topadi (DDT jadvali). " +
    "AddKey bosqichi farqga ta'sir qilmaydi. " +
    "Ko'p (P,P') juft to'planib, oxirgi raund kalit variantlari sinab ko'riladi. " +
    "To'g'ri kalit eng ko'p mos juftlar beradi. " +
    "SPN himoyasi: ko'proq raund, yaxshi S-box (past diff. uniformlik), Wide-trail strategiyasi."}]);

  questionBlock(3,"Chiziqli va differentsial kriptotahlil qanday farq qiladi?");
  answerBlock([{tag:"Javob:",tagColor:C.indigo700,text:
    "Differentsial (Biham-Shamir, 1990): kiritish farqlarining ehtimollikli tarqalishini tahlil qiladi. " +
    "DX=X XOR X', DY=S(X) XOR S(X'). DDT jadvali asosida. " +
    "Chiziqli (Matsui, 1993): XOR chiziqli korrelyatsiyani tahlil qiladi. " +
    "LAT[a][b] bias asosida. " +
    "Ikkalasi ham blok shifrlarni tahlil qilishda qo'llaniladi; DES ga qarshi muvaffaqiyatli qo'llanilgan."}]);

  questionBlock(4,"Kalit tiklovchi differentsial hujum qanday ishlaydi va undan qanday himoyalanish mumkin?");
  answerBlock([{tag:"Javob:",tagColor:C.indigo700,text:
    "Hujum: 1) DX=const bo'lgan juftlar to'planadi. 2) Har kandidat K3 uchun: " +
    "U=SBOX_inv[C XOR K3], U'=SBOX_inv[C' XOR K3], U XOR U'==DU bo'lsa count++. " +
    "3) max(count) -> to'g'ri K3. " +
    "Himoya: ko'proq raund (har raund differentsial ehtimollikni kamaytiradi), " +
    "wide-trail strategiyasi (AES), yaxshi S-box (past diff. uniformlik = 4 uchun AES)."}]);
  y+=4;

  // ── 4. Amaliy qism ────────────────────────────────────────────────────────
  sectionTitle("4","AMALIY QISM");

  subTitle("01","SPN Simulatsiya Natijasi",C.sky600);
  if(!opts.simTrace){
    emptySection();
  } else {
    const t=opts.simTrace;
    const bH=56; need(bH+4);
    sf(C.sky50);sd(C.sky200);doc.setLineWidth(0.2);
    doc.rect(ML,y,CW,bH,"FD");
    let sy=y+8; const c1=ML+5, c2=ML+CW/2+4;
    kvRow("P =",`${toHex1(t.plaintext)} (${toBin4(t.plaintext)})`,c1,sy,C.sky700);
    kvRow("K =",`${toHex1(t.masterKey)} (${toBin4(t.masterKey)})`,c2,sy,C.amber600);
    sy+=9;
    kvRow("K1=K =",`${toHex1(t.k1)} (${toBin4(t.k1)})`,c1,sy,C.amber600);
    kvRow("K2=rotL =",`${toHex1(t.k2)} (${toBin4(t.k2)})`,c2,sy,C.amber600);
    sy+=9;
    kvRow("R1 in (P^K1):",`${toHex1(t.r1_in)} (${toBin4(t.r1_in)})`,c1,sy,C.slate600);
    kvRow("R1 sbox:",`${toHex1(t.r1_sbox)} (${toBin4(t.r1_sbox)})`,c2,sy,C.violet600);
    sy+=9;
    kvRow("R1 pbox:",`${toHex1(t.r1_pbox)} (${toBin4(t.r1_pbox)})`,c1,sy,C.emerald600);
    kvRow("R2 sbox:",`${toHex1(t.r2_sbox)} (${toBin4(t.r2_sbox)})`,c2,sy,C.violet600);
    y+=bH+5;
    need(9);
    bold();ss(10);sc(C.rose600);
    doc.text(`Shifrmatn C = ${toHex1(t.ciphertext)} (${toBin4(t.ciphertext)})`,ML,y);
    y+=10;
  }

  subTitle("02","Differentsial Tahlil Natijasi",C.rose600);
  if(!opts.diffTrace){
    emptySection();
  } else {
    const d=opts.diffTrace;
    const bH=56; need(bH+4);
    sf(C.rose100);sd(C.rose600);doc.setLineWidth(0.2);
    doc.rect(ML,y,CW,bH,"FD");
    let dy=y+8; const c1=ML+5, c2=ML+CW/2+4;
    kvRow("X =",`${toHex1(d.x)} (${toBin4(d.x)})`,c1,dy,C.sky600);
    kvRow("X' =",`${toHex1(d.xPrime)} (${toBin4(d.xPrime)})`,c2,dy,C.emerald600); dy+=9;
    kvRow("DX = X XOR X' =",`${toHex1(d.dx)} (${toBin4(d.dx)})`,c1,dy,C.amber600); dy+=9;
    kvRow("DY1 (R1 S-box) =",`${toHex1(d.dy_r1_sbox)} (${toBin4(d.dy_r1_sbox)})`,c1,dy,C.violet600);
    kvRow("DU (R1 P-box) =",`${toHex1(d.dy_r1_pbox)} (${toBin4(d.dy_r1_pbox)})`,c2,dy,C.sky600); dy+=9;
    kvRow("DY2 (R2 S-box) =",`${toHex1(d.dy_r2_sbox)} (${toBin4(d.dy_r2_sbox)})`,c1,dy,C.violet600);
    kvRow("DC (ciphertext) =",`${toHex1(d.dy_cipher)} (${toBin4(d.dy_cipher)})`,c2,dy,C.rose600);
    y+=bH+5;
    italic();ss(7.5);sc(d.dy_r1_pbox===ATTACK_DU?C.emerald600:C.slate500);
    need(8);
    doc.text(d.dy_r1_pbox===ATTACK_DU
      ?`Differentsial xarakteristika: DX=${ATTACK_DX}->DU=${ATTACK_DU} — kalit tiklovchi hujumda ishlatilishi mumkin.`
      :`DU=${d.dy_r1_pbox} — optimal farq (DX=${ATTACK_DX}) ni sinab ko'ring.`,ML,y);
    y+=8;
  }

  subTitle("03","Kalit Tiklovchi Hujum Natijasi",C.violet600);
  if(!opts.keyRecovery){
    emptySection();
  } else {
    const r=opts.keyRecovery;
    need(14); bold();ss(9);sc(C.violet600);
    doc.text(`Haqiqiy K3 = ${toHex1(r.trueK3)} (${toBin4(r.trueK3)})   Juftlar soni: ${r.numPairs}   Maqsad DU = ${ATTACK_DU}`,ML,y); y+=8;
    // Top 5 candidates
    const top5=r.candidates.slice(0,5);
    for(const {key,count,isCorrect} of top5){
      const bW=Math.max((count/r.numPairs)*CW*0.6,2);
      need(9);
      sf(isCorrect?C.emerald100:C.slate100);sd(isCorrect?C.emerald600:C.slate300);
      doc.setLineWidth(0.2); doc.rect(ML,y-5,bW,7,"FD");
      bold();ss(8);sc(isCorrect?C.emerald600:C.slate600);
      doc.text(`K3=${toHex1(key)} (${toBin4(key)})  ${count}/${r.numPairs}${isCorrect?" <- TO'G'RI":""}`,ML+3,y);
      y+=8;
    }
    y+=2;
  }

  y+=4; need(8);
  italic();ss(7.5);sc(C.slate400);
  doc.text("* 2-raundli 4-bitli o'quv SPN. PRESENT S-box ishlatildi. Haqiqiy shifrlar uchun ko'proq raund zarur.",ML,y);
  footer();
  doc.save("kriptotahlil-4-topshiriq-spn-temurbek-xaydarov.pdf");
}
