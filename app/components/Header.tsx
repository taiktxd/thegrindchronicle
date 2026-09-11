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

    // Điều hướng người dùng tới trang search với từ khóa
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'NBA', href: '/category/nba' },
    { name: 'LEGENDS', href: '/category/legends' },
    { name: 'MINDSET', href: '/category/mindset' },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full bg-[#FBFAF7] text-[#1A1A1A]">
      {/* ===== Utility bar — cảm giác "tòa soạn" ===== */}
      <div className="w-full bg-[#e67e22] text-[#D9D9D9]">
        <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-between text-[11px] tracking-wide">
          <span className="hidden sm:inline">{today}</span>
          <div className="flex items-center gap-4">
            <a
              href="https://www.threads.net/@hoop_soul"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-500 transition-colors"
            >
              Threads
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-500 transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* ===== Masthead ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 flex flex-col items-center">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="The Grind Chronicle"
            width={80}
            height={80}
            style={{ width: 56, height: 56, objectFit: 'contain' }}
          />

          {/* Chữ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 700,
                letterSpacing: '0.01em',
                fontSize: 'clamp(1.9rem, 4.5vw, 3.1rem)',
                textTransform: 'uppercase',
                color: '#1A1A1A',
              }}
            >
              The Grind Chronicle
            </span>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: 'italic',
                color: '#7A7A7A',
                fontSize: '0.95rem',
                marginTop: 5,
              }}
            >
              Stories Behind Greatness.
            </span>
          </div>
        </div>
      </div>

      {/* ===== Thanh điều hướng ===== */}
      <div className="w-full border-b-2 border-[#e67e22]">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-around">
          <div></div>
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 md:gap-8 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[13px] md:text-sm font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] py-4 whitespace-nowrap
                           after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px]
                           after:bg-amber-600 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search — thu gọn kiểu báo chí, bấm icon mới mở ô nhập */}
          <div className="flex items-center">
            {searchOpen && (
              <form onSubmit={handleSearch} className="flex items-center mr-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search stories…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-36 sm:w-48 md:w-56 border-b border-[#1A1A1A] bg-transparent px-1 py-1 text-sm
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
              title="Search"
              className="p-2 text-[#1A1A1A] hover:text-amber-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
