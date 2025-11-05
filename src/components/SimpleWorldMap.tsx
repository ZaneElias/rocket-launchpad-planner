import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimpleWorldMapProps {
  onLocationSelect: (location: string, coordinates: { lat: number; lng: number }) => void;
}

// Major cities for quick selection
const MAJOR_CITIES = [
  { name: "Cape Canaveral, USA", lat: 28.396837, lng: -80.605659 },
  { name: "Baikonur, Kazakhstan", lat: 45.965, lng: 63.305 },
  { name: "Kourou, French Guiana", lat: 5.239, lng: -52.768 },
  { name: "Vandenberg, USA", lat: 34.632, lng: -120.611 },
  { name: "Tanegashima, Japan", lat: 30.391, lng: 130.975 },
  { name: "Wenchang, China", lat: 19.614, lng: 110.951 },
  { name: "Mahia, New Zealand", lat: -39.262, lng: 177.865 },
  { name: "Wallops Island, USA", lat: 37.940, lng: -75.466 },
];

const SimpleWorldMap = ({ onLocationSelect }: SimpleWorldMapProps) => {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState({ lat: "", lng: "" });

  const handleCitySelect = async (city: typeof MAJOR_CITIES[0]) => {
    setSelectedCity(city.name);
    onLocationSelect(city.name, { lat: city.lat, lng: city.lng });
    
    toast({
      title: "Location Selected",
      description: city.name,
    });
  };

  const handleCustomLocation = async () => {
    const lat = parseFloat(customLocation.lat);
    const lng = parseFloat(customLocation.lng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude (-90 to 90) and longitude (-180 to 180)",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const locationName = data.display_name || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      
      onLocationSelect(locationName, { lat, lng });
      setSelectedCity(locationName);
      
      toast({
        title: "Location Selected",
        description: locationName.split(",").slice(0, 3).join(","),
      });
    } catch (error) {
      const fallbackName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      onLocationSelect(fallbackName, { lat, lng });
      setSelectedCity(fallbackName);
    }
  };

  return (
    <div className="space-y-6">
      {/* World Map Visualization */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Famous Launch Sites
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {MAJOR_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedCity === city.name
                  ? "border-primary bg-primary/10 shadow-[var(--glow-primary)]"
                  : "border-border hover:border-primary/50 bg-card/30"
              }`}
            >
              <div className="font-semibold text-sm">{city.name.split(",")[0]}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {city.name.split(",")[1]}
              </div>
              <div className="text-xs text-muted-foreground/70 mt-1">
                {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Custom Coordinates Input */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Custom Coordinates</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Latitude (-90 to 90)
            </label>
            <input
              type="number"
              step="0.0001"
              min="-90"
              max="90"
              value={customLocation.lat}
              onChange={(e) =>
                setCustomLocation((prev) => ({ ...prev, lat: e.target.value }))
              }
              placeholder="28.396837"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Longitude (-180 to 180)
            </label>
            <input
              type="number"
              step="0.0001"
              min="-180"
              max="180"
              value={customLocation.lng}
              onChange={(e) =>
                setCustomLocation((prev) => ({ ...prev, lng: e.target.value }))
              }
              placeholder="-80.605659"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleCustomLocation}
          disabled={!customLocation.lat || !customLocation.lng}
          className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Use These Coordinates
        </button>
      </Card>

      {/* Selected Location Display */}
      {selectedCity && (
        <div className="p-4 bg-primary/10 rounded-lg border border-primary animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm text-muted-foreground">Selected Location:</p>
          <p className="text-lg font-semibold">{selectedCity}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleWorldMap;