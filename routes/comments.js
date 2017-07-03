var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/fridment-new', ['comments']);
var datetime = require('node-datetime');

/* GET users listing. */
router.get('/:issue_id', function(req, res, next) {

  db.comments.find({issue_id: Number(req.params.issue_id)}, function(err, comments){
        if(err){
            res.send(err);
        }
        res.json(comments);
    })
});

// router.get('/:id', function(req, res, next) {
//   db.comments.find({id: Number(req.params.id)}, function(err, comments){
//         if(err){
//             res.send(err);
//         }
//         res.json(comments[0]);
//     });
// });

router.get('/:id/edit', function(req, res, next) {
  db.comments.find({id: Number(req.params.id)}, function(err, comments){
        if(err){
            res.send(err);
        }
        res.json(comments[0]);
    });
});

router.post('/:milestone_id/:issue_id', function(req, res, next) {
  db.comments.find().sort({"id": -1}).limit(1).toArray(function(err, comments){
        if(err){
            res.send(err);
        }
        id = comments[0]['id'] + 1;
        db.comments.insert({id: id,
                            author_id: 1,
                            issue_id: Number(req.params.issue_id),
                            milestone_id: Number(req.params.milestone_id),
                            state: (req.body.state == 'true'),
                            description: req.body.description,
                            created_at: datetime.create().format('n d Y')});

        db.comments.find({id: id}, function(err, comments){
          if(err){
            res.send(err);
          }
        res.json(comments[0]);
    });
  });
});

router.patch('/:id', function(req, res, next) {
  db.comments.update({id: Number(req.params.id)},
                      { $set: { state: (req.body.state == 'true'),
                                description: req.body.description
                              } }, function(err, comments){
        if(err){
            res.send(err);
        }
        db.comments.find({id: Number(req.params.id)}, function(err, comments){
          if(err){
            res.send(err);
          }
        res.json(comments[0]);
    });
  });
});

router.delete('/:id', function(req, res, next) {
  db.comments.remove({id: Number(req.params.id)});
  res.sendStatus(200)
});

module.exports = router;

// db.comments.drop()
// db.createCollection('comments')
// db.comments.insert({name:"m2", author: 'sss', description: 'ddd', state: 'opened', created_at: 'Jul 03 2017', issues: []})
// db.comments.insert({name:"m3", author: 'sss', description: 'ddd', state: 'opened', created_at: 'Jul 03 2017', issues: []})

// db.comments.aggregate([ { $project: { name: 1, author: 1, description: 1, state: 1, created_at: 1,
//                      number_of_testers: { $size: "$testers"},
//                      number_of_issues: { $size: "$issues"},
//                      number_of_comments: { $size: "$comments"},
//                      }
//               }])

// db.comments.update({name: 'm2'}, { $push: { testers: {email: "one"}}})






