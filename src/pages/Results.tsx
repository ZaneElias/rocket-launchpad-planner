import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  Scale,
  Mountain,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

type FeasibilityLevel = "high" | "medium" | "low";

interface AnalysisResult {
  title: string;
  icon: React.ElementType;
  level: FeasibilityLevel;
  description: string;
  details: string[];
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { 
    rocketType, 
    modelSubType, 
    location: selectedLocation,
    coordinates 
  } = location.state || {};
  
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rocketType || !selectedLocation) {
      navigate("/");
      return;
    }
    
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("analyze-location", {
          body: {
            location: selectedLocation,
            coordinates,
            rocketType,
            modelSubType,
          },
        });

        if (error) throw error;

        // Transform API response to UI format
        const analysisResults: AnalysisResult[] = [
          {
            title: "Resources & Availability",
            icon: Package,
            level: data.resources.level,
            description: data.resources.description,
            details: data.resources.details,
          },
          {
            title: "Government & Legality",
            icon: Scale,
            level: data.government.level,
            description: data.government.description,
            details: data.government.details,
          },
          {
            title: "Geographical Status",
            icon: Mountain,
            level: data.geography.level,
            description: data.geography.description,
            details: data.geography.details,
          },
          {
            title: "Geopolitical Status",
            icon: Globe,
            level: data.geopolitics.level,
            description: data.geopolitics.description,
            details: data.geopolitics.details,
          },
          {
            title: "Best Time",
            icon: Clock,
            level: data.timing.level,
            description: data.timing.description,
            details: data.timing.details,
          },
          {
            title: "Overall Practicality",
            icon: CheckCircle2,
            level: data.practicality.level,
            description: data.practicality.description,
            details: data.practicality.details,
          },
        ];

        setResults(analysisResults);
      } catch (error) {
        console.error("Analysis error:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not fetch location analysis. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [rocketType, selectedLocation, coordinates, modelSubType, navigate, toast]);

  const getLevelIcon = (level: FeasibilityLevel) => {
    switch (level) {
      case "high":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getLevelColor = (level: FeasibilityLevel) => {
    switch (level) {
      case "high":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <div>
            <p className="text-xl font-semibold">Analyzing Location</p>
            <p className="text-muted-foreground">Gathering real-time data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="mb-2">
            {rocketType === "industrial" ? "Industrial Application" : "Model Rocket"}
            {modelSubType && ` - ${modelSubType === "hobby" ? "Hobby" : "Solo/Team Project"}`}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Feasibility Analysis
          </h1>
          <p className="text-xl text-muted-foreground">
            Launch Analysis for {selectedLocation}
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result, index) => {
            const Icon = result.icon;
            return (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-card/50 border-border hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{result.title}</h3>
                    </div>
                    {getLevelIcon(result.level)}
                  </div>

                  <Badge className={getLevelColor(result.level)}>
                    {result.level.toUpperCase()}
                  </Badge>

                  <p className="text-sm text-muted-foreground">{result.description}</p>

                  <ul className="space-y-2">
                    {result.details.map((detail, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 pt-8">
          <Button
            onClick={() => navigate("/location-select", { state: { rocketType, modelSubType } })}
            variant="outline"
            size="lg"
          >
            Try Different Location
          </Button>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;