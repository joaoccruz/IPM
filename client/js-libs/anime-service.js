// OWO

import anime from "./anime-master/lib/anime.es.js";

console.log("bye!")
anime({
	targets: '#fingerprint',
	width: '22%',
	easing: 'linear',
	loop: true,
	delay: 1000,
	duration: 250,
	direction: 'alternate',
});

function popHeart(target){
	var dd = 200;
	anime({
		targets: "#" + target,
		height: '70%',
		easing: 'easeOutQuart',
		duration: dd,
		endDelay: 125,
		complete: function(){
			anime({
				targets: "#" + target,
				height: '60%',
				easing: 'easeInQuad',
				duration: dd,
			});
		}
	});
}

export{popHeart};