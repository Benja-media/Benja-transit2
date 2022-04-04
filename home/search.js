var stops = []

window.onload = async function() {
	await prep()
	//document.getElementById("track").innerHTML = '<input type="text" id="search" class="stp-search" placeholder="Stop name" autofocus onkeyup="search()" onfocus="focus()"></input>'
	//alert("The OC Transpo Data Feed is about as reliable as the LRT...\nCurrently I am having issues connecting to the API")
}

async function prep() {
	const response = await fetch("/map/gtfs.json")
	// Make sure to update this file regularly. 
	const gtfs = await response.json()
	const data = gtfs.Gtfs
	//console.log(data.length)
		for (var i = 0; i < data.length; i++) {
			stops.push(data[i])
			const ld = document.getElementById("ld")
				if (ld != undefined) {
					ld.remove()
					// Remove the loading text
				} 
		}
}

async function search() {
	const input = document.getElementById("lookup").value.replace("&","/").replace(","," / ")
	const result = document.getElementById("result")
	result.innerHTML = ""

	if (isN(input) === false) {
		// Check if it is a string for search
		for (var i = 0; i < stops.length; i++) {
			if (stops[i].stop_name.includes(input.toUpperCase()) && input.length > 3 && stops[i].stop_code != "" ) {

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

			}
		}
	}
	
	if (isN(input) === true) {
		// Check if it is a string for search
		for (var i = 0; i < stops.length; i++) {

			if (stops[i].stop_code.includes(input)) {
				document.getElementById("msg").innerHTML = ""
				var p = document.createElement("p")
				p.innerHTML = stops[i].stop_name + " " + stops[i].stop_code
				p.setAttribute("stop_code", stops[i].stop_code)
				p.setAttribute("stop_name", stops[i].stop_name)
				p.addEventListener("click", function () {
					var input = document.getElementById("search")
					input.value = p.getAttribute("stop_name") + " (" + p.getAttribute("stop_code") + ")"
					window.location.href = "/map/?stop=" + p.getAttribute("stop_code")
				})
				document.getElementById("result").appendChild(p)
			}
		}
	}
	console.log(input)
}

function isN(req) {
	var res = /1|2|3|4|5|6|7|8|9/.test(req);
	return res
}