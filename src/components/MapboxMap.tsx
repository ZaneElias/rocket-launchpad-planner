import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

interface MapboxMapProps {
  onLocationSelect: (location: string, coordinates: { lat: number; lng: number }) => void;
}

const MapboxMap = ({ onLocationSelect }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with Mapbox token from environment
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    if (!mapboxgl.accessToken) {
      toast({
        title: "Map Configuration Error",
        description: "Mapbox token is not configured",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 2,
      projection: "globe" as any,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setIsLoading(false);
      
      // Add atmosphere
      if (map.current) {
        map.current.setFog({
          color: "rgb(30, 40, 60)",
          "high-color": "rgb(50, 70, 100)",
          "horizon-blend": 0.1,
        });
      }
    });

    // Handle map clicks
    map.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }

      // Add new marker
      marker.current = new mapboxgl.Marker({ color: "#FF6B35" })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Reverse geocode to get location name
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        
        const locationName =
          data.features[0]?.place_name || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        
        onLocationSelect(locationName, { lat, lng });
        
        toast({
          title: "Location Selected",
          description: locationName,
        });
      } catch (error) {
        console.error("Geocoding error:", error);
        onLocationSelect(`${lat.toFixed(2)}, ${lng.toFixed(2)}`, { lat, lng });
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [onLocationSelect, toast]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-xl" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
          <div className="text-center space-y-2">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border text-sm">
        Click anywhere on the map to select a location
      </div>
    </div>
  );
};

export default MapboxMap;