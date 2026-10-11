'use client';

import { useState, useEffect } from 'react';

type Props = {
  slug: string;
  title: string;
};

export default function PostActions({ slug, title }: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lấy email thành viên hiện tại
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('tgc_subscriber_email') : null;

  // 1. Khi mở bài viết: Hỏi Supabase xem email này đã lưu bài này chưa (không dùng localStorage)
  useEffect(() => {
    if (!userEmail) return;

    async function checkSavedStatus() {
      try {
        const res = await fetch(`/api/saved-posts?email=${encodeURIComponent(userEmail!)}&slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setIsSaved(!!data.isSaved);
      } catch {
        setIsSaved(false);
      }
    }

    checkSavedStatus();
  }, [userEmail, slug]);

  // 2. Thao tác Lưu / Hủy lưu trực tiếp vào cơ sở dữ liệu Supabase
  const handleToggleSave = async () => {
    if (!userEmail) {
      alert('Please join the Inner Circle (Subscribe) first to save this story to your account.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/saved-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          slug,
          title,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.isSaved);
      } else {
        alert(data.error || 'Failed to update saved story.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Chia sẻ link
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Nút Save/Bookmark liên kết Supabase */}
      <button
        type="button"
        onClick={handleToggleSave}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          isSaved
            ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900 hover:text-black'
        }`}
        title={isSaved ? 'Remove from saved' : 'Save story'}
      >
        <svg
          className="w-3.5 h-3.5"
          fill={isSaved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <span>{loading ? 'Updating…' : isSaved ? 'Saved in Account' : 'Save Story'}</span>
      </button>

      {/* Nút Share */}
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>{copied ? 'Copied Link!' : 'Share'}</span>
      </button>
    </div>
  );
}