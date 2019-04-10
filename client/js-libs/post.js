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


POST_LIST.push(new myPost("img/beach.jpeg", "Nada como o ar da montanha, na praia", {x: 40.3218825, y: -7.6217218, description: "Serra da Estrela"}, "Senhor_Malaquias", new Date(1000000)));
POST_LIST.push(new myPost("img/montanha.jpg", "Imagem genérica de uma montanha", {x: 40.3218825, y: -7.6217218, description: "Montanha"}, "Senhor_José", new Date()));
POST_LIST.push(new myPost("img/gil.jpg", "Grande Gil >.> <.<", {x: 40.3218825, y: -7.6217218, description: "Parque das Nações"}, "Senhor_António", new Date(1)));


function loadNext(){
	var cp = localStorage.getItem("currentPost");
	if(localStorage.getItem("currentPost") == POST_LIST.length)
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
		return("{0}:{1}");
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