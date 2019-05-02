import * as page from "./page.js";
import {colors} from "./_colors.js";

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

function addE(btn,key,specials){
	var charsLeft = CONTAINER.getElementsByTagName("p")[1];

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
				btn.style.backgroundColor = colors["white"];
				btn.style.color = colors["nearBlack"];
				for(var i = 0; buttonCollection[i]; i++){
					buttonCollection[i].innerHTML = buttonCollection[i].innerHTML.toUpperCase();
				}
			}else{
				btn.style.backgroundColor = colors['nearBlack'];
				btn.style.color = colors["white"];
				for(var i = 0; buttonCollection[i]; i++){
					buttonCollection[i].innerHTML = buttonCollection[i].innerHTML.toLowerCase();
				}
			}
		}

		var cl = CHARLIMIT - content.length;
		charsLeft.innerHTML = "(" + cl + " remaining)"; 
	}
	btn.addEventListener("click", (event) => f(event, key));
}

function renderRow(keys, pos, specials =[], sizes=[]){
	var left = 0;
	var cont = CONTAINER.getElementsByTagName("div")[0];
	for(var i = 0; i < keys.length; i++){
		var btn = document.createElement("p");   
		btn.style.backgroundColor = colors['nearBlack'];
		btn.style.border = colors["blackishGrey"] + " solid 0.5px";
		btn.style.color = colors["white"];
		btn.style.fontSize = "10pt" 
		btn.innerHTML = keys[i];                   
		var w;

		if(sizes[i]){
			w = sizes[i];
		}else{
			w = 100/(keys.length);
		}

		btn.style.display = "inline-block";
		btn.style.height = "16%";
		btn.style.width = w + "%";
		btn.style.left = left + "%";
		btn.style.top = pos + "%";
		left += w;
		addE(btn, keys[i], specials);
		
		cont.appendChild(btn);
		buttonCollection.push(btn);
	}
}

function main(div, f = null, chatlimit){
	CONTAINER = div;
	content = "";
	textbox = CONTAINER.getElementsByTagName("p")[0];

	if(chatlimit != undefined){
		CHARLIMIT = 90;
		CONTAINER.getElementsByTagName("p")[1].innerHTML = "(" + CHARLIMIT + " remaining)";
	}else{
		CHARLIMIT = Math.max();
	}

	renderRow(["1","2","3","4","5","6","7","8","9","0"],15);
	renderRow(["q","w","e","r","t","y","u","i","o","p"], 32);
	renderRow(["a","s","d","f","g","h","j","k","l"], 49);
	renderRow(["z","x","c","v","b","n","m",",","."], 66);
	renderRow(["⇧",' ',"↩","←"],83,["⇧","↩","←"],[20,60,10,10]);

	updateTxtIn();
	CONTAINER.addEventListener("Enter", (event) => f(content));
}

export {main};