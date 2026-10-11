'use client';

import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SubscribeModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    // 1. Kiểm tra bắt buộc đuôi @gmail.com
    if (!gmailRegex.test(cleanEmail)) {
      setStatus('error');
      setMessage('Please enter a valid Gmail address (@gmail.com).');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        // 2. LƯU EMAIL VÀO LOCALSTORAGE & KÍCH HOẠT ĐỔI NÚT TRÊN HEADER NGAY LẬP TỨC
        localStorage.setItem('tgc_subscriber_email', cleanEmail);
        window.dispatchEvent(new Event('tgc_subscribed'));

        setStatus('success');
        setMessage(
          data.message ||
            'Welcome to the Inner Circle! (Note: Resend is in Sandbox mode, welcome email will be sent automatically once your domain is verified).'
        );
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setMessage('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-neutral-200 text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút X đóng popup */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <p className="text-xs uppercase font-bold tracking-widest text-[#e67e22] mb-1">
            The Grind Chronicle
          </p>
          <h3
            className="text-2xl font-bold mb-2 text-neutral-900"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Join the Inner Circle
          </h3>
          <p className="text-sm text-neutral-600">
            Get exclusive basketball essays, raw human struggles, and deep stories delivered straight to your inbox. No spam.
          </p>
        </div>

        {status === 'success' ? (
          <div className="border border-emerald-200 bg-emerald-50/70 p-5 rounded-lg text-center">
            <h4 className="text-emerald-800 font-bold text-base mb-2 flex items-center justify-center gap-1.5">
              <span>✓</span> Welcome to the Inner Circle
            </h4>
            <p className="text-xs text-emerald-700 leading-relaxed mb-4">
              {message}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-6 py-2 rounded-md transition-colors uppercase tracking-wider"
            >
              DONE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Enter your @gmail.com address…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#e67e22] focus:border-transparent"
            />

            {status === 'error' && (
              <p className="text-xs text-rose-600 font-medium">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'SUBMITTING…' : 'SUBSCRIBE FREE'}
            </button>

            <p className="text-[11px] text-center text-neutral-400 mt-1">
              Active @gmail.com required. Unsubscribe anytime with one click.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}