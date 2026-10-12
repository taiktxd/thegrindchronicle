'use client';

import { useState, useSyncExternalStore } from 'react';
import SubscribeModal from './SubscribeModal';

interface PostActionsProps {
  slug: string;
  title: string;
}

// 1. Đăng ký theo dõi thay đổi localStorage chuẩn React (Không cần useEffect)
function subscribeToSavedPosts(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('tgc_saved_posts_updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('tgc_saved_posts_updated', callback);
  };
}

function getSavedSnapshot() {
  return typeof window !== 'undefined'
    ? localStorage.getItem('tgc_saved_posts') || '[]'
    : '[]';
}

function getServerSnapshot() {
  return '[]';
}

export default function PostActions({ slug, title }: PostActionsProps) {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. Đọc trực tiếp danh sách bài đã lưu không gây cascading render
  const savedPostsJson = useSyncExternalStore(
    subscribeToSavedPosts,
    getSavedSnapshot,
    getServerSnapshot
  );

  // Kiểm tra bài viết hiện tại đã được lưu hay chưa
  const isSaved = (() => {
    try {
      const list = JSON.parse(savedPostsJson);
      return Array.isArray(list) && list.includes(slug);
    } catch {
      return false;
    }
  })();

  // 3. Hàm kích hoạt Floating Toast tự tan sau 3 giây
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // 4. Xử lý Lưu bài viết (Không dùng alert thời cũ)
  const handleSave = () => {
    const subscriber =
      localStorage.getItem('tgc_subscriber_email') ||
      localStorage.getItem('subscriber_email');

    // Chưa đăng nhập / subscribe: Mở hộp thoại Inner Circle
    if (!subscriber) {
      setIsSubscribeOpen(true);
      return;
    }

    try {
      const saved = localStorage.getItem('tgc_saved_posts');
      let postsArray: string[] = saved ? JSON.parse(saved) : [];

      if (postsArray.includes(slug)) {
        postsArray = postsArray.filter((s) => s !== slug);
        showToast('Story removed from your reading list.');
      } else {
        postsArray.push(slug);
        showToast('Story saved to your reading list!');
      }

      localStorage.setItem('tgc_saved_posts', JSON.stringify(postsArray));
      window.dispatchEvent(new Event('tgc_saved_posts_updated'));
    } catch {
      showToast('Could not update saved stories.');
    }
  };

  // 5. Xử lý Chia sẻ (Share) bài viết
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!');
    } catch {
      showToast('Unable to copy link.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* NÚT SAVE STORY */}
        <button
          type="button"
          onClick={handleSave}
          className={`px-3 sm:px-4 py-2 border rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
            isSaved
              ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
              : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900 hover:text-neutral-950'
          }`}
        >
          <svg
            className={`w-3.5 h-3.5 ${
              isSaved ? 'fill-current text-[#e67e22]' : 'text-neutral-500'
            }`}
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span>{isSaved ? 'Saved' : 'Save Story'}</span>
        </button>

        {/* NÚT SHARE */}
        <button
          type="button"
          onClick={handleShare}
          className="px-3 sm:px-4 py-2 border border-neutral-200 bg-white rounded-lg text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <svg
            className="w-3.5 h-3.5 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* MODAL INNER CIRCLE */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />

      {/* FLOATING TOAST THÔNG BÁO TỰ BIẾN MẤT */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 bg-neutral-950 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-neutral-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#e67e22] shrink-0"></span>
          <span className="font-medium font-sans">{toastMessage}</span>
        </div>
      )}
    </>
  );
}