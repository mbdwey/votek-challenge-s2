var express = require('express');
var router = express.Router();
var parseFromJsonFile = require('../parser/parseFromJsonFile');
var path = require('path');
var dbHelper = require('../parser/db');

/* GET users listing. */

router.get('/', function(req, res, next) {
  if (req.query.demoJson )
  {
    var tmpFile = path.join('tmp',req.query.demoJson+'.json');
    parseFromJsonFile(tmpFile,req,res,next);
    return;
  }

  if (req.query.treeJson)
  {
      dbHelper.treeModel.where({ _id: req.query.treeJson }).findOne(function(err,tree)
      {
          if (err) return res.status(404).send('Tree Not Found');
          if (req.query.export)
          {
            console.log('yyyyyy');
            res.attachment();
            res.setHeader('Content-disposition', 'attachment; filename=' + 'export.json');
            // res.setHeader('Content-type', 'application/json');
          }
          res.json(tree);
      });
    return;
  }


  if(req.query.demo)
  {
    res.render('visualize', { title: 'Visualize Demo File',identifier:req.query.demo,page:'demo' });
    return;
  }

  if(req.query.save)
  {
    var tmpFile = path.join('tmp',req.query.save+'.json');
    parseFromJsonFile(tmpFile,req,res,next,'save');
    return;
  }

  if(req.query.tree)
  {
    dbHelper.treeModel.where({ _id: req.query.tree }).findOne(function(err,tree)
      {
          if (err) return res.status(404).send('Tree Not Found');
          res.render('visualize', { title: 'View tree - '+tree.tree_title,tree:tree,page:'tree',identifier:tree._id });
      });
    return;
  }

  res.render('visualize', { title: 'Visualize' });
});




module.exports = router;
