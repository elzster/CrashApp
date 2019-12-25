var nycData = `/datafile1/`;
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
d3.json(nycData).then((data => {

  let unique = [...new Set(data.map(item => item.borough))];
  console.log(unique);
  console.log(unique.length + " of Unique Boroughs in Dataset")  
  var filteredData = data.filter(d => d.borough === "Brooklyn");
  console.log(filteredData.length + " Crashes in "+ filteredData[0].borough);

  var filteredData2 = data.filter(d => d.borough === "Queens");
  console.log(filteredData2.length + " Crashes in "+ filteredData2[0].borough);

  var filteredData3 = data.filter(d => d.borough === "Manhattan");
  console.log(filteredData3.length + " Crashes in "+ filteredData3[0].borough);

  var filteredData4 = data.filter(d => d.borough === "Bronx");
  console.log(filteredData4.length + " Crashes in "+ filteredData4[0].borough);

  var filteredData5 = data.filter(d => d.borough === "Staten Island");
  console.log(filteredData5.length + " Crashes in "+ filteredData5[0].borough);

    //finds unique values in dataSet using map
  let unique1 = [...new Set(filteredData.map(item => item.on_street_name))];
  console.log(unique1.length + " Number of Different Streets in " + filteredData[0].borough);
}));
//   // var borough1 ={}
//   // filteredData.reduce()

  // var counts = {};
  // var objects = [filteredData];

  // objects.forEach(function (o) {
  //     // add the type to the hash if it is missing;
  //     // set initial count to 0
  //     if (!counts.hasOwnProperty(o.type)) {
  //         counts[o.type] = 0;
  //     }
  //     // increment the count based on the type
  //     counts[o.type] += 1;


//   console.log(counts);
// }));

//#################BAR Graph################

d3.json(nycData).then( data =>{
  var filteredData = data.filter(d => d.borough === "Brooklyn" || "Staten Island" || "Queens" || "Manhattan" || "Bronx");
  
  // console.log(filteredData);

  var trace1 = {
    //good, Maps Borough on X Axis
    x: data.map(d => d.borough),

    y: data.map(d => d.id), 
    
    text: (data.length),

    name: "Brooklyn",
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



//Taken from Activity 1 Day 2 Week 15 - Fashions DropDown Menus for plotly.

// function init() {
//   data = [{
//     x: [1, 2, 3, 4, 5],
//     y: [0, 0, 0, 0, 0] }];
//   var LINE = document.getElementById("plot");
//   Plotly.plot(LINE, data);
// }

// function updatePlotly(newx, newy) {
//   var LINE = document.getElementById("plot");

//   // Note the extra brackets around 'newx' and 'newy'
//   Plotly.restyle(LINE, "x", [newx]);
//   Plotly.restyle(LINE, "y", [newy]);
// }
// //this will call different dataset switch variables which have different traces.
// function getData(dataset) {

//   // Initialize empty arrays to contain our axes
//   var x = [];
//   var y = [];

//   //This Will Populate different instances in drop down.
//   // Fill the x and y arrays as a function of the selected dataset
//   switch (dataset) {
//   case "dataset1":
//     x = [1, 2, 3, 4, 5];
//     y = [0.1, 0.2, 0.3, 0.4, 0.5];
//     break;
//   case "dataset2":
//     x = [10, 20, 30, 40, 50];
//     y = [1, 10, 100, 1000, 10000];
//     break;
//   case "dataset3":
//     x = [100, 200, 300, 400, 500];
//     y = [10, 100, 50, 10, 0];
//     break;
//   default:
//     x = [1, 2, 3, 4, 5];
//     y = [0, 0, 0, 0, 0];
//     break;
//   }
//   //updates plotly plot.
//   updatePlotly(x, y);
// }

// init();


















//################Table######################
//   d3.select("tbody").selectAll('tr')
//   .data(filteredData)
//   .enter() //because we know theres no elements on the page
//   .append('tr')
//   .html( d => 
//     `<td>${d.date_time}</td><td>${d.borough}</td><td>${d.number_of_motorist_killed}</td><td>${d.number_of_pedestrian_killed}</td>`);
// }));

//alternate way of writing with fat arrow.
// d3.select("tbody").selectAll('tr')
//   .data(nycData)
//   .enter() //because we know theres no elements on the page
//   .append('tr')
//   .html( d => 
//     `<td>${d.date_time}</td><td>${d.borough}</td><td>${d.number_of_motorist_killed}</td><td>${d.number_of_pedestrian_killed}</td>`);

// }).catch(function(error) {
//   console.log(error);
// }));
