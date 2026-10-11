'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Feedback',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedbackMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFeedbackMsg('Thank you. Your message has been delivered to the newsroom desk.');
        setFormData({ name: '', email: '', topic: 'General Feedback', message: '' });
      } else {
        setStatus('error');
        setFeedbackMsg('Unable to dispatch message right now. Please try again or email us directly.');
      }
    } catch {
      setStatus('error');
      setFeedbackMsg('Network error. Please try again later.');
    }
  };

  return (
    /* ĐÃ BỎ min-h-screen VÀ ĐẶT LẠI KHOẢNG ĐỆM ĐÁY GỌN GÀNG (pt-6 pb-12) */
    <main className="w-full bg-white pt-6 sm:pt-8 pb-10 sm:pb-12 text-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* HEADER TRANG LIÊN HỆ */}
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 uppercase"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Get In Touch
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-serif italic max-w-md mx-auto">
            Have an untold basketball story, tip, or feedback? The newsroom is open.
          </p>

          <div className="w-12 h-[2px] bg-[#e67e22] mx-auto mt-3"></div>
        </div>

        {/* BỐ CỤC 2 CỘT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* CỘT TRÁI: EDITORIAL DESK */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#e67e22] font-sans block mb-1.5">
                EDITORIAL DESK
              </span>
              <h2
                className="text-base font-bold text-neutral-900 mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                We Read Every Submission
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Whether you witnessed an inspiring grassroots story or have historical context about an NBA legend, we welcome your voice.
              </p>
            </div>

            <div className="space-y-3 px-1 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-neutral-400 block mb-0.5 text-[10px]">
                  GENERAL & TIPS
                </span>
                <a
                  href="mailto:thegrindchronicle.contact@gmail.com"
                  className="text-neutral-800 hover:text-[#e67e22] font-medium transition-colors"
                >
                  thegrindchronicle.contact@gmail.com
                </a>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-neutral-400 block mb-0.5 text-[10px]">
                  COMMUNITY
                </span>
                <p className="text-neutral-600">
                  Follow our visual stories on{' '}
                  <a
                    href="https://www.threads.net/@hoop_soul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 underline font-medium hover:text-[#e67e22] transition-colors"
                  >
                    Threads
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM NHẬP LIỆU */}
          <div className="md:col-span-7 bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HoopSoul, Allen I."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Topic
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all cursor-pointer"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Story Pitch / Lead">Story Pitch / Lead</option>
                  <option value="Editorial Correction">Editorial Correction</option>
                  <option value="Partnership & Inquiries">Partnership & Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your perspective, story tip, or feedback…"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all resize-none"
                ></textarea>
              </div>

              {status === 'success' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
                  ✓ {feedbackMsg}
                </div>
              )}

              {status === 'error' && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  ✕ {feedbackMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-1 w-full sm:w-auto self-start px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}