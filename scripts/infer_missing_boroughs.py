"""Infer missing CrashApp borough values from latitude/longitude.

This uses the bundled NYC neighborhood GeoJSON. It is intended for rows where
NYC Open Data left BOROUGH blank, especially highways, bridges, and parkways.
"""

from __future__ import annotations

import argparse
import json
import shutil
import sqlite3
from collections import Counter
from pathlib import Path


UNKNOWN_BOROUGH_SQL = "(borough IS NULL OR borough = '' OR borough = 'Unknown')"


def point_in_ring(lon: float, lat: float, ring: list[list[float]]) -> bool:
    inside = False
    j = len(ring) - 1
    for i, point in enumerate(ring):
        xi, yi = point[0], point[1]
        xj, yj = ring[j][0], ring[j][1]
        crosses = (yi > lat) != (yj > lat)
        if crosses:
            x_intersect = ((xj - xi) * (lat - yi) / (yj - yi)) + xi
            if lon < x_intersect:
                inside = not inside
        j = i
    return inside


def point_in_polygon(lon: float, lat: float, polygon: list[list[list[float]]]) -> bool:
    if not polygon or not point_in_ring(lon, lat, polygon[0]):
        return False
    return not any(point_in_ring(lon, lat, hole) for hole in polygon[1:])


def geometry_contains_point(lon: float, lat: float, geometry: dict) -> bool:
    geometry_type = geometry.get("type")
    coordinates = geometry.get("coordinates", [])

    if geometry_type == "Polygon":
        return point_in_polygon(lon, lat, coordinates)
    if geometry_type == "MultiPolygon":
        return any(point_in_polygon(lon, lat, polygon) for polygon in coordinates)
    return False


def load_borough_geometries(geojson_path: Path) -> list[tuple[str, dict]]:
    data = json.loads(geojson_path.read_text(encoding="utf-8"))
    geometries = []
    for feature in data.get("features", []):
        borough = feature.get("properties", {}).get("borough")
        geometry = feature.get("geometry")
        if borough and geometry:
            geometries.append((borough, geometry))
    return geometries


def infer_borough(lon: float, lat: float, geometries: list[tuple[str, dict]]) -> str | None:
    for borough, geometry in geometries:
        if geometry_contains_point(lon, lat, geometry):
            return borough
    return None


def infer_missing_boroughs(db_path: Path, geojson_path: Path, dry_run: bool, backup: bool) -> None:
    if backup and not dry_run:
        backup_path = db_path.with_suffix(".before_borough_match.sqlite")
        shutil.copy2(db_path, backup_path)
        print(f"Backup created: {backup_path}")

    geometries = load_borough_geometries(geojson_path)
    updates = []
    skipped_no_coords = 0
    unmatched = 0
    matched_counts: Counter[str] = Counter()

    with sqlite3.connect(db_path) as conn:
        rows = conn.execute(
            f"""
            SELECT id, latitude, longitude
            FROM crash
            WHERE {UNKNOWN_BOROUGH_SQL}
            """
        ).fetchall()

        for row_id, latitude, longitude in rows:
            try:
                lat = float(latitude)
                lon = float(longitude)
            except (TypeError, ValueError):
                skipped_no_coords += 1
                continue

            borough = infer_borough(lon, lat, geometries)
            if borough:
                updates.append((borough, row_id))
                matched_counts[borough] += 1
            else:
                unmatched += 1

        if not dry_run:
            conn.executemany("UPDATE crash SET borough = ? WHERE id = ?", updates)
            conn.commit()

        remaining = conn.execute(f"SELECT COUNT(*) FROM crash WHERE {UNKNOWN_BOROUGH_SQL}").fetchone()[0]

    print(f"Rows checked: {len(rows):,}")
    print(f"Matched rows: {len(updates):,}")
    print(f"Skipped without usable coordinates: {skipped_no_coords:,}")
    print(f"Unmatched coordinates: {unmatched:,}")
    print(f"Remaining unknown boroughs: {remaining:,}")
    print("Matched borough counts:")
    for borough, count in matched_counts.most_common():
        print(f"  {borough}: {count:,}")
    if dry_run:
        print("Dry run only; no database rows were updated.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Infer missing boroughs from CrashApp row coordinates.")
    parser.add_argument(
        "--db",
        type=Path,
        default=Path("nycproject/db/nyc_2025.sqlite"),
        help="SQLite database to update.",
    )
    parser.add_argument(
        "--geojson",
        type=Path,
        default=Path("nycproject/static/js/nyc.geojson"),
        help="NYC neighborhood GeoJSON with borough properties.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Report matches without updating the database.")
    parser.add_argument("--no-backup", action="store_true", help="Do not create a backup before updating.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    infer_missing_boroughs(args.db, args.geojson, args.dry_run, not args.no_backup)


if __name__ == "__main__":
    main()
