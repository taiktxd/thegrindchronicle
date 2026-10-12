'use client';

import { useState, useEffect } from 'react';
import { supabaseAnon } from '@/lib/supabase';
import CommentForm from './CommentForm';

interface CommentItem {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const COMMENTS_PER_PAGE = 10;

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Tải danh sách bình luận (MỚI NHẤT LÊN ĐẦU TRANG 1)
  useEffect(() => {
    let isCancelled = false;

    supabaseAnon
      .from('comments')
      .select('id, name, message, created_at')
      .eq('post_slug', postSlug)
      .eq('approved', true)
      .order('created_at', { ascending: false }) // <-- Đổi thành false ở đây
      .then(
        ({ data, error }) => {
          if (isCancelled) return;
          if (error) {
            console.error('Error fetching comments:', error.message);
          } else {
            setComments(data || []);
          }
          setLoading(false);
        },
        (err: unknown) => {
          if (isCancelled) return;
          console.error('Unexpected error loading comments:', err);
          setLoading(false);
        }
      );

    return () => {
      isCancelled = true;
    };
  }, [postSlug]);

  // 2. Tính toán phân trang 10 bình luận / trang
  const totalComments = comments.length;
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const currentComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

  // Cuộn nhẹ về đầu danh sách bình luận khi đổi trang
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.getElementById('discussion-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Nhận diện bình luận của Tòa soạn để gắn huy hiệu EDITORIAL
  const isEditorial = (name: string) => {
    const clean = name?.trim().toLowerCase();
    return clean === 'the grind chronicle' || clean === 'hoopsoul';
  };

  return (
    <section id="discussion-anchor" className="mt-12 pt-8 border-t border-neutral-200/80 font-sans">
      
      {/* TIÊU ĐỀ KHU VỰC THẢO LUẬN */}
      <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-neutral-100">
        <h2
          className="text-lg sm:text-xl font-bold uppercase tracking-tight text-neutral-950"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Discussion &amp; Reader Thoughts{' '}
          <span className="text-neutral-500 font-sans text-base font-normal">
            ({totalComments})
          </span>
        </h2>
        <span className="text-xs text-neutral-400 font-serif italic hidden sm:inline">
          Reader Community
        </span>
      </div>

      {/* DANH SÁCH BÌNH LUẬN */}
      {loading ? (
        <p className="text-xs text-neutral-400 font-serif italic py-6">
          Loading conversation…
        </p>
      ) : totalComments === 0 ? (
        <p className="text-xs sm:text-sm text-neutral-500 font-serif italic mb-8">
          No thoughts shared yet. Be the first to share your perspective on this story.
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          {currentComments.map((c) => {
            const editorial = isEditorial(c.name);

            return (
              <div
                key={c.id}
                className={
                  editorial
                    ? 'bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 sm:p-5 shadow-2xs'
                    : 'border-b border-neutral-100 pb-4'
                }
              >
                {/* Header bình luận */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-bold text-sm text-neutral-950">
                    {c.name}
                  </span>

                  {editorial && (
                    <span className="bg-[#e67e22] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase font-sans">
                      EDITORIAL
                    </span>
                  )}

                  <span className="text-neutral-300">•</span>
                  <span className="text-[11.5px] text-neutral-400">
                    {new Date(c.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Nội dung phản hồi */}
                <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line font-sans">
                  {c.message}
                </p>
              </div>
            );
          })}

          {/* CỤM ĐIỀU HƯỚNG PHÂN TRANG (CHỈ HIỂN THỊ KHI CÓ TRÊN 10 BÌNH LUẬN) */}
          {totalPages > 1 && (
            <div className="pt-4 flex items-center justify-between border-t border-neutral-100 text-xs">
              <span className="text-neutral-400">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded border border-neutral-200 text-neutral-700 hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-200 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-7 h-7 rounded text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-neutral-950 text-white font-bold'
                          : 'border border-neutral-200 text-neutral-700 hover:border-neutral-900 bg-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded border border-neutral-200 text-neutral-700 hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-200 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FORM NHẬP BÌNH LUẬN */}
      <div className="mt-8 pt-6 border-t border-neutral-100">
        <CommentForm postSlug={postSlug} />
      </div>

    </section>
  );
}