"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { event } from "@/lib/event";

const pin = L.divIcon({
  html: '<span class="pin"></span>',
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function EventMap() {
  return (
    <MapContainer
      center={[event.lat, event.lng]}
      zoom={16}
      scrollWheelZoom={false}
      dragging={!L.Browser.mobile}
      className="z-0 h-64 w-full overflow-hidden rounded-xl border border-line"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[event.lat, event.lng]} icon={pin} />
    </MapContainer>
  );
}
