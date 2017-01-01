var User = require('./models/user');


exports.localAuth = function(email,password){
	console.log(email,password);
	return new Promise(function(resolve,reject){
		User.findOne({email: email}).exec().then(function(result){
			if(!result){
				console.log("Did not find the user with the email address");
				resolve(null);
			}
			result.checkPassword(password,function(error,isMatch){
				if(error){
					reject(error);
				}
				if(!isMatch){
					console.log("Passwords did not match");
					resolve(null);
				}
				else{
					resolve(result);
				}
			});
		}).catch(function(error){
			reject(error);
		});
	});
};

exports.localRegistration = function(details){
	
	var username = details.username;
	var password = details.password;
	var email = details.email;
	var mobile = details.mobile;

	return new Promise(function(resolve,reject){
		User.findOne({email : email}).exec().then(function(result){
			if(result){
				// User already exists
				console.log("User already exists");
				resolve(null);
			}
			else{
				console.log("No existing user");
				// No existing user with this email , create one
				var newUser = new User({
					username : username,
					password : password,
					email : email,
					mobile : mobile
				});

				newUser.save().then(function(user){
					console.log("saved promise returned");
					if(user)
						resolve(user);
				}).catch(function(error){
					reject(error);
				});
			}
		
		}).catch(function(error){
			console.log(error);
			reject(error);
		});
	});
};