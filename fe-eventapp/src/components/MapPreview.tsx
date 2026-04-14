import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";


interface MapPreviewProps {
    lat: number;
    lng: number;
    locationName?: string;
}


export const MapPreview: React.FC<MapPreviewProps> = ({ lat, lng, locationName }) => {
    const position: [number, number] = [lat, lng];

    return (
        <MapContainer center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "250px", width: "100%", borderRadius: 8 }}>

<TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
        <Popup>
          {locationName || "Event Location"}
        </Popup>
      </Marker>

        </MapContainer>
    )
}