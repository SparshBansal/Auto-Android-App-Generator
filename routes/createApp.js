/**
 * Created by sparsh on 10/12/16.
 */
var express = require('express');
var cmd = require('node-cmd');
var fs = require('fs');

// import the models
var Application = require('../models/application');

var router = express.Router();

router.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
});

router.get('/', function (req, res, next) {
    return res.render('createApp.ejs', {user: req.user});
});

router.post('/', function (req, res, next) {

    var applicationName = req.body.app_name;
    var packageName = applicationName.replace(/\s/g, "")


    var sourceProjectDirectory = "~/Projects/AndroidStudioProjects/BaseApplication/";
    var destinationDirectory = "~/generatedProjects/";
    var projectDir = "/home/sparsh/generatedProjects/" + applicationName;

    // Insert Details to Database...
    // Parse the application details...

    console.log("Saving data");

    var displayString = req.body.display_string;
    var navigation_type = req.body.navigation_type;

    var details = {};

    // Put the details in the details object
    details.text = displayString;
    details.nav_type = navigation_type;

    // Insert application data..
    var userId = req.user._id;

    var newApplication = new Application({

        name: applicationName,
        adminId: userId,
        package: packageName,
        properties: details

    });

    newApplication.save().then(function (application) {  /* Constructing the application now */

        return new Promise(function (resolve, reject) {

            console.log("Running initialization script");
            // Run initialization Script!!!
            cmd.get('./shell_scripts/initialize_project.sh ' + sourceProjectDirectory + " " + destinationDirectory + " \"" + applicationName + "\"", function (data) {
                console.log(data);
                resolve(application);
            });

        });

    }).then(function (application) {

        var stringToWrite = JSON.stringify(application.properties);

        return new Promise(function (resolve, reject) {
            fs.writeFile(projectDir + "/app/src/main/assets/data.json", stringToWrite, function (error) {
                if (error) {
                    console.log("error", error);
                    reject(error);
                }
                resolve(application);
            });
        });

    }).then(function (application) {

        // Run copy_replace script
        return new Promise(function (resolve, reject) {

            var destinationFile = projectDir + '/app/src/main/res/layout/activity_main.xml';
            var sourceFile = "";

            if (application.properties.nav_type === 'sliding_tab') {
                sourceFile = "~/XML/activity_main_slidingtabs.xml";
            }
            else if (application.properties.nav_type === 'navigation_drawer') {
                sourceFile = "~/XML/activity_main_navbar.xml";
            }

            cmd.get("./shell_scripts/copy_replace_script.sh " + sourceFile + " " + destinationFile, function (log) {
                resolve(log);
            });
        });

    }).then(function (log) {

        // Run build_app script to finally build the application
        return new Promise(function (resolve, reject) {
            cmd.get("./shell_scripts/build_app.sh " + projectDir, function (log) {
                console.log(log);
            });
        });
    }).catch(function (error) {

        console.log(error);

    });
});

module.exports = router;