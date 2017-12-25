const AbstractChart = require('./abstractchart');

class BarGraphDataSetDecorator extends AbstractChart {
  constructor(parent, newDataArr, labelText) {
    super();
    this.parent = parent; // Original chart to be decorated
    this.newDataArr = newDataArr;
    this.labelText = labelText;
  }

  getData() {
    const data = this.parent.getData(); // Mutating parent data in the get, perform deep copy
    const newData = {
      label: this.labelText,
      data: this.newDataArr,
      fill: false,
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'],
      borderColor:
      ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
      borderWidth: 1,
    };

    data.datasets.push(newData);
    return data;
  }
}
module.exports = BarGraphDataSetDecorator;
