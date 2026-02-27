"use client";
import { useEffect, useMemo, useState } from "react";
import { createSightingsIconLayer } from "./helpers/createSightingsIconLayer";
import type { FeatureCollection } from "geojson";
import MapView, { type MapViewProps } from "./MapView";

type MapClientProps = MapViewProps & {
  dataUrl?: string;
};

const DEFAULT_DATA_URL = "data/sightings.geojson";;

export default function MapClient({
  layers = [],
  dataUrl = DEFAULT_DATA_URL,
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

    const [zoom, setZoom] = useState<number>(
  (viewProps.initialViewState?.zoom as number) ?? 3.5
);
const baseZoom = 3.5;
const baseSize = 18;
const scaleFactor = 3;

const iconSize = Math.max(10, Math.round(baseSize + (zoom - baseZoom) * scaleFactor));

  const dataLayers = useMemo(() => {
    if (!geojson) return [];
    
    return [
      createSightingsIconLayer(geojson, iconSize),
    ];
  }, [geojson, zoom]);

  const mergedLayers = layers.length ? layers : dataLayers;

  return <MapView layers={mergedLayers} onZoomChange={setZoom} {...viewProps} />;
}
