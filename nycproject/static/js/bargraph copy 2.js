//Works when inputting.
var nycQueens = `/summary/queens`;
var nycBrooklyn = `/summary/brooklyn`;
var nycManhatttan = `/summary/manhattan`;
var nycStatenIsland = `/summary/statenisland`;
var nycBronx = `/summary/bronx`;
var nycOthers = `/summary/null`;
d3.json(nycQueens).then(blah => {
  console.log(blah.cyclist.injured[0]);
})

d3.json(nycQueens).then(nyc => {

  var data = [{
    values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])],
    labels: ['Cyclist', 'Motorist', 'Pedestrian'],
    type: 'pie'
  }];
  
  var layout = {
    height: 400,
    width: 500
  };
  
  Plotly.newPlot('plot', data, layout);
})

//####################################################################333
//Dynamic..?

function init() {
  var data = [{
    values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])],
    labels: ['Cyclist', 'Motorist', 'Pedestrian'],
    type: 'pie'
  }];
​
  var layout = {
    height: 600,
    width: 800
  };
​
  Plotly.plot("plot", data, layout);
}
// can use let in this function.
function updatePlotly(values, labels) {
  // Will plot into the div ID Pie
  let PLOT = document.getElementById("pie");
​
  // change the data for the plot
  Plotly.restyle(PLOT, "values", [values]);
  Plotly.restyle(PLOT, "labels", [labels]);
​
  // Use `Plotly.restyle` to update the pie chart with the newdata array
}
​
function getData(dataset) {
  let values = [];
  let labels = [];
  console.log("Dropdown Selector");
​
  switch (dataset) {
    case "music":
      values = [19, 26, 55, 88];
      labels = ["Spotify", "Soundcloud", "Pandora", "Itunes"];
      break;
    case "pie":
      values = [6, 3, 8, 7];
      labels = ["Apple", "Cherry", "Pecan", "Peach"];
      break;
    case "tv":
      values = [6, 11, 2, 12];
      labels = ["Friends", "Office", "Survivor", "My Little Pony"];
      break;
    default:
      values = [19, 26, 55, 88];
      labels = ["Spotify", "Soundcloud", "Pandora", "Itunes"];
      break;
  }

