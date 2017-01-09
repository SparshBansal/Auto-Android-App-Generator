/**
 * Created by sparsh on 10/12/16.
 */
var express = require('express');
var cmd = require('node-cmd');
var fs = require('fs');

var router = express.Router();

router.use(function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
});

router.get('/',function(req,res,next){
  return res.render('createApp.ejs',{user : req.user});
});

router.post('/' , function (req, res, next) {

    var applicationName = req.body.app_name;
    var displayString = req.body.display_string;
    var navigation_type = req.body.navigation_type;

    var sourceProjectDirectory = "~/Projects/AndroidStudioProjects/BaseApplication/";
    var destinationDirectory = "~/generatedProjects/";
    var projectDir = "/home/sparsh/generatedProjects/"+applicationName;
    var packageName = applicationName.replace(/\s/g,"")
    
      
    var mPromise = new Promise(function (resolve, reject) {
      // Run initialization Script!!!
      cmd.get('./shell_scripts/initialize_project.sh ' + sourceProjectDirectory + " " + destinationDirectory + " \"" + applicationName + "\"",function(data){
        console.log(data);
        resolve(data);
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
        fs.writeFile(projectDir+"/app/src/main/assets/data.json" , stringToWrite , function(error){
          if(error){
            console.log("error",error);
            reject(error);
          }
          resolve();
        });
      });

    }).then(function(log){
      
      // Run copy_replace script
      return new Promise(function(resolve,reject){
      
        var destinationFile = projectDir + '/app/src/main/res/layout/activity_main.xml';
        var sourceFile = "";
      
        if(navigation_type === 'sliding_tab'){
          sourceFile = "~/XML/activity_main_slidingtabs.xml";
        }
        else if(navigation_type === 'navigation_drawer'){
          sourceFile = "~/XML/activity_main_navbar.xml";
        }

        cmd.get("./shell_scripts/copy_replace_script.sh " + sourceFile + " " + destinationFile , function(log){
          resolve(log);
        });
      });

    }).then(function(log){

        // Run build_app script to finally build the application
        return new Promise(function(resolve , reject){
          cmd.get("./shell_scripts/build_app.sh " + projectDir , function(log){
            console.log(log);
          });
        });
    });
  });

module.exports = router;