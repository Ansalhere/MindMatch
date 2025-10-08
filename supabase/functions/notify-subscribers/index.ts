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
    let htmlContent = '';

    if (type === 'job_posted') {
      subject = `New Job Posted: ${data.title}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Job Opportunity!</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">${data.title}</h3>
            ${data.companyName ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${data.companyName}</p>` : ''}
            ${data.location ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${data.location}</p>` : ''}
            ${data.jobType ? `<p style="margin: 5px 0;"><strong>Type:</strong> ${data.jobType}</p>` : ''}
            <p style="margin: 15px 0 0;">${data.description}</p>
          </div>
          ${data.link ? `<a href="${data.link}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">View Job Details</a>` : ''}
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            You received this email because you subscribed to job updates. 
            <a href="#" style="color: #2563eb;">Manage preferences</a>
          </p>
        </div>
      `;
    } else if (type === 'employer_update') {
      subject = `Update from ${data.companyName || 'Employer'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">${data.title}</h2>
          <p style="font-size: 16px; line-height: 1.6;">${data.description}</p>
          ${data.link ? `<a href="${data.link}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">Learn More</a>` : ''}
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            You received this email because you subscribed to employer updates.
            <a href="#" style="color: #2563eb;">Manage preferences</a>
          </p>
        </div>
      `;
    } else {
      subject = data.title;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">${data.title}</h2>
          <p style="font-size: 16px; line-height: 1.6;">${data.description}</p>
          ${data.link ? `<a href="${data.link}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">Learn More</a>` : ''}
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            You received this email because you subscribed to platform updates.
            <a href="#" style="color: #2563eb;">Manage preferences</a>
          </p>
        </div>
      `;
    }

    // Send emails (batch sending for efficiency)
    const emailPromises = filteredSubscribers.map(subscriber =>
      resend.emails.send({
        from: 'RankMe <onboarding@resend.dev>',
        to: [subscriber.email],
        subject: subject,
        html: htmlContent,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

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
