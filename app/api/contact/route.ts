import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    first_name = '', last_name = '', email = '', phone = '',
    company = '', product = '', message = '', lang = 'en',
  } = body;

  if (!first_name || !email || !message) {
    return NextResponse.json(
      { success: false, message: lang === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill required fields.' },
      { status: 400 }
    );
  }

  // Save to DB
  const { rows } = await sql`
    INSERT INTO inquiries (first_name, last_name, email, phone, company, product, message, lang)
    VALUES (${first_name}, ${last_name}, ${email}, ${phone}, ${company}, ${product}, ${message}, ${lang})
    RETURNING id
  `;
  const inquiryId = rows[0]?.id;

  // Send email via Resend (if configured)
  let emailSent = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.MAIL_FROM || 'Al-Harrasi Ropes <onboarding@resend.dev>',
        to: process.env.MAIL_TO || 'Alharrasi.ropf@hotmail.com',
        replyTo: email,
        subject: `New Inquiry #${inquiryId} — ${product || 'General'} | Al-Harrasi Ropes`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E8D5B0;">
            <div style="background:#1A1208;padding:24px 32px;">
              <h2 style="color:#C8973A;margin:0;">Al-Harrasi Ropes — New Inquiry</h2>
            </div>
            <div style="padding:28px 32px;background:#FBF6EC;">
              <p><strong>Name:</strong> ${first_name} ${last_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Company:</strong> ${company}</p>
              <p><strong>Product:</strong> ${product}</p>
              <div style="margin-top:16px;background:#fff;border:1px solid #E8D5B0;padding:16px;">
                <p style="margin:0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
          </div>`,
      });
      emailSent = true;
    } catch (e) {
      console.error('Resend email error:', e);
    }
  }

  // Build WhatsApp deep link (client opens this if desired)
  const waPhone = process.env.WA_PHONE || '96890103771';
  const waText = encodeURIComponent(
    `New inquiry from ${first_name} ${last_name}\nProduct: ${product}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  return NextResponse.json({
    success: true,
    message: lang === 'ar' ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.' : "Your inquiry has been sent! We'll be in touch soon.",
    inquiry_id: inquiryId,
    email_sent: emailSent,
    wa_url: waUrl,
  });
}
