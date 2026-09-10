import { notFound } from "next/navigation";
import Link from "next/link";
import posts from "../../../data/posts.json";
import { Metadata } from 'next';
import PostActions from '../../components/PostActions';
import GiscusComments from '../../components/GiscusComments';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; 
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found - The Grind Chronicle" };
  }

  const SITE_URL = "https://thegrindchronicle.vercel.app";
  
  // Cắt ngắn description còn 120 chữ cho FB nó không cắt
  const shortDesc = post.summary?.slice(0, 125) + "...";

  return {
    title: `${post.title} | The Grind Chronicle`,
    description: shortDesc,
    openGraph: {
      title: post.title,
      description: shortDesc,
      url: `${SITE_URL}/post/${post.slug}`,
      siteName: "The Grind Chronicle",
      type: "article",
      // XÓA HẾT images ở đây - để nó tự lấy từ opengraph-image.tsx 1200x630
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: shortDesc,
      // XÓA images ở đây luôn
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

 return (
    <article style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Category */}
      <p
        style={{
          color: "#e67e22",
          fontSize: "0.9rem",
          fontWeight: "600",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}
      >
        {post.category}
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: "2.6rem",
          fontWeight: "700",
          lineHeight: "1.3",
          marginBottom: "20px",
        }}
      >
        {post.title}
      </h1>

      {/* Meta (Tác giả & Ngày đăng) */}
      <p style={{ color: "#666", marginBottom: "20px" }}>
        {post.author} • {post.date}
      </p>

      {/* Summary: Đoạn tóm tắt nằm NGAY TRÊN Ảnh bìa */}
      {post.summary && (
        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.6",
            color: "#4a5568",
            fontStyle: "italic",
            marginBottom: "32px",
            borderLeft: "3px solid #e67e22",
            paddingLeft: "16px",
          }}
        >
          {post.summary}
        </p>
      )}

      {/* Cover Image chính thức */}
      {post.coverImage && (
        <div
          style={{
            width: "100%",
            marginBottom: "50px",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <img
            src={post.coverImage}
            alt={post.title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "480px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Nội dung sections */}
      <div style={{ fontSize: "1.15rem", lineHeight: "1.85", color: "#333" }}>
        {post.sections?.map(
          (
            section: { type: string; content?: string; src?: string; caption?: string },
            index: number
          ) => {
            if (section.type === "text") {
              return (
                <p key={index} style={{ marginBottom: "28px", whiteSpace: "pre-line" }}>
                  {section.content}
                </p>
              );
            }

            if (section.type === "image") {
              return (
                <figure key={index} style={{ margin: "36px 0" }}>
                  <img
                    src={section.src}
                    alt={section.caption || post.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  />
                  {section.caption && (
                    <figcaption
                      style={{
                        textAlign: "center",
                        fontSize: "0.9rem",
                        color: "#666",
                        marginTop: "10px",
                        fontStyle: "italic",
                      }}
                    >
                      {section.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            return null;
          }
        )}
      </div>

      {/* HÀNG NÚT TƯƠNG TÁC (Back to Stories + Bookmark + Share nằm chung 1 hàng) */}
      <div
        style={{
          marginTop: "60px",
          paddingTop: "24px",
          borderTop: "1px solid #edf2f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            color: "#4a5568",
            fontWeight: "500",
            fontSize: "0.95rem",
            backgroundColor: "#f7fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          ← Back to Stories
        </Link>

        {/* Component chứa nút Save và Share */}
        <PostActions slug={slug} title={post.title} />
      </div>

      {/* KHỐI BÌNH LUẬN NẰM RIÊNG Ở DƯỚI CÙNG */}
      <div style={{ marginTop: "48px" }}>
        <GiscusComments />
      </div>
    </article>
  );
}