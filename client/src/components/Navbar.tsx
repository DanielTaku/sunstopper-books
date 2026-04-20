/* ============================================================
   GOLDEN SANCTUARY — Navbar Component
   Dark forest green background, gold accents, Cinzel Decorative logo
   ============================================================ */

import { useState, useEffect } from "react";
import { BookOpen, Menu, X, Settings } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.18_0.06_155/0.97)] shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-[oklch(0.18_0.06_155/0.85)] backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-full bg-[oklch(0.72_0.12_75)] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-[oklch(0.15_0.01_60)]" />
          </div>
          <span
            className="font-cinzel-decorative text-[oklch(0.97_0.015_85)] text-sm md:text-base leading-tight tracking-wide"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Sun Stopper<br className="hidden sm:block" />
            <span className="text-[oklch(0.72_0.12_75)]"> Books</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Library", id: "library" },
            { label: "About", id: "about" },
            { label: "Contact", id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="font-cinzel text-sm text-[oklch(0.85_0.02_85)] hover:text-[oklch(0.72_0.12_75)] transition-colors tracking-widest uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {item.label}
            </button>
          ))}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="font-cinzel text-sm text-[oklch(0.72_0.12_75)] hover:text-[oklch(0.85_0.09_80)] transition-colors tracking-widest uppercase flex items-center gap-1"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
          <button
            onClick={() => scrollTo("library")}
            className="download-btn px-5 py-2 rounded text-sm shadow-md"
          >
            Browse Books
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[oklch(0.97_0.015_85)] hover:text-[oklch(0.72_0.12_75)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[oklch(0.18_0.06_155/0.98)] border-t border-[oklch(0.72_0.12_75/0.2)] px-4 py-4 flex flex-col gap-4">
          {[
            { label: "Library", id: "library" },
            { label: "About", id: "about" },
            { label: "Contact", id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left font-cinzel text-sm text-[oklch(0.85_0.02_85)] hover:text-[oklch(0.72_0.12_75)] transition-colors tracking-widest uppercase py-2 border-b border-[oklch(0.72_0.12_75/0.1)]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("library")}
            className="download-btn px-5 py-2.5 rounded text-sm shadow-md w-full"
          >
            Browse Books
          </button>
        </div>
      )}
    </header>
  );
}
