"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => <div className="map-stub" />,
});

export function MapWrapper() {
  return (
    <div className="leaflet-wrap">
      <InteractiveMap />
    </div>
  );
}
