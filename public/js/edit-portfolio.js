
/**
 * Refreshes the both "Sort" and "Describe" sections
 */
function refresh_gallery() {
	Dropzone.forElement('#uploader').removeAllFiles();
	refresh_images();
	// refresh_describe();
}

/**
 * Refresh the "Sort" section
 */
function refresh_images() {
	$.ajax({
		method: "GET",
		url: "/images",
		success: function(response) {
			$('#gallery').html(response);
		}
	});
}

function remove_tile(data) {
	var image_id = data['image_id'];
	$('#image-' + image_id).remove();
}

$(function() {

	refresh_images();

	/*
	 * SORTABLE
	 * 
	 * Allow user to sort "Gallery" images by dragging and dropping
	 * 
	 * @requires jquery-ui
	 */
	$(".sortable").disableSelection();
	$('.sortable').sortable({
		update: function(event, ui) {
			$.ajax({
				url: '/images/reorder',
				type: 'PUT',
				data: {
					order: $(this).sortable('toArray')
				}
			})
		}
	});


	/**
	 * ROTATABLE
	 *
	 * Allow user to rotate images by click cw and ccw buttons
	 */
	$('.rotate-button').click(function() {

		var id = $(this).data('image-id');
		var degrees = $(this).data('degrees');

		console.log({
			id: id,
			degrees: degrees
		});

		$.ajax({
			method: 'PUT',
			url: '/images/' + id + '/' + degrees,
			success: function (response) {
				// append timestamp to breack cache
				var rotated_image_url = response.s3_thumbnail_url + '?' + new Date().getTime();
				$('.image-id-' + id).attr('src', rotated_image_url);
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
	 * DELETABLE 
	 *
	 * Allow user to delete image by clicking on
	 */
	$('.delete-image-link').click(function() {
		console.log('delete image');
		var url = $(this).data('url');
		$.ajax({
			method: 'DELETE',
			url: url,
			success: function (response) {
				$(this).remove();
			}
		})
	});

	/**
	 * DROPZONE
	 *
	 * Allow user to upload images via dropzone
	 * Refreshes the gallery when queue is complete
	 * Removes completed images from dropzone
	 */
	Dropzone.forElement('#uploader')
		.on('queuecomplete', function() {
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
