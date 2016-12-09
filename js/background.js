var posX = 0, posY = 0, scrollDelta = 0;
var key = '';
var highlightColor = "";
var radius, alpha;
var check, togglePressed = false, down = false;
var active = false, nextPage = false;
var drawnTick = 0;

restoreOptions();

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
sizeCanvas();
canvas.style.pointerEvents = "none";

$(document).mousemove(function(e) {
	if(active) {
		togglePressed = true;
		active = false;
	}
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
		active = false;

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
		}

		if(!check)
			down = false;
	}
});

document.addEventListener('mouseenter', (event) => {
	erase();
});

function displayCursorPos(){
	console.log("cursor at " + posX + " and " + posY)
}

function erase(){
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);

	drawnTick = 0;
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

	drawnTick++;
}

function restoreOptions(){
  chrome.storage.sync.get({
  	color: "FFEB3B",
    opac: 0.5,
    rad: 50,
    trigger: "u",
		toggle: true,
		activePage: false
  }, function(items) {
    alpha = items.opac;
    radius = items.rad;
    key = items.trigger;
    highlightColor = items.color;
		check = items.toggle;
		active = items.activePage;
  })
};

$(window).bind('beforeunload', function () {
	//if drawn after erased
	if ( drawnTick > 0 ) {
		active = true;
		//called to save the parameters
	} else {
		active = false;
	}
	saveOptions();
});

function saveOptions() {
	//chrome API to store data in JSON
	chrome.storage.sync.set({
		activePage: active
	});
};
