// #############################################################
// #################### Leaflet - Heat Map #####################
// #############################################################

// #############################################################
// Creating -  Tile Layers
// #############################################################

var tileLayerDark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
});

var tileLayerStreets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

var tileLayerSatellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var tileLayerLight = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var tileLayerOutdoor = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// #############################################################
// Creating -  baseMaps
// #############################################################

var baseMaps = {
    "<span style='color: red'>Dark</span>": tileLayerDark,
    "<span style='color: orange'>Light</span>": tileLayerLight,
    "<span style='color: purple'>Streets</span>": tileLayerStreets,
    "<span style='color: green'>Satellite</span>": tileLayerSatellite,
    "<span style='color: pink'>Outdoor</span>": tileLayerOutdoor
};

// #############################################################
// Creating -  URLs
// #############################################################

var url = "/nycproject/static/js/cartodb.geojson";

var link = "/nycproject/data/nyc.geojson";

// #############################################################
// Creating -  Borough Boundaries - 1st Layer
// #############################################################

var mapStyle = {
    color: "white",
    fillColor: "pink",
    fillOpacity: 0.5,
    weight: 1.0
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

var layerBoroughBoundaries = d3.json(link).then(function(data) {
    
    // console.log(data);
    
    L.geoJson(data, {
        style: function(feature) {
            return {
                color: "white",
                fillColor: chooseColor(feature.properties.borough),
                fillOpacity: 0.5,
                weight: 1.0
            };
        },
        // onEachFeature: function(feature, layer) {
        //     layer.on({
        //         mouseover: function(event) {
        //             layer = event.target;
        //             layer.setStyle({
        //                 fillOpacity: 0.2
        //             });
        //         },

        //         mouseout: function(event) {
        //             layer = event.target;
        //             layer.setStyle({
        //                 fillOpacity: 0.9
        //             });
        //         },

        //         click: function(event) {
        //             map.fitBounds(event.target.getBounds());
        //         }
        //     });

            // layer.bindPopup("<h1>" + feature.properties.neighborhood + 
            // "</h1><hr><h2>" + feature.properties.boroughs + "</h2>")
        // }

    })
    .addTo(myMap);
});

var cityBoundary = new L.layerGroup(layerBoroughBoundaries);


// #############################################################
// Creating - Boroughs Heat Map - 2nd Layer
// #############################################################

// var url = `/geojson/`

// d3.json(url).then( function(data) {
//     console.log(data);
// })

var layerHeatMap = d3.json(url).then(function(response) {
    
    var heatArray = [];

    // console.log(response)
    
    for(var i = 0; i < response.features.length; i++) {
        var location = response.features[i];

        // console.log(location);

        if (location && location.geometry && location.properties.borough) {
            heatArray.push([location.geometry.coordinates[1], location.geometry.coordinates[0]])
        }
    }

    var heat = L.heatLayer(heatArray, {
        radius: 60,
        max: 1, 
        blur: 15
    })
    .addTo(myMap);
});

var cityHeatMap = L.layerGroup(layerHeatMap);

// var layersLeaflet = L.layerGroup([layerBoroughBoundaries, layerHeatMap]);

// #############################################################
// Creating -  myMap with Layers
// #############################################################

var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 12,
    layers: [
        tileLayerDark,
        cityBoundary
        // layersLeaflet
    ]
});

// #############################################################
// Creating -  overlayMaps for HeatMaps and Boundaries
// #############################################################

var overlayMaps = {
    // "HeatMap": cityHeatMap,
    // "Boundaries": cityBoundary
    // "Leaflet": layersLeaflet
    "Boundaries": cityBoundary
}

// #############################################################
// Creating - layer control for myMap
// #############################################################

L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// #############################################################
// Creating - Markers for Boroughs
// #############################################################

// var markerBronx = L.marker([40.8448, -73.8648], {
//     draggable: false,
//     title: "Bronx"
// }).addTo(myMap);

// markerBronx.bindPopup("Bronx");

// var markerBrooklyn = L.marker([40.6782, -73.9442], {
//     draggable: false,
//     title: "Brooklyn"
// }).addTo(myMap);

// markerBrooklyn.bindPopup("Brooklyn");

// var markerQueens = L.marker([40.7282, -73.7949], {
//     draggable: false,
//     title: "Queens"
// }).addTo(myMap);

// markerQueens.bindPopup("Queens");

// var markerManhattan = L.marker([40.7831, -73.9712], {
//     draggable: false,
//     title: "Manhattan"
// }).addTo(myMap);

// markerManhattan.bindPopup("Manhattan");

// var markerStatenIsland = L.marker([40.5795, -74.1502], {
//     draggable: false,
//     title: "Staten Island"
// }).addTo(myMap);

// markerStatenIsland.bindPopup("Staten Island");

