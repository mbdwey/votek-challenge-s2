var path = require('path');
// read invalid file may break the app, I don't like to require json file
var fs = require('fs');
var parseJsonToArray = require('./parseJsonToArray');
var dbHelper = require('./db');



var parseFromJsonFile = function(file,req,res,next,action = 'response')
{
  var fileRealPath = path.resolve(__dirname,'..',file);

  if (!fs.existsSync(fileRealPath))
    return res.status(400).send('Reading file failed');

  var fileContent = fs.readFileSync(fileRealPath,'utf8');

  var parsedJson;
  try {
    parsedJson = JSON.parse(fileContent);
  } catch(e) {
    return res.status(400).send('Parsing file failed');
  }
  if (parsedJson instanceof Error)
    return res.status(400).send('Parsing file failed');
  var parsedJsonContent = parseJsonToArray(parsedJson);
  if (action == 'save')
    return saveFromJsonFile(parsedJsonContent,req,res,next)
  return res.send(parsedJsonContent);
}

var saveFromJsonFile = function(parsedJsonContent,req,res,next)
{
  if(dbHelper.saveFromJsonFile(parsedJsonContent))
  {
    res.redirect('/');
  }
  else
  {
    res.send('Failed');
  }

}

module.exports = parseFromJsonFile;