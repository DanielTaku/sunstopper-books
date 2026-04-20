/* ============================================================
   GOLDEN SANCTUARY — BookCard Component
   Accepts DB Book type from tRPC; handles download + count
   ============================================================ */

import { useState } from "react";
import { Download, BookOpen, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

// Matches the DB schema Book type returned from tRPC
export interface DbBook {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  author: string;
  publisher?: string | null;
  year?: number | null;
  pages?: number | null;
  fileSizeBytes?: number | null;
  category?: string | null;
  description?: string | null;
  pdfKey: string;
  coverKey?: string | null;
  pdfUrl: string;
  coverUrl?: string | null;
  isbn?: string | null;
  featured: "0" | "1";
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookCardProps {
  book: DbBook;
  index: number;
  onDownload?: (id: number) => void;
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BookCard({ book, index, onDownload }: BookCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    toast.success(`Downloading "${book.title}"...`, {
      description: "Your PDF will be ready shortly.",
      duration: 3000,
    });

    // Record download in background
    onDownload?.(book.id);

    try {
      const response = await fetch(book.pdfUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: direct link
      const a = document.createElement("a");
      a.href = book.pdfUrl;
      a.download = `${book.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  const delayClass = `delay-${Math.min((index % 4) * 100 + 100, 500)}`;
  const fileSize = formatFileSize(book.fileSizeBytes);

  return (
    <article
      className={`book-card-hover bg-white rounded-lg overflow-hidden shadow-md border border-[oklch(0.87_0.025_80)] animate-fade-up opacity-0 ${delayClass} flex flex-col`}
      style={{ animationFillMode: "forwards" }}
    >
      {/* Book Cover */}
      <div className="relative overflow-hidden bg-[oklch(0.93_0.02_85)] aspect-[3/4] flex-shrink-0">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[oklch(0.93_0.02_85)]">
            <BookOpen className="w-16 h-16 text-[oklch(0.72_0.12_75/0.4)]" />
          </div>
        )}
        {/* Category badge */}
        {book.category && (
          <div className="absolute top-3 left-3">
            <span
              className="text-[10px] font-cinzel tracking-widest uppercase px-2.5 py-1 rounded-sm"
              style={{
                fontFamily: "'Cinzel', serif",
                background: "oklch(0.27 0.07 155 / 0.92)",
                color: "oklch(0.72 0.12 75)",
                backdropFilter: "blur(4px)",
              }}
            >
              {book.category}
            </span>
          </div>
        )}
        {/* Pages badge */}
        {book.pages && (
          <div className="absolute bottom-3 right-3">
            <span
              className="text-[10px] font-body tracking-wide px-2 py-1 rounded-sm flex items-center gap-1"
              style={{
                background: "oklch(0.15 0.01 60 / 0.75)",
                color: "oklch(0.97 0.015 85)",
                backdropFilter: "blur(4px)",
              }}
            >
              <FileText className="w-3 h-3" />
              {book.pages.toLocaleString()} pages
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 gold-border-left">
        {/* Title */}
        <h3
          className="font-display text-xl font-semibold leading-tight text-[oklch(0.15_0.01_60)] mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {book.title}
        </h3>
        {book.subtitle && (
          <p
            className="text-[oklch(0.72_0.12_75)] text-sm font-display italic mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {book.subtitle}
          </p>
        )}

        {/* Author */}
        <p className="text-[oklch(0.45_0.03_80)] text-xs font-body tracking-wide mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          {book.author}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-[oklch(0.55_0.025_80)] mb-3 font-body flex-wrap">
          {book.year && <span>{book.year}</span>}
          {fileSize && (
            <>
              <span className="text-[oklch(0.72_0.12_75)]">·</span>
              <span>{fileSize}</span>
            </>
          )}
          {book.publisher && (
            <>
              <span className="text-[oklch(0.72_0.12_75)]">·</span>
              <span className="truncate">{book.publisher}</span>
            </>
          )}
        </div>

        {/* Description (expandable) */}
        <div className="mb-4 flex-1">
          <p
            className={`text-sm text-[oklch(0.35_0.02_70)] font-body leading-relaxed transition-all duration-300 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {book.description ?? ""}
          </p>
          {(book.description?.length ?? 0) > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 text-xs text-[oklch(0.72_0.12_75)] hover:text-[oklch(0.65_0.14_70)] flex items-center gap-1 transition-colors font-body"
            >
              {expanded ? (
                <>Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Download count */}
        {book.downloadCount > 0 && (
          <p className="text-[10px] text-[oklch(0.65_0.025_80)] font-body mb-2 flex items-center gap-1">
            <Download className="w-3 h-3" />
            {book.downloadCount.toLocaleString()} downloads
          </p>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="download-btn w-full py-2.5 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-70"
        >
          <Download className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`} />
          {downloading ? "Preparing..." : "Free Download"}
        </button>
      </div>
    </article>
  );
}
