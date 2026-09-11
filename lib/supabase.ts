import { createClient } from '@supabase/supabase-js';

// Dùng ở Server Component để ĐỌC comment đã duyệt (an toàn, chỉ có quyền
// đọc theo RLS policy "approved = true").
export const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// CHỈ dùng trong API route (server-side), KHÔNG import file này vào
// client component. Service role key bypass RLS, dùng để insert comment
// mới (approved mặc định = false, chờ bạn duyệt).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);