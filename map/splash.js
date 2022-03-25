function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }

if (getUrlVars()['from'] === "scan") {
}

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
  start_splash(js_par)
};
var splash_stop = getUrlVars()['stop']
async function start_splash(json) {
var param_stop = getUrlVars()['stop']
console.log(param_stop)
var param_test = getUrlVars()['test']
console.log(param_test)


if (param_stop === undefined) {
	alert("Please specify a stop")
	window.location.href = "/"
}

if (param_test === "true" || param_test === true) {
  var splash_url = "splash.json"
  alert("WARNING! TEST MODE!\nTHIS DATA IS PROVIDED FOR TESTING ONLY!")
  console.log("%cWARNING!","color:orange;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold");
  console.log("%cThis map is for testing purposes only! The Map does not reflect any current data","font-size:24px;color:black")
  } else {
	var splash_url = "https://transit.benja-products.workers.dev/mode=GetRouteSummaryForStop/stopNo=" + splash_stop
  //var splash_url = "%%https://api.octranspo1.com/v2.0/GetRouteSummaryForStop?appID=dd45189d&apiKey=625afa18a90c52e104a9a2d5352f1a3c&stopNo=" + splash_stop +"&format=JSON"
}

if (splash_url.includes("%%")){
  var splash_url = splash_url.replace("%%", json['proxy_url'] + json['proxy_path'])
  console.log("PROXY CONNECTED!")
}	
	//const response = await fetch("https://proxy.oc-bot.workers.dev/?https://api.octranspo1.com/v2.0/GetNextTripsForStop?appID=dd45189d&apiKey=625afa18a90c52e104a9a2d5352f1a3c&stopNo=3579&routeNo=168&format=JSON")
  const splash_res = await fetch(splash_url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	})
  // Parsing JSON
  const splash = await splash_res.json() 
  const stop = splash.GetRouteSummaryForStopResult.Routes.Route

  const div = document.getElementById("routes");
	
	if (stop.RouteNo !== undefined && stop.length === undefined ) {
	window.location.href = "/map/?stop=" + splash_stop + "&route=" + stop.RouteNo + "&rt=1"
	}

  for (let i = 0; i < stop.length; i++) {
        const route_div = document.createElement("li");
        const h2 = document.createElement("h2");
        route_div.addEventListener("click", function() {
          window.location.href="/map/?stop=" + splash_stop + "&route=" + stop[i].RouteNo 
        });
        route_div.setAttribute("class","rt_cont")
        h2.innerHTML = "<span>" + stop[i].RouteNo + "</span> " + stop[i].RouteHeading

        route_div.appendChild(h2);

        div.appendChild(route_div);

			
      }
	
}