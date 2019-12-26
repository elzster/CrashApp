//Works when inputting.
var nycQueens = `/summary/queens`;
var nycBrooklyn = `/summary/brooklyn`;
var nycManhatttan = `/summary/manhattan`;
var nycStatenIsland = `/summary/statenisland`;
var nycBronx = `/summary/bronx`;
var nycOthers = `/summary/null`;
d3.json(nycQueens).then(blah => {
        console.log(blah.cyclist.injured[0]);
    })
    //##############Working Pie Graph##################
    // d3.json(nycQueens).then(nyc => {

//   var data = [{
//     values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])],
//     labels: ['Cyclist', 'Motorist', 'Pedestrian'],
//     type: 'pie'
//   }];

//   var layout = {
//     height: 400,
//     width: 500
//   };

//   Plotly.newPlot('plot', data, layout);
// })

//####################################################################333
//Dynamic..?
d3.json(nycQueens).then(nyc => {
    function init() {
            var data = [{
                values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])],
                labels: ['Cyclist', 'Motorist', 'Pedestrian'],
                type: 'pie'
            }];

            var layout = {
                height: 600,
                width: 800
            };

            Plotly.plot("plot", data, layout);
        }
        // can use let in this function.
    function updatePlotly(values, labels) {
        // Will plot into the div ID Pie
        let PLOT = document.getElementById("plot");

        // change the data for the plot
        Plotly.restyle(PLOT, "values", [values]);
        Plotly.restyle(PLOT, "labels", [labels]);

        // Use `Plotly.restyle` to update the pie chart with the newdata array
    }


    function getData(dataset) {
        let values = [];
        let labels = [];
        console.log("Dropdown Selector");

        switch (dataset) {
            case "Bronx":
                values: d3.json(nycBronx).then(d => {
                    [parseInt(d.cyclist.injured[0]), parseInt(d.motorist.injured[0]), parseInt(d.pedestrian.injured[0])]
                });
                labels: ['Cyclist', 'Motorist', 'Pedestrian'];
                break;
            case "Manhattan":
                values: d3.json(nycManhatttan).then(d => {
                    [parseInt(d.cyclist.injured[0]), parseInt(d.motorist.injured[0]), parseInt(d.pedestrian.injured[0])]
                });
                labels: ['Cyclist', 'Motorist', 'Pedestrian'];
                break;
            default:
                values: [parseInt(nyc.cyclist.injured[0]), parseInt(nyc.motorist.injured[0]), parseInt(nyc.pedestrian.injured[0])];
                labels: ['Cyclist', 'Motorist', 'Pedestrian'];
                break;
        }
        updatePlotly(values, labels);
    }

    init();
});