import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: 'application' | 'message' | 'job_posted';
  recipientId: string;
  data: any;
}

const getEmailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FresherPools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">FresherPools</h1>
      <p style="margin: 10px 0 0 0; color: #bfdbfe; font-size: 14px;">Your Gateway to Fresh Career Opportunities</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      ${content}
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">
        Connect with us on social media
      </p>
      <div style="margin-bottom: 20px;">
        <a href="https://fresherpools.com" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">Website</a>
        <a href="https://linkedin.com/company/fresher-pools/" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">LinkedIn</a>
      </div>
      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px;">
        © ${new Date().getFullYear()} FresherPools. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipientId, data }: NotificationEmailRequest = await req.json();

    console.log("Processing notification email:", { type, recipientId });

    // Get recipient details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', recipientId)
      .single();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      throw new Error("User not found");
    }

    let subject = "";
    let bodyContent = "";
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fresherpools.com';

    switch (type) {
      case 'application':
        subject = `New Job Application - ${data.jobTitle}`;
        bodyContent = `
          <h1 style="color: #2563eb; margin: 0 0 20px 0;">New Job Application Received</h1>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0;">Application Details</h2>
            <p><strong>Position:</strong> ${data.jobTitle}</p>
            <p><strong>Candidate:</strong> ${data.candidateName}</p>
            <p><strong>Candidate Email:</strong> ${data.candidateEmail}</p>
            <p><strong>Applied On:</strong> ${new Date().toLocaleDateString()}</p>
            ${data.candidateNote ? `<p><strong>Note:</strong> ${data.candidateNote}</p>` : ''}
          </div>
          <div style="margin: 30px 0;">
            <a href="${frontendUrl}/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Application
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            You're receiving this email because you have a job posting on FresherPools.
          </p>
        `;
        break;

      case 'message':
        subject = `New Message from ${data.senderName}`;
        bodyContent = `
          <h1 style="color: #2563eb; margin: 0 0 20px 0;">New Message Received</h1>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0;">${data.subject}</h2>
            <p><strong>From:</strong> ${data.senderName} (${data.senderEmail})</p>
            <p><strong>Received:</strong> ${new Date().toLocaleDateString()}</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
              <p>${data.message}</p>
            </div>
          </div>
          <div style="margin: 30px 0;">
            <a href="${frontendUrl}/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reply to Message
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            You're receiving this email because someone sent you a message on FresherPools.
          </p>
        `;
        break;

      case 'job_posted':
        subject = `Job Posting Confirmation - ${data.jobTitle}`;
        bodyContent = `
          <h1 style="color: #10b981; margin: 0 0 20px 0;">Job Posted Successfully!</h1>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0;">${data.jobTitle}</h2>
            <p><strong>Company:</strong> ${data.company}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Job Type:</strong> ${data.jobType}</p>
            <p><strong>Posted:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>Your job posting is now live and visible to qualified candidates. You'll receive email notifications when candidates apply.</p>
          <div style="margin: 30px 0;">
            <a href="${frontendUrl}/dashboard" 
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Manage Job Posting
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Need help? Contact our support team or visit our help center.
          </p>
        `;
        break;

      default:
        throw new Error("Invalid notification type");
    }

    const htmlContent = getEmailWrapper(bodyContent);

    const emailResponse = await resend.emails.send({
      from: "FresherPools <noreply@fresherpools.com>",
      to: [user.email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
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