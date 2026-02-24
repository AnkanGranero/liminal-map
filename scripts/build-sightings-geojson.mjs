import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const UFO_INPUT = path.resolve("data/raw/ufo_sightings.csv");

const BIGFOOT_INPUT = path.resolve("data/raw/bigfoot_reports_geocoded.csv");

const OUTPUT_DIR = path.resolve("public/data");
const OUTPUT = path.join(OUTPUT_DIR, "sightings.geojson");

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return parse(text, {
    columns: (header) => header.map((h) => h.replace(/^\uFEFF/, "").trim()),
    skip_empty_lines: true,
    trim: true,
  });
}

// ---------- UFO: CORGIS ----------
function ufoToFeatures(rows) {
  const features = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const lat = toNumber(r["Location.Coordinates.Latitude"]);
    const lng = toNumber(r["Location.Coordinates.Longitude"]);
    if (lat === null || lng === null) continue;

    const y = toNumber(r["Dates.Sighted.Year"]);
    const m = toNumber(r["Dates.Sighted.Month"]);
    const d = toNumber(r["Date.Sighted.Day"]); // OBS singular i din fil
    const hh = toNumber(r["Dates.Sighted.Hour"]);
    const mm = toNumber(r["Dates.Sighted.Minute"]);

    let sightedAt = null;
    if (y && m && d) {
      const date = `${y}-${pad2(m)}-${pad2(d)}`;
      sightedAt =
        hh === null || mm === null ? date : `${date}T${pad2(hh)}:${pad2(mm)}:00`;
    }

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [lng, lat] },
      properties: {
        id: `ufo-${r["Location.Country"] ?? "XX"}-${i}`,
        type: "ufo",
        source: "corgis-ufo",
        shape: r["Data.Shape"] ?? null,
        durationSeconds: toNumber(r["Data.Encounter duration"]),
        description: r["Data.Description excerpt"] ?? null,
        city: r["Location.City"] ?? null,
        state: r["Location.State"] ?? null,
        country: r["Location.Country"] ?? null,
        sightedAt,
      },
    });
  }
  return features;
}

// ---------- BIGFOOT / cryptid ----------
function bigfootToFeatures(rows) {
  const features = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const lat = toNumber(r["latitude"]);
    const lng = toNumber(r["longitude"]);
    if (lat === null || lng === null) continue;

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [lng, lat] },
      properties: {
        id: `cryptid-bigfoot-${r["number"] ?? i}`,
        type: "cryptid",
        subtype: "bigfoot",
        source: "bigfoot-reports-geocoded",
        classification: r["classification"] ?? null,
        title: r["title"] ?? null,
        observed: r["observed"] ?? null,
        county: r["county"] ?? null,
        state: r["state"] ?? null,
        // date verkar ibland tomt i sample — vi tar med om det finns
        sightedAt: r["date"] ? String(r["date"]).trim() : null,
      },
    });
  }
  return features;
}

// ---------- build ----------

const ufoRows = parseCsv(UFO_INPUT);
const bigfootRows = parseCsv(BIGFOOT_INPUT);

const features = [
  ...ufoToFeatures(ufoRows),
  ...bigfootToFeatures(bigfootRows),
];

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

fs.writeFileSync(
  OUTPUT,
  JSON.stringify({ type: "FeatureCollection", features })
);

console.log(`UFO rows: ${ufoRows.length}`);
console.log(`Bigfoot rows: ${bigfootRows.length}`);
console.log(`Wrote ${features.length} features to ${OUTPUT}`);