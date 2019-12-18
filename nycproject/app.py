# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

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
<<<<<<< HEAD
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///ppop.sqlite"
=======
<<<<<<< HEAD
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///ppop.sqlite"
=======
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"
>>>>>>> 79174aaca6b7c748be4ab999b0f706c22b3e57ce
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705


# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
db = SQLAlchemy(app)

<<<<<<< HEAD
from .models import crashdata
=======
<<<<<<< HEAD
from .models import crashdata
=======
from .models import Pet

>>>>>>> 79174aaca6b7c748be4ab999b0f706c22b3e57ce
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# create route that renders maps.html template
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705
# @app.route("/maps")
# def maps():
#     return render_template("map.html")

# create route that gives us our map key
# @app.route("/mapkey")
# def mapkeyroute():
#     global mapkey
#     config = { "apikey": mapkey }
#     return jsonify(config)

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


@app.route("/api/")
def pals():
    results = db.session.query(nyctable.latitude).all()

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

    return jsonify(results)
<<<<<<< HEAD
=======
=======
@app.route("/maps")
def maps():
    return render_template("map.html")

# create route that gives us our map key
@app.route("/mapkey")
def mapkeyroute():
    global mapkey
    config = { "apikey": mapkey }
    return jsonify(config)

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        name = request.form["petName"]
        lat = request.form["petLat"]
        lon = request.form["petLon"]

        pet = Pet(name=name, lat=lat, lon=lon)
        db.session.add(pet)
        db.session.commit()
        return redirect("/", code=302)

    return render_template("form.html")


@app.route("/api/pals")
def pals():
    results = db.session.query(Pet.name, Pet.lat, Pet.lon).all()

    hover_text = [result[0] for result in results]
    lat = [result[1] for result in results]
    lon = [result[2] for result in results]

    pet_data = [{
        "type": "scattergeo",
        "locationmode": "USA-states",
        "lat": lat,
        "lon": lon,
        "text": hover_text,
        "hoverinfo": "text",
        "marker": {
            "size": 50,
            "line": {
                "color": "rgb(8,8,8)",
                "width": 1
            },
        }
    }]

    return jsonify(pet_data)
>>>>>>> 79174aaca6b7c748be4ab999b0f706c22b3e57ce
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705


if __name__ == "__main__":
    app.run()