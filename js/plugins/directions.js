var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map_id = $("#map_canvas");
var map_lat = map_id.attr('data-mapLat');
var map_lon = map_id.attr('data-mapLon');
var map_title = map_id.attr('data-mapTitle');

function initialize() {
  var latlng = new google.maps.LatLng(map_lat, map_lon);
  var rendererOptions = {
    draggable: true
  };
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var myOptions = {
    zoom: 14,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directionsPanel"));
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: map_title
  });
}

function calcRoute() {
  initialize();
  var travelMode = $('input[name="travelMode"]:checked').val();
  var start = $("#routeStart").val();
  var via = $("#routeVia").val();
  if (travelMode == 'TRANSIT') {
    via = '';
  }
  var end = (map_lat + ',' + map_lon);
  var waypoints = [];
  if (via != '') {
    waypoints.push({
      location: via,
      stopover: true
    });
  }
  var request = {
    origin: start,
    destination: end,
    waypoints: waypoints,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    travelMode: google.maps.DirectionsTravelMode[travelMode]
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      $('#directionsPanel').empty();
      directionsDisplay.setDirections(response);
    } else {
      if (status == 'ZERO_RESULTS') {
        alert('No route could be found between the origin and destination.');
      } else if (status == 'UNKNOWN_ERROR') {
        alert('A directions request could not be processed due to a server error. The request may succeed if you try again.');
      } else if (status == 'REQUEST_DENIED') {
        alert('This webpage is not allowed to use the directions service.');
      } else if (status == 'OVER_QUERY_LIMIT') {
        alert('The webpage has gone over the requests limit in too short a period of time.');
      } else if (status == 'NOT_FOUND') {
        alert('At least one of the origin, destination, or waypoints could not be geocoded.');
      } else if (status == 'INVALID_REQUEST') {
        alert('The DirectionsRequest provided was invalid.');
      } else {
        alert("There was an unknown error in your request. Requeststatus: nn" + status);
      }
    }
  });
}
