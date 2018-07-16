;(function (targetWidth) {
	var deviceWidth = screen.width;
	var ratio = deviceWidth / targetWidth;
	var viewport = document.querySelector('meta[name="viewport"]');
	if (ratio < 1) {
		viewport.setAttribute('content', 'width=device-width, initial-scale=' + ratio + ', minimum-scale=' + ratio + ', maximum-scale=' + ratio + ', user-scalable=yes');
	}
})(360);
