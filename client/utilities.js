var currScreen = null;
var lastScreen = null;
var intervals = {};

function loadLockScreen(){
	var d = new Date();
	var min = d.getMinutes().toString();
	var hr  = d.getHours().toString();

	if(min < 10)
		min = "0" + min
	
	if(hr < 10)
		hr = "0" + hr
	
	currScreen = "lockscreen";
	document.getElementById("lockscreenText").innerHTML = hr + ":" + min ;
}


function load(screen){
	switch(screen){
		case "lockscreen":
			loadLockScreen();
			intervals["lock"] = setInterval(loadLockScreen, 1000);
	}
	
}

function unload(screen){
	switch(screen){
		case "lockscreen":
			clearInterval(intervals["lock"]);
	}

	document.getElementById("lockscreen").style.display = "none"
}


function loadLastScreen(screen){
	if(lastScreen == null)
		lastScreen = "main";
	unload(screen);
	load(lastScreen);
	
}