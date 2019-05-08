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

function popHeart(target, original){
	var dd = 200;
	
	anime({
		targets: target,
		height: (original + 10) + "%",
		easing: 'easeOutQuart',
		duration: dd,
		endDelay: 125,
		complete: function(){
			anime({
				targets: target,
				height: original + "%",
				easing: 'easeInQuad',
				duration: dd,
			});
		}
	});

}

export{popHeart};