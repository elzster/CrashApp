// Creating map object
var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11
}); 

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

var link = "/nycproject/data/nyc.geojson";

// var nycGeoJSON = "/nycproject/static/js/cartodb.geojson"

var mapStyle = {
    color: "white",
    fillColor: "pink",
    fillOpacity: 0.5,
    weight: 1.5
}

function chooseColor(borough) {
    switch(borough) {
        case "Brooklyn":
            return "yellow";
        case "Bronx":
            return "red";
        case "Manhattan":
            return "orange";
        case "Queens":
            return "green";
        case "Staten Island":
            return "purple";
        default:
            return "black";       
    }
}

// Grabbing our GeoJSON data..
d3.json(link).then( function(data) {
// d3.json(nycGeoJSON, function(data) {
    console.log(data);

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        style: function(feature) {
            return {
                color: "white",
                fillColor: chooseColor(feature.properties.borough),
                fillOpacity: 0.5,
                weight: 1.5
            };
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.2
                    });
                },

                mouseout: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },

                click: function(event) {
                    map.fitBounds(event.target.getBounds());
                }
            });

            layer.bindPopup("<h1>" + feature.properties.neighborhood + 
            "</h1><hr><h2>" + feature.properties.boroughs + "</h2>")
        }

    }).addTo(map);
});
