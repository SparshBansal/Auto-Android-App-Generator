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
    var deleteCommand =  'rm ~/generatedProjects/'+applicationName+"/app/src/main/AndroidManifest.xml";


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
      
      // Read the manifest of the newly created application directory
      console.log("Reading File......");
      return new Promise(function(resolve,reject){
        fs.readFile("/home/sparsh/generatedProjects/"+applicationName+"/app/src/main/AndroidManifest.xml",function(error,fileData){
          if(error){
            console.log("Error while reading file");
            console.log(error);
            reject(error);
          }
          resolve(fileData);
        });
      });

    }).then(function(fileData){
    
      // Parsing the xml to js
      return new Promise(function(resolve,reject){
        console.log("Parsing the Manifest...");
        parser(fileData,function(error,result){
          if(error){
           console.log('error while parsing');
           reject(error);
          }
          resolve(result);
        });
      });
    
    }).then(function(result){

      console.log("Updating the Manifest");
      // Update the package name
      var modified = result;
      modified.manifest.$.package = "amethyst.labs.dev." + applicationName.replace(/\s/g,"");
      
      var builder = new xml2js.Builder();
      var modifiedXml = builder.buildObject(modified);
      
      return modifiedXml;
    
    }).then(function(modifiedXml){
      
      console.log("Removing Old Manifest files");
      // Remove the original manifest
      return new Promise(function(resolve,reject){
        cmd.get(deleteCommand,function(log){
          resolve(modifiedXml);
        });
      });
    
    }).then(function(modifiedXml){
      
      console.log("Write new Manifest");
      // Write the new manifest
      fs.writeFile("/home/sparsh/generatedProjects/"+applicationName+"/app/src/main/AndroidManifest.xml",modifiedXml,function(error){
        if(error){
          return console.log(error);
        }
        console.log("Write Successful");
      });
    });
});

module.exports = router;