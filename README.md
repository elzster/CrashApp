## Welcome to CrashApp! 
### Our Heroku App:
https://project2emjj.herokuapp.com/dash/


## An analysis engine using NYC Open Data using SQL, SQL Alchemy, Javascript, D3, Plotly, Leaflet, Heroku, Flask and Python

Source:
[NYC Open Data](https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95)

### The Project is packed with visualizations and analysis of NYC Car accidents for November 2019

## Setup:
1. Clone the repo
2. Create and activate a virtual environment.
3. Install the dependencies with `pip install -r requirements.txt`.
4. Start Flask with `flask --app nycproject.app run`, or run `./run_win.bat` on Windows.
5. Visit `http://127.0.0.1:5000/dash/`.

## Maintenance

The project has been updated from the original 2019 dependency pins to run on modern Flask, Flask-SQLAlchemy, SQLAlchemy, pandas, and NumPy. The bundled SQLite database at `nycproject/db/nyc.sqlite` is used by default.

Run the smoke tests with:

```bash
python -m unittest discover -s tests
```

![run](https://github.com/elzster/project2/blob/master/nycproject/static/snips/initialSetup.PNG)

## Data Retrieval

All of the data was parsed using API requested from NYC Open Data Website. 
[Here is an example](https://data.cityofnewyork.us/resource/h9gi-nx95.json) of the JSON. 

## Our Team

![The Analysts](https://github.com/elzster/project2/blob/master/nycproject/static/snips/AnalystTeam.PNG)


## Thank you! 
Please contact us with any questions of issues with this repo. 

This is an Open Source repository. Feel free to fork or clone. 
All donations will go towards protecting and feeding orphaned baby yodas. 
