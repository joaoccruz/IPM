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

function fadeIn(target,time=2000, f=null){
	anime({
		easing: "linear",
		targets: target,
		duration: time,
		opacity: 1,
		complete: f
	})
}

function fadeOut(target,time=2000, f=null){
	anime({
		targets: target,
		duration: time,
		opacity: 0,
		complete: f,
	})
}
function popupAnim(target, time=1000, callback){
	anime({
		targets: target,
		duration: time,
		easing: "easeInSine",
		direction: "alternate",
		endDelay: 500,
		opacity: [0,1]
	})
}

export{popHeart,popupAnim};