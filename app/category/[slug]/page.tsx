import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = (resolvedParams?.slug || '').toLowerCase();

  const categoryMeta: Record<string, { title: string; description: string }> = {
    nba: {
      title: 'NBA',
      description: 'Stories, raw journeys, and deep perspectives filed under NBA.',
    },
    legends: {
      title: 'Legends',
      description: 'Timeless legacies, historic battles, and the icons who shaped basketball history forever.',
    },
    mindset: {
      title: 'Mindset',
      description: 'The psychology of obsession, silent grit, and the unseen work behind greatness.',
    },
  };

  if (!categoryMeta[categorySlug]) {
    notFound();
  }

  const currentMeta = categoryMeta[categorySlug];
  const allPosts = getAllPosts();

  const posts = allPosts.filter((post) => {
    const postCategory = post.category?.toLowerCase() || '';
    const postTags = Array.isArray(post.tags)
      ? post.tags.map((t: string) => t.toLowerCase())
      : [];

    if (categorySlug === 'mindset') {
      return (
        postCategory === 'mindset' ||
        postCategory === 'perseverance' ||
        postTags.includes('mindset') ||
        postTags.includes('perseverance')
      );
    }

    if (categorySlug === 'legends') {
      return postCategory === 'legends' || postTags.includes('legends');
    }

    if (categorySlug === 'nba') {
      return postCategory === 'nba' || postTags.includes('nba');
    }

    return postCategory === categorySlug || postTags.includes(categorySlug);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* ===== Tiêu đề mục Category: Cùng style chuẩn với Latest Stories ở Home ===== */}
      <section className="mb-6 sm:mb-8 pb-3 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
              CATEGORY
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600">
              ARCHIVE
            </span>
          </div>

          <h1
            className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-gray-900"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {currentMeta.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 italic">
            {currentMeta.description}
          </p>
        </div>

        <span className="text-[11px] uppercase tracking-widest text-amber-600 font-semibold hidden sm:inline-block">
          Curated Editorial
        </span>
      </section>

      {/* ===== Grid danh sách bài viết — Sao chép y hệt 100% cấu trúc của Home ===== */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              className="no-underline text-inherit group"
            >
              <article className="h-full flex flex-col bg-white border border-transparent hover:border-gray-100 rounded-sm transition-all duration-200">
                {/* Ảnh bìa bài viết chuẩn tỷ lệ 16:9 */}
                {post.coverImage ? (
                  <div className="relative w-full aspect-[16/9] overflow-hidden mb-3.5 rounded-sm bg-neutral-100">
                    <img
                      src={post.coverImage}
                      alt={`${post.title} ${post.category || 'Basketball'} story cover`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-xs mb-3.5 rounded-sm">
                    The Grind Chronicle
                  </div>
                )}

                {/* Thông tin bài viết */}
                <div className="flex-1 flex flex-col">
                  <p className="text-amber-600 text-xs font-bold mb-1.5 uppercase tracking-wider">
                    {post.category || currentMeta.title}
                  </p>

                  <h2 className="text-base sm:text-lg font-bold mb-2 leading-snug text-gray-900 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h2>

                  <p
                    className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.summary}
                  </p>

                  <p className="text-xs text-gray-400 mb-3">
                    {post.author ? `${post.author} • ` : 'The Grind Chronicle • '}
                    {post.date}
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-amber-600 mt-auto flex items-center gap-1 transition-colors">
                    Read Story <span aria-hidden="true">→</span>
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-gray-200 rounded-sm my-6 bg-gray-50/50">
          <p className="font-serif italic text-gray-500 text-base mb-2">
            No stories published under {currentMeta.title} yet.
          </p>
          <p className="text-xs text-gray-400 font-sans">
            Our editorial team is currently drafting new deep essays for this archive.
          </p>
          <Link
            href="/"
            className="inline-block mt-5 text-xs font-semibold uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5 hover:text-amber-600 hover:border-amber-600 transition-colors"
          >
            ← Return to Home
          </Link>
        </div>
      )}
    </div>
  );
}