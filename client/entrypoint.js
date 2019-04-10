import * as page  from "./js-libs/page.js";


var DEBUG_MODE = false;

if(DEBUG_MODE)
	localStorage.clear();

const screenUpdate = setInterval(page.update, 1000);
page.load("lockscreen");
