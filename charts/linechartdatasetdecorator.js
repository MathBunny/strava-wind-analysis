const AbstractChart = require('./abstractchart');

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
    const newData = {
      type: 'line',
      label: this.labelText,
      data: this.newDataArr,
      fill: false,
      backgroundColor: ['rgb(255, 87, 34)'],
      borderColor: 'rgb(239,83,80)',
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
