/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Strava authentication strategy authenticates requests by delegating to
 * Strava using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Strava application's client id
 *   - `clientSecret`  your Strava application's client secret
 *   - `callbackURL`   URL to which Strava will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new StravaStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/strava/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.strava.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://www.strava.com/oauth/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'strava';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Strava.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `strava`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://www.strava.com/api/v3/athlete', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'strava' };
      if (json.id) {
		  //correct strava format athlete
        profile.id = json.id;
        profile.displayName = json.firstname + ' ' + json.lastname;
		profile.name = { familyName : json.lastname, givenName : json.firstname};
		profile.photos = [{ value : json.profile }, { value : json.profile_medium }]
        profile.emails = [{ value: json.email }];
		
		profile.token = accessToken;
      }
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
