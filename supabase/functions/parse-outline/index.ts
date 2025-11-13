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
    const { customOutline } = await req.json();

    if (!customOutline || customOutline.trim() === "") {
      return new Response(JSON.stringify({ sections: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Parsing custom outline:", customOutline);

    // Use Lovable AI to intelligently parse the outline into structured sections
    const response = await fetch('https://api.lovable.app/v1/ai/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a PRD structure parser. Given a custom PRD outline or template, extract the sections and convert them into a structured format.

For each section, you need to provide:
- id: a short, lowercase, hyphenated identifier (e.g., "problem-statement")
- title: the section heading
- description: a brief description of what this section should contain (1 sentence)
- placeholder: example text for the input field
- example: leave as empty string (will use defaults)
- lelandLinks: leave as empty array

Return ONLY a valid JSON object with a "sections" array. No markdown, no explanation, just JSON.

Example output format:
{
  "sections": [
    {
      "id": "overview",
      "title": "Product Overview",
      "description": "Describe the product and its purpose",
      "placeholder": "Provide a high-level overview of the product...",
      "example": "",
      "lelandLinks": []
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Parse this custom PRD outline into structured sections:\n\n${customOutline}`
          }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', errorText);
      throw new Error('Failed to parse outline with AI');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI Response:", aiResponse);

    // Parse the JSON response
    let parsedSections;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                       aiResponse.match(/(\{[\s\S]*\})/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedSections = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("AI response was:", aiResponse);
      return new Response(JSON.stringify({ sections: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(parsedSections), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in parse-outline function:', error);
    return new Response(JSON.stringify({ error: errorMessage, sections: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
