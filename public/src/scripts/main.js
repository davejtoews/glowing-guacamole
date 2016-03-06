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
    shadowUrl: 'public/src/img/businessIconShadow.png',
    iconSize:     [36, 51], // size of the icon
    shadowSize:   [38, 51], // size of the shadow
    iconAnchor:   [36, 51], // point of the icon which will correspond to marker's location
    shadowAnchor: [24, 50],  // the same for the shadow
    popupAnchor:  [-18, -45] // point from which the popup should open relative to the iconAnchor
});

var eventIcon = L.icon({
	iconUrl: 'public/src/img/partyIcon.png',
	iconSize: [130, 57],
	iconAnchor: [66, 57],
	popupAnchor: [-3, -76]
});



if(!!navigator.geolocation){
	navigator.geolocation.getCurrentPosition(function(position){
		latitude_var = position.coords.latitude;
		longitude_var = position.coords.longitude;
		initmap(latitude_var, longitude_var);
		markers(latitude_var, longitude_var);
	});
} else {
	initmap(latitude_var, longitude_var);
	markers(latitude_var, longitude_var);
}


function initmap(latitude_var, longitude_var) {
	// set up the map

	L.mapbox.accessToken = 'pk.eyJ1Ijoib2JlNWVnaXJhZmZlIiwiYSI6ImNpbGZ4aDY5NDIyOWd2Zm1jajA1Ymx1dnkifQ.dURw54_s9uh7RBB8-E6NIA';
	var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

	map = new L.Map('map').addLayer(mapboxTiles).setView(new L.LatLng(latitude_var, longitude_var),15);
	L.marker([latitude_var, longitude_var], {icon: chipIcon}).addTo(map);
}

var businessData = {};

function markers(latitude_var, longitude_var){
	$.getJSON( "/nearme/" + latitude_var + "/" + longitude_var, function( response ) {
	  var items = [];
	  businessData = response.data;

	  response.data.forEach(function(datum){
	  	L.marker([datum.lat, datum.lng], {icon: businessIcon})
	  		.bindPopup('<p class="popup-title" onClick="openPage();" data-business-id="'+ datum._id +'">' + datum.name + '</p><div class="population"><svg><use xlink:href="#users"></use></svg>22</div>')
	  		.addTo(map);     
	  });
	});
}

function openPage(){
	//console.log('danks');
	$('.single-page').animate({left: '3%'},350);

}

var categoryData = {};

function getCategories() {
	$.getJSON( "/categories", function( response ) {
		categoryData = {};

		response.data.forEach(function(category){
			categoryData[capitalizeFirstLetter(category.name)] = category._id;
		});
		console.log(categoryData);
		var categories = response.data.map(function(category) {
			return capitalizeFirstLetter(category.name);
		});

		var input = document.getElementById("search-input");
		new Awesomplete(input, {
			list: categories,
			autoFirst: true
		});
	});
}

function capitalizeFirstLetter(string) {
	string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}
$('a.close-btn').click(function(){
	$('.single-page').animate({left: '-100%'},350);
});

getCategories();

function categorySearch() {
	var inputVal = $("#search-input").val();
	console.log(categoryData[inputVal])
}

$("#search-input").keydown(function(evt) {
    if (evt.keyCode == 13) {
        categorySearch();
    }
});

$("#search-button").click(function() {
	categorySearch();
});

