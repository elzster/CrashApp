var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 10
});

// Create the tile layer that will be the background of our map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

// Create a baseMaps object to hold the lightmap layer
// var baseMaps = {
//     "Light Map": lightmap
// };  


// var url = "/data/data.geojson"
// Contains "null" values

var url = "/nycproject/static/js/cartodb.geojson"

d3.json(url).then( function(data) {
    console.log(data);
})

// var urlCrashMapper = "http://crashmapper.org/#/?cfat=true&cinj=true&endDate=2019-11&geo=citywide&identifier=&lat=40.68089838511525&lng=-73.89541625976562&lngLats=%255B%255D&mfat=true&minj=true&noInjFat=false&pfat=true&pinj=true&startDate=2019-11&zoom=11";

// var nycOpenDataJSON = "https://data.cityofnewyork.us/resource/h9gi-nx95.json";

// var nycOpenDataGeoJSON = "https://data.cityofnewyork.us/resource/h9gi-nx95.geojson";

d3.json(url).then( function(response) {
    var markers = L.markerClusterGroup();
    
    console.log(response)
    
    for(var i = 0; i < response.features.length; i++) {
        var location = response.features[i];

        console.log(location);

        if (location && location.geometry && location.properties.borough) {
            markers.addLayer(L.marker([location.geometry.coordinates[1], location.geometry.coordinates[0]])
            
                .bindPopup("Borough: " + location.properties.borough + "<hr>" + 
                "Crash Count: " + location.properties.crash_count + "<hr>" +
                "Contributing Factors: " + location.properties.contributing_factors + "<hr>" +
                "Vehicle Type: " + location.properties.vehicle_types));
        }
    }

    myMap.addLayer(markers);
});

