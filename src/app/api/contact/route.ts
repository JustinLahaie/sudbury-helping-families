import * as postmark from 'postmark';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Check for API key at runtime
    if (!process.env.POSTMARK_API_TOKEN) {
      console.error('POSTMARK_API_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly.' },
        { status: 503 }
      );
    }

    const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Send email
    const response = await client.sendEmail({
      From: 'Sudbury Helping Families <notifications@sudburyhelpingfamilies.com>',
      To: 'sudburyhelpingfamilies@hotmail.com',
      Subject: `New Contact Form Submission from ${name}`,
      HtmlBody: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">
          This message was sent from the Sudbury Helping Families website contact form.
        </p>
      `,
      ReplyTo: email,
      MessageStream: 'outbound',
    });

    return NextResponse.json({ success: true, id: response.MessageID });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
