mapboxgl.accessToken = "pk.eyJ1IjoiYmVuamFtaW5tYWhlcmFsIiwiYSI6ImNrbGJnOW5hdzByMTcycHRrYW81cTRtaDMifQ.xowWxUTgoDkvBMmkE18BiQ";
// You will need to change this to your own mapbox token.
	const map = new mapboxgl.Map({
		container: 'map',
		style: "mapbox://styles/benjaminmaheral/ckya716p90ezc15o6b5fox2a0",
		// You should be able to use this style
		//hash: true,
		zoom: 10,
		center: [-75.6678, 45.3996],
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
		//document.getElementById("msg").textContent = "Whoops... Error fetching data..."
		//  <button id="back" onclick="window.location.href='/'"><span class="material-icons">arrow_back</span>Back</button>
		
		const msg_div = document.getElementById("msg-div")
		const button = document.createElement("button")
		button.setAttribute("onclick","window.location.href='/'")
		button.innerHTML = '<span class="material-icons">close</span>Cancel'
		msg_div.appendChild(button)
		return
	}
	//document.getElementById("loading").remove()
	//document.getElementById("main-body").removeAttribute("style")
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
	const route = data.arrivals

	document.getElementById("stop_name").innerHTML = "<span>" + data.stop.no + "</span>" + data.stop.label + "</h3>"
	document.title = "Departures for " + data.stop.label

	for (var i = 0; i < route.length; i++) {
    const elem = document.createElement("div")
		elem.setAttribute("id", "route-" + route[i].route )
    console.log(route[i].route)
		
		const p = document.createElement("h2")
		p.innerHTML = "<span>" + route[i].route + "</span>" + route[i].label

		elem.appendChild(p)

		const timepar = document.createElement("div")
		const time = times(route[i].trips,route[i].route,i)
		console.log(time)
		timepar.innerHTML = time
		
		elem.appendChild(timepar)
		document.getElementById("sq-times").appendChild(elem)

		const markers = document.getElementsByClassName("marker")
		if (markers.length !== 0) {
			console.log(markers[0].getAttribute("long"))
			//document.getElementById("msg").remove()
			const now = new Date()
			document.getElementById("api_time").innerHTML = "Last updated at " + now.getHours() + ":" + now.getMinutes() 

			map.flyTo({
				center: [Number(markers[0].getAttribute("long")), Number(markers[0].getAttribute("lat"))],
				zoom: 14,
			});
		} else if (markers.length === 0) {
			document.getElementById("msg").textContent = "No GPS data."
			document.getElementById("map-cont").remove()
			document.getElementById("map-btns").remove()
		}
	}
}

function times(data,route,no) {
	const main = document.createElement("div")
	main.setAttribute("class","route")

		for (var i = 0; i < data.length; i++) {
			const par = document.createElement("div")
			par.setAttribute("class","inner_route")
			const sign = document.createElement("h3")
			var d = new Date(data[i].schedule.date_obj);
			
			var mins = d.getMinutes().toString()

			if (mins.length === 1) {
				var mins = "0" + mins
			}
			sign.innerHTML = "<span>" + data[i].destination + "</span> Arriving at: " + d.getHours() + ':' + mins;
			
			const ft = document.createElement("div")
			ft.setAttribute("class","inner_route_attr")
			if (data[i].gps_status === true) {
				ft.appendChild(gicon("navigation"))

				const el = document.createElement('div');
				el.setAttribute("long",data[i].geo[0])
				el.setAttribute("lat",data[i].geo[1])
				el.setAttribute("id",i)
				el.className = 'marker';
				el.setAttribute("data_id", i)


				new mapboxgl.Marker(el)
					.setLngLat(data[i].geo)
					.setPopup(
						new mapboxgl.Popup({ offset: 25 }) // add popups
							.setHTML(
								"<h3><span>" + route + "</span>" + data[i].destination + "</h3><p> ETA: " + d.getHours() + ':' + mins + "</p>"
							)
					)
					.addTo(map);
				
			} else {
				ft.appendChild(gicon("location_disabled"))
			}
			const ft_p = document.createElement("p")

			if (data[i].trip.trip_start === true) {
				ft.appendChild(gicon("alarm_on"))
				ft_p.innerHTML = data[i].schedule.form_mins + " Mins | Departed at " + data[i].trip.start_time
				ft.appendChild(ft_p)
			} else {
				ft.appendChild(gicon("alarm_off"))
				ft_p.innerHTML = data[i].schedule.form_mins + " Mins | Departs at " + data[i].trip.start_time + " (Scheduled)"
				ft.appendChild(ft_p)
			}
			
			par.appendChild(sign)
			par.appendChild(ft)
			main.appendChild(par)
		}
	return main.innerHTML
}
function eta(time) {
	return new Date(time)
}

function date(time) {
	const s = new Date();
	s.setHours(Number(time.split(":")[0]))
	s.setMinutes(Number(time.split(":")[1]))

	const t = new Date()

 	console.log(s < t, time)
	return s < t
}
function gicon(name) {
	const i = document.createElement("i")
	i.setAttribute("class","material-icons")
	i.innerHTML = name
	return i
}

function totop() {
	window.scrollTo(0,0);
}