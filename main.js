'use strict';

var map;
var infowindow;
var place;
var rad;
var center;
var price;
var gmarkers = [];
var pokemon;
var pokeImage;

function initMap() {
  //get current position
  navigator.geolocation.getCurrentPosition(function(position){
    center = {lat: position.coords.latitude, lng: position.coords.longitude};
    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 13
    });

    var icon = {
      url: "http://orig09.deviantart.net/66d5/f/2013/266/0/4/satoshi__ash__sprite___kalos_by_binarypeaches-d6nl1n7.gif", // url
      scaledSize: new google.maps.Size(60, 60), // scaled size
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

  });

  $.ajax("http://pokeapi.co/api/v1/pokedex/1/")
  .done(function(data){
    pokemon = data.pokemon;
  })
  .fail(function(error){
    console.log(error);
  });

  $('#find').on('click', placeMarkers);
  $('#radius').on('click', filterMarkersByRadius);
  // $('#price').on('click', filterMarkersByPrice);
}

function placeMarkers() {
  removeMarkers();
  var input = $('#inputPlace').val();
  place = input;
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: center,
    radius: 8047,
    types: [ place ]
  }, callback);
}

function filterMarkersByRadius() {
  removeMarkers();
  var inputRad = $('#inputRadius').val();
  rad = inputRad;
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: center,
    radius: (rad * 1609.34),
    types: [ place ]
  }, callback);
}

// function filterMarkersByPrice() {
//   removeMarkers();
//   var inputPrice = $('#inputPrice').val();
//   price = inputPrice - 1;
//   console.log('inputPrice', price);
//   var service = new google.maps.places.PlacesService(map);
//   service.nearbySearch({
//     location: center,
//     radius: (rad * 1609.34 || 8000),
//     types: [ place ],
//     minprice: price,
//     maxprice: price
//   }, callback);
// }

function removeMarkers(){
  for(var i = 0; i < gmarkers.length; i++){
    gmarkers[i].setMap(null);
  }
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var randNum = Math.floor(Math.random() * pokemon.length);
  $.ajax("http://pokeapi.co/api/v1/pokemon/" + randNum) // request info for one pokemon
  .done(function(pokemon){ // data received for pokemon
    $.get("http://pokeapi.co/" + pokemon.sprites[0].resource_uri) // request image info
    .done(function(data){ // image info received
      pokeImage = {
        url: "http://pokeapi.co" + data.image,
        scaledSize: new google.maps.Size(80, 80), // scaled size
      }
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: pokeImage
      });
      gmarkers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 
          'Address: ' + place.vicinity + '<br>' + 'Rating (scale 1-5): ' + 
          place.rating + '<br>' + 'Price (scale 1-5): ' + place.price_level + 
          '<br>' + `<img id="theImg" src='${place.icon}'' style="height: 35px" style="width: 35px"/>` + 
          '<br>' + '</div>');
        infowindow.open(map, this);
      });
    })
    .fail(function(error){
      console.log(error);
    });
  })
  .fail(function(error){
    console.log(error);
  });
}

