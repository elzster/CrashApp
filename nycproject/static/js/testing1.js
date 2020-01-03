//###########ROUTES###################
//####################################
// var nycData = d3.json(`/datafile1/`);
// var nycData2 = `/summary/queens/`
// var nycData2 = d3.json(`/summary/queens/`)
const boroughs_data = d3.json(`/totals_boroughs/`)

//##########################################
//#################BAR Graph################
//##########################################
boroughs_data.then( data =>{
  //more of just the vanilla json call.
  console.log(data)
  //more direct path?
  console.log(data[0].borough_totals[0][0])
  // data.forEach( d=> {
  //   console.log(d.top_ten)
  // });
// });
  
  // var debugVar = data;
  var borough_counts = []
  var borough_names = []

  for (var i = 0; i< data[0].borough_totals.length; i++){
    console.log(data[0].borough_totals.length);
    borough_counts.push(data[0].borough_totals[i][0]);
  }
  // return listCount;
  console.log(borough_counts);

  for (var i = 0; i< data[0].borough_totals.length; i++){
    console.log(data[0].borough_totals.length);
    borough_names.push(data[0].borough_totals[i][1]);
  }
  console.log(borough_names);

  let boroughs = {
    x: borough_names,
    y: borough_counts,
    name: borough_names,
    type: 'bar',
    orientation: 'v'
  };


  var data = [boroughs]
  

  var layout = {
    height: 400,
    width: 400,
    title: 'Total Accidents By Borough',
    xaxis:{
      tickangle: -45
    }
  };

Plotly.newPlot('totals_boroughs', data, layout);

});