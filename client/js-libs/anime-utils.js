// OWO

import tween from "./anime-master/lib/anime.es.js";

function a() {
	console.log("hi!")
	tween.anime({
		targets: '#fingerprint',
		width: '25%'
	});
}
function b() {
	console.log("bye!")
	tween.anime({
		targets: '#fingerprint',
		width: '20%'
	});
}