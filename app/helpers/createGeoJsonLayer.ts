import { GeoJsonLayer } from "@deck.gl/layers";
import type { Accessor, Color } from "@deck.gl/core";
import type { Feature, FeatureCollection } from "geojson";

type Options = {
  id: string;

  pointType?: "circle";
  pointRadiusUnits?: "meters" | "pixels";
  getPointRadius?: number | ((f: any) => number);

  getFillColor?: Accessor<Feature, Color>;

  pickable?: boolean;
  autoHighlight?: boolean;
};

export function createGeoJsonPointLayer(
  data: FeatureCollection,
  opts: Options,
) {
  return new GeoJsonLayer({
    id: opts.id,
    data,
    pointType: opts.pointType ?? "circle",

    pointRadiusUnits: opts.pointRadiusUnits ?? "pixels",
    getPointRadius: opts.getPointRadius ?? 6,

    getFillColor: opts.getFillColor ?? [255, 0, 0, 180],

    pickable: opts.pickable ?? true,
    autoHighlight: opts.autoHighlight ?? true,
  });
}

export default function createGeoJsonLayer() {}
