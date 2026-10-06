'use client';

import Link from 'next/link';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#111111] text-neutral-300 border-t-2 border-[#e67e22] mt-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* ===== KHUNG 3 CỘT NỘI DUNG CHÍNH ===== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-neutral-800">
          
          {/* CỘT 1: THƯƠNG HIỆU & SỨ MỆNH (6 Cột) */}
          <div className="md:col-span-6 flex flex-col items-start">
            <h2
              className="font-serif font-black uppercase tracking-tight text-white text-2xl sm:text-3xl mb-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              The Grind Chronicle
            </h2>
            <p
              className="font-serif italic text-neutral-400 text-sm sm:text-base mb-4"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Stories Behind Greatness.
            </p>
            <p
              className="text-sm text-neutral-300 leading-relaxed max-w-md font-serif"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              An independent chronicle devoted to the untold sacrifices, resilience, and human emotion behind basketball’s greatest journeys. From local blacktops to championship stages.
            </p>
          </div>

          {/* CỘT 2: ĐIỀU HƯỚNG BÀI VIẾT (3 Cột) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 font-sans">
              Sections
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/category/nba" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                  NBA Stories
                </Link>
              </li>
              <li>
                <Link href="/category/legends" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                  Legends & Legacy
                </Link>
              </li>
              <li>
                <Link href="/category/mindset" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                  Mindset & Grit
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                  Editorial Desk (Contact)
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: KẾT NỐI & PHÁP LÝ (3 Cột) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 font-sans">
              Connect & Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.threads.net/@hoop_soul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white hover:underline transition-colors"
                >
                  Threads ↗
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white hover:underline transition-colors"
                >
                  Facebook ↗
                </a>
              </li>
              <li className="pt-2 border-t border-neutral-800">
                <Link href="/privacy" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-neutral-300 hover:text-white hover:underline transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ===== THANH ĐÁY (COPYRIGHT & NÚT MŨI TÊN LÊN NỔI BẬT) ===== */}
        <div className="pt-8 flex items-center justify-between text-sm text-neutral-500">
          <p>© 2026 The Grind Chronicle. All rights reserved.</p>

          {/* Nút Back to Top: Icon mũi tên tròn nổi bật */}
          <button
            type="button"
            onClick={scrollToTop}
            title="Back to top"
            aria-label="Back to top"
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-neutral-800/90 hover:bg-[#e67e22] text-neutral-300 hover:text-white border border-neutral-700/80 hover:border-[#e67e22] transition-all duration-300 shadow-md active:scale-95"
          >
            <span className="text-xs uppercase tracking-wider font-semibold">
              Top
            </span>
            <div className="w-6 h-6 rounded-full bg-neutral-900 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}