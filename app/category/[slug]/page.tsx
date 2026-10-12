import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ page?: string }> | { page?: string };
};

// 1. METADATA CHUẨN SEO CHO TỪNG TRANG DANH MỤC & PHÂN TRANG
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = (resolvedParams?.slug || '').toLowerCase();
  
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const categoryTitles: Record<string, string> = {
    nba: 'NBA Stories',
    legends: 'Legends Archive',
    mindset: 'Mindset & Perseverance',
  };

  const title = categoryTitles[categorySlug] || categorySlug.toUpperCase();
  const pageSuffix = currentPage > 1 ? ` (Page ${currentPage})` : '';

  return {
    title: `${title}${pageSuffix} | The Grind Chronicle`,
    description: `Stories, raw journeys, and deep perspectives filed under ${title}.`,
    alternates: {
      canonical: currentPage > 1 ? `/category/${categorySlug}?page=${currentPage}` : `/category/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = (resolvedParams?.slug || '').toLowerCase();

  const categoryMeta: Record<string, { title: string; description: string }> = {
    nba: {
      title: 'NBA',
      description: 'Stories, raw journeys, and deep perspectives filed under NBA.',
    },
    legends: {
      title: 'Legends',
      description: 'Timeless legacies, historic battles, and the icons who shaped basketball history forever.',
    },
    mindset: {
      title: 'Mindset',
      description: 'The psychology of obsession, silent grit, and the unseen work behind greatness.',
    },
  };

  if (!categoryMeta[categorySlug]) {
    notFound();
  }

  const currentMeta = categoryMeta[categorySlug];
  const allPosts = getAllPosts();

  // 2. LỌC BÀI THEO DANH MỤC
  const filteredPosts = allPosts.filter((post) => {
    const postCategory = post.category?.toLowerCase() || '';
    const postTags = Array.isArray(post.tags)
      ? post.tags.map((t: string) => t.toLowerCase())
      : [];

    if (categorySlug === 'mindset') {
      return (
        postCategory === 'mindset' ||
        postCategory === 'perseverance' ||
        postTags.includes('mindset') ||
        postTags.includes('perseverance')
      );
    }

    if (categorySlug === 'legends') {
      return postCategory === 'legends' || postTags.includes('legends');
    }

    if (categorySlug === 'nba') {
      return postCategory === 'nba' || postTags.includes('nba');
    }

    return postCategory === categorySlug || postTags.includes(categorySlug);
  });

  // 3. XỬ LÝ PHÂN TRANG (CHUẨN 6 BÀI MỖI TRANG NHƯ HOME)
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const postsPerPage = 6;

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* ===== Header Category đồng bộ với Trang chủ ===== */}
      <section className="mb-6 sm:mb-8 pb-3 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
              CATEGORY
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600">
              ARCHIVE
            </span>
          </div>

          <h1
            className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-gray-900"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {currentMeta.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 italic">
            {currentMeta.description}
          </p>
        </div>

        <span className="text-[11px] uppercase tracking-widest text-amber-600 font-semibold hidden sm:inline-block">
          Curated Editorial
        </span>
      </section>

      {/* ===== Lưới bài viết: Tối đa 6 bài/trang ===== */}
      {currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {currentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              className="no-underline text-inherit group"
            >
              <article className="h-full flex flex-col bg-white border border-transparent hover:border-gray-100 rounded-sm transition-all duration-200">
                {/* Ảnh bìa bài viết tỷ lệ 16:9 */}
                {post.coverImage ? (
                  <div className="relative w-full aspect-[16/9] overflow-hidden mb-3.5 rounded-sm bg-neutral-100">
                    <img
                      src={post.coverImage}
                      alt={`${post.title} ${post.category || 'Basketball'} story cover`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-xs mb-3.5 rounded-sm">
                    The Grind Chronicle
                  </div>
                )}

                {/* Thông tin bài viết */}
                <div className="flex-1 flex flex-col">
                  <p className="text-amber-600 text-xs font-bold mb-1.5 uppercase tracking-wider">
                    {post.category || currentMeta.title}
                  </p>

                  <h2 className="text-base sm:text-lg font-bold mb-2 leading-snug text-gray-900 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h2>

                  <p
                    className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.summary}
                  </p>

                  <p className="text-xs text-gray-400 mb-3">
                    {post.author ? `${post.author} • ` : 'The Grind Chronicle • '}
                    {post.date}
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-amber-600 mt-auto flex items-center gap-1 transition-colors">
                    Read Story <span aria-hidden="true">→</span>
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-gray-200 rounded-sm my-6 bg-gray-50/50">
          <p className="font-serif italic text-gray-500 text-base mb-2">
            No stories published under {currentMeta.title} yet.
          </p>
          <p className="text-xs text-gray-400 font-sans">
            Our editorial team is currently drafting new deep essays for this archive.
          </p>
          <Link
            href="/"
            className="inline-block mt-5 text-xs font-semibold uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5 hover:text-amber-600 hover:border-amber-600 transition-colors"
          >
            ← Return to Home
          </Link>
        </div>
      )}

      {/* ===== THANH PHÂN TRANG (TỰ ĐỘNG XUẤT HIỆN KHI > 6 BÀI) ===== */}
      {totalPages > 1 && (
        <nav
          aria-label="Category Pagination"
          className="flex flex-wrap items-center justify-center gap-2 mt-10 mb-6"
        >
          {currentPage > 1 ? (
            <Link
              href={
                currentPage === 2
                  ? `/category/${categorySlug}`
                  : `/category/${categorySlug}?page=${currentPage - 1}`
              }
              className="px-3 sm:px-4 py-1.5 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 bg-white hover:border-amber-600 transition-colors"
            >
              Previous
            </Link>
          ) : (
            <span className="px-3 sm:px-4 py-1.5 border border-gray-200 rounded text-xs sm:text-sm text-gray-300 bg-gray-50 cursor-not-allowed">
              Previous
            </span>
          )}

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;
            const targetHref =
              pageNum === 1
                ? `/category/${categorySlug}`
                : `/category/${categorySlug}?page=${pageNum}`;
            return (
              <Link
                key={pageNum}
                href={targetHref}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 sm:px-3.5 py-1.5 border rounded text-xs sm:text-sm transition-colors ${
                  isActive
                    ? 'border-gray-900 bg-gray-900 text-white font-semibold'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-amber-600'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {currentPage < totalPages ? (
            <Link
              href={`/category/${categorySlug}?page=${currentPage + 1}`}
              className="px-3 sm:px-4 py-1.5 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 bg-white hover:border-amber-600 transition-colors"
            >
              Next
            </Link>
          ) : (
            <span className="px-3 sm:px-4 py-1.5 border border-gray-200 rounded text-xs sm:text-sm text-gray-300 bg-gray-50 cursor-not-allowed">
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}