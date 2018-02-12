const expect = require('chai').expect;
const PerformanceLineChart = require('../charts/performancelinechart');
const LineChartDatasetDecorator = require('../charts/decorators/linechartdatasetdecorator');
/* global it describe */

describe('Performance Line Chart', () => {
  describe('Get Data [10, 10, 10, 10, 10, 10, 10]', () => {
    it('Data => [10, 10, 10, 10, 10, 10, 10]', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets[0].data).to.eql([10, 10, 10, 10, 10, 10, 10]);
    });
    it('Background color => rgb(255, 99, 132)', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets[0].backgroundColor).to.equal('rgb(255, 99, 132)');
    });
    it('Border color => rgb(255, 99, 132)', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets[0].borderColor).to.equal('rgb(158,158,158)');
    });
    it('Label text => ProvidedLabel', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], 'ProvidedLabel').getData().datasets[0].label).to.equal('ProvidedLabel');
    });
    it('Dataset count => 1', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets.length).to.equal(1);
    });
  });
  describe('Get Options [10, 10, 10, 10, 10, 10, 10]', () => {
    it('Display title => true', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getOptions().title.display).to.eql(true);
    });
    it('Begins at zero => true', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getOptions().scales.yAxes[0].ticks.beginAtZero).to.eql(true);
    });
  });

  // Large dataset labels should minimize on x-axis
  describe('Get Labels Minimized [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]', () => {
    it('Data => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]', () => {
      expect(new PerformanceLineChart([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], '').getData().labels).to.eql(['', '', '2', '', '', '5', '', '', '8', '', '', '11', '', '', '14', '', '']);
    });
  });

  describe('Get Options [10, 10, 10, 10, 10, 10, 10]', () => {
    it('Display title => true', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getOptions().title.display).to.eql(true);
    });
    it('Begins at zero => true', () => {
      expect(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], '').getOptions().scales.yAxes[0].ticks.beginAtZero).to.eql(true);
    });
  });

  // Additional dataset through decorators
  describe('Get Data [[10, 10, 10, 10, 10, 10, 10], [1, 2, 3, 4, 5, 6, 7]]', () => {
    it('First Dataset => [10, 10, 10, 10, 10, 10, 10]', () => {
      expect(new LineChartDatasetDecorator(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[0].data).to.eql([10, 10, 10, 10, 10, 10, 10]);
    });
    it('Second Dataset => [1, 2, 3, 4, 5, 6, 7]', () => {
      expect(new LineChartDatasetDecorator(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[1].data).to.eql([1, 2, 3, 4, 5, 6, 7]);
    });
    it('Label text => ProvidedLabel', () => {
      expect(new LineChartDatasetDecorator(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], 'ProvidedLabel'), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[0].label).to.equal('ProvidedLabel');
    });
    it('Dataset count => 2', () => {
      expect(new LineChartDatasetDecorator(new PerformanceLineChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets.length).to.equal(2);
    });
  });
});
