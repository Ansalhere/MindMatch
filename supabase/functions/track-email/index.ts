import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 1x1 transparent GIF
const TRACKING_PIXEL = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
  0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21,
  0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00,
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
  0x01, 0x00, 0x3b
]);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("cid");
    const email = url.searchParams.get("e");
    const eventType = url.searchParams.get("t") || "open";

    console.log(`Tracking event: ${eventType} for campaign ${campaignId}, email: ${email}`);

    if (campaignId && email) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const userAgent = req.headers.get("user-agent") || "";
      const forwardedFor = req.headers.get("x-forwarded-for");
      const ipAddress = forwardedFor?.split(",")[0]?.trim() || "unknown";

      // Decode email
      const decodedEmail = atob(email);

      // Insert tracking event
      const { error: eventError } = await supabase
        .from("email_events")
        .insert({
          campaign_id: campaignId,
          recipient_email: decodedEmail,
          event_type: eventType,
          user_agent: userAgent.substring(0, 500),
          ip_address: ipAddress,
        });

      if (eventError) {
        console.error("Error inserting event:", eventError);
      } else {
        console.log("Event tracked successfully");

        // Update campaign open count
        if (eventType === "open") {
          // Check if this is a unique open
          const { data: existingOpens } = await supabase
            .from("email_events")
            .select("id")
            .eq("campaign_id", campaignId)
            .eq("recipient_email", decodedEmail)
            .eq("event_type", "open")
            .limit(2);

          const isFirstOpen = existingOpens && existingOpens.length === 1;

          // Increment open_count
          await supabase.rpc("increment_campaign_opens", {
            p_campaign_id: campaignId,
            p_is_unique: isFirstOpen,
          }).catch(() => {
            // Fallback if RPC doesn't exist - use direct update
            supabase
              .from("email_campaigns")
              .update({ 
                open_count: supabase.rpc ? undefined : 1 
              })
              .eq("id", campaignId);
          });
        }
      }
    }

    // Return tracking pixel
    return new Response(TRACKING_PIXEL, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Tracking error:", error);
    // Still return pixel even on error
    return new Response(TRACKING_PIXEL, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/gif",
        "Cache-Control": "no-store",
      },
    });
  }
};

serve(handler);
