const AbstractChart = require('./abstractchart');

class PerformanceLineChart extends AbstractChart {
  constructor(dataArr, label, multi) {
    super(dataArr);
    const labels = [];
    if (dataArr.length > 15) {
      let count = 0; // Labels along x-axis
      for (let x = 0; x < dataArr.length; x += 1) {
        if (count >= dataArr.length / 16) {
          labels.push(`${x}`);
          count = 0;
        } else {
          labels.push('');
          count += 1;
        }
      }
    } else {
      for (let x = 0; x < dataArr.length; x += 1) {
        labels.push(x);
      }
    }

    this.data = {
      labels: labels, // eslint-disable-line
      datasets:
        [{ type: 'line',
          label: label, // eslint-disable-line
          data: dataArr,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(158,158,158)',
          borderWidth: 1,
          lineTension: 0.2 }],
    };

    this.options = {
      title: {
        display: true,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: value => `${value} + 'km/h`,
          },
        }],
      },
    };
  }
}

module.exports = PerformanceLineChart;
