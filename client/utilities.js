const DEBUG_MODE = true;
var currScreen = null;
var lastScreen = null;
var lastScreenShown = null;
const screenUpdate = setInterval(update, 1000);

var tutorialEventListeners=[];

class post{
	constructor(image, description, location, locationName){
		this.image = image;
		this.description = description;
		this.location = location;
		this.locationName = locationName;
	}
}

var CURR_POST = 0;
var POST_LIST = [];
POST_LIST.push(new post("img/beach.jpeg","Nada como o ar da montanha, na praia... Wait.",{x: 40.3218825, y: -7.6217218}, "Serra da Estrela"));
POST_LIST.push(new post("img/montanha.jpg","Imagem genérica de uma montanha",{x: 40.3218825, y: -7.6217218}, "Montanha"));
POST_LIST.push(new post("img/gil.jpg","Grande Gil >.> <.<",{x: 40.3218825, y: -7.6217218}, "Parque das Nações"));

if(DEBUG_MODE)
	localStorage.clear();
	

function runTutorial(){
	var tutorial = document.getElementById("tutorial");

	var t1 = document.getElementById("tutorialText1");
	var t2 = document.getElementById("tutorialText2");
	var skip = document.getElementById("skip");
	var i3 = document.getElementById("tutorialImage");


	switch(localStorage.getItem("tutorial")){
		case null:
			lastScreenShown = "tutorialNull";
			tutorial.addEventListener("click", function(){
				t1.innerHTML = "Place one of your fingers on the screen to configure the fingerprint sensor";
				t2.innerHTML = "";
				skip.innerHTML = ""
				i3.src = "img/fingerprint.png";
				localStorage.setItem("tutorial", "fingerprint");
				runTutorial();
			}, {once : true});
			break;

		case "fingerprint":
			tutorial.addEventListener("click", function(){		
				t1.innerHTML = "The next few screens will be a tutorial on how to use the device";
				t2.innerHTML = "You can skip them if you have used this before"
				i3.src = "";
				skip.innerHTML = "skip";
				localStorage.setItem("tutorial", "tutorial1");
				runTutorial();
			}, {once : true});
			break;

	
		case "tutorial1":
			skip.addEventListener("click", function(){
				localStorage.setItem("tutorial", "complete");
				unload("tutorial");
				load("main");
			}, {once : true});

			tutorial.addEventListener("click", function(){
				if(localStorage.getItem("tutorial") == "complete")
					return;
				t1.innerHTML = "";
				t2.innerHTML = ""
				i3.src = "";
				skip.innerHTML = "skip";
				localStorage.setItem("tutorial", "tutorialMain");
				runTutorial();
			}, {once : true});


			break;

		case "tutorialMain":

			t1.innerHTML = "This is your main screen, it shows current posts, contacts and app screen";
			t1.style.webkitTextStroke = "0.2px grey";
			t1.style.right = "25%";
			t2.innerHTML = ""
			i3.src = "";
			skip.innerHTML = "skip";
			load("main");

			break;

	}
	
}


function update(){
	switch(currScreen){
		case "lockscreen":
			updateLockScreen();
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


function enableSwipe(target, directions, f){
	// TODO: Add drag
	var pos = {};
	function getSwipeDir(pos, f, minDistX = 30, minDistY = 20){
		var dx = pos["xf"] - pos["xi"];
		var dy = pos["yf"] - pos["yi"];
		var dir = null;

		
		 
		var d, dist, dir;
		
		(Math.abs(dx) >= Math.abs(dy)) ? (d = dx, dist = minDistX, dir = "x") : (d = dy, dist = minDistY, dir = "y");

		if(Math.abs(d) < dist){
			return null;
		}


		var ret = (d > 0 ? 0 : 1);
		if(dir == "x"){
			return (ret == 0 ? "right" : "left");
		}else if(dir == "y"){
			return (ret == 0 ? "down" : "up");
		}

						
	}

	function storeVal(event){
		pos["xi"] = event.clientX;
		pos["yi"] = event.clientY;
	}

	function validate(event){
		pos["xf"] = event.clientX;
		pos["yf"] = event.clientY;
		
		var swipeDir = getSwipeDir(pos)
		if(directions.constructor === Array){
			for (var i = 0; i < directions.length; i++) {
				if(directions[i] == swipeDir){
					var func = f[i];
					func(swipeDir);
				}
			}
		}else if(swipeDir == directions){
			f(swipeDir);
		}

	}

	target.addEventListener("mousedown" , storeVal, false);
	target.addEventListener("touchstart", storeVal, false);

	target.addEventListener("mouseup", validate, false);
	target.addEventListener("touchend", validate, false);
	
}

function loadMain(){
	function drawPost(ID){ 
		document.getElementById("mainImage").src = POST_LIST[ID].image;
		document.getElementById("postDescription").innerHTML = POST_LIST[ID].description;
		document.getElementById("postLocation").innerHTML = POST_LIST[ID].locationName;
	}

	function loadNext(){
		if(CURR_POST == POST_LIST.length)
			return;
		drawPost(++CURR_POST);
	}

	function loadPrev(){
		if(CURR_POST == 0)
			return;
		drawPost(--CURR_POST);
	}
	enableSwipe(document.getElementById("post"),["left","right"],[loadNext,loadPrev]);
	drawPost(CURR_POST);
}

function load(screen){
	var tut = localStorage.getItem("tutorial");
	if( tut == "fingerprint" || tut == null) {
		screen = "tutorial";
	}

	lastScreenShown = screen;

	currScreen = screen;
	document.getElementById(screen).style.display = "block";
	document.getElementById(screen).style.visibility = "visible";	
	if(screen != "lockscreen" && screen != "tutorial"){
		document.getElementById("notifications").style.display = "block";
		document.getElementById("notifications").style.visibility = "visible";	
	}

	switch(screen){
		case "lockscreen":
			updateLockScreen();
			break;

		case "main":
			loadMain();
			break;

		case "tutorial":
			runTutorial();
			break;

		case "tutorialMain":
			
			break;	
	}
	
}

function unload(screen){
	currScreen = null;
	document.getElementById(screen).style.visibility = "hidden";
	document.getElementById(screen).style.display = "none"
}


function loadLastScreen(screen){
	if(lastScreen == null)
		lastScreen = "main";
	unload(screen);
	load(lastScreen);
}