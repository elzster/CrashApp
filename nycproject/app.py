# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import sqlite3
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask import json
from flask import url_for
from sqlalchemy import func
from sqlalchemy import or_

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
db = SQLAlchemy(app)
from .models import crashdata, crashdata1
Base = automap_base()
Base.prepare(db.engine, reflect=True)

###############################################
#####################ROUTES####################
###############################################

# create route that renders index.html template
@app.route("/")
def home():

    return render_template("index.html")

#Test Route for Cloropleth Mapping
@app.route("/maps/")
def maps():
    return render_template("markercluster.html")

@app.route("/line/")
def maps2():
    return render_template("markercluster.html")

################################################
##Route for GeoJson Data for Cloropleth Maps ###
################################################
@app.route("/geojson/")
def showjson():

    filename = os.path.join(app.static_folder, 'js', 'cartodb.geojson')

    with open(filename) as test_file:
        data = json.load(test_file)
        
        return (data)

##########################
##Route for DataFile 1 ###
##########################
@app.route("/datafile1/")
def datafile1():
    """Return the list of records in Table"""
    # Use Pandas to perform the sql query
    stmt = db.session.query(crashdata).statement
    
    df = pd.read_sql_query(stmt, db.session.bind)
    
    myjson = df.to_json(orient='records')
    
    return (myjson)

##########################
##Route for DataFile 2 ###
##########################
@app.route("/borough/<city>/")
def city_borough(city):
    """Return the list of records in Table"""
    # Use Pandas to perform the sql query
    # results = db.session.query(nyc.borough, nyc.on_street_name, nyc.).\
    #     order_by(nyc.score.desc()).\
    #     limit(10).all()
    # city = "Queens"
    # resultsData = db.session.query(crashdata).\
    #     filter_by(crashdata.borough =="Queens").all()
    

    resultsData = db.session.query(crashdata).\
                filter(crashdata.borough == (city[0].upper()+city[1:].lower())).all()

    listData = []

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
@app.route("/boroughstreets/")
def no_null():
    """Return the list of records in Table"""
    # Use Pandas to perform the sql query
    # results = db.session.query(nyc.borough, nyc.on_street_name, nyc.).\
    #     order_by(nyc.score.desc()).\
    #     limit(10).all()
    resultsNoNull = db.session.query(crashdata).\
        filter(or_(crashdata.borough=="Queens", crashdata.borough=="Brooklyn", crashdata.borough=="Manhattan", crashdata.borough=="Staten Island", crashdata.borough=="Bronx")).all()

    # resultsData2 = db.session.query(crashdata, func.count(crashdata.on_street_name)).\
    #                 group_by(crashdata.on_street_name).all()
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

# create route that gives us our map key
@app.route("/bargraph")
def bargraph():
   
    return render_template('bargraph.html')

    
if __name__ == "__main__":
    app.run()