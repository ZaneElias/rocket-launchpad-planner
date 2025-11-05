import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  location: string;
  coordinates: { lat: number; lng: number };
  rocketType: "model" | "industrial";
  modelSubType?: "hobby" | "project";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, coordinates, rocketType, modelSubType }: AnalysisRequest = await req.json();
    
    console.log("Analyzing location:", location, coordinates);

    // Fetch real country data using REST Countries API
    let countryData = null;
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/latlng/${coordinates.lat},${coordinates.lng}`
      );
      if (response.ok) {
        const countries = await response.json();
        countryData = countries[0];
      }
    } catch (error) {
      console.error("Error fetching country data:", error);
    }

    // Calculate analysis based on real factors
    const analysis = {
      resources: analyzeResources(coordinates, countryData, rocketType),
      government: analyzeGovernment(countryData, rocketType),
      geography: analyzeGeography(coordinates, countryData),
      geopolitics: analyzeGeopolitics(countryData),
      timing: analyzeTiming(coordinates),
      practicality: analyzePracticality(rocketType, modelSubType, countryData),
    };

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function analyzeResources(coords: { lat: number; lng: number }, country: any, rocketType: string) {
  // Check if country has aerospace industry
  const hasAerospace = country?.capitalInfo?.latlng != null;
  const isIndustrialized = country?.unMember === true;
  
  let level: "high" | "medium" | "low" = "medium";
  const details: string[] = [];

  if (rocketType === "industrial") {
    if (isIndustrialized && hasAerospace) {
      level = "high";
      details.push("Country has established aerospace infrastructure");
      details.push("Industrial suppliers and contractors available");
    } else {
      level = "low";
      details.push("Limited aerospace industry presence");
      details.push("May require importing specialized components");
    }
  } else {
    level = "high";
    details.push("Basic hobby rocket materials widely available online");
    details.push("Standard motors and parts can be shipped internationally");
  }

  // Add location-based insights
  if (Math.abs(coords.lat) < 30) {
    details.push("Equatorial location advantageous for orbital launches");
  }

  return {
    level,
    description: level === "high" ? "Good resource accessibility" : "Limited local resources",
    details,
  };
}

function analyzeGovernment(country: any, rocketType: string) {
  const isUN = country?.unMember === true;
  const independent = country?.independent === true;
  
  let level: "high" | "medium" | "low" = "medium";
  const details: string[] = [];

  if (rocketType === "industrial") {
    if (isUN && independent) {
      level = "medium";
      details.push("Regulatory framework exists for space activities");
      details.push("Launch licenses available through national space agency");
      details.push("Environmental impact assessment required");
      details.push("Airspace coordination with aviation authorities needed");
    } else {
      level = "low";
      details.push("Complex regulatory environment");
      details.push("May require international permits");
    }
  } else {
    level = "high";
    details.push("Model rocket launches typically permitted with basic safety compliance");
    details.push("Check local aviation authority for altitude restrictions");
    details.push("Notify nearby airports if launching near controlled airspace");
  }

  return {
    level,
    description: level === "high" ? "Permissive regulations" : "Permits required",
    details,
  };
}

function analyzeGeography(coords: { lat: number; lng: number }, country: any) {
  const isCoastal = country?.landlocked === false;
  const population = country?.population || 0;
  const area = country?.area || 0;
  const density = area > 0 ? population / area : 0;

  let level: "high" | "medium" | "low" = "medium";
  const details: string[] = [];

  if (isCoastal) {
    details.push("Coastal location provides downrange safety zones");
    level = "high";
  } else {
    details.push("Landlocked location requires careful trajectory planning");
  }

  if (density < 50) {
    details.push("Low population density reduces safety concerns");
    level = "high";
  } else if (density > 200) {
    details.push("High population density requires careful site selection");
    level = "medium";
  }

  // Latitude considerations
  if (Math.abs(coords.lat) < 5) {
    details.push("Near-equatorial location optimal for orbital launches");
  } else if (Math.abs(coords.lat) > 60) {
    details.push("High latitude suitable for polar orbits");
  }

  return {
    level,
    description: level === "high" ? "Favorable geography" : "Geographic constraints exist",
    details,
  };
}

function analyzeGeopolitics(country: any) {
  const isUN = country?.unMember === true;
  const independent = country?.independent === true;
  
  let level: "high" | "medium" | "low" = "high";
  const details: string[] = [];

  if (isUN && independent) {
    level = "high";
    details.push("Stable governance structure");
    details.push("Member of international space treaties");
    details.push("Technology transfer agreements possible");
  } else {
    level = "medium";
    details.push("May face international cooperation challenges");
    details.push("Technology export controls may apply");
  }

  return {
    level,
    description: level === "high" ? "Stable political environment" : "Some geopolitical considerations",
    details,
  };
}

function analyzeTiming(coords: { lat: number; lng: number }) {
  const isNorthern = coords.lat > 0;
  
  const details: string[] = [];
  
  if (isNorthern) {
    details.push("Best launch windows: April-May and September-October");
    details.push("Avoid winter months due to harsh weather");
    details.push("Summer offers good visibility but may have storms");
  } else {
    details.push("Best launch windows: October-November and March-April");
    details.push("Avoid June-August winter storms");
    details.push("Spring and autumn offer optimal conditions");
  }

  // Tropical considerations
  if (Math.abs(coords.lat) < 23.5) {
    details.push("Monitor monsoon and cyclone seasons");
  }

  return {
    level: "medium" as const,
    description: "Seasonal planning recommended",
    details,
  };
}

function analyzePracticality(
  rocketType: string,
  modelSubType: string | undefined,
  country: any
) {
  let level: "high" | "medium" | "low" = "high";
  const details: string[] = [];

  if (rocketType === "industrial") {
    level = "medium";
    details.push("Estimated timeline: 18-36 months for first launch");
    details.push("Budget: $5M-$50M depending on payload requirements");
    details.push("Team: 30-50 engineers and technicians required");
    details.push("Regulatory approval: 6-12 months");
    
    if (country?.unMember) {
      details.push("Access to international launch service providers");
    }
  } else {
    level = "high";
    details.push(`Timeline: ${modelSubType === "hobby" ? "1-2 weeks" : "2-4 weeks"} to first launch`);
    details.push(`Budget: $${modelSubType === "hobby" ? "100-500" : "500-2,000"}`);
    details.push(modelSubType === "hobby" ? "Can be done solo" : "Team of 2-5 people recommended");
    details.push("Minimal regulatory requirements for low-power rockets");
  }

  return {
    level,
    description: level === "high" ? "Highly practical" : "Feasible with proper planning",
    details,
  };
}