function init() {
	if (browserCheck() != "modern") {
		var viewedMessage = getSessionVar("browserWarning");
		if (viewedMessage == null) {
			viewedMessage = "false";
			setSessionVar("browserWarning", "false");
			console.log("First Session.  Setting viewedMessage = false")
		}

		if (viewedMessage == "false") {
			var dismissObject = document.getElementsByTagName("browserWarning")[0];
			dismissObject.classList.add("fadeIn", "animated");
			dismissObject.style.display = "block";
			console.log("Showing BrowserWarning");
		} else {
			console.log("Not the first session: viewedMessage = true");
		}
	}
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