import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Support & FAQ | The Grind Chronicle',
  description: 'Frequently asked questions, editorial tips, and reader support for The Grind Chronicle.',
  alternates: {
    canonical: '/support',
  },
};

const faqs = [
  {
    q: 'How do I leave a comment on a story?',
    a: 'Scroll to the bottom of any article, fill in your name and message under "Discussion & Reader Thoughts," and submit. Comments are reviewed to maintain a thoughtful discussion community before they appear publicly.',
  },
  {
    q: 'I have a story idea or a lead. Who do I tell?',
    a: 'Head to our Contact page and choose "Story Tip / Lead" from the subject dropdown. Our editorial team reviews every single pitch.',
  },
  {
    q: 'I found a typo or a broken link. How do I report it?',
    a: 'Use the Contact page and select "Report a Typo or Bug." Including the article title or URL helps us correct it immediately.',
  },
  {
    q: 'I am interested in advertising or brand partnerships.',
    a: 'Reach out through the Contact page and select "Advertising & Partnerships." We usually reply within 24–48 hours with our media kit.',
  },
  {
    q: 'Do I need an account to read stories on The Grind Chronicle?',
    a: 'No. You can read every story, browse archives, and participate in discussions without creating an account or paying any subscription fee.',
  },
];

export default function SupportPage() {
  return (
    <main className="w-full bg-[#FBFAF7] min-h-screen">
      {/* ===== Compact Page Masthead ===== */}
      <div className="max-w-5xl mx-auto px-4 pt-8 sm:pt-10 pb-6 border-b-2 border-amber-600 flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="The Grind Chronicle logo"
          width={48}
          height={48}
          className="w-10 h-10 object-contain mb-2"
        />
        <h1
          className="uppercase font-bold tracking-tight text-gray-900"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            letterSpacing: '0.02em',
          }}
        >
          Support &amp; FAQ
        </h1>
        <p
          className="italic text-gray-600 mt-1 max-w-md text-sm sm:text-base"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Answers to common reader questions and editorial guidelines.
        </p>
      </div>

      {/* ===== 2-Column Balanced Layout ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cột trái (4/12): Tổng quan trợ giúp & Lối tắt liên hệ */}
        <aside className="lg:col-span-4 flex flex-col gap-6 bg-white/70 border border-gray-200/80 rounded-xl p-6 sm:p-7 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
              Reader Desk
            </span>
            <h2
              className="text-base sm:text-lg font-bold text-gray-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              How Can We Help?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Find instant answers to questions regarding article submissions, commenting rules, and site policies.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Need Personal Assistance?
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              If your question isn&apos;t covered here, drop us a direct message.
            </p>
            <Link
              href="/contact"
              className="inline-block w-full text-center px-4 py-2 bg-amber-600 text-white font-semibold text-xs sm:text-sm rounded-md hover:bg-amber-700 transition-colors shadow-sm"
            >
              Go to Contact Form →
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-5 text-xs text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Direct Support Email:</p>
            <a
              href="mailto:thegrindchronicle.contact@gmail.com"
              className="text-amber-700 hover:underline break-all"
            >
              thegrindchronicle.contact@gmail.com
            </a>
          </div>
        </aside>

        {/* Cột phải (8/12): Danh sách FAQ dạng card và Callout */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-white border border-gray-200/90 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 divide-y divide-gray-100">
            {faqs.map((item, idx) => (
              <div key={item.q} className={idx > 0 ? "pt-6" : ""}>
                <h2
                  className="font-bold text-gray-900 text-base sm:text-lg mb-2"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {item.q}
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </section>

          {/* Action Box */}
          <section className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-6 text-center">
            <h2 className="font-bold text-gray-900 uppercase text-xs sm:text-sm tracking-wider mb-1.5">
              Still Need Answers?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 max-w-md mx-auto">
              Send us a message and our editorial team will get back to you within 24–48 hours.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-2 bg-amber-600 text-white font-bold uppercase tracking-wider text-xs sm:text-sm
                         rounded-md hover:bg-amber-700 transition-colors shadow-sm"
            >
              Contact Us →
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}