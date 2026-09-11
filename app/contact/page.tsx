'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    <main className="w-full bg-[#FBFAF7] min-h-screen">
      {/* ===== Page masthead ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-8 border-b-2 border-amber-600 flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="The Grind Chronicle"
          width={56}
          height={56}
          className="w-12 h-12 object-contain mb-3"
        />
        <h1
          className="uppercase font-bold"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            color: '#1A1A1A',
            letterSpacing: '0.02em',
          }}
        >
          Get In Touch
        </h1>
        <p
          className="italic text-[#666] mt-2 max-w-md"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Have a story? A tip? Or just want to talk hoops?
        </p>
      </div>

      {/* ===== Content ===== */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-700">
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
                className="border-b border-gray-300 bg-transparent py-2 text-gray-800 placeholder:text-gray-400
                           focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700">
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
                className="border-b border-gray-300 bg-transparent py-2 text-gray-800 placeholder:text-gray-400
                           focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="border-b border-gray-300 bg-transparent py-2 text-gray-800
                         focus:outline-none focus:border-amber-600 transition-colors"
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us your story, idea, or question…"
              className="border border-gray-300 rounded-md bg-transparent p-3 text-gray-800 placeholder:text-gray-400
                         resize-none focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="self-start mt-2 px-6 py-2.5 bg-amber-600 text-white font-bold uppercase tracking-wider text-sm
                       rounded-full hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending…' : 'Send It In →'}
          </button>

          {status === 'success' && (
            <p className="text-sm text-green-700">
              Thanks — your message is in. We usually reply within 2–3 days.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600">
              Something went wrong. Try again, or email us directly below.
            </p>
          )}
        </form>

        {/* Side info */}
        <aside className="flex flex-col gap-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Direct
            </h2>
            <a
              href="mailto:thegrindchronicle.contact@gmail.com"
              className="text-gray-800 hover:text-amber-600 transition-colors"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              thegrindchronicle.contact@gmail.com
            </a>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Follow
            </h2>
            <div className="flex flex-col gap-1">
              <a
                href="https://www.threads.net/@hoop_soul"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-amber-600 transition-colors"
              >
                Threads
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-amber-600 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              We usually reply within 2–3 days.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
