var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/fridment-new', ['milestones']);
var datetime = require('node-datetime');
// var jwt = require('express-jwt');
// var jwks = require('jwks-rsa');

// var jwtCheck = jwt({
//     secret: jwks.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: "https://fridment.eu.auth0.com/.well-known/jwks.json"
//     }),
//     audience: 'http://fridment-react-exptess-fmi.com',
//     issuer: "https://fridment.eu.auth0.com/",
//     algorithms: ['RS256']
// });
// app.use(jwtCheck);

/* GET users listing. */
router.get('/', function(req, res, next) {

  db.milestones.aggregate([{$lookup: { from : "issues", localField: 'id', foreignField: 'milestone_id', as: 'issues'}},
                           {$lookup: { from : "comments", localField: 'id', foreignField: 'milestone_id', as: 'comments'}},
                           {$lookup: {from: 'issue_testers', localField: 'id', foreignField: 'milestone_id', as: 'testers'}},
                           {$project: {"number_of_issues_for_milestone":{$size: '$issues'},
                           id: 1, name: 1, description: 1, author_id: 1, state: 1, created_at: 1,
                           "number_of_comments_for_milestone": {$size: '$comments'},
                           "number_of_required_tests_for_milestone": {$size: '$testers'}}}]).sort({"id": -1}, function(err, milestones){
        if(err){
            res.send(err);
        }
        res.json(milestones);
    });
});

router.get('/:id', function(req, res, next) {
  db.milestones.find({id: Number(req.params.id)}, function(err, milestones){
        if(err){
            res.send(err);
        }
        res.json(milestones[0]);
    });
});

router.get('/:id/edit', function(req, res, next) {
  db.milestones.find({id: Number(req.params.id)}, function(err, milestones){
        if(err){
            res.send(err);
        }
        res.json(milestones[0]);
    });
});

router.post('/', function(req, res, next) {
  db.milestones.find().sort({"id": -1}).limit(1).toArray(function(err, milestones){
        if(err){
            res.send(err);
        }
        id = milestones[0]['id'] + 1;
        db.milestones.insert({id: id, name: req.body.name, description: req.body.description, author_id: Number(req.body.author_id), state: 'opened', created_at: datetime.create().format('n d Y')})

        db.milestones.find({id: id}, function(err, milestones){
          if(err){
            res.send(err);
          }
        res.json(milestones[0]);
    });
  });
});

router.patch('/:id', function(req, res, next) {
  db.milestones.update({id: Number(req.params.id)},
                      { $set: { description: req.body.description,
                                name: req.body.name
                              } }, function(err, milestones){
        if(err){
            res.send(err);
        }
        db.milestones.find({id: Number(req.params.id)}, function(err, milestones){
          if(err){
            res.send(err);
          }
        res.json(milestones[0]);
    });
  });
});

router.post('/finish/:id', function(req, res, next) {
  db.milestones.update({id: Number(req.params.id)},
                      { $set: { state: 'finished' } }, function(err, milestones){
        if(err){
            res.send(err);
        }
        db.milestones.find({id: Number(req.params.id)}, function(err, milestones){
          if(err){
            res.send(err);
          }
        res.json(milestones[0]);
    });
  });
});

router.post('/open/:id', function(req, res, next) {
  db.milestones.update({id: Number(req.params.id)},
                      { $set: { state: 'opened' } }, function(err, milestones){
        if(err){
            res.send(err);
        }
        db.milestones.find({id: Number(req.params.id)}, function(err, milestones){
          if(err){
            res.send(err);
          }
        res.json(milestones[0]);
    });
  });
});

router.post('/generate_issues/:id', function(req, res, next) {
  db.milestones.update({id: Number(req.params.id)},
                      { $set: { state: 'opened' } }, function(err, milestones){
        if(err){
            res.send(err);
        }
        db.milestones.find({id: Number(req.params.id)}, function(err, milestones){
          if(err){
            res.send(err);
          }
        res.json(milestones[0]);
    });
  });
});

module.exports = router;
