/**
 * Refreshes the both "Sort" and "Describe" sections
 */
function refresh_gallery() {
	Dropzone.forElement('#uploader').removeAllFiles();
}

/**
 * Refresh the "Describe" section
 */
function refresh_describe() {
	$.ajax({
		method: "GET",
		url: "/contents/describe/10",
		success: function (response) {

			$('#describe').html(response);
			initTag();
			initRotate();

		}
	});
}

function initTag()
{
	$('.typeahead').typeahead('destroy');
	var portfolios = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.whitespace,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	remote: {
	  url: '/searchtag?search_term=%QUERY.json',
	  wildcard: '%QUERY'
	}
	});

	$('.typeahead').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	},
	{
	  name: 'title',
	  display: 'title',
	  source: portfolios
	});
	$('.content-tag-form').unbind();
	$('.content-tag-form').submit(function() {
		var content_form_id = $(this).data('content_id');
		if (content_form_id == undefined)
		{
			content_form_id = '';
		}
		$.ajax({
			method: "POST",
			url: "/contents/assign/"+content_form_id,
			data: $(this).serialize(),
			success: function (response) {
				var content_id = response.content.id;
				console.log(response);
				console.log(content_form_id);
				console.log(content_id);
				$.ajax({
					method: "GET",
					url: "/contents/tagform/"+content_id,
					success: function (response) {
						$('#content-'+content_form_id).empty();
						$('#content-'+content_form_id).append(response);
						initTag();
				}});
			},
			complete: function()
			{
				$.ajax({
					method: "GET",
					url: "/contents/tagform/"+content_form_id,
					success: function (response) {
						$('#content-'+content_form_id).empty();
						$('#content-'+content_form_id).append(response);
						initTag();
				}});
			}
		});
	});

	$('.content-tag-remove-form').unbind();
	$('.content-tag-remove-form').submit(function(event) {
		var content_form_id = $(this).data('content_id');
		var portfolio_form_id = $(this).data('portfolio_id');

		$.ajax({
		method: "DELETE",
		url: "/contents/removetag/"+content_form_id+'/'+portfolio_form_id,
		data: $(this).serialize(),
		complete: function () {
			$.ajax({
				method: "GET",
				url: "/contents/tagform/"+content_form_id,
				success: function (r) {
					$('#content-'+content_form_id).empty();
					$('#content-'+content_form_id).append(r);
					initTag();
					initRotate();
			}});
		}
		}
	});
	
	$('.ajax-delete-photo').click(function() {
		var content_id = $(this).data('content_id');
		$.ajax({
			method: 'DELETE',
			url : "/contents/" + content_id,
			method : "DELETE",
			success : function(r) {
				
				$('#content-' + content_id).remove();
			},
		});
	});
}


function initRotate()
{
	/**
	 * ROTATABLE
	 *
	 * Allow user to rotate images by click cw and ccw buttons
	 */
	$('.rotate-button').click(function() {

		var id = $(this).data('content-id');
		var degrees = $(this).data('degrees');

		console.log({
			id: id,
			degrees: degrees
		});

		$.ajax({
			method: 'PUT',
			url: '/contents/' + id + '/' + degrees,
			beforeSend: function(){
				$('.rotate-button').hide();
			},
			success: function (response) {
				// append timestamp to breack cache
				var rotated_image_url = response.s3_thumbnail_url + '?' + new Date().getTime();
				$('.content-id-' + id).attr('src', rotated_image_url);
			},
			complete: function(){
				$('.rotate-button').show();
			}
		});
	});
}

var page = 2;
$(function() {

	initRotate();
	initTag();

	$('#loadmore').click(function() {
		$.ajax({
			method: "GET",
			url: "/contents/describe/10?page="+page,
			success: function (response) {

				$('#describe').append(response);
				page++;
				initTag();
			}
		});
	});

});

/**
 * Run this when all resources on the page are done loading
 * @{@link  }
 */
$(window).load(function() {

	/**
	 * DROPZONE
	 *
	 * Allow user to upload images via dropzone
	 * Refreshes the gallery when queue is complete
	 * Removes completed images from dropzone
	 */
	Dropzone.forElement('#uploader')
		.on('success', function(file, response, xhr) {

			console.log(file);
			console.log(response);
			console.log(xhr);

			refresh_describe(response);
			refresh_gallery();
		})
		.on('error', function(file, response, xhr) {

			console.log(file);
			console.log(response);
			console.log(xhr);

			var error_msg = response.msg ? response.msg : 'One or more images failed to upload';
			console.log(error_msg);
			$("#flash-title").html(error_msg);
			$('#flash-container').show().delay(4000).fadeOut('slow');
		});
});
