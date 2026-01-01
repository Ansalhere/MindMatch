import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifySubscribersRequest {
  type: 'job_posted' | 'employer_update' | 'platform_update';
  data: {
    title: string;
    description: string;
    link?: string;
    companyName?: string;
    location?: string;
    jobType?: string;
  };
}

const getEmailWrapper = (content: string, unsubscribeEmail?: string) => {
  const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fresherpools.com';
  const unsubscribeUrl = unsubscribeEmail 
    ? `${frontendUrl}/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}`
    : `${frontendUrl}/unsubscribe`;
  
  return `
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
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
        <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { type, data }: NotifySubscribersRequest = await req.json();

    console.log("Notifying subscribers about:", type, data);

    // Get all active subscribers based on their preferences
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscriptions')
      .select('email, preferences, user_type')
      .eq('is_active', true);

    if (fetchError) throw fetchError;

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscribers found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter subscribers based on their preferences
    const filteredSubscribers = subscribers.filter(sub => {
      const prefs = sub.preferences || { job_updates: true, employer_updates: true, platform_updates: true };
      
      if (type === 'job_posted' && !prefs.job_updates) return false;
      if (type === 'employer_update' && !prefs.employer_updates) return false;
      if (type === 'platform_update' && !prefs.platform_updates) return false;
      
      return true;
    });

    console.log(`Sending to ${filteredSubscribers.length} subscribers`);

    // Generate email content based on type
    let subject = '';
    let bodyContent = '';

    if (type === 'job_posted') {
      subject = `New Job Posted: ${data.title}`;
      bodyContent = `
        <h2 style="color: #2563eb; margin: 0 0 20px 0;">New Job Opportunity!</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">${data.title}</h3>
          ${data.companyName ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${data.companyName}</p>` : ''}
          ${data.location ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${data.location}</p>` : ''}
          ${data.jobType ? `<p style="margin: 5px 0;"><strong>Type:</strong> ${data.jobType}</p>` : ''}
          <p style="margin: 15px 0 0;">${data.description}</p>
        </div>
        ${data.link ? `<a href="${data.link}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">View Job Details</a>` : ''}
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          You received this email because you subscribed to job updates on FresherPools.
        </p>
      `;
    } else if (type === 'employer_update') {
      subject = `Update from ${data.companyName || 'Employer'}`;
      bodyContent = `
        <h2 style="color: #2563eb; margin: 0 0 20px 0;">${data.title}</h2>
        <p style="font-size: 16px; line-height: 1.6;">${data.description}</p>
        ${data.link ? `<a href="${data.link}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">Learn More</a>` : ''}
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          You received this email because you subscribed to employer updates on FresherPools.
        </p>
      `;
    } else {
      subject = data.title;
      bodyContent = `
        <h2 style="color: #2563eb; margin: 0 0 20px 0;">${data.title}</h2>
        <p style="font-size: 16px; line-height: 1.6;">${data.description}</p>
        ${data.link ? `<a href="${data.link}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">Learn More</a>` : ''}
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          You received this email because you subscribed to platform updates on FresherPools.
        </p>
      `;
    }

    // Send emails with rate limiting (batch of 5 with delay)
    const batchSize = 5;
    const delayMs = 2000;
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < filteredSubscribers.length; i += batchSize) {
      const batch = filteredSubscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          const htmlContent = getEmailWrapper(bodyContent, subscriber.email);
          const result = await resend.emails.send({
            from: 'FresherPools <noreply@fresherpools.com>',
            to: [subscriber.email],
            subject: subject,
            html: htmlContent,
          });
          
          if (result.error) {
            console.error(`Resend error for ${subscriber.email}:`, result.error);
            return { status: 'failed' };
          }
          console.log(`Email sent to: ${subscriber.email}`);
          return { status: 'fulfilled' };
        } catch (error: any) {
          console.error(`Exception sending to ${subscriber.email}:`, error.message);
          return { status: 'rejected' };
        }
      });

      const results = await Promise.all(emailPromises);
      successful += results.filter(r => r.status === 'fulfilled').length;
      failed += results.filter(r => r.status !== 'fulfilled').length;
      
      // Add delay between batches
      if (i + batchSize < filteredSubscribers.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    console.log(`Emails sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed: failed,
        message: `Notification sent to ${successful} subscribers`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-subscribers function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);