
var page = 2;
$('#loadmore').click(function() {
  $.ajax({
    method: "GET",
    url: "/portfolios/scroll/"+portfolio_id+"?page="+page,
    beforeSend: function() {
      $('#loadmore').hide();
      $('#loading').show();
    },
    success: function (response) {
      if (response.empty === true)
      {
        $('#loadmore').hide();
        $('#loading').empty();
      }
      else
      {
        $('#maincontent').append(response);
        page++;
        $('#loading').hide();
        $('#loadmore').show();
      }
     
    }
  });
});

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


// $('.quickview').click(function() {
//   $('.quickview-modal').modal();
//   // empty modal body
//   $('.quickview-modal-body').empty();
//   $('.quickview-modal-body').append('<img src="'+$(this).parent().find('img').attr('src')+'" />');
//   $('.quickview-modal-body').append('<img src="/img/loading_lightbox.gif" style="padding-left:50%;">');

//   if ($(this).data('portfolio-id') != undefined)
//   {
//     $('.quickview-modal-body').load('/portfolios/quickview/'+$(this).data('portfolio-id'));
//   }
//   else
//   {
//     $('.quickview-modal-body').load('/contents/quickview/'+$(this).data('content-id'));
//   }
// });