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

type EmailTemplate = 'modern' | 'gradient' | 'minimal' | 'bold' | 'festive' | 'dark';

interface PromotionalEmailRequest {
  campaignId: string;
  subject: string;
  content: string;
  recipientFilter: 'all' | 'candidates' | 'employers' | 'newsletter';
  template?: EmailTemplate;
  testEmail?: string;
}

const getFooter = (unsubscribeUrl: string) => `
  <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
    <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">Connect with us</p>
    <div style="margin-bottom: 20px;">
      <a href="https://fresherpools.com" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none; font-weight: 500;">Website</a>
      <a href="https://linkedin.com/company/fresher-pools/" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none; font-weight: 500;">LinkedIn</a>
    </div>
    <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} FresherPools. All rights reserved.</p>
    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
      <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
    </p>
  </div>
`;

// Template 1: Modern (Default)
const getModernTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FresherPools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">FresherPools</h1>
      <p style="margin: 10px 0 0 0; color: #bfdbfe; font-size: 14px;">Your Gateway to Fresh Career Opportunities</p>
    </div>
    <div style="padding: 40px 30px;">${content}</div>
    ${getFooter(unsubscribeUrl)}
  </div>
  <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;" />
</body>
</html>
`;

// Template 2: Gradient Wave
const getGradientTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FresherPools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: rgba(255,255,255,0.95); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
      <div style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="display: inline-block; background: white; padding: 15px 30px; border-radius: 50px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">FresherPools</h1>
        </div>
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Discover Your Dream Career</p>
      </div>
      <div style="padding: 40px 30px;">${content}</div>
      <div style="padding: 30px; text-align: center; background: #f8fafc;">
        <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">Follow us for updates</p>
        <div style="margin-bottom: 20px;">
          <a href="https://fresherpools.com" style="display: inline-block; margin: 0 8px; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; font-size: 14px;">Visit Website</a>
          <a href="https://linkedin.com/company/fresher-pools/" style="display: inline-block; margin: 0 8px; padding: 10px 20px; background: #0077b5; color: white; text-decoration: none; border-radius: 25px; font-size: 14px;">LinkedIn</a>
        </div>
        <p style="margin: 0; color: #94a3b8; font-size: 12px;"><a href="${unsubscribeUrl}" style="color: #94a3b8;">Unsubscribe</a></p>
      </div>
    </div>
  </div>
  <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;" />
</body>
</html>
`;

// Template 3: Minimal Clean
const getMinimalTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FresherPools</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
  <div style="max-width: 560px; margin: 0 auto;">
    <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid #eee;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.5px; color: #111;">FRESHERPOOLS</h1>
    </div>
    <div style="padding: 40px 0; font-size: 16px; line-height: 1.7; color: #333;">${content}</div>
    <div style="padding-top: 30px; border-top: 1px solid #eee; text-align: center;">
      <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
        <a href="https://fresherpools.com" style="color: #111; text-decoration: none; margin: 0 15px;">Website</a>
        <a href="https://linkedin.com/company/fresher-pools/" style="color: #111; text-decoration: none; margin: 0 15px;">LinkedIn</a>
      </p>
      <p style="margin: 0; color: #999; font-size: 12px;"><a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe from emails</a></p>
    </div>
  </div>
  <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;" />
</body>
</html>
`;

// Template 4: Bold Impact
const getBoldTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FresherPools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: #0f172a; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">FRESHER<span style="color: #f59e0b;">POOLS</span></h1>
      <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Career Opportunities Await</p>
    </div>
    <div style="background: #ffffff; padding: 40px 30px; border-left: 4px solid #f59e0b;">${content}</div>
    <div style="background: #1e293b; padding: 30px; text-align: center;">
      <div style="margin-bottom: 20px;">
        <a href="https://fresherpools.com" style="display: inline-block; margin: 0 10px; padding: 12px 25px; background: #f59e0b; color: #0f172a; text-decoration: none; font-weight: bold; border-radius: 4px;">EXPLORE JOBS</a>
      </div>
      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
        <a href="https://linkedin.com/company/fresher-pools/" style="color: #f59e0b; text-decoration: none;">Follow us on LinkedIn →</a>
      </p>
      <p style="margin: 0; color: #475569; font-size: 12px;"><a href="${unsubscribeUrl}" style="color: #475569;">Unsubscribe</a></p>
    </div>
  </div>
  <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;" />
</body>
</html>
`;

// Template 5: Festive/Celebration
const getFestiveTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FresherPools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(245, 158, 11, 0.2);">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 15px;">🎉</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">FresherPools</h1>
        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Something Special Awaits!</p>
      </div>
      <div style="padding: 40px 30px; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"10\" cy=\"10\" r=\"2\" fill=\"%23fef3c7\"/><circle cx=\"50\" cy=\"30\" r=\"3\" fill=\"%23fde68a\"/><circle cx=\"80\" cy=\"60\" r=\"2\" fill=\"%23fef3c7\"/></svg>') repeat;">${content}</div>
      <div style="padding: 30px; text-align: center; background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);">
        <a href="https://fresherpools.com" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">Explore Now ✨</a>
        <p style="margin: 20px 0 0 0; color: #92400e; font-size: 14px;">
          <a href="https://linkedin.com/company/fresher-pools/" style="color: #92400e; text-decoration: none;">LinkedIn</a> • 
          <a href="${unsubscribeUrl}" style="color: #b45309;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>
  <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;" />
</body>
</html>
`;

// Template 6: Dark Mode
const getDarkTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FresherPools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #09090b;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #18181b 0%, #09090b 100%);">
    <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #27272a;">
      <h1 style="margin: 0; font-size: 26px; font-weight: bold;">
        <span style="color: #22d3ee;">Fresher</span><span style="color: #a855f7;">Pools</span>
      </h1>
      <p style="margin: 10px 0 0 0; color: #71717a; font-size: 13px; letter-spacing: 1px;">CAREER OPPORTUNITIES</p>
    </div>
    <div style="padding: 40px 30px; color: #e4e4e7;">
      <style>
        .dark-content h1, .dark-content h2, .dark-content h3 { color: #ffffff !important; }
        .dark-content p, .dark-content div { color: #a1a1aa !important; }
        .dark-content a { color: #22d3ee !important; }
      </style>
      <div class="dark-content">${content}</div>
    </div>
    <div style="padding: 30px; text-align: center; border-top: 1px solid #27272a;">
      <div style="margin-bottom: 20px;">
        <a href="https://fresherpools.com" style="display: inline-block; margin: 0 8px; padding: 12px 24px; background: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%); color: #09090b; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Visit Website</a>
      </div>
      <p style="margin: 0 0 10px 0; color: #52525b; font-size: 13px;">
        <a href="https://linkedin.com/company/fresher-pools/" style="color: #a855f7; text-decoration: none;">LinkedIn</a>
      </p>
      <p style="margin: 0; color: #3f3f46; font-size: 11px;"><a href="${unsubscribeUrl}" style="color: #3f3f46;">Unsubscribe</a></p>
    </div>
  </div>
  <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;" />
</body>
</html>
`;

const getEmailTemplate = (content: string, unsubscribeUrl: string, trackingPixelUrl: string, template: EmailTemplate = 'modern') => {
  switch (template) {
    case 'gradient':
      return getGradientTemplate(content, unsubscribeUrl, trackingPixelUrl);
    case 'minimal':
      return getMinimalTemplate(content, unsubscribeUrl, trackingPixelUrl);
    case 'bold':
      return getBoldTemplate(content, unsubscribeUrl, trackingPixelUrl);
    case 'festive':
      return getFestiveTemplate(content, unsubscribeUrl, trackingPixelUrl);
    case 'dark':
      return getDarkTemplate(content, unsubscribeUrl, trackingPixelUrl);
    case 'modern':
    default:
      return getModernTemplate(content, unsubscribeUrl, trackingPixelUrl);
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId, subject, content, recipientFilter, template, testEmail }: PromotionalEmailRequest = await req.json();

    console.log("Processing promotional email campaign:", { campaignId, recipientFilter, template, isTest: !!testEmail });

    let recipients: { email: string; name: string | null }[] = [];
    let sentCount = 0;
    let failedCount = 0;

    if (testEmail) {
      recipients = [{ email: testEmail, name: "Test User" }];
    } else {
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
    
    const batchSize = 5;
    const delayMs = 2000;

    const emailResults: { email: string; status: string; error?: string; resendId?: string }[] = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (recipient) => {
        try {
          const unsubscribeUrl = `${frontendUrl}/unsubscribe?email=${encodeURIComponent(recipient.email)}`;
          const encodedEmail = btoa(recipient.email);
          const trackingPixelUrl = `${supabaseUrl}/functions/v1/track-email?cid=${campaignId}&e=${encodedEmail}&t=open`;
          const htmlContent = getEmailTemplate(content, unsubscribeUrl, trackingPixelUrl, template || 'modern');
          
          const result = await resend.emails.send({
            from: "FresherPools <noreply@fresherpools.com>",
            to: [recipient.email],
            subject: subject,
            html: htmlContent,
          });
          
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
      
      if (i + batchSize < recipients.length) {
        console.log(`Batch ${Math.floor(i / batchSize) + 1} complete. Waiting ${delayMs}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    const failedEmails = emailResults.filter(r => r.status !== 'sent');
    if (failedEmails.length > 0) {
      console.log(`Failed emails summary:`, JSON.stringify(failedEmails));
    }

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