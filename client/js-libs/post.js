import * as date  from "./date.js";
class myPost{
	constructor(image, description, location, handle, timestamp){
		this.image = image;
		this.description = description;
		this.location = location;
		this.handle = handle;
		this.timestamp = timestamp;
	}
}


var POST_LIST = [];

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}


POST_LIST.push(new myPost("img/beach.jpeg", "Nada como o ar da montanha, na praia", {x: 40.3218825, y: -7.6217218, description: "Serra da Estrela"}, "Senhor_Malaquias", new Date()));
POST_LIST.push(new myPost("img/montanha.jpg", "Imagem genérica de uma montanha", {x: 40.3218825, y: -7.6217218, description: "Montanha"}, "Senhor_José", new Date(new Date()-604800000)));
POST_LIST.push(new myPost("img/gil.jpg", "Grande Gil >.> <.<", {x: 40.3218825, y: -7.6217218, description: "Parque das Nações"}, "Senhor_António", new Date(2019, 3, 18)));


function loadNext(){
	var cp = localStorage.getItem("currentPost");
	if(localStorage.getItem("currentPost") == POST_LIST.length-1)
		return;
	draw(++cp);
	localStorage.setItem("currentPost",cp);
}

function loadPrev(){
	var cp = localStorage.getItem("currentPost");
	if(localStorage.getItem("currentPost") == 0)
		return;
	draw(--cp);

	localStorage.setItem("currentPost",cp);
}

function draw(ID){
		// CHANGE TO OTHER FILE
	function generateDate(d){
		var min = d.getMinutes().toString();
		var hr  = d.getHours().toString();
		var day = d.getDate();
		var month = d.getMonth();
		var week = d.getDay();
		var year = d.getYear();
		var diff = new Date()-d;
		diff = Math.floor(diff /1000);

		if(diff > 7*24*3600)
			return(date.getDate(d));
		else if(diff > 24*3600)
			return("{0}".format(date.getWeek(d)));
		else if(diff > 3600)
			return(date.getTime(d));
		else if(diff > 1)
			return("{0} minutes ago".format(Math.floor(diff/60)+1));
		else{
			diff = Math.floor(diff/1000);
			if(diff == 0)
				return "Just now";

			return("{0} seconds ago".format(diff));
		}
	}

	if(ID == undefined){
		ID = 0;
		localStorage.setItem("currentPost",0); 
	}
	document.getElementById("mainImage").src = POST_LIST[ID].image;
	document.getElementById("postDescription").innerHTML = POST_LIST[ID].description;
	document.getElementById("postLocation").innerHTML = POST_LIST[ID].location.description;
	document.getElementById("postHandle").innerHTML = "@" + POST_LIST[ID].handle;
	document.getElementById("postTimestamp").innerHTML = generateDate(POST_LIST[ID].timestamp);
}


export {loadPrev, loadNext, draw}	