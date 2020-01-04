// var nycData = d3.json(`/datafile1/`);

// var nycData2 = `/summary/queens/`

//Basic Trace to Show the Totals of Accidents, injuries, and fatalities.
var trace1 = {
  x: ['Manhattan', 'Queens', 'Bronx', 'Brooklyn', 'Staten Island'],
  y: [488, 988, 520,1072,163],
  name: 'Total Accidents',
  type: 'bar'
};

var trace2 = {
  x: ['Manhattan', 'Queens', 'Bronx', 'Brooklyn', 'Staten Island'],
  y: [561, 1330, 722, 1420, 249],
  name: 'Total Injured',
  type: 'bar'
};

var trace3 = {
  x: ['Manhattan', 'Queens', 'Bronx', 'Brooklyn', 'Staten Island'],
  y: [3, 6, 2, 2, 1],
  name: 'Total Fatalities',
  type: 'bar'
};

var data = [trace1, trace2, trace3];

var layout = {
  barmode: 'group',
  title: 'Borough Totals'
};

Plotly.newPlot('totals', data, layout);