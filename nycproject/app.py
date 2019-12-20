# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import sqlite3
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import sqlite3
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

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

from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/nyc.sqlite"
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/nyc.sqlite"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
db = SQLAlchemy(app)

from .models import crashdata

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

nycPlot = Base.classes.nyctable


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

#Test Route for Cloropleth Mapping
@app.route("/maps/")
def maps():
    return render_template("cloropleth.html")

@app.route("/line/")
def linegraph():
    return render_template("linegraph.html")


@app.route("/test")
def test():
    """Return a list of sample names."""
    # Use Pandas to perform the sql query
    stmt = db.session.query(crashdata).statement
    # df = pd.read_sql("select * from nyctable WHERE borough='QUEENS'")
    # Return a list of the column names (sample names)
    df = pd.read_sql_query(stmt, db.session.bind)
    # print(df.keys())

    # return ("Doesn't Break")
    myjson = df.to_json(orient='table')
    
    return (jsonify(myjson))

# create route that gives us our map key
@app.route("/testSQL")
def sqlTest():
   
    # return (nycTestData)
    print(crashdata.filter(borough.endswith('QUEENS')).all())

    return render_template('index.html')
# Query the database and send the jsonified results
# @app.route("/send", methods=["GET", "POST"])
# def send():
#     if request.method == "POST":
#         name = request.form["petName"]
#         lat = request.form["petLat"]
#         lon = request.form["petLon"]

#         pet = Pet(name=name, lat=lat, lon=lon)
#         db.session.add(pet)
#         db.session.commit()
#         return redirect("/", code=302)

#     return render_template("form.html")


# @app.route("/api/")
# def pals():
#     results = db.session.query(nyctable.latitude).all()

    # hover_text = [result[0] for result in results]
    # lat = [result[1] for result in results]
    # lon = [result[2] for result in results]

    # pet_data = [{
    #     "type": "scattergeo",
    #     "locationmode": "USA-states",
    #     "lat": lat,
    #     "lon": lon,
    #     "text": hover_text,
    #     "hoverinfo": "text",
    #     "marker": {
    #         "size": 50,
    #         "line": {
    #             "color": "rgb(8,8,8)",
    #             "width": 1
    #         },
    #     }
    # }]

    # return jsonify(results)
    
if __name__ == "__main__":
    app.run()