var opacity, radius, highlight, check;
var initOpacity, initRadius;
$('#trigger').attr('readonly', true);

// called to save the parameters
function saveOptions() {
  // assigns the parameters to what is set in the settings
  var key = document.getElementById('trigger').value;

	// chrome API to store data in JSON, anon function for when saved
	chrome.storage.sync.set({
  	color: highlight,
  	opac: opacity,
  	rad: radius,
  	trigger: key,
  	toggle: check,
    activePage: false
  	}, function() {
  		// sets div status element to options saved for 1 second, then to empty
  		$("#save-status").text("Options saved!");
  		setTimeout(function() {
  				$("#save-status").text("");
  		}, 1000);
	});
}

// sets the values of the sliders and other settings to saved settings. if not saved, then
// sets the values to default parameters
function restoreOptions() {
  // retrieves data saved, if not found then set these to default parameters
  chrome.storage.sync.get({
    color: "FFEB3B",
    opac: .5,
    rad: 50,
    trigger: "F2",
		toggle: true,
    activePage: false
  }, function(items) {
  	// sets value of the sliders and settings to saved settings
    document.getElementById('trigger').value = items.trigger;

    // draws the circle and text preview to loaded preferences
		opacity = items.opac;
		radius = items.rad;
		highlight = items.color;
		check = items.toggle;
		$('#toggle').prop('checked', check);
		drawCircle(opacity, radius, highlight);
  });
}

// when document loads, restore the options
document.addEventListener('DOMContentLoaded', restoreOptions);

// when save button is clicked, save options
$("#save-button").click(function() {
	saveOptions();
});

$(function() {
	// slider for opacity
	var handleOpacity = $("#opacity");
	$("#opacity-slider").slider({
		create: function() {
			handleOpacity.text($(this).slider("value"));
		},
		slide: function(event, ui){
			handleOpacity.text(ui.value);
			opacity = ui.value;
			drawCircle(opacity, radius, highlight);
		},
		max: 1,
		step: 0.01,
		value: opacity
  });

	// slider for radius
	var handleRadius = $("#radius");
	$("#radius-slider").slider({
		create: function() {
			handleRadius.text($(this).slider("value"));
		},
		slide: function(event, ui){
			handleRadius.text(ui.value);
			radius = ui.value;
			drawCircle(opacity, radius, highlight);
		},
		value: radius
  });

	// slider for colors
	function refreshHighlight() {
		var red = $("#red").slider("value"),
				green = $("#green") .slider("value"),
				blue = $("#blue").slider("value");
		highlight = hexFromRGB(red, green, blue);
		drawCircle(opacity, radius, highlight);
	}

	$("#red, #green, #blue").slider({
		orientation: "horizontal",
		range: "min",
		max: 255,
		slide: refreshHighlight,
		change: refreshHighlight
	});

	var vals = hexToRGB(highlight);
	$("#red").slider("value", vals[0]);
	$("#green").slider("value", vals[1]);
	$("#blue").slider("value", vals[2]);
  });

$("#toggle").click(function() {
    // sets the toggle value based on the check box
		if($(this).prop("checked") == true){
				check = true;
		}
		else if($(this).prop("checked") == false){
				check = false;
		}
});

$("#trigger").click(function() {
  var listener = new window.keypress.Listener();
  // sets the text box to this message when clicked on
  $(this).val("Press a key!");

  // waits for an input key and sets the text to that key
  $(this).keydown(function (event) {
    if(event.which == 13) {
      event.preventDefault();
    }
    key = event.key;
    $(this).val(key);
  });
});

// draws circle on canvas given opacity, radius, and hex color
function drawCircle(o, r, h) {
		var canvas = document.getElementById('preview');
		var context = canvas.getContext("2d");

		context.clearRect(0, 0, canvas.width, canvas.height);

		context.font = "25px Arial";
		context.globalAlpha = 1;
		context.textAlign = "center";
		context.fillStyle = "black";
		context.fillText("Lorem Ipsum", canvas.width/2, canvas.height/2);

		context.fillStyle = "#".concat(h);
		context.globalAlpha = o;
		context.beginPath();
		context.arc(canvas.width/2, canvas.height/2,  r, 0, 2 * Math.PI);
		context.closePath();
		context.fill();
		context.fillStyle = "black";
}

// converts RGB to a string hex value
function hexFromRGB(r, g, b) {
	var hex = [
		r.toString(16),
		g.toString(16),
		b.toString(16)
	];
	$.each(hex, function(nr, val) {
		if (val.length === 1) {
			hex[nr] = "0" + val;
		}
	});
	return hex.join("").toUpperCase();
}

// converts hex to an RGB value
function hexToRGB(hex) {
    var rStr = hex.substr(0, 2).toLowerCase(),
		gStr = hex.substr(2, 2).toLowerCase(),
		bStr = hex.substr(4, 2).toLowerCase();
		var val = [parseInt(rStr, 16), parseInt(gStr, 16), parseInt(bStr, 16)];
		return val;
}
