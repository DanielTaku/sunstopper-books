// Seed existing 4 books from CDN storage into the database
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const booksData = [
  {
    slug: "dreams-interpretation",
    title: "Dreams & Interpretation",
    subtitle: "Ziva Zvinoreva Hope Dzako",
    author: "Sun Stopper Apostle Daniel Munyukwa",
    publisher: "Blessed Souls Fellowship",
    year: 2024,
    pages: 1097,
    fileSizeBytes: 6307171,
    category: "Spiritual Guidance",
    description: "A comprehensive spiritual guide to understanding and interpreting dreams through a biblical lens. This landmark volume explores the language of the Spirit through dreams, equipping believers with the knowledge and wisdom to discern divine messages, warnings, and prophetic visions.",
    pdfKey: "DOC-20240807-WA0004._a09ed910.pdf",
    pdfUrl: "/manus-storage/DOC-20240807-WA0004._a09ed910.pdf",
    coverKey: "DOC-20240807-WA0004.-0001_9dfc5aa6.jpg",
    coverUrl: "/manus-storage/DOC-20240807-WA0004.-0001_9dfc5aa6.jpg",
    isbn: "945-964-85541-539",
    featured: "1",
    downloadCount: 0,
  },
  {
    slug: "marriage-teaching-vol1",
    title: "Marriage Teaching",
    subtitle: "Volume One",
    author: "Sun Stopper Apostle Daniel Munyukwa",
    publisher: "Blessed Souls Fellowship",
    year: 2024,
    pages: 227,
    fileSizeBytes: 7148025,
    category: "Christian Living",
    description: "A transformative Christian teaching on the sacred covenant of marriage. Volume One lays the spiritual and practical foundations of a God-honouring marriage, addressing love, purpose, roles, and the divine design for the union of husband and wife.",
    pdfKey: "DOC-20240612-WA0018._1cc24446.pdf",
    pdfUrl: "/manus-storage/DOC-20240612-WA0018._1cc24446.pdf",
    coverKey: "DOC-20240612-WA0018.-001_e9d14a7c.jpg",
    coverUrl: "/manus-storage/DOC-20240612-WA0018.-001_e9d14a7c.jpg",
    isbn: "945-964-85541-53-7",
    featured: "1",
    downloadCount: 0,
  },
  {
    slug: "dzidza-chinonzi-hupenyu",
    title: "Dzidza Chinonzi Hupenyu",
    subtitle: "Season One — Episode One",
    author: "Sun Stopper Apostle T. Daniel Munyukwa",
    publisher: "Blessed Souls Fellowship",
    year: 2024,
    pages: 136,
    fileSizeBytes: 18879569,
    category: "Life Wisdom",
    description: "Life Lessons and Bible guide for your living — a rich collection of knowledge and wisdom for daily living. Season One opens a journey of spiritual discovery, drawing from scripture and lived experience to illuminate the path of a faithful, purposeful life.",
    pdfKey: "DOC-20240807-WA0002._ccd25ac9.pdf",
    pdfUrl: "/manus-storage/DOC-20240807-WA0002._ccd25ac9.pdf",
    coverKey: "DOC-20240807-WA0002.-001_d613f656.jpg",
    coverUrl: "/manus-storage/DOC-20240807-WA0002.-001_d613f656.jpg",
    isbn: "945-964-85541-56759-9",
    featured: "0",
    downloadCount: 0,
  },
  {
    slug: "prayer-passport-crush-oppression",
    title: "Prayer Passport to Crush Oppression",
    subtitle: null,
    author: "Dr. Daniel K. Olukoya",
    publisher: "Mountain of Fire and Miracles Ministries",
    year: 2017,
    pages: 584,
    fileSizeBytes: 2065153,
    category: "Prayer & Warfare",
    description: "A powerful prayer manual from the Mountain of Fire and Miracles Ministries. This essential companion contains hundreds of targeted, scripture-backed prayers to dismantle every form of spiritual oppression, break chains, and walk in the fullness of divine freedom.",
    pdfKey: "DOC-20240115-WA0004._ad9e4d58.pdf",
    pdfUrl: "/manus-storage/DOC-20240115-WA0004._ad9e4d58.pdf",
    coverKey: "DOC-20240115-WA0004.-001_ec2a6aa9.jpg",
    coverUrl: "/manus-storage/DOC-20240115-WA0004.-001_ec2a6aa9.jpg",
    isbn: null,
    featured: "0",
    downloadCount: 0,
  },
];

for (const book of booksData) {
  try {
    await connection.execute(
      `INSERT IGNORE INTO books (slug, title, subtitle, author, publisher, year, pages, fileSizeBytes, category, description, pdfKey, pdfUrl, coverKey, coverUrl, isbn, featured, downloadCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [book.slug, book.title, book.subtitle, book.author, book.publisher, book.year, book.pages, book.fileSizeBytes, book.category, book.description, book.pdfKey, book.pdfUrl, book.coverKey, book.coverUrl, book.isbn, book.featured, book.downloadCount]
    );
    console.log(`✓ Seeded: ${book.title}`);
  } catch (err) {
    console.error(`✗ Failed: ${book.title}`, err.message);
  }
}

await connection.end();
console.log("Seed complete!");
