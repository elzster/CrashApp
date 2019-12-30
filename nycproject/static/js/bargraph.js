// var nycData = d3.json(`/datafile1/`);

// var nycData2 = `/summary/queens/`

var nycData2 = d3.json(`/summary/statenisland/`)
var debugVar = ""

//#################BAR Graph################
function doublebars() {
  nycData2.then(data => {

    let cyclistInjured = parseInt(data[0].cyclist.injured);
    let motoristInjured = parseInt(data[0].motorist.injured);
    let pedestrianInjured = parseInt(data[0].pedestrian.injured);
    let cyclistKilled = parseInt(data[0].cyclist.killed);
    let motoristKilled = parseInt(data[0].motorist.killed);
    let pedestrianKilled = parseInt(data[0].pedestrian.killed);

    let injured = {
      x: ['Cyclist', 'Motorist', 'Pedestrian'],
      y: [cyclistInjured, motoristInjured, pedestrianInjured],
      name: 'Injured Stats',
      type: 'bar'
    };


    let killed = {
      x: ['Cyclist', 'Motorist', 'Pedestrian'],
      y: [cyclistKilled, motoristKilled, pedestrianKilled],
      name: 'Killed Stats',
      type: 'bar'
    };

    var data = [injured, killed];

    var layout = { barmode: 'group' };

    Plotly.newPlot('plot', data, layout);
  });
}

function updateBars(injured, killed) {
  let PLOT = document.getElementById("plot");

  // Note the extra brackets around 'newx' and 'newy'
  Plotly.restyle(PLOT, "injured", [injured]);
  Plotly.restyle(PLOT, "killed", [killed]);
}
function getData(dataset) {
  // Initialize empty arrays to contain our axes
  let injured = [];
  var killed = [];

  //This Will Populate different instances in drop down.
  // Fill the x and y arrays as a function of the selected dataset
  switch (dataset) {
    case "Queens":
      injured = [49, 1026, 255]
      killed = [49, 1026, 255]
      break;
    case "Bronx":
      injured = [19, 555, 148]
      killed = [49, 1026, 255]
      break;
    case "Brooklyn":
      injured = [82, 1021, 317]
      killed = [49, 1026, 255]
      break;
    case "Staten Island":
      injured = [3, 207, 39]
      killed = [49, 1026, 255]
      break;
    default:
      injured = [89, 320, 152]
      killed = [49, 1026, 255]
      break;
  }
  //updates plotly plot.
  updateBars(injured, killed);
};

doublebars();