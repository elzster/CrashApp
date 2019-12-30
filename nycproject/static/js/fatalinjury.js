// var nycData = d3.json(`/datafile1/`);

// var nycData2 = `/summary/queens/`

var nycData2 = d3.json(`/summary/queens/`)
var debugVar = ""

//#################BAR Graph################

nycData2.then( data =>{

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

  var layout = {barmode: 'group'};

Plotly.newPlot('plot', data, layout);
});