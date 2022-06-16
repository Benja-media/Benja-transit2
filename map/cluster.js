const stops = []
const nearby = []
var geojson = []
window.onload = function() {
	prep()
}
mapboxgl.accessToken = "pk.eyJ1IjoiYmVuamFtaW5tYWhlcmFsIiwiYSI6ImNsMnFrbzJ1NjBhMGMzZXF2MXRqZjl2amoifQ.JEEcIMHMtYGXczwNb7GRRA";
// You will need to change this to your own mapbox token.
const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/benjaminmaheral/ckya716p90ezc15o6b5fox2a0",
    // You should be able to use this style
    hash: true,
    zoom: 18,
    cluster: true,
    center: [-75.6678, 45.3996],
    zoom: 14,
});
async function prep() {
	const request = await fetch("map/geo_stops.json") 
	const response = await request.json()
	const items = response.features
	for (var i = 0; i < items.length; i++){
		stops.push({
			geo: 	items[i].geometry.coordinates,
			name: items[i].properties.name,
			code: items[i].properties.code
		})
	}	
	console.log(stops)
}

map.on('load', function() {
    map.addSource('stops', {
        type: 'geojson',
        data: 'map/geo_stops.json',
        cluster: true,
        clusterMaxZoom: 14,
        // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
	createLayers()
})
function createLayers() {
	console.log("Creating layers...")
		console.log("Map Loaded!")
    map.addLayer({
        id: 'stops_cluster',
        type: 'circle',
        source: 'stops',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': ['step', ['get', 'point_count'], '#004777', 100, '#FF7700', 750, '#A30000'],
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
    });

    map.addLayer({
        id: 'stop_count',
        type: 'symbol',
        source: 'stops',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        },
			  paint: {
    		"text-color": "#ffffff"
  		}
    });

    map.addLayer({
        id: 'stop_id',
        type: 'symbol',
        source: 'stops',
        filter: ['!', ['has', 'point_count']],
				layout: {
					"text-field":["get","code"],
					"text-offset": [0,1.5],
					"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],

				},
        paint: {
            'text-color': "#004777",
        }
    });
		map.addLayer({
        id: 'single_stop',
        type: 'circle',
        source: 'stops',
        filter: ['!', ['has', 'point_count']],
				paint: {
					  'circle-radius': 7,
   					'circle-color': '#004777',
					}
    		});

    console.log("Added")
}
map.on('click', 'stops_cluster', (e)=>{
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['stops_cluster']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('stops').getClusterExpansionZoom(clusterId, (err,zoom)=>{
        if (err)
            return;

        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
        });
    }
    );
}
);

map.on('click', 'single_stop', (e)=>{
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(`<p>${e.features[0].properties.name}</p><button onclick=launch(this) code="${e.features[0].properties.code}">Track</button>`).addTo(map);
}
);
function locate() {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}


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
    
    const el = document.createElement('div');
    el.className = 'location';
    new mapboxgl.Marker(el).setLngLat([crd.longitude, crd.latitude]).setPopup(new mapboxgl.Popup({
        offset: 25
    })// add popups
    .setHTML("<p>Your location</p>")).addTo(map);
    map.flyTo({
        center: [crd.longitude, crd.latitude],
        zoom: 15
    });
    console.log(`More or less ${crd.accuracy} meters.`);
}


function createExtMarker(data) {
	console.log("EXT")
    const el = document.createElement('div');
    el.className = 'marker';
    el.setAttribute("code", data.stop_code)

    new mapboxgl.Marker(el).setLngLat([data.stop_lon, data.stop_lat]).setPopup(new mapboxgl.Popup({
        offset: 25
    })// add popups
    .setHTML("<p>" + data.stop_name + "</p><button onclick='launch(this)' code='" + data.stop_code + "'>Track</button>")).addTo(map);
}
function launch(element) {
    console.log(element.getAttribute("code"))
    window.location.href = "/map/?stop=" + element.getAttribute("code")
}
function geoError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    document.getElementById("msg").innerHTML = '<p><i class="material-icons">near_me_disabled</i>Ooops! Error getting your location! Is is allowed? (Try Clicking on the map on your location to see nearby stops!)</p>'
}

function check() {
    const mrk = document.getElementsByClassName("marker");
	
    console.log(length)
    console.log("LENGTH: " + mrk.length)
    if (mrk.length === 0 || mrk.length === "0") {
        console.log("HIDDEN")
        document.getElementById("msg").textContent = "Aww snap... No GPS data!"
        document.getElementById("map").setAttribute("style", "display:none")
        document.getElementById("map-btns").setAttribute("style", "display:none")
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
    document.body.scrollTop = 0;
    // For Safari
    document.documentElement.scrollTop = 0;
    // For Chrome, Firefox, IE and Opera
}

window.onscroll = function() {
    scrollFunction()
}
;
const topbtn = document.getElementById("totop")
topbtn.style.display = "none";

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topbtn.style.display = "block";
    } else {
        topbtn.style.display = "none";
    }
}

theme(localStorage.getItem("myTheme"),"onload")
function theme(data,trigger) {

	console.log(data)
    if (data === 'dark') {
        // Light theme
        map.setStyle('mapbox://styles/benjaminmaheral/ckzn82c2f001414mnvmkdaybw')
        // This is a theme I made. 	You can change it if you want
        document.getElementById("theme-btn").innerHTML = '<span class="material-icons">light_mode</span>Light theme'
        document.getElementById("theme-btn").setAttribute("onclick", "theme('light')")
        localStorage.setItem('myTheme', 'dark');
        document.body.setAttribute("style", "background-color: #040810 !important")
    }
    if (data === "light") {
        // Sat theme
        map.setStyle('mapbox://styles/benjaminmaheral/ckya716p90ezc15o6b5fox2a0')
        // Same here 
        document.getElementById("theme-btn").innerHTML = '<span class="material-icons">satellite_alt</span>Satellite'
        document.getElementById("theme-btn").setAttribute("onclick", "theme('dark')")
        localStorage.setItem('myTheme', 'light');
        document.body.setAttribute("style", "background-color: white !important")
    }
		if (trigger !== "onload") {
			console.log('Removing Layers')
			location.reload()
		}
}

// From search.js

async function search() {
		console.log("Search")
    const input = document.getElementById("lookup").value.replace("&", "/").replace(",", " / ")
    const result = document.getElementById("result")
    result.innerHTML = ""
    // Delete markers.
    const markers = Array.from(document.getElementsByClassName('marker'));

    markers.forEach(marker=>{
        marker.remove();
    }
    );

    for (var i = 0; i < stops.length; i++) {
        if (input.length > 3 && stops[i].stop_code != "") {
            if (stops[i].name.includes(input.toUpperCase()) || stops[i].code.includes(input)) {
								console.log(stops[i].name + " (" + stops[i].code + ")")
                var p = document.createElement("p")
                p.innerHTML = "<span>" + stops[i].code + "</span> " + stops[i].name.replace("/", "&")
                //document.getElementById("msg").innerHTML = ""
                p.setAttribute("stop_code", stops[i].code)
                p.setAttribute("stop_name", stops[i].name)
                p.addEventListener("click", function() {
                    window.location.href = "/map/?stop=" + this.getAttribute("stop_code")
                })
                result.appendChild(p)

                const el = document.createElement('div');
                el.className = 'marker';
                el.setAttribute("code", stops[i].code)
            }
        }
    }
}
