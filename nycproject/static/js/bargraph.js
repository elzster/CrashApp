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
d3.json(nycData).then( data =>{
  console.log(data);
});