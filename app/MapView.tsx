"use client";
import type { Layer, MapViewState } from "@deck.gl/core";
import { DeckGL } from "@deck.gl/react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  layers?: Layer[];
  initialViewState?: MapViewState;
  mapStyle?: string;
  controller?: boolean;
};

const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 18.0686, // Stockholm
  latitude: 59.3293,
  zoom: 2.2,
  pitch: 0,
  bearing: 0,
};

export default function MapView({
  layers = [],
  initialViewState = DEFAULT_VIEW_STATE,
  mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  controller = true,
}: MapViewProps) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={controller}
        layers={layers}
      >
        <Map mapStyle={mapStyle} />
      </DeckGL>
    </div>
  );
}

export type { MapViewProps };
