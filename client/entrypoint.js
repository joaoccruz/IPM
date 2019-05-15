import * as page  from "./js-libs/page.js";
import * as post  from "./js-libs/post.js"
import "./js-libs/anime-service.js";

var DEBUG_MODE = false;

if (DEBUG_MODE) {
	localStorage.clear();
}

if(localStorage.getItem("postlist") == null){
	localStorage.setItem("history", "[]");
	localStorage.setItem("images", "[]");
}

document.addEventListener('dragstart', function (e) {
    e.preventDefault();
});

const screenUpdate = setInterval(page.update, 1000);
page.load("lockscreen");
