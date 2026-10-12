import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import posts from '@/data/posts.json';
import PostActions from '@/app/components/PostActions';
import CommentSection from '@/app/components/CommentSection';
import AdsterraNative from '@/app/components/AdsterraNative';
import AdsterraBanner from '@/app/components/AdsterraBanner';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found | The Grind Chronicle',
    };
  }

  const SITE_URL = 'https://thegrindchronicle.vercel.app';
  const shortDesc =
    post.summary && post.summary.length > 125
      ? post.summary.slice(0, 122) + '...'
      : post.summary || 'Stories Behind Basketball Greatness';

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
      siteName: 'The Grind Chronicle',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: shortDesc,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="w-full bg-[#fcfbf9] pt-4 sm:pt-8 pb-10 text-neutral-900 font-sans">
      {/* Khung nội dung tối ưu chiều ngang mắt đọc: 720px chuẩn báo chí */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        
        {/* 1. HEADER BÀI VIẾT */}
        <header className="mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#e67e22] block mb-2 font-sans">
            {post.category || 'NBA'}
          </span>

          <h1
            className="text-2xl sm:text-3xl md:text-[2.5rem] font-black tracking-tight text-neutral-950 mb-3 sm:mb-4 leading-[1.2]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-neutral-400 font-sans mb-6">
            <span className="font-semibold text-neutral-700">{post.author || 'HoopSoul'}</span>
            <span>•</span>
            <time>{post.date}</time>
          </div>

          {/* Đoạn trích tóm tắt (Lead Quote) */}
          {post.summary && (
            <div
              className="text-sm sm:text-base text-neutral-700 italic font-serif leading-relaxed pl-4 sm:pl-5 border-l-[3px] border-[#e67e22] bg-neutral-100/40 py-3 pr-3 rounded-r-lg mb-6 sm:mb-8"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {post.summary}
            </div>
          )}

          {/* Ảnh bìa bài viết */}
          {post.coverImage && (
            <div className="w-full overflow-hidden rounded-xl mb-8 bg-neutral-100 shadow-2xs">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto max-h-[480px] object-cover block"
                loading="eager"
              />
            </div>
          )}
        </header>

        {/* 2. NỘI DUNG THÂN BÀI: TYPOGRAPHY SERIF CHẠM CẢM XÚC */}
        <section
          className="text-[17px] sm:text-[19px] leading-[1.85] tracking-[-0.005em]"
          style={{
            fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
            color: '#262626',
          }}
        >
          {post.sections?.map(
            (
              section: { type: string; content?: string; src?: string; caption?: string },
              index: number
            ) => {
              if (section.type === 'text') {
                return (
                  <p key={index} className="mb-6 sm:mb-8 leading-[1.85] whitespace-pre-line">
                    {section.content}
                  </p>
                );
              }
              if (section.type === 'image') {
                return (
                  <figure key={index} className="my-8 sm:my-10">
                    <img
                      src={section.src}
                      alt={section.caption || post.title}
                      className="w-full h-auto rounded-xl block shadow-2xs"
                    />
                    {section.caption && (
                      <figcaption className="text-center text-xs text-neutral-500 mt-2.5 italic font-sans">
                        {section.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            }
          )}
        </section>

        {/* 3. ĐIỀU HƯỚNG CUỐI BÀI & NÚT BOOKMARK / SHARE */}
        <div className="flex items-center justify-between py-6 mt-10 border-t border-b border-neutral-200/80 font-sans">
          <Link
            href="/"
            className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:border-neutral-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>←</span> Back to Stories
          </Link>

          <PostActions slug={slug} title={post.title} />
        </div>

        {/* 4. QUẢNG CÁO NATIVE RECOMMENDATIONS */}
        <div className="my-8 py-4 border-b border-neutral-200/60">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-3 text-center font-sans font-semibold">
            Sponsored Recommendations
          </span>
          <div className="flex justify-center overflow-hidden">
            <AdsterraNative />
          </div>
        </div>

        {/* 5. KHU VỰC BÌNH LUẬN */}
        <Suspense fallback={<p className="text-neutral-400 text-xs py-4">Loading comments…</p>}>
          <CommentSection postSlug={slug} />
        </Suspense>

        {/* 6. BANNER DƯỚI BÌNH LUẬN */}
        <div className="mt-6 mb-2 flex flex-col items-center justify-center">
          <AdsterraBanner />
        </div>

      </div>
    </article>
  );
}