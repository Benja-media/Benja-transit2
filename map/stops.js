function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }
/* PROXY WORKER */
var proxy = ""

let responseURL = "/config.json";
let proxy_res = new XMLHttpRequest();
proxy_res.open("GET", responseURL);
proxy_res.responseType = "text";
proxy_res.send();

proxy_res.onload = function() {
  const js_res = proxy_res.response;
  const js_par = JSON.parse(js_res);
  /* proxy(js_par);*/
  map(js_par)
};
//console.log(stop_no)
async function map(json){
var param_stop = getUrlVars()['stop']
console.log(param_stop)
var param_route = getUrlVars()['route']
console.log(param_route)
var param_test = getUrlVars()['test']

if (param_stop === undefined) {
	alert("Please specify a stop number")
	window.location.href = "/"
} else if (param_route === undefined) {
	alert("Please specify a route")
} 

if (param_test === "true" || param_test === true) {
  var fetch_url = "test.json"
  alert("WARNING! TEST MODE!\nTHIS DATA IS PROVIDED FOR TESTING ONLY!")
  console.log("%cWARNING!","color:orange;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold");
  console.log("%cThis map is for testing purposes only! The Map does not reflect any current data","font-size:24px;color:black")
  } else {
  var fetch_url = "%%https://api.octranspo1.com/v2.0/GetNextTripsForStopAllRoutes?appID=" + json['oc_api_id'] + "&apiKey=" + json['oc_api_key'] + "&stopNo=" + param_stop +"&format=JSON"
}

if (fetch_url.includes("%%")){
  var fetch_url = fetch_url.replace("%%", json['proxy_url'] + json['proxy_path'])
  console.log("PROXY CONNECTED!")
}

//const response = await fetch("https://proxy.oc-bot.workers.dev/?https://api.octranspo1.com/v2.0/GetNextTripsForStop?appID=dd45189d&apiKey=625afa18a90c52e104a9a2d5352f1a3c&stopNo=3579&routeNo=168&format=JSON")
const response = await fetch(fetch_url)

// Parsing JSON
const data = await response.json()

// Your array of latitudes and longitudes
const bus = data.GetNextTripsForStopResult.Route.RouteDirection.Trips.Trip
const route = data.GetNextTripsForStopResult.Route.RouteDirection
var route_no = route.RouteNo

document.title = "NEXT " + getUrlVars()['route'] + " FOR STOP #" +  getUrlVars()['stop']

  mapboxgl.accessToken = json['mapbox_api_key'];
    const map = new mapboxgl.Map({
      container: 'map',
      style: json['mapbox_style'],
      center: [bus[0].Longitude, bus[0].Latitude],
      zoom: 13
     // hash: 'pov'
    });
// get all your latitudes and longitudes 
for(i = 0; i < bus.length; i++){
  console.log(i + ") latitude :" + bus[i].Latitude);
  console.log(i + ") longitude  :" + bus[i].Longitude);

  const el = document.createElement('div');
  el.className = 'marker';
  if (bus[i].Longitude === "") {
  el.setAttribute("style","display:none")
  console.warn("#" + i + " NO DATA! (" + (i-1) +")")
  }

  new mapboxgl.Marker(el)
    .setLngLat([bus[i].Longitude, bus[i].Latitude])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
              `<h3>${route_no + " | " + bus[i].TripDestination}</h3>`
              )
          )
          .addTo(map);
    }
  }