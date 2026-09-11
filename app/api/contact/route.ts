import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // TODO: Cắm dịch vụ gửi email thật vào đây, ví dụ Resend:
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'The Grind Chronicle <no-reply@thegrindchronicle.com>',
    //   to: 'hello@thegrindchronicle.com',
    //   subject: `[Contact - ${subject}] from ${name}`,
    //   replyTo: email,
    //   text: message,
    // });
    //
    // Hoặc dùng EmailJS / Formspree nếu muốn gửi trực tiếp từ client
    // mà không cần route này.

    console.log('New contact submission:', { name, email, subject, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}