import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'job-description':
        systemPrompt = 'You are a professional resume writer. Create compelling, achievement-focused job descriptions that highlight impact and results. Use action verbs and quantify achievements when possible.';
        userPrompt = `Create a professional job description for this role: ${context.title} at ${context.company}. Include 3-4 bullet points focusing on achievements and responsibilities.`;
        break;
      
      case 'professional-summary':
        systemPrompt = 'You are a career coach specializing in resume writing. Create compelling professional summaries that highlight key strengths and career objectives.';
        userPrompt = `Create a professional summary for someone with this background: ${context.experience} years of experience in ${context.field}. Skills: ${context.skills}. Keep it concise (2-3 sentences).`;
        break;
      
      case 'improve-bullet':
        systemPrompt = 'You are a resume optimization expert. Improve resume bullet points to be more impactful, using action verbs and quantifying results.';
        userPrompt = `Improve this resume bullet point: "${context.text}". Make it more achievement-focused and impactful.`;
        break;

      case 'skills-suggestion':
        systemPrompt = 'You are a career advisor. Suggest relevant skills based on job experience and career goals.';
        userPrompt = `Based on this experience: ${context.experience}, suggest 5-7 relevant technical and soft skills for a resume.`;
        break;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ text: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in resume-ai-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
