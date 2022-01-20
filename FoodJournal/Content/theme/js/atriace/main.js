document.addEventListener("DOMContentLoaded", init);

function eventHandler(event) {
	// Debug.print(event);
	Debug.print(
		"currentTarget: " + event.currentTarget + ", " + 
		"path: " + event.srcElement.responseURL + ", " +
		"type: " + event.type + ", " + 
		"status: " + event.srcElement.status
	)
}

function init() {
	// IO.load("atriace/json/directory.json");
	var request = new XMLHttpRequest();
	request.overrideMimeType("application/json");
	request.addEventListener("load", eventHandler, true);
	request.open("GET", "atriace/json/directory.json");
	request.onreadystatechange = function () {
          if (request.readyState == 4 && request.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            Debug.log(request.responseText);
          }
    };
	request.send(null);
}