function sendDataToServer(endpoint , params , callback){
	if(!(endpoint && params && callback)){
		return;
	}

	// Send the params to the backend server
	let xhr = new XMLHttpRequest();
	xhr.open('POST',endpoint);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.onload = callback;
	xhr.send(params);
}

// ==================================================================
// ====GOOGLE========================================================
// ==================================================================

// Send the google access token to the backend server for validation and confirmation
/*function onGoogleSignIn(googleUser){
	let profile = googleUser.getBasicProfile();
	console.log("Id : " , profile.getId());
	console.log("Name : ", profile.getName());
	console.log("Email: ",profile.getEmail());
	
	let id_token = googleUser.getAuthResponse().id_token;
	
	let callback = function(xhr){
		let data = JSON.parse(xhr.responseText);
		if(data.redirect){
			window.location = data.redirect;
		}
	}
	let params = 'idtoken='+id_token + "&username=username&password=password"; 
	sendDataToServer('/login/google',params,callback);
}*/

// ====================================================================
// ====FACEBOOK========================================================
// ====================================================================

// Send the facebook access token to the backend server for validation
function onFacebookSignIn(response){
	
	let authResponse = response.authResponse;
	let access_token = authResponse.accessToken;

	let callback = function(xhr){
		let data = JSON.parse(xhr.responseText);
		if(data.redirect){
			window.location = data.redirect;
		}
	};

	let params = "accessToken="+access_token+"&username=username&password=password";
	sendDataToServer('/login/facebook',params,callback);
}

function facebookStatusChangeCallback(response){
	
	if(response.status === 'connected'){
		console.log(response);
		console.log("Login Successfull");
		onFacebookSignIn(response);
	}
}

function checkFacebookLoginState(){
	FB.getLoginStatus(function(response){
		facebookStatusChangeCallback(response);
	});
}