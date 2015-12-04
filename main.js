'use strict';

var map;
var infowindow;

function initMap() {
  //get current position
  navigator.geolocation.getCurrentPosition(function(position){
    var center = {lat: position.coords.latitude, lng: position.coords.longitude};
    console.log(center);
    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 13
    });

    var icon = {
      url: "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/128/Map-Marker-Marker-Outside-Azure.png", // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
    };

    var marker = new google.maps.Marker({
      map: map,
      position: center,
      icon: icon
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent("Current Location");
      infowindow.open(map, this);
    });

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: center,
      radius: 8047,
      types: ['cafe']
    }, callback);

  });
//
  // getDirectionsLocation();
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}


// 'use strict';

// var map;
// var center;
// var service;
// var infowindow;

// function initialize() {
//   // navigator.geolocation.getCurrentPosition(function(position){
//   //   center = {lat: position.coords.latitude, lng: position.coords.longitude};
//   //   console.log(center);
//   //   map = new google.maps.Map(document.getElementById('map'), {
//   //     center: center,
//   //     zoom: 13
//   //   });
//   // })
//   var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

//   map = new google.maps.Map(document.getElementById('map'), {
//       center: pyrmont,
//       zoom: 15
//     });

//   var request = {
//     location: pyrmont,
//     radius: 8047,
//     types: ['cafe'],
//     query: 'Google Inc.'
//   }
//   console.log('past request');

//   service = new google.maps.places.PlacesService(map);

//   console.log(service);
//   service.nearbySearch(request, callback);
// }

// function callback(results, status) {
//   console.log('in callback');
//   if (status == google.maps.places.PlacesService.OK) {
//     for (var i = 0; i < results.length; i++) {
//       createMarker(results[i]);
//     }
//   }
// }

// function createMarker(place) {
//   var placeLoc = place.geometry.location;
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location
//   });

//   google.maps.event.addListener(marker, 'click', function() {
//     infowindow.setContent(place.name);
//     infowindow.open(map, this);
//   });
// }
