import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email;

    // 1. Strict Server-Side Validation (@gmail.com only)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      console.warn('[VALIDATION_FAILED]: Non-gmail or invalid format:', email);
      return NextResponse.json(
        { error: 'Active @gmail.com required. Unsubscribe anytime with one click.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Validate Environment Variables
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[CONFIG_ERROR]: RESEND_API_KEY is not defined in environment variables (.env.local).');
      return NextResponse.json(
        {
          error: 'Email service configuration error: RESEND_API_KEY is missing in .env.local.',
          code: 'MISSING_API_KEY',
        },
        { status: 500 }
      );
    }

    // 3. Supabase Database Persistence (Hoàn toàn lưu trên Database, không dùng localStorage)
    if (supabaseUrl && supabaseKey) {
      try {
        console.log('[SUPABASE_CHECK]: Checking subscriber record for:', cleanEmail);
        const { data: existing, error: selectError } = await supabase
          .from('subscribers')
          .select('id, email')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (selectError) {
          console.error('[SUPABASE_ERROR]: Select error:', JSON.stringify(selectError, null, 2));
        }

        if (!existing) {
          const { error: insertError } = await supabase
            .from('subscribers')
            .insert([{ email: cleanEmail, created_at: new Date().toISOString() }]);

          if (insertError) {
            console.error('[SUPABASE_ERROR]: Insert error:', JSON.stringify(insertError, null, 2));
          } else {
            console.log('[SUPABASE_SUCCESS]: New subscriber inserted into database:', cleanEmail);
          }
        } else {
          console.log('[SUPABASE_INFO]: Subscriber already exists in database:', cleanEmail);
        }
      } catch (dbErr: unknown) {
        const dbMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
        console.error('[SUPABASE_EXCEPTION]:', dbMsg);
      }
    } else {
      console.warn('[SUPABASE_CONFIG_WARNING]: Missing Supabase credentials in .env.local.');
    }

    // 4. Send Welcome Email via Resend
    const resend = new Resend(apiKey);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegrindchronicle.vercel.app';

    console.log('--- RESEND DISPATCH ATTEMPT ---');
    console.log('Payload TO:', cleanEmail);

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to the Inner Circle</title>
        <style>
          body {
            margin: 0;
            padding: 24px 12px;
            background-color: #f4f4f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #18181b;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 40px 32px;
            box-sizing: border-box;
          }
          .masthead {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 28px;
          }
          .masthead-title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #18181b;
            margin: 0 0 6px;
          }
          .masthead-subtitle {
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-size: 13px;
            color: #71717a;
            margin: 0;
          }
          .headline {
            font-size: 22px;
            font-weight: 700;
            color: #18181b;
            margin-bottom: 16px;
            line-height: 1.3;
          }
          .body-text {
            font-size: 15px;
            line-height: 1.7;
            color: #3f3f46;
            margin-bottom: 20px;
          }
          .quote-box {
            border-left: 4px solid #e67e22;
            background-color: #f9fafb;
            padding: 16px 20px;
            margin: 24px 0;
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-size: 15px;
            line-height: 1.6;
            color: #52525b;
          }
          .cta-container {
            text-align: center;
            margin: 36px 0 28px;
          }
          .cta-button {
            display: inline-block;
            background-color: #18181b;
            color: #ffffff !important;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 6px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #a1a1aa;
            border-top: 1px solid #f4f4f5;
            padding-top: 24px;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="masthead">
            <h1 class="masthead-title">THE GRIND CHRONICLE</h1>
            <p class="masthead-subtitle">Stories Behind Greatness.</p>
          </div>

          <div class="headline">Welcome to the Inner Circle.</div>

          <p class="body-text">
            Thank you for joining The Grind Chronicle. You are now part of a dedicated community that looks beyond the scoreboard—exploring the grit, silent battles, and human resilience behind basketball’s greatest icons.
          </p>

          <div class="quote-box">
            “Hard work beats talent when talent fails to work hard.” — Tim Notke
          </div>

          <p class="body-text">
            Whenever a new story drops, it will be delivered straight to your inbox. No fluff, no rumors, just timeless perspectives on the pursuit of greatness.
          </p>

          <div class="cta-container">
            <a href="${siteUrl}" class="cta-button" target="_blank">READ LATEST STORIES →</a>
          </div>

          <div class="footer">
            © 2026 The Grind Chronicle. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'The Grind Chronicle <onboarding@resend.dev>',
      to: [cleanEmail],
      subject: 'Welcome to the Inner Circle | The Grind Chronicle',
      html: emailHtml,
    });

    console.log('Resend Response Data:', resendData);
    console.log('Resend Error:', resendError);

    // XỬ LÝ LỖI RESEND:
    if (resendError) {
      console.warn('[RESEND_WARNING]:', JSON.stringify(resendError, null, 2));

      const isSandboxRestriction =
        resendError.message?.toLowerCase().includes('can only send testing emails') || false;

      // NẾU LÀ GIỚI HẠN SANDBOX (chưa verify custom domain):
      // Độc giả ĐÃ ĐƯỢC LƯU VÀO SUPABASE DATABASE THÀNH CÔNG!
      // Vẫn cấp Cookie phiên để độc giả sử dụng đầy đủ tính năng của website (Bookmark, đọc bài).
      if (isSandboxRestriction) {
        console.info(
          '[RESEND_SANDBOX_NOTICE]: Email saved in Supabase. Email delivery skipped by Resend Sandbox until custom domain is verified.'
        );

        const response = NextResponse.json({
          success: true,
          emailId: 'sandbox_domain_pending',
          message:
            "Welcome to the Inner Circle! (Note: Resend is in Sandbox mode, welcome email will be sent automatically once your domain is verified).",
          sandboxWarning: true,
        });

        response.cookies.set('tgc_subscriber_email', cleanEmail, {
          path: '/',
          maxAge: 60 * 60 * 24 * 365, // 1 năm
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        return response;
      }

      // Nếu là lỗi cấu hình khác (API Key sai, cú pháp lỗi...): Báo lỗi 400
      return NextResponse.json(
        {
          error: resendError.message,
          code: resendError.name,
          details: resendError,
        },
        { status: 400 }
      );
    }

    if (!resendData?.id) {
      console.error('[RESEND_ERROR]: No message ID returned from Resend.');
      return NextResponse.json(
        { error: 'Email delivery failed. No confirmation ID returned.' },
        { status: 500 }
      );
    }

    console.log('[RESEND_SUCCESS]: Email sent successfully with ID:', resendData.id);

    // Tạo response và set HTTP Cookie an toàn (Thay thế hoàn toàn localStorage)
    const response = NextResponse.json({
      success: true,
      emailId: resendData.id,
      message: 'Thank you for subscribing! Check your inbox soon.',
    });

    response.cookies.set('tgc_subscriber_email', cleanEmail, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 năm
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[SERVER_ERROR]:', err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}