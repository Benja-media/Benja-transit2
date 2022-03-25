let base64String = "";
var bsa64
function imageUploaded() {
	var file = document.querySelector(
		'input[type=file]')['files'][0];

	var reader = new FileReader();
	console.log("next");

	reader.onload = function () {
		console.log("BASE64 = " + reader.result)
		base64String = reader.result/*.replace("data:", "")
			.replace(/^.+,/, "");*/
		// alert(imageBase64Stringsep);
		console.log(base64String);
		init(base64String)
		bsa64 = base64String
	}
	reader.readAsDataURL(file);
}


var smartCropCallback = function (data) {
	console.log("CROPPED!")
}
var crop
var croppr = new SmartCroppr("#cropper", {
	returnMode: "real",
	responsive: true,
	aspectRatio: 1,
	maxAspectRatio: 1.5,
	preview: "#cropPreview",
	smartcrop: true,
	debug: true,
	smartOptions: {
		face: true,
		preResize: 768,
		minWidth: 500,
		minHeight: 500,
		onSmartCropDone: data => {
			smartCropCallback(data)
			crop = data
			console.log(crop)
		}
	},
	onInitialize: instance => { },
	onCropEnd: data => { process(data) },
	onCropStart: data => { },
	onCropMove: data => { }
});
//for(var i=0; i < setImageBtn.length; i++) {
function init(bs64) {
	start = new Date();
	var callback = function () {
		croppr.resizeTo(1, 1, [0, 0], true, "ratio");
	};
	src = bs64
	croppr.setImage(src, callback, true, {
		face: true,
		//minScale: 0.5,
		minWidth: 500,
		minHeight: 500,
		onSmartCropDone: data => {
			smartCropCallback(data);
			crop = data
			console.log(crop)
		}
	});

}
function percentage(num, per)
{
  return (num/100)*per;
}

function process(data) {
  var canvas = document.getElementById("canvas")
  var context = canvas.getContext('2d');
  var img = new Image();
  
  img.onload = function() {
    canvas.width = data.width
    canvas.height = data.height

    // draw cropped image
    var w = data.width;
    var h = data.height;

    context.drawImage(img, data.x, data.y, w, h, 0, 0, w, h);
		var dataurl = canvas.toDataURL('image/jpeg', 1.0)
      console.log(dataurl)
  };
  img.src = document.getElementsByTagName("img")[0].src;
}

document.getElementById("htu_h2").addEventListener("click", function() {

	var div = document.getElementById("htu_p")
	var h2 = document.getElementById("htu_h2")
	div.removeAttribute("style")
	h2.textContent = "How to use"
});