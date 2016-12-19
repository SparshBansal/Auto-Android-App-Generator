/**
 * Created by sparsh on 10/12/16.
 */
var express = require('express');
var cmd = require('node-cmd');
var path = require('path');


var xml2js = require('xml2js')
var parser = xml2js.parseString;
var fs = require('fs');


var router = express.Router();

router.post('/' , function (req, res, next) {
    var applicationName = req.body.app_name;
    var displayString = req.body.display_string;

    // Now lets create a project directory for the new app
    var mkDirCommand = 'mkdir ~/generatedProjects/'+"'"+applicationName+"'";
    var copyCommand = 'cp -R ~/Projects/AndroidStudioProjects/BaseApplication/* ~/generatedProjects/'+"'"+applicationName+"'";
    cmd.get(mkDirCommand,function (data) {
       cmd.get(copyCommand,function(newData){
           // Now edit the manifest file
           fs.readFile('/home/sparsh/generatedProjects/'+applicationName+"/app/src/main/AndroidManifest.xml",'utf-8',function(error,data){
               if(error){
                   return console.log(error);
               }
               parser(data,function(error,result){
                   var modified = result;
                   modified.manifest.$.package = "amethyst.labs.dev." + applicationName.replace(/\s/g,"");
                   console.log(modified);
                   var builder = new xml2js.Builder();
                   var modifiedXml = builder.buildObject(modified);

                   console.log(modifiedXml);
                   var deleteCommand = 'rm ~/generatedProjects/'+applicationName+"/app/src/main/AndroidManifest.xml";
                   cmd.get(deleteCommand,function (data) {
                       fs.writeFile('/home/sparsh/generatedProjects/'+applicationName+"/app/src/main/AndroidManifest.xml",modifiedXml,function(error){
                           if(error){
                               return console.log(error);
                           }
                           console.log("Write Successful");
                       });
                   });
               });
           });
       });
    });
});

module.exports = router;