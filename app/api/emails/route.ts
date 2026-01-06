import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, to, subject, body: emailBody } = body;

    if (!lead_id || !to || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Get user from session
    // TODO: Verify lead belongs to user
    // TODO: Get user's email or configured from email

    /*
    Example implementation:

    // 1. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Your Name <noreply@yourdomain.com>", // Configure this
      to: [to],
      subject: subject,
      html: emailBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // 2. Save email record to Directus
    const email = await directus.request(
      createItem("emails", {
        lead_id,
        user_id: currentUser.id,
        subject,
        body: emailBody,
        sent_at: new Date().toISOString(),
      })
    );

    return NextResponse.json({
      success: true,
      email_id: email.id,
      resend_id: data?.id,
    });
    */

    // Placeholder response
    console.log("Sending email to:", to);
    console.log("Subject:", subject);
    console.log("Body:", emailBody);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully (placeholder)",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
