var videos = document.getElementsByTagName("video");
var faders = document.getElementsByClassName("animateFade");
var centers = document.getElementsByClassName("vertical-center");
var lockAreas = document.getElementsByClassName("lockArea");
 var sectionSlides = document.getElementsByClassName("sectionSlides");

var windowWidth = 0;
var windowHeight = 0;

window.addEventListener('scroll', checkScroll, false);
window.addEventListener('resize', checkScroll, false);

var slideIndex = 1;
$('document').ready(function(){
	checkScroll();
	showDivs(slideIndex);
});

function checkScroll() {
	vidScroller();
	fadeScroller();
	if (window.innerWidth != windowWidth || window.innerHeight != windowHeight){
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;		
		centerVert();
		//adjustlocks();
	}
}

//centers vertically aligned elements
function centerVert(){
	for (var i = 0; i < centers.length; i++) {
		//console.log("height: " + centers[i].scrollHeight + " parentparent:" + centers[i].parentElement.parentElement.scrollHeight);
		centers[i].parentElement.style.paddingTop = Math.round((centers[i].parentElement.parentElement.scrollHeight - centers[i].scrollHeight) / 2) + "px";
	}
}

//resizes column to fit maximum lock size
function adjustlocks(){
	

	for (var i = 0; i < lockAreas.length; i++) {
		//console.log("width: " + lockcols[i].scrollWidth + " win:" + window.innerWidth ) ; 
		//lockAreas[i].style.width = Math.round((window.innerWidth - locksize)-20) + "px";
		var lock = lockAreas[i];
		var lockr = lockAreas[i].parentElement.getElementsByClassName("lockRemainder")[0];

		//console.log ("width: " + lock.scrollWidth + " remainder: " + lockr.scrollHeight);
		console.log ("window: " + window.innerWidth + " remainderw: " + lockr.scrollWidth + " calc: " + (window.innerWidth - 400));
	}
}

//plays all text fade in animations when scrolled into view
function fadeScroller(){
	for (var i = 0; i < faders.length; i++) {
		if (isVisible(faders[i])){
			faders[i].classList.add("fadeInUp");
			faders[i].classList.remove("fadeOut");
		}
		else {
			faders[i].classList.remove("fadeInUp");
			faders[i].classList.add("fadeOut");
		}
	}

}

//plays all video elements when scrolled into view
function vidScroller(){	
	var playPromise = [];
	var playbackRate = [];
	for (var i = 0; i < videos.length; i++) {
		//console.log (i);					
		
		playPromise[i] = videos[i].play();
		playbackRate[i] = 1;
	
		if (isVisible(videos[i])) {
			if (playPromise[i] !== undefined) {
				playPromise[i].then(_ => {
					// playback started
				})
				.catch(error => {
					// Auto-play was prevented
				});
			  }
		} else {
			if (playPromise[i] !== undefined) {
				//pause
				playPromise[i].then(_ => {}).catch(error => { });
			}
		}
	}
}

function isVisible(thisElement){
//console.log(thisElement);
	var x = thisElement.offsetLeft, y = thisElement.offsetTop, w = thisElement.offsetWidth, h = thisElement.offsetHeight;
	var visibleX, visibleY, visible;
	var r = x + w;
	var b = y + h; 

	visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
	visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

	visible = visibleX * visibleY / (w * h);
	var fraction = 0.8;

	if (visible > fraction) {
		return true;
	}
	return false;

}

function vidEnded(e){
	e.srcElement.play();
}


$(document).on('scroll', function() {
	//console.log("Scrolling - " + window.scrollY);
	//console.log($(".moveWithScroll").offset().top);
//var distfromtop = ($(".moveWithScroll").offset().top - window.scrollY);
//var distfrombottom = window.innerHeight - distfromtop;
//console.log(isVisible(document.getElementsByClassName("moveWithScroll")[0]) + " - " + distfrombottom );
//console.log("distance " + distfromtop);
//console.log(window.innerHeight);

    //$(".moveWithScroll").css("top", Math.max(180 - 0.2*window.scrollY, 0) + "px");
    //$(".moveWithScroll").css("opacity", Math.max(1 - 0.004*window.scrollY, 0));
})














function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
 
  console.log(sectionSlides.length);
  if (n > sectionSlides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = sectionSlides.length} ;
  for (i = 0; i < sectionSlides.length; i++) {
    sectionSlides[i].style.display = "none";
  }
  sectionSlides[slideIndex-1].style.display = "block";
}