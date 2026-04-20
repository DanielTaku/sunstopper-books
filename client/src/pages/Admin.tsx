/* ============================================================
   GOLDEN SANCTUARY — Admin Panel
   Book management: upload, edit metadata, delete
   Only accessible to users with role = 'admin'
   ============================================================ */

import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen, Upload, Trash2, Edit3, X, Check, Plus,
  FileText, Image, ArrowLeft, Loader2, Star, StarOff
} from "lucide-react";
import { Link } from "wouter";
import type { DbBook } from "@/components/BookCard";

const CATEGORIES = [
  "Spiritual Guidance",
  "Christian Living",
  "Prayer & Warfare",
  "Life Wisdom",
  "Prophecy",
  "Marriage & Family",
  "Other",
];

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ── Upload Form ───────────────────────────────────────────────────────────────

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState<string>("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [featured, setFeatured] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.books.upload.useMutation({
    onSuccess: () => {
      toast.success("Book uploaded successfully!");
      onSuccess();
      // Reset form
      setTitle(""); setSubtitle(""); setAuthor(""); setPublisher("");
      setYear(""); setCategory(CATEGORIES[0]); setDescription("");
      setIsbn(""); setFeatured(false); setPdfFile(null); setCoverFile(null);
    },
    onError: (err) => {
      toast.error(`Upload failed: ${err.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { toast.error("Please select a PDF file"); return; }
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!author.trim()) { toast.error("Author is required"); return; }

    setUploading(true);
    try {
      const pdfBase64 = await toBase64(pdfFile);
      let coverBase64: string | undefined;
      let coverMimeType: string | undefined;
      let coverFilename: string | undefined;
      if (coverFile) {
        coverBase64 = await toBase64(coverFile);
        coverMimeType = coverFile.type;
        coverFilename = coverFile.name;
      }

      await uploadMutation.mutateAsync({
        slug: slugify(title),
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        author: author.trim(),
        publisher: publisher.trim() || undefined,
        year: year ? parseInt(year) : undefined,
        category,
        description: description.trim() || undefined,
        isbn: isbn.trim() || undefined,
        featured,
        pdfBase64,
        pdfMimeType: pdfFile.type || "application/pdf",
        pdfFilename: pdfFile.name,
        pdfSizeBytes: pdfFile.size,
        coverBase64,
        coverMimeType,
        coverFilename,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PDF */}
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            PDF File *
          </label>
          <div
            onClick={() => pdfRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              pdfFile
                ? "border-[oklch(0.27_0.07_155)] bg-[oklch(0.27_0.07_155/0.05)]"
                : "border-[oklch(0.87_0.025_80)] hover:border-[oklch(0.72_0.12_75)]"
            }`}
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-[oklch(0.72_0.12_75)]" />
            {pdfFile ? (
              <div>
                <p className="text-sm font-body text-[oklch(0.27_0.07_155)] truncate">{pdfFile.name}</p>
                <p className="text-xs text-[oklch(0.55_0.025_80)]">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            ) : (
              <p className="text-sm text-[oklch(0.55_0.025_80)] font-body">Click to select PDF</p>
            )}
          </div>
          <input
            ref={pdfRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Cover Image (optional)
          </label>
          <div
            onClick={() => coverRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              coverFile
                ? "border-[oklch(0.27_0.07_155)] bg-[oklch(0.27_0.07_155/0.05)]"
                : "border-[oklch(0.87_0.025_80)] hover:border-[oklch(0.72_0.12_75)]"
            }`}
          >
            <Image className="w-8 h-8 mx-auto mb-2 text-[oklch(0.72_0.12_75)]" />
            {coverFile ? (
              <p className="text-sm font-body text-[oklch(0.27_0.07_155)] truncate">{coverFile.name}</p>
            ) : (
              <p className="text-sm text-[oklch(0.55_0.025_80)] font-body">Click to select image</p>
            )}
          </div>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)] focus:border-[oklch(0.72_0.12_75)]"
            placeholder="Book title"
          />
        </div>
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Subtitle</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)]"
            placeholder="Optional subtitle"
          />
        </div>
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Author *</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)]"
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Publisher</label>
          <input
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)]"
            placeholder="Publisher name"
          />
        </div>
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={1900}
            max={2100}
            className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)]"
            placeholder="2024"
          />
        </div>
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)] bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>ISBN</label>
          <input
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)]"
            placeholder="Optional ISBN"
          />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-body transition-colors ${
              featured
                ? "border-[oklch(0.72_0.12_75)] bg-[oklch(0.72_0.12_75/0.1)] text-[oklch(0.45_0.03_80)]"
                : "border-[oklch(0.87_0.025_80)] text-[oklch(0.55_0.025_80)]"
            }`}
          >
            {featured ? <Star className="w-4 h-4 text-[oklch(0.72_0.12_75)]" /> : <StarOff className="w-4 h-4" />}
            {featured ? "Featured" : "Not Featured"}
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-[oklch(0.87_0.025_80)] rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)] resize-none"
          placeholder="Brief description of the book..."
        />
      </div>

      <button
        type="submit"
        disabled={uploading || !pdfFile}
        className="download-btn w-full py-3 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-60"
      >
        {uploading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Uploading to Storage...</>
        ) : (
          <><Upload className="w-4 h-4" /> Upload Book</>
        )}
      </button>
    </form>
  );
}

// ── Book Row ──────────────────────────────────────────────────────────────────

function BookRow({ book, onDeleted }: { book: DbBook; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteMutation = trpc.books.delete.useMutation({
    onSuccess: () => {
      toast.success(`"${book.title}" deleted`);
      onDeleted();
    },
    onError: (err) => toast.error(`Delete failed: ${err.message}`),
  });

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await deleteMutation.mutateAsync({ id: book.id });
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <tr className="border-b border-[oklch(0.93_0.02_85)] hover:bg-[oklch(0.97_0.015_85/0.5)] transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-10 h-14 object-cover rounded shadow-sm border border-[oklch(0.87_0.025_80)] flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-14 bg-[oklch(0.93_0.02_85)] rounded flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-[oklch(0.72_0.12_75/0.5)]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm text-[oklch(0.15_0.01_60)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {book.title}
              {book.featured === "1" && <Star className="inline w-3 h-3 text-[oklch(0.72_0.12_75)] ml-1 mb-0.5" />}
            </p>
            {book.subtitle && <p className="text-xs text-[oklch(0.55_0.025_80)] italic">{book.subtitle}</p>}
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-[oklch(0.45_0.03_80)] font-body">{book.author}</td>
      <td className="py-3 px-4">
        {book.category && (
          <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ fontFamily: "'Cinzel', serif", background: "oklch(0.27 0.07 155 / 0.1)", color: "oklch(0.27 0.07 155)" }}>
            {book.category}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-[oklch(0.55_0.025_80)] font-body text-center">
        {book.downloadCount.toLocaleString()}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          <a
            href={book.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-[oklch(0.93_0.02_85)] text-[oklch(0.55_0.025_80)] hover:text-[oklch(0.27_0.07_155)] transition-colors"
            title="View PDF"
          >
            <FileText className="w-4 h-4" />
          </a>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`p-1.5 rounded transition-colors ${
              confirmDelete
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "hover:bg-[oklch(0.93_0.02_85)] text-[oklch(0.55_0.025_80)] hover:text-red-500"
            }`}
            title={confirmDelete ? "Click again to confirm" : "Delete book"}
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmDelete ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          </button>
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="p-1.5 rounded hover:bg-[oklch(0.93_0.02_85)] text-[oklch(0.55_0.025_80)] transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Admin Page ────────────────────────────────────────────────────────────────

export default function Admin() {
  const { user, loading } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const utils = trpc.useUtils();
  const { data: books = [], isLoading: booksLoading, refetch } = trpc.books.list.useQuery();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.015_85)]">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.72_0.12_75)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.015_85)]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-[oklch(0.72_0.12_75/0.4)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[oklch(0.15_0.01_60)] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Admin Access Required
          </h2>
          <p className="text-[oklch(0.45_0.03_80)] font-body mb-4">Please sign in with an admin account.</p>
          <Link href="/" className="text-[oklch(0.72_0.12_75)] hover:underline font-body text-sm">
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.015_85)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[oklch(0.15_0.01_60)] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Access Denied
          </h2>
          <p className="text-[oklch(0.45_0.03_80)] font-body mb-4">You do not have admin privileges.</p>
          <Link href="/" className="text-[oklch(0.72_0.12_75)] hover:underline font-body text-sm">
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.015_85)]">
      {/* Header */}
      <header
        className="py-4 px-6 border-b border-[oklch(0.72_0.12_75/0.15)] flex items-center justify-between"
        style={{ background: "oklch(0.18 0.06 155)" }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[oklch(0.72_0.12_75)] hover:text-[oklch(0.85_0.09_80)] transition-colors flex items-center gap-1.5 text-sm font-body">
            <ArrowLeft className="w-4 h-4" />
            Library
          </Link>
          <div className="h-4 w-px bg-[oklch(0.72_0.12_75/0.3)]" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[oklch(0.72_0.12_75)] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-[oklch(0.15_0.01_60)]" />
            </div>
            <span className="text-[oklch(0.97_0.015_85)] text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
              Admin Panel
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[oklch(0.72_0.12_75)] text-xs font-body">{user.name ?? user.email}</span>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="download-btn px-4 py-2 rounded text-sm flex items-center gap-1.5"
          >
            {showUpload ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showUpload ? "Close" : "Add Book"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Upload Form */}
        {showUpload && (
          <div className="bg-white rounded-xl border border-[oklch(0.87_0.025_80)] shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-5 h-5 text-[oklch(0.72_0.12_75)]" />
              <h2 className="text-xl font-bold text-[oklch(0.15_0.01_60)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Upload New Book
              </h2>
            </div>
            <UploadForm
              onSuccess={() => {
                setShowUpload(false);
                refetch();
              }}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Books", value: books.length },
            { label: "Total Downloads", value: books.reduce((s, b) => s + b.downloadCount, 0).toLocaleString() },
            { label: "Featured Books", value: books.filter((b) => b.featured === "1").length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg border border-[oklch(0.87_0.025_80)] p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[oklch(0.27_0.07_155)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {value}
              </div>
              <div className="text-xs text-[oklch(0.55_0.025_80)] font-body tracking-wide mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl border border-[oklch(0.87_0.025_80)] shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-[oklch(0.93_0.02_85)] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[oklch(0.15_0.01_60)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Book Library
            </h2>
            <span className="text-xs text-[oklch(0.55_0.025_80)] font-body">{books.length} books</span>
          </div>

          {booksLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[oklch(0.72_0.12_75)]" />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-10 h-10 text-[oklch(0.72_0.12_75/0.3)] mx-auto mb-3" />
              <p className="text-[oklch(0.55_0.025_80)] font-body">No books yet. Upload your first book above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[oklch(0.87_0.025_80)] bg-[oklch(0.97_0.015_85)]">
                    <th className="text-left py-3 px-4 text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)]" style={{ fontFamily: "'Cinzel', serif" }}>Book</th>
                    <th className="text-left py-3 px-4 text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)]" style={{ fontFamily: "'Cinzel', serif" }}>Author</th>
                    <th className="text-left py-3 px-4 text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)]" style={{ fontFamily: "'Cinzel', serif" }}>Category</th>
                    <th className="text-center py-3 px-4 text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)]" style={{ fontFamily: "'Cinzel', serif" }}>Downloads</th>
                    <th className="text-right py-3 px-4 text-xs font-cinzel tracking-widest uppercase text-[oklch(0.45_0.03_80)]" style={{ fontFamily: "'Cinzel', serif" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <BookRow
                      key={book.id}
                      book={book as DbBook}
                      onDeleted={() => refetch()}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
