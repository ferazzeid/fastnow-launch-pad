import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  resendApiKey?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, resendApiKey }: ContactEmailRequest = await req.json();

    // Get the API key from the request or environment
    const apiKey = resendApiKey || Deno.env.get("RESEND_API_KEY");
    
    if (!apiKey) {
      console.error("No Resend API key provided");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const resend = new Resend(apiKey);

    // Send email to the configured contact email
    const contactEmail = 'fastnowapp@pm.me'; // Default contact email

    const emailResponse = await resend.emails.send({
      from: "FastNow Contact <noreply@resend.dev>", // Use a verified domain
      to: [contactEmail],
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div>
          <strong>Message:</strong>
          <p style="margin-top: 10px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #007acc;">
            ${message.replace(/\n/g, '<br>')}
          </p>
        </div>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Sent via FastNow App Contact Form
        </p>
      `,
      // Also send a plain text version
      text: `
New Contact Form Submission

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

---
Sent via FastNow App Contact Form
      `.trim(),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);