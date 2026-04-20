/* ============================================================
   GOLDEN SANCTUARY — Home Page
   Sections: Hero | Stats | Library | About | Contact | Footer
   ============================================================ */

import { useState, useEffect, useRef } from "react";
import { BookOpen, Download, Star, Users, ChevronDown, Mail, Phone, Globe, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { books, categories } from "@/lib/books";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663580421822/BJ5mVUkgGhXniFm8HpxpPF/hero-bg-Jk3ngQtUXX3qTADHb32uVk.webp";
const TEXTURE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663580421822/BJ5mVUkgGhXniFm8HpxpPF/banner-texture-nHAuis5hmyNhVXdTCWMYwn.webp";

// Simple intersection observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [totalDownloads] = useState(2847);

  const { ref: statsRef, inView: statsInView } = useInView();
  const { ref: libraryRef, inView: libraryInView } = useInView();
  const { ref: aboutRef, inView: aboutInView } = useInView();

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || book.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBooks = books.filter((b) => b.featured);

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.015_85)]">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="hero-overlay absolute inset-0" />
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12 pt-20">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
              <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
              <span
                className="text-[oklch(0.72_0.12_75)] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Free Digital Library
              </span>
              <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
            </div>

            {/* Main Title */}
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[oklch(0.97_0.015_85)] leading-[1.05] mb-4 animate-fade-up opacity-0 delay-100"
              style={{ fontFamily: "'Cormorant Garamond', serif", animationFillMode: "forwards" }}
            >
              Sun Stopper
              <br />
              <span className="gold-shimmer italic">Books Library</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-[oklch(0.85_0.02_85)] text-lg md:text-xl font-body leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up opacity-0 delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              Discover and freely download anointed spiritual books by{" "}
              <em className="text-[oklch(0.85_0.09_80)]">Apostle Daniel Munyukwa</em> and other
              Spirit-led authors. Knowledge that transforms lives.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up opacity-0 delay-300"
              style={{ animationFillMode: "forwards" }}
            >
              <button
                onClick={() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" })}
                className="download-btn px-8 py-3.5 rounded-sm text-base shadow-xl flex items-center gap-2 justify-center"
              >
                <BookOpen className="w-5 h-5" />
                Browse All Books
              </button>
              <button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3.5 rounded-sm text-base border border-[oklch(0.72_0.12_75/0.5)] text-[oklch(0.97_0.015_85)] hover:border-[oklch(0.72_0.12_75)] hover:bg-[oklch(0.72_0.12_75/0.1)] transition-all flex items-center gap-2 justify-center font-body"
              >
                About the Author
              </button>
            </div>

            {/* Quick stats */}
            <div
              className="flex items-center gap-6 mt-10 justify-center lg:justify-start animate-fade-up opacity-0 delay-400"
              style={{ animationFillMode: "forwards" }}
            >
              {[
                { value: books.length, label: "Books Available" },
                { value: `${totalDownloads.toLocaleString()}+`, label: "Downloads" },
                { value: "100%", label: "Free" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-2xl font-bold text-[oklch(0.72_0.12_75)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[oklch(0.75_0.02_85)] text-xs font-body tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Featured book covers */}
          <div
            className="hidden lg:flex flex-shrink-0 items-end gap-4 animate-fade-up opacity-0 delay-300"
            style={{ animationFillMode: "forwards" }}
          >
            {featuredBooks.map((book, i) => (
              <div
                key={book.id}
                className={`relative rounded-lg overflow-hidden shadow-2xl border-2 border-[oklch(0.72_0.12_75/0.3)] transition-transform duration-500 hover:-translate-y-3 ${
                  i === 0 ? "w-44 h-64" : "w-36 h-52"
                }`}
                style={{ transform: i === 0 ? "rotate(-2deg)" : "rotate(2deg)" }}
              >
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p
                    className="text-[oklch(0.97_0.015_85)] text-xs font-display font-semibold leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {book.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[oklch(0.72_0.12_75)]" />
        </div>
      </section>

      {/* ── STATS BANNER ─────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="py-12 relative overflow-hidden"
        style={{
          background: "oklch(0.27 0.07 155)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${TEXTURE_BG})`,
            backgroundSize: "cover",
          }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, value: books.length, label: "Books in Library", suffix: "" },
              { icon: Download, value: totalDownloads, label: "Total Downloads", suffix: "+" },
              { icon: Star, value: 100, label: "Free to Access", suffix: "%" },
              { icon: Users, value: 12, label: "Countries Reached", suffix: "+" },
            ].map(({ icon: Icon, value, label, suffix }, i) => (
              <div
                key={label}
                className={`text-center ${statsInView ? `animate-fade-up opacity-0 delay-${i * 100 + 100}` : "opacity-0"}`}
                style={{ animationFillMode: "forwards" }}
              >
                <div className="w-12 h-12 rounded-full bg-[oklch(0.72_0.12_75/0.15)] border border-[oklch(0.72_0.12_75/0.3)] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[oklch(0.72_0.12_75)]" />
                </div>
                <div
                  className="text-3xl font-bold text-[oklch(0.97_0.015_85)]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {value.toLocaleString()}{suffix}
                </div>
                <div className="text-[oklch(0.72_0.12_75)] text-xs font-body tracking-widest uppercase mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIBRARY ──────────────────────────────────────────── */}
      <section id="library" className="py-20" ref={libraryRef}>
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section header */}
          <div
            className={`mb-12 ${libraryInView ? "animate-fade-up opacity-0" : "opacity-0"}`}
            style={{ animationFillMode: "forwards" }}
          >
            <div className="section-divider mb-6">
              <span
                className="text-[oklch(0.72_0.12_75)] text-xs tracking-[0.3em] uppercase whitespace-nowrap"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                The Collection
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[oklch(0.15_0.01_60)] text-center mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Book Library
            </h2>
            <p className="text-center text-[oklch(0.45_0.03_80)] font-body max-w-xl mx-auto">
              Every book is available for free download. No sign-up required. Simply click and receive wisdom.
            </p>
          </div>

          {/* Search & Filter */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-10 ${libraryInView ? "animate-fade-up opacity-0 delay-100" : "opacity-0"}`}
            style={{ animationFillMode: "forwards" }}
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.55_0.025_80)]" />
              <input
                type="text"
                placeholder="Search by title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded border border-[oklch(0.87_0.025_80)] bg-white text-[oklch(0.15_0.01_60)] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_75/0.4)] focus:border-[oklch(0.72_0.12_75)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.55_0.025_80)] hover:text-[oklch(0.15_0.01_60)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded text-xs font-cinzel tracking-wide transition-all ${
                  !activeCategory
                    ? "bg-[oklch(0.27_0.07_155)] text-[oklch(0.97_0.015_85)]"
                    : "bg-white border border-[oklch(0.87_0.025_80)] text-[oklch(0.45_0.03_80)] hover:border-[oklch(0.72_0.12_75)]"
                }`}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  className={`px-4 py-2 rounded text-xs font-cinzel tracking-wide transition-all ${
                    activeCategory === cat
                      ? "bg-[oklch(0.27_0.07_155)] text-[oklch(0.97_0.015_85)]"
                      : "bg-white border border-[oklch(0.87_0.025_80)] text-[oklch(0.45_0.03_80)] hover:border-[oklch(0.72_0.12_75)]"
                  }`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-[oklch(0.72_0.12_75/0.4)] mx-auto mb-4" />
              <p className="text-[oklch(0.45_0.03_80)] font-body">
                No books found matching your search.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                className="mt-4 text-[oklch(0.72_0.12_75)] text-sm hover:underline font-body"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section
        id="about"
        ref={aboutRef}
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${TEXTURE_BG})`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[oklch(0.97_0.015_85/0.92)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div
              className={`${aboutInView ? "animate-fade-up opacity-0" : "opacity-0"}`}
              style={{ animationFillMode: "forwards" }}
            >
              <div className="section-divider mb-6">
                <span
                  className="text-[oklch(0.72_0.12_75)] text-xs tracking-[0.3em] uppercase whitespace-nowrap"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  The Author
                </span>
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold text-[oklch(0.15_0.01_60)] text-center mb-12"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                About Sun Stopper Ministry
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Left: About text */}
              <div
                className={`${aboutInView ? "animate-fade-up opacity-0 delay-100" : "opacity-0"}`}
                style={{ animationFillMode: "forwards" }}
              >
                <div className="gold-border-left pl-5">
                  <h3
                    className="text-2xl font-semibold text-[oklch(0.27_0.07_155)] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Apostle Daniel Munyukwa
                  </h3>
                  <p className="text-[oklch(0.35_0.02_70)] font-body leading-relaxed mb-4">
                    Known as the <strong className="text-[oklch(0.27_0.07_155)]">Sun Stopper Commander</strong>, Apostle
                    Joshua T.D. Munyukwa is a Spirit-filled author, teacher, and founder of{" "}
                    <em>Blessed Souls Fellowship</em>. His writings draw from deep biblical study and
                    prophetic revelation, equipping believers for victorious Christian living.
                  </p>
                  <p className="text-[oklch(0.35_0.02_70)] font-body leading-relaxed mb-4">
                    His books cover a wide spectrum of spiritual life — from dream interpretation and
                    marriage to practical wisdom for daily living — all grounded in the authority of
                    Scripture and the power of the Holy Spirit.
                  </p>
                  <p className="text-[oklch(0.35_0.02_70)] font-body leading-relaxed">
                    All books are made available <strong className="text-[oklch(0.27_0.07_155)]">completely free of charge</strong> as a
                    ministry to the body of Christ worldwide.
                  </p>
                </div>
              </div>

              {/* Right: Ministry highlights */}
              <div
                className={`${aboutInView ? "animate-fade-up opacity-0 delay-200" : "opacity-0"} space-y-4`}
                style={{ animationFillMode: "forwards" }}
              >
                {[
                  {
                    title: "Blessed Souls Fellowship",
                    desc: "A vibrant community of believers committed to spiritual growth, biblical teaching, and kingdom advancement.",
                  },
                  {
                    title: "Free Distribution Mission",
                    desc: "Every book in this library is offered freely, fulfilling the mandate to spread the Word without financial barriers.",
                  },
                  {
                    title: "Prophetic Literature",
                    desc: "Each publication carries a prophetic edge, addressing real spiritual needs with timely, anointed content.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-lg p-5 border border-[oklch(0.87_0.025_80)] shadow-sm gold-border-left"
                  >
                    <h4
                      className="font-semibold text-[oklch(0.27_0.07_155)] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm text-[oklch(0.45_0.03_80)] font-body leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-20"
        style={{ background: "oklch(0.27 0.07 155)" }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="section-divider mb-6">
            <span
              className="text-[oklch(0.72_0.12_75)] text-xs tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Get in Touch
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-[oklch(0.97_0.015_85)] text-center mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Contact the Ministry
          </h2>
          <p className="text-center text-[oklch(0.72_0.12_75)] font-body mb-12 max-w-lg mx-auto">
            For prayer requests, ministry inquiries, or to connect with Blessed Souls Fellowship.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Phone,
                label: "Phone / WhatsApp",
                value: "+263 718 048 983",
                value2: "+263 788 712 635",
                href: "tel:+263718048983",
              },
              {
                icon: Mail,
                label: "Email",
                value: "blessedsoulsfellowship@gmail.com",
                href: "mailto:blessedsoulsfellowship@gmail.com",
              },
              {
                icon: Globe,
                label: "Ministry",
                value: "Blessed Souls Fellowship",
                value2: "Zimbabwe",
                href: "#",
              },
            ].map(({ icon: Icon, label, value, value2, href }) => (
              <a
                key={label}
                href={href}
                className="bg-[oklch(0.35_0.07_155)] rounded-lg p-6 text-center hover:bg-[oklch(0.40_0.07_155)] transition-colors group border border-[oklch(0.72_0.12_75/0.15)]"
              >
                <div className="w-12 h-12 rounded-full bg-[oklch(0.72_0.12_75/0.15)] border border-[oklch(0.72_0.12_75/0.3)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[oklch(0.72_0.12_75/0.25)] transition-colors">
                  <Icon className="w-5 h-5 text-[oklch(0.72_0.12_75)]" />
                </div>
                <p
                  className="text-[oklch(0.72_0.12_75)] text-xs tracking-widest uppercase mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {label}
                </p>
                <p className="text-[oklch(0.97_0.015_85)] text-sm font-body">{value}</p>
                {value2 && <p className="text-[oklch(0.85_0.02_85)] text-sm font-body">{value2}</p>}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        className="py-8 border-t border-[oklch(0.72_0.12_75/0.15)]"
        style={{ background: "oklch(0.18 0.06 155)" }}
      >
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[oklch(0.72_0.12_75)] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[oklch(0.15_0.01_60)]" />
            </div>
            <span
              className="text-[oklch(0.97_0.015_85)] text-sm"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Sun Stopper Books
            </span>
          </div>
          <p className="text-[oklch(0.55_0.025_80)] text-xs font-body text-center">
            © {new Date().getFullYear()} Blessed Souls Fellowship · All books freely distributed for the glory of God
          </p>
          <div className="flex items-center gap-1 text-[oklch(0.55_0.025_80)] text-xs font-body">
            <Download className="w-3.5 h-3.5 text-[oklch(0.72_0.12_75)]" />
            <span>Free downloads · No registration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
