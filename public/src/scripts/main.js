var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var latitude_var = 10;
var longitude_var = -80; 



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
	map = new L.Map('map');
	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});		
	console.log(latitude_var, longitude_var);
	
	map.setView(new L.LatLng(latitude_var, longitude_var),17);
	map.addLayer(osm);
}

function markers(){
	$.getJSON( "public/test.json", function( data ) {
	  var items = [];
	  console.log(data);
	  data.forEach(function(datum){
	  	console.log(datum);
	  	L.marker([datum.lat, datum.lon])
	  		.bindPopup(datum.details)
	  		.addTo(map);
	  });
	 
	});


}

