import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const newBooks = [
  {
    slug: "kuchema-kuda",
    title: "Kuchema Kuda",
    subtitle: null,
    author: "Kudakwashe Mutova",
    publisher: "Self-published",
    year: 2017,
    pages: 142,
    fileSizeBytes: 747638,
    category: "Spiritual Guidance",
    description: "A powerful spiritual work by Kudakwashe Mutova grounded in John 11:40 — 'If thou would believe thou should see the glory of God.' This book calls believers to a deeper place of prayer, faith, and crying out to God, revealing the transformative power that comes through wholehearted seeking of the Lord.",
    pdfKey: "Kuchemakuda-1_6434b6ba.pdf",
    pdfUrl: "/manus-storage/Kuchemakuda-1_6434b6ba.pdf",
    coverKey: "cover-kuchemakuda_34f873cb.jpg",
    coverUrl: "/manus-storage/cover-kuchemakuda_34f873cb.jpg",
    isbn: null,
    featured: "0",
    downloadCount: 0,
  },
  {
    slug: "ungamudii-mwari-wangu-vol1",
    title: "Ungamudii Mwari Wangu?",
    subtitle: "Volume One",
    author: "Kudakwashe Mutova",
    publisher: "Pearl Press Media",
    year: 2017,
    pages: 162,
    fileSizeBytes: 895184,
    category: "Life Wisdom",
    description: "Written in Shona, this compelling volume asks the profound question: 'Can you know my God?' Kudakwashe Mutova takes readers on a journey of faith, identity, and divine encounter, challenging every reader to move beyond religion into a genuine personal relationship with God. Published by Pearl Press Media, Zimbabwe.",
    pdfKey: "UngamudiiMwariwangu1_0d819851.pdf",
    pdfUrl: "/manus-storage/UngamudiiMwariwangu1_0d819851.pdf",
    coverKey: "cover-ungamudii1_02d70435.jpg",
    coverUrl: "/manus-storage/cover-ungamudii1_02d70435.jpg",
    isbn: null,
    featured: "1",
    downloadCount: 0,
  },
  {
    slug: "ungamudii-mwari-wangu-vol2",
    title: "Ungamudii Mwari Wangu?",
    subtitle: "Volume Two — Mission Impossible",
    author: "Kudakwashe Mutova",
    publisher: "Self-published",
    year: 2024,
    pages: 99,
    fileSizeBytes: 744646,
    category: "Life Wisdom",
    description: "The gripping second series of 'Ungamudii Mwari Wangu?' — subtitled 'Mission Impossible.' This Shona-language volume continues the spiritual and narrative journey, weaving real-life struggles with faith, family, and the faithfulness of God through seemingly impossible circumstances.",
    pdfKey: "UngamudiiMwariwangu2_1f5a18ed.pdf",
    pdfUrl: "/manus-storage/UngamudiiMwariwangu2_1f5a18ed.pdf",
    coverKey: "cover-ungamudii2_9d379b79.jpg",
    coverUrl: "/manus-storage/cover-ungamudii2_9d379b79.jpg",
    isbn: null,
    featured: "0",
    downloadCount: 0,
  },
  {
    slug: "under-the-shadow",
    title: "Under the Shadow",
    subtitle: null,
    author: "Kudakwashe Mutova",
    publisher: "Self-published",
    year: 2018,
    pages: 50,
    fileSizeBytes: 290202,
    category: "Spiritual Guidance",
    description: "Inspired by John 11:40 — 'If thou would believe thou should see the glory of God' — this book by Kudakwashe Mutova explores what it means to dwell under the shadow of the Almighty. A concise yet deeply impactful work on divine protection, trust, and abiding in God's presence through every season of life.",
    pdfKey: "UndertheShadow_078f1ba0.pdf",
    pdfUrl: "/manus-storage/UndertheShadow_078f1ba0.pdf",
    coverKey: "cover-undertheshadow_370eda81.jpg",
    coverUrl: "/manus-storage/cover-undertheshadow_370eda81.jpg",
    isbn: null,
    featured: "0",
    downloadCount: 0,
  },
];

for (const book of newBooks) {
  // Check if already exists
  const [rows] = await connection.execute("SELECT id FROM books WHERE slug = ?", [book.slug]);
  if (rows.length > 0) {
    console.log(`⚠ Already exists, skipping: ${book.title}`);
    continue;
  }

  await connection.execute(
    `INSERT INTO books (slug, title, subtitle, author, publisher, year, pages, fileSizeBytes, category, description, pdfKey, pdfUrl, coverKey, coverUrl, isbn, featured, downloadCount, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      book.slug, book.title, book.subtitle, book.author, book.publisher,
      book.year, book.pages, book.fileSizeBytes, book.category, book.description,
      book.pdfKey, book.pdfUrl, book.coverKey, book.coverUrl, book.isbn,
      book.featured, book.downloadCount,
    ]
  );
  console.log(`✓ Seeded: ${book.title}${book.subtitle ? " — " + book.subtitle : ""}`);
}

await connection.end();
console.log("New books seed complete!");
process.exit(0);
