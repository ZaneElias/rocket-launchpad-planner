import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Users, Hammer } from "lucide-react";
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
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Rocket launching"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rocket Launch Feasibility
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Analyze resources, regulations, and conditions for your rocket project
            </p>
          </header>

          <Card className="p-8 backdrop-blur-sm bg-card/50 border-border shadow-xl">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Select Your Rocket Type
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    onClick={() => {
                      setRocketType("model");
                      setModelSubType(null);
                    }}
                    className={`group relative p-8 rounded-xl border-2 transition-all ${
                      rocketType === "model"
                        ? "border-primary bg-primary/10 shadow-[var(--glow-primary)]"
                        : "border-border hover:border-primary/50 bg-card/30"
                    }`}
                  >
                    <Rocket className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Model Rocket</h3>
                    <p className="text-sm text-muted-foreground">
                      Hobby rockets and small-scale projects
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setRocketType("industrial");
                      setModelSubType(null);
                    }}
                    className={`group relative p-8 rounded-xl border-2 transition-all ${
                      rocketType === "industrial"
                        ? "border-accent bg-accent/10 shadow-[var(--glow-accent)]"
                        : "border-border hover:border-accent/50 bg-card/30"
                    }`}
                  >
                    <Rocket className="w-16 h-16 mx-auto mb-4 text-accent rotate-45" />
                    <h3 className="text-xl font-semibold mb-2">
                      Industrial Application
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Commercial and professional launch systems
                    </p>
                  </button>
                </div>
              </div>

              {rocketType === "model" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-xl font-semibold text-center">
                    Model Rocket Category
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setModelSubType("hobby")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        modelSubType === "hobby"
                          ? "border-primary bg-primary/10 shadow-[var(--glow-primary)]"
                          : "border-border hover:border-primary/50 bg-card/30"
                      }`}
                    >
                      <Hammer className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <h4 className="font-semibold mb-2">Hobby Rocket</h4>
                      <p className="text-sm text-muted-foreground">
                        Personal recreational launches
                      </p>
                    </button>

                    <button
                      onClick={() => setModelSubType("project")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        modelSubType === "project"
                          ? "border-primary bg-primary/10 shadow-[var(--glow-primary)]"
                          : "border-border hover:border-primary/50 bg-card/30"
                      }`}
                    >
                      <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <h4 className="font-semibold mb-2">Solo/Team Project</h4>
                      <p className="text-sm text-muted-foreground">
                        Educational or collaborative builds
                      </p>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-center">
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  size="lg"
                  className="px-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-[var(--glow-primary)]"
                >
                  Continue to Location Selection
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