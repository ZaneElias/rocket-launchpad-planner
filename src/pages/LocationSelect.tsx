import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Locate, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimpleWorldMap from "@/components/SimpleWorldMap";

const LocationSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const { rocketType, modelSubType } = location.state || {};

  useEffect(() => {
    if (!rocketType) {
      navigate("/");
    }
  }, [rocketType, navigate]);

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          
          // Reverse geocoding to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const locationName = data.address?.city || data.address?.country || "Your Location";
            setSelectedLocation(locationName);
            
            toast({
              title: "Location detected",
              description: `Using ${locationName}`,
            });
          } catch (error) {
            setSelectedLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please select a location on the map or enter it manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleAnalyze = () => {
    if (selectedLocation) {
      navigate("/results", {
        state: { rocketType, modelSubType, location: selectedLocation, coordinates },
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-10">
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Select Launch Location
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose from famous launch sites or enter custom coordinates
          </p>
        </header>

        <Card className="p-8 backdrop-blur-xl bg-card/60 border-border/50 shadow-[var(--glow-card)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="space-y-8">
            <div className="flex justify-center">
              <Button
                onClick={handleUseMyLocation}
                size="lg"
                variant="outline"
                className="gap-2 px-6 py-6 text-base font-display border-2 hover:bg-primary/10 hover:border-primary/50"
              >
                <Locate className="w-5 h-5" />
                Use My Current Location
              </Button>
            </div>

            <SimpleWorldMap
              onLocationSelect={(location, coords) => {
                setSelectedLocation(location);
                setCoordinates(coords);
              }}
            />

            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base font-display border-2"
              >
                Back
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedLocation}
                size="lg"
                className="px-8 py-6 text-base font-display font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 disabled:opacity-50 disabled:shadow-none shadow-[var(--glow-primary)]"
              >
                Analyze Feasibility
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LocationSelect;