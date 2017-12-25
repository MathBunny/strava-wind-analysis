
class AbstractChart {
  constructor() {
    this.data = {
      labels: [],
      datasets: [],
    };
    this.options = {};
  }

  getData() {
    return this.data;
  }

  getOptions() {
    return this.options;
  }
}

module.exports = AbstractChart;
