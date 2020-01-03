//###########ROUTES###################
//####################################
// var nycData = d3.json(`/datafile1/`);
// var nycData2 = `/summary/queens/`
// var nycData2 = d3.json(`/summary/queens/`)
const topten = d3.json(`/topten/`)

//##########################################
//#################BAR Graph################
//##########################################
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

  let injured = {
    x: listRoads,
    y: listCount,
    name: listRoads,
    type: 'bar',
    orientation: 'v'
  };


  var data = [injured]
  

  var layout = {
    height: 500,
    width: 500,
    title: 'Most Dangerous Roadways',
    xaxis:{
      tickangle: -45
    }
  };

Plotly.newPlot('topten', data, layout);

});