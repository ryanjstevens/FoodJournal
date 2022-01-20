// $(function(){
// 	var includes = $('[data-include]');
// 	jQuery.each(includes, function(){
// 		var file = 'views/' + $(this).data('include') + '.html';
// 		$(this).load(file);
// 	});
// });
document.addEventListener("DOMContentLoaded", init);

function init() {
	//var contentArea = document.getElementById("contentArea");
	document.list();
	// resultObject = Dom.get("p");
	//Dom.children(contentArea);
}

function loadAssets() {
	Debug.print("Loading assets...");
	$("#navLoad").load("nav.html");
}