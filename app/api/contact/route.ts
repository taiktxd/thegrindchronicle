import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: đổi thành email bạn muốn NHẬN liên hệ (Gmail hoặc email riêng của bạn)
const RECEIVE_EMAIL = 'thegrindchronicle.contact@gmail.com';

const subjectLabels: Record<string, string> = {
  tip: 'Story Tip',
  partnership: 'Hợp tác / Advertising',
  issue: 'Report an Issue',
  general: 'General',
};

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (name.length > 80 || message.length > 2000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 });
    }

    const label = subjectLabels[subject] || 'General';

    const { error } = await resend.emails.send({
      from: 'The Grind Chronicle <onboarding@resend.dev>',
      to: RECEIVE_EMAIL,
      replyTo: email,
      subject: `[Contact - ${label}] from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${label}\n\nMessage:\n${message}`,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}