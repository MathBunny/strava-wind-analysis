const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.authenticate('strava', { scope: ['public'] }), () => { });

router.get('/callback',
  passport.authenticate('strava', { failureRedirect: '/login' }),
  (req, res) => {
    console.log(req.user.accessToken); // eslint-disable-line no-console
    res.redirect('/');
  });

module.exports = router;
