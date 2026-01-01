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

interface PromotionalEmailRequest {
  campaignId: string;
  subject: string;
  content: string;
  recipientFilter: 'all' | 'candidates' | 'employers' | 'newsletter';
  testEmail?: string; // For preview/test sends
}

const getEmailTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string) => `
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
        <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">LinkedIn</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">Instagram</a>
      </div>
      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px;">
        © ${new Date().getFullYear()} FresherPools. All rights reserved.
      </p>
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
        <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a> | 
        <a href="#" style="color: #94a3b8; text-decoration: underline;">Update Preferences</a>
      </p>
    </div>
  </div>
  <!-- Tracking Pixel -->
  <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;width:1px;height:1px;border:0;" />
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId, subject, content, recipientFilter, testEmail }: PromotionalEmailRequest = await req.json();

    console.log("Processing promotional email campaign:", { campaignId, recipientFilter, isTest: !!testEmail });

    let recipients: { email: string; name: string | null }[] = [];
    let sentCount = 0;
    let failedCount = 0;

    // If test email, only send to that address
    if (testEmail) {
      recipients = [{ email: testEmail, name: "Test User" }];
    } else {
      // Fetch recipients based on filter
      if (recipientFilter === 'newsletter') {
        const { data: subscribers, error } = await supabase
          .from('newsletter_subscriptions')
          .select('email')
          .eq('is_active', true);
        
        if (error) throw error;
        recipients = (subscribers || []).map(s => ({ email: s.email, name: null }));
      } else {
        let query = supabase.from('users').select('email, name');
        
        if (recipientFilter === 'candidates') {
          query = query.eq('user_type', 'candidate');
        } else if (recipientFilter === 'employers') {
          query = query.eq('user_type', 'employer');
        }
        
        const { data: users, error } = await query;
        if (error) throw error;
        recipients = users || [];
      }
    }

    console.log(`Found ${recipients.length} recipients for campaign`);

    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fresherpools.com';
    
    // Send emails with rate limiting (batch of 5 with longer delay to avoid rate limits)
    const batchSize = 5;
    const delayMs = 2000; // 2 seconds between batches for better deliverability

    const emailResults: { email: string; status: string; error?: string; resendId?: string }[] = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (recipient) => {
        try {
          const unsubscribeUrl = `${frontendUrl}/unsubscribe?email=${encodeURIComponent(recipient.email)}`;
          // Create tracking pixel URL with encoded email
          const encodedEmail = btoa(recipient.email);
          const trackingPixelUrl = `${supabaseUrl}/functions/v1/track-email?cid=${campaignId}&e=${encodedEmail}&t=open`;
          const htmlContent = getEmailTemplate(content, unsubscribeUrl, trackingPixelUrl);
          
          const result = await resend.emails.send({
            from: "FresherPools <noreply@fresherpools.com>",
            to: [recipient.email],
            subject: subject,
            html: htmlContent,
          });
          
          // Log full response from Resend
          console.log(`Resend response for ${recipient.email}:`, JSON.stringify(result));
          
          if (result.error) {
            failedCount++;
            emailResults.push({ 
              email: recipient.email, 
              status: 'failed', 
              error: result.error.message || 'Unknown error' 
            });
            console.error(`Resend error for ${recipient.email}:`, result.error);
          } else {
            sentCount++;
            emailResults.push({ 
              email: recipient.email, 
              status: 'sent', 
              resendId: result.data?.id 
            });
            console.log(`Email sent to: ${recipient.email}, Resend ID: ${result.data?.id}`);
          }
        } catch (error: any) {
          failedCount++;
          emailResults.push({ 
            email: recipient.email, 
            status: 'error', 
            error: error.message || 'Exception occurred' 
          });
          console.error(`Exception sending to ${recipient.email}:`, error.message, error.statusCode);
        }
      });

      await Promise.all(emailPromises);
      
      // Add delay between batches (except for last batch)
      if (i + batchSize < recipients.length) {
        console.log(`Batch ${Math.floor(i / batchSize) + 1} complete. Waiting ${delayMs}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    // Log summary of failed emails
    const failedEmails = emailResults.filter(r => r.status !== 'sent');
    if (failedEmails.length > 0) {
      console.log(`Failed emails summary:`, JSON.stringify(failedEmails));
    }

    // Update campaign stats if not a test
    if (!testEmail && campaignId) {
      const { error: updateError } = await supabase
        .from('email_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          sent_count: sentCount,
          failed_count: failedCount,
        })
        .eq('id', campaignId);

      if (updateError) {
        console.error("Error updating campaign stats:", updateError);
      }
    }

    console.log(`Campaign complete. Sent: ${sentCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sentCount, 
        failedCount,
        totalRecipients: recipients.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-promotional-email function:", error);
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
