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
    const { latitude, longitude, locationName } = await req.json();
    console.log('Analyzing weather for:', { latitude, longitude, locationName });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert meteorologist and rocket launch coordinator with deep knowledge of:
- Weather patterns and atmospheric conditions optimal for rocket launches
- Seasonal weather variations across different geographical locations
- Risk assessment for launch operations based on weather conditions
- Historical weather data analysis

Your task is to analyze launch site weather patterns and provide:
1. Current season assessment for the location
2. Optimal launch windows (best months/periods)
3. Weather risks and considerations
4. Specific recommendations for launch timing

Be detailed, scientific, and practical in your analysis.`;

    const userPrompt = `Analyze the weather patterns for rocket launches at this location:
Location: ${locationName || 'Custom Location'}
Coordinates: ${latitude}°N, ${longitude}°E

Provide:
1. **Climate Overview**: General climate characteristics of this location
2. **Optimal Launch Windows**: Best months and time periods for launches, with reasoning
3. **Weather Risks**: Potential weather hazards (storms, high winds, fog, etc.)
4. **Seasonal Analysis**: Month-by-month breakdown of launch feasibility
5. **Specific Recommendations**: Actionable advice for launch planning

Format your response in clear sections with headers.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again later." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error("No analysis received from AI");
    }

    console.log('Weather analysis completed successfully');
    return new Response(
      JSON.stringify({ analysis }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-weather function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
