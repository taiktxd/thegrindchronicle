import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = slug.toLowerCase();
  const categoryName = rawSlug.toUpperCase();
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const canonicalUrl =
    currentPage > 1
      ? `/category/${rawSlug}?page=${currentPage}`
      : `/category/${rawSlug}`;

  return {
    title:
      currentPage > 1
        ? `${categoryName} Stories (Page ${currentPage}) | The Grind Chronicle`
        : `${categoryName} Stories | The Grind Chronicle`,
    description: `Explore all basketball and culture stories filed under ${categoryName} on The Grind Chronicle.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug.toLowerCase();

  // 1. Lấy toàn bộ bài viết
  const allPosts = getAllPosts();

  // 2. Lọc bài viết khớp với category HOẶC tag (không phân biệt hoa thường)
  const categoryPosts = allPosts.filter((post) => {
    const matchCategory = post.category?.toLowerCase() === rawSlug;
    const matchTag = post.tags?.some((t: string) => t.toLowerCase() === rawSlug);
    return matchCategory || matchTag;
  });

  // 3. Xử lý phân trang
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const postsPerPage = 6;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = categoryPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(categoryPosts.length / postsPerPage);

  const categoryName = rawSlug.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Tiêu đề Category — Thẻ H1 duy nhất của trang Category */}
      <header className="mb-8 pb-4 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-gray-900"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Category: <span className="text-amber-600">{categoryName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Explore all deep basketball profiles and stories filed under {categoryName}.
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {categoryPosts.length} {categoryPosts.length === 1 ? "Story" : "Stories"}
        </span>
      </header>

      {/* Trường hợp KHÔNG có bài viết */}
      {categoryPosts.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p>No stories found for <strong>{categoryName}</strong> yet.</p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-semibold text-amber-600 hover:underline"
          >
            ← Return to Homepage
          </Link>
        </div>
      ) : (
        /* Grid hiển thị danh sách bài viết — Tỷ lệ ảnh chuẩn hóa 16:9 đồng nhất */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {currentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              className="no-underline text-inherit group"
            >
              <article className="h-full flex flex-col bg-white border border-transparent hover:border-gray-100 rounded-sm transition-all duration-200">
                {/* Ảnh bìa bài viết — 16:9 aspect ratio */}
                {post.coverImage ? (
                  <div className="relative w-full aspect-[16/9] overflow-hidden mb-3.5 rounded-sm bg-neutral-100">
                    <img
                      src={post.coverImage}
                      alt={`${post.title} - ${categoryName} story cover`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-xs mb-3.5 rounded-sm">
                    {categoryName}
                  </div>
                )}

                {/* Nội dung card */}
                <div className="flex-1 flex flex-col">
                  <p className="text-amber-600 text-xs font-bold mb-1.5 uppercase tracking-wider">
                    {post.category}
                  </p>

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
      )}

      {/* Phân trang — Thẻ Link trang 1 trỏ trực tiếp về /category/${rawSlug} không kèm "?page=1" */}
      {totalPages > 1 && (
        <nav
          aria-label="Category Pagination"
          className="flex flex-wrap items-center justify-center gap-2 mt-10 mb-6"
        >
          {currentPage > 1 ? (
            <Link
              href={
                currentPage === 2
                  ? `/category/${rawSlug}`
                  : `/category/${rawSlug}?page=${currentPage - 1}`
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
                ? `/category/${rawSlug}`
                : `/category/${rawSlug}?page=${pageNum}`;

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
              href={`/category/${rawSlug}?page=${currentPage + 1}`}
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