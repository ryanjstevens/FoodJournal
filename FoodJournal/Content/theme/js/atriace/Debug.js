var Debug = (function() { /*

class Debug {
	// Debug Class for Javascript */

	function print(s, detail = true) {
		// Generate the callStack
		var callStack = "";
		var callArray = [];
		var functionName = "";
		var className = ""
		var lineNumber = -1;

		if (true) { 
			callStack = new Error().stack;
			callArray = callStack.split('\n    at ');
			callStack = "";
			for (var i = 2; i < 3; i++) {
				if (callStack.length > 0) {
					callStack += " > ";
				}

				// Function Name
				if (callArray[i].indexOf("(") != -1) {
					functionName = callArray[i].substring(0, callArray[i].indexOf(" "));

					if (functionName == "constructor") {
						functionName = "";
					} else if (functionName.indexOf(".") != -1) {
						functionName = functionName.split(".")[1];
					}

					if (functionName.length > 0) {
						functionName = "." + functionName;
					}
				}

				className = callArray[i].substring(callArray[i].lastIndexOf("/") + 1, callArray[i].lastIndexOf(":"));
				lineNumber = className.substring(className.lastIndexOf(":") + 1, className.length);
				className = className.substring(0, className.indexOf(".js"));

				callStack += className + functionName + "():" + lineNumber;
			}
			// callStack = callStack.replace(/(?:\n\r*)/g, " >> ");
			// callStack = callStack.replace(/(?:    at )/g, "");
			//console.log(callArray);

			if (typeof Kit !== "undefined") {
				if (detail) {
					console.log(callStack + Kit.charPad(22 - callStack.length) + s);
				} else {
					console.log(s);
				}
				
			} else {
				if (detail) {
					console.log(callStack + "     " + s);
				} else {
					console.log(s);
				}
			}
			
		}

		//console.log(new Error().stack);
		//console.log(callStack + ": " + s);
		//console.log(arguments);
	}

	function report(arg) {
		// console.log("Reporting...");

		// console.log("PROPERTIES:");
		// for (var key in arg) {
		// 	console.log(key + ": " + Kit.getType(arg[key]));
		// }

		// console.log("ENUMERABLE:");
		// if (arg.length != null) {
		// 	for (var i = 0; i < arg.length; i++) {
		// 		console.log(i + ": " + Kit.getType(arg[i]));
		// 	}
		// }

		// console.log("\n\n");
		
	}

	// Constructor
	function constructor() {
		print("Debug Loaded");
	}
	constructor();

	// Public Accessos
	return {
		"print": print,
		"trace": print,
		"log": print,
		"report":report,
	}
}

)()