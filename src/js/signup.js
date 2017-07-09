// Initialize Firebase
var config = {
  apiKey: "XXX",
  authDomain: "XXX.firebaseapp.com",
  databaseURL: "https://XXX.firebaseio.com",
  projectId: "XXX",
  storageBucket: "XXX.appspot.com",
  messagingSenderId: "XXX"
};
firebase.initializeApp(config);

document.getElementById("submit").onclick = function(e) {
  e.preventDefault();
  handleSignUp();
}

document.getElementById("twitter").onclick = function(e) {
  e.preventDefault();
  twitterSignin();
}


function handleSignUp() {
  var errors = document.getElementById('errors');
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var warnings = "";
  if (name.length < 3) {
    warnings += 'Name must be 3 characters min<br/>';
  }
  if (email.length < 4) {
    warnings += 'Type a valid email<br/>';
  }
  if (password.length < 4) {
    warnings += 'Type a longer password<br/>';
  }

  if (warnings != "") {
    console.log(warnings);
    errors.style.display = 'block';
    errors.innerHTML = warnings;
  } else {
    errors.style.display = "none";
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (result) {
      firebase.database().ref('/users/' + result.uid).set({
        username: name,
        email:email
      });
      console.log(result);
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      errors.style.display = (errors.style.display === "none" || errors.style.display === "") ? "block" : "none";
      console.log(error);
      errors.innerHTML = error;
    });  
  }
}

var provider = new firebase.auth.TwitterAuthProvider();
function twitterSignin() {
   firebase.auth().signInWithPopup(provider)
  .then(function(result) {
      //console.log(result);
	  var token = result.credential.accessToken;
      var name = result.user;
      var uid = result.user.uid;
	   
      var provider = result.credential.provider;
      var username = result.user.displayName;
      var email = result.user.email;
      var photoURL = result.user.photoURL;
      var twitterID = result.user.providerData[0].uid;
	   
      firebase.database().ref('/users/' + uid).set({
        username: username,
        email:email
      });	   
	   
   }).catch(function(error) {
      console.log(error);
	  console.log(error.code);
      console.log(error.message);
	   
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      errors.style.display = (errors.style.display === "none" || errors.style.display === "") ? "block" : "none";
      errors.innerHTML = error;	   
   });
}

function twitterSignout() {
   firebase.auth().signOut()
   .then(function() {
      console.log('Signout successful!')
   }, function(error) {
      console.log('Signout failed!')
   });
}


// Once a user is created with the email/login
// Notify when he/she is logged in
firebase.auth().onAuthStateChanged(user => {  
  if (user) {
    /*
    var FB_name = user.displayName;
    var FB_email = user.email;
    var FB_photoUrl = user.photoURL;
    var FB_emailVerified = user.emailVerified;
    var FB_uid = user.uid;
    var success = document.getElementById('success');
    success.style.display = (success.style.display === "none" || success.style.display === "") ? "block" : "none";
    success.innerHTML = "User Logged in with Credentials: <br />" +
      "<b>Name:</b> " + FB_name + "<br />" + 
      "<b>Email: </b>" + FB_email + "<br />" + 
      "<b>photoUrl: </b>" + FB_photoUrl + "<br />" + 
      "<b>emailVerified: </b>" + FB_emailVerified + "<br />" + 
      "<b>uid: </b>" + FB_uid + "<br />";
  */
    window.location = 'dashboard.html';  
  } 
});


firebase.auth().signOut().then(function() {
	// Sign-out successful.
	console.log('Signout successful!')
}, function(error) {
  	// An error happened.
	console.log('Signout failed!')
});