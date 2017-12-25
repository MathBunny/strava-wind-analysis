# Strava Wind Analysis Backend
The purpose of this web app is to inform users of how much wind influence riders in a segment leaderboard.

## Build, Configure and Run
First, install the dependencies. Ensure you have Node.js installed and npm:
```shell
npm install
```

Now setup the configuration file in the root folder as follows:
```javascript
const clientID = 0;
const clientSecret = "0";
const callbackURL = "http://localhost:3000/login/callback";
const weatherKey = "YourDarkSkyWeatherKey";
const port = 3000;
const accessToken = "0";

exports.clientID = clientID;
exports.clientSecret = clientSecret;
exports.callbackURL = callbackURL;
exports.port = port;
exports.weatherKey = weatherKey;
exports.accessToken = accessToken;
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

## Features
* Login using Strava OAuth, preloads a selection of segments for users
* Integrated legacy website with hidden API keys
* Improved algorithm for segment effort correlation factor generation
* Legacy website for historical purposes

## Contributing
Feel free to submit a pull request. The coding conventions of this app follow the AirBnB base style guide.