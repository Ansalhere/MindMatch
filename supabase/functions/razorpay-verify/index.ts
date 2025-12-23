import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id, package_type } = await req.json();
    
    console.log('Verifying Razorpay payment:', { razorpay_order_id, razorpay_payment_id, user_id, package_type });

    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!RAZORPAY_KEY_SECRET) {
      console.error('Razorpay secret not configured');
      throw new Error('Razorpay secret not configured');
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Invalid payment signature');
      throw new Error('Invalid payment signature');
    }

    console.log('Payment signature verified successfully');

    // Update user premium status in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate expiry and remaining downloads based on package type
    const expiryDate = new Date();
    let remainingDownloads = 0;
    
    if (package_type === 'unlimited') {
      // Unlimited plan: 1 year validity, unlimited downloads (use -1 to indicate unlimited)
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      remainingDownloads = -1; // -1 means unlimited
    } else {
      // Single plan: 30 days validity, 1 additional download
      expiryDate.setDate(expiryDate.getDate() + 30);
      remainingDownloads = 1;
    }

    console.log('Package type:', package_type, 'Remaining downloads:', remainingDownloads, 'Expiry:', expiryDate.toISOString());

    // Update user with premium details
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        is_premium: true,
        resume_premium_type: package_type,
        resume_premium_downloads_remaining: remainingDownloads,
        resume_premium_expires_at: expiryDate.toISOString()
      })
      .eq('id', user_id);

    if (updateError) {
      console.error('Error updating user premium status:', updateError);
      throw new Error('Failed to update premium status');
    }

    console.log('User premium status updated successfully for:', user_id, 'Package:', package_type);

    // Create a subscription record if packages table exists
    try {
      // First get a package to reference
      const { data: packages } = await supabase
        .from('packages')
        .select('id')
        .eq('user_type', 'candidate')
        .limit(1);

      if (packages && packages.length > 0) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

        await supabase
          .from('subscriptions')
          .insert({
            user_id,
            package_id: packages[0].id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            payment_status: 'completed',
            payment_reference: razorpay_payment_id,
            is_active: true,
          });
        
        console.log('Subscription record created');
      }
    } catch (subError) {
      console.log('Could not create subscription record:', subError);
      // Continue even if subscription record fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified and premium activated',
        payment_id: razorpay_payment_id,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
