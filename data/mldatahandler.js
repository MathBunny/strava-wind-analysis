const requestify = require('requestify');
const config = require('../config');

class MLDataHandler {
  static getLinearRegression(performanceData) {
    return new Promise((resolve) => {
      const str = performanceData.join('|');
      requestify.get(`${config.mlEndpoint}/get/linear-regression/${str}`).then((result) => {
        const regression = result.body.split('|');
        resolve(regression);
      }).fail(err => console.log(err));
    });
  }
}

module.exports = MLDataHandler;
