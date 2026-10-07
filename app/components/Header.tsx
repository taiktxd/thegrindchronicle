'use client';

import { useState, useSyncExternalStore, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import SubscribeModal from './SubscribeModal';

// Lắng nghe thay đổi bộ nhớ trình duyệt
function subscribeStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStoredEmail() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tgc_subscriber_email');
}

function getServerStoredEmail() {
  return null;
}

export default function Header() {
  // 1. TẤT CẢ CÁC HOOK ĐƯỢC GỌI Ở TRÊN CÙNG
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const storedEmail = useSyncExternalStore(
    subscribeStorage,
    getStoredEmail,
    getServerStoredEmail
  );

  // Đóng dropdown khi độc giả click ra vùng ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // 2. ẨN HEADER TRÊN TRANG ADMIN
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const subscriberEmail = clientEmail !== null ? clientEmail : storedEmail;

  const handleSubscribeSuccess = (email: string) => {
    localStorage.setItem('tgc_subscriber_email', email);
    setClientEmail(email);
    window.dispatchEvent(new Event('storage'));
  };

  // Hàm xử lý Đăng xuất / Xóa email đã lưu
  const handleLogout = () => {
    localStorage.removeItem('tgc_subscriber_email');
    setClientEmail('');
    window.dispatchEvent(new Event('storage'));
    setUserMenuOpen(false);
  };

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
    <>
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

              {/* NÚT SUBSCRIBE HOẶC HUY HIỆU EMAIL ĐÃ ĐĂNG KÝ */}
              {subscriberEmail ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    title={`Subscribed as ${subscriberEmail}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100/80 text-neutral-800 hover:border-[#e67e22] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e67e22]" />
                    <span className="truncate max-w-[90px] sm:max-w-[130px]">
                      {subscriberEmail}
                    </span>
                    <svg
                      className="w-2.5 h-2.5 text-neutral-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* DROPDOWN MENU KHI BẤM VÀO EMAIL */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200/90 rounded-xl shadow-xl p-3 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Reader Circle
                      </p>
                      <p className="text-xs text-neutral-900 font-medium truncate mb-3 pb-2 border-b border-neutral-100">
                        {subscriberEmail}
                      </p>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-center text-xs py-1.5 px-3 bg-neutral-50 hover:bg-red-50 text-neutral-700 hover:text-red-600 rounded-lg font-medium transition-colors border border-neutral-200/70 hover:border-red-200"
                      >
                        Log out (Reset email)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubscribeOpen(true)}
                  className="text-[10px] uppercase tracking-widest font-medium px-3 py-1 rounded-full border border-neutral-800 text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all shadow-2xs"
                >
                  Subscribe
                </button>
              )}
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

        {/* ===== 3. NAVIGATION ===== */}
        <div className="w-full border-t border-neutral-200 bg-[#fcfbf9]">
          <div className="relative max-w-6xl mx-auto px-4 h-12 flex items-center justify-center">
            <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto min-w-0 [&::-webkit-scrollbar]:hidden">
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

            {/* Khung tìm kiếm */}
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

      {/* MODAL POPUP */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSuccess={handleSubscribeSuccess}
      />
    </>
  );
}