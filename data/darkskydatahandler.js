const requestify = require('requestify');
const config = require('../config');

class DarkySkyDataHandler {
  // You can check Redis on usage count
  static getWeatherDetails(accessToken, athleteID, latitude, longitude, date) {
    return new Promise((resolve) => {
      requestify.get(`https://api.forecast.io/forecast/${config.weatherKey}/${latitude},${longitude},${date}?units=ca`).then((detailedWeatherResponse) => {
        const weatherResponse = JSON.parse(detailedWeatherResponse.body);
        resolve(weatherResponse);
      }).fail(err => console.log(err));
    });
  }
}

module.exports = DarkySkyDataHandler;
