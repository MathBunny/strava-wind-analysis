const expect = require('chai').expect;
const ScatterPlotChart = require('../charts/scatterplotchart');
const ScatterPlotDatasetDecorator = require('../charts/decorators/scatterplotdatasetdecorator');
/* global it describe */

describe('Scatter Plot Chart', () => {
  describe('Get Data [10, 10, 10]', () => {
    it('Data => [10, 10, 10]', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].data).to.eql([10, 10, 10]);
    });
    it('Background color => rgba(33,150,243, 0.2)', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].backgroundColor).to.equal('rgba(33,150,243, 0.2)');
    });
    it('Border color => rgb(33,150,243)', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].borderColor).to.equal('rgb(33,150,243)');
    });
    it('Line background => rgba(0, 0, 0 ,0)', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].elements.line.backgroundColor).to.equal('rgba(0, 0, 0 ,0)');
    });
    it('Line border width => 0', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].elements.line.borderWidth).to.equal(0);
    });
    it('Line fill => false', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].elements.line.fill).to.equal(false);
    });
    it('Radius => 4', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].radius).to.equal(4);
    });
    it('Show line => false', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets[0].showLine).to.equal(false);
    });
    it('Label text => ProvidedLabel', () => {
      expect(new ScatterPlotChart([10, 10, 10], 'ProvidedLabel').getData().datasets[0].label).to.equal('ProvidedLabel');
    });
    it('Dataset count => 1', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getData().datasets.length).to.equal(1);
    });
  });
  describe('Get Options [10, 10, 10]', () => {
    it('Title => Aggregate Distance/Speed Scatter Plot', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getOptions().title.text).to.eql('Aggregate Distance/Speed Scatter Plot');
    });
    it('Display title => true', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getOptions().title.display).to.eql(true);
    });
    it('Begins at zero => true', () => {
      expect(new ScatterPlotChart([10, 10, 10], '').getOptions().scales.yAxes[0].ticks.beginAtZero).to.eql(true);
    });
  });

  // Additional dataset through decorators
  describe('Get Data [[10, 10, 10], [1, 2, 3]]', () => {
    it('First Dataset => [10, 10, 10]', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].data).to.eql([10, 10, 10]);
    });
    it('Second Dataset => [1, 2, 3]', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[1].data).to.eql([1, 2, 3]);
    });
    it('Background color => rgba(33,150,243, 0.2)', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].backgroundColor).to.equal('rgba(33,150,243, 0.2)');
    });
    it('Border color => rgb(33,150,243)', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].borderColor).to.equal('rgb(33,150,243)');
    });
    it('Line background => rgba(0, 0, 0 ,0)', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].elements.line.backgroundColor).to.equal('rgba(0, 0, 0 ,0)');
    });
    it('Line border width => 0', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].elements.line.borderWidth).to.equal(0);
    });
    it('Line fill => false', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].elements.line.fill).to.equal(false);
    });
    it('Radius => 4', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].radius).to.equal(4);
    });
    it('Show line => false', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets[0].showLine).to.equal(false);
    });
    it('Label text => ProvidedLabel', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], 'ProvidedLabel'), [1, 2, 3], 'ProvidedLabel', 0).getData().datasets[0].label).to.equal('ProvidedLabel');
    });
    it('Dataset count => 2', () => {
      expect(new ScatterPlotDatasetDecorator(new ScatterPlotChart([10, 10, 10], ''), [1, 2, 3], 'Text', 0).getData().datasets.length).to.equal(2);
    });
  });
});
