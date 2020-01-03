// #############################################################
// #################### Leaflet - Heat Map #####################
// #############################################################

// #############################################################
// Creating -  New Icons for Markers
// #############################################################
var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [50, 82],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [82, 82]
});

var redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [50, 82],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [82, 82]
});

var goldIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [50, 82],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [82, 82]
});

var violetIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [50, 82],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [82, 82]
});

var orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [50, 82],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [82, 82]
});

var roadIcon = new L.Icon({
    iconUrl: '/static/js/_ionicons_svg_logo-model-s (1).svg',
    // shadowUrl: '/nycproject/Images/_ionicons_svg_logo-model-s (1).svg',
    iconSize: [50, 82],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    // shadowSize: [82, 82]
});

// #############################################################
// Creating -  Markers To Support Leaflet
// #############################################################
var beltParkway = L.marker([40.645, -73.875], {icon: roadIcon}).bindPopup("<h1>Belt Parkway</h1>"),
    grandCentralParkway = L.marker([40.757, -73.900], {icon: roadIcon}).bindPopup("<h1>Grand Central Parkway</h1>"),
    brooklynQueensExchange = L.marker([40.704, -73.816], {icon: roadIcon}).bindPopup("<h1>Brooklyn Queens Expressway</h1>"),
    majorDeeganExpress = L.marker([40.803, -73.916], {icon: roadIcon}).bindPopup("<h1>Major Deegan Express</h1>"),
    lindenBoulevard = L.marker([40.655, -73.902], {icon: roadIcon}).bindPopup("<h1>Linden Boulevard</h1>"),
    fdrDrive = L.marker([40.747, -73.968], {icon: roadIcon}).bindPopup("<h1>FDR Drive</h1>"),
    broadway = L.marker([40.761, -73.986], {icon: roadIcon}).bindPopup("<h1>Broadway</h1>"),
    crossIslandParkway = L.marker([40.788, -73.790], {icon: roadIcon}).bindPopup("<h1>Cross Island Parkway</h1>")
    longIslandExpressway = L.marker([40.743, -73.837], {icon: roadIcon}).bindPopup("<h1>Long Island Expressway</h1>");
    uticaAvenue = L.marker([40.668, -73.931], {icon: roadIcon}).bindPopup("<h1>Utica Avenue</h1>");

var topTen = L.layerGroup([beltParkway, grandCentralParkway, lindenBoulevard, fdrDrive, broadway, 
    crossIslandParkway, longIslandExpressway, majorDeeganExpress, uticaAvenue, brooklynQueensExchange ]);

// #############################################################
// Creating - Markers for Borough Locations
// #############################################################
var markerBronx = L.marker([40.8448, -73.8648], {icon: redIcon}).bindPopup("<h1>Bronx</h1>"),
    markerBrooklyn = L.marker([40.6782, -73.9442], {icon: goldIcon}).bindPopup("<h1>Brooklyn</h1>"),
    markerQueens = L.marker([40.7282, -73.7949],  {icon: greenIcon}).bindPopup("<h1>Queens</h1>"),
    markerManhattan = L.marker([40.7831, -73.9712], {icon: orangeIcon}).bindPopup("<h1>Manhattan</h1>"),
    markerStatenIsland = L.marker([40.5795, -74.1502], {icon: violetIcon}).bindPopup("<h1>Staten Island</h1>");

var boroughMarkers = L.layerGroup([markerBronx, markerBrooklyn, markerManhattan, markerQueens, markerStatenIsland]);

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
// var url = "/nycproject/static/js/cartodb.geojson";
var url = `/geojson/`;

// var link = "/nycproject/data/nyc.geojson";
var link = `/bounds/`;

// #############################################################
// Creating -  Borough Boundaries - 1st Layer
// #############################################################
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
};

var layerBoroughBoundaries = d3.json(link).then(function(data) {
    L.geoJson(data, {
        style: function(feature) {
            return {
                color: "white",
                fillColor: chooseColor(feature.properties.borough),
                dashArray: 1,
                fillOpacity: 0.0,
                weight: 0.5
            };
        },
        onEachFeature: function(feature, layer) {
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
                mouseout: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.0
                    });
                },
                click: function(event) {
                    map.fitBounds(event.target.getBounds());
                }
            });
                // layer.bindPopup(feature.properties.ZIP + 
                // feature.properties.boroughs)
        }
    }).addTo(myMap);
});

var cityBoundary = new L.layerGroup(layerBoroughBoundaries)

// #############################################################
// Creating - Boroughs Heat Map - 2nd Layer
// #############################################################
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
        blur: 8 
    }).addTo(myMap);
});

var cityHeatMap = new L.layerGroup(layerHeatMap);

// #############################################################
// Creating -  myMap with Layers
// #############################################################
var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 12,
    layers: [
        tileLayerDark,
        cityHeatMap,
        cityBoundary
    ]
});

// #############################################################
// Creating -  overlayMaps for HeatMaps and Boundaries
// #############################################################
var overlayMaps = {
    "HeatMap": cityHeatMap,
    "Boundaries": cityBoundary,
    "Borough Markers": boroughMarkers,
    "Top Ten": topTen
};

// #############################################################
// Creating - layer control for myMap
// #############################################################
L.control.layers(baseMaps, overlayMaps).addTo(myMap);


// #############################################################
// Creating - Legend
// #############################################################
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Color of Boroughs</h4>";
    div.innerHTML += "<hr></hr>";
    div.innerHTML += '<i style="background: yellow"></i><span>Brooklyn</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>Bronx</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>Manhattan</span><br>';
    div.innerHTML += '<i style="background: green"></i><span>Queens</span><br>';
    div.innerHTML += '<i style="background: purple"></i><span>Staten Island</span><br>';
    
    return div;
};

legend.addTo(myMap);
