# Strava Wind Analysis Backend
The purpose of this web app is to inform users of how much wind influence riders in a segment leaderboard.

## Build and Configure
First, install the dependencies. Ensure you have Node.js installed and npm:
```
npm install
```

Now setup the configuration file in the root folder as follows:
```
const clientID = 0;
const clientSecret = "0";
const callbackURL = "http://localhost:3000/login/callback";
const weatherKey = "0";
const port = 3000;
const accessToken = "0";

exports.clientID = clientID;
exports.clientSecret = clientSecret;
exports.callbackURL = callbackURL;
exports.port = port;
exports.weatherKey = weatherKey;
exports.accessToken = accessToken;
```

## Run
```
num start
```