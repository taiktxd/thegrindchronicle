'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import SubscribeModal from './SubscribeModal';

// Lắng nghe sự kiện lưu/xóa email từ SubscribeModal và Admin
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
  // 1. TẤT CẢ CÁC HOOK ĐƯỢC GỌI LIÊN TỤC Ở ĐẦU COMPONENT
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

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
  };

  // 3. ĐIỀU KIỆN ẨN HEADER CHO TRANG ADMIN ĐẶT SAU TOÀN BỘ HOOKS
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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <header className="w-full bg-white text-neutral-900 border-b border-neutral-100">
        {/* TOP BAR */}
        <div className="w-full border-b border-neutral-100">
          <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-between text-[11px] text-neutral-500">
            <div className="flex items-center gap-2 font-serif">
              <span>{today}</span>
              <span className="text-neutral-300">|</span>
              <span className="uppercase tracking-wider font-sans text-[10px] text-neutral-400">
                Rucker Park, NYC
              </span>
            </div>

            <div className="flex items-center gap-3">
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

              <span className="text-neutral-300 mx-1">|</span>

              {subscriberEmail ? (
                <div className="group relative flex items-center">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-neutral-900 text-white text-[11px] px-3 py-0.5 rounded-full font-medium shadow-sm hover:bg-neutral-800 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="max-w-[140px] truncate">{subscriberEmail}</span>
                    <span className="text-emerald-400 text-xs font-bold">✓</span>
                  </button>

                  <div className="hidden group-hover:block absolute right-0 top-full pt-1 z-30">
                    <div className="bg-white border border-neutral-200 shadow-lg rounded-lg p-2 min-w-[160px] text-left">
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-1">
                        Inner Circle Member
                      </p>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium py-1 w-full text-left transition-colors"
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
                  className="border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white px-3 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-150"
                >
                  SUBSCRIBE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MASTHEAD */}
        <div className="max-w-6xl mx-auto px-4 pt-3.5 pb-2 text-center">
          <Link href="/" className="inline-block group">
            <h1
              className="font-bold tracking-tight text-neutral-950 uppercase"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
                lineHeight: '1.1',
              }}
            >
              The Grind Chronicle
            </h1>
            <p
              className="italic text-neutral-500 mt-1 font-serif"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
            >
              Stories Behind Greatness.
            </p>
          </Link>
        </div>

        {/* NAVIGATION BAR */}
        <div className="max-w-6xl mx-auto px-4 h-10 border-t border-neutral-100 grid grid-cols-[auto_1fr_auto] sm:grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <Link href="/" className="shrink-0 flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="TGC Logo"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            </Link>
          </div>

          <nav className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-neutral-800 hover:text-black uppercase transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end">
            {searchOpen && (
              <form onSubmit={handleSearch} className="mr-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search stories…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-28 sm:w-44 border-b border-neutral-400 bg-transparent px-1 py-0.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
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
                setSearchOpen((prev) => !prev);
              }}
              title="Search"
              className="p-1 text-neutral-700 hover:text-black transition-colors"
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
      </header>

      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </>
  );
}