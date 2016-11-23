var posX = 0, posY = 0, scrollDelta = 0;
var key = '';
var highlightColor = "";
var radius, alpha;
var check, togglePressed = false, down = false;

restoreOptions();

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
sizeCanvas();
canvas.style.zIndex = "-100";


$(document).mousemove(function(e) {
	posX = e.pageX;
	posY = e.pageY - $(document).scrollTop();
	if((down && !check) || togglePressed) {
		canvas.style.zIndex = "999999999999";
		erase();
		drawCircle();
	}
});


document.addEventListener('keydown', (event) => {
	const keyName = event.key;
	if(keyName === key){
		down = true;
		
		if(!check || !togglePressed) {
			restoreOptions();
			canvas.style.zIndex = "999999999999";
			erase();
			drawCircle();
		}
		
	}
});

document.addEventListener('keyup', (event) => {
	const keyName = event.key;
	if(keyName === key){
		if(check){
			if(togglePressed == true)
				togglePressed = false;
			else 
				togglePressed = true;
		}

		if(!togglePressed || !check) {
			erase();
			canvas.style.zIndex = "-100";
		}

		if(!check)
			down = false;
	}	
});

/*
document.addEventListener('mousedown', (event) => {
	if(togglePressed)
		canvas.style.zIndex = "-100";
});

document.addEventListener('mouseup', (event) => {
	if(togglePressed)
		canvas.style.zIndex = "99999999999999";
});
*/


document.addEventListener('mouseenter', (event) => {
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
	displayCursorPos();
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
    trigger: "F2",
	toggle: false
  }, function(items) {
    alpha = items.opac;
    radius = items.rad;
    key = items.trigger;
    highlightColor = items.color;
	check = items.toggle;
  })
};