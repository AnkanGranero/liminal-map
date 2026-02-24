import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "data/processed/ufo_sightings.geojson",
  );
  const text = fs.readFileSync(filePath, "utf-8");

  return new NextResponse(text, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
