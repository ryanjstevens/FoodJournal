var loadNodes = (function() { 
	var oReq = new XMLHttpRequest();

	var requestIndex = 0;
	var requests = [
		"/node/head.html",
		"/node/nav.html",
		"/node/footer.html"
	]

	function init() {
		oReq.addEventListener("progress", updateProgress);
		oReq.addEventListener("load", transferComplete);
		oReq.addEventListener("error", transferFailed);
		oReq.addEventListener("abort", transferCanceled);


		var ua = window.navigator.userAgent;
		var msie = ua.indexOf('MSIE '); // IE 10
		var trident = ua.indexOf('Trident/'); // IE 11
		var isIE = (msie > 0 || trident > 0);
		
		if (browserCheck() != "modern") {
			console.log("Throwing unsupported browser message.")
			requests.push("/node/unsupported_browser.html");
		}

		stepLoad();
	}

	function stepLoad() {
		// Steps through the asset requests sequentially.
		if (requestIndex < requests.length) {
			oReq.open("GET", requests[requestIndex]);
			oReq.send();
		} else {
			// Load the relavent page script
			var page = window.location.pathname.split("/").pop().split(".")[0];
			if (page != null && page.length > 0) {
				console.log("Loading Page Script for: " + page);
				// oReq.open("GET", "js/pages/" + page + ".js");
				var fragment = document.createRange().createContextualFragment('<script src="js/pages/' + page + '.js"></script>');
				document.head.appendChild(fragment.childNodes[0]);
			}
		}
	}

	function post() {
		Debug.log("Post firing...")
		var content = document.getElementsByTagName("content")[0];

		var gsap = new TimelineMax();
		gsap.to(
			content,
			{
				"opacity":1,
				"duration":1,
				"ease":"power4.out"
			}
		);
	}


	// progress on transfers from the server to the client (downloads)
	function updateProgress (oEvent) {
		if (oEvent.lengthComputable) {
			var percentComplete = oEvent.loaded / oEvent.total * 100;
			// ...
		} else {
			// Unable to compute progress information since the total size is unknown
		}
	}

	function transferComplete(e) {
		var fragment = document.createRange().createContextualFragment(e.target.response);
		var content = document.getElementsByTagName("content")[0];

		switch (requests[requestIndex]) {
			case "/node/head.html":
				while (fragment.childNodes.length > 0) {
					var node = fragment.childNodes[0];
					document.head.appendChild(node);
				}
				requestIndex++;
				console.log("Added head elements.")
				break;
			case "/node/nav.html":
				var header = document.getElementsByTagName("header")[0];

				content.replaceChild(fragment.childNodes[0], header);
				requestIndex++;
				console.log("Added Nav");
				break;
			case "/node/footer.html":
				var footer = document.getElementsByTagName("footer")[0];

				// var s = document.createElement("script");
				// s.type = "text/javascript";
				// // s.innerHTML = "console.log('hello world!')";
				// s.inner
				// footer.append(s);

				// footer.text('<script>console.log("hello world!")</script>')

				content.replaceChild(fragment.childNodes[0], footer);

				// var scriptNode = document.createRange().createContextualFragment('<script type="text/javascript">loadNode.post()</script>');
				// content.appendChild(scriptNode.childNodes[0]);

				requestIndex++;
				console.log("Added Footer");
				break;
			case "/node/unsupported_browser.html": {
				document.body.insertBefore(fragment.childNodes[0], content);
				requestIndex++;
				console.log("Added Unsupported Browser Notification");
				break;
			}
		}		

		stepLoad();
	}

	function transferFailed(e) {
		console.log("An error occurred while transferring the file.");
	}

	function transferCanceled(e) {
		console.log("The transfer has been canceled by the user.");
	}

	function constructor() {
		console.log("loadNodes Loaded");
		init();
	}

	function closeBrowserWarning() {
		console.log("Hiding BrowserWarning");

	    var dismissObject = document.getElementsByTagName("browserWarning")[0];
	    dismissObject.classList.add("fadeOut", "animated");

	    dismissObject.addEventListener('animationend', function() { 
	    	var dismissObjectDone = document.getElementsByTagName("browserWarning")[0];
	    	dismissObjectDone.style.display = "none";
	    	console.log("Killed overlay.")
	    })

	    setSessionVar("browserWarning", "true");
	}

	function setSessionVar(property, value) {
		if (sessionStorage != null && sessionStorage.setItem != null) {
			sessionStorage.setItem(property, value)
		}
	}

	function getSessionVar(property) {
		if (sessionStorage != null && sessionStorage.getItem != null) {
			return sessionStorage.getItem(property);
		} else {
			return null;
		}
	}

	function browserCheck() {
		if (/MSIE 10/i.test(navigator.userAgent)) {
		   // This is internet explorer 10
		   return "ie";
		} else if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
		    // This is internet explorer 9 or 11
		    return "ie";
		} else if (/Edge\/\d./i.test(navigator.userAgent)){
		   // This is Microsoft Edge
		   return "edge";
		} else {
			return "modern";
		}
	}


	constructor();

	return {
		"post": post,
		"close":closeBrowserWarning
	}
})()