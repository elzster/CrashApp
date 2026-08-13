"""Build the CrashApp SQLite database from a NYC collision CSV export.

The app expects a normalized ``crash`` table. NYC Open Data exports use a
raw, wider CSV shape, so this script maps the current export columns into the
schema used by the Flask routes.
"""

from __future__ import annotations

import argparse
import csv
import sqlite3
from datetime import datetime
from pathlib import Path


EXPECTED_COLUMNS = [
    "CRASH DATE",
    "CRASH TIME",
    "BOROUGH",
    "ZIP CODE",
    "LATITUDE",
    "LONGITUDE",
    "LOCATION",
    "ON STREET NAME",
    "CROSS STREET NAME",
    "OFF STREET NAME",
    "NUMBER OF PERSONS INJURED",
    "NUMBER OF PERSONS KILLED",
    "NUMBER OF PEDESTRIANS INJURED",
    "NUMBER OF PEDESTRIANS KILLED",
    "NUMBER OF CYCLIST INJURED",
    "NUMBER OF CYCLIST KILLED",
    "NUMBER OF MOTORIST INJURED",
    "NUMBER OF MOTORIST KILLED",
    "CONTRIBUTING FACTOR VEHICLE 1",
    "CONTRIBUTING FACTOR VEHICLE 2",
    "CONTRIBUTING FACTOR VEHICLE 3",
    "CONTRIBUTING FACTOR VEHICLE 4",
    "CONTRIBUTING FACTOR VEHICLE 5",
    "COLLISION_ID",
    "VEHICLE TYPE CODE 1",
    "VEHICLE TYPE CODE 2",
    "VEHICLE TYPE CODE 3",
    "VEHICLE TYPE CODE 4",
    "VEHICLE TYPE CODE 5",
]


CREATE_CRASH_TABLE_SQL = """
CREATE TABLE crash (
    id INTEGER PRIMARY KEY,
    cartodbid INTEGER,
    on_street_name TEXT,
    cross_street_name TEXT,
    date_time TEXT,
    latitude TEXT,
    longitude TEXT,
    borough TEXT,
    zip_code INTEGER,
    socrata_id INTEGER,
    number_of_cyclist_injured INTEGER,
    number_of_cyclist_killed INTEGER,
    number_of_motorist_injured INTEGER,
    number_of_motorist_killed INTEGER,
    number_of_pedestrian_injured INTEGER,
    number_of_pedestrian_killed INTEGER,
    number_of_persons_injured INTEGER,
    number_of_persons_killed INTEGER,
    contributing_factors TEXT,
    vehicle_types TEXT
)
"""


INSERT_CRASH_SQL = """
INSERT INTO crash (
    id,
    cartodbid,
    on_street_name,
    cross_street_name,
    date_time,
    latitude,
    longitude,
    borough,
    zip_code,
    socrata_id,
    number_of_cyclist_injured,
    number_of_cyclist_killed,
    number_of_motorist_injured,
    number_of_motorist_killed,
    number_of_pedestrian_injured,
    number_of_pedestrian_killed,
    number_of_persons_injured,
    number_of_persons_killed,
    contributing_factors,
    vehicle_types
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""


def clean_text(value: str | None) -> str | None:
    value = (value or "").strip()
    return value or None


def to_int(value: str | None) -> int | None:
    value = clean_text(value)
    if value is None:
        return None
    return int(float(value))


def title_case(value: str | None) -> str | None:
    value = clean_text(value)
    return value.title() if value else None


def combine_values(row: dict[str, str], columns: list[str]) -> str | None:
    values = [clean_text(row.get(column)) for column in columns]
    values = [value for value in values if value]
    return ",".join(values) if values else None


def parse_date_time(row: dict[str, str]) -> str | None:
    crash_date = clean_text(row.get("CRASH DATE"))
    crash_time = clean_text(row.get("CRASH TIME"))
    if not crash_date:
        return None

    raw_value = f"{crash_date} {crash_time or '00:00'}"
    parsed = datetime.strptime(raw_value, "%m/%d/%Y %H:%M")
    return parsed.strftime("%Y-%m-%d %H:%M:%S+00")


def normalize_row(row_id: int, row: dict[str, str]) -> tuple:
    return (
        row_id,
        row_id,
        clean_text(row.get("ON STREET NAME")) or clean_text(row.get("OFF STREET NAME")),
        clean_text(row.get("CROSS STREET NAME")),
        parse_date_time(row),
        clean_text(row.get("LATITUDE")),
        clean_text(row.get("LONGITUDE")),
        title_case(row.get("BOROUGH")),
        to_int(row.get("ZIP CODE")),
        to_int(row.get("COLLISION_ID")),
        to_int(row.get("NUMBER OF CYCLIST INJURED")) or 0,
        to_int(row.get("NUMBER OF CYCLIST KILLED")) or 0,
        to_int(row.get("NUMBER OF MOTORIST INJURED")) or 0,
        to_int(row.get("NUMBER OF MOTORIST KILLED")) or 0,
        to_int(row.get("NUMBER OF PEDESTRIANS INJURED")) or 0,
        to_int(row.get("NUMBER OF PEDESTRIANS KILLED")) or 0,
        to_int(row.get("NUMBER OF PERSONS INJURED")) or 0,
        to_int(row.get("NUMBER OF PERSONS KILLED")) or 0,
        combine_values(row, [
            "CONTRIBUTING FACTOR VEHICLE 1",
            "CONTRIBUTING FACTOR VEHICLE 2",
            "CONTRIBUTING FACTOR VEHICLE 3",
            "CONTRIBUTING FACTOR VEHICLE 4",
            "CONTRIBUTING FACTOR VEHICLE 5",
        ]),
        combine_values(row, [
            "VEHICLE TYPE CODE 1",
            "VEHICLE TYPE CODE 2",
            "VEHICLE TYPE CODE 3",
            "VEHICLE TYPE CODE 4",
            "VEHICLE TYPE CODE 5",
        ]),
    )


def validate_columns(csv_columns: list[str]) -> None:
    missing = [column for column in EXPECTED_COLUMNS if column not in csv_columns]
    extra = [column for column in csv_columns if column not in EXPECTED_COLUMNS]
    if missing:
        raise ValueError(f"CSV is missing expected columns: {missing}")
    if extra:
        print(f"Warning: CSV has extra columns that will be ignored: {extra}")


def build_database(csv_path: Path, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        output_path.unlink()

    with csv_path.open("r", encoding="utf-8-sig", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        if reader.fieldnames is None:
            raise ValueError("CSV file has no header row.")
        validate_columns(reader.fieldnames)

        with sqlite3.connect(output_path) as conn:
            conn.execute(CREATE_CRASH_TABLE_SQL)
            rows = (normalize_row(index, row) for index, row in enumerate(reader, start=1))
            conn.executemany(INSERT_CRASH_SQL, rows)
            conn.commit()

            count = conn.execute("SELECT COUNT(*) FROM crash").fetchone()[0]
            boroughs = conn.execute(
                "SELECT borough, COUNT(*) FROM crash GROUP BY borough ORDER BY borough"
            ).fetchall()
            date_range = conn.execute("SELECT MIN(date_time), MAX(date_time) FROM crash").fetchone()

    print(f"Built {output_path}")
    print(f"Rows inserted: {count:,}")
    print(f"Date range: {date_range[0]} to {date_range[1]}")
    print("Borough counts:")
    for borough, borough_count in boroughs:
        print(f"  {borough or 'Unknown'}: {borough_count:,}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build CrashApp SQLite DB from NYC crash CSV.")
    parser.add_argument("csv_path", type=Path, help="Path to the NYC crash CSV export.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("nycproject/db/nyc_2025.sqlite"),
        help="Output SQLite database path. Defaults to nycproject/db/nyc_2025.sqlite.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    build_database(args.csv_path, args.output)


if __name__ == "__main__":
    main()
