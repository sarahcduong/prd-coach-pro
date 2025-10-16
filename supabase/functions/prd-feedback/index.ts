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
    const { section, content, ideaContext } = await req.json();
    
    console.log('Generating feedback for section:', section);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an experienced product manager providing constructive feedback on PRD sections. 

CRITICAL: For each piece of feedback, you MUST quote the exact text from the user's content that you're referring to.
Use quotation marks around the specific text you're commenting on.

Format each feedback point as a separate paragraph with:
1. A direct quote from their text (in "quotes")
2. Your specific suggestion for improvement
3. A brief example of how to improve it

Your feedback should be:
- Specific and actionable with quoted references
- Encouraging but honest
- Focused on PM best practices
- Limited to 3-4 key points
- Each point should reference specific text they wrote

Keep each feedback point concise (2-3 sentences per point).`;

    const contextInfo = typeof ideaContext === 'string' ? ideaContext : 
      `Product Idea: ${ideaContext.productIdea}
${ideaContext.persona ? `Target Persona: ${ideaContext.persona}` : ''}
${ideaContext.company ? `Company: ${ideaContext.company}` : ''}
${ideaContext.jobDescription ? `Role: ${ideaContext.jobDescription}` : ''}
${ideaContext.customOutline ? `Custom PRD Structure: ${ideaContext.customOutline}` : ''}`;

    const userPrompt = `${contextInfo}

PRD Section: ${section}

User's Response:
${content}

Provide 3-4 specific feedback points. For EACH point, quote the exact text you're referring to in "quotation marks", then explain what needs improvement and how to fix it.

Example format:
"[exact quote from their text]" - This could be stronger because... Try rephrasing as: "[improved version]"

Separate each feedback point with a blank line.`;

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const feedback = data.choices?.[0]?.message?.content || 'Unable to generate feedback';

    console.log('Feedback generated successfully');

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in prd-feedback function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
