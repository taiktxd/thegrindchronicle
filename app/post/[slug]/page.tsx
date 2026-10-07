import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from 'next';
import { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { getPostBySlug, getAllPosts } from '@/lib/posts';
import PostActions from '../../components/PostActions';
import CommentSection from '../../components/CommentSection';
import NativeAdBanner from '../../components/NativeAdBanner';
import Banner300x250 from '../../components/Banner300x250';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

// Tự động sinh danh sách slug cho các bài viết để tối ưu tốc độ và SEO
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Cấu hình SEO động đọc từ frontmatter của file .mdx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; 
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found - The Grind Chronicle" };
  }

  const SITE_URL = "https://thegrindchronicle.vercel.app";
  const title = (post.title as string) || "The Grind Chronicle";
  const rawSummary = (post.summary || post.excerpt || "") as string;
  
  const shortDesc = rawSummary.length > 125
    ? rawSummary.slice(0, 122) + "..."
    : rawSummary || "Stories Behind Greatness from The Grind Chronicle";

  // Lấy ảnh bìa của bài viết (nếu bài nào không có ảnh thì lấy fallback)
  const coverImage = (post.coverImage || post.image || "") as string;
  const postImageUrl = coverImage.startsWith('http')
    ? coverImage
    : `${SITE_URL}${coverImage}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${title} | The Grind Chronicle`,
    description: shortDesc,
    alternates: {
      canonical: `/post/${slug}`,
    },
    openGraph: {
      title: title,
      description: shortDesc,
      url: `${SITE_URL}/post/${slug}`,
      siteName: "The Grind Chronicle",
      type: "article",
      images: coverImage
        ? [
            {
              url: postImageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: shortDesc,
      images: coverImage ? [postImageUrl] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Bóc tách dữ liệu linh hoạt (tương thích cả summary/excerpt và coverImage/image)
  const title = (post.title as string) || "";
  const category = (post.category as string) || "General";
  const author = (post.author as string) || "The Grind Chronicle";
  const date = (post.date as string) || "";
  const summary = (post.summary || post.excerpt || "") as string;
  const coverImage = (post.coverImage || post.image || "") as string;
  const content = post.content || "";

  return (
    <article style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Category */}
      <p style={{ color: "#e67e22", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", marginBottom: "16px" }}>
        {category}
      </p>

      {/* Title */}
      <h1 style={{ fontSize: "2.6rem", fontWeight: "700", lineHeight: "1.3", marginBottom: "20px" }}>
        {title}
      </h1>

      {/* Author & Date */}
      <p style={{ color: "#666", marginBottom: "20px" }}>
        {author} • {date}
      </p>

      {/* Excerpt / Summary */}
      {summary && (
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "#4a5568", fontStyle: "italic", marginBottom: "32px", borderLeft: "3px solid #e67e22", paddingLeft: "16px" }}>
          {summary}
        </p>
      )}

      {/* Cover Image */}
      {coverImage && (
        <div style={{ width: "100%", marginBottom: "50px", overflow: "hidden", borderRadius: "8px" }}>
          <img 
            src={coverImage} 
            alt={title} 
            style={{ width: "100%", height: "auto", maxHeight: "480px", objectFit: "cover", display: "block" }} 
          />
        </div>
      )}

      {/* Render Markdown Content trực tiếp từ file .mdx */}
      <div style={{ fontSize: "1.15rem", lineHeight: "1.85", color: "#333" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Kiểm tra: nếu đoạn văn chứa ảnh, không bọc thẻ <p> để tránh lỗi Hydration lồng <figure> trong <p>
            p: ({ node, children }) => {
              const hasImage = node?.children?.some(
                (child) => child.type === 'element' && child.tagName === 'img'
              );
              if (hasImage) {
                return <>{children}</>;
              }
              return (
                <p style={{ marginBottom: "28px", lineHeight: "1.85" }}>{children}</p>
              );
            },
            h2: ({ children }) => (
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginTop: "44px", marginBottom: "20px", color: "#111" }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: "1.45rem", fontWeight: "700", marginTop: "36px", marginBottom: "16px", color: "#111" }}>
                {children}
              </h3>
            ),
            hr: () => (
              <hr style={{ margin: "40px 0", border: 0, borderTop: "1px solid #e5e5e5" }} />
            ),
            img: ({ src, alt }) => (
              <figure style={{ margin: "36px 0" }}>
                <img
                  src={src}
                  alt={alt || title}
                  style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
                />
                {alt && (
                  <figcaption style={{ textAlign: "center", fontSize: "0.9rem", color: "#666", marginTop: "10px", fontStyle: "italic" }}>
                    {alt}
                  </figcaption>
                )}
              </figure>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{ borderLeft: "3px solid #e67e22", paddingLeft: "16px", margin: "28px 0", fontStyle: "italic", color: "#4a5568" }}>
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Native Ad Banner */}
      <NativeAdBanner />

      {/* Banner cố định 300x250 */}
      <Banner300x250 />

      {/* Navigation & Action buttons */}
      <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid #edf2f7", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <Link href="/" style={{ display: "inline-block", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", color: "#4a5568", fontWeight: "500", fontSize: "0.95rem", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0" }}>
          ← Back to Stories
        </Link>
        <PostActions slug={slug} title={title} />
      </div>

      {/* Comments */}
      <div style={{ marginTop: "48px" }}>
        <Suspense fallback={<p style={{ color: '#999', fontSize: '0.9rem' }}>Loading comments…</p>}>
          <CommentSection postSlug={slug} />
        </Suspense>
      </div>
    </article>
  );
}