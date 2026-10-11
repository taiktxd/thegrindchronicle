import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support | The Grind Chronicle',
  description: 'Answers to common questions and support for readers of The Grind Chronicle.',
};

export default function SupportPage() {
  const faqs = [
    {
      q: 'How do I leave a comment on a story?',
      a: 'Scroll to the bottom of any story, fill in your name and thoughts under "Discussion & Reader Thoughts," then click Submit. Comments are reviewed by our team to maintain quality discussions, so yours may take a short moment to appear publicly.',
    },
    {
      q: 'I have a story idea or a lead — who do I tell?',
      a: 'Head to our Contact page and select "Story Pitch / Lead" from the topic dropdown. We read and review every lead from our community.',
      linkText: 'Go to Contact Desk →',
      linkHref: '/contact',
    },
    {
      q: 'I found a typo or a broken link. How do I report it?',
      a: 'Use the Contact page and select "Editorial Correction." Including the article title or URL helps us review and resolve the issue faster.',
      linkText: 'Submit Correction →',
      linkHref: '/contact',
    },
    {
      q: 'I’m interested in advertising or partnerships.',
      a: 'Reach out through our Contact page with the topic "Partnership & Inquiries." Our editorial team usually responds within 2–3 business days.',
      linkText: 'Inquire About Partnership →',
      linkHref: '/contact',
    },
  ];

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
            Support
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-serif italic">
            Answers to common questions or reach us directly.
          </p>

          {/* Vạch kẻ cam mảnh nhỏ đồng nhất */}
          <div className="w-12 h-[2px] bg-[#e67e22] mx-auto mt-3"></div>
        </div>

        {/* 3. DANH SÁCH CÂU HỎI THƯỜNG GẶP (Gọn gàng, thanh lịch) */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`pb-5 ${index !== faqs.length - 1 ? 'border-b border-neutral-100' : ''}`}
            >
              <h2
                className="text-sm sm:text-base font-bold text-neutral-950 mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {faq.q}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans mb-2">
                {faq.a}
              </p>
              {faq.linkHref && (
                <Link
                  href={faq.linkHref}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-[#e67e22] transition-colors"
                >
                  {faq.linkText}
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}