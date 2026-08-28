import os
from pathlib import Path

import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio
from plotly.subplots import make_subplots
from flask import json
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Float, cast, func, or_

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Maps Setup
#################################################
mapkey = os.environ.get('MAPKEY', '') or "CREATE MAPKEY ENV"

#################################################
# Database Setup
#################################################
PROJECT_DIR = Path(__file__).resolve().parent
DATABASE_PATH = PROJECT_DIR / "db" / "nyc.sqlite"

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{DATABASE_PATH.as_posix()}",
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
from .models import crashdata


def rows_to_lists(rows):
    return [list(row) for row in rows]


def plotly_html(fig):
    return pio.to_html(
        fig,
        full_html=False,
        include_plotlyjs="cdn",
        config={"displayModeBar": False, "responsive": True},
    )


def title_case(value):
    return value.title() if value else "Unknown"


def get_borough_safety_stats():
    rows = db.session.query(
        crashdata.borough.label("borough"),
        func.count(crashdata.id).label("crashes"),
        func.coalesce(func.sum(crashdata.number_of_persons_injured), 0).label("injured"),
        func.coalesce(func.sum(crashdata.number_of_persons_killed), 0).label("killed"),
        func.coalesce(func.sum(crashdata.number_of_cyclist_injured), 0).label("cyclist_injured"),
        func.coalesce(func.sum(crashdata.number_of_cyclist_killed), 0).label("cyclist_killed"),
        func.coalesce(func.sum(crashdata.number_of_motorist_injured), 0).label("motorist_injured"),
        func.coalesce(func.sum(crashdata.number_of_motorist_killed), 0).label("motorist_killed"),
        func.coalesce(func.sum(crashdata.number_of_pedestrian_injured), 0).label("pedestrian_injured"),
        func.coalesce(func.sum(crashdata.number_of_pedestrian_killed), 0).label("pedestrian_killed"),
    ).filter(
        crashdata.borough.in_(["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"])
    ).group_by(
        crashdata.borough
    ).all()

    stats = []
    for row in rows:
        total_casualties = int(row.injured or 0) + int(row.killed or 0)
        stats.append({
            "borough": row.borough,
            "crashes": int(row.crashes or 0),
            "injured": int(row.injured or 0),
            "killed": int(row.killed or 0),
            "total_casualties": total_casualties,
            "cyclist_injured": int(row.cyclist_injured or 0),
            "cyclist_killed": int(row.cyclist_killed or 0),
            "motorist_injured": int(row.motorist_injured or 0),
            "motorist_killed": int(row.motorist_killed or 0),
            "pedestrian_injured": int(row.pedestrian_injured or 0),
            "pedestrian_killed": int(row.pedestrian_killed or 0),
        })

    return sorted(stats, key=lambda item: item["total_casualties"], reverse=True)


def get_top_roads_stats(limit=10):
    rows = db.session.query(
        func.count(crashdata.id).label("crashes"),
        crashdata.on_street_name.label("road"),
        func.coalesce(func.sum(crashdata.number_of_persons_injured), 0).label("injured"),
        func.coalesce(func.sum(crashdata.number_of_persons_killed), 0).label("killed"),
    ).filter(
        crashdata.on_street_name.isnot(None),
        crashdata.on_street_name != "",
    ).group_by(
        crashdata.on_street_name
    ).order_by(
        func.count(crashdata.id).desc()
    ).limit(limit).all()

    return [{
        "road": title_case(row.road),
        "crashes": int(row.crashes or 0),
        "injured": int(row.injured or 0),
        "killed": int(row.killed or 0),
        "casualties": int(row.injured or 0) + int(row.killed or 0),
    } for row in rows]


def get_top_road_names(limit=10):
    rows = db.session.query(
        crashdata.on_street_name.label("road"),
        func.count(crashdata.id).label("crashes"),
    ).filter(
        crashdata.on_street_name.isnot(None),
        crashdata.on_street_name != "",
    ).group_by(
        crashdata.on_street_name
    ).order_by(
        func.count(crashdata.id).desc()
    ).limit(limit).all()

    return [row.road for row in rows]


def get_heatmap_month_options():
    rows = db.session.query(
        func.substr(crashdata.date_time, 1, 7).label("month"),
        func.count(crashdata.id).label("crashes"),
    ).filter(
        crashdata.date_time.isnot(None),
        crashdata.date_time != "",
    ).group_by(
        func.substr(crashdata.date_time, 1, 7)
    ).order_by(
        func.substr(crashdata.date_time, 1, 7)
    ).all()

    return [{
        "value": row.month,
        "label": pd.to_datetime(f"{row.month}-01").strftime("%B %Y"),
        "crashes": int(row.crashes or 0),
    } for row in rows if row.month]


def get_contributing_factor_stats(limit=10):
    rows = db.session.query(
        crashdata.contributing_factors,
        crashdata.number_of_persons_injured,
        crashdata.number_of_persons_killed,
    ).filter(
        crashdata.contributing_factors.isnot(None),
        crashdata.contributing_factors != "",
    ).all()

    factors = {}
    for row in rows:
        factor_names = {
            factor.strip()
            for factor in row.contributing_factors.split(",")
            if factor.strip() and factor.strip().lower() != "unspecified"
        }

        for factor in factor_names:
            current = factors.setdefault(factor, {"factor": title_case(factor), "crashes": 0, "injured": 0, "killed": 0})
            current["crashes"] += 1
            current["injured"] += int(row.number_of_persons_injured or 0)
            current["killed"] += int(row.number_of_persons_killed or 0)

    ranked = sorted(factors.values(), key=lambda item: item["crashes"], reverse=True)[:limit]
    for item in ranked:
        item["casualties"] = item["injured"] + item["killed"]
    return ranked


def build_horizontal_bar_html(items, label_key, value_key, title, color):
    chart_items = list(reversed(items))
    fig = go.Figure(go.Bar(
        x=[item[value_key] for item in chart_items],
        y=[item[label_key] for item in chart_items],
        orientation="h",
        marker={"color": color},
        hovertemplate="<b>%{y}</b><br>Crashes: %{x:,}<extra></extra>",
    ))

    fig.update_layout(
        title={"text": title, "x": 0.5, "xanchor": "center"},
        height=560,
        margin={"t": 72, "r": 35, "b": 50, "l": 170},
        paper_bgcolor="#ffffff",
        plot_bgcolor="#ffffff",
        font={"family": "Lato, Arial, sans-serif", "size": 14, "color": "#111827"},
        xaxis={"title": "Reported crashes", "gridcolor": "#e5e7eb"},
        yaxis={"title": ""},
    )

    return plotly_html(fig)


def build_borough_comparison_html(stats):
    boroughs = [item["borough"] for item in stats]
    fig = make_subplots(specs=[[{"secondary_y": True}]])
    fig.add_trace(go.Bar(
        name="Crashes",
        x=boroughs,
        y=[item["crashes"] for item in stats],
        marker={"color": "#2563eb"},
        hovertemplate="<b>%{x}</b><br>Crashes: %{y:,}<extra></extra>",
    ), secondary_y=False)
    fig.add_trace(go.Bar(
        name="Injured",
        x=boroughs,
        y=[item["injured"] for item in stats],
        marker={"color": "#f97316"},
        hovertemplate="<b>%{x}</b><br>People injured: %{y:,}<extra></extra>",
    ), secondary_y=False)
    fig.add_trace(go.Scatter(
        name="Fatalities",
        x=boroughs,
        y=[item["killed"] for item in stats],
        mode="lines+markers",
        marker={"color": "#dc2626", "size": 10},
        line={"color": "#dc2626", "width": 3},
        hovertemplate="<b>%{x}</b><br>Fatalities: %{y:,}<extra></extra>",
    ), secondary_y=True)

    fig.update_layout(
        title={"text": "2025 Crashes, Injuries, and Fatalities by Borough", "x": 0.5, "xanchor": "center"},
        barmode="group",
        height=560,
        legend={"orientation": "h", "x": 0.5, "xanchor": "center", "y": 1.06},
        margin={"t": 90, "r": 55, "b": 60, "l": 65},
        paper_bgcolor="#ffffff",
        plot_bgcolor="#ffffff",
        font={"family": "Lato, Arial, sans-serif", "size": 14, "color": "#111827"},
    )
    fig.update_yaxes(title_text="Crashes and injuries", gridcolor="#e5e7eb", secondary_y=False)
    fig.update_yaxes(title_text="Fatalities", gridcolor="#f3f4f6", secondary_y=True)

    return plotly_html(fig)


def build_road_user_comparison_html(stats):
    boroughs = [item["borough"] for item in stats]
    fig = go.Figure()

    for label, color, injured_key, killed_key in [
        ("Cyclists", "#14b8a6", "cyclist_injured", "cyclist_killed"),
        ("Motorists", "#2563eb", "motorist_injured", "motorist_killed"),
        ("Pedestrians", "#f97316", "pedestrian_injured", "pedestrian_killed"),
    ]:
        fig.add_trace(go.Bar(
            name=label,
            x=boroughs,
            y=[item[injured_key] + item[killed_key] for item in stats],
            marker={"color": color},
            hovertemplate=f"<b>%{{x}}</b><br>{label}: %{{y:,}} casualties<extra></extra>",
        ))

    fig.update_layout(
        title={"text": "Who Was Affected in Each Borough in 2025", "x": 0.5, "xanchor": "center"},
        barmode="stack",
        height=500,
        legend={"orientation": "h", "x": 0.5, "xanchor": "center", "y": 1.08},
        margin={"t": 90, "r": 35, "b": 60, "l": 65},
        paper_bgcolor="#ffffff",
        plot_bgcolor="#ffffff",
        font={"family": "Lato, Arial, sans-serif", "size": 14, "color": "#111827"},
        yaxis={"title": "Reported casualties", "gridcolor": "#e5e7eb"},
    )

    return plotly_html(fig)


def dashboard_context():
    stats = get_borough_safety_stats()
    totals = {
        "crashes": sum(item["crashes"] for item in stats),
        "injured": sum(item["injured"] for item in stats),
        "killed": sum(item["killed"] for item in stats),
        "casualties": sum(item["total_casualties"] for item in stats),
    }
    return {
        "stats": stats,
        "totals": totals,
        "leading_borough": stats[0] if stats else None,
    }


def build_sunburst_html(stats):
    labels = ["NYC crash outcomes"]
    ids = ["root"]
    parents = [""]
    values = [sum(item["total_casualties"] for item in stats)]
    customdata = [["All boroughs", "2025 reported injuries and fatalities", values[0], ""]]

    for item in stats:
        borough_id = item["borough"]
        labels.append(item["borough"])
        ids.append(borough_id)
        parents.append("root")
        values.append(item["total_casualties"])
        customdata.append([
            item["borough"],
            "Total casualties",
            item["total_casualties"],
            f"{item['crashes']:,} crashes",
        ])

        for outcome, total in [("Injured", item["injured"]), ("Fatalities", item["killed"])]:
            outcome_id = f"{borough_id}-{outcome}"
            labels.append(outcome)
            ids.append(outcome_id)
            parents.append(borough_id)
            values.append(total)
            customdata.append([item["borough"], outcome, total, ""])

            for group in ["Cyclist", "Motorist", "Pedestrian"]:
                key = f"{group.lower()}_{'killed' if outcome == 'Fatalities' else 'injured'}"
                labels.append(group)
                ids.append(f"{outcome_id}-{group}")
                parents.append(outcome_id)
                values.append(item[key])
                customdata.append([item["borough"], f"{group} {outcome.lower()}", item[key], ""])

    fig = go.Figure(go.Sunburst(
        labels=labels,
        ids=ids,
        parents=parents,
        values=values,
        branchvalues="total",
        customdata=customdata,
        maxdepth=3,
        insidetextorientation="radial",
        marker={
            "colors": values,
            "colorscale": [
                [0.0, "#1f2937"],
                [0.25, "#2563eb"],
                [0.5, "#f97316"],
                [0.75, "#dc2626"],
                [1.0, "#7f1d1d"],
            ],
            "line": {"color": "#ffffff", "width": 2},
        },
        hovertemplate=(
            "<b>%{label}</b><br>"
            "%{customdata[0]}<br>"
            "%{customdata[1]}: %{customdata[2]:,}<br>"
            "%{customdata[3]}"
            "<extra></extra>"
        ),
    ))

    fig.update_layout(
        title={
            "text": "2025 Injuries and Fatalities by Borough and Road User",
            "x": 0.5,
            "xanchor": "center",
        },
        height=650,
        margin={"t": 72, "r": 20, "b": 20, "l": 20},
        paper_bgcolor="#ffffff",
        plot_bgcolor="#ffffff",
        font={"family": "Lato, Arial, sans-serif", "size": 14, "color": "#111827"},
    )

    return plotly_html(fig)


def valid_map_rows_query():
    latitude = cast(crashdata.latitude, Float)
    longitude = cast(crashdata.longitude, Float)
    return db.session.query(crashdata).filter(
        crashdata.latitude.isnot(None),
        crashdata.longitude.isnot(None),
        crashdata.latitude != "",
        crashdata.longitude != "",
        latitude.between(40.3, 41.0),
        longitude.between(-74.3, -73.6),
        crashdata.borough.in_(["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]),
    )


def crash_to_geojson_feature(crash):
    latitude = float(crash.latitude)
    longitude = float(crash.longitude)
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [longitude, latitude],
        },
        "properties": {
            "id": crash.id,
            "cartodb_id": crash.cartodbid,
            "socrata_id": crash.socrata_id,
            "on_street_name": crash.on_street_name or "",
            "cross_street_name": crash.cross_street_name or "",
            "date_time": crash.date_time or "",
            "latitude": latitude,
            "longitude": longitude,
            "borough": crash.borough or "",
            "zip_code": crash.zip_code or "",
            "crash_count": 1,
            "number_of_cyclist_injured": crash.number_of_cyclist_injured or 0,
            "number_of_cyclist_killed": crash.number_of_cyclist_killed or 0,
            "number_of_motorist_injured": crash.number_of_motorist_injured or 0,
            "number_of_motorist_killed": crash.number_of_motorist_killed or 0,
            "number_of_pedestrian_injured": crash.number_of_pedestrian_injured or 0,
            "number_of_pedestrian_killed": crash.number_of_pedestrian_killed or 0,
            "number_of_persons_injured": crash.number_of_persons_injured or 0,
            "number_of_persons_killed": crash.number_of_persons_killed or 0,
            "contributing_factors": crash.contributing_factors or "",
            "vehicle_types": crash.vehicle_types or "",
        },
    }


def map_cluster_features(decimal_places=3, month=None):
    latitude = cast(crashdata.latitude, Float)
    longitude = cast(crashdata.longitude, Float)
    rounded_latitude = func.round(latitude, decimal_places).label("latitude")
    rounded_longitude = func.round(longitude, decimal_places).label("longitude")

    query = db.session.query(
        rounded_latitude,
        rounded_longitude,
        crashdata.borough.label("borough"),
        func.count(crashdata.id).label("crash_count"),
        func.coalesce(func.sum(crashdata.number_of_persons_injured), 0).label("injured"),
        func.coalesce(func.sum(crashdata.number_of_persons_killed), 0).label("killed"),
        func.min(crashdata.on_street_name).label("sample_road"),
        func.min(crashdata.contributing_factors).label("sample_factors"),
        func.min(crashdata.vehicle_types).label("sample_vehicle_types"),
    ).filter(
        crashdata.latitude.isnot(None),
        crashdata.longitude.isnot(None),
        crashdata.latitude != "",
        crashdata.longitude != "",
        latitude.between(40.3, 41.0),
        longitude.between(-74.3, -73.6),
        crashdata.borough.in_(["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]),
    )

    if month:
        query = query.filter(func.substr(crashdata.date_time, 1, 7) == month)

    rows = query.group_by(
        rounded_latitude,
        rounded_longitude,
        crashdata.borough,
    ).all()

    return [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [float(row.longitude), float(row.latitude)],
        },
        "properties": {
            "borough": row.borough,
            "on_street_name": row.sample_road or "",
            "crash_count": int(row.crash_count or 0),
            "number_of_persons_injured": int(row.injured or 0),
            "number_of_persons_killed": int(row.killed or 0),
            "contributing_factors": row.sample_factors or "",
            "vehicle_types": row.sample_vehicle_types or "",
        },
    } for row in rows]


###############################################
#########Html Routes for Web Server ###########
###############################################
####Landing Page####
@app.route("/")
def home():

    return render_template("dash.html", **dashboard_context())

###DashBoard MainPage####
@app.route("/dash/")
def dash():

    return render_template("dash.html", **dashboard_context())
###Comparison Page###
@app.route("/boroughcomp/")
def boroughcomp():
    stats = get_borough_safety_stats()
    totals = {
        "crashes": sum(item["crashes"] for item in stats),
        "injured": sum(item["injured"] for item in stats),
        "killed": sum(item["killed"] for item in stats),
        "casualties": sum(item["total_casualties"] for item in stats),
    }
    leading_borough = stats[0] if stats else None

    return render_template(
        "boroughcomp.html",
        borough_chart=build_borough_comparison_html(stats),
        road_user_chart=build_road_user_comparison_html(stats),
        stats=stats,
        totals=totals,
        leading_borough=leading_borough,
    )

###Scope Description Page####
@app.route("/scope/")
def scope():

    return render_template("scope.html")
###HeatMap Page###
@app.route("/heatmap/")
def heatmap():
    return render_template(
        "heatmap.html",
        month_options=get_heatmap_month_options(),
        top_roads=[title_case(road) for road in get_top_road_names()],
    )
###Top 10 Roads Page###
@app.route("/top10/")
def bargraph():
    roads = get_top_roads_stats()
    total_crashes = sum(item["crashes"] for item in roads)
    top_road = roads[0] if roads else None
    return render_template(
        "topten.html",
        roads=roads,
        total_crashes=total_crashes,
        top_road=top_road,
        roads_chart=build_horizontal_bar_html(roads, "road", "crashes", "2025 Top 10 Roads by Crash Frequency", "#2563eb"),
    )

###Contributing Factors Page###
@app.route("/contrib/")
def contrib():
    factors = get_contributing_factor_stats()
    total_crashes = sum(item["crashes"] for item in factors)
    top_factor = factors[0] if factors else None
    return render_template(
        'contrib.html',
        factors=factors,
        total_crashes=total_crashes,
        top_factor=top_factor,
        factors_chart=build_horizontal_bar_html(factors, "factor", "crashes", "2025 Top Contributing Factors", "#f97316"),
    )

@app.route("/retrieval/")
def retrieval():
    
    return render_template('retrieval.html')

@app.route("/clusters/")
def clusters():
    return render_template('clusters.html', month_options=get_heatmap_month_options())

@app.route("/team/")
def team():
    
    return render_template('team.html')

@app.route("/testing/")
def testing():
    
    return render_template('testing1.html')

@app.route("/sunburst/")
def sunburst():
    stats = get_borough_safety_stats()
    totals = {
        "crashes": sum(item["crashes"] for item in stats),
        "injured": sum(item["injured"] for item in stats),
        "killed": sum(item["killed"] for item in stats),
        "casualties": sum(item["total_casualties"] for item in stats),
    }
    leading_borough = stats[0] if stats else None

    return render_template(
        'sunburst.html',
        sunburst_chart=build_sunburst_html(stats),
        stats=stats,
        totals=totals,
        leading_borough=leading_borough,
    )
################################################
##Route for GeoJson Data for Cloropleth Maps ###
################################################
#this route renders and reads geojson file
@app.route("/geojson/")
def showjson():

    filename = os.path.join(app.static_folder, 'js', 'cartodb.geojson')

    with open(filename) as test_file:
        data = json.load(test_file)
        
        return (data)


@app.route("/map-crashes/")
def map_crashes():
    """Return database-backed grouped GeoJSON points for marker clusters."""
    decimals = request.args.get("decimals", default=3, type=int)
    decimals = min(max(decimals, 2), 5)
    month = request.args.get("month", "").strip()
    features = map_cluster_features(decimals, month or None)
    return jsonify({
        "type": "FeatureCollection",
        "features": features,
    })


@app.route("/heatmap-points/")
def heatmap_points():
    """Return lightweight database-backed points for Leaflet heat layers."""
    query = valid_map_rows_query()

    borough = request.args.get("borough")
    if borough:
        query = query.filter(crashdata.borough == title_case(borough))

    month = request.args.get("month", "").strip()
    if month:
        query = query.filter(func.substr(crashdata.date_time, 1, 7) == month)

    scope = request.args.get("scope", "top10").strip().lower()
    if scope == "top10":
        top_roads = get_top_road_names()
        query = query.filter(crashdata.on_street_name.in_(top_roads))

    rows = query.with_entities(crashdata.latitude, crashdata.longitude).all()
    points = [[float(latitude), float(longitude)] for latitude, longitude in rows]
    return jsonify(points)
################################################
####Route for Cloropleth Data File Needed  #####
################################################
#this route renders and reads geojson file
@app.route("/bounds/")
def bounds():

    filename = os.path.join(app.static_folder, 'js', 'nyc.geojson')

    with open(filename) as test_file:
        data = json.load(test_file)
        
        return (data)
##############################################
############Master Datafile Set ##############
##############################################
@app.route("/datafile1/")
def datafile1():
    """Return the list of records in Table"""
    # Use Pandas to perform the sql query
    stmt = db.session.query(crashdata).statement
    df = pd.read_sql(stmt, db.engine)

    data = df.to_json(orient='records')
    return app.response_class(data, mimetype="application/json")

##########################
##Dynamic Route for Borough ###
##########################
@app.route("/borough/<city>/")
def city_borough(city):
    """Return the list of records in Table"""
    resultsData = db.session.query(crashdata).\
                filter(crashdata.borough == (city[0].upper()+city[1:].lower())).all()

    listData = []
    # citylist = []
    # for city in db.session.query(crashdata.borough).distinct():
    #     citylist.append(city)

    for x in resultsData:
        list_dict = {}
        list_dict['borough'] = x.borough
        list_dict['on_street_name'] = x.on_street_name
        list_dict['latitude'] = x.latitude
        list_dict['longitude'] = x.longitude
        list_dict['zip_code'] = x.zip_code
        listData.append(list_dict)

    return jsonify(listData)


#########################################
###########NO NULL BOROUGHS##############
#########################################

#This route just gets the Boroughs and Lat and Long Coordinates
@app.route("/borough/")
def no_null():
    """Return the list of records in Table"""

    # results = db.session.query(nyc.borough, nyc.on_street_name, nyc.).\
    #     order_by(nyc.score.desc()).\
    #     limit(10).all()
    resultsNoNull = db.session.query(crashdata).\
        filter(or_(crashdata.borough=="Queens", crashdata.borough=="Brooklyn", crashdata.borough=="Manhattan", crashdata.borough=="Staten Island", crashdata.borough=="Bronx")).all()

    streetsNyc = []

    for x in resultsNoNull:
        list_dict = {}
        list_dict['borough'] = x.borough
        list_dict['on_street_name'] = x.on_street_name
        list_dict['latitude'] = x.latitude
        list_dict['longitude'] = x.longitude
        list_dict['zip_code'] = x.zip_code
        streetsNyc.append(list_dict)

    return jsonify(streetsNyc)
    
#####################################################
##############Different Values Testing###############
#####################################################
@app.route("/events/<miguel>/")
def variable_list(miguel):
    vartar = (miguel[0].upper()+miguel[1:].lower())
    """Return the list of records in Table"""
    #     order_by(nyc.score.desc()).\
    #     limit(10).all()
    queryresults = db.session.query(crashdata).\
        filter(crashdata.borough==vartar).all()

    streets = []

    list_dict = {}
    list_dict['borough'] = vartar
    list_dict['crash_events_killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_persons_killed)).\
    filter(crashdata.borough==vartar).all())
    list_dict['crash_events_injuries'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_persons_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['total_injuries'] = rows_to_lists(db.session.query(func.count(crashdata.number_of_persons_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['total_crashes'] = rows_to_lists(db.session.query(func.count(crashdata.id)).\
    filter(crashdata.borough==vartar).all())
    streets.append(list_dict)

    return jsonify(streets[0])

##################################################
############Summary Data Sheets###################
##################################################
#Summary Table Call
@app.route("/summary/<elie>/")
def the_room(elie):
    vartar = (elie[0].upper()+elie[1:].lower())
    
    """Return the list of records in Table"""
    
    #hmm... List of unique boroughs.
    # citylist = []
    # for city in db.session.query(crashdata.borough).distinct():
    #     citylist.append(city)


#Group By SQLAlchemy
    values = db.session.query(crashdata).\
        filter(crashdata.borough==vartar).\
        group_by(crashdata.zip_code).all()

    streets = []

    # for x in values:
    list_dict = {}
    list_dict['cyclist'] ={}
    list_dict['motorist']={}
    list_dict['pedestrian']={}
    list_dict['total']={}
    list_dict['borough'] = vartar

    #Queries to Add totals to List Object
    list_dict['borough_crashes'] = db.session.query(crashdata).\
    filter(crashdata.borough==vartar).count()

    list_dict['cyclist']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_cyclist_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['cyclist']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_cyclist_killed)).\
    filter(crashdata.borough==vartar).all())

    list_dict['motorist']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_motorist_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['motorist']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_motorist_killed)).\
    filter(crashdata.borough==vartar).all())

    list_dict['pedestrian']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_pedestrian_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['pedestrian']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_pedestrian_killed)).\
    filter(crashdata.borough==vartar).all())

    list_dict['total']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_persons_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['total']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_persons_killed)).\
    filter(crashdata.borough==vartar).all())

    streets.append(list_dict)
    #returns list of cities that can be used for plotly variables?
    return jsonify(streets)

##################################################################    
###Route to Pull Summary up On Staten Island due to string issues.    
@app.route("/summary/statenisland/")
def staten():
    vartar = "Staten Island"
#Group By SQLAlchemy
    values = db.session.query(crashdata).\
        filter(crashdata.borough==vartar).\
        group_by(crashdata.zip_code).all()

    streets = []

    # for x in values:
    list_dict = {}
    list_dict['cyclist'] ={}
    list_dict['motorist']={}
    list_dict['pedestrian']={}
    list_dict['total']={}
    list_dict['borough'] = vartar

    #Queries to Add totals to List Object
    list_dict['borough_crashes'] = db.session.query(crashdata).\
    filter(crashdata.borough==vartar).count()

    list_dict['cyclist']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_cyclist_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['cyclist']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_cyclist_killed)).\
    filter(crashdata.borough==vartar).all())

    list_dict['motorist']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_motorist_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['motorist']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_motorist_killed)).\
    filter(crashdata.borough==vartar).all())

    list_dict['pedestrian']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_pedestrian_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['pedestrian']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_pedestrian_killed)).\
    filter(crashdata.borough==vartar).all())

    list_dict['total']['injured'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_persons_injured)).\
    filter(crashdata.borough==vartar).all())

    list_dict['total']['killed'] = rows_to_lists(db.session.query(func.sum(crashdata.number_of_persons_killed)).\
    filter(crashdata.borough==vartar).all())

    streets.append(list_dict)
    #returns list of cities that can be used for plotly variables?
    return jsonify(streets)

##################################################################    
###Route to Pull Top Ten RoadWays in Dataset###################### 
################################################################## 

@app.route("/topten/")
def roadways():
    # values = db.session.query(crashdata).\
    # group_by(crashdata.zip_code).all()
    roads = []

    list_dict = {}
    list_dict['top_ten'] = {}

    list_dict['top_ten'] = rows_to_lists(db.session.query(func.count(crashdata.on_street_name), crashdata.on_street_name, crashdata.latitude, crashdata.longitude, crashdata.borough).\
    group_by(crashdata.on_street_name).\
    order_by(func.count(crashdata.on_street_name).desc()).limit(10).all())
    
    roads.append(list_dict)

    return jsonify(roads) 

##################################################################  
############ Top 10 Contributing Factors #########################
##################################################################    
@app.route("/factors/")
def factoid():
    # values = db.session.query(crashdata).\
    # group_by(crashdata.zip_code).all()
    factors = []

    list_dict={}

    list_dict['factors'] = {}

    list_dict['factors'] = rows_to_lists(db.session.query(func.count(crashdata.contributing_factors), crashdata.contributing_factors, func.sum(crashdata.number_of_persons_injured), func.sum(crashdata.number_of_persons_killed),crashdata.borough).\
    group_by(crashdata.contributing_factors).\
    order_by(func.count(crashdata.contributing_factors).desc()).limit(10).all())
    
    del list_dict['factors'][1:3]

    factors.append(list_dict)

    

    return jsonify(factors) 

@app.route("/totals_boroughs/")
def totals_boro():
    
    
    borough_total = []

    list_dict = {}
    list_dict['borough_totals'] = {}

    list_dict['borough_totals'] = rows_to_lists(db.session.query(func.count(crashdata.id), crashdata.borough).\
    group_by(crashdata.borough).\
    order_by(func.count(crashdata.id).desc()).all())
    
    borough_total.append(list_dict)

    return jsonify(borough_total) 

if __name__ == "__main__":
    app.run()
