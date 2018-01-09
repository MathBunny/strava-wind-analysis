const AggregateBarChart = require('./aggregatebarchart');
const PerformanceLineChart = require('./performancelinechart');
const RadarWindChart = require('./radarwindchart');
const ScatterPlotChart = require('./scatterplotchart');

class ChartFactory {
  static getChart(type, data, labelText, multi) {
    if (type === 'aggregatebarchart') {
      return new AggregateBarChart(data, labelText);
    } else if (type === 'performancelinechart') {
      return new PerformanceLineChart(data, labelText, multi);
    } else if (type === 'radarwindchart') {
      return new RadarWindChart(data, labelText);
    } else if (type === 'scatterplotchart') {
      return new ScatterPlotChart(data, labelText);
    }
    const err = { error: 'Unknown chart type' };
    throw err;
  }
}

module.exports = ChartFactory;
