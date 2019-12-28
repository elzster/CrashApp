const nycQueens = d3.json(`/summary/queens`);
const nycBrooklyn = d3.json(`/summary/brooklyn`);
const nycManhatttan = d3.json(`/summary/manhattan`);
const nycBronx = d3.json(`/summary/bronx`);
const nycStaten = d3.json(`/summary/statenisland`);
var debugVar;

//Testing list.
nycQueens.then(nyc => {
  console.log(nyc[0].borough);
});

//Works when inputting.
function plotGraph() {
  // ##############Working Pie Graph##################
  nycManhatttan.then(nyc => {
    var cyclistInjured = parseInt(nyc[0].cyclist.injured[0]);
    var motoristInjured = parseInt(nyc[0].motorist.injured[0]);
    var pedestrianInjured = parseInt(nyc[0].pedestrian.injured[0]);

    var data = [{
      values: [cyclistInjured, motoristInjured, pedestrianInjured],
      labels: ['Cyclist', 'Motorist', 'Pedestrian'],
      type: 'pie'
    }];

    var layout = {
      height: 600,
      width: 600,
      title: "Borough Statistics of Motorists Injured"
    };

    Plotly.newPlot('plot', data, layout);

  });
}

function updatePlotly(values) {
  var PLOT = document.getElementById("plot");

  // Note the extra brackets around 'newx' and 'newy'
  Plotly.restyle(PLOT, "values", [values]);
  // Plotly.restyle(PLOT, "labels", [labels]);
}

function getData(dataset) {
  // Initialize empty arrays to contain our axes
  var values = [];
  // var labels = [];
  
  //This Will Populate different instances in drop down.
  // Fill the x and y arrays as a function of the selected dataset
  switch (dataset) {
    case "Queens":
        values = [49, 1026, 255]
    break;
    case "Bronx":
        values = [19, 555, 148]
    break;  
  case "Brooklyn":
        values = [82, 1021, 317]
    break;
  case "Staten Island":
      values = [3, 207, 39]
    break;
  default:
      values = [89, 320, 152]
    break;
  }
  //updates plotly plot.
  updatePlotly(values);
};

plotGraph();