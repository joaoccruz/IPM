import * as page  from "./js-libs/page.js";
import * as post  from "./js-libs/post.js"
import "./js-libs/anime-service.js";

localStorage.setItem("user", "user");
var DEBUG_MODE = false;

if(localStorage.getItem("postlist") == null){
	post.add("img/beach.jpeg", "Nada como o ar da montanha, na praia", [40.3218825,-7.6217218, "Serra da Estrela"], "Senhor_Malaquias", new Date(), ["Senhor_António","Senhor_Malaquias"], []);
	post.add("img/montanha.jpg", "Imagem genérica de uma montanha", [40.3218825,-7.6217218, "Montanha"], "Senhor_José", new Date(new Date()-604800000), [], []);
	post.add("img/gil.jpg", "Grande Gil! 👌", [40.3218825,-7.6217218,"Parque das Nações"], "Senhor_António", new Date(2019, 3, 18), [], []);
	localStorage.setItem("history", "[]");
	localStorage.setItem("images", "[]");
}

document.addEventListener('dragstart', function (e) {
    e.preventDefault();
});

const screenUpdate = setInterval(page.update, 1000);
page.load("lockscreen");
