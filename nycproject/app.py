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

# @app.route("/line/")
# def maps2():
#     return render_template("line.html")

# create route that gives us our map key
@app.route("/bargraph")
def bargraph():
   
    return render_template('bargraph.html')

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
##Dynamic Route for Borough ###
##########################
@app.route("/borough/<city>/")
def city_borough(city):
    """Return the list of records in Table"""
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

@app.route("/variablelist/<miguel>/")
def variable_list(miguel):
    vartar = (miguel[0].upper()+miguel[1:].lower())
    """Return the list of records in Table"""
    #     order_by(nyc.score.desc()).\
    #     limit(10).all()
    queryresults = db.session.query(crashdata).\
        filter(crashdata.borough==vartar).all()

    streets = []

    for x in queryresults:
        list_dict = {}
        list_dict['borough'] = x.borough
        list_dict['on_street_name'] = x.on_street_name
        list_dict['latitude'] = x.latitude
        list_dict['longitude'] = x.longitude
        list_dict['zip_code'] = x.zip_code

        list_dict['crash_events_injuries'] = db.session.query(func.count(crashdata.number_of_persons_injured)).\
        filter(crashdata.borough==vartar).all()

        list_dict['total_injuries'] = db.session.query(func.sum(crashdata.number_of_persons_injured)).\
        filter(crashdata.borough==vartar).all()

        streets.append(list_dict)

    return jsonify(streets)

##################################################
############Summary Data Sheets###################
##################################################
#Summary Table Call
@app.route("/summary/<elie>/")
def the_room(elie):
    vartar = (elie[0].upper()+elie[1:].lower())
    """Return the list of records in Table"""

#Group By SQLAlchemy
    values = db.session.query(crashdata).\
        filter(crashdata.borough==vartar).\
        group_by(crashdata.zip_code).all()

    streets = []

    for x in values:
        list_dict = {}
        list_dict['cyclist'] ={}
        list_dict['motorist']={}
        list_dict['pedestrian']={}
        list_dict['total']={}
        list_dict['borough'] = x.borough

        #####List Values that Are Summary Values##########
        #get the counts of different zip codes in passed borough
        # list_dict['unique_zip_codes'] = db.session.query(crashdata).\
        # filter(crashdata.borough==vartar).\
        # group_by(crashdata.zip_code).count()

        #pass grouped variables into query
        list_dict['total_borough_crashes'] = db.session.query(crashdata).\
        filter(crashdata.borough==vartar).count()

        list_dict['cyclist']['injured'] = db.session.query(func.sum(crashdata.number_of_cyclist_injured)).\
        filter(crashdata.borough==vartar).all()

        list_dict['cyclist']['killed'] = db.session.query(func.sum(crashdata.number_of_cyclist_killed)).\
        filter(crashdata.borough==vartar).all()

        list_dict['motorist']['injured'] = db.session.query(func.sum(crashdata.number_of_motorist_injured)).\
        filter(crashdata.borough==vartar).all()

        list_dict['motorist']['killed'] = db.session.query(func.sum(crashdata.number_of_motorist_killed)).\
        filter(crashdata.borough==vartar).all()

        list_dict['pedestrian']['injured'] = db.session.query(func.sum(crashdata.number_of_pedestrian_injured)).\
        filter(crashdata.borough==vartar).all()

        list_dict['pedestrian']['killed'] = db.session.query(func.sum(crashdata.number_of_pedestrian_killed)).\
        filter(crashdata.borough==vartar).all()

        list_dict['total']['injured'] = db.session.query(func.sum(crashdata.number_of_persons_injured)).\
        filter(crashdata.borough==vartar).all()

        list_dict['total']['killed'] = db.session.query(func.sum(crashdata.number_of_persons_killed)).\
        filter(crashdata.borough==vartar).all()

        streets.append(list_dict)

    return jsonify(streets[0])


if __name__ == "__main__":
    app.run()