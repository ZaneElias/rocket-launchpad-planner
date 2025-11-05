import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Users, Hammer, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/rocket-hero.jpg";

type RocketType = "model" | "industrial" | null;
type ModelSubType = "hobby" | "project" | null;

const RocketSelection = () => {
  const navigate = useNavigate();
  const [rocketType, setRocketType] = useState<RocketType>(null);
  const [modelSubType, setModelSubType] = useState<ModelSubType>(null);

  const handleContinue = () => {
    if (rocketType === "industrial") {
      navigate("/location-select", { state: { rocketType, modelSubType: null } });
    } else if (rocketType === "model" && modelSubType) {
      navigate("/location-select", { state: { rocketType, modelSubType } });
    }
  };

  const canContinue =
    rocketType === "industrial" || (rocketType === "model" && modelSubType !== null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Rocket launching"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header */}
          <header className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Launch Feasibility Analysis</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent leading-tight">
              Rocket Launch<br />Feasibility Calculator
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive analysis of resources, regulations, geography, and optimal conditions for your rocket project
            </p>
          </header>

          {/* Main Selection Card */}
          <Card className="p-8 md:p-12 backdrop-blur-xl bg-card/60 border-border/50 shadow-[var(--glow-card)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="space-y-10">
              {/* Rocket Type Selection */}
              <div>
                <h2 className="text-3xl font-display font-semibold mb-8 text-center">
                  Select Your Rocket Type
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    onClick={() => {
                      setRocketType("model");
                      setModelSubType(null);
                    }}
                    className={`group relative p-8 md:p-10 rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] ${
                      rocketType === "model"
                        ? "border-primary bg-primary/10 shadow-[var(--glow-primary)]"
                        : "border-border hover:border-primary/50 bg-gradient-to-br from-card to-muted/20"
                    }`}
                  >
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-8">
                      <h3 className="text-2xl font-display font-bold mb-3">Model Rocket</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Perfect for hobbyists, students, and small-scale educational projects
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setRocketType("industrial");
                      setModelSubType(null);
                    }}
                    className={`group relative p-8 md:p-10 rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] ${
                      rocketType === "industrial"
                        ? "border-accent bg-accent/10 shadow-[var(--glow-accent)]"
                        : "border-border hover:border-accent/50 bg-gradient-to-br from-card to-muted/20"
                    }`}
                  >
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Rocket className="w-6 h-6 text-accent rotate-45" />
                    </div>
                    <div className="mt-8">
                      <h3 className="text-2xl font-display font-bold mb-3">
                        Industrial Application
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Commercial launch systems and professional aerospace operations
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Model Subcategory Selection */}
              {rocketType === "model" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-display font-semibold text-center">
                    Choose Your Category
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setModelSubType("hobby")}
                      className={`p-8 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                        modelSubType === "hobby"
                          ? "border-primary bg-primary/10 shadow-[var(--glow-primary)]"
                          : "border-border hover:border-primary/50 bg-card/40"
                      }`}
                    >
                      <Hammer className="w-10 h-10 mx-auto mb-4 text-primary" />
                      <h4 className="font-display font-semibold text-lg mb-2">Hobby Rocket</h4>
                      <p className="text-sm text-muted-foreground">
                        Personal recreational launches and experimentation
                      </p>
                    </button>

                    <button
                      onClick={() => setModelSubType("project")}
                      className={`p-8 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                        modelSubType === "project"
                          ? "border-primary bg-primary/10 shadow-[var(--glow-primary)]"
                          : "border-border hover:border-primary/50 bg-card/40"
                      }`}
                    >
                      <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
                      <h4 className="font-display font-semibold text-lg mb-2">Solo/Team Project</h4>
                      <p className="text-sm text-muted-foreground">
                        Educational builds and collaborative rocket programs
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <div className="pt-6 flex justify-center">
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  size="lg"
                  className="px-10 py-6 text-lg font-display font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 disabled:opacity-50 transition-all shadow-[var(--glow-primary)] hover:shadow-[var(--glow-accent)] disabled:shadow-none group"
                >
                  Continue to Location Selection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RocketSelection;