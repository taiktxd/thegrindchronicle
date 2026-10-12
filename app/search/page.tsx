import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

const POSTS_PER_PAGE = 6;

// Tối ưu SEO cho trang tìm kiếm
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const q = resolved.q?.trim();
  return {
    title: q ? `Search: "${q}" | The Grind Chronicle` : 'Search Stories | The Grind Chronicle',
    description: 'Search basketball stories, legends, and mindset journeys.',
  };
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() || '';
  const pageParam = parseInt(resolvedSearchParams.page || '1', 10);

  // 1. Lấy toàn bộ bài viết
  const allPosts = getAllPosts();

  // 2. Lọc bài viết theo từ khóa query
  const filteredPosts = query
    ? allPosts.filter((post) => {
        const q = query.toLowerCase();
        const matchTitle = post.title?.toLowerCase().includes(q);
        const matchSummary = post.summary?.toLowerCase().includes(q);
        const matchCategory = post.category?.toLowerCase().includes(q);
        const matchTags = post.tags?.some((tag: string) =>
          tag.toLowerCase().includes(q)
        );

        return matchTitle || matchSummary || matchCategory || matchTags;
      })
    : [];

  // 3. Tính toán phân trang 6 bài / trang
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(isNaN(pageParam) ? 1 : pageParam, 1), Math.max(totalPages, 1));

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const makePageLink = (page: number) =>
    `/search?q=${encodeURIComponent(query)}&page=${page}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[65vh] font-sans">
      
      {/* TIÊU ĐỀ KẾT QUẢ TÌM KIẾM */}
      <div className="mb-8 pb-4 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Search Archive
          </span>
          <h1
            className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Search Results for:{' '}
            <span className="text-[#e67e22] font-semibold italic">
              &ldquo;{query}&rdquo;
            </span>
          </h1>
        </div>

        {totalPosts > 0 && (
          <span className="text-xs text-neutral-400 font-sans">
            Showing {startIndex + 1}–{Math.min(startIndex + POSTS_PER_PAGE, totalPosts)} of {totalPosts} stories
          </span>
        )}
      </div>

      {/* NỘI DUNG HIỂN THỊ */}
      {!query ? (
        <div className="py-16 text-center bg-white border border-neutral-200/80 rounded-2xl p-8">
          <p className="text-neutral-500 text-sm font-serif italic mb-3">
            Please enter a keyword in the search bar above to explore stories.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#e67e22] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      ) : totalPosts === 0 ? (
        <div className="py-16 text-center bg-white border border-neutral-200/80 rounded-2xl p-8">
          <p className="text-neutral-500 text-sm font-serif italic mb-4">
            No stories found matching &ldquo;{query}&rdquo;. Try another legend, team, or keyword.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:text-black hover:border-black transition-colors"
          >
            Browse All Stories →
          </Link>
        </div>
      ) : (
        <>
          {/* LƯỚI BÀI VIẾT (GRID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
            {paginatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/post/${post.slug}`}
                className="group flex flex-col bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200"
              >
                {/* ẢNH BÌA */}
                <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title || ''}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-serif italic">
                      The Grind Chronicle
                    </div>
                  )}
                </div>

                {/* THÔNG TIN BÀI VIẾT */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#e67e22] block mb-2 font-sans">
                      {post.category || 'NBA'}
                    </span>

                    <h2
                      className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-[#e67e22] transition-colors leading-snug line-clamp-2 mb-2 font-serif"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {post.title}
                    </h2>

                    {post.summary && (
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4 font-sans">
                        {post.summary}
                      </p>
                    )}
                  </div>

                  {/* TÁC GIẢ & NGÀY THÁNG */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-sans">
                    <span>{post.date}</span>
                    <span className="font-semibold text-neutral-800 group-hover:text-[#e67e22] transition-colors">
                      Read Story →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CỤM ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-4 font-sans">
              {currentPage > 1 ? (
                <Link
                  href={makePageLink(currentPage - 1)}
                  className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-700 hover:border-neutral-900 bg-white transition-colors"
                >
                  Previous
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs border border-neutral-100 rounded-lg text-neutral-300 bg-neutral-50/50 cursor-not-allowed">
                  Previous
                </span>
              )}

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                const isActive = currentPage === pageNum;
                return (
                  <Link
                    key={pageNum}
                    href={makePageLink(pageNum)}
                    className={`px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                      isActive
                        ? 'border-neutral-950 bg-neutral-950 text-white font-medium shadow-2xs'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-900 bg-white'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {currentPage < totalPages ? (
                <Link
                  href={makePageLink(currentPage + 1)}
                  className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-700 hover:border-neutral-900 bg-white transition-colors"
                >
                  Next
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs border border-neutral-100 rounded-lg text-neutral-300 bg-neutral-50/50 cursor-not-allowed">
                  Next
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs text-neutral-400 font-serif italic">
          Searching stories across the archive…
        </div>
      }
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}