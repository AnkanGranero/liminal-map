import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const INPUT = path.resolve("data/raw/ufo_sightings.csv");
const OUTPUT_DIR = path.resolve("public/data");
const OUTPUT = path.join(OUTPUT_DIR, "ufo_sightings.geojson");

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toIsoDate(props) {
  const y = toNumber(props["Dates.Sighted.Year"]);
  const m = toNumber(props["Dates.Sighted.Month"]);
  const d = toNumber(props["Date.Sighted.Day"]);
  const hh = toNumber(props["Dates.Sighted.Hour"]);
  const mm = toNumber(props["Dates.Sighted.Minute"]);

  if (!y || !m || !d) return null;

  // UTC-ish string (vi saknar timezone i datan)
  const date = `${y}-${pad2(m)}-${pad2(d)}`;
  if (hh === null || mm === null) return date;
  return `${date}T${pad2(hh)}:${pad2(mm)}:00`;
}

const csvText = fs.readFileSync(INPUT, "utf-8");

const records = parse(csvText, {
  columns: (header) => header.map(h => h.replace(/^\uFEFF/, "").trim()),
  skip_empty_lines: true,
  trim: true
});

const features = [];

for (let i = 0; i < records.length; i++) {
  const r = records[i];

  const lat = toNumber(r["Location.Coordinates.Latitude"]);
  const lng = toNumber(r["Location.Coordinates.Longitude"]);

  // hoppa över rader utan koordinator
  if (lat === null || lng === null) continue;

  const props = {
    id: `${r["Location.Country"] ?? "XX"}-${i}`,
    type: "ufo",
    shape: r["Data.Shape"] ?? null,
    durationSeconds: toNumber(r["Data.Encounter duration"]),
    description: r["Data.Description excerpt"] ?? null,
    city: r["Location.City"] ?? null,
    state: r["Location.State"] ?? null,
    country: r["Location.Country"] ?? null,
    sightedAt: toIsoDate(r)
  };

  features.push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: props
  });
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const geojson = { type: "FeatureCollection", features };
fs.writeFileSync(OUTPUT, JSON.stringify(geojson));

console.log(`Wrote ${features.length} features to ${OUTPUT}`);