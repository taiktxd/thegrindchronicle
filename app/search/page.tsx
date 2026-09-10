import { Suspense } from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() || "";

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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Tiêu đề kết quả tìm kiếm */}
      <div style={{ marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "800" }}>
          Search Results for:{" "}
          <span style={{ color: "#e67e22", fontWeight: "600" }}>
            &quot;{query}&quot;
          </span>
        </h1>
      </div>

      {/* Hiển thị danh sách bài viết hoặc thông báo */}
      {!query ? (
        <p style={{ color: "#888" }}>Please enter a search keyword.</p>
      ) : filteredPosts.length === 0 ? (
        <p style={{ color: "#888", fontSize: "1rem" }}>
          No stories found matching &quot;{query}&quot;. Try searching for something else.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {filteredPosts.map((post) => (
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
                      marginBottom: "16px",
                    }}
                  >
                    No Image
                  </div>
                )}

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <p
                    style={{
                      color: "#e67e22",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      marginBottom: "8px",
                      textTransform: "uppercase",
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
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading search results...</div>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}