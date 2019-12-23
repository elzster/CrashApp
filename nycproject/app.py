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
from flask import json
from flask import url_for

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
    return render_template("cloropleth.html")

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
@app.route("/datafile2/")
def datafile2():
    """Return the list of records in Table"""
    # Use Pandas to perform the sql query
    stmt = db.session.query(crashdata1).statement

    df = pd.read_sql_query(stmt, db.session.bind)

    myjson = df.to_json(orient='records')
    
    return (myjson)

# create route that gives us our map key
@app.route("/bargraph")
def bargraph():
   
    return render_template('bargraph.html')

    
if __name__ == "__main__":
    app.run()