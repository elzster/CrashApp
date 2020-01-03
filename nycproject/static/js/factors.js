//###########ROUTES###################
//####################################


// var nycData = d3.json(`/datafile1/`);
// var nycData2 = `/summary/queens/`
var nycData2 = d3.json(`/summary/queens/`)
const factors = d3.json(`/factors/`)

//##########################################
//#################BAR Graph################
//##########################################
factors.then( data =>{
  //more of just the vanilla json call.
  console.log(data)
  //more direct path?
  console.log(data[0].factors[0][0])
  // data.forEach( d=> {
  //   console.log(d.top_ten)
  // });
// });
  
  // var debugVar = data;
  var listCount = []
  var listFactor = []

  for (var i = 0; i< data[0].factors.length; i++){
    console.log(data[0].factors.length);
    listCount.push(data[0].factors[i][0]);
  }
  // return listCount;
  console.log(listCount);

  for (var i = 0; i< data[0].factors.length; i++){
    console.log(data[0].factors.length);
    listFactor.push(data[0].factors[i][1]);
  }
  console.log(listFactor);

  let contributing = {
    x: listFactor,
    y: listCount,

    name: listFactor,
    type: 'bar',
    orientation: 'v'
  };


  var data = [contributing];

  var layout = {
    height: 500,
    width: 500,
    title: 'Top Contributing Factors',
    xaxis:{
      tickangle:-45
    }
  };

Plotly.newPlot('plotfactor', data, layout);

});