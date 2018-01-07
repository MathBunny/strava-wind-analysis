const AggregateBarChart = require('./aggregatebarchart');
const PerformanceLineChart = require('./performancelinechart');
const WindSpeedRadarChart = require('./windspeedradarchart');
const RadarWindChart = require('./radarwindchart');

class ChartFactory {
  static getChart(type, data, labelText, multi) {
    if (type === 'aggregatebarchart') {
      return new AggregateBarChart(data, labelText);
    } else if (type === 'performancelinechart') {
      return new PerformanceLineChart(data, labelText, multi);
    } else if (type === 'windspeedradarchart') {
      return new WindSpeedRadarChart(data, labelText);
    } else if (type === 'radarwindchart') {
      return new RadarWindChart(data, labelText);
    }
    const err = { error: 'Unknown chart type' };
    throw err;
  }
}

module.exports = ChartFactory;
