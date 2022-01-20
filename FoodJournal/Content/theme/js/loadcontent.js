$('document').ready(function () {

	var thisHeader = document.getElementsByTagName("header")[0];
	setNode(thisHeader, "node/nav.html", false, "selectProduct");
	setNode(document.getElementsByTagName("footer")[0], "node/footer.html");
	
	//get the current html filename to get the JSON content
	var thisFile = window.location.pathname;
	thisFile = thisFile.substring(thisFile.lastIndexOf('/') + 1);
	//if it isn't the homepage, load JSON content	
	if (thisFile.length > 0){
		thisFile = "json/" + thisFile.split(".")[0] + ".json";
		setNodeJSON(document.getElementsByTagName("page")[0], thisFile);
	}
	setNode(document.getElementsByTagName("head")[0], "node/head.html", true);
});


function setNode(element, urlStr, useInnerHTML = false, runAfter = "", args = null){
	if (urlStr != "json/loadImg.json"){
		var contentStr = "";
		var contentArea = element;
		getUrl(urlStr).then(function (response) {
			//console.log("Success!", response);
			contentStr = response.toString();
			if (!useInnerHTML){
				contentArea.outerHTML = contentStr;			
			} else {
				var fragment = document.createRange().createContextualFragment(contentStr);
				contentArea.appendChild(fragment.firstChild);
			}

			if (runAfter != ""){
				console.log (runAfter);
				this[runAfter](args);
			}
		}, function (error) {
			console.error("Failed!", error);
		})	
	}
}

function setNodeJSON(element, urlStr){
	if (urlStr != "json/loadImg.json"){
		var contentStr = "";
		var contentArea = element;
		getUrl(urlStr).then(function (response) {
			//console.log("Success!", response);
			contentStr = response.toString();
			setContentJSON(contentArea, contentStr);
		}, function (error) {
			console.error("Failed!", error);
		})
	}
}

//select the proper product
function selectProduct(){
	
	var contentArea = document.getElementById("products");
	//contentArea.innerHTML  = 'dd';

	//remove any current highlights
	var navs = contentArea.getElementsByClassName("current");
	for (var i = 0; i < navs.length; i++){
		removeClass(navs[i], "current");
	}

	//add it to the appropriate li
	var navs = contentArea.getElementsByClassName("sub");
	var thisFile = window.location.pathname;
	thisFile = thisFile.substring(thisFile.lastIndexOf('/') + 1);	
	
	for (var i = 0; i < navs.length; i++){
		links = navs[i].getElementsByTagName("a");
		for (var u = 0; u < links.length; u++){
			
			if (links[u].getAttribute("href") != "" && links[u].getAttribute("href") == thisFile){
				addClass(links[u].parentElement.parentElement.parentElement, "current");
			}
		}
	}

	//set spacing on nav menu
	navMargins();

}


function navMargins(){
	//find all product buttons in the nav bar
	var prod = document.getElementsByClassName("productNav");

	if (prod.length > 0){
		var nav = prod[0].parentElement.parentElement;
		var navWidth = nav.offsetWidth;
		var navLeft = nav.offsetLeft;
		var navRight = nav.offsetLeft + nav.offsetWidth;
	}

	//loop through the buttons, and adjust the sub button alignment
	for (var i = 0; i < prod.length; i++){

		//add a mouseover to adjust the nav placement
		prod[i].addEventListener("mouseover", function(e) {	


			var subs = e.target.parentElement.getElementsByTagName("li");

			if (subs.length > 0){

				var subCenter = e.target.offsetLeft + (e.target.offsetWidth / 2);
				
				var subUlWidth = subs[0].parentElement.offsetWidth;
				var subUlCenter = (subUlWidth / 2);

				/*
				var subLeftOld = subs[0].offsetLeft;
				var subWidth = 0;
				for (var u = 0; u < subs.length; u++){
					subWidth = subWidth + subs[u].offsetWidth;
				}

				var subLeftNew = subCenter - (subWidth / 2);

				//subs[0].parentElement.style.paddingLeft = subLeftNew;
				var centerDiff = subLeftNew - subLeftOld;
*/

				//for (var u = 0; u < subs.length; u++){
				//	subs[u].style.position = "relative";
				//	subs[u].style.marginLeft = 0;
				//}
				



				var thisPadding = parseInt(subCenter - subUlCenter);
				if (thisPadding >= 0){
					subs[0].parentElement.style.paddingLeft = thisPadding + "px";
					subs[0].parentElement.style.paddingRight = 0;
				}
				else {
					//subs[0].parentElement.style.paddingLeft = 0;
					//subs[0].parentElement.style.paddingRight = (-thisPadding) + "px";

					subs[0].parentElement.style.paddingLeft = thisPadding + "px";
					subs[0].parentElement.style.paddingRight = 0;
				}


				//subs[0].style.position = "absolute";
				//subs[0].style.marginLeft = parseInt(subCenter - subUlCenter) + "px";
				
				console.log("FOUND " + subs.length);

				console.log(subUlCenter+ " - " + subCenter);

				//subs[0].style.position = "absolute";
				//subs[0].style.left = subLeftNew + "px";

				

				
			};

			



		});
	}
}



function getUrl(url) {
	//return a promise
	return new Promise(function (resolve, reject) {

		var req = new XMLHttpRequest();
		req.open('GET', url);

		req.onload = function () {
			if (req.status == 200) {
				//404 not found
				resolve(req.response);
			} else {



				//other errors
				reject(Error(req.statusText));
			}
		};

		//network errors
		req.onerror = function () {
			reject(Error("Network Error"));
		};

		//send the request
		req.send();
	});
}

function getFromHTTP(url) {
	var returnStr = "Page not found " + url;
	const Http = new XMLHttpRequest();

	Http.open("GET", url);
	Http.responseType = 'text';


	Http.onreadystatechange = (e) => {
		console.log("before " + returnStr);
		console.log(Http.responseText);
		returnStr = Http.responseText;
		console.log("after " + returnStr);
		return returnStr;
	}
	Http.send();

}

function setContentJSON(element, jsonStr) {
	var jsonObj = JSON.parse(jsonStr);
	var contentArea = element;
	var contentStr = '';
	var lastLeft = false;

	for (var i = 0; i < jsonObj.length; i++) {
		var sectionStr = '';
		var sideClasses = '';
		var mainClasses = '';
		var backgroundStr = '';
		var sideImgStr = '';
		var sectionClasses = 'section';
		var bgStr = '';
		var slideStr = '';

		for (var u = 0; u < jsonObj[i].length; u++) {

			//set up initial classes
			classes = '';
			if (jsonObj[i][u].hasOwnProperty('classes')) {
				classes = jsonObj[i][u].classes;
			}

			if (jsonObj[i][u].hasOwnProperty('sectionclasses')) {
				sectionClasses = sectionClasses + " " + jsonObj[i][u].sectionclasses;
			}

			switch (jsonObj[i][u].type) {
				case "title":
					sectionStr = sectionStr + encapsulate(jsonObj[i][u].text, "h3", classes);
					break;
				case "subtitle":
					sectionStr = sectionStr + encapsulate(jsonObj[i][u].text, "h4", classes);
					break;
				case "body":
					sectionStr = sectionStr + encapsulate(jsonObj[i][u].text, "div", classes);
					break;
				case "background":
					if (jsonObj[i][u].hasOwnProperty('mainclasses')) {
						mainClasses = mainClasses + " " + jsonObj[i][u].mainclasses;
					}
					bgStr = '<img src="' + jsonObj[i][u].image + '" class="' + ("bgImg " + classes).trim() + '">';
					//backgroundStr = '<div class="sectionContainer"><img class="mainimg" src="' + jsonObj[i][u].image + '.jpg"></div>';
					break;
				case "fullimage":
					sectionClasses = (sectionClasses + " sectionImg " + classes).trim();
					sectionStr = '<img src="' + jsonObj[i][u].image + '" class="' + ("fullImg").trim() + '">';
					break;
				case "sideimage":
					//get the classes for each section
					mainClasses = "sectionMain";
					if (jsonObj[i][u].hasOwnProperty('classes')) {
						sideClasses = jsonObj[i][u].classes;
					}
					if (jsonObj[i][u].hasOwnProperty('mainclasses')) {
						mainClasses = mainClasses + " " + jsonObj[i][u].mainclasses;
					}
					//alternate between left and right display
					if (!lastLeft) {
						sideClasses = "sectionLeft " + sideClasses;
					} else {
						sideClasses = "sectionRight " + sideClasses;
					}
					lastLeft = !lastLeft;
					//create image string
					sideImgStr = '<img src="' + jsonObj[i][u].image + '" class="' + ("sideImg " + sideClasses).trim() + '">';
					//sideImgStr = jsonObj[i][u].image;
					break;
				case "slide":
					thisClasses = 'sectionSlides ';
					if (jsonObj[i][u].hasOwnProperty('classes')) {
						thisClasses = jsonObj[i][u].classes;
					}
					slideStr = slideStr + '<img src="' + jsonObj[i][u].image + '" class="' + thisClasses.trim() + '">';
					break;
				// case "actionButton":
				// 	sectionStr = '<a class="actionButton" href="' + jsonObj[i][u].url + '">' + jsonObj[i][u].text + '</a>';
				// 	break;
			}
		}


		//if it's a header
		if (i == 0) {
			sectionClasses = sectionClasses + ' sectionMed sectionHeader';
		}

		//if it's the last section
		if (i == jsonObj.length - 1) {
			sectionClasses = sectionClasses + ' sectionLast';
		}

		//if it has a background
		if (bgStr.length > 0) {
			sectionStr = bgStr + encapsulate(sectionStr, "div", mainClasses);
		}

		//if it has a side image:
		if (sideImgStr.length > 0) {
			sectionClasses = sectionClasses + " notransition";

			sectionStr = encapsulate(sectionStr, "div", mainClasses);
			if (!lastLeft) {
				sectionStr = sectionStr + sideImgStr;
			} else {
				sectionStr = sideImgStr + sectionStr;
			}
		}

		//if it has a slideshow
		if (slideStr.length > 0) {
			slideStr = slideStr + '<button class="btn-button btn-display-left" onclick="plusDivs(-1)">❮</button><button class="btn-button btn-display-right" onclick="plusDivs(+1)">❯</button>';
			slideStr = encapsulate(slideStr, "div", "slideContainer");
			sectionStr = sectionStr + slideStr;
		}

		sectionStr = encapsulate(sectionStr, "div", sectionClasses);
		contentStr = contentStr + sectionStr;
	}
	// contentArea.outerHTML = "<page class=\"productPage\">" + contentStr + "</page>";

	var fragment = document.createRange().createContextualFragment(contentStr);
	while (fragment.children.length > 0) {
		contentArea.appendChild(fragment.children[0]);
	}
}

function encapsulate(content, brackets, classes) {
	var returnStr = '';
	classes = classes.trim();
	if (classes.length > 0) {
		returnStr = '<' + brackets + ' class="' + classes + '">' + content + '</' + brackets + '>';
	} else {
		returnStr = '<' + brackets + '>' + content + '</' + brackets + '>';
	}

	return returnStr;
}

function removeClass(element, removeStr){
	element.className  = element.className.replace(removeStr, "").trim();
}

function addClass(element, addStr){
	element.className = (element.className + " " + addStr).trim();
}