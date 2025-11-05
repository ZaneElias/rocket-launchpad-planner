import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat support request received");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          {
            role: "system",
            content: `You are a precise, knowledgeable customer support assistant for the Rocket Launch Feasibility Calculator.

IMPORTANT GUIDELINES:
- Be accurate and factual - do not make up information
- Use proper spelling and grammar at all times
- If you don't know something, admit it rather than guessing
- Keep responses concise and directly relevant to the user's question
- Only provide information about features that exist in the app

YOUR EXPERTISE:
- Guiding users through the 3-step process: rocket type selection → location selection → analysis results
- Explaining the 6 analysis categories:
  1. Resources & Availability (materials, suppliers, technical expertise)
  2. Government & Legality (permits, regulations, airspace)
  3. Geographical Status (terrain, population density, climate)
  4. Geopolitical Status (stability, restrictions, cooperation)
  5. Best Time (seasonal conditions, weather patterns)
  6. Practicality (timeline, budget, team requirements)
- Distinguishing between Model Rockets (hobby/solo-team projects) and Industrial Applications
- Understanding location selection using the interactive map
- Interpreting feasibility levels: High (green), Medium (yellow), Low (red)

WHAT YOU CANNOT DO:
- Access real-time weather data (the app shows general seasonal info)
- Provide specific legal advice (refer to local authorities)
- Guarantee launch success (you provide feasibility analysis only)
- Modify user's analysis results

Be professional, encouraging, and helpful while maintaining accuracy.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat support error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});