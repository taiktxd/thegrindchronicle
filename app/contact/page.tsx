'use client';

import { useState } from 'react';
import Image from 'next/image';

const subjects = [
  { value: 'tip', label: 'Story Tip / Lead' },
  { value: 'partnership', label: 'Advertising & Partnerships' },
  { value: 'issue', label: 'Report a Typo or Bug' },
  { value: 'general', label: 'General Inquiry' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'tip',
    message: '',
  });

  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', email: '', subject: 'tip', message: '' });
    } catch {
      setStatus('error');
    }
  };

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
          Get In Touch
        </h1>
        <p
          className="italic text-gray-600 mt-1 max-w-md text-sm sm:text-base"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Have an untold basketball story, tip, or feedback? The newsroom is open.
        </p>
      </div>

      {/* ===== 2-Column Balanced Layout (Hẹp max-w-5xl, triệt tiêu khoảng trắng thừa) ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cột trái (5/12): Thông tin tòa soạn, FAQ & Kênh liên hệ trực tiếp */}
        <aside className="md:col-span-5 flex flex-col gap-6 bg-white/70 border border-gray-200/80 rounded-xl p-6 sm:p-7 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
              Editorial Desk
            </span>
            <h2
              className="text-lg font-bold text-gray-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              We Read Every Submission
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Whether you witnessed an inspiring grassroots story or have historical context about an NBA legend, we welcome your voice.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Direct Contact
            </h3>
            <a
              href="mailto:thegrindchronicle.contact@gmail.com"
              className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors break-all"
            >
              thegrindchronicle.contact@gmail.com
            </a>
            <p className="text-xs text-gray-500 mt-1">
              Response time: usually within 24–48 hours.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Connect With Us
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="https://www.threads.net/@hoop_soul"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-amber-600 hover:text-amber-600 transition-colors"
              >
                Threads @hoop_soul
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-amber-600 hover:text-amber-600 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </aside>

        {/* Cột phải (7/12): Form gửi tin nhắn gọn gàng trong Card */}
        <div className="md:col-span-7 bg-white border border-gray-200/90 rounded-xl p-6 sm:p-8 shadow-sm">
          <h2
            className="text-lg font-bold text-gray-900 mb-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Your Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Marcus Vance"
                  className="w-full border border-gray-300 rounded-md bg-transparent px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400
                             focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-md bg-transparent px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400
                             focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Topic / Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md bg-white px-3 py-2 text-sm text-gray-800
                           focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
              >
                {subjects.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Share your story lead, feedback, or inquiry..."
                className="w-full border border-gray-300 rounded-md bg-transparent p-3 text-sm text-gray-800 placeholder:text-gray-400
                           resize-none focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="self-start mt-1 px-6 py-2.5 bg-amber-600 text-white font-bold uppercase tracking-wider text-xs sm:text-sm
                         rounded-md hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {status === 'loading' ? 'Sending Message…' : 'Send Message →'}
            </button>

            {status === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-xs sm:text-sm text-green-800">
                ✓ Thank you! Your message has been received. We will reply within 24–48 hours.
              </div>
            )}
            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs sm:text-sm text-red-800">
                ✕ Unable to deliver your message. Please reach out directly to our email above.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}