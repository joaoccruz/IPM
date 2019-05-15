function post(dir, data, f = ()=>{}, g = ()=>{}){
	const http = new XMLHttpRequest();
	function parseResponse(){
		if(http.status == 200){
			f(http.response);
		}else{
			g(http.response)
		}
	}

	const ip = "http://localhost:5000/" + dir;

	http.open("POST", ip);
	http.timeout = 200;
	

	document.addEventListener("PingSuccess", parseResponse, {once: true})
	document.addEventListener("PingFail", g, {once: true})


	http.onload = function(){
		document.dispatchEvent(new Event("PingSuccess"));
	}

	http.ontimeout = function(){
		document.dispatchEvent(new Event("PingFail"));
	}

	http.onerror = (e)=> {document.dispatchEvent(new Event("PingFail"))}; 


	var fd = new FormData();
	for(var key in data) {
 	   fd.append(key, data[key]);
	}

	http.send(fd);
}


function ping(f = ()=>{console.log("Pong")}, g = ()=>{console.log("Fail")}){
	const ip = "http://localhost:5000/";
	const http = new XMLHttpRequest();
	http.open("GET", ip);
	http.timeout = 2000;
	
	document.addEventListener("PingSuccess", f)
	document.addEventListener("PingFail", g)


	http.onload = function(){
		document.dispatchEvent(new Event("PingSuccess"));
	}

	http.ontimeout = function(){
		document.dispatchEvent(new Event("PingFail"));
	}

	http.onerror = (e)=> {document.dispatchEvent(new Event("PingFail"))}; 

	http.send(null);
}

function get(dir, f = ()=>{console.log("Pong")}, g = ()=>{console.log("Fail")}) {
	const http = new XMLHttpRequest();
	function parseResponse(){
		if(http.status == 200){
			f(http.response);
		}else{
			g(http.response)
		}
	}

	const ip = "http://localhost:5000/" + dir;

	http.open("GET", ip);
	http.timeout = 200;
	

	document.addEventListener("PingSuccess", parseResponse, {once: true})
	document.addEventListener("PingFail", g, {once: true})


	http.onload = function(){
		document.dispatchEvent(new Event("PingSuccess"));
	}
	http.ontimeout = function(){
		document.dispatchEvent(new Event("PingFail"));
	}
	http.onerror = (e)=> {document.dispatchEvent(new Event("PingFail"))}; 

	http.send(null);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function test(){
	sendPost("register", {"username": "BobbyJeans"})
	sleep(100)
	sendPost("register", {"username": "BobbyBans"})
	sleep(100)
	sendPost("sendContactRequest", {"sender": "BobbyJeans", "receiver": "BobbyBans"})
	sleep(100)
	sendPost("getContactRequests", {"username": "BobbyBans"})
	sleep(100)
	sendPost("approveContactRequest", {"sender": "BobbyBans", "receiver": "BobbyJeans"})
	sleep(100)
	sendPost("addMessage", {"sender": "BobbyJeans", "receiver": "BobbyBans", "message": "Olá"})
	sleep(100)
	sendPost("getMessages", {"username": "BobbyJeans"})
}

export {ping, post, get}