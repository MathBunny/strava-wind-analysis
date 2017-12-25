const AbstractChart = require('./abstractchart');

class PerformanceLineChart extends AbstractChart {
  constructor(dataArr, label) {
    super(dataArr);
    const labels = [];
    if (dataArr.length > 10) {
      let count = 0; // Labels along x-axis
      for (let x = 0; x < dataArr.length; x += 1) {
        if (count >= dataArr.length / 11) {
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
          backgroundColor: ['rgb(75, 192, 192)'],
          borderColor:
          ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
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