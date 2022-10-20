mapboxgl.accessToken = "pk.eyJ1IjoiYmVuamFtaW5tYWhlcmFsIiwiYSI6ImNsMnFrbzJ1NjBhMGMzZXF2MXRqZjl2amoifQ.JEEcIMHMtYGXczwNb7GRRA";
// You will need to change this to your own mapbox token.
	const map = new mapboxgl.Map({
		container: 'map',
		style: "mapbox://styles/benjaminmaheral/ckya716p90ezc15o6b5fox2a0",
		// You should be able to use this style
		//hash: true,
		zoom: 13,
		//preserveDrawingBuffer: true
	});


function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
		function (m, key, value) {
			vars[key] = value;
		});
	return vars;
}
/* ON LOAD TRIGER OUR FUNCTION */
window.onload = async function() {
	try {
	await start()
	//await checkLocal()
	} catch (e) {
		console.log(e)
		document.getElementById("map-cont").remove()
		document.getElementById("map-btns").remove()
		document.getElementById("back").remove()
		document.getElementById("msg").textContent = "Whoops... Error fetching data..."
		//  <button id="back" onclick="window.location.href='/'"><span class="material-icons">arrow_back</span>Back</button>
		
		const msg_div = document.getElementById("msg-div")
		const button = document.createElement("button")
		button.setAttribute("onclick","window.location.href='/'")
		button.innerHTML = '<span class="material-icons">close</span>Cancel'
		msg_div.appendChild(button)
		return
	}
	document.getElementById("loading").remove()
	document.getElementById("main-body").removeAttribute("style")
}

function past(data){

	alert(date)
	const date = new Date()
		// Check correct time format and split into components
	const split = date.toString().split(" ")
	console.log(split)
	console.log(date - data)
}
async function start() {
	var param_stop = getUrlVars()['stop']
	console.log(param_stop)

	const fetch_url = "https://transit.benja-products.workers.dev/mode=GetNextTripsForStop/stopNo=" + param_stop
	// You will need to change this to your own proxy server.
	const response = await fetch(fetch_url, {
		method: 'GET'
	})
	

	const data = await response.json()
	console.log(data)
	const route = data.GetNextTripsForStopResult.Route.RouteDirection

	document.getElementById("stop_name").innerHTML = "<span>" + data.GetNextTripsForStopResult.StopNo + "</span>" + data.GetNextTripsForStopResult.StopLabel + "</h3>"
	document.title = "Departures for " + data.GetNextTripsForStopResult.StopLabel

	console.log(route.length)

		if (route.length === undefined){
			const rt_no = route.RouteNo
			console.log(rt_no)
			const label = route.RouteLabel
			console.log("LBL:" + label)
			var trip
			try {
			trip = route.Trips.Trip
			console.log(route.Trips.Trip)
			} catch (err){
				if (route.Trips.Trip === undefined){
					alert("Whoops... Unforeseen error.\nIs the stop being serviced?")
				} else {
					alert("Whoops... Unforeseen error")
				}
			}
			trip = route.Trips.Trip
			console.log(route.label)
			console.log(trip)
			if (trip.length === undefined) {
				const data = {
					i: 0,
					index: 0
				}
				const info = {
					number: rt_no,
					name: label
				}

				list(trip,info,data)
				createMarkers(trip,info,data)
			} else {
			console.log("None")
			for (var i = 0; i < trip.length; i++){
				const data = {
					i: i,
					index: i
				}
				const info = {
					number: rt_no,
					name: label
				}
				console.log(trip.TripStartTime)
				list(trip[i],info,data)
				createMarkers(trip[i],info,data)
			}
		}
		} else {
		route.forEach(function (item, index, array) {
			const rt_no = item.RouteNo
			console.log(rt_no)
			const label = item.RouteLabel
			console.log("LBL:" + label)
			
			const trip = item.Trips.Trip
			console.log(route.label)

			console.log(trip.length)
			for (var i = 0; i < trip.length; i++){
				const data = {
					i: i,
					index: i
				}
				const info = {
					number: rt_no,
					name: label
				}
				console.log(item.TripStartTime)
				list(trip[i],info,data)
				createMarkers(trip[i],info,data)
				}
		})
	}
}

function createMarkers(item,info,data) {
	
				console.log(info.number + " " + info.name)

				console.log(item.RouteLabel)
				
				if (item.Latitude !== "") {
				console.log(data.i, data.index)

				const el = document.createElement('div');
				el.setAttribute("long",item.Longitude)
				el.setAttribute("lat",item.Latitude)
				el.setAttribute("id",data.i)
				el.className = 'marker';
				el.setAttribute("data_id", data.i)


				new mapboxgl.Marker(el)
					.setLngLat([item.Longitude, item.Latitude])
					.setPopup(
						new mapboxgl.Popup({ offset: 25 }) // add popups
							.setHTML(
								"<h3><span>" + info.number + "</span>" + info.name + "</h3><p> ETA: " + eta(item.AdjustedScheduleTime) + "</p>"
							)
					)
					.addTo(map);
			} else {
				console.warn("No data " + data.i + "-" + data.index)
			}

			const time = new Date().toString().split(' ')
			const hm = tcov(time[4]).split(":")
			console.log(hm)
			document.getElementById("api_time").innerHTML = "Last updated: " + time[1] + " " + time[2] + " " + time[3] + ", " + hm[0] + ":" + hm[1] + " " + hm[2].split(" ")[1]
			check()	
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

function eta(addTime) {
	var oldDateObj = new Date()

	var diff = addTime
	var newDateObj = new Date(oldDateObj.getTime() + diff * 60000);
	console.log(newDateObj)
	
	var hms = newDateObj.toString().split(' ')[4];

	var hm = hms.toString().split(':')
	var eta = hm[0] + ":" + hm[1]
	
	return eta
}
function startTime(time) {
	console.error("GO!")
	var browserTime = new Date()
	var hms = browserTime.toString().split(' ')[4];
	var hm = hms.toString().split(':')
	var hour = hm[0] + ":" + hm[1]
	
	var diff = time
	console.log(oldDateObj - diff)
	console.log(newDateObj)

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

function tcov(time) {
	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

	if (time.length > 1) { 
		time = time.slice(1); 
		time[5] = +time[0] < 12 ? ' AM' : ' PM'; 
		time[0] = +time[0] % 12 || 12; 
	}
	return time.join(''); 
}

function pastORpresent(startTime) {
	const currentTime = new Date()
	const time = currentTime.toString().split(" ")
	const hm = time[4].split(":")
	const result = (hm[0] + hm[1]) - (startTime.replace(":",""))
	console.log(result)	
	// Result 
	if (result > 0) {
		const obj = {
			data: "Started at " + startTime,
			operator: ">"
		}
		return obj
	} 
	if (result < 0){
		const obj = {
			data: "Starting at " + startTime,
			operator: "<"
		}
		return obj
	}
	if (result === 0){
		const obj = {
			data: "Started right now",
			operator: "="
		}
		return obj
	}
}

function list(item,info,data) {
		//check()
		console.log(item)
		console.log(item.AdjustedScheduleTime)
			const main = document.getElementById("sq-times")
			const div = document.createElement("div")
			div.setAttribute("class","rt-cont")
			const h2 = document.createElement("h2")
			const p = document.createElement("p")
	
			h2.innerHTML = "<span>" + info.number + "</span> " + info.name
			p.innerHTML = "Arriving in: " + item.AdjustedScheduleTime + " mins (Starts at " + item.TripStartTime + ")"
		
	
			if (item.Longitude !== "") {
				p.innerHTML = p.innerHTML + '<i class="material-icons">navigation</i>'
				div.setAttribute("lat", item.Latitude)
				div.setAttribute("long", item.Longitude)
				div.addEventListener("click", function () {
					document.getElementById("map").scrollIntoView()
					map.flyTo({
						center: [
							item.Longitude,
							item.Latitude
						],
						zoom: 15.82,
						essential: true
					});
				})
			} else {
				p.innerHTML = p.innerHTML + '<i class="material-icons">location_disabled</i>'
			}
			div.appendChild(h2)
			div.appendChild(p)
			main.appendChild(div)
			console.log(" + " + item.AdjustedScheduleTime)
			console.log(eta(item.AdjustedScheduleTime))
}

function mapShot(){
	const cont = document.getElementsByClassName("mapboxgl-canvas")[0]
	console.error("MapShot() has been disabled for performance reasons.")
	return "ERR"
}
theme(localStorage.getItem("myTheme"))
function theme(data) {
	
	console.log("Theme " + data)
	console.log(localStorage.getItem("myTheme"))
	if (data === 'dark'){
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
		document.getElementById("theme-btn").setAttribute("onclick","theme('dark')")
		localStorage.setItem('myTheme', 'light');
		document.body.setAttribute("style","background-color: white !important")
	} 
}