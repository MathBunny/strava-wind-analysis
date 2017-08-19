const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  req.logOut();
  res.redirect('../');
});

module.exports = router;
