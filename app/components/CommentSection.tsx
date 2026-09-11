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
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2
        className="uppercase font-bold text-lg mb-6"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#1A1A1A' }}
      >
        Discussion &amp; Reader Thoughts
      </h2>

      {/* Danh sách comment — render server-side, nằm ngay trong HTML của trang */}
      {list.length === 0 ? (
        <p className="text-sm text-gray-500 mb-8">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="flex flex-col gap-5 mb-8">
          {list.map((c) => (
            <li key={c.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm text-gray-900">{c.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{c.message}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Form gửi comment mới — client component, không cần đăng nhập */}
      <CommentForm postSlug={postSlug} />
    </section>
  );
}