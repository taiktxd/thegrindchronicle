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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* HEADER ĐỒNG BỘ VỚI LATEST STORIES & ARCHIVES */}
      <section className="mb-6 sm:mb-8 pb-3 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
              CONTACT
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600">
              EDITORIAL DESK
            </span>
          </div>

          <h1
            className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-gray-900"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Get In Touch
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 italic">
            Have an untold basketball story, tip, or feedback? The newsroom is open.
          </p>
        </div>

        <span className="text-[11px] uppercase tracking-widest text-amber-600 font-semibold hidden sm:inline-block">
          Direct Line
        </span>
      </section>

      {/* BỐ CỤC 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CỘT TRÁI: EDITORIAL DESK (Bo góc mềm rounded-xl) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2 font-sans">
              Editorial Desk
            </span>
            
            <h2
              className="text-base sm:text-lg font-bold text-gray-900 mb-2.5 leading-snug"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              We Read Every Submission
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
              Whether you witnessed an inspiring grassroots story or have historical context about an NBA legend, we welcome your voice.
            </p>
          </div>

          <div className="space-y-4 px-1 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                General & Tips
              </span>
              <a
                href="mailto:thegrindchronicle.contact@gmail.com"
                className="text-gray-900 hover:text-amber-600 font-medium transition-colors"
              >
                thegrindchronicle.contact@gmail.com
              </a>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Community
              </span>
              <p className="text-gray-600">
                Follow our visual stories on{' '}
                <a
                  href="https://www.threads.net/@hoop_soul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline font-medium hover:text-amber-600 transition-colors"
                >
                  Threads
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM NHẬP LIỆU (Khung ngoài rounded-xl, các input rounded-lg) */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-xl p-6 sm:p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HoopSoul, Allen I."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Your Email
              </label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all cursor-pointer"
              >
                <option value="General Feedback">General Feedback</option>
                <option value="Story Pitch / Lead">Story Pitch / Lead</option>
                <option value="Editorial Correction">Editorial Correction</option>
                <option value="Partnership & Inquiries">Partnership & Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="Share your perspective, story tip, or feedback…"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all resize-none"
              ></textarea>
            </div>

            {status === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-lg font-medium">
                ✓ {feedbackMsg}
              </div>
            )}

            {status === 'error' && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-lg font-medium">
                ✕ {feedbackMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-1 w-full sm:w-auto self-start px-7 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}