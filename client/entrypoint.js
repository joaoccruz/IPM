import * as page  from "./js-libs/page.js";
import "./js-libs/anime-service.js";

localStorage.setItem("user", "user");
var DEBUG_MODE = false;

if(DEBUG_MODE){
	caches.keys().then(function(names) {
    for (let name of names)
        caches.delete(name);
	});
	localStorage.clear();
}

document.addEventListener('dragstart', function (e) {
    e.preventDefault();
});

const screenUpdate = setInterval(page.update, 1000);
page.load("lockscreen");
