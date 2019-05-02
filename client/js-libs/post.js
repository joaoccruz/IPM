import * as date  from "./date.js";
import {popHeart} from "./anime-service.js";


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




function add(src, desc, location, user, date, likes=[], comments=[]){
	var posts = JSON.parse(localStorage.getItem("postlist"));
	if(posts == null){
		posts = [];
	}

	posts.push([src, desc, location, user, date.toString(), likes, comments]);
	localStorage.setItem("postlist", JSON.stringify(posts))
}

function loadNext(){
	var POST_LIST = JSON.parse(localStorage.getItem("postlist"));
	var cp = localStorage.getItem("currentPost");
	if(localStorage.getItem("currentPost") == POST_LIST.length-1){
		return;
	}
	draw(++cp);
	localStorage.setItem("currentPost",cp);
}

function loadPrev(){
	var POST_LIST = JSON.parse(localStorage.getItem("postlist"));
	var cp = localStorage.getItem("currentPost");
	if(localStorage.getItem("currentPost") == 0)
		return;
	draw(--cp);

	localStorage.setItem("currentPost",cp);
}

function draw(ID){
	// TODO: CHANGE TO OTHER FILE
	var POST_LIST = JSON.parse(localStorage.getItem("postlist"));
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

	if(ID == undefined || POST_LIST[ID] == undefined){
		ID = 0;
		localStorage.setItem("currentPost",0); 
	}

	document.getElementById("mainImage").src = POST_LIST[ID][0];
	document.getElementById("postDescription").innerHTML = POST_LIST[ID][1];
	document.getElementById("postLocation").innerHTML = POST_LIST[ID][2][2];
	document.getElementById("postHandle").innerHTML = "@" + POST_LIST[ID][3];
	document.getElementById("postTimestamp").innerHTML = generateDate(new Date(POST_LIST[ID][4]));
	document.getElementById("postLikes").src = (POST_LIST[ID][5].includes("user") ? "img/likedIcon.png" : "img/heart.png");
	document.getElementById("postLikesNumber").innerHTML = POST_LIST[ID][5].length;
	document.getElementById("postCommentsNumber").innerHTML = POST_LIST[ID][6].length;
}

function newPost(img,text){
	function getGPSData(){
		return [40.3218825, -7.6217218, "Needs maps integration"];
	}

	add(img, text, getGPSData(),"user", new Date());
}


function like(id){
	var POST_LIST = JSON.parse(localStorage.getItem("postlist"));
	if(POST_LIST[id][5].includes("user")){
		var index = POST_LIST[id][5].indexOf("user");
		POST_LIST[id][5].splice(index, 1);
	}else{
		popHeart();
		POST_LIST[id][5].push("user");
		console.log("liked");
	}
	localStorage.setItem("postlist", JSON.stringify(POST_LIST));
			
	draw(id); 
}


function loadComments(id){
	var comments = JSON.parse(localStorage.getItem("postlist"))[id][6];
	if(comments.length == 0){
		var noComments = document.createElement("p");
		noComments.innerHTML = "This post has no comments yet, add one!";
		noComments.style.display = "block";
		noComments.id = "noComments";
		noComments.className = "textCenter"
		noComments.style.top = "36%";
		noComments.style.fontSize = "12px"
		noComments.style.color = "black";
		document.getElementById("commentsScreen").appendChild(noComments);
	}else{
		for(var i = 0; i < comments.length; i++){
			var nc = document.getElementById("commentTemplate").cloneNode(true);
			nc.style.top = i * 37 + "%";

			nc.style.visibility = "visibile"



			document.getElementById("commentsContainer").appendChild(nc);
		}
	}
}

function newComment(handle, message, likes = []){
	// TODO: add likes
	var currentPost = localStorage.getItem("currentPost");
	var postlist = JSON.parse(localStorage.getItem("postlist"));
	var postComments = postlist[currentPost][6];

	postComments.push([handle,message,likes]);

	localStorage.setItem("postlist", JSON.stringify(postlist));	


}
export {newComment, add,loadPrev, loadNext, draw, newPost, like, loadComments}	