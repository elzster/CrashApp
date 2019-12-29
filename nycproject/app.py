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
from .models import crashdata
Base = automap_base()
Base.prepare(db.engine, reflect=True)








###############################################
#########Html Routes for Web Server ###########
###############################################

# create route that renders index.html template
@app.route("/")
def home():

    return render_template("index.html")

#Test Route for Cloropleth Mapping
@app.route("/maps/")
def maps():
    return render_template("heatmap.html")

@app.route("/bargraph/")
def bargraph():
    return render_template("bargraph.html")

# create route that gives us our map key
@app.route("/piegraph/")
def piegraph():
    
    return render_template('piegraph.html')

@app.route("/piegraph2/")
def piegraph2():
    
    return render_template('piegraph2.html')




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
    
    df = pd.read_sql_query(stmt, db.session.bind)
    
    myjson = df.to_json(orient='records')
    
    citylist = []
    for city in db.session.query(crashdata.borough).distinct():
        citylist.append(city)

    return jsonify(myjson)

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
    
    list_dict['crash_events_injuries'] = db.session.query(func.count(crashdata.number_of_persons_injured)).\
    filter(crashdata.borough==vartar).all()

    list_dict['total_injuries'] = db.session.query(func.sum(crashdata.number_of_persons_injured)).\
    filter(crashdata.borough==vartar).all()

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
    #returns list of cities that can be used for plotly variables?
    return jsonify(streets)


if __name__ == "__main__":
    app.run()