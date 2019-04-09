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