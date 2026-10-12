import { supabaseAnon } from '@/lib/supabase';
import CommentForm from './CommentForm';

export default async function CommentSection({ postSlug }: { postSlug: string }) {
  const { data: comments, error } = await supabaseAnon
    .from('comments')
    .select('id, name, message, created_at')
    .eq('post_slug', postSlug)
    .eq('approved', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
  }

  const list = comments ?? [];

  return (
    <section className="mt-12 pt-8 border-t border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="uppercase font-bold text-base sm:text-lg tracking-tight text-neutral-950"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Discussion & Reader Thoughts ({list.length})
        </h2>
        <span className="text-xs text-neutral-400 font-serif italic hidden sm:inline-block">
          Reader Community
        </span>
      </div>

      {/* DANH SÁCH BÌNH LUẬN */}
      {list.length === 0 ? (
        <p className="text-xs sm:text-sm text-neutral-400 mb-8 font-serif italic">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="flex flex-col gap-4 mb-8">
          {list.map((c) => {
            const isEditorial =
              c.name.trim().toLowerCase() === 'the grind chronicle' ||
              c.name.trim().toLowerCase() === 'hoopsoul';

            return (
              <li
                key={c.id}
                className={`pb-4 border-b border-neutral-100 ${
                  isEditorial
                    ? 'bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 ml-2 sm:ml-4'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`font-bold text-xs sm:text-sm ${
                      isEditorial ? 'text-[#e67e22]' : 'text-neutral-900'
                    }`}
                  >
                    {c.name}
                  </span>

                  {/* HUY HIỆU TÒA SOẠN KHI ADMIN PHẢN HỒI */}
                  {isEditorial && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e67e22] text-white">
                      EDITORIAL
                    </span>
                  )}

                  <span className="text-neutral-300">•</span>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(c.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-line leading-relaxed font-sans">
                  {c.message}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {/* FORM GỬI BÌNH LUẬN CÔNG KHAI */}
      <CommentForm postSlug={postSlug} />
    </section>
  );
}