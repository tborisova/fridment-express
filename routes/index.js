var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');


/* GET home page. */
router.get('/', function(req, res, next) {
var db = mongojs('mongodb://localhost:27017/fridment', ['users']);
	res.send(db.users.insert({name: 'Ed'}));
});

module.exports = router;
