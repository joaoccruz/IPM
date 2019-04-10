import * as swipe from "./swipe.js";
import * as post  from "./post.js";
import * as pin   from "./pin.js" 

String.prototype.format = function () {
        var args = [].slice.call(arguments);
        return this.replace(/(\{\d+\})/g, function (a){
            return args[+(a.substr(1,a.length-2))||0];
    });
};

function update(){
	switch(localStorage.getItem("currScreen")){
		case "lockscreen":
			updateLockScreen();
	}
}

function unlock(){
	var radios = document.getElementsByName('CT');
	for (var i = 0, length = radios.length; i < length; i++){
		if (radios[i].checked && radios[i].value == "Fingerprint"){
			loadLastScreen();
			break;
	 	}
	}
}

function load(screen,f = null){
	var tut = localStorage.getItem("tutorial");
	if( tut == "fingerprint" || tut == undefined) {
		screen = "tutorial";
	}

	(screen != "lockscreen" && screen != "numpadScreen") ? localStorage.setItem("lastScreen",screen) : null;
	
	localStorage.setItem("currScreen",screen);

	document.getElementById(screen).style.display = "block";
	document.getElementById(screen).style.visibility = "visible";	

	if(screen != "lockscreen" && screen != "tutorial" && screen != "numpadScreen"){
		loadNotifications();
	}

	switch(screen){
		case "lockscreen":
			updateLockScreen();
			swipe.enable(document.getElementById("lockscreen"),"down",function(){
				pin.validate();
			});
			document.getElementById("lockscreen").addEventListener("click", unlock);
			break;

		case "main":
			main();	break;

		case "tutorial":
			tutorial();	break;
	    case "numpadScreen":
	    	pin.main(f);
	    	break;
	}
	
}

function unload(screen){
	if(screen == null)
		return;

	var ele = document.getElementById(screen);
	ele.style.visibility = "hidden";
	ele.style.display = "none"
	if(screen == "main")
		swipe.disable(document.getElementById("post"));

	if(screen == "numpadScreen")
		swipe.disable(document.getElementById("numpadScreen"));
}

function loadLastScreen(){
	var lastScreen = localStorage.getItem("lastScreen");

	if(lastScreen == undefined)
		lastScreen = "main";

	unload(localStorage.getItem("currScreen"));
	load(lastScreen);
}




function tutorial(){
	const tut = document.getElementById("tutorial");
	const t1 = document.getElementById("tutorialText1");
	const t2 = document.getElementById("tutorialText2");
	const skip = document.getElementById("skip");
	const i3 = document.getElementById("tutorialImage");
	const main = document.getElementById("main");
	const post = document.getElementById("post");
	const numpadScreen = document.getElementById("numpadScreen");

	switch(localStorage.getItem("tutorial")){
		case null:
			localStorage.setItem("lastScreen","tutorial");
			tut.addEventListener("click", function(){
				// CONTINUE
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
				// CONTINUE		
				localStorage.setItem("tutorial", "tutorialPin");
				tutorial();
			}, {once : true});
			break;

		case "tutorialPin":
			i3.src = "";
			t1.innerHTML = "Enter a pin, don't forget it";
			t1.style.top = "0%";
			tut.style.zIndex = 0;
			load("numpadScreen", function(pin){
	    		localStorage.setItem("pin",pin)	
				localStorage.setItem("tutorial", "tutorial1");
				tutorial();
	    	});
			break;
			

		case "tutorial1":
			t1.style.top = "05%"
			t1.innerHTML = "The next few screens will be a tutorial on how to use the device";
			t2.innerHTML = "You can skip them if you have used this before"
			i3.src = "";
			skip.innerHTML = "skip";
			tut.style.zIndex = 100;
			unload("numpadScreen");
			skip.addEventListener("click", function(){
				// SKIP
				localStorage.setItem("tutorial", "complete");
				post.style.outline = "none";
				swipe.disable(tut);
				unload("tutorial");
				unload(localStorage.getItem("currScreen"));
				load("main");
			}, {once : true});


			tut.addEventListener("click", function(){
				// CONTINUE
				if(localStorage.getItem("tutorial") == "complete")
					return;
				localStorage.setItem("tutorial", "tutorialPost");
				tutorial();
			}, {once : true});


			break;

		case "tutorialPost":
			t1.innerHTML = "This is your main screen";
			post.style.outline = "1px solid black";
			t1.style.webkitTextStroke = "0.2px grey";
			t1.style.right = "25%";
			t2.innerHTML = ""
			i3.src = "";
			skip.innerHTML = "skip";
			load("main");
			tut.addEventListener("click", function(){
				t1.innerHTML = "It shows the current posts";
				tut.addEventListener("click", function(){
					localStorage.setItem("tutorial", "tutorialSwipeMain");
					tutorial();
				}, {once : true});
			}, {once : true});


			break;

		case "tutorialSwipeMain":
			t1.innerHTML = "Try to swipe left";
			swipe.enable(tut,"left", function(){post.loadNext(); skip.click();});
	}
	
}


function updateLockScreen(){
	var d = new Date();
	var min = d.getMinutes().toString();
	var hr  = d.getHours().toString();
	var day = d.getDate();
	var month = d.getMonth();
	var week = d.getDay();
	var year = d.getYear();
	if(min < 10)
		min = "0" + min
	
	if(hr < 10)
		hr = "0" + hr


	switch(week){
        case 1: 
            var dayW = ("Monday");
            break;
        case 2: 
            var dayW = ("Tuesday");
            break;
        case 3: 
            var dayW = ("Wednesday");
            break;
        case 4: 
            var dayW = ("Thursday");
            break;
        case 5: 
            var dayW = ("Friday");
            break;
        case 6: 
            var dayW = ("Saturday");
            break;
        case 7: 
            var dayW = ("Sunday");
            break;
    }
    switch(month){
        case 0: 
        	month = "January";
            break;
        case 1: 
        	month = "February";
            break;
        case 2: 
        	month = "March";
            break;
        case 3:
        	 month = "April";
            break;
        case 4: 
        	month = "May";
            break;
        case 5: month = "June"; 
            break;
        case 6: 
        	month = "July";
            break;
        case 7: 
        	month = "August";
            break;
        case 8: 
        	month = "September";
            break;
        case 9: 
        	month = "October";
            break;
        case 10: 
        	month = "November";
            break;
        case 11: 
        	month = "December";
            break;
       }
	document.getElementById("lockscreenText").innerHTML = hr + ":" + min ;
	document.getElementById("lockscreenDate").innerHTML = "{0}, {1} {2}".format(dayW, month, day);

}


function main(){
	post.draw(localStorage.getItem("currentPost"));
	swipe.enable(document.getElementById("post"),["left","right"],[post.loadNext,post.loadPrev]);
}

function loadNotifications(){
	document.getElementById("notifications").style.display = "block";
	document.getElementById("notifications").style.visibility = "visible";	
}





export {load};
