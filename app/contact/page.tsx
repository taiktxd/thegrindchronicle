'use client';

import { useState } from 'react';

const subjects = [
  { value: 'tip', label: 'Story Tip' },
  { value: 'partnership', label: 'Advertising' },
  { value: 'issue', label: 'Report an Issue' },
  { value: 'general', label: 'General' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'general',
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
      setForm({ name: '', email: '', subject: 'general', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* ===== 1. TIÊU ĐỀ TRANG CHUẨN TÒA SOẠN ===== */}
      <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#e67e22]" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 font-sans">
            Editorial Desk
          </span>
        </div>
        <h1
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950 tracking-tight mb-3"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Get In Touch
        </h1>
        <p
          className="text-sm sm:text-base text-neutral-500 font-serif italic"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Have a story? A tip? Or just want to talk hoops?
        </p>
      </div>

      {/* ===== 2. KHUNG NỘI DUNG 2 CỘT CÂN XỨNG ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* CỘT TRÁI: THÔNG TIN TÒA SOẠN & KẾT NỐI (5 Cột) */}
        <aside className="lg:col-span-5 flex flex-col space-y-8 lg:pr-8 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-10 lg:pb-0">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-2.5 font-sans">
              Story Pitches & Submissions
            </h2>
            <p
              className="text-sm text-neutral-600 leading-relaxed font-serif"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              We are constantly searching for stories of perseverance, sacrifice, and the quiet moments behind greatness. If you know a story that deserves to be told, reach out to us.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 font-sans">
              Direct Inquiries
            </h3>
            <a
              href="mailto:thegrindchronicle.contact@gmail.com"
              className="text-sm sm:text-base font-medium text-neutral-900 hover:text-[#e67e22] transition-colors"
            >
              thegrindchronicle.contact@gmail.com
            </a>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 font-sans">
              Community & Social
            </h3>
            <div className="flex items-center gap-4 text-sm font-medium text-neutral-700">
              <a
                href="https://www.threads.net/@hoop_soul"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black hover:underline"
              >
                Threads ↗
              </a>
              <span className="text-neutral-300">•</span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black hover:underline"
              >
                Facebook ↗
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 font-serif italic leading-relaxed">
              We read every message and usually reply within 2–3 days.
            </p>
          </div>
        </aside>

        {/* CỘT PHẢI: FORM GỬI TIN (7 Cột) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tên */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-sans"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-sans"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                />
              </div>
            </div>

            {/* Chủ đề */}
            <div>
              <label
                htmlFor="subject"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-sans"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all cursor-pointer"
              >
                {subjects.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Lời nhắn */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-sans"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us your story, idea, or question…"
                className="w-full px-4 py-3 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all resize-none font-serif leading-relaxed"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              />
            </div>

            {/* Thông báo trạng thái */}
            {status === 'success' && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs">
                ✓ Thanks — your message is in. We usually reply within 2–3 days.
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                Something went wrong. Try again, or email us directly at thegrindchronicle.contact@gmail.com.
              </div>
            )}

            {/* Nút gửi */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-7 py-3 bg-neutral-950 text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-[#e67e22] active:scale-95 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending…' : 'Send It In →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}