function init(city){

  //Lists of summary routes
  // var nycQueens = `/summary/queens`;
  // var nycBrooklyn = `/summary/brooklyn`;
  // var nycManhatttan = `/summary/manhattan`;
  // var nycStatenIsland = `/summary/statenisland`;
  // var nycBronx = `/summary/bronx`;
  
      // ##############Working Pie Graph##################
  var plotData = `/summary/${city}`;
  d3.json(plotData).then(nyc => {
  
    var data = [{
      values: [(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])],
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
  function updatePlotly(values, labels) {
    var LINE = document.getElementById("plot");
  
    // Note the extra brackets around 'newx' and 'newy'
    Plotly.restyle(LINE, "x", [values]);
    Plotly.restyle(LINE, "y", [labels]);
  }


  function getData(dataset) {
    var nycQueens = `/summary/queens`;
    var nycBrooklyn = `/summary/brooklyn`;
    var nycManhatttan = `/summary/manhattan`;
    var nycStatenIsland = `/summary/statenisland`;
    var nycBronx = `/summary/bronx`;
    // Initialize empty arrays to contain our axes
    var values = [];
    var labels = [];
  
    //This Will Populate different instances in drop down.
    // Fill the x and y arrays as a function of the selected dataset
    switch (dataset) {
    case "Queens":
      d3.json(nycQueens).then(nyc => {
      values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])];
      labels: ['Cyclist', 'Motorist', 'Pedestrian'];});
      break;
    case "Brooklyn":
      d3.json(nycBrooklyn).then(nyc => {
      values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])];
      labels: ['Cyclist', 'Motorist', 'Pedestrian'];});
      break;
    // case "Bronx":
    //   d3.json(nycBronx).then(nyc => {
    //   values = [10, 20, 30, 40, 50];
    //   labels = [10, 100, 50, 10, 0];});
    //   break;
    default:
      d3.json(nycManhatttan).then(nyc => {
        var nycvalues = [nyc.cyclist.killed[0],nyc.motorist.killed[0],nyc.pedestrian.killed[0]];
      values: nycvalues;});
      labels: ['Cyclist', 'Motorist', 'Pedestrian'];
      break;
    }
    //updates plotly plot.
    updatePlotly(values, labels);
  }
  
  init();