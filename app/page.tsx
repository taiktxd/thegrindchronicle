import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

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
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Grid danh sách bài viết */}
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
              {/* Ảnh bìa bài viết */}
              {post.coverImage ? (
                <div
                  style={{
                    width: "100%",
                    height: "220px",
                    overflow: "hidden",
                    marginBottom: "16px",
                  }}
                >
                  <img
                    src={post.coverImage}
                    alt={post.title || ""}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
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
                    fontSize: "0.9rem",
                    marginBottom: "16px",
                  }}
                >
                  No Image
                </div>
              )}

              {/* Cụm thông tin bài viết */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    color: "#e67e22",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {post.category}
                </p>

                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "12px",
                    lineHeight: "1.35",
                    color: "#111",
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    color: "#555",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.summary}
                </p>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#888",
                    marginBottom: "16px",
                  }}
                >
                  {post.author} • {post.date}
                </p>

                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#111",
                    marginTop: "auto",
                  }}
                >
                  Read Story →
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Cụm Phân trang (Pagination) */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "60px",
            marginBottom: "40px",
          }}
        >
          {currentPage > 1 ? (
            <Link
              href={`/?page=${currentPage - 1}`}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "white",
                textDecoration: "none",
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Previous
            </Link>
          ) : (
            <span
              style={{
                padding: "8px 16px",
                border: "1px solid #eee",
                borderRadius: "4px",
                background: "#f9f9f9",
                color: "#ccc",
                cursor: "not-allowed",
                fontSize: "0.9rem",
              }}
            >
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
                style={{
                  padding: "8px 14px",
                  border: isActive ? "1px solid #111" : "1px solid #ddd",
                  borderRadius: "4px",
                  background: isActive ? "#111" : "white",
                  color: isActive ? "white" : "#333",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                {pageNum}
              </Link>
            );
          })}

          {currentPage < totalPages ? (
            <Link
              href={`/?page=${currentPage + 1}`}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "white",
                textDecoration: "none",
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Next
            </Link>
          ) : (
            <span
              style={{
                padding: "8px 16px",
                border: "1px solid #eee",
                borderRadius: "4px",
                background: "#f9f9f9",
                color: "#ccc",
                cursor: "not-allowed",
                fontSize: "0.9rem",
              }}
            >
              Next
            </span>
          )}
        </div>
      )}
    </div>
  );
}