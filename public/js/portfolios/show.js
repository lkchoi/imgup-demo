
$('.editable').click(function(){
	$(this).hide();
	$(this).parent().find('.editable-save').show();
	$(this).parent().find('.editable-form').show();
	$(this).parent().find('.comment').hide();
});

// $('#container').magnificPopup({
// 	delegate: 'li:not(.inactive) a',
// 	type: 'image',
// 	gallery: { enabled: true },
// 	image: { titleSrc: 'data-title'},
// 	mainClass: 'mfp-fade'
// });

$(window).load(function() {

	// detect if a content_id was sent (fromt search results link)
	if (window.location.hash)
	{
		var sel = 'lightbox_image_' + window.location.hash.substr(1);
		var elem = $('a[data-lightbox="' + sel + '"]');
		elem.click();
	}
})