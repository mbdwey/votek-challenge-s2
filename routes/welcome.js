var express = require('express');
var router = express.Router();
var uuidv4 = require('uuid/v4');
var path = require('path');
var dbHelper = require('../parser/db');

router.post('/', function(req, res,next) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  if (!req.files.jsonFile)
    return res.status(400).send('Please select file to upload.');

  // The name of the input field (i.e. "jsonFile") is used to retrieve the uploaded file
  let jsonFile = req.files.jsonFile;
  if (jsonFile.mimetype != 'application/json')
    return res.status(400).send('Only Json files are allowed.');

  // var tmpFile = path.join(path.resolve(__dirname,'..')'tmp',uuidv4());
  var filePath = uuidv4();
  var tmpFile = path.join('tmp',filePath+'.json');
  // Use the mv() method to place the file somewhere on your server
  jsonFile.mv(tmpFile, function(err) {
    if (err)
      return res.status(500).send(err);

    return res.redirect('visualize/?demo='+filePath);
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  dbHelper.getTreesList(
    function(err,trees)
    {
        if (err) return res.send('err occurred');
        return res.render('welcome', { title: 'Welcome',trees:trees });
    }
  );

});

module.exports = router;




