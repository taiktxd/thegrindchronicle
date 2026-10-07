import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Khởi tạo Supabase client sử dụng service role để ghi dữ liệu an toàn
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Khởi tạo Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Lưu email vào bảng subscribers trên Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .upsert({ email: cleanEmail }, { onConflict: 'email' });

    if (dbError) {
      console.error('Supabase error:', dbError);
      return NextResponse.json({ error: 'Failed to record subscription.' }, { status: 500 });
    }

    // 2. Gửi email chào mừng từ The Grind Chronicle
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        // Khi dùng tài khoản Resend miễn phí chưa gắn domain riêng, dùng tạm: onboarding@resend.dev
        from: 'The Grind Chronicle <onboarding@resend.dev>',
        to: cleanEmail,
        subject: 'Welcome to The Grind Chronicle | Stories Behind Greatness',
        html: `
          <div style="background-color: #fcfbf9; padding: 40px 20px; font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6;">
            <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 40px 32px;">
              
              <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px;">
                <h1 style="font-size: 24px; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-weight: 900;">
                  The Grind Chronicle
                </h1>
                <p style="font-style: italic; color: #666; font-size: 13px; margin: 6px 0 0;">Stories Behind Greatness.</p>
              </div>

              <h2 style="font-size: 18px; margin-top: 0; color: #111;">Welcome to the Inner Circle.</h2>

              <p style="font-size: 15px; color: #333;">
                Cảm ơn bạn đã đồng hành cùng <strong>The Grind Chronicle</strong>. Bạn sẽ là những người đầu tiên nhận được những câu chuyện có chiều sâu về tư duy, góc khuất và hành trình vươn lên của các biểu tượng bóng rổ.
              </p>

              <div style="background-color: #faf8f5; border-left: 3px solid #e67e22; padding: 16px; margin: 24px 0; font-style: italic; font-size: 14px; color: #555;">
                "Hard work beats talent when talent fails to work hard." — Tim Notke
              </div>

              <p style="font-size: 14px; color: #444;">
                Những bài viết mới nhất sẽ được gửi thẳng vào hòm thư này mỗi khi một câu chuyện mới được xuất bản.
              </p>

              <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <a href="https://thegrindchronicle.vercel.app" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 4px; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                  Read Latest Stories →
                </a>
              </div>

              <p style="margin-top: 30px; font-size: 11px; color: #999; text-align: center;">
                © 2026 The Grind Chronicle. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscription API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}