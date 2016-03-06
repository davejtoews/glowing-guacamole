var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var latitude_var = 10;
var longitude_var = -80; 

var chipIcon = L.icon({
    iconUrl: 'public/src/img/chipIcon.png',
    iconSize:     [107, 55], // size of the icon
    iconAnchor:   [54, 53], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var businessIcon = L.icon({
    iconUrl: 'public/src/img/businessIcon.png',
    iconSize:     [108, 83], // size of the icon
    iconAnchor:   [54, 83], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

if(!!navigator.geolocation){
	navigator.geolocation.getCurrentPosition(function(position){
		latitude_var = position.coords.latitude;
		longitude_var = position.coords.longitude;
		initmap(latitude_var, longitude_var);
		markers();
	});
} else {
	initmap(latitude_var, longitude_var);
	markers();
}


function initmap(latitude_var, longitude_var) {
	// set up the map

	L.mapbox.accessToken = 'pk.eyJ1Ijoib2JlNWVnaXJhZmZlIiwiYSI6ImNpbGZ4aDY5NDIyOWd2Zm1jajA1Ymx1dnkifQ.dURw54_s9uh7RBB8-E6NIA';
	var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

	map = new L.Map('map').addLayer(mapboxTiles).setView(new L.LatLng(latitude_var, longitude_var),17);
	L.marker([latitude_var, longitude_var], {icon: chipIcon}).addTo(map);
}

function markers(){
	$.getJSON( "public/test.json", function( data ) {
	  var items = [];
	  console.log(data);
	  data.forEach(function(datum){
	  	console.log(datum);
	  	L.marker([datum.lat, datum.lon], {icon: businessIcon})
	  		.bindPopup(datum.details)
	  		.addTo(map);
	  });
	 
	});


}

