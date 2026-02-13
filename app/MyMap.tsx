"use client";
import Map from "react-map-gl/maplibre";

export default function MyMap() {
  return (
    <Map
      initialViewState={{
        longitude: 18.0686, // Stockholm-ish
        latitude: 59.3293,
        zoom: 10,
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    />
  );
}
