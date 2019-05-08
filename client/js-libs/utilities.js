function unloadEventListeners(target){
	var clone = target.cloneNode(true);

	try{
		target.parentNode.replaceChild(clone, target);
	}catch{
		
	}
	
	for(var i = 0; i < target.childNodes.length; i++){
		unloadEventListeners(target.childNodes[i]);
	}
}

export {unloadEventListeners}