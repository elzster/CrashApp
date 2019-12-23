var nycData = `/datafile1/`;

//Load Data from Database on Server
d3.json(nycData).then(crashData => {
  console.log(crashData);

  //list of borough names
      // var borough = crashData.map(data => data.borough);
      // console.log("Borough Array", borough);
      
      // let unique = [...new Set(filteredData.map(item => item.borough))];
      // console.log(unique);
      //Returns the counts of Accidents by Borough.
      // var countOfBorough = crashData.filter(d => {
      //     return d.borough === "Queens"
      // }).length;
      // console.log("Queens has", countOfBorough, "Accidents");
  });
  ;
//reduce 
//array.reduce(function(total, currentValue, currentIndex, arr), initialValue)

//filters list to queens
d3.json(nycData).then((data => {


  let unique = [...new Set(data.map(item => item.borough))];
  console.log(unique);
    
  var filteredData = data.filter(d => d.borough === "Queens");
  console.log(filteredData);

  //finds unique values in dataSet using map
  let unique1 = [...new Set(filteredData.map(item => item.on_street_name))];
  console.log(unique1);
  // var borough1 ={}
  // filteredData.reduce()

}));
// filters list to bronx

// bronxData = dataList.then((crash => {
//   var filteredData = crash.filter(data => data.borough === "Bronx");
//   console.log(filteredData);
// }));

//filters list to brooklyn
// brooklynData = dataList.then((crash => {
//   var filteredData = crash.filter(data => data.borough === "Brooklyn");
//   console.log(filteredData);
// }));