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
    var packageName = applicationName.replace(/\s/g,"")
    var mkDirCommand = 'mkdir ~/generatedProjects/'+"'"+applicationName+"'";
    var copyCommand = 'cp -R ~/Projects/AndroidStudioProjects/BaseApplication/* ~/generatedProjects/'+"'"+applicationName+"'";
    var deleteCommand =  'rm ~/generatedProjects/'+applicationName+"/app/src/main/AndroidManifest.xml";
    var packageUpdateCommand = "find ~/generatedProjects/'"+applicationName+"'/ -type f -exec sed -i 's/com.developer.sparsh.baseapplication/com.amethyst.labs." + packageName + "/g' {} +"

    var mPromise = new Promise(function (resolve, reject) {
      
      // Make the directory with the Application Name
      cmd.get(mkDirCommand,function(data){
        console.log("Making Directory....");
        resolve(data);
      });

    }).then(function(data){
      
      // Copy the base application directory
      // TODO -- Might have to clone from a repository
      console.log("Copying Data....");
      return new Promise(function(resolve,reject){
        cmd.get(copyCommand,function(log){
          resolve(log);
        });  
      });

    }).then(function(data){
      
      // Udate the package name everywhere
      console.log("Updating package names......");
      console.log(packageUpdateCommand);
      return new Promise(function(resolve,reject){
        cmd.get(packageUpdateCommand,function(log){
          console.log(log);
          resolve(log);
        });
      });
    }).then(function(log){
      console.log("Successfully Updated");
    });

  });

module.exports = router;