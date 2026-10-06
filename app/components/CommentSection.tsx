'use client';

import { useState, useEffect } from 'react';
import { supabaseAnon } from '@/lib/supabase';
import CommentForm from './CommentForm';

interface CommentItem {
  id: string | number;
  name: string;
  message: string;
  created_at: string;
}

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const COMMENTS_PER_PAGE = 6;

  useEffect(() => {
    async function fetchComments() {
      try {
        const { data, error } = await supabaseAnon
          .from('comments')
          .select('id, name, message, created_at')
          .eq('post_slug', postSlug)
          .eq('approved', true)
          .order('created_at', { ascending: false }); // Bình luận mới nhất lên đầu

        if (!error && data) {
          setComments(data);
        }
      } catch (err) {
        console.warn('[CommentSection] Notice:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postSlug]);

  // Nhận bình luận mới từ Form và đưa thẳng lên đầu danh sách
  const handleCommentAdded = (newComment: CommentItem) => {
    setComments((prev) => [newComment, ...prev]);
    setCurrentPage(1); // Đưa về trang 1 để xem ngay
  };

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const currentComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

  return (
    <section className="mt-12 pt-8 border-t border-neutral-200">
      {/* Tiêu đề mục thảo luận */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e67e22]" />
          <h2
            className="font-serif font-bold text-base sm:text-lg text-neutral-950 uppercase tracking-wide"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Discussion &amp; Reader Thoughts
          </h2>
          {comments.length > 0 && (
            <span className="text-xs font-sans text-neutral-400 font-medium">
              ({comments.length})
            </span>
          )}
        </div>
        <span className="text-[11px] text-neutral-400 font-serif italic">
          Reader Community
        </span>
      </div>

      {/* Danh sách bình luận */}
      {loading ? (
        <p className="text-xs text-neutral-400 italic py-4 font-serif">
          Loading conversation…
        </p>
      ) : comments.length === 0 ? (
        <div className="py-6 text-center text-neutral-400 font-serif italic text-xs mb-6">
          No reader thoughts recorded yet. Be the first to share your perspective below.
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 mb-6">
          {currentComments.map((c) => {
            const initialLetter = c.name ? c.name.charAt(0).toUpperCase() : '?';
            return (
              <article key={c.id} className="py-3.5 first:pt-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {initialLetter}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-xs text-neutral-900 font-sans">
                      {c.name}
                    </span>
                    <span className="text-neutral-300 text-[10px]">•</span>
                    <time className="text-[11px] text-neutral-400 font-sans">
                      {new Date(c.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </div>

                <p
                  className="text-xs sm:text-sm text-neutral-700 font-serif leading-relaxed pl-8.5 whitespace-pre-line"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {c.message}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {/* Phân trang (khi có trên 6 comment) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-4 mb-8 border-y border-neutral-100 font-sans">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 text-xs border border-neutral-200 rounded text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`px-2.5 py-1 text-xs border rounded transition-colors ${
                  isActive
                    ? 'border-neutral-950 bg-neutral-950 text-white font-medium'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-900 bg-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 text-xs border border-neutral-200 rounded text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Khung gửi bình luận */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 font-sans">
          Leave a thought
        </h3>
        <CommentForm postSlug={postSlug} onCommentAdded={handleCommentAdded} />
      </div>
    </section>
  );
}