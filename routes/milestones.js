var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/fridment-new', ['milestones']);
var datetime = require('node-datetime');

/* GET users listing. */
router.get('/', function(req, res, next) {

  db.milestones.find(function(err, milestones){
        if(err){
            res.send(err);
        }
        res.json(milestones);
    })
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
