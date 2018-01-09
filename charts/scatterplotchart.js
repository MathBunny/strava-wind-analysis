const AbstractChart = require('./abstractchart');

class ScatterPlotChart extends AbstractChart {
  constructor(dataArr, labelText) {
    super(dataArr);
    this.data = {
      datasets:
        [{ label: labelText,
          fill: false,
          showLine: false,
          data: dataArr,
          backgroundColor: 'rgba(33,150,243, 0.2)',
          borderColor: 'rgb(33,150,243)',
          elements: {
            line: {
              backgroundColor: 'rgba(0, 0, 0 ,0)',
              borderWidth: 0,
              borderColor: 'rgba(0, 0, 0, 0)',
              fill: false,
            },
          },
        }],
    };

    this.options = {
      title: {
        text: 'Aggregate Distance/Speed Scatter Plot',
        display: true,
      },
    };
  }
}

module.exports = ScatterPlotChart;
