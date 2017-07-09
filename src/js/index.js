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

//var dbRef = new Firebase("https://upload-test-b2ae8.firebaseio.com");
//var dbRef = firebase.database().ref();

document.getElementById("submit").onclick = function(e) {
  e.preventDefault();
  signIn();
}

document.getElementById("twitter").onclick = function(e) {
  e.preventDefault();
  twitterSignin();
}

function signIn(){
  var auth;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(authData) {
    // Success 
    console.log("Success", authData);
  })
  .catch(function(error) {
    // Error Handling  
    console.log("Error", error);
  });

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
      console.log("error", error);  
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