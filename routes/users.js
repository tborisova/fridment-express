var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/fridment-new', ['users']);


/* GET users listing. */
router.get('/', function(req, res, next) {
	db.users.find(function(err, users){
        if(err){
            res.send(err);
        }
        res.json(users);
    });
});

module.exports = router;