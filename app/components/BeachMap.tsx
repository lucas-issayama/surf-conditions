"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Beach } from "@/lib/beaches";
import type { Score } from "@/lib/surf";

type MapPoint = {
  beach: Beach;
  score: Score | null;
};

type Props = {
  points: MapPoint[];
};

export default function BeachMap({ points }: Props) {
  const center: [number, number] = [48.65, -2.9];

  return (
    <div className="h-[420px] rounded-2xl overflow-hidden border border-white/10 relative z-0">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "#0a2a3f" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map(({ beach, score }) => {
          const color = score?.color ?? "#6b7280";
          const radius = score ? 10 + score.total : 10;
          return (
            <CircleMarker
              key={beach.id}
              center={[beach.lat, beach.lon]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <strong>{beach.name}</strong>
                {score ? ` · ${score.total.toFixed(1)}/10` : ""}
              </Tooltip>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600 }}>{beach.name}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{beach.town}</div>
                  {score && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 18,
                        fontWeight: 700,
                        color,
                      }}
                    >
                      {score.total.toFixed(1)}{" "}
                      <span style={{ fontWeight: 400, fontSize: 13 }}>
                        {score.label}
                      </span>
                    </div>
                  )}
                  <a
                    href={`/plage/${beach.id}`}
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      fontSize: 12,
                      color: "#0ea5e9",
                      textDecoration: "underline",
                    }}
                  >
                    Voir la prévision 7 jours →
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
