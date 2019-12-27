// // NYC OPEN DATA - API ENDPOINT - RETURNS 1000
var nycOpenData = "https://data.cityofnewyork.us/resource/h9gi-nx95.geojson";

// Reading the data + Viewing the data in console
d3.json(nycOpenData).then(function(data) {
  console.log(data);
  createFeatures(data.features);
});

function createFeatures(accidentData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup("Borough: " + feature.properties.borough+ 
    "<hr>Number of Injuries: " + feature.properties.number_of_persons_injured);
  }

  var accidents = L.geoJSON(accidentData, {
    onEachFeature: onEachFeature
  });

  createMap(accidents);
}

function createMap(accidents) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    AccidentsLatLng: accidents
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  // NY Coordinates: 40.7128° N, 74.0060° W [40, -74]
  var myMap = L.map("map", {
    center: [40.71, -74.00],
    zoom: 12,
    layers: [streetmap, accidents]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}

// #############################
//Marker Cluster Example
// #############################`
var url = `/geojson/`;

d3.json(url).then( response =>{
  var markers = L.markerClusterGroup();

  console.log(response)

  for(var i=0; i< response.features.length; i++) {
    var location = response.features[i];

    // console.log(location);

    if (location && location.geometry && location.properties.borough){
      markers.addLayer(L.marker([location.geometry.coordinates[1], location.geometry.coordinates[0]])
      
        .bindPopup("Borough: " + location.properties.borough + "<hr>" +
        "Crash Count: "+ location.properties.crash_count+ "<hr>" +
        "Contributing Factors: " +location.properties.contributing_factors + "<hr>"+
        "Vehicle Type: "+ location.properties.vehicle_types));
    }
  }
  myMap.addLayer(markers);
});
// 
//Console Logs to show connection to geojson on Server.
// d3.json(url).then( data => {
//   console.log(data);
// });