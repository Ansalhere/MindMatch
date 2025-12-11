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

    console.log('Processing request type:', type);

    let systemPrompt = '';
    let userPrompt = '';
    let messages: any[] = [];

    const jsonSchema = `{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "", "summary": "" },
  "experience": [{ "id": "unique-id", "title": "", "company": "", "location": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "description": "bullet points" }],
  "education": [{ "id": "unique-id", "degree": "", "institution": "", "location": "", "graduationDate": "YYYY", "gpa": "" }],
  "skills": [{ "id": "unique-id", "category": "Category Name", "items": ["skill1", "skill2"] }],
  "certifications": [{ "id": "unique-id", "name": "", "issuer": "", "date": "YYYY-MM" }],
  "projects": [{ "id": "unique-id", "name": "", "description": "", "technologies": ["tech1"], "link": "" }]
}`;

    switch (type) {
      case 'parse':
        systemPrompt = `You are a resume parser expert. Extract information from the provided resume and return ONLY valid JSON.
Do NOT include any markdown code blocks, explanations, or text outside the JSON.
Return data in this exact structure:
${jsonSchema}
Generate unique IDs for each array item. Extract as much information as possible.`;

        // Check if we have base64 file content (PDF/DOC)
        if (context.fileBase64 && context.mimeType) {
          console.log('Processing file with base64, mime:', context.mimeType);
          // Use multimodal with file
          messages = [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: [
                {
                  type: 'file',
                  file: {
                    filename: context.fileName || 'resume.pdf',
                    file_data: `data:${context.mimeType};base64,${context.fileBase64}`
                  }
                },
                {
                  type: 'text',
                  text: 'Parse this resume document and extract all information. Return ONLY valid JSON in the specified format.'
                }
              ]
            }
          ];
        } else if (context.fileContent) {
          // Plain text content
          console.log('Processing plain text content');
          userPrompt = `Parse this resume text and extract all information. Return ONLY valid JSON.\n\nResume Content:\n${context.fileContent}`;
          messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ];
        } else {
          throw new Error('No resume content provided');
        }
        break;

      case 'tailor-to-job':
        systemPrompt = `You are an expert resume writer and ATS optimization specialist. Tailor the resume to match the job description while keeping information authentic.
Focus on:
1. Highlighting relevant experience and skills
2. Using keywords from the job description naturally
3. Rewriting bullet points to align with job requirements
4. Prioritizing relevant achievements
Return ONLY valid JSON in the same structure, no markdown, no explanation.`;
        userPrompt = `Tailor this resume to match the job description. Make it ATS-friendly.

JOB DESCRIPTION:
${context.jobDescription}

CURRENT RESUME:
${JSON.stringify(context.resumeData)}

Return the tailored resume as valid JSON.`;
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];
        break;

      case 'job-description':
        systemPrompt = 'You are a professional resume writer. Create compelling, achievement-focused job descriptions.';
        userPrompt = `Create a professional job description for: ${context.title} at ${context.company}. Include 3-4 bullet points focusing on achievements.`;
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];
        break;
      
      case 'professional-summary':
        systemPrompt = 'You are a career coach specializing in resume writing. Create compelling professional summaries.';
        userPrompt = `Create a professional summary for: ${context.experience} years in ${context.field}. Skills: ${context.skills}. Keep it 2-3 sentences.`;
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];
        break;
      
      case 'improve-bullet':
        systemPrompt = 'You are a resume optimization expert. Improve bullet points with action verbs and quantified results.';
        userPrompt = `Improve this bullet point: "${context.text}". Make it more impactful.`;
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];
        break;

      case 'skills-suggestion':
        systemPrompt = 'You are a career advisor. Suggest relevant skills based on experience.';
        userPrompt = `Based on: ${context.experience}, suggest 5-7 relevant technical and soft skills.`;
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];
        break;

      default:
        return new Response(JSON.stringify({ error: 'Unknown type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    console.log('Sending request to AI gateway');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'AI gateway error: ' + errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || '';
    
    console.log('AI response received, length:', generatedText.length);

    // For parse and tailor-to-job, extract JSON
    if (type === 'parse' || type === 'tailor-to-job') {
      try {
        let jsonStr = generatedText;
        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        
        // Try to find JSON object in response
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
        
        const resumeData = JSON.parse(jsonStr);
        console.log('Successfully parsed resume data');
        
        return new Response(JSON.stringify({ resumeData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response preview:', generatedText.substring(0, 500));
        // Return default structure with error
        return new Response(JSON.stringify({ 
          resumeData: {
            personalInfo: { fullName: '', email: '', phone: '', location: '', summary: '' },
            experience: [], 
            education: [], 
            skills: [], 
            certifications: [], 
            projects: []
          },
          parseError: 'Could not parse resume. Please try with a different file or enter details manually.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ text: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in resume-ai-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
