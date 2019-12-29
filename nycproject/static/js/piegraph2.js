// const nycQueens = d3.json(`/summary/queens`);
// const nycBrooklyn = d3.json(`/summary/brooklyn`);
// const nycManhatttan = d3.json(`/summary/manhattan`);
// const nycBronx = d3.json(`/summary/bronx`);
// const nycStaten = d3.json(`/summary/statenisland`);
// var debugVar;

//Testing list.
// nycQueens.then(nyc => {
//   console.log(nyc[0].borough);
// });

//Works when inputting.
function plotGraph1() {
  // ##############Working Pie Graph##################
  nycManhatttan.then(nyc => {
    var cyclistKilled = parseInt(nyc[0].cyclist.killed[0]);
    var motoristKilled = parseInt(nyc[0].motorist.killed[0]);
    var pedestrianKilled = parseInt(nyc[0].pedestrian.killed[0]);

    var data = [{
      values: [cyclistKilled, motoristKilled, pedestrianKilled],
      labels: ['Cyclist', 'Motorist', 'Pedestrian'],
      type: 'pie'
    }];

    var layout = {
      height: 400,
      width: 400,
      title: "Borough Stats of Persons Killed"
    };

    Plotly.newPlot('plotkilled', data, layout);

  });
}

function updatePlotly1(values) {
  var PLOT1 = document.getElementById("plotkilled");

  // Note the extra brackets around 'newx' and 'newy'
  Plotly.restyle(PLOT1, "values", [values]);
  // Plotly.restyle(PLOT, "labels", [labels]);
}

function getData1(dataset1) {
  // Initialize empty arrays to contain our axes
  var values = [];
  // var labels = [];
  
  //This Will Populate different instances in drop down.
  // Fill the x and y arrays as a function of the selected dataset
  switch (dataset1) {
    case "Queens":
        values = [0, 1, 5]
    break;
    case "Bronx":
        values = [0, 1, 1]
    break;  
  case "Brooklyn":
        values = [0, 1, 1]
    break;
  case "Staten Island":
      values = [0, 1, 0]
    break;
  default:
      values = [1, 1, 1]
    break;
  }
  //updates plotly plot.
  updatePlotly1(values);
};

plotGraph1();