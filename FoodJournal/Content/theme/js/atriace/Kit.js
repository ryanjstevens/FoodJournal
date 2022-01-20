var Kit = (function() { /*

class Kit {
	// Toolkit for common operations with no unifying class */
	
	// Time

	var lastMsg = "";
	var lastLap = 0;
	var startTime = 0;

	function now() {
		return new Date().getTime();
	}	
	
	function start(msg = "") {
		lastMsg = msg;
		Debug.print("Start: " + msg);
		lastLap = now();
		startTime = lastLap;
	}

	function lap(msg = "") {
		var answer = 0;
		if (startTime == 0) {
			start();
		} else {
			var now_ = now();
			Debug.print(lastMsg + ((msg.length > 0) ? "(" + msg + ")" : "") + ": " + getTime(now_ - lastLap));
			answer = now_ - lastLap;
			lastLap = now_;
		}
		return answer;
	}

	function stop() {
		var answer = 0;
		var now_ = now();
		Debug.print("End: " + lastMsg + " " + getTime(now_ - lastLap))
		Debug.print("TOTAL:" + getTime(now-startTime));
		answer = now_ - startTime;
		lastLap = startTime = 0;
		return answer;
	}

	function getTime(mil, depth = 6) {
		/* Converts Milliseconds into human readable time */
		var msg;
		if (mil < 1000) {
			msg = mil + "ms";
		} else {
			msg = mil + "ms";
			var seconds = Math.floor(mil/1000)
			msg = seconds%60 + " Seconds, " + msg;
			var minutes = Math.floor(seconds/60)
			depth--;
			if (minutes > 0 && depth > 0) {
				msg = minutes%60 + " Minutes, " + msg;
				var hours = Math.floor(minutes/60);
				depth--;
				if (hours > 0 && depth > 0) {
					msg = hours%24 + " Hours, " + msg;
					var days = Math.floor(hours/24);
					depth--;
					if (days > 0 && depth > 0) {
						msg = Math.floor(days%29.6) + " Days, " + msg;
						var months = Math.floor(days/29.6);
						depth--;
						if (months > 0 && depth > 0) {
							msg = Math.floor(months%12) + " Months, " + msg;
							var years = Math.floor(days/365);
							depth--;
							if (years > 0 && depth > 0) {
								msg = years + " Years, " + msg;
							}
						}
					}
				}
			}
		}

		return msg;
	}

	function getType(obj) {
		var type = typeof(obj);
		if (obj == null) {
			type = null;
		} else if (type == "object") {
			if (Array.isArray(obj)) {
				type = "Array";
			} else {
				var literalName = obj.toString().split(" ")[1];

				if (literalName == undefined) {
					literalName = "Object";
				} else {
					literalName = literalName.substring(0, literalName.length-1);
				}

				if (literalName.indexOf("Element") != -1) {
					// type = literalName.substring(4, literalName.length-7); // Old approach

					Debug.report(obj);
				// if (obj.hasOwnProperty("type")) {
					// type = obj.type();
				} else {
					switch (literalName) {
						case "Object":
							type = literalName;
							break;
						default:
							Debug.print("No handler for " + literalName);
							type = capitalize(literalName);
					}
				}
			}
		} else {
			type = capitalize(type);
		}

		return type;
	}

	// String Operations

	function capitalize(msg) {
		// Capitalizes every word in a string
		var array = msg.split(" ");
		msg = "";
		for (var k in array) {
			if (k > 0 ) {
				msg += " ";
			}
			msg += array[k].substring(0, 1).toUpperCase() + array[k].substring(1);
		}
		return msg;
	}

	function charPad(num, char = " ") {
		/* Returns a string of num length of char type */
		num = (num < 1) ? 0 : num;
		var i = 0, txt = "";
		while (i <= num) {
			txt = txt + char;
			i++;
		}
		return txt;
	}

	function depad(s, char = " ") {
		/* Returns a string without the char on the front or back */

		while (s.substring(0, 1) == char) {
			s = s.substring(1);
			//print("s = " + s + "|--", "notice");
		}

		while (s.substring(s.length-1) == char) {
			s = s.substring(0, s.length-1);
			//print("s = " + s + "|--", "notice");
		}

		return s;
	}

	function constructor() {
		if (typeof Debug !== "undefined") {
			Debug.print("Kit Loaded");
		} else {
			console.log("Kit Loaded");
		}
	}
	constructor();

	// Public Accessos
	return {
		"now":now,
		"start":start,
		"lap":lap,
		"stop":stop,
		"getTime":getTime,
		"capitalize":capitalize,
		"charPad":charPad,
		"depad":depad,
		"getType":getType
	}
}

)()