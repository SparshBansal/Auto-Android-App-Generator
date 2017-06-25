let express = require('express');
let cmd = require('node-cmd');
let fs = require('fs');

let bluebird = require('bluebird');

// import the models
let Themes = require('../models/internal/theme');
let Application = require('../models/application');

let router = express.Router();

/*router.use(function (req, res, next) {
 if (req.isAuthenticated()) {
 return next();
 }
 res.redirect('/');
 });
 */
router.get('/wedding', function (req, res, next) {

    // query the themes database for available themes
    bluebird.coroutine(function*(){
        try {
            let themes = yield Themes.find({eventType: "wedding"}).exec();
            return res.render('createApp.ejs', {user: req.user , themes : themes});
        }catch (error){
            console.log(error);
            return res.render('createApp.ejs' , {user:req.user , themes : null});
        }

    })();
});

router.get('/birthday', function (req, res, next) {

    bluebird.coroutine(function*(){
        try {
            let themes = yield Themes.find({eventType: "wedding"}).exec();
            return res.render('createApp.ejs', {user: req.user , themes : themes});
        }catch (error){
            console.log(error);
            return res.render('createApp.ejs' , {user:req.user , themes : null});
        }

    })();
});


router.get('/fest', function (req, res, next) {
    bluebird.coroutine(function*(){
        try {
            let themes = yield Themes.find({eventType: "wedding"}).exec();
            return res.render('createApp.ejs', {user: req.user , themes : themes});
        }catch (error){
            console.log(error);
            return res.render('createApp.ejs' , {user:req.user , themes : null});
        }

    })();
});

router.get('/corporate', function (req, res, next) {
    bluebird.coroutine(function*(){
        try {
            let themes = yield Themes.find({eventType: "wedding"}).exec();
            return res.render('createApp.ejs', {user: req.user , themes : themes});
        }catch (error){
            console.log(error);
            return res.render('createApp.ejs' , {user:req.user , themes : null});
        }

    })();
});


router.post('/', function (req, res, next) {

    let applicationName = req.body.app_name;
    let packageName = applicationName.replace(/\s/g, "")


    let sourceProjectDirectory = "~/Projects/AndroidStudioProjects/BaseApplication/";
    let destinationDirectory = "~/generatedProjects/";
    let projectDir = "/home/sparsh/generatedProjects/" + applicationName;

    // Insert Details to Database...
    // Parse the application details...

    console.log("Saving data");

    let displayString = req.body.display_string;
    let navigation_type = req.body.navigation_type;

    let details = {};

    // Put the details in the details object
    details.text = displayString;
    details.nav_type = navigation_type;

    // Insert application data..
    let userId = req.user._id;

    let newApplication = new Application({

        name: applicationName,
        adminId: userId,
        package: packageName,
        properties: details

    });

    bluebird.coroutine(function *() {

        let application = yield newApplication.save();

        // Run initialization script
        let init_log_data = yield new Promise(function (resolve, reject) {

            console.log("Running initialization script");
            // Run initialization Script!!!
            cmd.get('./shell_scripts/initialize_project.sh ' + sourceProjectDirectory + " " + destinationDirectory + " \"" + applicationName + "\"", function (data) {
                console.log(data);
                resolve(application);
            });

        });
        console.log(init_log_data);

        // Write the file
        yield fs.writeFile(projectDir + "/app/src/main/assets/data.json", stringToWrite, function (error) {
            if (error) {
                console.log("error", error);
                reject(error);
            }
            resolve(application);
        });

        // Run copy_replace script
        let copy_log_data = yield new Promise(function (resolve, reject) {

            let destinationFile = projectDir + '/app/src/main/res/layout/activity_main.xml';
            let sourceFile = "";

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
        console.log(copy_log_data);

        // Run build_app script to finally build the application
        let build_log_data = yield new Promise(function (resolve, reject) {
            cmd.get("./shell_scripts/build_app.sh " + projectDir, function (log) {
                console.log(log);
                resolve(log);
            });
        });
        console.log(build_log_data);

        // Respond with the apk

    })();

});

module.exports = router;