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
	shadowUrl: 'public/src/img/partyIconShadow.png',
	iconSize: [40, 38],
	shadowSize:   [47, 37],
	iconAnchor: [20, 36],
	shadowAnchor: [10, 36],
	popupAnchor: [-1, -34]
});


if(!!navigator.geolocation){
	navigator.geolocation.getCurrentPosition(function(position){
		latitude_var = position.coords.latitude;
		longitude_var = position.coords.longitude;
		initmap(latitude_var, longitude_var);
		eventsMarkers(latitude_var, longitude_var);
	});
} else {
	initmap(latitude_var, longitude_var);
	eventsMarkers(latitude_var, longitude_var);
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
var businessMarkerArray = new Array();

function businessMarkers(categoryId, latitude_var, longitude_var){
	$.getJSON( "/biznearme/" + categoryId + "/" + latitude_var + "/" + longitude_var, function( response ) {
	  var items = [];
	  businessData = response.data;
	  businessMarkerArray.forEach(function(businessMarker){
	  	map.removeLayer(businessMarker);
	  });
	  response.data.forEach(function(datum){
	  	businessMarker = new L.marker([datum.lat, datum.lng], {icon: businessIcon})
	  		.bindPopup('<p class="popup-title" onClick="openBusinessPage(\''+ datum._id +'\');" >' + datum.name + '</p>')
	  		.addTo(map);
  		businessMarkerArray.push(businessMarker);     
	  });
	});
}

var eventData = {};

function eventsMarkers(latitude_var, longitude_var){
	$.getJSON( "/eventsnearme/" + latitude_var + "/" + longitude_var, function( response ) {
	  var items = [];
	  eventData = response.data;

	  response.data.forEach(function(datum){
	  	L.marker([datum.lat, datum.lng], {icon: eventIcon})
	  		.bindPopup('<p class="popup-title" onClick="openEventPage(\''+ datum._id +'\');" >' + datum.name + '</p><div class="population"><svg><use xlink:href="#users"></use></svg>22</div>')
	  		.addTo(map);     
	  });
	});
}

function openBusinessPage(businessId){
	$('.single-page').animate({left: '3%'},350);
	getBusinessInfo(businessId);
}

function getBusinessInfo(businessId) {
	var businessName;
	var businessAddress;
	var businessCategories;

	businessData.forEach(function(business){
		if(business._id == businessId) {
			businessName = capitalizeFirstLetterOfEveryWord(business.name);
			businessAddress = business.address;
			businessCategories = business.categories;
		}
	});

	populateBusinessDetails(businessName, businessAddress, businessCategories);
}

function populateBusinessDetails(businessName, businessAddress, businessCategories) {
	$("#business-name").html(businessName);
	$("#business-address").html(businessAddress);

	var listHtml = "";
	businessCategories.forEach(function(category) {
		listHtml += "<li>" + categoryById[category] + "</li>";
	});
	$("#business-categories").html(listHtml);
	$("#event-description").html("");
	$("#event-date").html("");
	
}

function openEventPage(eventId){
	$('.single-page').animate({left: '3%'},350);
	getEventInfo(eventId);
}

function getEventInfo(eventId) {
	var eventName;
	var eventAddress;
	var eventDescription;
	var eventDate;

	eventData.forEach(function(event){
		if(event._id == eventId) {
			eventName = event.name;
			eventAddress = event.address;
			eventDescription = event.description;
			eventDate = new Date(event.date);
		}		
	});
	populateEventDetails(eventName, eventAddress, eventDescription, eventDate);
}

function populateEventDetails(eventName, eventAddress, eventDescription, eventDate) {
	var dateString = moment(eventDate).format("d MMM YYYY");
	$("#business-name").html(eventName);
	$("#business-address").html(eventAddress);
	$("#event-description").html(eventDescription);
	$("#business-categories").html("");
	$("#event-date").html(dateString);
}


var categoryByName = {};
var categoryById = {};

function getCategories() {
	$.getJSON( "/categories", function( response ) {

		response.data.forEach(function(category){
			categoryByName[capitalizeFirstLetter(category.name)] = category._id;
		});

		response.data.forEach(function(category){
			categoryById[category._id] = capitalizeFirstLetter(category.name);
		});

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

function capitalizeFirstLetterOfEveryWord(string) {
	words = string.split(" ");
	words = words.map(function(word) {
		return capitalizeFirstLetter(word);
	});
    return words.join(" ");
}

$('a.close-btn').click(function(){
	$('.single-page').animate({left: '-100%'},350);
});

getCategories();

function categorySearch() {
	var inputVal = $("#search-input").val();
	categoryId = categoryByName[inputVal];
	businessMarkers(categoryId, latitude_var, longitude_var);
}

$("#search-input").keydown(function(evt) {
    if (evt.keyCode == 13) {
        categorySearch();
    }
});

$("#search-button").click(function() {
	categorySearch();
});

