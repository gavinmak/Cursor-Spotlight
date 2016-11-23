var posX = 0, posY = 0, scrollDelta = 0;
var down = false, first = false;
var key = '';
var highlightColor = "";
var radius, alpha;

restoreOptions();

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
sizeCanvas();
canvas.style.zIndex = "-100";

$(document).mousemove(function(e) {
	posX = e.pageX;
	posY = e.pageY - $(document).scrollTop();
	if(down && first){
		canvas.style.zIndex = "999999999999";
		erase();
		drawCircle();
	}
});


document.addEventListener('keydown', (event) => {
	const keyName = event.key;
	if(keyName === key && !first){
		restoreOptions();
		down = true;
		first = true;
		canvas.style.zIndex = "99999999999";
		drawCircle();
	}

	displayCursorPos();
});

document.addEventListener('keyup', (event) => {
	const keyName = event.key;
	if(keyName === key){
		down = false;
		first = false;
		erase();
		canvas.style.zIndex = "-100";
	}
});

document.addEventListener('mouseenter', (event) => {
	down = false;
	first = false;
	erase();
	canvas.style.zIndex = "-100";
});

function displayCursorPos(){
	console.log("cursor at " + posX + " and " + posY)
}

function erase(){
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}

window.onresize = function(event){
	sizeCanvas();
}

function sizeCanvas(){
	canvas.style.position = "fixed";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

function drawCircle(){
	var context = canvas.getContext("2d");
	context.fillStyle = "#".concat(highlightColor.toUpperCase());
	context.globalAlpha = alpha;
	context.beginPath();
	context.arc(posX, posY + scrollDelta, radius, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
}

function restoreOptions(){
  chrome.storage.sync.get({
  	color: "FFEB3B",
    opac: 0.5,
    rad: 50,
    trigger: "F2"
  }, function(items) {
    alpha = items.opac;
    radius = items.rad;
    key = items.trigger;
    highlightColor = items.color;
  })
};

//toggle