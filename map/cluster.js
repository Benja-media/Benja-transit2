mapboxgl.accessToken = "pk.eyJ1IjoiYmVuamFtaW5tYWhlcmFsIiwiYSI6ImNrbGJnOW5hdzByMTcycHRrYW81cTRtaDMifQ.xowWxUTgoDkvBMmkE18BiQ";
// You will need to change this to your own mapbox token.
	const map = new mapboxgl.Map({
		container: 'map',
		style: "mapbox://styles/benjaminmaheral/ckya716p90ezc15o6b5fox2a0",
		// You should be able to use this style
		hash: true,
		zoom: 18,
		cluster: true,
		center: [-75.309, 45.089],
		zoom: 6.83
	});

function locate() {navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);}


var geoOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function geoSuccess(pos) {
  var crd = pos.coords;
	
  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
	addMarker(crd.latitude,crd.longitude)
	console.log("Adding markers...")
// longitude -1
// 5,4 Less 6,5 more!
				const el = document.createElement('div');
				el.className = 'location';
				new mapboxgl.Marker(el)
					.setLngLat([crd.longitude, crd.latitude])
					.setPopup(
						new mapboxgl.Popup({ offset: 25 }) // add popups
							.setHTML(
								"<p>Your location</p>"
							)
					)
			.addTo(map);
			map.flyTo({center: [crd.longitude, crd.latitude], zoom: 15});

	// long -1 (-)
  console.log(`More or less ${crd.accuracy} meters.`);
}
const stops = []
/* ON LOAD TRIGER OUR FUNCTION */
window.onload = function() {
	//start()
	checkLocal()
	prep()
}

async function prep() {
	const fetch_url = "/map/gtfs.json"
	// You will need to change this to your own proxy server.
	const response = await fetch(fetch_url, {
		method: 'GET'
	})

	const data = await response.json()
	const marker = data.Gtfs
	for (var i = 0; i < marker.length; i++) {
		stops.push(marker[i])
		}
}

   function distance(lat1,lat2, lon1, lon2){
   
        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
   
        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlon / 2),2);
               
        let c = 2 * Math.asin(Math.sqrt(a));
   
        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;
        // calculate the result
        return(c * r);
    }

async function addMarker(latitude,longitude){	

const marker = stops;
	for (var i = 0; i < marker.length; i++) { 
		console.log(i)
			const length = distance(latitude.toString(),marker[i].stop_lat,longitude.toString(),marker[i].stop_lon).toString().split(".")
			if ( length[0] === "0") {
				console.log(length[0])
		const el = document.createElement('div');
					el.className = 'marker';
					el.setAttribute("code",marker[i].stop_code)
			
				new mapboxgl.Marker(el)
					.setLngLat([marker[i].stop_lon, marker[i].stop_lat])
					.setPopup(
						new mapboxgl.Popup({ offset: 25 }) // add popups
							.setHTML(
								"<p>" + marker[i].stop_name + "</p><button onclick='launch(this)' code='" + marker[i].stop_code + "'>Track</button>"
							)
					)
			.addTo(map);
		} 
	} 
}

function launch(element) {
	console.log(element.getAttribute("code"))
	window.location.href = "/map/?stop=" + element.getAttribute("code")
}
function geoError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
	alert("Location is turned off...")
}


function check(){
	const mrk = document.getElementsByClassName("marker");
	console.log(length)
	console.log("LENGTH: " + mrk.length)
		if (mrk.length === 0 || mrk.length === "0") {
			console.log("HIDDEN")
			document.getElementById("msg").textContent = "Aww snap... No GPS data!"
			document.getElementById("map").setAttribute("style","display:none")
			document.getElementById("map-btns").setAttribute("style","display:none")
		} else if (mrk.length === 1 || mrk.length === "1") {
			document.getElementById("map").removeAttribute("style")
			document.getElementById("map-btns").removeAttribute("style")
			document.getElementById("msg").textContent = "Yes! Map is able to load!"
			const lat1 = mrk[0].getAttribute("lat")
			const lon1 = mrk[0].getAttribute("long")
			map.jumpTo({
				center: [lon1, lat1],
				zoom: 15.8
			});
		}
}

function totop() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

window.onscroll = function () { scrollFunction() };
const topbtn = document.getElementById("totop")
topbtn.style.display = "none";

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		topbtn.style.display = "block";
	} else {
		topbtn.style.display = "none";
	}
}

function theme(data) {
	if (data === 'sat'){
		// Light theme
		map.setStyle('mapbox://styles/benjaminmaheral/ckzn82c2f001414mnvmkdaybw')
		// This is a theme I made. You can change it if you want
		document.getElementById("theme-btn").innerHTML = '<span class="material-icons">light_mode</span>Light theme'
		document.getElementById("theme-btn").setAttribute("onclick","theme('light')")
		localStorage.setItem('myTheme', 'light');
		document.body.setAttribute("style","background-color: #040810 !important")
	}
	if (data === "light"){
		// Sat theme
		map.setStyle('mapbox://styles/benjaminmaheral/ckya716p90ezc15o6b5fox2a0')
		// Same here 
		document.getElementById("theme-btn").innerHTML = '<span class="material-icons">satellite_alt</span>Satellite'
		document.getElementById("theme-btn").setAttribute("onclick","theme('sat')")
		localStorage.setItem('myTheme', 'sat');
		document.body.setAttribute("style","background-color: white !important")

	} 
}

function checkLocal(){
	const local = localStorage.getItem("myTheme")
	console.log(local)
	if (local !== null){
		console.log(local)
		console.log("Welcome back user")
		theme(local)
	}
}


// From search.js


async function search() {
	const input = document.getElementById("lookup").value.replace("&","/").replace(","," / ")
	const result = document.getElementById("result")
	result.innerHTML = ""
	// Delete markers.
	const markers = Array.from(document.getElementsByClassName('marker'));

	markers.forEach(marker => {
  	marker.remove();
	});

		for (var i = 0; i < stops.length; i++) {
			if (input.length > 3 && stops[i].stop_code != "") {
			if (stops[i].stop_name.includes(input.toUpperCase()) || stops[i].stop_code.includes(input) ) {

				console.log(stops[i].stop_name + " (" + stops[i].stop_code + ")")
				var p = document.createElement("p")
				p.innerHTML = "<span>" + stops[i].stop_code + "</span> " + stops[i].stop_name.replace("/","&")
				//document.getElementById("msg").innerHTML = ""
				p.setAttribute("stop_code", stops[i].stop_code)
				p.setAttribute("stop_name", stops[i].stop_name)
				p.addEventListener("click", function () {
					window.location.href = "/map/?stop=" + this.getAttribute("stop_code")
				})
				result.appendChild(p)

				const el = document.createElement('div');
					el.className = 'marker';
					el.setAttribute("code", stops[i].stop_code)
			
				new mapboxgl.Marker(el)
					.setLngLat([stops[i].stop_lon, stops[i].stop_lat])
					.setPopup(
						new mapboxgl.Popup({ offset: 25 }) // add popups
							.setHTML(
								"<p>" + stops[i].stop_name + "</p><button style='margin-left: 0px;'onclick='launch(this)' code='" + stops[i].stop_code + "'>Track</button>"
							)
					)
			.addTo(map);
			}
		}
	}
}