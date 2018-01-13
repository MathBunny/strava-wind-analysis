const AbstractChart = require('../abstractchart');
const ChartUtils = require('../chartutils');

class ScatterPlotDatasetDecorator extends AbstractChart {
  constructor(parent, newDataArr, labelText, clusterID) {
    super();
    this.parent = parent; // Original chart to be decorated
    this.newDataArr = newDataArr;
    this.clusterID = clusterID;
    this.labelText = labelText;
  }

  getData() {
    const data = this.parent.getData(); // Mutating parent data in the get, perform deep copy
    const borderColoring = ChartUtils.getColor(this.clusterID);
    const newData = {
      label: this.labelText,
      fill: false,
      showLine: false,
      data: this.newDataArr,
      backgroundColor: ChartUtils.getOpaque(borderColoring),
      radius: 4,
      borderColor: borderColoring,
      elements: {
        line: {
          backgroundColor: 'rgba(0, 0, 0 ,0)',
          borderWidth: 0,
          borderColor: 'rgba(0, 0, 0, 0)',
          fill: false,
        },
      },
    };

    data.datasets.push(newData);
    return data;
  }
}
module.exports = ScatterPlotDatasetDecorator;
