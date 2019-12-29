// var nycData = d3.json(`/datafile1/`);

// var nycData2 = `/summary/queens/`

var nycData2 = d3.json(`/summary/queens/`)

const topten = d3.json(`/topten/`)



//#################BAR Graph################

topten.then( data =>{
  //more of just the vanilla json call.
  console.log(data)
  //more direct path?
  console.log(data[0].top_ten[0][0])
  // data.forEach( d=> {
  //   console.log(d.top_ten)
  // });
// });
  
  // var debugVar = data;
  var listCount = []
  var listRoads = []

  for (var i = 0; i< data[0].top_ten.length; i++){
    console.log(data[0].top_ten.length);
    listCount.push(data[0].top_ten[i][0]);
  }
  // return listCount;
  console.log(listCount);

  for (var i = 0; i< data[0].top_ten.length; i++){
    console.log(data[0].top_ten.length);
    listRoads.push(data[0].top_ten[i][1]);
  }
  console.log(listRoads);
  // for (var i = 0; i < d; i++) {
  //  something.push()
  // }
  // return somethingElse


  // let cyclistInjured = parseInt(data[0].cyclist.injured);
  // let motoristInjured = parseInt(data[0].motorist.injured);
  // let pedestrianInjured = parseInt(data[0].pedestrian.injured);
  // let cyclistKilled = parseInt(data[0].cyclist.killed);
  // let motoristKilled = parseInt(data[0].motorist.killed);
  // let pedestrianKilled = parseInt(data[0].pedestrian.killed);

  let injured = {
    x: listRoads,
    y: listCount,
    name: 'Top 10 RoadWays',
    type: 'bar',
    orientation: 'v'
  };


  // let killed = {
  //   x: ['Cyclist', 'Motorist', 'Pedestrian'],
  //   y: [cyclistKilled, motoristKilled, pedestrianKilled],
  //   name: 'Killed Stats',
  //   type: 'bar'
  // };

  var data = [injured];

  // var layout = {barmode: 'group'};

Plotly.newPlot('plot', data);

});