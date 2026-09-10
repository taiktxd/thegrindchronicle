import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
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
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Tiêu đề Category */}
      <div style={{ marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", textTransform: "uppercase" }}>
          Category: <span style={{ color: "#e67e22" }}>{categoryName}</span>
        </h1>
        <p style={{ color: "#666", marginTop: "8px" }}>
          Explore all stories filed under {categoryName}.
        </p>
      </div>

      {/* Trường hợp KHÔNG có bài viết */}
      {categoryPosts.length === 0 ? (
        <div style={{ padding: "60px 0", textDecoration: "none", color: "#888" }}>
          <p>No stories found for <strong>{categoryName}</strong> yet.</p>
        </div>
      ) : (
        /* Grid hiển thị danh sách bài viết */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {currentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                }}
              >
                {post.coverImage ? (
                  <div style={{ width: "100%", height: "220px", overflow: "hidden", marginBottom: "16px" }}>
                    <img
                      src={post.coverImage}
                      alt={post.title || ""}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "220px",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#a0a0a0",
                      marginBottom: "16px",
                    }}
                  >
                    No Image
                  </div>
                )}

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ color: "#e67e22", fontSize: "0.75rem", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>
                    {post.category}
                  </p>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "12px", lineHeight: "1.35", color: "#111" }}>
                    {post.title}
                  </h2>
                  <p style={{ color: "#555", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.summary}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "16px" }}>
                    {post.author} • {post.date}
                  </p>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#111", marginTop: "auto" }}>
                    Read Story →
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "60px" }}>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;
            return (
              <Link
                key={pageNum}
                href={`/category/${rawSlug}?page=${pageNum}`}
                style={{
                  padding: "8px 14px",
                  border: isActive ? "1px solid #111" : "1px solid #ddd",
                  borderRadius: "4px",
                  background: isActive ? "#111" : "white",
                  color: isActive ? "white" : "#333",
                  textDecoration: "none",
                }}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}