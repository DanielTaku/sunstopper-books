/* ============================================================
   GOLDEN SANCTUARY — Books Data
   All PDF and cover image URLs point to the webdev CDN storage.
   ============================================================ */

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher?: string;
  year: number;
  pages: number;
  fileSize: string;
  category: string;
  description: string;
  coverUrl: string;
  downloadUrl: string;
  isbn?: string;
  featured?: boolean;
}

export const books: Book[] = [
  {
    id: "dreams-interpretation",
    title: "Dreams & Interpretation",
    subtitle: "Ziva Zvinoreva Hope Dzako",
    author: "Sun Stopper Apostle Daniel Munyukwa",
    publisher: "Blessed Souls Fellowship",
    year: 2024,
    pages: 1097,
    fileSize: "6.1 MB",
    category: "Spiritual Guidance",
    description:
      "A comprehensive spiritual guide to understanding and interpreting dreams through a biblical lens. This landmark volume explores the language of the Spirit through dreams, equipping believers with the knowledge and wisdom to discern divine messages, warnings, and prophetic visions.",
    coverUrl: "/manus-storage/DOC-20240807-WA0004.-0001_9dfc5aa6.jpg",
    downloadUrl: "/manus-storage/DOC-20240807-WA0004._a09ed910.pdf",
    isbn: "945-964-85541-539",
    featured: true,
  },
  {
    id: "marriage-teaching-vol1",
    title: "Marriage Teaching",
    subtitle: "Volume One",
    author: "Sun Stopper Apostle Daniel Munyukwa",
    publisher: "Blessed Souls Fellowship",
    year: 2024,
    pages: 227,
    fileSize: "6.9 MB",
    category: "Christian Living",
    description:
      "A transformative Christian teaching on the sacred covenant of marriage. Volume One lays the spiritual and practical foundations of a God-honouring marriage, addressing love, purpose, roles, and the divine design for the union of husband and wife.",
    coverUrl: "/manus-storage/DOC-20240612-WA0018.-001_e9d14a7c.jpg",
    downloadUrl: "/manus-storage/DOC-20240612-WA0018._1cc24446.pdf",
    isbn: "945-964-85541-53-7",
    featured: true,
  },
  {
    id: "dzidza-chinonzi-hupenyu",
    title: "Dzidza Chinonzi Hupenyu",
    subtitle: "Season One — Episode One",
    author: "Sun Stopper Apostle T. Daniel Munyukwa",
    publisher: "Blessed Souls Fellowship",
    year: 2024,
    pages: 136,
    fileSize: "18 MB",
    category: "Life Wisdom",
    description:
      "Life Lessons and Bible guide for your living — a rich collection of knowledge and wisdom for daily living. Season One opens a journey of spiritual discovery, drawing from scripture and lived experience to illuminate the path of a faithful, purposeful life.",
    coverUrl: "/manus-storage/DOC-20240807-WA0002.-001_d613f656.jpg",
    downloadUrl: "/manus-storage/DOC-20240807-WA0002._ccd25ac9.pdf",
    isbn: "945-964-85541-56759-9",
    featured: false,
  },
  {
    id: "prayer-passport-crush-oppression",
    title: "Prayer Passport to Crush Oppression",
    author: "Dr. Daniel K. Olukoya",
    publisher: "Mountain of Fire and Miracles Ministries",
    year: 2017,
    pages: 584,
    fileSize: "2.0 MB",
    category: "Prayer & Warfare",
    description:
      "A powerful prayer manual from the Mountain of Fire and Miracles Ministries. This essential companion contains hundreds of targeted, scripture-backed prayers to dismantle every form of spiritual oppression, break chains, and walk in the fullness of divine freedom.",
    coverUrl: "/manus-storage/DOC-20240115-WA0004.-001_ec2a6aa9.jpg",
    downloadUrl: "/manus-storage/DOC-20240115-WA0004._ad9e4d58.pdf",
    featured: false,
  },
];

export const categories = Array.from(new Set(books.map((b) => b.category)));
