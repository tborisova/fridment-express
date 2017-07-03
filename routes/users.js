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

router.post('/', function(req, res, next) {
	db.users.find().sort({"id": -1}).limit(1).toArray(function(err, issues){
        if(err){
            res.send(err);
        }
        id = issues[0]['id'] + 1;
        db.users.insert({name: req.body.name, email: req.body.email, id: id})
      	res.send(200)
    });
});

module.exports = router;