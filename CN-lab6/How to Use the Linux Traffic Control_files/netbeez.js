jQuery(document).ready(function() {
	function tabContentImageToggle(){
		var activeTabText = jQuery('.nb-tabbed-content-toggle .active-tab strong').text();
		jQuery('.nb-tabbed-img-toggle').find('img').each(function() {
			jQuery(this).css({"display":"none"});
		});
		console.log(activeTabText);
		var thisImage = jQuery('.nb-tabbed-img-toggle .nb-image-' + activeTabText);
		console.log(thisImage);
		thisImage.css({"display":"block"});
	}
	setTimeout( function(){
		tabContentImageToggle();
	}, 150);
	jQuery('.nb-tabbed-content-toggle').on('click', function() {
		setTimeout( function(){
			tabContentImageToggle();
		}, 150);
	});
});
