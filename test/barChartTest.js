const expect = require('chai').expect;
const AggregateBarChart = require('../charts/aggregatebarchart');
const BarGraphDataSetDecorator = require('../charts/decorators/bargraphdatasetdecorator');
/* global it describe */

describe('Aggregate Bar Graph', () => {
  describe('Get Data [10, 10, 10, 10, 10, 10, 10]', () => {
    it('Data => [10, 10, 10, 10, 10, 10, 10]', () => {
      expect(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets[0].data).to.eql([10, 10, 10, 10, 10, 10, 10]);
    });
    it('Background color => rgba(33,150,243, 0.2)', () => {
      expect(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets[0].backgroundColor).to.eql(['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)']);
    });
    it('Border color => rgb(33,150,243)', () => {
      expect(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets[0].borderColor).to.eql(['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)']);
    });
    it('Label text => ProvidedLabel', () => {
      expect(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], 'ProvidedLabel').getData().datasets[0].label).to.equal('ProvidedLabel');
    });
    it('Dataset count => 1', () => {
      expect(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], '').getData().datasets.length).to.equal(1);
    });
  });
  describe('Get Options [10, 10, 10, 10, 10, 10, 10]', () => {
    it('Display title => true', () => {
      expect(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], '').getOptions().title.display).to.eql(true);
    });
    it('Begins at zero => true', () => {
      expect(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], '').getOptions().scales.yAxes[0].ticks.beginAtZero).to.eql(true);
    });
  });

  // Additional dataset through decorators
  describe('Get Data [[10, 10, 10, 10, 10, 10, 10], [1, 2, 3, 4, 5, 6, 7]]', () => {
    it('First Dataset => [10, 10, 10, 10, 10, 10, 10]', () => {
      expect(new BarGraphDataSetDecorator(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[0].data).to.eql([10, 10, 10, 10, 10, 10, 10]);
    });
    it('Second Dataset => [1, 2, 3, 4, 5, 6, 7]', () => {
      expect(new BarGraphDataSetDecorator(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[1].data).to.eql([1, 2, 3, 4, 5, 6, 7]);
    });
    it('Background color => rgba(33,150,243, 0.2)', () => {
      expect(new BarGraphDataSetDecorator(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[0].backgroundColor).to.eql(['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)']);
    });
    it('Border color => rgb(33,150,243)', () => {
      expect(new BarGraphDataSetDecorator(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[0].borderColor).to.eql(['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)']);
    });
    it('Label text => ProvidedLabel', () => {
      expect(new BarGraphDataSetDecorator(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], 'ProvidedLabel'), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets[0].label).to.equal('ProvidedLabel');
    });
    it('Dataset count => 1', () => {
      expect(new BarGraphDataSetDecorator(new AggregateBarChart([10, 10, 10, 10, 10, 10, 10], ''), [1, 2, 3, 4, 5, 6, 7], 'Test').getData().datasets.length).to.equal(2);
    });
  });
});
