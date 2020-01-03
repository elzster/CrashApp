const nycQueens = d3.json(`/summary/queens`);
const nycBrooklyn = d3.json(`/summary/brooklyn`);
const nycManhatttan = d3.json(`/summary/manhattan`);
const nycBronx = d3.json(`/summary/bronx`);
const nycStaten = d3.json(`/summary/statenisland`);
var debugVar;

// //Testing list.
// nycQueens.then(nyc => {
//   console.log(nyc[0].borough);
// });

//Works when inputting.
function plotInjured() {
  // ##############Working Pie Graph##################
  nycManhatttan.then(nyc => {
    let cyclistInjured = parseInt(nyc[0].cyclist.injured[0]);
    let motoristInjured = parseInt(nyc[0].motorist.injured[0]);
    let pedestrianInjured = parseInt(nyc[0].pedestrian.injured[0]);

    let data = [{
      values: [cyclistInjured, motoristInjured, pedestrianInjured],
      labels: ['Cyclist', 'Motorist', 'Pedestrian'],
      type: 'pie'
    }];

    let layout = {
      height: 400,
      width: 400,
      title: "Number of Injuried By Borough",
      showlegend: false,
    };

    Plotly.newPlot('plotinjured', data, layout);

  });
}

function updateInjured(values) {
  let PLOT = document.getElementById("plotinjured");

  // Note the extra brackets around 'newx' and 'newy'
  Plotly.restyle(PLOT, "values", [values]);
  // Plotly.restyle(PLOT, "labels", [labels]);
}

function getData(dataset) {
  // Initialize empty arrays to contain our axes
  let values = [];
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
  updateInjured(values);
};

plotInjured();