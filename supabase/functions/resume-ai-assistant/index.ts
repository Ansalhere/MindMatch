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
      case 'parse':
        // Parse uploaded resume using AI
        systemPrompt = `You are a resume parser. Extract information from resumes and return structured JSON data. 
Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "summary": "" },
  "experience": [{ "id": "uuid", "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "" }],
  "education": [{ "id": "uuid", "degree": "", "institution": "", "location": "", "graduationDate": "", "gpa": "" }],
  "skills": [{ "id": "uuid", "category": "Technical Skills", "items": ["skill1", "skill2"] }],
  "certifications": [{ "id": "uuid", "name": "", "issuer": "", "date": "" }],
  "projects": []
}`;
        userPrompt = `Parse this resume content and extract all information. File name: ${context.fileName}. If you cannot access the file, create a reasonable template based on common resume structures. Return only valid JSON.`;
        break;

      case 'tailor-to-job':
        // Tailor resume to job description
        systemPrompt = `You are an expert resume writer and ATS optimization specialist. Your task is to tailor a resume to match a specific job description while keeping the information authentic. 
Focus on:
1. Highlighting relevant experience and skills that match the job
2. Using keywords from the job description naturally
3. Rewriting bullet points to align with job requirements
4. Prioritizing relevant achievements
Return ONLY valid JSON in the same resume structure provided, no markdown, no explanation.`;
        userPrompt = `Tailor this resume to match the following job description. Make it ATS-friendly and highlight relevant qualifications.

JOB DESCRIPTION:
${context.jobDescription}

CURRENT RESUME:
${JSON.stringify(context.resumeData)}

Return the tailored resume as valid JSON in the same structure.`;
        break;

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

      default:
        return new Response(JSON.stringify({ error: 'Unknown type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
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

    // For parse and tailor-to-job, try to extract JSON
    if (type === 'parse' || type === 'tailor-to-job') {
      try {
        // Try to extract JSON from the response
        let jsonStr = generatedText;
        // Remove markdown code blocks if present
        if (jsonStr.includes('```json')) {
          jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonStr.includes('```')) {
          jsonStr = jsonStr.replace(/```\n?/g, '');
        }
        jsonStr = jsonStr.trim();
        
        const resumeData = JSON.parse(jsonStr);
        return new Response(JSON.stringify({ resumeData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response:', generatedText);
        // Return a default structure if parsing fails
        return new Response(JSON.stringify({ 
          resumeData: {
            personalInfo: { fullName: '', email: '', phone: '', location: '', summary: '' },
            experience: [], 
            education: [], 
            skills: [], 
            certifications: [], 
            projects: []
          },
          parseError: 'Could not parse AI response'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

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