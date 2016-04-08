  /**
   * Hide the Unfollow button and show the Follow button
   * Called when Unfollow button is hit
   */
  function show_follow(response) {

    $('#unfollow-button-' + response.user_id).hide();
    $('#follow-button-' + response.user_id).show();
  }
  /**
   * Hide the Follow button and show the Unfollow button
   * Called when Follow button is hit
   */
  function show_unfollow(response) {

    $('#follow-button-' + response.user_id).hide();
    $('#unfollow-button-' + response.user_id).show();
  }


  $('#message_flash').click(function() {
  	$('#user_message').show();
  	$('#message_flash').hide();
  	$('#message').val('');
  });

  
	// readmore
	$('.readmore').readmore({
		collapsedHeight: 200,
		speed: 75,
		moreLink: '<a href="#" class="read-more-link">Read more</a>',
		lessLink: '<a href="#" class="read-less-link">Read less</a>',
	});

	var wm01;
	var wm05;


	$(window).load(function() {
		var wmoptions = {
			autoResize: true,
			offset: 5,
			outerOffset: 10,
			itemWidth: 200
		};

		wm01 = new Wookmark('#most_recent_images', wmoptions);
		wm05 = new Wookmark('#collaboration_images', wmoptions);

		$('#tab01_link').on('shown.bs.tab', function(e) { wm01.layout(true); });
		$('#tab05_link').on('shown.bs.tab', function(e) { wm05.layout(true); });

	});

	

  var cpage = 2;
  $('#tab05_link').click(function() {
  	$('#maincollaborations').wookmark();
  });
  $('#collab_loadmore').click(function() {
    $.ajax({
      method: "GET",
      url: "/contents/tagged/{{ $user->id }}?page="+cpage,
      beforeSend: function() {
        $('#collab_loadmore').hide();
        $('#collab_loading').show();
      },
      success: function (response) {

        if (response == '')
        {
          $('#collab_loadmore').hide();
        }
        else
        {
        	$('#maincollaborations').append(response);
        	
        	cpage++;
        }
        $('#collab_loading').hide();
        $('#collab_loadmore').show();
      }
    });
  });


  $('.quickview').click(function() {
    $('.quickview-modal').modal();
    // empty modal body
    $('.quickview-modal-body').empty();
    $('.quickview-modal-body').append('<img src="'+$(this).parent().find('img').attr('src')+'" />');
    $('.quickview-modal-body').append('<img src="/img/loading_lightbox.gif" style="padding-left:50%; padding-top: 1em;">');
    if ($(this).data('portfolio-id') != undefined)
    {
      $('.quickview-modal-body').load('/portfolios/quickview/'+$(this).data('portfolio-id'));
    }
    else
    {
      $('.quickview-modal-body').load('/contents/quickview/'+$(this).data('content-id'));
    }

  }); 

  $(document).ready(function() {
    $('.mobile-hero-image').css('margin-top', '-117px');
  });
