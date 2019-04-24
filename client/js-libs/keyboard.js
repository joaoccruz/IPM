function renderRow(keys, pos, specials =[], sWidtH=[]){
	var specialSize = 0;
	for(var i = 0; i < specials.length< i++){
		specialSize += sWidtH[i]-1;
	}

	var buttonSize = Math.floor(100/(keys + specialSize));

}




function main(){
	renderRow(["Q","W","E","R","T","Y","U","I","O","P"], 30);
	renderRow(["A","S","D","F","G","H","J","K","L"], 50);
	renderRow(["Z","X","C","V","B","N","M",",","."], 70);
}

export {main};