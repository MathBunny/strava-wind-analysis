![Strava Wind Analysis](https://i.imgur.com/9eaXBJu.png)

Bringing machine learning analytics, data visualization and weather data to cycling activities and segments.

## Features
* Strava OAuth authentication
* Performance analytics on historical segment and aggregate data
* Interactive charts using chart.js, Google Maps integration
* Wind analysis using DarkSky API and vector manipulation algorithm
* Individual modals with athlete-specific statistics on segment leaderboard
* Linear regression and interpolation tools using scikit-learn
* Segment and ride filtering options (distance, speed, etc.)
* Improved performance with Redis caching
* Legacy website support

## Screenshots
![Strava Wind Analysis](https://i.imgur.com/IBPMPKc.png)
![Strava Wind Analysis](https://i.imgur.com/IQpQnBx.png)
![Strava Wind Analysis](https://i.imgur.com/pP6sWZ4.png)
![Strava Wind Analysis](https://i.imgur.com/OIxU9fs.png)
![Strava Wind Analysis](https://i.imgur.com/U33jx8U.png)


## Build, Configure and Run
First, install the dependencies. Ensure you have Node.js installed and npm:
```shell
npm install
```

Now setup the configuration file in the root folder as follows (saved as `config.js`):
```javascript
const clientID = 0;
const clientSecret = "0";
const callbackURL = "http://localhost:3000/login/callback";
const weatherKey = "YourDarkSkyWeatherKey";
const port = 3000;
const accessToken = "0";
const mlEndpoint = "YourMLEndPoint";
const defaultExpirationTime = 7200; // Redis cache expiration time
const mongoDBUrl = ''; // MongoDB url
const dailyDarkSkyLimit = 500; // Hard limit on API calls per day

exports.clientID = clientID;
exports.clientSecret = clientSecret;
exports.callbackURL = callbackURL;
exports.port = port;
exports.weatherKey = weatherKey;
exports.accessToken = accessToken;
exports.mlEndpoint = mlEndpoint;
exports.defaultExpirationTime = defaultExpirationTime;
exports.mongoDBUrl = mongoDBUrl;
exports.dailyDarkSkyLimit = dailyDarkSkyLimit;
```

Now setup a Redis instance and direct it to `localhost` with port `6379` (default configuration).

Install and run the machine learning server with Flask:

```shell
FLASK_APP=app.py flask run
```

To start the server use:
```shell
npm start
```

## Running Tests
You can run tests using Mocha and Chai:
```shell
npm test
```

## Contributing
Feel free to submit a pull request. The coding conventions of this app follow the Airbnb base style guide.