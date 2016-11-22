var posX, posY, scrollDelta = 0;
var down = false, first = false;
var key = '';
var highlightColor = "";
var radius, alpha;

restoreOptions();

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
sizeCanvas();
canvas.style.zIndex = "-100";

document.addEventListener('mousemove', function(loc) {
  posX = loc.x;
  posY = loc.y;
  if(down && first){
  	canvas.style.zIndex = "999999999999";
	erase();
	drawCircle();
  }
});


document.addEventListener('scroll', function(e) {
	$(document).scroll(function() {
		scrollDelta = $(document).scrollTop();
		sizeCanvas();
	});
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
	canvas.style.position = "absolute";
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
    opac: 0.7,
    rad: 30,
    trigger: "h"
  }, function(items) {
    alpha = items.opac;
    radius = items.rad;
    key = items.trigger;
    highlightColor = items.color;
  })
};