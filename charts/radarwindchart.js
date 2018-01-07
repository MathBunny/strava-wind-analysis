const AbstractChart = require('./abstractchart');

class RadarWindChart extends AbstractChart {
  constructor(dataArr, labelText) {
    super(dataArr);
    this.data = {
      labels: ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'],
      datasets:
        [{ type: 'radar',
          label: labelText,
          data: dataArr,
          fill: true,
          backgroundColor: 'rgba(54,162,235,0.2)',
          borderColor: 'rgb(33,150,243)',
          borderWidth: 3,
          lineTension: 0.2 }],
    };

    this.options = {
      title: {
        display: true,
      },
      scales: {
        ticks: {
          beginAtZero: true,
          callback: value => `${value} + 'km/h`,
        },
      },
    };
  }
}

module.exports = RadarWindChart;
