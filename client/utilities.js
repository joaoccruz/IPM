var currScreen = null;
var lastScreen = null;
var intervals = {};

function loadLockScreen(){
	var d = new Date();
	var min = d.getMinutes().toString();
	var hr  = d.getHours().toString();
	currScreen = "lock";
	document.getElementById("lockscreenText").innerHTML = hr + ":" + min ;
}


function load(screen){
	switch(screen){
		case "lock":
			loadLockScreen();
			intervals["lock"] = setInterval(loadLockScreen, 1000);
	}
	
}

function unload(screen){
	switch(screen){
		case "lock":
			clearInterval(intervals["lock"]);
	}
}


function loadLastScreen(screen){
	if(lastScreen == null)
		lastScreen = "main";
	unload(screen);
	load(lastScreen);
	
}