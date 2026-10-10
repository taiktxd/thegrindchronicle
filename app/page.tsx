import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const canonicalUrl = currentPage > 1 ? `/?page=${currentPage}` : "/";

  return {
    title:
      currentPage > 1
        ? `Latest Stories (Page ${currentPage}) | The Grind Chronicle`
        : "The Grind Chronicle | Stories Behind Basketball Greatness",
    description:
      "Deep, emotional, and human stories behind sports icons, NBA legends, and basketball greatness.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 1. Lấy tất cả bài viết từ file JSON/MDX
  const allPosts = getAllPosts();

  // 2. Xử lý phân trang qua URL query (?page=1, ?page=2)
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const postsPerPage = 6;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* ===== Single H1 Heading for Brand & Section SEO ===== */}
      <section className="mb-6 sm:mb-8 pb-3 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-gray-900"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            The Grind Chronicle  Latest Stories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 italic">
            The untold journeys, mindset, and defining moments of basketball icons.
          </p>
        </div>
        <span className="text-[11px] uppercase tracking-widest text-amber-600 font-semibold hidden sm:inline-block">
          Curated Editorial
        </span>
      </section>

      {/* Grid danh sách bài viết — 1 cột mobile, 2 cột tablet, 3 cột desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
        {currentPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/post/${post.slug}`}
            className="no-underline text-inherit group"
          >
            <article className="h-full flex flex-col bg-white border border-transparent hover:border-gray-100 rounded-sm transition-all duration-200">
              {/* Ảnh bìa bài viết — Chuẩn hóa tỷ lệ 16:9 cố định để các card bằng nhau chằn chặn */}
              {post.coverImage ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden mb-3.5 rounded-sm bg-neutral-100">
                  <img
                    src={post.coverImage}
                    alt={`${post.title} - ${post.category || "Basketball"} story cover`}
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

              {/* Cụm thông tin bài viết */}
              <div className="flex-1 flex flex-col">
                <p className="text-amber-600 text-xs font-bold mb-1.5 uppercase tracking-wider">
                  {post.category}
                </p>

                {/* Heading H2 cho từng bài viết để tuân thủ phân cấp tiêu đề chuẩn SEO */}
                <h2 className="text-base sm:text-lg font-bold mb-2 leading-snug text-gray-900 group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h2>

                <p
                  className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.summary}
                </p>

                <p className="text-xs text-gray-400 mb-3">
                  {post.author} • {post.date}
                </p>

                <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-amber-600 mt-auto flex items-center gap-1 transition-colors">
                  Read Story <span aria-hidden="true">→</span>
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Cụm Phân trang — Thẻ Link trang 1 luôn trỏ về "/" gốc để tránh duplicate URL với "?page=1" */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex flex-wrap items-center justify-center gap-2 mt-10 mb-6"
        >
          {currentPage > 1 ? (
            <Link
              href={currentPage === 2 ? "/" : `/?page=${currentPage - 1}`}
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
            const targetHref = pageNum === 1 ? "/" : `/?page=${pageNum}`;
            return (
              <Link
                key={pageNum}
                href={targetHref}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 sm:px-3.5 py-1.5 border rounded text-xs sm:text-sm transition-colors ${
                  isActive
                    ? "border-gray-900 bg-gray-900 text-white font-semibold"
                    : "border-gray-300 bg-white text-gray-700 hover:border-amber-600"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {currentPage < totalPages ? (
            <Link
              href={`/?page=${currentPage + 1}`}
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