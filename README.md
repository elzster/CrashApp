# CrashApp

CrashApp is a Flask dashboard for exploring NYC motor vehicle collision data. It uses a bundled SQLite dataset for November 2019 and presents the analysis through interactive maps, borough comparisons, ranked roadway charts, contributing-factor charts, and Python-built Plotly visualizations.

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
- Responsive dark navigation and auto-collapsing side rail
- Smoke tests for key HTML and JSON routes

## Main Pages

- `/dash/` - Landing page and project overview
- `/clusters/` - Incident cluster map
- `/boroughcomp/` - Borough comparison charts
- `/sunburst/` - Borough outcome sunburst
- `/top10/` - Top crash-frequency roads
- `/heatmap/` - Crash density heatmap
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

## Tests

Run the smoke tests with:

```bash
python -m unittest discover -s tests
```

## Maintenance Notes

This project was originally built in 2019 and has since been updated to run on modern Flask, Flask-SQLAlchemy, SQLAlchemy, pandas, NumPy, and Plotly. The current UI refresh keeps the original data story while replacing much of the older hardcoded JavaScript charting with Python-generated visualizations.

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
