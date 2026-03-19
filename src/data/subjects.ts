import { Subject, Assignment } from "@/types";

// ─── Real Subject Data ────────────────────────────────────────────────────────
// Replace API/DB calls here when backend is ready.
// Adding a new subject: add an entry below and create its route automatically
// via Next.js dynamic routing [subjectSlug]/[assignmentSlug].

export const subjects: Subject[] = [
  // ── 1. Kriptotahlil ─────────────────────────────────────────────────────────
  {
    id: "subject-kriptotahlil",
    slug: "kriptotahlil",
    name: "Kriptotahlil",
    description:
      "Kriptografik algoritmlar, klassik va zamonaviy shifrlash usullari, kalit menejment va kriptografik protokollarni nazariy hamda amaliy tahlil qilish.",
    color: "indigo",
    assignments: [
      {
        // ── 1-topshiriq: fully scaffolded, ready for real implementation ──────
        id: "kr-a1",
        slug: "1-topshiriq",
        title: "1-topshiriq",
        description: "Klassik shifrlash algoritmlari — Sezar va Vigenère shifri",
        taskDetails:
          "Sezar shifri va Vigenère shifri algoritmlarini o'rganing va dasturda amalga oshiring. " +
          "Foydalanuvchi oddiy matn (plaintext) va kalit (key) kiritadi; dastur shifrlangan matn " +
          "(ciphertext) ni chiqaradi va teskari jarayonda (deshifrlash) asl matnni tiklaydi. " +
          "Shuningdek, chastotaviy tahlil (frequency analysis) yordamida Sezar shifri kalitini " +
          "avtomatik aniqlash funksiyasini qo'shing.",
        status: "jarayonda",
        // programType = "placeholder" until the real CipherProgram component is built
        programType: "placeholder",
        notes:
          "Bu topshiriq uchun interaktiv dastur hozirda ishlab chiqilmoqda. " +
          "Dastur tayyor bo'lgach, InteractiveArea.tsx fayliga yangi 'cipher' programType " +
          "qo'shiladi va src/components/assignments/programs/CipherTool.tsx yaratiladi.",
      },
      {
        id: "kr-a2",
        slug: "2-topshiriq",
        title: "2-topshiriq",
        description: "Simmetrik shifrlash — AES algoritmi bilan tanishish",
        taskDetails:
          "AES (Advanced Encryption Standard) algoritmining ishlash prinsipi va asosiy tushunchalarini " +
          "o'rganing. Blok shifrlash, padding, CBC/ECB rejimlarini tahlil qiling. " +
          "Web Crypto API yordamida oddiy AES-256-CBC shifrlash/deshifrlash misolini yarating.",
        status: "demo",
        programType: "placeholder",
        notes:
          "Bu topshiriq demo rejimida. Keyingi bosqichda Web Crypto API integratsiyasi rejalashtirilgan.",
      },
      {
        id: "kr-a3",
        slug: "3-topshiriq",
        title: "3-topshiriq",
        description: "Hash funksiyalar — SHA-256 va MD5 tahlili",
        taskDetails:
          "Kriptografik hash funksiyalarining xususiyatlarini (bir tomonlama, to'qnashuvga chidamlilik) " +
          "o'rganing. SHA-256 va MD5 algoritmlarini solishtiring. " +
          "Berilgan matn uchun hash qiymatini hisoblang va o'zgartirilgan matn hash qiymatini solishtiring.",
        status: "demo",
        programType: "placeholder",
        notes:
          "Hash funksiyalar topshirig'i demo rejimida. SubtleCrypto API dan foydalanish rejalashtirilgan.",
      },
    ],
  },

  // ── 2. Algoritmlarni loyihalashtirish va tahlil qilish ───────────────────────
  {
    id: "subject-algoritmlar",
    slug: "algoritmlar",
    name: "Algoritmlarni loyihalashtirish va tahlil qilish",
    description:
      "Algoritmlarni loyihalash paradigmalari (bo'lib tashla va zabt et, dinamik dasturlash, ochko'zlik), murakkablik tahlili (Big-O), graf algoritmlari va amaliy masalalarni hal etish.",
    color: "violet",
    assignments: [
      {
        id: "alg-a1",
        slug: "1-topshiriq",
        title: "1-topshiriq",
        description: "Saralash algoritmlari — tahlil va solishtirish",
        taskDetails:
          "Bubble Sort, Selection Sort, Merge Sort va Quick Sort algoritmlarini amalga oshiring. " +
          "Har bir algoritmning vaqt murakkabligini (O(n²), O(n log n)) vizual tarzda ko'rsating. " +
          "Tasodifiy massiv uchun barcha algoritmlarning ishlash vaqtini taqqoslang.",
        status: "demo",
        programType: "placeholder",
        notes:
          "Saralash algoritmlarini vizualizatsiya qiluvchi komponent rejalashtirilgan. " +
          "Animatsiya uchun CSS transitions va requestAnimationFrame ishlatiladi.",
      },
      {
        id: "alg-a2",
        slug: "2-topshiriq",
        title: "2-topshiriq",
        description: "Dinamik dasturlash — Fibonacci va Knapsack masalasi",
        taskDetails:
          "Fibonacci sonlarini rekursiya, memoizatsiya va bottom-up DP yondashuvlari bilan hisoblang " +
          "va ularning samaradorligini solishtiring. " +
          "Keyin klassik 0/1 Knapsack masalasini dinamik dasturlash yordamida yeching va " +
          "DP jadvalini vizual tarzda ko'rsating.",
        status: "demo",
        programType: "placeholder",
        notes:
          "DP jadvalini interaktiv ko'rsatuvchi komponent rejalashtirilgan.",
      },
      {
        id: "alg-a3",
        slug: "3-topshiriq",
        title: "3-topshiriq",
        description: "Graf algoritmlari — BFS va DFS qidirish",
        taskDetails:
          "Grafni qo'shni ro'yxat (adjacency list) ko'rinishida ifodalang. " +
          "BFS (Breadth-First Search) va DFS (Depth-First Search) algoritmlarini amalga oshiring. " +
          "Har bir qidirish jarayonini bosqichma-bosqich vizual tarzda ko'rsating.",
        status: "demo",
        programType: "placeholder",
        notes:
          "Graf vizualizatsiyasi uchun SVG yoki canvas yondashuvi rejalashtirilgan.",
      },
    ],
  },
];

// ─── Helper Queries ───────────────────────────────────────────────────────────
// These will be replaced by API calls (e.g., fetch('/api/subjects/slug')) later.

export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find((s) => s.slug === slug);
}

export function getAssignmentBySlug(
  subjectSlug: string,
  assignmentSlug: string
): { subject: Subject; assignment: Assignment } | undefined {
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) return undefined;

  const assignment = subject.assignments.find((a) => a.slug === assignmentSlug);
  if (!assignment) return undefined;

  return { subject, assignment };
}
