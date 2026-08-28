// #############################################################
// ############## Leaflet - Marker Cluster Group ###############
// #############################################################

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

var clusterPrecision = window.innerWidth < 768 ? 2 : 3;
var markers = L.markerClusterGroup();

myMap.addLayer(markers);

function selectedClusterUrl() {
    var monthSelect = document.getElementById("clusterMonth");
    var params = new URLSearchParams({ decimals: clusterPrecision });

    if (monthSelect && monthSelect.value) {
        params.set("month", monthSelect.value);
    }

    return "/map-crashes/?" + params.toString();
}

function updateClusterSummary(message) {
    var summary = document.getElementById("clusterSummary");

    if (summary) {
        summary.textContent = message;
    }
}

function loadClusters() {
    updateClusterSummary("Loading data");
    markers.clearLayers();

    return d3.json(selectedClusterUrl()).then(function(response) {
        var crashTotal = 0;
        for(var i = 0; i < response.features.length; i++) {
            var location = response.features[i];

            if (location && location.geometry && location.properties.borough) {
                crashTotal += location.properties.crash_count || 0;
                markers.addLayer(L.marker([location.geometry.coordinates[1], location.geometry.coordinates[0]])
                
                    .bindPopup("Borough: " + location.properties.borough + "<hr>" + 
                    "Crash Count: " + location.properties.crash_count + "<hr>" +
                    "People Injured: " + location.properties.number_of_persons_injured + "<hr>" +
                    "Fatalities: " + location.properties.number_of_persons_killed + "<hr>" +
                    "Sample Road: " + location.properties.on_street_name + "<hr>" +
                    "Contributing Factors: " + location.properties.contributing_factors + "<hr>" +
                    "Vehicle Type: " + location.properties.vehicle_types));
            }
        }

        updateClusterSummary(crashTotal.toLocaleString() + " crashes");
    }).catch(function() {
        updateClusterSummary("Data unavailable");
    });
}

loadClusters();

var clusterMonth = document.getElementById("clusterMonth");

if (clusterMonth) {
    clusterMonth.addEventListener("change", loadClusters);
}
