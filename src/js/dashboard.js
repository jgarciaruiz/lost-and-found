(function() {
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

  //check user is logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User is signed in.');
    } else {
      console.log('No user is signed in.');
      window.location.href = 'index.html';
    }
  });

  //logout
  document.getElementById('logout').onclick = function(e) {
    e.preventDefault();
    signOut();
  }

  function signOut() {
     firebase.auth().signOut()
     .then(function() {
        console.log('Signout successful!')
        window.location.href = 'index.html';
     }, function(error) {
        console.log('Signout failed!')
     });
  }

  //google maps
  function initMap(location) {
      //create map container
      var theMap = document.createElement('div');
      theMap.id = 'map';
      document.getElementsByTagName('body')[0].appendChild(theMap);

      var dragger = document.createElement('div');
      dragger.id = 'dragger';
      document.getElementsByTagName('body')[0].appendChild(dragger);

      console.log('initMap Started - Map loaded');
      //var madrid = new google.maps.LatLng(40.415363, -3.707398);

      var mapSettings = {
          zoom: 18,
          center: location,//madrid
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          //disableDefaultUI: true
          streetViewControl:false,
          panControl:false,
          mapTypeControl:false,
          rotateControl:false,
          overviewMapControl:false
      };


      var map = new google.maps.Map(document.getElementById('map'), mapSettings);
      customizeMap(map);

      console.info('zoom: ', map.getZoom());
    
      // Create the DIV to hold the control and call the constructor passing in this DIV
      var geolocationDiv = document.createElement('div');
      var geolocationControl = new GeolocationControl(geolocationDiv, map);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(geolocationDiv);

      addUserMarker(location, map);

      console.log('initMap Ended');
      
  }

  function addUserMarker(location, map) {
      var marker = new google.maps.Marker({
          position: location,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP
      });

      console.info('lat: ', marker.getPosition().lat());
      console.info('lon: ', marker.getPosition().lng());

      google.maps.event.addListener(marker, 'dragend', function () {
          map.setCenter(this.getPosition()); // Set map center to marker position
          updatePosition(this.getPosition().lat(), this.getPosition().lng()); // update position display
      });

      google.maps.event.addListener(map, 'drag', function () {
          marker.setPosition(this.getCenter()); // set marker position to map center
          updatePosition(this.getCenter().lat(), this.getCenter().lng()); // update position display
     });

      google.maps.event.addListener(map, 'dragend', function () {
          marker.setPosition(this.getCenter()); // set marker position to map center
          updatePosition(this.getCenter().lat(), this.getCenter().lng()); // update position display
      });

      document.getElementById("location").addEventListener('click', function() {
        //remove main marker
        if (marker && marker.setMap) {
            marker.setMap(null);
        }

        //animate dragged location in map to user real geolocation
        panTo(map, location.lat, location.lng);

        //add marker again with user geolocation
        var resetLatLng = new google.maps.LatLng(location.lat, location.lng);
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        console.log("User located! Lat: "+location.lat+' Long:'+location.lng);

      }, false);

  }

  function customizeMap(map) {
      var styles = [{'featureType':'all','elementType':'labels.text.fill','stylers':[{'color':'#53608f'},{'saturation':'0'},{'lightness':'56'}]},{'featureType':'all','elementType':'labels.text.stroke','stylers':[{'color':'#2e2545'}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#2e2545'}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#2e2545'},{'lightness':'-32'}]},{'featureType':'administrative.country','elementType':'labels.text.fill','stylers':[{'lightness':'-16'},{'saturation':'-8'}]},{'featureType':'administrative.province','elementType':'labels.text.fill','stylers':[{'lightness':'-16'},{'saturation':'-8'}]},{'featureType':'administrative.locality','elementType':'labels.text.fill','stylers':[{'lightness':'-32'},{'saturation':'-16'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'lightness':'-32'},{'saturation':'-16'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#2e2545'}]},{'featureType':'landscape','elementType':'geometry.stroke','stylers':[{'lightness':'-48'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'poi','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#326268'},{'lightness':'0'},{'saturation':'0'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#53608f'},{'lightness':'2'},{'saturation':'0'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#2e2545'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#4f3f6d'},{'lightness':'0'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'color':'#4f3f6d'}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'color':'#2e2545'},{'lightness':'-16'}]},{'featureType':'transit.station.airport','elementType':'geometry.fill','stylers':[{'hue':'#4800ff'},{'lightness':'-70'},{'saturation':'26'}]},{'featureType':'transit.station.bus','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'transit.station.bus','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'transit.station.rail','elementType':'labels.text.fill','stylers':[{'lightness':'-16'},{'saturation':'-8'}]},{'featureType':'transit.station.rail','elementType':'labels.icon','stylers':[{'lightness':'-32'},{'weight':'1.00'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#14163a'},{'lightness':'0'}]},{'featureType':'water','elementType':'labels.text','stylers':[{'visibility':'off'}]}];
      map.setOptions({
          styles: styles
      });
  }

  function GeolocationControl(controlDiv, map) {
    // Set CSS for the control button
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#444';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = 'white';
    controlUI.style.height = '28px';
    controlUI.style.marginTop = '5px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center map on your location';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control text
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '10px';
    controlText.style.color = 'white';
    controlText.style.paddingLeft = '10px';
    controlText.style.paddingRight = '10px';
    controlText.style.marginTop = '8px';
    controlText.innerHTML = 'Center map on your location';
    controlUI.appendChild(controlText);

    // Setup the click event listeners to geolocate user
    google.maps.event.addDomListener(controlUI, 'click', initGeolocation);// initGeolocation -> panTo(lat, lng);
  }


  function updatePosition(lat, lng) {
      console.log('Current Lat: ' + lat.toFixed(4) + ' Current Lng: ' + lng.toFixed(4));
  }

  //document.addEventListener('DOMContentLoaded', initMap, false);
  

  var panPath = [];   // An array of points the current panning action will use
  var panQueue = [];  // An array of subsequent panTo actions to take
  var smoothness = 10;     // The number of steps that each panTo action will undergo - increase for smoothness

  function panTo(map, newLat, newLng) {

    if (panPath.length > 0) {
      // We are already panning...queue this up for next move
      panQueue.push([newLat, newLng]);
    } else {
      // Lets compute the points we'll use     
      var curLat = map.getCenter().lat();
      var curLng = map.getCenter().lng();
      
      var dLat = (newLat - curLat)/smoothness;
      var dLng = (newLng - curLng)/smoothness;
      

      for (var i=0; i < smoothness; i++) {
        panPath.push([curLat + dLat * i, curLng + dLng * i]);
      }
      panPath.push([newLat, newLng]);
      setTimeout(function() {
        doPan(map);
      }, 100)
    }
  }

  function doPan(map) {
    var next = panPath.shift();
    console.log('next: ',next);

    if (next != null) {
      // Continue our current pan action
      map.panTo( new google.maps.LatLng(next[0], next[1]));
      setTimeout(function() {
        doPan(map);
      }, 100)
    } else {
      // We are finished with this pan - check if there are any queue'd up locations to pan to 
      var queued = panQueue.shift();
      console.log('queued: ', queued);
      if (queued != null) {
        panTo(queued[0], queued[1]);
      } else {
        console.info('initial zoom: ', map.zoom);
        map.setZoom(map.zoom);
      }
    }
  }

  function initGeolocation(){
    console.log('Geolocation request');
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(coord) {
            var location = {
                lat: coord.coords.latitude,
                lng: coord.coords.longitude
            }
            initMap(location);
        });
    } else {
        console.warn('Geolocation not supported');
    }
  }
  
  initGeolocation();

})();

