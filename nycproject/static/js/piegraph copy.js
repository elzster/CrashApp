//Works when inputting.
function init(){
var nycQueens = `/summary/queens`;
var nycBrooklyn = `/summary/brooklyn`;
var nycManhatttan = `/summary/manhattan`;
var nycStatenIsland = `/summary/statenisland`;
var nycBronx = `/summary/bronx`;

    // ##############Working Pie Graph##################
d3.json(nycQueens).then(nyc => {

  var data = [{
    values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])],
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
};
// ####################################################################333
//Dynamic..?

function getData(dataset) {

  // Initialize empty arrays to contain our axes
  var values = [];
  var labels = [];

  //This Will Populate different instances in drop down.
  // Fill the x and y arrays as a function of the selected dataset
  switch (dataset) {
  case `/summary/queens`:
    values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])];
    labels: ['Cyclist', 'Motorist', 'Pedestrian'];
    break;
  case `/summary/brooklyn`:
    values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])];
    labels: ['Cyclist', 'Motorist', 'Pedestrian'];
    break;
  // case `/summary/manhattan`:
  //   values = [10, 20, 30, 40, 50];
  //   labels = [10, 100, 50, 10, 0];
  //   break;
  default:
    values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])];
    labels: ['Cyclist', 'Motorist', 'Pedestrian'];
    break;
  }
  //updates plotly plot.
  updatePlotly(values, labels);
}

init();