var IO = (function() { /*

class IO {
	// Input Output class for handling data */

	var IOEvents = [
		"progress",
		"load",
		"error",
		"abort"
	]

	var cache = [];		// THE ALMIGHTY CACHE!
	var queue = [];		// A sequenceable queue for loading objects

	var threads = 1;				// Maximum number of concurrent loading operations.
	var loading = 0;				// The active count of loading operations
	var remaining = 0;				// ??
	var cacheSize = 0;				// The current total size of object loaded into memory.
	var cacheLimit = 1024*1024*15;	// 15MB
	
	var slots = []
	
	function eventHandler(event) {
		// Debug.print(event);
		Debug.print(
			"currentTarget: " + event.currentTarget + ", " + 
			"path: " + event.srcElement.responseURL + ", " +
			"type: " + event.type + ", " + 
			"status: " + event.srcElement.status
		)
	}

	function load(path) {
		var request = new XMLHttpRequest();

		for (var event of IOEvents) {
			Hub.add(request, event, eventHandler);
		}

		// var i = 1;
		// for (var keys in IOEvents) {
		// 	Debug.print(i + " > " + keys);
		// 	i++;
		// }

		// i = 0;
		// for (var values of IOEvents) {
		// 	Debug.print(i + " > " + values);
		// 	i++;
		// }

		Debug.print("Loading: " + path);
		request.overrideMimeType("application/json");
		request.addEventListener("load", eventHandler, true);
		request.open("GET", path);
		request.onreadystatechange = function () {
			Debug.log("State changed...");

			if (request.readyState == 4 && request.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				Debug.log(request.responseText);
			}
		}

	}

	// Constructor
	function constructor() {
		if (typeof Debug !== "undefined") {
			Debug.print("IO Loaded");
		} else {
			console.log("IO Loaded");
		}
	}
	constructor();

	// Public Accessos
	return {
		"load": load
	}
}

)()
