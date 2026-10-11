import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | The Grind Chronicle',
  description: 'Terms and conditions for reading and interacting with The Grind Chronicle.',
};

export default function TermsPage() {
  return (
    // 1. NỀN TRẮNG TINH (bg-white) & KHOẢNG ĐỆM GỌN GÀNG (pt-6 pb-12)
    <main className="w-full bg-white pt-6 sm:pt-8 pb-12 sm:pb-16 text-neutral-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* 2. HEADER ĐỒNG BỘ: ĐÃ BỎ LOGO, TIÊU ĐỀ THU NHỎ */}
        <div className="text-center mb-8 sm:mb-10">
          <h1
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 uppercase"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-serif italic">
            Last updated September 2026
          </p>

          {/* Vạch kẻ cam mảnh nhỏ đồng nhất */}
          <div className="w-12 h-[2px] bg-[#e67e22] mx-auto mt-3"></div>
        </div>

        {/* 3. NỘI DUNG ĐIỀU KHOẢN */}
        <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
          <p className="text-neutral-800 text-sm sm:text-base font-serif italic leading-relaxed">
            By reading, commenting on, or otherwise using The Grind Chronicle, you agree to the terms below. If you don’t agree, please don’t use the site.
          </p>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
              Content
            </h2>
            <p>
              Articles, images, and other original material published on this site are the property of The Grind Chronicle unless otherwise credited. You’re welcome to share links to our stories. Please don’t republish or reproduce full articles elsewhere without asking first reach out via our{' '}
              <Link href="/contact" className="text-neutral-950 underline font-medium hover:text-[#e67e22] transition-colors">
                Contact page
              </Link>.
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
              Comments
            </h2>
            <p>
              We welcome discussion under our stories. Comments are reviewed before they appear publicly. We reserve the right to decline or remove any comment that is abusive, spam, off-topic, or otherwise inappropriate, at our discretion, without notice.
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
              Accuracy of Stories
            </h2>
            <p>
              Our stories focus on the human and emotional side of basketball figures’ lives not breaking news or transactional sports reporting. We do our best to represent these stories faithfully based on publicly available interviews and reporting, but some details may be dramatized or simplified for narrative flow. This site is not affiliated with the NBA or any team, player, or organization mentioned.
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
              No Warranty
            </h2>
            <p>
              The site is provided “as is” without warranties of any kind. We make reasonable efforts to keep information accurate, but we cannot guarantee uninterrupted access or complete absence of errors.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}