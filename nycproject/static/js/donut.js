//Works when inputting.

const nycQueens = d3.json(`/summary/queens`);
const nycBrooklyn = d3.json(`/summary/brooklyn`);
const nycManhatttan = d3.json(`/summary/manhattan`);
const nycStatenIsland = d3.json(`/summary/statenisland`);
const nycBronx = d3.json(`/summary/bronx`);

// ##############Working Pie Graph##################
// nycQueens.then(nyc => {
//   console.log(nyc[0].borough);
// });

//Works when inputting.
function plotGraph() {
  // ##############Working Pie Graph##################
  nycBronx.then(nyc => {
    var cyclistInjured = parseInt(nyc[0].cyclist.injured[0]);
    var motoristInjured = parseInt(nyc[0].motorist.injured[0]);
    var pedestrianInjured = parseInt(nyc[0].pedestrian.injured[0]);
    var cyclistKilled = parseInt(nyc[0].cyclist.killed[0]);
    var motoristKilled = parseInt(nyc[0].motorist.killed[0]);
    var pedestrianKilled = parseInt(nyc[0].pedestrian.killed[0]);

    console.log(pedestrianKilled, motoristKilled, cyclistKilled);

    var data = [{
      values: [cyclistInjured, motoristInjured, pedestrianInjured],
      labels: ['Cyclist', 'Motorist', 'Pedestrian'],
      domain: { row: 0 , column: 0 },
      name: "Injured",
      hole: .5,
      hoverinfo: 'label+value',
      type: 'pie'
    }, {
      values: [cyclistKilled, motoristKilled, pedestrianKilled],
      labels: ['Cyclist', 'Motorist', 'Pedestrian'],
      domain: { row: 0 , column: 1 },
      name: "Killed",
      hole: .4,
      hoverinfo: "label+value",
      type: 'pie'
    }];

    var layout = {
      title: "Borough Statistics of Motorists Injured vs Killed",
      annotations: [
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: "Injured",
          x: 0.17,
          y: 0.45
          },
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: 'Killed',
          x: 0.82,
          y: 0.45
        }
      ],
      height: 600,
      width: 600,
      showlegend: true,
      grid: { rows: 2, columns: 2 }
    };

    Plotly.newPlot('plot', data, layout);

  });
}
plotGraph();
