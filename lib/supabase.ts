import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 1. Dùng cho Client (đọc comment, gửi comment)
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// 2. Dùng cho Server/Admin (chỉ khởi tạo khi có SERVICE_ROLE_KEY ở phía Server)
export const supabaseAdmin =
  typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : supabaseAnon;