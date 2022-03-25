var localStopCode = localStorage.getItem("stop_code")
var localStopName = localStorage.getItem("stop_name")
if (localStopCode === null) {
	console.log("First Visit")
} else {
// Declare
	var welcome_div = document.getElementById("welcome")
	var welcome_p = document.getElementById("welcome_p")
	var welcome_button = document.getElementById("welcome_btn")
	var welcome_no = document.getElementById("welcome_nope")
// Show
	welcome_div.removeAttribute("style")
// Dynamic content
	welcome_p.innerHTML = "Welcome back! Are you still at \n" + localStopName + "?"
	welcome_button.innerHTML = "Yes"
// No button
	welcome_no.addEventListener("click",function() {
		welcome_div.setAttribute("style","display:none")
	})
// Yes button
	welcome_button.addEventListener("click",function(){
		console.log("Redirecting...")
		window.location.href = "/map/?stop=" + localStopCode 
	})
}



function scan() {
	console.log("Booting scanner...")
	var canv = document.getElementById("canvas")
	const url = canv.toDataURL()

	const worker = Tesseract.createWorker({
		logger: m => log(m)
	});
	Tesseract.setLogging(true);
	work();

	async function work() {
		await worker.load();
		await worker.loadLanguage('eng');
		await worker.initialize('eng');

		let result = await worker.detect(url);
		console.log(result.data);

		result = await worker.recognize(url);
		console.log(result.data);

		var text = result.data.text
		var number = text.replace(/\D/g, '');
		console.log(number)

		var stopno = number.substr(number.length - 4);
		console.log(stopno)
		redir(stopno)
		await worker.terminate();
	}
}

function log(logs) {
	// Declare
	var progress_bar = document.getElementById("progress_bar")
	var progres_parent = document.getElementById("progress")
	var p = document.getElementById("progress_text")
	var progress0 = logs.progress.toString().replace("0.", "")
	var progress = progress0.slice(0, 2);

	progres_parent.removeAttribute("style")
	progress_bar.style.width = "0%"

	if (progress === "1") {
		progress = "100"
	};
	if (logs.status === "recognizing text") {
		progress_bar.style.width = progress + "%"
	};

	console.log(logs.status + " | " + progress + "%")
	p.innerHTML = logs.status + " | " + progress + "%"
}

async function redir(stop) {
	var response = await fetch("/map/gtfs.json")
	const data = await response.json()
	const js_data = data.Gtfs
	// iterate over each element in the array
	for (var i = 0; i < js_data.length; i++) {
		// look for the entry with a matching `code` value
		if (js_data[i].stop_code == stop) {
			var stop_name = js_data[i].stop_name.replace("\/", "&")
			swal("We found it!", "Are you at " + stop_name + "?", {
				buttons: ["No, I am not here", "Yes! I am here"],
			});
		var confirm = document.getElementsByClassName("swal-button--confirm");
		confirm[0].addEventListener("click",function() {
			
			window.location.href = "/map/splash.html?stop=" + stop
			localStorage.setItem('stop_code',stop );
			localStorage.setItem("stop_name",stop_name)
			});
		};
	}
}

