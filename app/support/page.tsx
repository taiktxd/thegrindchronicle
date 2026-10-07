import PageMasthead from '../components/PageMasthead';

export const metadata = {
  title: 'Support | The Grind Chronicle',
};

const faqs = [
  {
    q: 'How do I leave a comment on a story?',
    a: "Scroll to the bottom of any article, fill in your name and message under \"Discussion & Reader Thoughts,\" and submit. Comments are reviewed before they appear publicly, so yours may take a little while to show up.",
  },
  {
    q: "I have a story idea or a tip. who do I tell?",
    a: 'Head to the Contact page and choose "Story Tip" from the subject dropdown. We read every submission.',
  },
  {
    q: 'I found a typo or a broken link. How do I report it?',
    a: 'Use the Contact page and choose "Report an Issue." Include the article title or URL if you can, it helps us fix it faster.',
  },
  {
    q: "I'm interested in advertising or a partnership.",
    a: 'Reach out through the Contact page and choose "Partnership / Advertising." We usually reply within 2–3 days.',
  },
  {
    q: 'Do I need an account to use this site?',
    a: 'No. You can read every story and leave comments without signing up for anything.',
  },
];

export default function SupportPage() {
  return (
    <main className="w-full bg-[#FBFAF7] min-h-screen">
      <PageMasthead
        title="Support"
        tagline="Answers to common questions — or reach us directly."
      />

      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-10">
        <section className="flex flex-col gap-6">
          {faqs.map((item) => (
            <div key={item.q} className="border-b border-gray-200 pb-6">
              <h2 className="font-bold text-gray-900 mb-2">{item.q}</h2>
              <p className="text-gray-700 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-4">
            Send us a message and we&apos;ll get back to you within 2–3 days.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2.5 bg-amber-600 text-white font-bold uppercase tracking-wider text-sm
                       rounded-full hover:bg-amber-700 transition-colors"
          >
            Contact Us →
          </a>
        </section>
      </div>
    </main>
  );
}