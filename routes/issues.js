var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/fridment-new', ['issues', 'issue_testers', 'users', 'comments']);
var datetime = require('node-datetime');

/* GET users listing. */
router.get('/:milestone_id', function(req, res, next) {
  db.issues.aggregate([{ $match: { milestone_id: { $eq: Number(req.params.milestone_id)} } }, {$lookup: { from : "comments", localField: 'id', foreignField: 'issue_id', as: 'comments'}},
                    {$lookup: { from : "issue_testers", localField: 'id', foreignField: 'issue_id', as: 'testers'}}
                     ], function(err, issues){
        if(err){
            res.send(err);
        }
        res.json(issues);
    });
});

router.get('/show/:id', function(req, res, next) {
  db.issues.aggregate([{ $match: { id: { $eq: Number(req.params.id)} } }, {$lookup: { from : "comments", localField: 'id', foreignField: 'issue_id', as: 'comments'}},
                    {$lookup: { from : "issue_testers", localField: 'id', foreignField: 'issue_id', as: 'testers'}}
                     ], function(err, issues){
        if(err){
            res.send(err);
        }
        res.json(issues[0]);
    });
});

router.get('/get_state/:id', function(req, res, next) {
    db.comments.find({issue_id: Number(req.params.id) }).count(function(err, total){
        if(total > 0){
            db.comments.aggregate([{ $match : { state : 1, issue_id: Number(req.params.id) } },
                                {"$group":{"_id":{"state":"$state"},"count":{"$sum":1}}},
                                    { "$project": {"count":1, "percentage": {"$multiply": [ {"$divide":[100,total] },"$count"] } } }], function(error, issues){
                if(error){
                    res.send(error);
                }
                res.json(issues[0]['percentage']);
            });
        }else{
            res.json(0)
        }
    });
});

router.get('/burn_down_chart/:milestone_id', function(req, res, next) {
    db.comments.find({milestone_id: Number(req.params.milestone_id) }).count(function(err, total){
        if(total > 0){
            db.comments.aggregate([{ $match : {milestone_id: Number(req.params.milestone_id) } },
                                {"$group":{"_id":{"state":  {
                                      $cond: { if: { $eq: [ "$state", 1 ] }, then: 'tested', else: 'not tested' }
                                    }},"count":{"$sum":1}}},
                                    { "$project": {"percentage": {"$multiply": [ {"$divide":[100,total] },"$count"] } } }]).toArray(function(error, issues){
                if(error){
                    res.send(error);
                }

                hash = [{ name: issues[0]['_id']['state'], percentage: issues[0]['percentage']},
                        { name: issues[1]['_id']['state'], percentage: issues[1]['percentage']}
                       ]
                res.json(hash);
            });
        }else{
            res.json(0)
        }
    });
});

router.get('/get_testers/:id', function(req, res, next) {
  db.issue_testers.find({issue_id: Number(req.params.id) }).toArray(function(err, issue_testers){
    if(err){
        res.send(err);
    }
    ids = [];
    issue_testers.forEach(function(obj){
      ids.push(obj['tester_id']);
    });
    db.users.find({id: { $in: ids}}, function(err, users){
        if(err){
            res.send(err);
        }
        res.json(users);
    });
  });
});

router.post('/add_testers/:milestone_id/:id', function(req, res, next){
  db.issues.find({id: Number(req.params.id) }, function(err, milestones){
    if(err){
        res.send(err);
    }
    db.issue_testers.insert({tester_id: Number(req.body.user_id), issue_id: Number(req.params.id), milestone_id: Number(req.params.milestone_id)})
    res.send(200)
  });
});

module.exports = router;