import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Locate } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MapboxMap from "@/components/MapboxMap";

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Select Launch Location
          </h1>
          <p className="text-muted-foreground">
            Choose your location to analyze feasibility
          </p>
        </header>

        <Card className="p-8 backdrop-blur-sm bg-card/50 border-border">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Button
                onClick={handleUseMyLocation}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <Locate className="w-5 h-5" />
                Use My Current Location
              </Button>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-muted/30 rounded-xl border-2 border-border overflow-hidden">
                <MapboxMap
                  onLocationSelect={(location, coords) => {
                    setSelectedLocation(location);
                    setCoordinates(coords);
                  }}
                />
              </div>
              
              {selectedLocation && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-sm text-muted-foreground">Selected Location:</p>
                  <p className="text-lg font-semibold">{selectedLocation}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedLocation}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Analyze Feasibility
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LocationSelect;