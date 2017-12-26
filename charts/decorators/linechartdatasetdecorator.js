const AbstractChart = require('../abstractchart');
const LineChartUtils = require('../linechartutils');

class LineChartDatasetDecorator extends AbstractChart {
  constructor(parent, newDataArr, labelText, hasPoints) {
    super();
    this.parent = parent; // Original chart to be decorated
    this.newDataArr = newDataArr;
    this.hasPoints = hasPoints;
    this.labelText = labelText;
  }

  getData() {
    const data = this.parent.getData(); // Mutating parent data in the get, perform deep copy
    const borderColoring = LineChartUtils.getColor(data.datasets.length + 1);
    const newData = {
      type: 'line',
      label: this.labelText,
      data: this.newDataArr,
      fill: false,
      backgroundColor: [borderColoring],
      borderColor: borderColoring,
      borderWidth: 1,
      lineTension: 0.2,
    };

    if (this.hasPoints === false) {
      newData.pointRadius = 0;
    }

    data.datasets.push(newData);
    return data;
  }
}
module.exports = LineChartDatasetDecorator;
