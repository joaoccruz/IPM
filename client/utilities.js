var DEBUG_MODE = false;
var currScreen = null;
var lastScreen = null;
var lastScreenShown = null;
var screenUpdate = setInterval(update, 1000);

var tutorialEventListeners=[];



class post{
	constructor(image, description, location, locationName){
		this.image = image;
		this.description = description;
		this.location = location;
		this.locationName = locationName;
	}
}

var POST_LIST = [];
POST_LIST.push(new post("beach.jpeg","Nada como o ar da montanha, na praia",{x: 40.3218825, y: -7.6217218}, "Serra da Estrela"));
POST_LIST.push(new post("montanha.jpg","Imagem genéria de uma montanha",{x: 40.3218825, y: -7.6217218}, "Montanha"));
POST_LIST.push(new post("gil.jpg","Grande Gil",{x: 40.3218825, y: -7.6217218}, "Parque das Nações"));

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
				i3.src = "fingerprint.png";
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

function drawPost(){
	var ID = 0; 
	document.getElementById("mainImage").src = POST_LIST[ID].image;
	document.getElementById("postDescription").innerHTML = POST_LIST[ID].description;
	document.getElementById("postLocation").innerHTML = POST_LIST[ID].locationName;
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
			drawPost();
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