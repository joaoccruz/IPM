import * as swipe 		from "./swipe.js";
import * as post  		from "./post.js";
import * as pin   		from "./pin.js" ;
import * as date  		from "./date.js";
import * as kb    		from "./keyboard.js";
import * as server		from "./server.js"
import {popupAnim} 		from "./anime-service.js";
import { colors } 		from "./_colors.js";
import {unloadEventListeners} from "./utilities.js";

localStorage.globalFallback = "main";

function ifExistsElse(obj, replace){
	return obj ? obj : replace;
}

function reload(page){
	unload(page)
	load(page)
}

function render(container, template, toRender, noneInfo, renderFunc, maxHeight = 80){
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
		container.appendChild(none);
	}else{
		var none = container.getElementById("none"); 
		if(none){
			none.remove();
		}

		var dist = 0;
		for(var i = 0; i < toRender.length; i++){
			var nc = template.cloneNode(true);
			nc.id = "autoRendered" + i;
			nc.style.width = "100%";
			container.appendChild(nc)
			var h = renderFunc(toRender[i], nc)

			if(h > maxHeight)
				h = maxHeight;
			
			nc.style.top = dist + "px";

			dist += h + 4;
			nc.style.height = h + 3 + "px";
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


function drawContacts(contactList){
	function drawContact(contactName, node){
		var text = node.getElementById("contactTemplateName");
		var img = node.getElementById("templateSendMessage");

		let curr = contactName;
		img.addEventListener("click", ()=>{
			loadChat(localStorage.getItem("userHandle"), curr)
		})

		text.innerHTML = contactName;
		return text.clientHeight;
	}

	contactList = JSON.parse(contactList)
	var container = document.getElementById("contactsContainer"); 
	var template = document.getElementById("contactTemplateDiv")
	var noneInfo = {
		style: "top: 36%; fontSize: 12px; color: black;",
		text: "You have no contacts yet. :("
	};

	render(container, template, contactList, noneInfo, drawContact)
	
}

function drawComments(commentList){
	function drawComment(comment, nc){
		nc.style.width = "100%";
		nc.style.top = dist + "px";
		nc.style.visibility = "visible";
		document.getElementById("commentsContainer").appendChild(nc)

		var handle = nc.getElementById("commentHandle");
		var text = nc.getElementById("commentText");

		var heart = nc.getElementById("commentHeart");
		var heartNum = nc.getElementById("commentLikes");
		heartNum.innerHTML = comment.likes.length;
		heart.src = (comment.likes.includes(localStorage.getItem("userHandle")) ? "img/likedIcon.png" : "img/heart.png");


		text.style.top = handle.clientHeight + 2 + "px";

		handle.innerHTML = comment.user;
		text.innerHTML = comment.message;
		
		var h = text.clientHeight + handle.clientHeight;

		if(h > 80)
			h = 80;
		
		dist += h + 5;
		h = h  + 4 + "px";
		nc.style.height = h;
		
		let curr = i;
		let h1 = heart;
		h1.addEventListener("click", () => {
				var pl = JSON.parse(localStorage.getItem("postlist"));
				pl[currentPost()].comments[curr].likes = like(h1,pl[currentPost()].comments[curr].likes);
				heartNum.innerHTML = pl[currentPost()].comments[curr].likes.length;
				localStorage.setItem("postlist", JSON.stringify(pl));
				var data = {
					"postId": currentPost(),
					"commentId": curr,
					"user": localStorage.getItem("userHandle")
				}
				server.post("likeComment", data);
			}
		);
	}

	//commentList = JSON.parse(commentList);
	var container = document.getElementById("commentsContainer");
	var template = document.getElementById("commentTemplate");
	var noneInfo = {
		style: "top: 36%; fontSize: 12px; color: black;",
		text: "There are no comments yet. Why not be the first?"
	};

	render(container, template, commentList, noneInfo, drawComment);
}

function loadComments(id = localStorage.getItem("currentPost")){
	var POST_LIST = JSON.parse(localStorage.getItem("postlist"));
	var comments = POST_LIST[id].comments;

	drawComments(comments);
}

function unloadComments(){
	var comments = JSON.parse(localStorage.getItem("postlist"))[localStorage.getItem("currentPost")].comments;
	if(comments.length == 0){
		document.getElementById("noComments").remove();
	}else{
		var container = document.getElementById("commentsContainer");
		for(var i = container.childNodes.length - 1 ; i > 0; i--){
			if(container.childNodes[i].id != "commentTemplate")
				container.childNodes[i].remove();
		}
	}
}

function popup(container=document.getElementById("container"), text="bottomtext", pos={x:"center",y:"30%"}, time = 2000){
	var pop = document.createElement("p");
	pop.innerHTML = text;
	pop.style.fontSize = "11px"
	pop.style.maxWidth = "100%"
	pop.style.position="absolute"
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
			()=>{popup(document.getElementById("contactsScreen"), "Sent",{x:"center",y:"30%"})},
			()=>{popup(document.getElementById("contactsScreen"), "Couldn't send request",{x:"center",y:"30%"})})

		kb.unload(document.getElementById("contactsSendRequest"))
	}

	unload("contactsScreen");
	load("contactsSendRequest");
	var ele = document.getElementById("contactsSendRequest");
	kb.main(ele, executeKb)
}


function loadRequests(){
	var noneInfo = {
		text: "You have no open requests",
		style: "top: 30%; text-align: center; font-size: 11px"
	}

	function common(){
		unload("contactRequestsScreen");
		load("contactRequestsScreen")
	}


	function acceptContact(name){
		server.post("approveContactRequest",{"sender": localStorage.userHandle, "receiver": name},
			 ()=>
			 	{
			 		for(let i = 0; i < localStorage.requests.length; i++){
			 			if(localStorage.requests[i] == name){
			 				localStorage.requests[i].remove();
			 			}
			 		}
			 		common()
			 	},
			 common
			 )
	}


	function denyContact(name){
		server.post("denyContactRequest",{"sender": localStorage.userHandle, "receiver": name},
			 ()=>
			 	{
			 		for(let i = 0; i < localStorage.requests.length; i++){
			 			if(localStorage.requests[i] == name){
			 				localStorage.requests[i].remove();
			 			}
			 		}
			 		common()
			 	},
			 common
			 )	
	}


	function requestRender(name, child){
		var txt = child.getElementById("contactRequestName")
		txt.innerHTML = name;
		var accept = child.getElementById("acceptContactButton")
		var deny   = child.getElementById("denyContactButton");
		let curr = name;
		accept.addEventListener("click", () =>{acceptContact(curr)}, {once: true})
		deny.addEventListener("click", ()=> {denyContact(curr)}, {once: true})
		return txt.clientHeight;
	}


	let contactListContainer = document.getElementById("contactRequestsContainer");
	let template = document.getElementById("contactRequestTemplate")
	render(contactListContainer, template, JSON.parse(localStorage.requests), noneInfo, requestRender)

}




function loadContacts(){
	function success(contactList){
		drawContacts(contactList);
	}

	document.getElementById("addContactButton").addEventListener("click", addContact)
	document.getElementById("contactsRequests").addEventListener("click", ()=>{
		unload("contactsScreen");
		load("contactRequestsScreen")
	})

	server.post("getContactRequests",
		{"username": localStorage.userHandle},
		(a)=>{localStorage.requests = a; contactsNumberRequests.innerHTML = JSON.parse(a).length});

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
		unload(localStorage.currScreen);
		load(localStorage.globalFallback);
	}

	swipe.enable(document.getElementById("container"),["left","right"],[f,f]);
}


function kbStdd(key, msg, div, toLoad){
	localStorage.setItem(key, msg);
	unload(div);
	load(toLoad);
}



var noSwipe = ["tutorial","lockscreen","cameraSimulation","numpadScreen"];	
function load(screen,f = null, swiped = false){
	// For top tier divs(Lockscreen, tutorial, main, quickpost)
	console.log("loading " + screen)


	var tut = localStorage.getItem("tutorial");
	if( tut == "fingerprint" || tut == undefined) {
		screen = "tutorial";
	}

	var noHistory = ["lockscreen", "numpadScreen", "cameraSimulation", "contactsSendRequest", "commentTextAdd", "quickPostTextAdd", "tutorial"];
	if(!noHistory.includes(screen)){
		historyAdd(screen);
	}
	
	if(screen != "cameraSimulation")
		localStorage.setItem("currScreen",screen);
	
	document.getElementById(screen).style.display = "block";
	document.getElementById(screen).style.visibility = "visible";	
	
	loadNotifications();

	
	
	if(noSwipe.includes(screen)){
		swipe.disable(document.getElementById("container"));
	}else{
		enableSwipeBack();
	}

	if(!noHistory.includes(screen) && !swiped && !noSwipe.includes(screen))
		historyAdd(screen);

	switch(screen){
		case "contactsSendRequest":
			break;

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
			localStorage.globalFallback = "main";
			break;

		case "tutorial":
			tutorial();	
			break;
	    
		case "numpadScreen":
			pin.main(f);
			break;
	    

		case "contactsScreen":
			loadContacts();
			localStorage.globalFallback = "main";
			break;


		case "quickPostImagePick":
			var f = function(){
				var sel = opt.options[opt.selectedIndex].value;
				img.src = "cameraSim/"+sel+".png";
			}
			localStorage.globalFallback = "main";

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
			load("cameraSimulation");
			var opt = document.getElementById("cameraSelected");
			var sel = opt.options[opt.selectedIndex].value;

			img.src = "cameraSim/"+sel+".png";

			//const cropper = new Cropper.Cropper(img2, {
			//	aspectration: 16/9
			//});
			

			opt.addEventListener("change",f);
			document.getElementById("quickPostNextArrow").addEventListener("click", nextScreen, {once: true});
			//document.getElementById("quickPostGallery").addEventListener("click",gallery ,{once: true})
			break;

		case "quickPostTextAdd":
			var ele = document.getElementById("quickPostTextAdd");
			kb.main(ele, function(msg){
				kbStdd("textForPost", msg, "quickPostTextAdd", "main");
				post.newPost(localStorage.getItem("imgForPost"),localStorage.getItem("textForPost"));
				kb.unload(ele)
			},90);
			localStorage.globalFallback = "quickPostImagePick";
			break;


		case "commentTextAdd":
			var ele = document.getElementById("commentTextAdd");
			kb.main(ele, (msg) => {
					kbStdd("textForComment", msg, "commentTextAdd", "commentsScreen"); 
					post.newComment(localStorage.getItem("userHandle"), msg);
					kb.unload(ele)
				},
				130);
				localStorage.globalFallback = "quickPostImagePick";
			break;	
		
		case "cameraSimulation":
			//load("cameraCrop")
			break;

		//case "quickPostImagePick":
			//break;

		case "commentsScreen":
			post.loadComments();
			var commentWrite = document.getElementById("commentWrite");
			
			commentWrite.addEventListener("click", () => {
				unload("commentsScreen");
				load("commentTextAdd");
			},
			{once: true});
			localStorage.globalFallback = "main";
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
			localStorage.globalFallback = "main";
			break;

		case "contactRequestsScreen":
			loadRequests();
			localStorage.globalFallback = "contacts";
			break;

	    default: 
	    	alert("Defaulted at load: " + screen);
	    	break;
	}
	
}

function unload(screen){
	if(screen == null)
		return;

	if(!noSwipe.includes(screen)){
		swipe.disable(document.getElementById("container"));
	}
	var ele = document.getElementById(screen);
	if(ele == null)
		console.log(screen);
	ele.style.visibility = "hidden";
	ele.style.display = "none"
	switch(screen){
		case "contactsSendRequest":
			break;

		case "contactsScreen":
			var cont = document.getElementById("contactsContainer");
			while(cont.childNodes.length > 0)
				cont.childNodes[0].remove();
			
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
	    	unloadComments();
			break;
		
		case "contactRequestsScreen":
			var cont = document.getElementById("contactRequestsContainer");
			while(cont.childNodes.length > 0)
				cont.childNodes[0].remove();
			
			break;

	    default:
	    	alert("Defaulted at unload: " + screen);
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
	    }, false, false);
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

export {load, unload, loadLastScreen, update, loadComments, unloadComments};
