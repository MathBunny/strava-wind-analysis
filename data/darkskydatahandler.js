const requestify = require('requestify');
const redis = require('redis');

const client = redis.createClient();

class DarkySkyDataHandler {
  static getWeatherDetails(accessToken, athleteID, latitude, longitude, date) {
    return new Promise((resolve, error) => {
      client.get(`/weather/${latitude}/${longitude}/${date}`, (err, reply) => {
        if (reply === null) {
          requestify.get(`https://api.forecast.io/forecast/${accessToken}/${latitude},${longitude},${date}?units=ca`).then((detailedWeatherResponse) => {
            const weatherResponse = JSON.parse(detailedWeatherResponse.body);
            client.set(`/weather/${latitude}/${longitude}/${date}`, JSON.stringify(weatherResponse));
            resolve(weatherResponse);
          }).fail(rErr => error(rErr));
        } else {
          resolve(JSON.parse(reply));
        }
      });
    });
  }
}

module.exports = DarkySkyDataHandler;
