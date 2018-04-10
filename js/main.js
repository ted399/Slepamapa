


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDHBJwFoWZyc1ILPyR-ec9pqXK-Md82JWQ",
    authDomain: "slepamapa-7a8b3.firebaseapp.com",
    databaseURL: "https://slepamapa-7a8b3.firebaseio.com",
    projectId: "slepamapa-7a8b3",
    storageBucket: "slepamapa-7a8b3.appspot.com",
    messagingSenderId: "205137213145"
  };
  firebase.initializeApp(config);


// End Initialize Firebase

//ZJISTOVANI O JAKOU JDE MAPU
var mapalink = 0;
var list = document.getElementById('list');
 var ref = firebase.database().ref('mapy');

function nejak (neco){
  mapalink = neco;
  initMap(mapalink);
  document.getElementById('mapa').classList.remove("hide");
  document.getElementById('container-maps-list').classList.add("hide");
}

ref.on('value', gotData, errData);

function gotData(data) {
  //console.log(data.val());
  var mapa = data.val();
  var keys = Object.keys(mapa);
  console.log(keys);



  for (var i = 0; i < keys.length; i++){
    var li = document.createElement('li');


    li.innerText = keys[i];
    li.setAttribute('onclick', 'nejak(innerHTML)');
    list.appendChild(li);


  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}
//KONEC ZJISTOVANI O JAKOU JDE MAPU

var map;
var markers = [];
var currentQuestion = 0;
var spravne = 0;
var spatne = 0;
var presnost = 0;




      function initMap(link) {
        var ref = firebase.database().ref('mapy/'+link);
        ref.on('value', gotData, errData);
        //Firebase data
        function gotData(data) {
          //console.log(data.val());
          var mapa = data.val();
          var keys = Object.keys(mapa);
          //console.log(keys);

        var mesta = [];

          for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var nazevmesta = mapa[k].nazevmesta;
            var lat = mapa[k].lat;
            var lng = mapa[k].lng;
            var mesto = new Object();
            mesto.name = nazevmesta;
            mesto.lat = lat;
            mesto.lng = lng;

            mesta.push(mesto);



          }
          console.log(mesta);


//ZKUSIME VSE SOUPNOU SEM
var totQuestions = mesta.length;
var p1 = 0;

console.log(mesta);

var cesko = {lat: 49.8175, lng: 15.4730};
map = new google.maps.Map(document.getElementById('map'), {
  zoom: 7,
  center: cesko,
  styles: [
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#353535"
                    },
                    {
                        "weight": "2.92"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": "-100"
                    },
                    {
                        "lightness": "-50"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
});
map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true, disableDefaultUI: true});

var geocoder = new google.maps.Geocoder();


function load (questionIndex){
document.getElementById('question').innerHTML = mesta[questionIndex].name;
p1 = mesta[questionIndex].lat;
p2 = mesta[questionIndex].lng;
}

load(currentQuestion);

  google.maps.event.addListener(map, 'click', function(event){
    placeMarker(event.latLng);
    geocoder.geocode({
        'latLng': event.latLng
            }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
if (results[0]) {
console.log(results[0].address_components[3].short_name);
}
}
});});

    google.maps.event.addDomListener(document.getElementById('start'), 'click', function() {

                currentQuestion ++;


              var dist = calcDistance(p1, p2, markers[0].getPosition().lat(), markers[0].getPosition().lng());
              if (dist <= 5) {
                presnost+=1;
              }
              if (dist > 5 && dist<= 10) {
                presnost+=2;
              }
              if (dist > 10 && dist<= 15) {
                presnost+=3;
              }
              if (dist > 15 && dist<= 20) {
                presnost+=4;
              }
              if (dist > 20) {
                presnost+=5;
              }



              calcDistance(p1, p2, markers[0].getPosition().lat(), markers[0].getPosition().lng());
              if (calcDistance(p1, p2, markers[0].getPosition().lat(), markers[0].getPosition().lng()) < 20) {
                spravne ++;

                document.getElementById('spravne').innerHTML = spravne;
                document.getElementById('success-alert-overlay').style.display='block';
                document.getElementById('success-alert-button').addEventListener('click', function() {
                    document.getElementById('success-alert-overlay').style.display='none';

                    deleteMarkers();
                    end();
                    load(currentQuestion);
                });

                //marker.setIcon('http://maps.gstatic.com/mapfiles/icon_green.png')
              }
              else {
                spatne ++;
                document.getElementById('spatne').innerHTML = spatne;
                document.getElementById('fail-alert-overlay').style.display='block';
                document.getElementById('fail-alert-button').addEventListener('click', function() {
                    document.getElementById('fail-alert-overlay').style.display='none';
                    deleteMarkers();
                    end();
                    load(currentQuestion);
                });
              }

             function end(){ if(currentQuestion == totQuestions){
                    document.getElementById('gameover-overlay').style.display='table';
                    var finalscore = spravne/totQuestions*100;
                    var vyslednapresnost = presnost/totQuestions;
                    document.getElementById('gameover-paragraph').innerHTML = "Konec, tvá úspěšnost je: " + finalscore.toFixed(0) + "%<br>Za přesnost bys ve škole dostal známku: " + vyslednapresnost.toFixed(0);
                    document.getElementById('restart-button').onclick = function repeat() {
                      document.getElementById('gameover-overlay').style.display='none';
                      spravne = 0;
                      spatne = 0;
                      document.getElementById('spatne').innerHTML = spatne;
                      document.getElementById('spravne').innerHTML = spravne;
                      currentQuestion = 0;
                      presnost = 0;
                     load(currentQuestion);
                    }
                    document.getElementById('goback-button').onclick = function goback() {
                      window.location.href = 'index.html';
                    }


                }
                };
  });


//VYPOCET VZDALENOSTI

  function calcDistance(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
  }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }



};



function placeMarker(location) {
    deleteMarkers();
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'img/marker.png',
        draggable: false
    });
    markers.push(marker);
  }

  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }


  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

//A UVIDIME, CO SE STANE



        }

        function errData(err) {
          console.log('Error!');
          console.log(err);
        }
        //END Firebase data
