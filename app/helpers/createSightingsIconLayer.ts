import { IconLayer } from "@deck.gl/layers";
import type { Feature, FeatureCollection } from "geojson";

export function createSightingsIconLayer(data: FeatureCollection) {
  return new IconLayer({
    id: "sightings-icons",
    data: data.features,
    pickable: true,
    autoHighlight: true,

    getPosition: (f) =>
      f.geometry.type === "Point" ? f.geometry.coordinates : [0, 0],

    getIcon: (f) => {
      const type = (f as any).properties?.type;
      return {
        url: type === "ufo" ? "/icons/ufo.png" : "/icons/cryptid.png",
        width: 24,
        height: 24,
        anchorX: 12,
        anchorY: 12,
      };
    },

    sizeUnits: "pixels",
    getSize: 20, // håll nära 24
  });
}