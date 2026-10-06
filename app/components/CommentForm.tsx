'use client';

import { useState } from 'react';
import { supabaseAnon } from '@/lib/supabase';

interface CommentItem {
  id: string | number;
  name: string;
  message: string;
  created_at: string;
}

interface CommentFormProps {
  postSlug: string;
  onCommentAdded?: (newComment: CommentItem) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function CommentForm({ postSlug, onCommentAdded }: CommentFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setStatus('loading');
    try {
      // Ghi trực tiếp vào Supabase với approved = true để hiển thị ngay
      const { data, error } = await supabaseAnon
        .from('comments')
        .insert([
          {
            post_slug: postSlug,
            name: name.trim(),
            message: message.trim(),
            approved: true,
          },
        ])
        .select('id, name, message, created_at')
        .single();

      if (error) throw error;

      // Đẩy bình luận mới vào danh sách hiển thị phía trên ngay lập tức
      if (data && onCommentAdded) {
        onCommentAdded(data);
      }

      setStatus('success');
      setName('');
      setMessage('');

      // Tự động tắt thông báo thành công sau 4 giây
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error('[CommentForm] Error:', err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="comment-name"
          className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-sans"
        >
          Your Name
        </label>
        <input
          id="comment-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. HoopSoul, Allen I."
          maxLength={80}
          className="w-full px-3.5 py-2 text-xs sm:text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="comment-message"
          className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-sans"
        >
          Your Thought
        </label>
        <textarea
          id="comment-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your perspective, memories, or reflections on this story…"
          maxLength={2000}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all resize-none font-serif leading-relaxed"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 bg-[#e67e22] hover:bg-neutral-950 text-white text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-xs active:scale-95"
        >
          {status === 'loading' ? 'Posting…' : 'Send Comment →'}
        </button>

        {status === 'success' && (
          <span className="text-xs text-green-700 font-medium">
            ✓ Your thought has been published!
          </span>
        )}
        {status === 'error' && (
          <span className="text-xs text-red-600 font-medium">
            Could not post comment. Please try again.
          </span>
        )}
      </div>
    </form>
  );
}