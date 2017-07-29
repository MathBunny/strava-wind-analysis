# Passport-Strava

[Passport](https://github.com/millsy/passport-strava) strategy for authenticating
with [Strava](http://www.strava.com/) using the OAuth 2.0 API.

This module lets you authenticate using Strava in your Node.js applications.  By
plugging into Passport, Strava authentication can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-strava-oauth2

## Usage

#### Configure Strategy

The Strava authentication strategy authenticates users using an Strava
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

The client ID and secret are obtained by registering an application at the
[Login to Strava](https://www.strava.com/developers).

    passport.use(new StravaStrategy({
        clientID: STRAVA_CLIENT_ID,
        clientSecret: STRAVA_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/strava/callback"
      },
      function(accessToken, refreshToken, profile, done) {
	    // asynchronous verification, for effect...
	    process.nextTick(function () {
      
	      // To keep the example simple, the user's Strava profile is returned to
	      // represent the logged-in user.  In a typical application, you would want
	      // to associate the Strava account with a user record in your database,
	      // and return that user instead.
	      return done(null, profile);
	    });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'strava'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/strava',
      passport.authenticate('strava'));

    app.get('/auth/strava/callback', 
      passport.authenticate('strava', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/millsy/passport-strava/tree/master/examples/login).

## Credits

Extened from Jared's Amazon example
  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Chris Mills <[http://www.thefamilymills.co.uk/](http://www.thefamilymills.co.uk/)>
