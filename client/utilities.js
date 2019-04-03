function loadLockScreen(){
	var d = new Date();
	var min = d.getMinutes().toString();
	var hr  = d.getHours().toString();
	document.getElementById("lockscreenText").innerHTML = hr + ":" + min ;
}
