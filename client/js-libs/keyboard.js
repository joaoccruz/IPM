import * as page from "./page.js";

var CONTAINER;
var CHARLIMIT;
function addE(btn,key,specials){
	var textbox = CONTAINER.getElementsByTagName("p")[0];
	var charsLeft = CONTAINER.getElementsByTagName("p")[1];

	function f(a, key){
		if(!(specials.includes(key)) &&  textbox.innerHTML.length < CHARLIMIT)
			textbox.innerHTML = textbox.innerHTML + key;
		else if(key == "←")
			textbox.innerHTML = textbox.innerHTML.slice(0,-1); 
		else if(key == "Enter"){
			CONTAINER.dispatchEvent(new Event("Enter"));
		}
		var cl = CHARLIMIT - textbox.innerHTML.length;
		charsLeft.innerHTML = "(" + cl + ")"; 
	}
	btn.addEventListener("click", (event) => f(event, key));
}

function renderRow(keys, pos, specials =[], sWidtH=[]){
	var textbox = CONTAINER.getElementsByTagName("p")[0];
	var specialSize = 0;
	for(var i = 0; i < specials.length; i++){
		specialSize += sWidtH[i]-1;
	}

	var left = 0;
	var buttonSize = 100/(keys.length + specialSize);

	var cont = CONTAINER.getElementsByTagName("div")[0];
	for(var i = 0; i < keys.length; i++){
		var btn = document.createElement("p");   
		btn.style.backgroundColor = "grey";
		btn.style.border = "black solid 1px";
		btn.innerHTML = keys[i];                   
		var w;

		if(specials.includes(keys[i])){
			w = sWidtH[specials.indexOf(keys[i])]*buttonSize;
		}else{
			w = buttonSize;
		}

		btn.style.display = "inline-block";
		btn.style.height = "14%";
		btn.style.width = w + "%";
		btn.style.left = left + "%";
		btn.style.top = pos + "%";
		left += w;
		addE(btn, keys[i], specials);
		
		cont.appendChild(btn);

	}
}




function main(div, f = null, chatlimit){
	CONTAINER = div;
	if(chatlimit != undefined){
		CONTAINER.getElementsByTagName("p")[1].innerHTML = "(90)";
		CHARLIMIT = 90;
	}else{
		CHARLIMIT = Math.max();
	}

	CONTAINER.getElementsByTagName("div")[0].style.width = "100%";
	CONTAINER.getElementsByTagName("div")[0].style.height = "100%";
	
	renderRow(["1","2","3","4","5","6","7","8","9","0"],40);
	renderRow(["q","w","e","r","t","y","u","i","o","p"], 55);
	renderRow(["a","s","d","f","g","h","j","k","l"], 70);
	renderRow(["z","x","c","v","b","n","m",",","."], 85);
	renderRow(["Shift","←","Enter"],25,["Shift","←","Enter"],[1,1,1]);

	CONTAINER.addEventListener("Enter", f);
	
}

export {main};