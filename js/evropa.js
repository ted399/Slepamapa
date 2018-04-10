
var map;
var markers = [];
var currentQuestion = 0;
var spravne = 0;
var spatne = 0;
        


      function initMap() {
        var praha = {name:"Praha", location:new google.maps.LatLng(50.0755, 14.4378)}
        var brno = {name:"Brno", location:new google.maps.LatLng(49.1951, 16.6068)}
        var karlovy = {name:"Karlovy Vary", location:new google.maps.LatLng(50.2319, 12.8720)}
        var krumlov = {name:"Český Krumlov", location:new google.maps.LatLng(48.8127, 14.3175)}
        var mesta = [praha, brno, karlovy, krumlov];
        var totQuestions = mesta.length;
        var p1 = 0;
        
        

        var evropa = {lat: 54.5260, lng: 15.2551};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: evropa,
          styles: [
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
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
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
    }
]
        });
        map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true, disableDefaultUI: true});

        var geocoder = new google.maps.Geocoder();


    function load (questionIndex){  
        document.getElementById('question').innerHTML = mesta[questionIndex].name;
        p1 = mesta[questionIndex].location;
    }
          
    load(currentQuestion);

          google.maps.event.addListener(map, 'click', function(event){
            placeMarker(event.latLng);
            geocoder.geocode({
                'latLng': event.latLng
                    }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        console.log(results[0]);
      }
    }
  });});

            google.maps.event.addDomListener(document.getElementById('start'), 'click', function() {
                      
                        currentQuestion ++;


                      calcDistance(p1, markers[0].getPosition());
                      if (calcDistance(p1, markers[0].getPosition()) < 20) {
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
                            document.getElementById('gameover-paragraph').innerHTML = 'Konec, tvá úspěšnost je: ' + finalscore.toFixed(0) + '%';
                        }
                        };   
          });
        
          




          function calcDistance(p1, p2) {
            return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
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


