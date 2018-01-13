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

  static getRidesClustering(performanceData, numClusters) {
    return new Promise((resolve) => {
      const tupleArr = [];
      performanceData.forEach((activity) => {
        tupleArr.append(`${activity.speed},${activity.distance}`);
      });
      const str = `${tupleArr.join(',')}&${numClusters}`;

      requestify.get(`${config.mlEndpoint}/get/kmeans-rides-clustering/${str}`).then((result) => {
        const clusteringData = result.body.split('|');
        resolve(clusteringData);
      }).fail(err => console.log(err));
    });
  }
}

module.exports = MLDataHandler;
