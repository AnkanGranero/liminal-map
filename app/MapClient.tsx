"use client";
import { useEffect, useMemo, useState } from "react";
import type { Layer } from "@deck.gl/core";
import type { FeatureCollection } from "geojson";
import { createGeoJsonPointLayer } from "./helpers/createGeoJsonLayer";
import MapView, { type MapViewProps } from "./MapView";

type MapClientProps = MapViewProps & {
  dataUrl?: string;
};

const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export default function MapClient({
  layers = [],
  dataUrl = USGS_URL,
  ...viewProps
}: MapClientProps) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const res = await fetch(dataUrl);
      const data = (await res.json()) as FeatureCollection;
      if (active) setGeojson(data);
    })();

    return () => {
      active = false;
    };
  }, [dataUrl]);

  const dataLayers = useMemo(() => {
    if (!geojson) return [];

    return [
      createGeoJsonPointLayer(geojson, {
        id: "quakes",
        getFillColor: (f) => {
          const mag = f.properties?.mag ?? 0;
          const r = Math.min(255, Math.floor(60 + mag * 40));
          return [r, 80, 200, 160];
        },
      }),
    ];
  }, [geojson]);

  const mergedLayers = layers.length ? layers : dataLayers;

  return <MapView layers={mergedLayers} {...viewProps} />;
}
