var posX = 0, posY = 0, scrollDelta = 0;
var key = '';
var highlightColor = "";
var radius, alpha;
var check, togglePressed = false, down = false;
var active = false, nextPage = false;

// used to see if a circle is drawn when the page changes
var drawnTick = 0;

// restores options at the beginning
restoreOptions();

// canvas on which the circle is drawn, appended to page and made absolute positioning
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
sizeCanvas();

// allowed to click through canvas
canvas.style.pointerEvents = "none";

$(document).mousemove(function(e) {
	// if the circle had been drawn on the previous page without being erased
	if(active) {
		togglePressed = true;
		active = false;
	}
	// sets the position of the circle to the cursor position
	posX = e.pageX;
	posY = e.pageY - $(document).scrollTop();

	// if the toggle is pressed, then draw immediately
	if((down && !check) || togglePressed) {
		canvas.style.zIndex = "999999999999";
		erase();
		drawCircle();
	}
});

document.addEventListener('keydown', (event) => {
	const keyName = event.key;

	// if the key pressed is the same as the trigger
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
	// if the key pressed is the same as the trigger
	if(keyName === key){
		// if toggle is on, then toggle on/off the circle
		if(check){
			if(togglePressed)
				togglePressed = false;
			else
				togglePressed = true;
		}

		// if the toggle wasn't checked, then erase the circle
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

function erase(){
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);

	// on erase, the counter is set to 0
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

	// if a circle is drawn, make drawnTick non zero
	drawnTick++;
}

function restoreOptions(){
  chrome.storage.sync.get({
	  	color: "FFEB3B",
	    opac: 0.5,
	    rad: 50,
	    trigger: "F2",
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
	// if drawnTick is non zero, meaning a circle has been drawn but not erased,
	// and the toggle setting is checked
	if ( drawnTick > 0 && check) {
		active = true;
		// called to save the parameters
	} else {
		active = false;
	}
	saveOptions();
});

function saveOptions() {
	// chrome API to store data in JSON
	chrome.storage.sync.set({
		activePage: active
	});
};
