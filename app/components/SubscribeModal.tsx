'use client';

import { useState, useEffect } from 'react';
import { supabaseAnon } from '@/lib/supabase';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'already' | 'error';

export default function SubscribeModal({ isOpen, onClose, onSuccess }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  // Đóng modal khi bấm phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabaseAnon
        .from('subscribers')
        .insert([{ email: normalizedEmail }]);

      if (error) {
        // Lỗi trùng email (đã đăng ký từ trước)
        if (error.code === '23505') {
          setStatus('already');
          onSuccess(normalizedEmail);
          return;
        }
        throw error;
      }

      setStatus('success');
      onSuccess(normalizedEmail);
    } catch (err) {
      console.warn('[Subscribe] Error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp nền mờ */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Khung Popup */}
      <div className="relative w-full max-w-md bg-[#fcfbf9] border border-neutral-200 rounded-2xl shadow-2xl p-7 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng (X) */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>   

        {status === 'success' || status === 'already' ? (
          <div className="text-center py-4">
            <span className="w-10 h-10 rounded-full bg-[#e67e22] text-white inline-flex items-center justify-center text-lg font-bold mb-3">
              ✓
            </span>
            <h3
              className="font-serif text-xl font-bold text-neutral-900 mb-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {status === 'already' ? 'Already in the Circle' : 'Welcome to The Chronicle'}
            </h3>
            <p
              className="text-xs sm:text-sm text-neutral-600 font-serif leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {status === 'already'
                ? 'Your email is already on our list. The latest stories will keep heading straight to your inbox.'
                : 'Thank you for joining us. You will receive the latest stories behind the scenes of basketball and NBA legends directly in your inbox.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#e67e22] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            {/* Header Modal */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e67e22]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 font-sans">
                The Chronicle Dispatch
              </span>
            </div>

            <h3
              className="font-serif text-2xl font-bold text-neutral-950 tracking-tight mb-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Stories Behind Greatness.
            </h3>

            <p
              className="text-xs sm:text-sm text-neutral-600 font-serif leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Subscribe to receive in-depth stories about basketball culture, NBA legends, and the spirit of perseverance directly in your inbox every week.
            </p>

            {/* Form nhập Email */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5 font-sans">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600">
                  Unable to subscribe at this time. Please check your email address!
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 bg-neutral-950 text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-[#e67e22] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {status === 'loading' ? 'Joining…' : 'Join The Newsletter →'}
              </button>
            </form>

            <p className="text-[11px] text-neutral-400 text-center font-serif italic mt-4">
              No spam. Unsubscribe anytime with one click.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}