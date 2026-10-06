import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

interface CategoryPageProps {
  params: Promise<{ slug?: string; category?: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || resolvedParams.category || "";
  const targetKey = decodeURIComponent(rawSlug).toLowerCase().trim();

  // Tên danh mục hiển thị trên tiêu đề
  const categoryName = decodeURIComponent(rawSlug).replace(/-/g, " ");

  // 1. LẤY VÀ LỌC BÀI VIẾT: Kiểm tra cả Category VÀ Tags (Khắc phục triệt để lỗi 404 Mindset)
  const allPosts = getAllPosts();
  const categoryPosts = allPosts.filter((post) => {
    const postCategory = post.category?.toLowerCase().trim();
    const matchCategory = postCategory === targetKey;

    const matchTags =
      Array.isArray(post.tags) &&
      post.tags.some((tag) => tag.toLowerCase().trim() === targetKey);

    return matchCategory || matchTags;
  });

  // 2. XỬ LÝ PHÂN TRANG (TỐI ĐA 6 BÀI / TRANG)
  const POSTS_PER_PAGE = 6;
  const resolvedSearchParams = await searchParams;
  const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);

  const rawPage = Number(resolvedSearchParams?.page) || 1;
  const currentPage = Math.max(1, Math.min(rawPage, totalPages || 1));

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = categoryPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* ===== THANH TIÊU ĐỀ DANH MỤC ===== */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e67e22]" />
          <h1 className="text-xs uppercase tracking-widest font-bold text-neutral-900">
            {categoryName} Collection
            {totalPages > 1 && (
              <span className="font-normal text-neutral-500 ml-2">
                (Page {currentPage})
              </span>
            )}
          </h1>
        </div>
        <span className="text-[11px] text-neutral-400 font-serif italic">
          {categoryPosts.length} {categoryPosts.length === 1 ? "story" : "stories"}
        </span>
      </div>

      {/* ===== TRƯỜNG HỢP DANH MỤC CHƯA CÓ BÀI ===== */}
      {categoryPosts.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-serif">
          <p className="text-base mb-2">No stories found under {categoryName} yet.</p>
          <Link
            href="/"
            className="text-xs font-sans uppercase tracking-widest text-neutral-900 underline font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      ) : (
        /* ===== LƯỚI BÀI VIẾT (TỐI ĐA 6 BÀI / TRANG) ===== */
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              className="group block no-underline text-inherit"
            >
              <article className="h-full flex flex-col bg-white">
                {/* Ảnh bìa bài viết */}
                {post.coverImage ? (
                  <div className="w-full aspect-[16/10] overflow-hidden rounded-sm bg-neutral-100 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title || ""}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/10] bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm mb-3">
                    No Image
                  </div>
                )}

                {/* Thông tin bài viết */}
                <div className="flex-1 flex flex-col">
                  <p className="text-[#e67e22] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                    {post.category}
                  </p>

                  <h2
                    className="font-serif text-lg font-bold leading-snug text-neutral-950 mb-2 group-hover:text-neutral-600 transition-colors"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {post.title}
                  </h2>

                  <p
                    className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-3 font-serif line-clamp-2"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {post.summary}
                  </p>

                  <div className="mt-auto pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
                    <span>
                      {post.author} • {post.date}
                    </span>
                    <span className="font-medium text-neutral-900 group-hover:underline">
                      Read →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}

      {/* ===== BỘ PHÂN TRANG (PAGINATION) ===== */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12 mb-6 font-sans">
          {currentPage > 1 ? (
            <Link
              href={`/category/${rawSlug}?page=${currentPage - 1}`}
              className="px-3 py-1.5 border border-neutral-300 rounded text-xs text-neutral-700 bg-white hover:border-neutral-900 transition-colors"
            >
              Previous
            </Link>
          ) : (
            <span className="px-3 py-1.5 border border-neutral-200 rounded text-xs text-neutral-300 bg-neutral-50 cursor-not-allowed">
              Previous
            </span>
          )}

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;
            return (
              <Link
                key={pageNum}
                href={`/category/${rawSlug}?page=${pageNum}`}
                className={`px-3 py-1.5 border rounded text-xs transition-colors ${
                  isActive
                    ? "border-neutral-950 bg-neutral-950 text-white font-medium"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {currentPage < totalPages ? (
            <Link
              href={`/category/${rawSlug}?page=${currentPage + 1}`}
              className="px-3 py-1.5 border border-neutral-300 rounded text-xs text-neutral-700 bg-white hover:border-neutral-900 transition-colors"
            >
              Next
            </Link>
          ) : (
            <span className="px-3 py-1.5 border border-neutral-200 rounded text-xs text-neutral-300 bg-neutral-50 cursor-not-allowed">
              Next
            </span>
          )}
        </div>
      )}
    </div>
  );
}