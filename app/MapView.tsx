"use client";
import type { Layer, MapViewState, PickingInfo } from "@deck.gl/core";
import { DeckGL } from "@deck.gl/react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useCallback } from "react";

type MapViewProps = {
  layers?: Layer[];
  initialViewState?: MapViewState;
  mapStyle?: string;
  controller?: boolean;
  onZoomChange?: (zoom: number) => void;
};

const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: -98,
  latitude: 39,
  zoom: 3.5,
  pitch: 0,
  bearing: 0,
};

export default function MapView({
  layers = [],
  initialViewState = DEFAULT_VIEW_STATE,
  mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  controller = true,
  onZoomChange,
}: MapViewProps) {
  const [infoBox, setInfoBox] = useState<null | {
    x: number;
    y: number;
    text: string;
  }>(null);


  const onClick = useCallback((info: PickingInfo) => {
    if (!info.object) {
      setInfoBox(null);
      return;
    }
    const p = (info.object as any).properties ?? {};
    const text = p.description ?? p.observed ?? p.title ?? "No description";
    setInfoBox({ x: info.x, y: info.y, text });
  }, []);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={controller}
        layers={layers}
        onClick={onClick}
        getCursor={({ isHovering }: { isHovering: boolean }) =>
          isHovering ? "pointer" : "grab"
        }
        onViewStateChange={({viewState}) => {
          const vs = viewState as MapViewState;
         if (typeof vs.zoom === "number") onZoomChange?.(vs.zoom);
        }}
      >
        {infoBox && (
          <div
            style={{
              position: "absolute",
              left: infoBox.x + 12,
              top: infoBox.y + 12,
              background: "rgba(0,0,0,0.85)",
              color: "white",
              padding: "10px 12px",
              borderRadius: 8,
              maxWidth: 320,
              fontSize: 12,
              lineHeight: 1.35,
              pointerEvents: "none",
              whiteSpace: "pre-wrap",
            }}
          >
            {infoBox.text}
          </div>
        )}

        <Map reuseMaps mapStyle={mapStyle} />
      </DeckGL>
    </div>
  );
}

export type { MapViewProps };
