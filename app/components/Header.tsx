'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import SubscribeModal from './SubscribeModal';

function subscribeToAuth(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('tgc_subscribed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('tgc_subscribed', callback);
  };
}

function getSubscriberSnapshot() {
  return typeof window !== 'undefined' ? localStorage.getItem('tgc_subscriber_email') : null;
}

function getServerSnapshot() {
  return null;
}

export default function Header() {
  // 1. TẤT CẢ CÁC HOOK ĐƯỢC GỌI Ở ĐẦU COMPONENT
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Đóng menu và ô tìm kiếm khi chuyển trang (Chuẩn React không dùng useEffect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }

  const subscriberEmail = useSyncExternalStore(
    subscribeToAuth,
    getSubscriberSnapshot,
    getServerSnapshot
  );

  // 2. CÁC HÀM XỬ LÝ SỰ KIỆN
  const handleSignOut = () => {
    localStorage.removeItem('tgc_subscriber_email');
    localStorage.removeItem('subscriber_email');
    document.cookie = 'tgc_subscriber_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
    window.dispatchEvent(new Event('tgc_subscribed'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  // 3. ẨN TOÀN BỘ HEADER CÔNG KHAI KHI Ở TRANG ADMIN
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'NBA', href: '/category/nba' },
    { name: 'LEGENDS', href: '/category/legends' },
    { name: 'MINDSET', href: '/category/mindset' },
    { name: 'CONTACT', href: '/contact' },
  ];

  const now = new Date();
  const desktopDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const mobileDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <header className="w-full bg-white text-neutral-900 border-b border-neutral-100 sticky top-0 z-40 bg-white/95 backdrop-blur-xs">
        {/* 1. TOP BAR */}
        <div className="w-full border-b border-neutral-100 bg-[#fcfbf9]/70">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 h-8 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
            
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-serif hidden sm:inline">{desktopDate}</span>
              <span className="font-serif inline sm:hidden text-[10px] uppercase tracking-wider font-semibold text-neutral-700">
                {mobileDate}
              </span>
              <span className="text-neutral-300 hidden md:inline">|</span>
              <span className="uppercase tracking-wider text-[10px] text-neutral-400 hidden md:inline">
                Rucker Park, NYC
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-[11px]">
                <a
                  href="https://www.threads.net/@grind_chronicle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  Threads
                </a>
                <span className="text-neutral-300">/</span>
                <a
                  href="https://www.facebook.com/profile.php?id=61595407708622"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  Facebook
                </a>
                <span className="text-neutral-300 mx-0.5">|</span>
              </div>

              {subscriberEmail ? (
                <div className="group relative flex items-center">
                  <button
                    type="button"
                    className="flex items-center gap-1 bg-neutral-900 text-white text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-medium shadow-2xs hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="max-w-[100px] sm:max-w-[130px] truncate">{subscriberEmail}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">✓</span>
                  </button>

                  <div className="hidden group-hover:block absolute right-0 top-full pt-1 z-50">
                    <div className="bg-white border border-neutral-200 shadow-lg rounded-lg p-2 min-w-[160px] text-left">
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-1">
                        Inner Circle Member
                      </p>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium py-1 w-full text-left transition-colors cursor-pointer"
                      >
                        Switch Email / Exit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubscribeOpen(true)}
                  className="border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer"
                >
                  SUBSCRIBE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. MASTHEAD */}
        <div className="max-w-6xl mx-auto px-4 pt-3 pb-2 text-center">
          <Link href="/" className="inline-block group">
            <h1
              className="font-black tracking-tight text-neutral-950 uppercase"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 'clamp(1.6rem, 5vw, 2.75rem)',
                lineHeight: '1.08',
              }}
            >
              The Grind Chronicle
            </h1>
            <p className="italic text-neutral-500 mt-1 font-serif text-[11px] sm:text-sm tracking-wide">
              Stories Behind Greatness.
            </p>
          </Link>
        </div>

        {/* 3. THANH NAVIGATION DESKTOP & MOBILE */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 border-t border-neutral-100">
          
          {/* HÀNG 1: LOGO + MENU DESKTOP + NÚT CÔNG CỤ MOBILE */}
          <div className="h-10 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="TGC Logo"
                width={22}
                height={22}
                className="w-5 h-5 object-contain"
              />
            </Link>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[12.5px] font-semibold tracking-wider text-neutral-800 hover:text-black uppercase transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Cụm công cụ bên phải */}
            <div className="flex items-center gap-2">
              
              {/* Form Search trên Desktop */}
              <div className="hidden md:flex items-center">
                {searchOpen && (
                  <form onSubmit={handleSearch} className="mr-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search stories…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => !searchQuery && setSearchOpen(false)}
                      className="w-36 border-b border-neutral-400 bg-transparent px-1 py-0.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                    />
                  </form>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen((prev) => !prev)}
                  title="Search"
                  className="p-1.5 text-neutral-700 hover:text-black transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Nút Tìm kiếm trên Mobile */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className={`md:hidden p-1.5 rounded-md transition-colors cursor-pointer ${
                  searchOpen ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700'
                }`}
                title="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Nút Ba gạch Hamburger thả Menu trên Mobile */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen((prev) => !prev);
                  if (searchOpen) setSearchOpen(false);
                }}
                className={`md:hidden p-1.5 rounded-md transition-colors cursor-pointer ${
                  mobileMenuOpen ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700'
                }`}
                title="Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* HÀNG 2 TRÊN MOBILE: Ô SEARCH TÁCH RIÊNG XUỐNG DƯỚI */}
          {searchOpen && (
            <div className="md:hidden py-2.5 pb-3 border-t border-neutral-100 animate-in fade-in duration-150">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search articles, legends, mindset…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-950 text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {/* HÀNG 2 TRÊN MOBILE: MENU THẢ XUỐNG */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-2 border-t border-neutral-100 flex flex-col divide-y divide-neutral-50 animate-in fade-in slide-in-from-top-1 duration-200">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-1 text-xs font-bold tracking-wider text-neutral-800 hover:text-[#e67e22] uppercase transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <span className="text-neutral-300 text-xs font-light">→</span>
                </Link>
              ))}
            </nav>
          )}

        </div>
      </header>

      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </>
  );
}