import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const allPosts = getAllPosts();
  const resolvedSearchParams = await searchParams;
  
  // Mỗi trang lưới phụ hiển thị tối đa 6 bài (chuẩn 2 hàng x 3 cột)
  const POSTS_PER_GRID = 6;

  // Tính tổng số trang: Trang 1 chứa 1 Hero + 6 bài phụ (= 7 bài). Các trang sau chứa 6 bài.
  const totalPages =
    allPosts.length <= 7
      ? 1
      : 1 + Math.ceil((allPosts.length - 7) / POSTS_PER_GRID);

  const rawPage = Number(resolvedSearchParams?.page) || 1;
  const currentPage = Math.max(1, Math.min(rawPage, totalPages));
  const isFirstPage = currentPage === 1;

  let featuredPost = null;
  let gridPosts: typeof allPosts = [];

  if (isFirstPage) {
    // Trang 1: 1 bài Hero tiêu điểm + đúng 6 bài lưới bên dưới
    featuredPost = allPosts[0] || null;
    gridPosts = allPosts.slice(1, 7);
  } else {
    // Trang 2 trở đi: Lấy đúng 6 bài, lấp đầy tròn vẹn lưới 3 cột
    const startIndex = 7 + (currentPage - 2) * POSTS_PER_GRID;
    gridPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_GRID);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* ===== 1. HERO SECTION: BÀI TIÊU ĐIỂM (CHỈ Ở TRANG 1) ===== */}
      {featuredPost && (
        <section className="mb-8">
          <Link
            href={`/post/${featuredPost.slug}`}
            className="group block no-underline text-inherit"
          >
            <article className="bg-white border border-neutral-200/80 border-l-4 border-l-[#e67e22] rounded-tl-xl rounded-bl-xl p-4 sm:p-6 lg:p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Ảnh Hero */}
                <div className="lg:col-span-6 overflow-hidden rounded-lg bg-neutral-100">
                  {featuredPost.coverImage ? (
                    <div className="w-full aspect-[16/9] overflow-hidden">
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title || ""}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Nội dung Hero */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-neutral-900 text-white rounded-xs">
                      Story Of The Week
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e67e22]">
                      {featuredPost.category}
                    </span>
                  </div>

                  <h2
                    className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950 leading-[1.25] mb-2.5 group-hover:text-[#e67e22] transition-colors"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {featuredPost.title}
                  </h2>

                  <p
                    className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-4 font-serif line-clamp-3"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {featuredPost.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-3 border-t border-neutral-100 font-sans">
                    <div>
                      <span className="font-semibold text-neutral-800">
                        {featuredPost.author}
                      </span>{" "}
                      • <span>{featuredPost.date}</span>
                    </div>
                    <span className="font-semibold text-neutral-900 group-hover:translate-x-1 group-hover:text-[#e67e22] transition-all inline-flex items-center gap-1">
                      Read Story →
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* ===== THANH TIÊU ĐỀ NỐI (ĐÃ BỎ DẤU GẠCH NGANG) ===== */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200">
        <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-800">
          {isFirstPage ? "Latest Stories" : `Archive Page ${currentPage}`}
        </h3>
        <span className="text-[11px] text-neutral-400 font-serif italic">
          More from the chronicle
        </span>
      </div>

      {/* ===== 2. SECONDARY GRID (TỐI ĐA 6 BÀI, KHÔNG BỊ HỞ LỖ) ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {gridPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/post/${post.slug}`}
            className="group block no-underline text-inherit"
          >
            <article className="h-full flex flex-col">
              {post.coverImage ? (
                <div className="w-full aspect-[16/10] overflow-hidden rounded-sm bg-neutral-100 mb-3">
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

              <div className="flex-1 flex flex-col">
                <p className="text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  {post.category}
                </p>

                <h3
                  className="font-serif text-lg font-bold leading-snug text-neutral-950 mb-2 group-hover:text-neutral-600 transition-colors"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {post.title}
                </h3>

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

      {/* ===== 3. PHÂN TRANG (PAGINATION) ===== */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12 mb-6 font-sans">
          {currentPage > 1 ? (
            <Link
              href={`/?page=${currentPage - 1}`}
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
                href={`/?page=${pageNum}`}
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
              href={`/?page=${currentPage + 1}`}
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