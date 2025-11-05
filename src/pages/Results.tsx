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
  Sparkles,
  ArrowLeft,
  MapPin,
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
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "low":
        return <XCircle className="w-5 h-5 text-rose-400" />;
    }
  };

  const getLevelColor = (level: FeasibilityLevel) => {
    switch (level) {
      case "high":
        return "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30";
      case "medium":
        return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
      case "low":
        return "from-rose-500/20 to-rose-600/10 border-rose-500/30";
    }
  };

  const getLevelBadge = (level: FeasibilityLevel) => {
    const colors = {
      high: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      low: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    };
    return colors[level];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
            <Sparkles className="w-6 h-6 absolute top-0 right-0 text-accent animate-pulse" />
          </div>
          <div>
            <p className="text-2xl font-display font-semibold mb-2">Analyzing Location</p>
            <p className="text-muted-foreground">Gathering comprehensive data from multiple sources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <header className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Badge variant="outline" className="px-4 py-1.5 bg-primary/10 border-primary/30">
              {rocketType === "industrial" ? "Industrial Application" : "Model Rocket"}
              {modelSubType && ` • ${modelSubType === "hobby" ? "Hobby" : "Solo/Team Project"}`}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Feasibility Analysis
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl text-muted-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <p>{selectedLocation}</p>
          </div>
        </header>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {results.map((result, index) => {
            const Icon = result.icon;
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden p-8 backdrop-blur-xl bg-gradient-to-br ${getLevelColor(result.level)} border-2 hover:scale-[1.02] transition-all duration-500 shadow-[var(--glow-card)]`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-xl mb-1">{result.title}</h3>
                        {getLevelIcon(result.level)}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`${getLevelBadge(result.level)} font-semibold border`}>
                    {result.level.toUpperCase()}
                  </Badge>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.description}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-2.5 pt-2">
                    {result.details.map((detail, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="text-primary mt-0.5 font-bold">•</span>
                        <span className="text-foreground/90 leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button
            onClick={() => navigate("/location-select", { state: { rocketType, modelSubType } })}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-display font-semibold border-2 hover:bg-primary/10 hover:border-primary/50"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Try Different Location
          </Button>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="px-8 py-6 text-base font-display font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 shadow-[var(--glow-primary)]"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;