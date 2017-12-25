const AbstractChart = require('./abstractchart');

class AggregateBarChart extends AbstractChart {
  constructor(dataArr, labelText) {
    super(dataArr);
    this.data = {
      labels: ['0-10km/h', '10km/h-20km/h', '20km/h-30m/h', '30km/h-40km/h', '40km/h-50km/h', '50km/h-60km/h', '60km/h+'],
      datasets:
        [{ label: labelText,
          data: dataArr,
          fill: false,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'],
          borderColor:
          ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
          borderWidth: 1 }],
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

module.exports = AggregateBarChart;
