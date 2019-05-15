import * as page from "./page.js";
import {colors} from "./_colors.js";
import {unloadEventListeners} from "./utilities.js";
var CONTAINER;
var CHARLIMIT;

var content = "";
var tOut;
var shiftEnabled = false;
var buttonCollection = [];

var textbox;
var tp = 500
function updateTxtIn(){
	textbox.innerHTML = content + '|';
	tOut = setTimeout(updateTxtOut, tp);
}
function updateTxtOut(){
	textbox.innerHTML = content;
	tOut = setTimeout(updateTxtIn, tp);
}

function press(b){
	b.style.backgroundColor = colors["white"];
	b.style.color = colors["nearBlack"];
}
function release(b){
	b.style.backgroundColor = colors['nearBlack'];
	b.style.color = colors["white"];
}
function addE(btn,key,specials){
	var charsLeft = document.getElementById("charsLeft")
	//"margin-top: 0;	font-size: 12px; left: 1%; height: 35;	width: 98%; word-wrap: break-word;"
	function f(_, key){
		if(!(specials.includes(key)) && content.length < CHARLIMIT){
			var val = key;
			if(shiftEnabled){
				val = key.toUpperCase();
			}
			content = content + val;
			clearTimeout(tOut);
			updateTxtIn();
		}else if(key == "←"){
			content = content.slice(0,-1); 
			clearTimeout(tOut);
			updateTxtIn();
		}else if(key == "↩"){
			CONTAINER.dispatchEvent(new Event("Enter"));
		}else if(key == "⇧"){
			shiftEnabled = !shiftEnabled;
			if (shiftEnabled){
				press(btn);
				for(var i = 0; buttonCollection[i]; i++){
					buttonCollection[i].innerHTML = buttonCollection[i].innerHTML.toUpperCase();
				}
			}else{
				release(btn);
				for(var i = 0; buttonCollection[i]; i++){
					buttonCollection[i].innerHTML = buttonCollection[i].innerHTML.toLowerCase();
				}
			}
		}

		var cl = CHARLIMIT - content.length;
		charsLeft.innerHTML = "(" + cl + " remaining)"; 
	}
	btn.addEventListener("click", (event) => f(event, key));
	btn.addEventListener("mousedown", (event) => press(btn));
	btn.addEventListener("mouseup", (event) => release(btn));
	btn.addEventListener("mouseleave", (event) => release(btn));

}

function renderRow(keys, pos, specials =[], sizes=[]){
	var left = 0;
	var kbContainer = document.getElementById("kbContainer")
	for(var i = 0; i < keys.length; i++){
		var btn = document.createElement("p");   
		btn.setAttribute("style", "font-size: 10pt; display: flex;	align-items: center; margin: 0 !important; 	justify-content: center; top: 0%;");               
		btn.style.backgroundColor = colors['nearBlack'];
		btn.style.border =  "solid grey 1px";
		btn.style.color = colors["white"];
		btn.innerHTML = keys[i];    
		var w;

		if(sizes[i]){
			w = sizes[i];
		}else{
			w = 100/(keys.length);
		}

		
		btn.style.height = "16%";
		btn.style.width = w + "%";
		btn.style.left = left + "%";
		btn.style.top = pos + "%";
		left += w;
		addE(btn, keys[i], specials);
		
		kbContainer.appendChild(btn);
		buttonCollection.push(btn);
	}
}


function unload(target){
	while(target.childNodes.length > 0 ){
		target.childNodes[0].remove();
	}
	unloadEventListeners(target);
	
}

function main(div, f = null, chatlimit){
	CONTAINER = div;
	CONTAINER.className = "normalScreen"; 
	CONTAINER.style.visibility = "visible";
	CONTAINER.style.display = "block";

	content = "";
	
	if(document.getElementById("kbContainer") == null){
		var kbContainer = document.createElement("div");
		kbContainer.style.top = "35%";
		kbContainer.style.height = "65%";
		kbContainer.style.width = "100%";
		kbContainer.id = "kbContainer";
		CONTAINER.appendChild(kbContainer);		
	}else{
		var kbContainer = CONTAINER.getElementById("kbContainer");
	}	

	if(document.getElementById("charsLeft") == null){
		var charsLeft = document.createElement("p");
		charsLeft.id = "charsLeft";
		charsLeft.setAttribute("style", "top: 0; right:0; margin: 0; font-size: 10px");		
		kbContainer.appendChild(charsLeft);
	}else{
		var charsLeft = document.getElementById("charsLeft");
	}

	if(document.getElementById("textbox") == null){
		textbox = document.createElement("p");
		textbox.innerHTML = "";
		textbox.id = "textbox";
		textbox.setAttribute("style", "margin-top: 0;	font-size: 12px; left: 1%; height: 35;	width: 98%; word-wrap: break-word;");
		CONTAINER.appendChild(textbox);		
	}else{
		var kbContainer = document.getElementById("textbox");
	}


	if(chatlimit != undefined){
		CHARLIMIT = 90;
		charsLeft.innerHTML = "(" + CHARLIMIT + " remaining)";
	}else{
		CHARLIMIT = Math.max();
	}

	renderRow(["1","2","3","4","5","6","7","8","9","0"],15);
	renderRow(["q","w","e","r","t","y","u","i","o","p"], 32);
	renderRow(["a","s","d","f","g","h","j","k","l"], 49);
	renderRow(["z","x","c","v","b","n","m",",","."], 66);
	renderRow(["⇧"," ","←","↩"],83,["⇧","←","↩"],[20,60,10,10]);

	div.style.zIndex = 100;
	updateTxtIn();

	CONTAINER.addEventListener("Enter", (event) => {f(content), unload(div), CONTAINER.dispatchEvent(new Event("SIGKBEXIT")), div.style.zIndex = 0;}, {once : true});
}

export {main,unload};