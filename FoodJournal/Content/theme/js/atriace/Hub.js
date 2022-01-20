var Hub = (function() { /*

class Hub {
	// Rebust Event Handling */

	function add(target, event, func) {
		Debug.print("Adding: " + target + ":" + event + ">>" + func.name + "()");
		target.addEventListener(event, func);
	}

	function remove(target, event, func) {
		Debug.print("Removing: " + target + ":" + event + ">>" + func.name + "()");
		target.removeEventListener(event, func);
	}

	// Constructor
	function constructor() {
		if (typeof Debug !== "undefined") {
			//Debug.print("Hub Loaded");
		} else {
			console.log("Hub Loaded");
		}
	}
	constructor();

	// Public Accessos
	return {
		"add": add,
		"remove": remove
	}
}

)()