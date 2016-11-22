//called to save the parameters
function saveOptions() {
  //assigns the parameters to what is set in the settings
  var opacity = document.getElementById('opacity').value;
  var radius = document.getElementById('radius').value;
  var key = document.getElementById('trigger').value;
  var highlight = document.getElementById('color').value;
  
  //checks if the color is valid hex code
  if (verifyColor(highlight)) {
	  var canvas = document.getElementById('preview');
	  var context = canvas.getContext("2d");
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  
	  //places text in center of canvas
	  context.font = "30px Arial";
	  context.globalAlpha = 1;
	  context.textAlign = "center";
	  context.fillStyle = "black";
	  context.fillText("Lorem Ipsum Dolor", canvas.width/2, canvas.height/2);

	  //draws the circle with set parameters
	  context.fillStyle = "#".concat(highlight);
	  context.globalAlpha = opacity;
	  context.beginPath();
	  context.arc(canvas.width/2, canvas.height/2,  radius, 0, 2 * Math.PI);
	  context.closePath();
	  context.fill();
	  context.fillStyle = "black";

	  //chrome API to store data in JSON, anon function for when saved
	  chrome.storage.sync.set({
		color: highlight,
		opac: opacity,
		rad: radius,
		trigger: key
	  }, function() {
	  	//sets div status element to options saved for 1 second, then to empty
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		  status.textContent = '';
		}, 1000);
	  });
  } else {
  	  //if the hex code is not valid, changes text element to warning
	  var colorStatus = document.getElementById('colorStatus');
	  colorStatus.textContent = 'Invalid Hex Code';
	  setTimeout(function() {
		  colorStatus.textContent = '';
	  }, 1000);
  }
}

//sets the values of the sliders and other settings to saved settings. if not saved, then
//sets the values to default parameters
function restoreOptions() {
  //retrieves data saved, if not found then set these to default parameters 
  chrome.storage.sync.get({
    color: "FFEB3B",
    opac: .7,
    rad: 30,
    trigger: "h"
  }, function(items) {
  	//sets value of the sliders and settings to saved settings
    document.getElementById('color').value = items.color;
    document.getElementById('opacity').value = items.opac;
    document.getElementById('radius').value = items.rad;
    document.getElementById('trigger').value = items.trigger;

    //draws the circle and text preview to loaded preferences
	var opacity, radius, highlight;
	opacity = items.opac;
	radius = items.rad;
	highlight = items.color;
	
	var canvas = document.getElementById('preview');
	var context = canvas.getContext("2d");
  
	context.font = "30px Arial";
	context.globalAlpha = 1;
	context.textAlign = "center";
	context.fillStyle = "black";
	context.fillText("Lorem Ipsum Dolor", canvas.width/2, canvas.height/2);
	
	context.fillStyle = "#".concat(highlight);
	console.log(highlight);
	context.globalAlpha = opacity;
	context.beginPath();
	context.arc(canvas.width/2, canvas.height/2,  radius, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
	context.fillStyle = "black";
  });
}

//returns a boolean of whether the hex color code is valid
function verifyColor(str){
	str = str.toUpperCase();
	if(str.length != 6)
		return false;
	for(x = 0; x < 6; x++){
		var ch = str.charAt(x).charCodeAt();
		if(ch < 48 || (ch > 57 && ch < 65) || ch > 70)
			return false;
	}
	return true;
}

//when document loads, restore the options
document.addEventListener('DOMContentLoaded', restoreOptions);

//when save butotn is clicked, save options
document.getElementById('save').addEventListener('click', saveOptions);