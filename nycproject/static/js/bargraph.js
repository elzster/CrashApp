var nycData = `/datafile1/`;

// var nycData2 = `/summary/queens/`

var nycData2 = `/summary/queens`

// fetch(nycData2).then(d => {
//   d.borough
//   console.log(d.borough);
// });

//#############Example from Anthony with Using Reduce#############
// test.reduce( (acc, d, index) => { 
//   // initialize borough
//   acc[d["borough"]] = typeof acc[d["borough"]] == "undefined" ? {} : acc[d["borough"]];
//   // initialize or increment street count
//   acc[d["borough"]][d["street"]] = typeof acc[d["borough"]][d["street"]] == "undefined" ? 1 : acc[d["borough"]][d["street"]] + 1;
//   return acc;
// }, {})

//#################Testing Different Filters
// //Load Data from Database on Server
// d3.json(nycData).then(crashData => {
//   // console.log(crashData);

//##############################filters   
//list of borough names
//       // var borough = crashData.map(data => data.borough);
//       // console.log("Borough Array", borough);
      
//       // let unique = [...new Set(filteredData.map(item => item.borough))];
//       // console.log(unique);
//       //Returns the counts of Accidents by Borough.
//       // var countOfBorough = crashData.filter(d => {
//       //     return d.borough === "Queens"
//       // }).length;
//       // console.log("Queens has", countOfBorough, "Accidents");
//   });
//   ;
//reduce 
//array.reduce(function(total, currentValue, currentIndex, arr), initialValue)

//filters list to queens


//Testing Table to HTML
// d3.json(nycData).then((data => {

//   let unique = [...new Set(data.map(item => item.borough))];
  
//   console.log(unique);
//   console.log(unique.length + " of Unique Boroughs in Dataset")  
//   var filteredData = data.filter(d => d.borough === "Brooklyn");
//   console.log(filteredData.length + " Crashes in "+ filteredData[0].borough);

//   var filteredData2 = data.filter(d => d.borough === "Queens");
//   console.log(filteredData2.length + " Crashes in "+ filteredData2[0].borough);

//   var filteredData3 = data.filter(d => d.borough === "Manhattan");
//   console.log(filteredData3.length + " Crashes in "+ filteredData3[0].borough);

//   var filteredData4 = data.filter(d => d.borough === "Bronx");
//   console.log(filteredData4.length + " Crashes in "+ filteredData4[0].borough);

//   var filteredData5 = data.filter(d => d.borough === "Staten Island");
//   console.log(filteredData5.length + " Crashes in "+ filteredData5[0].borough);

//     //finds unique values in dataSet using map
//   let unique1 = [...new Set(filteredData.map(item => item.on_street_name))];
//   console.log(unique1.length + " Number of Different Streets in " + filteredData[0].borough);
// }));

//#################BAR Graph################

d3.json(nycData).then( data =>{

  var filteredData = data.filter(d => d.borough === "Brooklyn" || "Staten Island" || "Queens" || "Manhattan" || "Bronx");
  
  var data2 = parseInt(d3.json(nycData2).then( data=> data.borough_crashes))

  var trace1 = {
    //good, Maps Borough on X Axis
    x: xVar = filteredData.map(d => d.borough),

    y: parseInt((filteredData.map(d => d.id)).length), 
    
    text: (xVar),

    name: "Boroughs",
    type: "bar",
    orientation: "v"
    
  };

  // set up the data variable
  var data = [trace1]
  // set up the layout variable
  var layout = {
    title: "Accidents by Borough",
  }

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot('plot', data, layout);
});

