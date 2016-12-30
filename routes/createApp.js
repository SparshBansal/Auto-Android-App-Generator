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

router.get('/',function(req,res,next){
  return res.render('createApp.ejs',{});
});

router.post('/' , function (req, res, next) {
    var applicationName = req.body.app_name;
    var displayString = req.body.display_string;

    var navigation_type = req.body.navigation_type;

    console.log(navigation_type);

    // Now lets create a project directory for the new app
    var packageName = applicationName.replace(/\s/g,"")
    
    var appDir = "~/generatedProjects/'"+applicationName+"'";
    var appDirFile = "/home/sparsh/generatedProjects/"+applicationName;
    
    var mkDirCommand = 'mkdir ~/generatedProjects/'+"'"+applicationName+"'";
    var copyCommand = 'cp -R ~/Projects/AndroidStudioProjects/BaseApplication/* ~/generatedProjects/'+"'"+applicationName+"'";
  
    var packageUpdateCommand = "find ~/generatedProjects/'"+applicationName+"'/ -type f -exec sed -i 's/com.developer.sparsh.baseapplication/com.amethyst.labs." + packageName + "/g' {} +"
    var buildCommand = "gradle -p ~/generatedProjects/'"+applicationName+"'/" + " assembleDebug";

    var deleteLayoutFileCommand =  'rm ~/generatedProjects/'+applicationName+"/app/src/main/res/layout/activity_main.xml";

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
      return new Promise(function(resolve,reject){
        cmd.get(packageUpdateCommand,function(log){
          console.log(log);
          resolve(log);
        });
      });

    }).then(function(data){

      // Add the asset file to the application
      var textObj = {};
      
      textObj.text = displayString;

      if(navigation_type === 'sliding_tab')
        textObj.nav_type = 'sliding_tab'
      else if (navigation_type === 'navigation_drawer')
        textObj.nav_type = 'navigation_drawer'

      var stringToWrite = JSON.stringify(textObj);

      return new Promise(function(resolve,reject){
        fs.writeFile(appDirFile+"/app/src/main/assets/data.json" , stringToWrite , function(error){
          if(error){
            console.log("error",error);
            reject(error);
          }
          resolve();
        });
      });

    }).then(function(log){

      // Delete the activity_main.xml
      return new Promise(function(resolve,reject){
        cmd.get(deleteLayoutFileCommand,function(log){
          resolve(log);
        });
      });

    }).then(function(log){
      
      // Copy and rename the appropriate xml to resource directory
      return new Promise(function(resolve,reject){
        var copyRenameCommand = "";
        if(navigation_type === 'sliding_tab'){
          copyRenameCommand = "cp ~/XML/activity_main_slidingtabs.xml ~/generatedProjects/'"+applicationName+"'/app/src/main/res/layout/activity_main.xml"
        }
        else if(navigation_type === 'navigation_drawer'){
          copyRenameCommand = "cp ~/XML/activity_main_navbar.xml ~/generatedProjects/'"+applicationName+"'/app/src/main/res/layout/activity_main.xml"
        }
        cmd.get(copyRenameCommand , function(log){
          resolve(log);
        });
      });

    }).then(function(log){
        console.log("Building Application.....");
        // Now build the application
        return new Promise(function(resolve,reject){
          console.log(buildCommand);
          cmd.get(buildCommand,function(log){
            console.log(log);
            console.log("Application Built!!");
            resolve();
          });
        });

    });
  });

module.exports = router;