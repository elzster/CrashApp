# CrashApp

CrashApp is a Flask dashboard for exploring NYC motor vehicle collision data. It uses a bundled SQLite dataset for the year 2025 and presents the analysis through interactive maps, borough comparisons, ranked roadway charts, contributing-factor charts, and Python-built Plotly visualizations.

## Data Source

The original crash records come from NYC Open Data:
[Motor Vehicle Collisions - Crashes](https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95)

The app runs locally from the bundled database:

```text
nycproject/db/nyc.sqlite
```

## Features

- Modern Flask app with SQLite-backed routes
- Python-generated Plotly charts for borough, roadway, contributing-factor, and sunburst views
- Leaflet maps for incident clusters and crash heatmaps
- Responsive dark navigation with a shared top navigation bar
- Smoke tests for key HTML and JSON routes

## Main Pages

- `/dash/` - Landing page and project overview
- `/clusters/` - 2025 incident cluster map with month filtering
- `/boroughcomp/` - Borough comparison charts
- `/sunburst/` - Borough outcome sunburst
- `/top10/` - Top crash-frequency roads
- `/heatmap/` - 2025 crash density heatmap with month and scope filtering
- `/contrib/` - Top contributing factors
- `/retrieval/` - Data retrieval notes and API examples
- `/team/` - Project team page

## Local Setup

1. Clone the repository.
2. Create and activate a virtual environment.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start Flask:

```bash
flask --app nycproject.app run
```

On Windows, you can also run:

```bat
run_win.bat
```

5. Open the dashboard:

```text
http://127.0.0.1:5000/dash/
```

## Render Deployment

This repository includes a `render.yaml` Blueprint for deploying CrashApp as a Render Python web service.

Recommended Render settings:

- Build Command: `pip install --upgrade pip && pip install -r requirements.txt`
- Start Command: `gunicorn nycproject.app:app --bind 0.0.0.0:$PORT`
- Python Version: `3.12.13`

The app uses the bundled SQLite database at `nycproject/db/nyc.sqlite`, so no hosted database is required for the current read-only dashboard. If Mapbox tiles need a production token, add `MAPKEY` as an environment variable in Render.

## Updating the Data

CrashApp uses a normalized SQLite table named `crash`. NYC Open Data CSV exports have a wider raw schema, so rebuild the app-ready SQLite database with:

```bash
python scripts/build_crash_sqlite.py "path/to/Motor_Vehicle_Collisions_-_Crashes.csv" --output nycproject/db/nyc_2025.sqlite
```

Review the printed row counts and borough counts. When the new database looks correct, replace `nycproject/db/nyc.sqlite` with the generated file.

If the CSV has blank borough values, infer missing boroughs from latitude/longitude with:

```bash
python scripts/infer_missing_boroughs.py --db nycproject/db/nyc_2025.sqlite
```

The map pages use database-backed JSON endpoints:

- `/map-crashes/` returns grouped GeoJSON points for marker clusters.
- `/heatmap-points/` returns lightweight `[latitude, longitude]` pairs for heatmaps.

## Tests

Run the smoke tests with:

```bash
python -m unittest discover -s tests
```

## Maintenance Notes

This project was originally built in 2019 and has since been updated with 2025 crash data and a modern Flask, Flask-SQLAlchemy, SQLAlchemy, pandas, NumPy, and Plotly stack. The current UI refresh keeps the original data story while replacing much of the older hardcoded JavaScript charting with Python-generated visualizations.

## Tech Stack

- Python
- Flask
- Flask-SQLAlchemy
- SQLite
- pandas
- Plotly
- Leaflet
- D3
- Bootstrap
