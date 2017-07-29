# Passport-Strava

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Strava](http://www.strava.com/)'s [API V3](http://strava.github.io/api/) using OAuth2.

I used [Passport-github](https://github.com/jaredhanson/passport-github/) as the base for this repo. Really I just changed a few things, the real work was already done.

This module lets you authenticate using Strava in your Node.js applications.
By plugging into Passport, Strava authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


## Install

`$ npm install passport-strava`

## Usage

#### Create an Application

To use `passport-strava` you must register an application with Strava in the [settings panel](https://www.strava.com/settings/api). You will be issued a client ID and a client secret to configure your strategy.

#### Configure Strategy

There are numerous examples available on setting up passport strategies:

- [express-4.x-facebook-example](https://github.com/passport/express-4.x-facebook-example) - Simply replace the `passport-facebook` strategy with `passport-strava` and use your ID/secret for a working quickstart example.
- [Passportjs.org documentation](http://passportjs.org/docs)


#### Simple config example:

```js
var StravaStrategy = require('passport-strava').Strategy;

passport.use(new StravaStrategy({
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/strava/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ stravaId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

The returned `profile` object will contain the entire [JSON response](http://strava.github.io/api/v3/oauth/#example-response) specified in Strava's [api documentation](http://strava.github.io/api/).
