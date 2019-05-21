import * as swipe 		from "./swipe.js";
import * as post  		from "./post.js";
import * as pin   		from "./pin.js" ;
import * as date  		from "./date.js";
import * as kb    		from "./keyboard.js";
import * as server		from "./server.js"
import {popupAnim} 		from "./anime-service.js";
import { colors } 		from "./_colors.js";
import {unloadEventListeners} from "./utilities.js";

function ifExistsElse(obj, replace){
	return obj ? obj : replace;
}

function render(container, template, toRender, noneInfo, childInfo){
	/*
		None info:
			text
			style

		Child info:
			renderFunc(childInfo, childNode, distance)
			maxHeight per child
			returns height of div
	*/

	if(toRender.length == 0){
		var none = document.createElement("p");
		none.innerHTML = noneInfo.text;
		none.style.display = "block";
		none.id = "none";
		none.className = "textCenter"
		none.style = noneInfo.style;
		container.appendChild(noContacts);
	}else{
		var none = container.getElementById("none"); 
		if(none){
			none.remove();
		}

		var dist = 0;
		for(var i = 0; i < toRender.length; i++){
			var nc = template.cloneNode(true);
			nc.id = "autoRendered" + i;
			
			container.appendChild(nc)
			var h = childInfo.renderFunc(toRender[i], child, dist)

			if(h > childInfo.maxHeight)
				h = childInfo.maxHeight;
			
			dist += h + 5;
			nc.style.height = h + 4 + "px";
		}
	}
}

function loadChat(u1, u2){
	function f(r){
		messageList = JSON.parse(r);
	}
	function fail(){
		console.log("Fail with " + u1 + ":" + u2)		
	}
	var data = {"u1": u1, "u2": u2}
	server.post("getMessages", data, f, fail)
}


//import Cropper from "./node_modules/cropperjs/src/index.js"
function drawContact(){

}


function drawContacts(contactList){
	contactList = JSON.parse(contactList)
	if(contactList.length == 0){
		var noContacts = document.createElement("p");
		noContacts.innerHTML = "You have no contacts yet";
		noContacts.style.display = "block";
		noContacts.id = "noContacts";
		noContacts.className = "textCenter"
		noContacts.style.top = "36%";
		noContacts.style.fontSize = "12px"
		noContacts.style.color = "black";
		document.getElementById("contactsContainer").appendChild(noContacts);
	}else{
		var noContactsMessage = document.getElementById("noContacts"); 
		if(noContactsMessage){
			noContactsMessage.remove();
		}

		var dist = 0;
		for(var i = 0; i < contactList.length; i++){
			var nc = document.getElementById("contactTemplate").cloneNode(true);
			nc.id = "contactNumber" + i;
			nc.style.width = "100%";
			nc.style.top = dist + "px";
			nc.style.visibility = "visible";
			document.getElementById("contactsContainer").appendChild(nc)
			var text = nc.getElementById("contactTemplateName");

			var img = nc.getElementById("templateSendMessage");

			let curr = contactList[i];
			img.addEventListener("click", ()=>{
				loadChat(localStorage.getItem("userHandle"), curr)
			})
			text.innerHTML = contactList[i];
			text.style.top = nc.clientHeight + 2 + "px";


			
			var h = text.clientHeight;

			if(h > 80)
				h = 80;
			
			dist += h + 5;
			h = h  + 4 + "px";
			nc.style.height = h;
		}
	}
}

function popup(container=document.getElementById("container"), text="bottomtext", pos={x:"center",y:"30%"}, time = 2000){
	var pop = document.createElement("p");
	pop.innerHTML = text;
	pop.style.fontSize = "11px"
	pop.style.maxWidth = "100%"
	pop.style.position="fixed"
	if(pos.x =="center"){
		pop.style.left = "50%";
		pop.style.transform = "translateX(-50%)"
	}
	pop.style.left = pos.x;
	pop.style.top = pos.y;
	pop.style.zIndex = 100;
	pop.style.opacity = 0;
	
	container.appendChild(pop)
	popupAnim(pop);
}


function addContact(){
	function executeKb(msg){
		kbStdd("contactAddText", msg, "contactsSendRequest", "contactsScreen");
		server.post("sendContactRequest",{"sender": localStorage.getItem("userHandle"), "receiver": msg},
			()=>{popup(document.getElementById("contactsScreen"), "Sent",{x:"center",y:"20%"})},
			()=>{popup(document.getElementById("contactsScreen"), "Couldn't send request",{x:"center",y:"20%"})})

		kb.unload(document.getElementById("contactsSendRequest"))
	}

	unload("contactsScreen");
	load("contactsSendRequest");
	var ele = document.getElementById("contactsSendRequest");
	kb.main(ele, executeKb)
}



function loadRequests(){
	noneInfo = {
		text = "You have no open requests",
		style = "top: 30%; text-align: center; font-size: 11px"
	}

	function childRender(info, child, dist){
		child.style.top = dist + "%";

	}


	var contactListContainer = document.getElementById("contactListContainer");
	var template = document.getElementById("contactRequestTemplate")
	var contactRequestsList = server.post("getContactRequests",
		()=>{render(contactListContainer, template, )},
		()=>
}


function loadContacts(){
	function success(contactList){
		drawContacts(contactList);
	}

	document.getElementById("addContactButton").addEventListener("click", addContact)
	document.getElementById("contactsRequests").addEventListener("click", loadRequests)
	server.post("getContacts", {"username": localStorage.getItem("userHandle")}, success)
}




function loadGallery(){
	/*var container = document.getElementById("gallery"); 
	var imageList = JSON.parse(localStorage.getItem("images"));
	
	for(var i = 0; i < imageList.length; i++){
		var newImage = document.createElement("img");
		newImage.src = imageList[i];
		newImage.width = "20%";
		newImage.height = "20%";
		newImage.left = (i % 5);

		container.appendChild(newImage);
	}*/


}


function unloadGallery(){
	var container = document.getElementById("gallery");
	while(container.childNodes > 0){
		container.childNodes[0].remove();
	}
}


function historyAdd(screen){
	var HISTORY = JSON.parse(localStorage.getItem("history"));
	if(HISTORY.length > 50){
		HISTORY.shift();
	}
	
	if(HISTORY[HISTORY.length-1] != screen)
		HISTORY.push(screen);
	localStorage.setItem("history", JSON.stringify(HISTORY));
}

String.prototype.format = function () {
        var args = [].slice.call(arguments);
        return this.replace(/(\{\d+\})/g, function (a){
            return args[+(a.substr(1,a.length-2))||0];
    });
};

function update(){
	loadNotifications();
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


function enableSwipeBack(){
	var f = function(){
		var HISTORY = JSON.parse(localStorage.getItem("history"));
		swipe.disable(document.getElementById("container"));
		HISTORY.pop();
		localStorage.setItem("history", JSON.stringify(HISTORY));
		var lastScreen = HISTORY.pop();	
		if(HISTORY[HISTORY.length-1] != screen)
		;
		if(lastScreen != undefined){
			unload(localStorage.getItem("currScreen"));
			load(lastScreen, undefined,  true);
		}else{
			unload(localStorage.getItem("currScreen"));
			load("main",undefined, true);
		}
	}

	swipe.enable(document.getElementById("container"),["left","right"],[f,f]);
}


function kbStdd(key, msg, div, toLoad){
	localStorage.setItem(key, msg);
	unload(div);
	load(toLoad);
}



function load(screen,f = null, swiped = false){
	// For top tier divs(Lockscreen, tutorial, main, quickpost)
	
	var tut = localStorage.getItem("tutorial");
	if( tut == "fingerprint" || tut == undefined) {
		screen = "tutorial";
	}

	var noHistory = ["lockscreen", "numpadScreen", "cameraSimulation", "contactsSendRequest"];
	(!noHistory.includes(screen)) ? localStorage.setItem("lastScreen",screen) : null;
	
	if(screen != "cameraSimulation")
		localStorage.setItem("currScreen",screen);

	document.getElementById(screen).style.display = "block";
	document.getElementById(screen).style.visibility = "visible";	
	loadNotifications();

	
	
	var noSwipe = ["tutorial","lockscreen","cameraSimulation","numpadScreen", "commentTextAdd"];

	if(!screen.includes("textAdd") && !swiped && !noSwipe.includes(screen))
		historyAdd(screen);

	switch(screen){
		case "lockscreen":
			updateLockScreen();
			swipe.enable(document.getElementById("lockscreen"),"down",function(){
				pin.validate();
			});
			document.getElementById("lockscreen").addEventListener("click", unlock);
			break;

		case "main":
			swipe.disable(document.getElementById("container"));
			post.updatePostList(main);
			break;

		case "tutorial":
			tutorial();	
			break;
	    
		case "numpadScreen":
			pin.main(f);
			enableSwipeBack();
			break;
	    

		case "contactsScreen":
			enableSwipeBack();
			loadContacts();
			break;


		case "quickPostImagePick":
			var f = function(){
				var sel = opt.options[opt.selectedIndex].value;
				img.src = "cameraSim/"+sel+".png";
			}

			var nextScreen = function(){
				localStorage.setItem("imgForPost",img.src);
				unload(screen);
				load("quickPostTextAdd");
			}

			gallery: {
				/*unload(screen);
				load("gallery");*/
			}


			var img = document.getElementById("quickPostCameraImage");
			

	    	enableSwipeBack();

			load("cameraSimulation");
			var opt = document.getElementById("cameraSelected");
			var sel = opt.options[opt.selectedIndex].value;

			img.src = "cameraSim/"+sel+".png";

			//const cropper = new Cropper.Cropper(img2, {
			//	aspectration: 16/9
			//});
			

			opt.addEventListener("change",f);
			document.getElementById("quickPostNextArrow").addEventListener("click", nextScreen, {once: true});
			document.getElementById("quickPostGallery").addEventListener("click",gallery ,{once: true})
			break;

		case "quickPostTextAdd":
			var ele = document.getElementById("quickPostTextAdd");
			kb.main(ele, function(msg){
				kbStdd("textForPost", msg, "quickPostTextAdd", "main");
				post.newPost(localStorage.getItem("imgForPost"),localStorage.getItem("textForPost"));
				kb.unload(ele)
			},90);
			break;


		case "commentTextAdd":
			unloadEventListeners(document.getElementById("container"))
			var ele = document.getElementById("commentTextAdd");
			kb.main(ele, (msg) => {
					kbStdd("textForComment", msg, "commentTextAdd", "commentsScreen"); 
					post.newComment(localStorage.getItem("userHandle"), msg);
					kb.unload(ele)
				},
				130);
			
			break;	
		
		case "cameraSimulation":
			//load("cameraCrop")
			break;

		case "quickPostImagePick":
			enableSwipeBack();
			break;

		case "commentsScreen":
			enableSwipeBack();
			post.loadComments();
			var commentWrite = document.getElementById("commentWrite");
			
			commentWrite.addEventListener("click", () => {
				load("commentTextAdd");
				unload("commentsScreen");
			},
			{once: true});
			break;
		

		case "gallery":
			loadGallery();
			break;

		case "contacts":
			var parent = document.getElementById("contactSelector")
			var sample = document.getElementById("contactDivSample")
			var useWhite = true
			var contacts = getContacts();
			for (contact in contacts) {
				var c = sample.cloneNode(true);
				c.style.backgroundColor = useWhite ? colors["white"] : colors["nearwhite"]
				c.style.visibility = true
				//c.get
				parent.appendChild(c)
				useWhite = !useWhite
			}
			break;

	    default: 
	    	//alert("Defaulted at load: " + screen);
	    	break;
	}
	
}

function unload(screen){
	if(screen == null)
		return;


	var ele = document.getElementById(screen);
	if(ele == null)
		console.log(screen);
	ele.style.visibility = "hidden";
	ele.style.display = "none"
	switch(screen){

		case "contactsScreen":
			break;

		case "lockscreen":
			break;

		case "main":
			swipe.disable(document.getElementById("post"));
			break;

		case "tutorial":
			break;
	    
	    case "numpadScreen":
	    	swipe.disable(document.getElementById("numpadScreen"));
	    	break;
	    
	    case "quickPostImagePick":
	   		unload("cameraSimulation");
	    	break;

	    case "quickPostTextAdd":
	    	kb.unload(document.getElementById("quickPostTextAdd"));
	    	
	    	break;

	    case "commentTextAdd":
	    	kb.unload(document.getElementById("commentTextAdd"))
	    	break;

	    case "cameraSimulation":
	    	
	    	break;

	    case "commentsScreen":
	    	post.unloadComments();
			break;
		

	    default:
	    	//alert("Defaulted at unload: " + screen);
	    	break;
	}
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
				skip.innerHTML = "";
				t2.style.visibility = "hidden";
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
			t1.style.marginTop = "0%"
			i3.src = "";
			t1.innerHTML = "Enter a pin, don't forget it";
			t1.style.visibility = "visible";
			t2.style.visibility = "hidden";
			tut.style.zIndex = 0;
			load("numpadScreen", function(pin){
	    	localStorage.setItem("pin",pin)	
				localStorage.setItem("tutorial", "username_prompt");
				tutorial();
	    });
			break;
			
		case "username_prompt":
			unload("numpadScreen");
			tut.style.zIndex = 100;
			t1.style.top = "5%"
			t1.innerHTML = "Now choose an username. Pick one you like the most!";
			t1.style.visibility = "visible"
			t2.innerHTML = "Tap to continue";
			t2.style.visibility = "visible"
			tut.addEventListener("click", function(){
				localStorage.setItem("tutorial", "username_set");
				tutorial();
			}, {once: true})
			break;

		case "username_set":
			tut.style.zIndex = 0;
			t1.style.visibility = "hidden";
			t2.style.visibility = "hidden";
			var k = document.getElementById("genericKb");
			kb.main(k, function(handle) {
				function next(){
					localStorage.setItem("tutorial", "username_check");
					kb.unload(k);
					tutorial();
				}

				function succ(_){
					localStorage.setItem("userHandle", handle);
					next();
				}

				function fail(_){
					localStorage.setItem("userHandle", "_" + handle);
					next();
				}
				server.post("register", {"username": handle}, succ,  fail)
				
			}, 16);


			break;

		case "username_check":
		//	console.log("RHERE");	
			tut.style.zIndex = 100;
			var newHandle = localStorage.getItem("userHandle");
			t1.style.visibility = "visible";
			t2.style.visibility = "visible";

			if(newHandle[0] == "_") {
				// Check did not pass
				t1.innerHTML = "Sorry, but the name " + newHandle.substring(1) + " is already taken!";
				t2.innerHTML = "Please pick another one. Tap to continue.";

				localStorage.setItem("tutorial", "username_set");
			} else {
				// Check passed
				t1.innerHTML = "Be welcome, " + newHandle + "! It's time to begin using your iGo!";
				t2.innerHTML = "Tap to continue.";

				localStorage.setItem("tutorial", "complete");
			}

		tut.addEventListener("click", tutorial, {once: true});
		break;

		case "complete":
			unload("tutorial");
			load("main");
			break;
	}
}

function currentPost(){
	return localStorage.getItem("currentPost");
}

function updateLockScreen(){
	var d = new Date();
	var day = d.getDate();
	var month = date.getMonth(d);
    var dayW = date.getWeek(d);
   
	document.getElementById("lockscreenText").innerHTML = date.getTime(d);
	document.getElementById("lockscreenDate").innerHTML = "{0}, {1} {2}".format(dayW, 
		month, day);

}



function main(){
	post.draw(localStorage.getItem("currentPost"));
	swipe.enable(document.getElementById("post"),["left","right"],[post.loadNext,post.loadPrev]);
	document.getElementById("mainCamera").addEventListener("click",() => {unload("main"); load("quickPostImagePick");});
	document.getElementById("mainContacts").addEventListener("click", ()=>{
		unload("main");
		load("contactsScreen");
	});
	var heart = document.getElementById("postLikes");

	var pl = JSON.parse(localStorage.getItem("postlist"));
	

	document.getElementById("postLikes").addEventListener("click", () => {
		pl[currentPost()].likes = post.like(heart, pl[currentPost()].likes);
		localStorage.setItem("postlist", JSON.stringify(pl)); post.draw()
		var data = {
			"postId": currentPost(),
			"user": localStorage.getItem("userHandle")
		}
		server.post("likePost", data)
	});

	document.getElementById("postComments").addEventListener("click", () => {unload("main"); load("commentsScreen")});

}

function loadNotifications(){
	var screen = localStorage.getItem("currScreen"); 
	if(screen != "lockscreen" && screen != "tutorial" && screen != "numpadScreen"){
		document.getElementById("notifications").style.display = "block";
		document.getElementById("notifications").style.visibility = "visible";	
		document.getElementById("notificationsTime").innerHTML = date.getTime();	
	}else{
		document.getElementById("notifications").style.display = "none";
		document.getElementById("notifications").style.visibility = "hidden";	
	}


	
}

document.getElementById("notifications").style.backgroundColor = colors["nearBlack"];

export {load, unload, loadLastScreen,update};
