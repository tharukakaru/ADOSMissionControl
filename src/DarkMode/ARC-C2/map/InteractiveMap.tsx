"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { BATTLE_MAP_ENTITIES, MAP_CENTER, MAP_ZOOM } from "../data";
import type { BattleMapEntity, MapAffiliation } from "../types";

const AFFILIATION_COLOR: Record<MapAffiliation, string> = {
  FRND: "#22d3ee",
  HOST: "#f87171",
  UNK: "#facc15",
  NEUT: "#4ade80",
};

function createCustomIcon(ent: BattleMapEntity): L.DivIcon {
  const color = AFFILIATION_COLOR[ent.affiliation];
  const isHost = ent.affiliation === "HOST";
  const isNeut = ent.affiliation === "NEUT";

  let shapeHtml = "";
  if (isHost) {
    shapeHtml = `<div style="width:12px; height:12px; border: 2px solid ${color}; transform: rotate(45deg); display: flex; align-items: center; justify-content: center;"><div style="width:6px; height:6px; background-color: ${color}; border-radius: 50%;"></div></div>`;
  } else if (isNeut) {
    shapeHtml = `<div style="width:14px; height:14px; border: 2px solid ${color}; border-radius: 50%;"></div>`;
  } else if (ent.type.includes("UAV") || ent.type.includes("Interceptor")) {
    shapeHtml = `<div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 14px solid ${color};"></div>`;
  } else {
    shapeHtml = `<div style="width:14px; height:14px; border: 2px solid ${color};"></div>`;
  }

  const html = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
      ${shapeHtml}
      <div style="color: ${color}; font-size: 9px; font-family: sans-serif; font-weight: bold; white-space: nowrap; text-shadow: 0px 0px 3px black, 0px 0px 3px black; text-transform: uppercase;">${ent.name}</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [100, 30],
    iconAnchor: [50, 15],
  });
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const mapCell = map.getContainer().closest(".map");
    if (!mapCell) return;

    let raf = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => map.invalidateSize());
    });
    observer.observe(mapCell);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

export default function InteractiveMap() {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      zoomControl={false}
      attributionControl={false}
      className="leaflet-container"
    >
      <MapResizer />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={18}
      />
      {BATTLE_MAP_ENTITIES.map((ent) => (
        <Marker
          key={ent.id}
          position={ent.position}
          icon={createCustomIcon(ent)}
        >
          <Popup>
            <div className="map-popup">
              <strong style={{ color: AFFILIATION_COLOR[ent.affiliation] }}>{ent.name}</strong>
              <br />
              {ent.type}
              <br />
              Confidence: {ent.confidence}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
