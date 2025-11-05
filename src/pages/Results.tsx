import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Scale,
  Mountain,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
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
  const { rocketType, modelSubType, location: selectedLocation } = location.state || {};

  useEffect(() => {
    if (!rocketType || !selectedLocation) {
      navigate("/");
    }
  }, [rocketType, selectedLocation, navigate]);

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

  // Mock results - in production, this would come from API/analysis
  const results: AnalysisResult[] = [
    {
      title: "Resources & Availability",
      icon: Package,
      level: "high",
      description: "Good access to materials and suppliers",
      details: [
        "Local aerospace suppliers available",
        "Standard rocket components in stock",
        "Fuel and propellant accessible",
        "Technical expertise present in region",
      ],
    },
    {
      title: "Government & Legality",
      icon: Scale,
      level: "medium",
      description: "Permits required but obtainable",
      details: [
        "Launch permits available from local aviation authority",
        "Environmental impact assessment needed",
        "Airspace restrictions apply",
        "Insurance requirements must be met",
      ],
    },
    {
      title: "Geographical Status",
      icon: Mountain,
      level: "high",
      description: "Suitable terrain and conditions",
      details: [
        "Open areas available for safe launch",
        "Low population density in launch zone",
        "Favorable altitude and climate",
        "Recovery areas accessible",
      ],
    },
    {
      title: "Geopolitical Status",
      icon: Globe,
      level: "high",
      description: "Stable region with minimal restrictions",
      details: [
        "No active conflict zones nearby",
        "Stable government regulations",
        "International cooperation possible",
        "Technology transfer allowed",
      ],
    },
    {
      title: "Best Time",
      icon: Clock,
      level: "medium",
      description: "Seasonal considerations apply",
      details: [
        "Spring and Fall offer best conditions",
        "Avoid rainy season (June-August)",
        "Wind patterns favorable in April-May",
        "Temperature ranges optimal in autumn",
      ],
    },
    {
      title: "Overall Practicality",
      icon: CheckCircle2,
      level: rocketType === "industrial" ? "medium" : "high",
      description:
        rocketType === "industrial"
          ? "Feasible with proper planning and investment"
          : "Highly practical for hobby launches",
      details:
        rocketType === "industrial"
          ? [
              "Estimated setup time: 6-12 months",
              "Budget required: $500K - $2M",
              "Team of 15-20 specialists needed",
              "Regulatory approval process: 3-6 months",
            ]
          : [
              "Can start within 1-2 weeks",
              "Budget: $200 - $2,000",
              "Solo or small team viable",
              "Minimal regulatory hurdles",
            ],
    },
  ];

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