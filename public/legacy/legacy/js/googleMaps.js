/** This file handles all Google Maps oriented activities. */

var initialLatitude;
var initialLongitude; 

var latitude; 
var longitude;
var path;

/* This method initializes the Google maps and outputs it on the page */
function initialize() {
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    var myOptions = {
        zoom: 14,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    var decodedPath = google.maps.geometry.encoding.decodePath(path.polyline);
    var decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

    var setRegion = new google.maps.Polyline({
        path: decodedPath,
        levels: decodedLevels,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
}

/* This method decodes the map from the summary polyline */
function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
        var level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
    }
    return decodedLevels;
}