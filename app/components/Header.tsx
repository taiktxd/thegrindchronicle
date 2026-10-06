'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navItems = [
    { name: 'NBA', href: '/category/nba' },
    { name: 'LEGENDS', href: '/category/legends' },
    { name: 'MINDSET', href: '/category/mindset' },
    { name: 'CONTACT', href: '/contact' },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full bg-[#fcfbf9] text-[#1a1a1a] border-b border-neutral-200">
      {/* ===== 1. TOP UTILITY BAR ===== */}
      <div className="w-full border-b border-neutral-200/80 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 h-9 flex items-center justify-between text-[11px] tracking-wider text-neutral-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-700">{today}</span>
            <span className="text-neutral-300">|</span>
            <span className="uppercase text-[10px] tracking-widest text-neutral-500 font-semibold">
              Rucker Park, NYC
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-[11px] tracking-wider">
              <a
                href="https://www.threads.net/@hoop_soul"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                Threads
              </a>
              <span className="text-neutral-300">/</span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                Facebook
              </a>
            </div>

            <span className="text-neutral-200">|</span>

            <button
              type="button"
              className="text-[10px] uppercase tracking-widest font-medium px-3 py-1 rounded-full border border-neutral-800 text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ===== 2. MASTHEAD WORDMARK ===== */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 flex flex-col items-center justify-center text-center">
        <Link href="/" className="inline-flex flex-col items-center group">
          <h1
            className="font-serif font-black uppercase text-neutral-950 transition-opacity group-hover:opacity-90"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
            }}
          >
            The Grind Chronicle
          </h1>
          <p
            className="italic text-neutral-500 font-serif text-xs sm:text-sm tracking-wide mt-2"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Stories Behind Greatness.
          </p>
        </Link>
      </div>

      {/* ===== 3. NAVIGATION (LOGO TRONG SUỐT, KHÔNG CÒN GẠCH DỌC) ===== */}
      <div className="w-full border-t border-neutral-200 bg-[#fcfbf9]">
        <div className="relative max-w-6xl mx-auto px-4 h-12 flex items-center justify-center">
          
          <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto min-w-0 [&::-webkit-scrollbar]:hidden">
            {/* LOGO NÚT HOME: Tinh gọn, dùng ảnh /logo.png đã xóa nền */}
            <Link
              href="/"
              title="Home"
              className="flex items-center shrink-0 hover:scale-105 transition-transform"
            >
              <div className="relative w-6 h-6 sm:w-7 sm:h-7">
                <Image
                  src="/logo.png"
                  alt="TGC Home"
                  fill
                  sizes="28px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Danh mục */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-neutral-700 hover:text-neutral-950 py-3.5 whitespace-nowrap shrink-0 transition-colors
                           after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px]
                           after:bg-neutral-900 after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Ô Tìm kiếm góc phải */}
          <div className="absolute right-4 flex items-center">
            {searchOpen && (
              <form onSubmit={handleSearch} className="flex items-center mr-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search stories…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-28 sm:w-44 border-b border-neutral-900 bg-transparent px-1 py-0.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                />
              </form>
            )}
            <button
              type="button"
              onClick={() => {
                if (searchOpen && searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  return;
                }
                setSearchOpen((v) => !v);
              }}
              title="Search"
              aria-label="Search"
              className="p-1.5 text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}