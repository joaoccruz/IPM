import * as page from "./page.js";

function validate(){
	page.unload("lockscreen");
	page.load("numpadScreen",function(pin){
		if(pin == localStorage.getItem("pin")){
			page.unload("numpadScreen");
			page.loadLastScreen();
		}
	});
}


function main(f){	
	var pw = "";
	const buttons = document.getElementById("numpadScreen").getElementsByTagName("input");
	const textbox = document.getElementById("numpadText");
	const textboxCharLimit = 8;

	function type(a,key){
		if(key != 11 && key != 10 && pw.length <= textboxCharLimit){
			pw = pw + key;
			textbox.innerHTML += "●"
		}else if(textbox.innerHTML.length != 0 && key ==10){
			pw = pw.slice(0,-1);
			textbox.innerHTML = textbox.innerHTML.slice(0,-1);
		}else if(key == 11){
			f(pw);
		}
	}


	function renderButton(i,line, column){
		buttons[i].value = i.toString();
		buttons[i].style.marginTop  = (20 + (line * 10)).toString()+"%"
		buttons[i].style.marginLeft = (27.5 + (column * 15)).toString()+"%";
		buttons[i].addEventListener("click",(event) => type(event, i));
	}


	for (var i = 1; i+2 < buttons.length; i++) {
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

	buttons[11].value = "Enter";
	buttons[11].style.marginLeft = "72.5%";
	buttons[11].style.marginTop = "40%";
	buttons[11].style.height = "30%";
	buttons[11].style.width = "25%";
	buttons[11].addEventListener("click",(event) => type(event, 11));
}



export {main,validate};