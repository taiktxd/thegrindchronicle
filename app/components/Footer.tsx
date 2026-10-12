'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // BẢO MẬT: ẨN HOÀN TOÀN FOOTER KHI Ở KHU VỰC QUẢN TRỊ ADMIN
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-neutral-950 text-white mt-12 sm:mt-16">
      {/* 1. THANH CHỈ CAM MẢNH TINH TẾ (2px sắc nét) */}
      <div className="w-full h-[2px] bg-[#e67e22]"></div>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12 flex flex-col items-center text-center">
        
        {/* 2. KHỐI THƯƠNG HIỆU */}
        <Link href="/" className="inline-flex flex-col items-center group mb-5">
          <div className="mb-3 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200">
            <Image
              src="/logo.png"
              alt="TGC Logo"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-white group-hover:text-neutral-200 transition-colors"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            The Grind Chronicle
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 mt-1.5 italic font-serif tracking-wide">
            Stories Behind Greatness.
          </p>
        </Link>

        {/* Vạch kẻ cam nhỏ điểm nhấn */}
        <div className="w-12 h-[1.5px] bg-[#e67e22] mb-6"></div>

        {/* 3. CỤM LIÊN KẾT ĐIỀU HƯỚNG CHÍNH */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 mb-5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase text-neutral-300 font-sans">
          <Link href="/" className="hover:text-[#e67e22] transition-colors">
            Home
          </Link>
          <Link href="/category/nba" className="hover:text-[#e67e22] transition-colors">
            NBA
          </Link>
          <Link href="/category/legends" className="hover:text-[#e67e22] transition-colors">
            Legends
          </Link>
          <Link href="/category/mindset" className="hover:text-[#e67e22] transition-colors">
            Mindset
          </Link>
          <Link href="/contact" className="hover:text-[#e67e22] transition-colors">
            Contact
          </Link>
        </nav>

        {/* 4. CỤM LIÊN KẾT PHÁP LÝ & HỖ TRỢ */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-neutral-500 mb-6 font-sans">
          <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-neutral-700">•</span>
          <Link href="/terms" className="hover:text-neutral-300 transition-colors">
            Terms of Service
          </Link>
          <span className="text-neutral-700">•</span>
          <Link href="/support" className="hover:text-neutral-300 transition-colors">
            Support
          </Link>
          <span className="text-neutral-700">•</span>
          <a
            href="https://www.threads.net/@hoop_soul"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            Threads
          </a>
        </div>

        {/* 5. COPYRIGHT */}
        <p className="text-xs text-neutral-600 font-sans">
          © {currentYear} The Grind Chronicle. All rights reserved.
        </p>

      </div>
    </footer>
  );
}