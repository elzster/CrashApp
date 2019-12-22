var nycData = `/datafile/`;

// d3.json(nycData).then((data)=>{
//   let crashData = d3.select(`#barGraph`);
// // Use `.html("") to clear any existing metadata
//   sampleData.html("");
// // Use `Object.entries` to add each key and value pair to the panel
// // Hint: Inside the loop, you will need to use d3 to append new
// // tags for each key-value in the metadata.
//   Object.entries(sample).forEach(([key,value]) => {
//     let row = sampleData.append("p");
//     row.text(`${key}:${value}`)
//   })
// });


//Functions to Translate all JSON dates into usable dates.
// var MyDate_String_Value = "/Date(1414972800000)/"
// var value = new Date
//             (
//                  parseInt(MyDate_String_Value.replace(/(^.*\()|([+-].*$)/g, ''))
//             );
// var dat = value.getMonth() + 
//                          1 + 
//                        "/" + 
//            value.getDate() + 
//                        "/" + 
//        value.getFullYear();
// alert(dat);


//console log of all data within JSon Object to use.
d3.json(nycData).then( data =>{
  //to parse the numeric data from string
  console.log(data[0]);
  //latitude longitude
  console.log(parseFloat(data[0].latitude));
  console.log(parseFloat(data[0].longitude));
  //to parse data from record
  console.log((data[0].borough));

  //parses date line into usable date.
  console.log(((data[0].crash_date)));
  console.log((data[0].crash_time));

  //street name variable
  console.log(data[0].on_street_name);

  //contributing factor
  console.log(data[0].contributing_factor_vehicle_1);

  //#of persons injured and killed
  console.log(data[0].number_of_persons_injured);
  console.log(data[0].number_of_persons_killed);
});
