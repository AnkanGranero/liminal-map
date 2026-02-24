"use client";
import { useEffect, useMemo, useState } from "react";
import type { Layer } from "@deck.gl/core";
import type { FeatureCollection } from "geojson";
import { createGeoJsonPointLayer } from "./helpers/createGeoJsonLayer";
import MapView, { type MapViewProps } from "./MapView";

type MapClientProps = MapViewProps & {
  dataUrl?: string;
};

const DEFAULT_DATA_URL = "/data/ufo_sightings.geojson";;

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

  const dataLayers = useMemo(() => {
    if (!geojson) return [];

    return [
      createGeoJsonPointLayer(geojson, {
        id: "ufo",
        getFillColor: (f) => {
          const shape = (f.properties?.shape ?? "").toLowerCase();

          // enkel “kategori-färg”: disk/triangle/other
          if (shape.includes("triangle")) return [255, 120, 0, 160];
          if (shape.includes("disk")) return [80, 200, 255, 160];
          return [200, 120, 255, 160];
        },
      }),
    ];
  }, [geojson]);

  const mergedLayers = layers.length ? layers : dataLayers;

  return <MapView layers={mergedLayers} {...viewProps} />;
}
