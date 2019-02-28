var nomes = [
				"João Cardoso Pinho da Cruz",
				"David Ferreira de Sousa Duque",
				"Pedro Da Silva Freire",
			];
function expand(id) {
    var cName = document.getElementById("cName");
    var image = document.getElementById("std" + id);
    image.width = 250;
    cName.innerHTML = nomes[id - 1];
}

function deflate(id) {
    var cName = document.getElementById("cName");
    var image = document.getElementById("std" + id);
    image.width = 200;
    cName.innerHTML = " ";
}