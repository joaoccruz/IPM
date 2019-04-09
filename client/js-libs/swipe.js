
function enable(target, directions, f){
	// TODO: Add drag
	var pos = {};
	function getSwipeDir(pos, f, minDistX = 30, minDistY = 20){
		var dx = pos["xf"] - pos["xi"];
		var dy = pos["yf"] - pos["yi"];
		var dir = null;

		
		 
		var d, dist, dir;
		
		(Math.abs(dx) >= Math.abs(dy)) ? (d = dx, dist = minDistX, dir = "x") : (d = dy, dist = minDistY, dir = "y");

		if(Math.abs(d) < dist){
			return null;
		}


		var ret = (d > 0 ? 0 : 1);
		if(dir == "x"){
			return (ret == 0 ? "right" : "left");
		}else if(dir == "y"){
			return (ret == 0 ? "down" : "up");
		}

						
	}

	function storeVal(event){
		pos["xi"] = event.clientX;
		pos["yi"] = event.clientY;
	}

	function validate(event){
		pos["xf"] = event.clientX;
		pos["yf"] = event.clientY;
		
		var swipeDir = getSwipeDir(pos)
		if(directions.constructor === Array){
			for (var i = 0; i < directions.length; i++) {
				if(directions[i] == swipeDir){
					var func = f[i];
					func(swipeDir);
				}
			}
		}else if(swipeDir == directions){
			f(swipeDir);
		}

	}

	target.addEventListener("mousedown" , storeVal, false);
	target.addEventListener("touchstart", storeVal, false);

	target.addEventListener("mouseup", validate, false);
	target.addEventListener("touchend", validate, false);
	
}

function disable(target){
	target.removeEventListener("mousedown");
	target.removeEventListener("touchstart");
	target.removeEventListener("mouseup");
	target.removeEventListener("touchend");
}
export {enable,disable};