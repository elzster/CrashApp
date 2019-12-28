const nycQueens = d3.json(`/summary/queens`);
const nycBrooklyn = d3.json(`/summary/brooklyn`);
const nycManhatttan = d3.json(`/summary/manhattan`);
const nycStatenIsland = d3.json(`/summary/statenisland`);
const nycBronx = d3.json(`/summary/bronx`);

var debugVar;

//Testing list.
nycQueens.then(nyc => {
  console.log(nyc[0].borough);
});

//Works when inputting.
function plotGraph() {
  // ##############Working Pie Graph##################
  nycBronx.then(nyc => {
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
        
      var cyclistInjured = nycQueens.then(nyc => {parseInt(nyc[0].cyclist.injured[0])});
      var motoristInjured = nycQueens.then(nyc => {parseInt(nyc[0].motoristInjured.injured[0])});
      var pedestrianInjured = nycQueens.then(nyc => {parseInt(nyc[0].cyclist.injured[0])});
      
      values = [cyclistInjured, motoristInjured, pedestrianInjured];
    break;  
  
    default:
      values = [1, 2, 3]
    break;
  }
  //updates plotly plot.
  updatePlotly(values);
};



plotGraph();