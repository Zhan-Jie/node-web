var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    var mongo = require('../mongodb/mongo');
    console.log(mongo);
  res.render('index', { title: 'Express' });
});

module.exports = router;
