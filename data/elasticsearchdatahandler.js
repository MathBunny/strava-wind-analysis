const requestify = require('requestify');
const redis = require('redis');
const elasticsearch = require('elasticsearch');
const stravadatahandler = require('./stravadatahandler');
const config = require('../config');

const redisclient = redis.createClient();
const esclient = new elasticsearch.Client({
  host: config.elasticsearchendpoint,
  log: 'trace'
});

class ElasticSearchDataHandler {
  static userRefresh(accessToken, athleteID) {
    return new Promise((resolve) => {
      redisclient.get(`/users/${athleteID}/rides/lastvisited`, (err, reply) => {
        // Fetch activity list
        const epoch = (reply === null) ? 0 : reply;
        stravadatahandler.getActivitiesListAfterEpoch(accessToken, epoch).then((activitiesList) => {
          activitiesList.forEach((activity) => {
            esclient.index({
              index: 'rides',
              type: 'object',
              body: activity,
            }, (eserr) => {
              if (eserr) {
                console.log(eserr);
              }
            });
          });
        });
        redisclient.set(`/users/${athleteID}/rides/lastvisited`, new Date().getTime() / 1000);
      });
    });
  }
}

module.exports = ElasticSearchDataHandler;
