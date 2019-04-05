var currScreen = null;
var lastScreen = null;
var screenUpdate = setInterval(update, 1000);



function update(){
	switch(currScreen){
		case "lockscreen":
			updateLockScreen()
	}
}



function updateLockScreen(){
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
			updateLockScreen();
			break;
		case "main":
			break;
	}
	document.getElementById(screen).style.display = "block";
	document.getElementById(screen).style.visibility = "visible";	
	
}

function unload(screen){
	switch(screen){
		case "lockscreen":
			break;
	}
	document.getElementById("lockscreen").style.visibility = "hidden";
	document.getElementById("lockscreen").style.display = "none"
}


function loadLastScreen(screen){
	if(lastScreen == null)
		lastScreen = "main";
	unload(screen);
	load(lastScreen);
	
}