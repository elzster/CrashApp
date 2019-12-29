//Works when inputting.

const nycQueens = d3.json(`/summary/queens`);
const nycBrooklyn = d3.json(`/summary/brooklyn`);
const nycManhatttan = d3.json(`/summary/manhattan`);
const nycStatenIsland = d3.json(`/summary/statenisland`);
const nycBronx = d3.json(`/summary/bronx`);

//Works when inputting.
function plotGraph() {
  // ##############Working Donut Graph##################
  nycManhatttan.then(nyc => {
    var cyclistInjured = parseInt(nyc[0].cyclist.injured[0]);
    var motoristInjured = parseInt(nyc[0].motorist.injured[0]);
    var pedestrianInjured = parseInt(nyc[0].pedestrian.injured[0]);
    var cyclistKilled = parseInt(nyc[0].cyclist.killed[0]);
    var motoristKilled = parseInt(nyc[0].motorist.killed[0]);
    var pedestrianKilled = parseInt(nyc[0].pedestrian.killed[0]);

    console.log(pedestrianKilled, motoristKilled, cyclistKilled);

    var data = [{
      values: [cyclistInjured, motoristInjured, pedestrianInjured],
      labels: ['Cyclist', 'Motorist', 'Pedestrian'],
      domain: { row: 0 , column: 0 },
      name: "Injured",
      // hole: .5,
      hoverinfo: 'label+value',
      type: 'pie'
    }, {
      values: [cyclistKilled, motoristKilled, pedestrianKilled],
      labels: ['Cyclist', 'Motorist', 'Pedestrian'],
      domain: { row: 0 , column: 1 },
      name: "Killed",
      // hole: .4,
      hoverinfo: "label+value",
      type: 'pie'
    }];

    var layout = {
      title: "Borough Statistics of Motorists Injured vs Killed",
      annotations: [
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: "Injured",
          x: 0.17,
          y: 0.45
          },
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: 'Killed',
          x: 0.82,
          y: 0.45
        }
      ],
      height: 600,
      width: 600,
      showlegend: true,
      grid: { rows: 2, columns: 2 }
    };
    // console.log([values]);
    Plotly.newPlot('plot', data, layout);

  });
}
function updatePlotly(values) {
  var PLOT = document.getElementById("plot");

  // Note the extra brackets around 'newx' and 'newy'
  Plotly.restyle(PLOT, "values", [values]);
  // Plotly.restyle(PLOT, "labels", [labels]);
  // console.log(values);
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
  //   case "Bronx":
  //       values = [19, 555, 148]
  //   break;  
  // case "Brooklyn":
  //       values = [82, 1021, 317]
  //   break;
  // case "Staten Island":
  //     values = [3, 207, 39]
  //   break;
  default:
      values = [89, 320, 152],[1,1,1]
    break;
  }
  //updates plotly plot.
  updatePlotly(values);
};

plotGraph();
