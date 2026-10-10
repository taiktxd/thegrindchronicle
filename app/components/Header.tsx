'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    { name: 'HOME', href: '/' },
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
    <header className="w-full bg-[#FBFAF7] text-[#1A1A1A]">
      {/* ===== Top utility bar ===== */}
      <div className="w-full bg-[#e67e22] text-[#D9D9D9]">
        <div className="max-w-6xl mx-auto px-4 h-7 sm:h-8 flex items-center justify-between text-[11px] tracking-wide">
          <span className="hidden sm:inline">{today}</span>
          <div className="flex items-center gap-4 ml-auto font-medium">
            <a
              href="https://www.threads.net/@hoop_soul"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Threads
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* ===== Masthead: Compact padding to bring content above fold ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-3.5 sm:pt-4 pb-2.5 sm:pb-3 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 sm:gap-3.5 text-center no-underline text-inherit group">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="The Grind Chronicle logo"
            width={64}
            height={64}
            priority
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
          />

          {/* Title & Tagline */}
          <div className="flex flex-col items-center leading-tight">
            <span
              className="uppercase font-bold tracking-tight"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: '0.01em',
                fontSize: 'clamp(1.35rem, 4vw, 2.35rem)',
                color: '#1A1A1A',
              }}
            >
              The Grind Chronicle
            </span>
            <span
              className="italic mt-0.5"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: '#7A7A7A',
                fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
              }}
            >
              Stories Behind Greatness.
            </span>
          </div>
        </Link>
      </div>

      {/* ===== Sticky & Slim Navigation Bar ===== */}
      <div className="sticky top-0 z-50 w-full bg-[#FBFAF7]/95 backdrop-blur-md border-b-2 border-[#e67e22] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all">
        <div className="max-w-6xl mx-auto px-4 h-10 sm:h-11 grid grid-cols-[0_1fr_auto] sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div aria-hidden className="hidden sm:block" />

          {/* Navigation Links */}
          <nav className="flex items-center gap-5 sm:gap-6 md:gap-8 overflow-x-auto min-w-0 justify-self-start sm:justify-self-center [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[11px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] py-2 sm:py-2.5 whitespace-nowrap shrink-0 hover:text-amber-600 transition-colors
                           after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px]
                           after:bg-amber-600 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex items-center shrink-0 justify-self-end">
            {searchOpen && (
              <form onSubmit={handleSearch} className="flex items-center mr-1.5">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search stories…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-28 sm:w-44 md:w-52 border-b border-[#1A1A1A] bg-transparent px-1 py-0.5 text-xs sm:text-sm
                             text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none"
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
              title="Search stories"
              aria-label="Search stories"
              className="p-1.5 text-[#1A1A1A] hover:text-amber-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
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