var activePage = "#about";
var nextPage = "";

function showPage(divId) {
}

function showJob(divId) {
	var panel = document.getElementById(divId);
	$(divId).slideToggle();

	;
	$("html, body").animate({ scrollTop: $(divId).position().top - 170 }, "slow");
}

images = [
	"banner_house.jpg",
	"banner_kitchen.jpg",
	"banner_plans.jpg",
	"banner_road.jpg"
]

function preload(imageArray, index) {
    index = index || 0;
    if (imageArray && imageArray.length > index) {
        var img = new Image ();
        img.onload = function() {
            preload(imageArray, index + 1);
        }
        img.src = "images/" + images[index];
    }
}


$(document).ready(function() {
	//preload(images);

	/* Navigation Top */
	$("#nav li").click(function() {
		$("#nav .1").removeClass('current');
		$("#nav .2").removeClass('current');
		$("#nav .3").removeClass('current');
	});

	$("#nav .1").click(function() {
		// $(activePage).fadeOut(250, showCurrent);
		// nextPage = "#about";
		$("#nav .1").addClass('current');
	});

	$("#nav .2").click(function() {
		// $(activePage).fadeOut(250, showCurrent);
		// nextPage = "#positions";
		$("#nav .2").addClass('current');
	});
	
	$("#nav .3").click(function() {
		// $(activePage).fadeOut(250, showCurrent);
		// nextPage = "#contact";
		$("#nav .3").addClass('current');
	});

	/* Footer Navigation */

	$("#footerNav li").click(function() {
		$("#nav .1").removeClass('current');
		$("#nav .2").removeClass('current');
		$("#nav .3").removeClass('current');
	});

	$("#footerNav .1").click(function() {
		$(activePage).fadeOut(250, showCurrent);
		nextPage = "#about";
		$("#nav .1").addClass('current');
	});
	$("#footerNav .2").click(function() {
		$(activePage).fadeOut(250, showCurrent);
		nextPage = "#positions";
		$("#nav .2").addClass('current');
	});
	$("#footerNav .3").click(function() {
		$(activePage).fadeOut(250, showCurrent);
		nextPage = "#contact";
		$("#nav .3").addClass('current');
	});
});

function showCurrent() {
	// $(nextPage).fadeIn(250);
	$("html, body").animate({ scrollTop: 0 }, "slow");
	window.scrollTo(0, 0);
	activePage = nextPage;
}

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
	var loc = window.pageYOffset;
	var height = 80; //document.getElementById("banner").height;
	if (loc > height) {
		document.getElementById("menu").classList.add("droppedMenu");
	} else {
		document.getElementById("menu").classList.remove("droppedMenu");;
	}

	//console.log("loc: " + loc + ", height: " + height);
}