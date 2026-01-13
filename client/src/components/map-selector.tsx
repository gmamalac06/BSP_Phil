import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { LatLng, Icon } from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in React-Leaflet
const defaultIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapSelectorProps {
    latitude?: number | null;
    longitude?: number | null;
    onLocationChange: (lat: number, lng: number, address?: string) => void;
    disabled?: boolean;
}

// Component to handle map click events
function LocationMarker({
    position,
    onPositionChange,
}: {
    position: LatLng | null;
    onPositionChange: (pos: LatLng) => void;
}) {
    useMapEvents({
        click(e) {
            onPositionChange(e.latlng);
        },
    });

    return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

// Component to recenter map
function RecenterMap({ center }: { center: LatLng | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 15);
        }
    }, [center, map]);
    return null;
}

export function MapSelector({
    latitude,
    longitude,
    onLocationChange,
    disabled = false,
}: MapSelectorProps) {
    // Default to Philippines center (approximately Metro Manila area)
    const defaultCenter = new LatLng(14.5995, 120.9842);
    const [position, setPosition] = useState<LatLng | null>(
        latitude && longitude ? new LatLng(latitude, longitude) : null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [mapCenter, setMapCenter] = useState<LatLng | null>(null);

    // Set initial position from props
    useEffect(() => {
        if (latitude && longitude) {
            setPosition(new LatLng(latitude, longitude));
        }
    }, [latitude, longitude]);

    const handlePositionChange = async (pos: LatLng) => {
        if (disabled) return;
        setPosition(pos);

        // Reverse geocode to get address
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}&addressdetails=1`
            );
            const data = await response.json();

            // Extract only relevant address parts (name/road and city)
            const addr = data.address || {};
            const parts: string[] = [];

            // Add location name (could be various types)
            const locationName = addr.amenity || addr.building || addr.tourism ||
                addr.shop || addr.leisure || addr.office ||
                addr.house_number || "";
            if (locationName) parts.push(locationName);

            // Add road/street
            const road = addr.road || addr.street || addr.pedestrian || "";
            if (road) parts.push(road);

            // Add city/municipality
            const city = addr.city || addr.town || addr.municipality ||
                addr.village || addr.suburb || "";
            if (city) parts.push(city);

            const address = parts.length > 0 ? parts.join(", ") : data.display_name || "";
            onLocationChange(pos.lat, pos.lng, address);
        } catch (error) {
            onLocationChange(pos.lat, pos.lng);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newPos = new LatLng(parseFloat(lat), parseFloat(lon));
                setPosition(newPos);
                setMapCenter(newPos);
                onLocationChange(parseFloat(lat), parseFloat(lon), display_name);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const clearLocation = () => {
        setPosition(null);
        setSearchQuery("");
    };

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for a location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                        className="pl-9"
                        disabled={disabled}
                    />
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSearch}
                    disabled={disabled || isSearching}
                >
                    <Search className="h-4 w-4" />
                </Button>
                {position && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={clearLocation}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Map Container */}
            <div className="relative h-64 rounded-lg overflow-hidden border">
                <MapContainer
                    center={position || defaultCenter}
                    zoom={position ? 15 : 10}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        position={position}
                        onPositionChange={handlePositionChange}
                    />
                    {mapCenter && <RecenterMap center={mapCenter} />}
                </MapContainer>

                {/* Instructions overlay */}
                {!position && (
                    <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-sm rounded-md p-2 text-xs text-muted-foreground text-center">
                        Click on the map to select a location
                    </div>
                )}
            </div>

            {/* Selected coordinates display */}
            {position && (
                <p className="text-xs text-muted-foreground">
                    Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </p>
            )}
        </div>
    );
}

// Read-only map display component
interface MapDisplayProps {
    latitude: number;
    longitude: number;
    height?: string;
}

export function MapDisplay({ latitude, longitude, height = "200px" }: MapDisplayProps) {
    const position = new LatLng(latitude, longitude);

    return (
        <div className="rounded-lg overflow-hidden border" style={{ height }}>
            <MapContainer
                center={position}
                zoom={15}
                className="h-full w-full"
                scrollWheelZoom={false}
                dragging={false}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={defaultIcon} />
            </MapContainer>
        </div>
    );
}
