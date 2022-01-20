$('document').ready(function () {

	showImg();

});



function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}


function showImg() {
	var img = getUrlVars()["img"];
	var contentStr = "<img class=\"demoImg\" src=\"img/demo/" + img + ".png\">";

	console.log(img);

	contentArea = document.getElementsByTagName("page")[0];

	contentArea.outerHTML = "<page class=\"productPage\">" + contentStr + "</page>";


}