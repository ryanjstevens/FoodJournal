var videos = document.getElementsByTagName("video");

window.addEventListener('scroll', checkScroll, false);
window.addEventListener('resize', checkScroll, false);
			
function checkScroll() {
	vidScroll();
}

function vidScroll(){
	var playPromise = [];
	var playbackRate = [];
	for (var i = 0; i < videos.length; i++) {
		//console.log (i);					
		
		playPromise[i] = videos[i].play();
		playbackRate[i] = 1;

		var x = videos[i].offsetLeft, y = videos[i].offsetTop, w = videos[i].offsetWidth, h = videos[i].offsetHeight, r = x + w, //right
			b = y + h, //bottom
			visibleX, visibleY, visible;

			visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
			visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

			visible = visibleX * visibleY / (w * h);
			var fraction = 0.8;
			if (visible > fraction) {
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

function vidEnded(e){
	e.srcElement.play();
}