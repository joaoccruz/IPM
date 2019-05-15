import * as date  from "./date.js";
import {popHeart} from "./anime-service.js";
import * as server from "./server.js"

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

if (!Element.prototype.getElementById) {
  Element.prototype.getElementById = function(id) {
    for(var i = 0; i < this.childNodes.length; i++){
    	if(this.childNodes[i].nodeName === "DIV"){
    		var rec = this.childNodes[i].getElementById(id);
    		if(rec){
    			return rec;
    		}
    	} 

    	if(id == this.childNodes[i].id)
    		return this.childNodes[i];
    }
    return null;
  };
}


function add(src, desc, location, user, date, likes=[], comments=[]){
	const data = {
		"src": 		src,
		"desc": 	desc,
		"location": location,
		"user": 	user,
		"date": 	date,
		"likes": 	JSON.stringify(likes),
		"comments":  JSON.stringify(comments)
	} 

	server.post("addPost", data);

}

function updatePostList(func){
	function next(){
		func();
	}

	function f(e){
		localStorage.setItem("postlist", e);
		next();
	}

	function g(){
		next();
	}

	server.post("getPosts", {}, f, g);
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

function draw(ID = localStorage.getItem("currentPost")){
	// TODO: CHANGE TO OTHER FILE
	var POST_LIST = JSON.parse(localStorage.getItem("postlist"));
	if(!POST_LIST)
		return;
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

	document.getElementById("mainImage").src = POST_LIST[ID].src;
	document.getElementById("postDescription").innerHTML = POST_LIST[ID].desc;
	document.getElementById("postLocation").innerHTML = POST_LIST[ID].location;
	document.getElementById("postHandle").innerHTML = "@" + POST_LIST[ID].user;
	document.getElementById("postTimestamp").innerHTML = generateDate(new Date(POST_LIST[ID].date));
	document.getElementById("postLikes").src = (POST_LIST[ID].likes.includes(localStorage.getItem("userHandle")) ? "img/likedIcon.png" : "img/heart.png");
	document.getElementById("postLikesNumber").innerHTML = POST_LIST[ID].likes.length;
	document.getElementById("postCommentsNumber").innerHTML = POST_LIST[ID].comments.length;
}

function newPost(img,text){
	function getGPSData(){
		return "Needs maps integration";
	}

	add(img, text, getGPSData(),localStorage.getItem("userHandle"), new Date());
}


function like(target, list){
	var index = list.indexOf(localStorage.getItem("userHandle"));
	if(index != -1){
		target.src = "img/heart.png"
		list.splice(index, 1);
	}else{
		list.push(localStorage.getItem("userHandle"));
		target.src = "img/likedIcon.png";
		popHeart(target, 60);
	}

	return list;		 
}



function getComments(post){
	return post.comments;
}

function loadComments(id = localStorage.getItem("currentPost")){
	var POST_LIST = JSON.parse(localStorage.getItem("postlist"));
	var comments = POST_LIST[id].comments;
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
		var noCommentsMessage = document.getElementById("noComments"); 
		if(noCommentsMessage){
			noCommentsMessage.remove();
		}

		var dist = 0;
		for(var i = 0; i < comments.length; i++){
			console.log(i);
			var nc = document.getElementById("commentTemplate").cloneNode(true);
			var post = JSON.parse(localStorage.getItem("postlist"))[id];
			nc.id = "commentPostedU" + id + "P" + i;
			nc.style.width = "100%";
			nc.style.top = dist + "px";
			nc.style.visibility = "visible";
			document.getElementById("commentsContainer").appendChild(nc)

			var handle = nc.getElementById("commentHandle");
			var text = nc.getElementById("commentText");

			var heart = nc.getElementById("commentHeart");
			var heartNum = nc.getElementById("commentLikes");
			heartNum.innerHTML = comments[i].likes.length;
			heart.src = (comments[i].likes.includes(localStorage.getItem("userHandle")) ? "img/likedIcon.png" : "img/heart.png");


			text.style.top = handle.clientHeight + 2 + "px";

			handle.innerHTML = comments[i].user;
			text.innerHTML = comments[i].message;


			
			var h = text.clientHeight + handle.clientHeight;

			if(h > 80)
				h = 80;
			
			dist += h + 5;
			h = h  + 4 + "px";
			nc.style.height = h;
			let curr = i;
			let h1 = heart;
			h1.addEventListener("click", () => 
				{var pl = JSON.parse(localStorage.getItem("postlist"));
				 pl[currentPost()].comments[curr].likes = like(h1,pl[currentPost()].comments[curr].likes);
				 heartNum.innerHTML = pl[currentPost()].comments[curr].likes.length;
				 localStorage.setItem("postlist", JSON.stringify(pl));
				 var data = {
				 	"postId": currentPost(),
				 	"commentId": curr,
				 	"user": localStorage.getItem("userHandle")
				 }
				 server.post("likeComment", data);
				});
		

		}
	}
}

function unloadComments(){
	var comments = JSON.parse(localStorage.getItem("postlist"))[localStorage.getItem("currentPost")].likes;
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

function newComment(handle, message, likes = []){
	// TODO: PREVENT EMPTY
	var currentPost = localStorage.getItem("currentPost");
	var postlist = JSON.parse(localStorage.getItem("postlist"));
	var comment = {"user":handle,"message": message, "likes": likes};
	postlist[currentPost].comments.push(comment);
	localStorage.setItem("postlist", JSON.stringify(postlist));	

	data = {
		"comment": comment,
		"user" = currentPost
	}
	server.post("addComment", comment)
	loadComments();

}

function currentPost(){
	return localStorage.getItem("currentPost");
}

export {updatePostList, newComment, add,loadPrev, loadNext, draw, newPost, like, loadComments, unloadComments}	