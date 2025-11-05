import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";

// Fix Leaflet default icon issue with bundlers
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", minHeight: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;