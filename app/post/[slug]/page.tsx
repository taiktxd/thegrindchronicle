import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import posts from "../../../data/posts.json";
import { Metadata } from 'next';
import PostActions from '../../components/PostActions';
import CommentSection from '../../components/CommentSection';
import { Suspense } from 'react';

export const revalidate = 60;

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
  
  const shortDesc = post.summary && post.summary.length > 125
    ? post.summary.slice(0, 122) + "..."
    : post.summary || "Stories Behind Greatness from The Grind Chronicle";

  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | The Grind Chronicle`,
    description: shortDesc,
    alternates: {
      canonical: `/post/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: shortDesc,
      url: `${SITE_URL}/post/${post.slug}`,
      siteName: "The Grind Chronicle",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: shortDesc,
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
    <article style={{ maxWidth: "800px", margin: "0 auto", padding: "36px 20px 80px" }}>
      {/* Category metadata tag */}
      <p style={{ color: "#e67e22", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
        {post.category}
      </p>

      {/* DUY NHẤT 1 thẻ H1 trên trang chi tiết: Tiêu đề bài viết */}
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: "800", lineHeight: "1.25", color: "#1A1A1A", marginBottom: "16px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {post.title}
      </h1>

      {/* Author & Publish Date */}
      <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "24px" }}>
        By <span style={{ fontWeight: "600", color: "#333" }}>{post.author}</span> • {post.date}
      </p>

      {/* Lead Summary */}
      {post.summary && (
        <blockquote style={{ fontSize: "1.15rem", lineHeight: "1.65", color: "#4a5568", fontStyle: "italic", marginBottom: "36px", borderLeft: "3px solid #e67e22", paddingLeft: "18px", margin: "0 0 36px" }}>
          {post.summary}
        </blockquote>
      )}

      {/* Hero Cover Image (LCP Optimization): Fixed aspect ratio, priority load, Next.js Image optimization */}
      {post.coverImage && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", maxHeight: "480px", marginBottom: "44px", overflow: "hidden", borderRadius: "8px", backgroundColor: "#f3f4f6" }}>
          <Image
            src={post.coverImage}
            alt={`${post.title} - ${post.category || "Basketball"} feature story cover`}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 800px) 100vw, 800px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Main Story Content */}
      <div style={{ fontSize: "1.15rem", lineHeight: "1.85", color: "#2d3748", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {post.sections?.map((section: { type: string; content?: string; src?: string; caption?: string }, index: number) => {
          if (section.type === "text") {
            return (
              <p key={index} style={{ marginBottom: "26px", whiteSpace: "pre-line" }}>
                {section.content}
              </p>
            );
          }
          if (section.type === "image") {
            return (
              <figure key={index} style={{ margin: "40px 0" }}>
                <div style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: "8px", backgroundColor: "#f3f4f6" }}>
                  <img
                    src={section.src}
                    alt={section.caption ? `${post.title} - ${section.caption}` : `${post.title} archival photograph`}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
                  />
                </div>
                {section.caption && (
                  <figcaption style={{ textAlign: "center", fontSize: "0.88rem", color: "#718096", marginTop: "10px", fontStyle: "italic" }}>
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}
      </div>

      {/* Post Actions & Back link */}
      <div style={{ marginTop: "50px", paddingTop: "24px", borderTop: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <Link
          href="/"
          style={{ display: "inline-block", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", color: "#4a5568", fontWeight: "600", fontSize: "0.9rem", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0" }}
        >
          ← Back to Stories
        </Link>
        <PostActions slug={slug} title={post.title} />
      </div>

      {/* Discussion & Reader Thoughts (Heading H2 chuẩn SEO) */}
      <div style={{ marginTop: "44px" }}>
        <Suspense fallback={<p style={{ color: '#999', fontSize: '0.9rem' }}>Loading comments…</p>}>
          <CommentSection postSlug={slug} />
        </Suspense>
      </div>
    </article>
  );
}