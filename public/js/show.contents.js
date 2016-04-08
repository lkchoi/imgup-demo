$('.editable').editable({
	url: $(this).data('url'),
	ajaxOptions: {
		type: 'PUT',
	    dataType: 'json'
	},
	pk: $(this).data('pk')
});


// readmore
$('.readmore').readmore({
  collapsedHeight: 90,
  speed: 75,
  moreLink: '<a href="#">Read more</a>',
  lessLink: '<a href="#">Read less</a>',
});
// $('#images-container li:first').find('a').click();
function jumpPortfolio()
{
  // jump with keys
  $(document).keydown(function(e){
    if (e.keyCode == 37) {
      window.location.href = $('.prev-post').attr('href');
      return false;
    } 
    if (e.keyCode == 39) { 
     window.location.href = $('.next-post').attr('href');
     return false;
   }
  });
}
jumpPortfolio();


/**
 * Hide the Unfollow button and show the Follow button
 * Called when Unfollow button is hit
 */
function show_follow(response) {
  console.log(response);
  $('#unfollow-button-' + response.user_id).hide();
  $('#follow-button-' + response.user_id).show();
}
/**
 * Hide the Follow button and show the Unfollow button
 * Called when Follow button is hit
 */
function show_unfollow(response) {
  console.log(response);
  $('#follow-button-' + response.user_id).hide();
  $('#unfollow-button-' + response.user_id).show();
}