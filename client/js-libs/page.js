import * as swipe from "./swipe.js";

function update(){
	switch(localStorage.getItem("currScreen")){
		case "lockscreen":
			updateLockScreen();
	}
}

class post{
	constructor(image, description, location, handle){
		this.image = image;
		this.description = description;
		this.location = location;
		this.handle = handle;
	}
}


var CURR_POST = 0;
var POST_LIST = [];


POST_LIST.push(new post("img/beach.jpeg","Nada como o ar da montanha, na praia",{x: 40.3218825, y: -7.6217218, description: "Serra da Estrela"}, "Senhor_Malaquias"));
POST_LIST.push(new post("img/montanha.jpg","Imagem genérica de uma montanha",{x: 40.3218825, y: -7.6217218, description: "Montanha"}, "Senhor_José"));
POST_LIST.push(new post("img/gil.jpg","Grande Gil >.> <.<",{x: 40.3218825, y: -7.6217218, description: "Parque das Nações"}, "Senhor_António"));


function load(screen){
	var tut = localStorage.getItem("tutorial");
	if( tut == "fingerprint" || tut == undefined) {
		screen = "tutorial";
	}

	screen != "lockscreen" ? localStorage.setItem("lastScreen",screen) : null;
	localStorage.setItem("currScreen",screen);

	document.getElementById(screen).style.display = "block";
	document.getElementById(screen).style.visibility = "visible";	

	if(screen != "lockscreen" && screen != "tutorial"){
		loadNotifications();
	}

	switch(screen){
		case "lockscreen":
			updateLockScreen();
			document.getElementById("lockscreen").addEventListener("click", loadLastScreen, {once: true});
			break;

		case "main":
			main();	break;

		case "tutorial":
			tutorial();	break;

	}
	
}

function unload(screen){
	localStorage.removeItem("currScreen");
	var ele = document.getElementById(screen);
	ele.style.visibility = "hidden";
	ele.style.display = "none"
	if(screen == "main")
		swipe.disable(document.getElementById("post"));
}

function loadLastScreen(){
	var lastScreen = localStorage.getItem("lastScreen");

	if(lastScreen == undefined)
		lastScreen = "main";

	alert(lastScreen == null);
	unload(localStorage.getItem("currScreen"));
	load(lastScreen);
}




function tutorial(){
	var tut = document.getElementById("tutorial");
	var t1 = document.getElementById("tutorialText1");
	var t2 = document.getElementById("tutorialText2");
	var skip = document.getElementById("skip");
	var i3 = document.getElementById("tutorialImage");


	switch(localStorage.getItem("tutorial")){
		case null:
			localStorage.setItem("lastScreen","tutorial");
			tut.addEventListener("click", function(){
				t1.innerHTML = "Place one of your fingers on the screen to configure the fingerprint sensor";
				t2.innerHTML = "";
				skip.innerHTML = ""
				i3.src = "img/fingerprint.png";
				localStorage.setItem("tutorial", "fingerprint");
				tutorial();
			}, {once : true});
			break;

		case "fingerprint":
			tut.addEventListener("click", function(){		
				t1.innerHTML = "The next few screens will be a tutorial on how to use the device";
				t2.innerHTML = "You can skip them if you have used this before"
				i3.src = "";
				skip.innerHTML = "skip";
				localStorage.setItem("tutorial", "tutorial1");
				tutorial();
			}, {once : true});
			break;

	
		case "tutorial1":
			skip.addEventListener("click", function(){
				localStorage.setItem("tutorial", "complete");
				unload("tutorial");
				load("main");
			}, {once : true});

			tut.addEventListener("click", function(){
				if(localStorage.getItem("tutorial") == "complete")
					return;
				t1.innerHTML = "";
				t2.innerHTML = ""
				i3.src = "";
				skip.innerHTML = "skip";
				localStorage.setItem("tutorial", "tutorialMain");
				tutorial();
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


function updateLockScreen(){
	var d = new Date();
	var min = d.getMinutes().toString();
	var hr  = d.getHours().toString();

	if(min < 10)
		min = "0" + min
	
	if(hr < 10)
		hr = "0" + hr

	document.getElementById("lockscreenText").innerHTML = hr + ":" + min ;

}


function main(){
	function drawPost(ID){ 
		document.getElementById("mainImage").src = POST_LIST[ID].image;
		document.getElementById("postDescription").innerHTML = POST_LIST[ID].description;
		document.getElementById("postLocation").innerHTML = POST_LIST[ID].location.description;
		document.getElementById("postHandle").innerHTML = "@" + POST_LIST[ID].handle;
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
	drawPost(CURR_POST);
	swipe.enable(document.getElementById("post"),["left","right"],[loadNext,loadPrev]);
}

function loadNotifications(){
	document.getElementById("notifications").style.display = "block";
	document.getElementById("notifications").style.visibility = "visible";	
}

function pin(){	
	const buttons = document.getElementById("numpadScreen").getElementsByTagName("input");
	const textbox = document.getElementById("numpadText");
	const textboxCharLimit = 8;
	var pw = "";

	function type(a,key){
		if(key != 10 && pw.length <= textboxCharLimit){
			pw = pw + key;
			textbox.innerHTML += "●"
		}else if(textbox.innerHTML.length != 0 && key ==10){
			pw = pw.slice(0,-1);
			textbox.innerHTML = textbox.innerHTML.slice(0,-1);
		}
	}


	function renderButton(i,line, column){
		buttons[i].value = i.toString();
		buttons[i].style.marginTop  = (20 + (line * 10)).toString()+"%"
		buttons[i].style.marginLeft = (27.5 + (column * 15)).toString()+"%";
		buttons[i].addEventListener("click",(event) => type(event, i));
	}


	for (var i = 1; i+1 < buttons.length; i++) {
		renderButton(i,Math.floor((i-1) / 3),(i-1) % 3);
	}

	buttons[0].value = 0;
	buttons[0].style.marginTop = "50%";
	buttons[0].style.marginLeft = "27.5%";
	buttons[0].style.width = "30%";
	buttons[0].addEventListener("click",(event) => type(event, 0));

	buttons[10].value = "←";
	buttons[10].style.marginLeft = "57.5%";
	buttons[10].style.marginTop = "50%";
	buttons[10].addEventListener("click",(event) => type(event, 10));
}



export {load};