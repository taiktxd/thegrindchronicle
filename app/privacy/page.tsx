import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Grind Chronicle',
  description: 'How The Grind Chronicle handles reader data, comments, and communications.',
};

export default function PrivacyPage() {
  return (
    // 1. NỀN TRẮNG TINH (bg-white) & KHOẢNG ĐỆM GỌN GÀNG (pt-6 pb-12)
    <main className="w-full bg-white pt-6 sm:pt-8 pb-12 sm:pb-16 text-neutral-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* 2. HEADER: ĐÃ BỎ LOGO, TIÊU ĐỀ THU NHỎ NHƯ TRANG CONTACT */}
        <div className="text-center mb-8 sm:mb-10">
          <h1
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 uppercase"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-serif italic">
            Last updated September 2026
          </p>

          {/* Vạch kẻ cam mảnh nhỏ đồng nhất với trang Contact */}
          <div className="w-12 h-[2px] bg-[#e67e22] mx-auto mt-3"></div>
        </div>

        {/* 3. NỘI DUNG CHÍNH SÁCH BẢO MẬT (Thanh lịch, rõ ràng) */}
        <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
          <p className="text-neutral-800 text-sm sm:text-base font-serif italic leading-relaxed">
            The Grind Chronicle is an independent publication. This page explains what information we collect when you use this site, and how it’s used.
          </p>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
              What We Collect
            </h2>
            <div className="space-y-2">
              <p>
                <strong className="text-neutral-900">Comments:</strong> When you post a comment, we store your name, your message, and the time you posted it. Comments are held for manual review before appearing publicly to filter out spam.
              </p>
              <p>
                <strong className="text-neutral-900">Contact form:</strong> When you use the Contact page, your name, email address, and message are sent directly to our inbox by email. This information is not stored in any database; it exists only as an email.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
              What We Don’t Collect
            </h2>
            <p>
              We don’t require accounts, passwords, or logins to read or comment on this site. We don’t run advertising trackers, and we don’t sell or share your information with third parties for marketing purposes.
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
              Third-Party Services
            </h2>
            <p>
              This site is hosted on Vercel, comments and bookmark data are stored using Supabase, and transactional emails are delivered using Resend. Each of these services processes data only as needed to provide their function to this site. We encourage you to review their own privacy policies if you’d like more detail on how they handle data in transit.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}