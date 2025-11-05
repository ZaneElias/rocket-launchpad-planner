import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LeafletMapProps {
  onLocationSelect: (location: string, coordinates: { lat: number; lng: number }) => void;
}

const MapClickHandler = ({ 
  onLocationSelect 
}: { 
  onLocationSelect: (location: string, coords: { lat: number; lng: number }) => void;
}) => {
  const { toast } = useToast();
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });

      // Reverse geocode using Nominatim (free, no API key needed)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        
        const locationName = data.display_name || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        
        onLocationSelect(locationName, { lat, lng });
        
        toast({
          title: "Location Selected",
          description: locationName.split(",").slice(0, 3).join(","),
        });
      } catch (error) {
        console.error("Geocoding error:", error);
        const fallbackName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        onLocationSelect(fallbackName, { lat, lng });
      }
    },
  });

  return marker ? (
    <Marker position={[marker.lat, marker.lng]}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};

const LeafletMap = ({ onLocationSelect }: LeafletMapProps) => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-border">
      <MapContainer
        center={[20, 0] as [number, number]}
        zoom={2}
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;