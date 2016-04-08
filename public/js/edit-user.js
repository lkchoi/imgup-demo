/**
 * User Edit Page
 */
$(function() {

	/*
	 * EDITABLE
	 * 
	 * Allow user to edit User Profile inline
	 * 
	 * @requires x-editable
	 */
	$('.editable').editable({
		url: $(this).data('url'),
		ajaxOptions: {
			type: 'PUT',
		    dataType: 'json'
		},
		pk: $(this).data('pk')
	});

	// select dropdown for user group
	$("#user__group").editable({
		type: 'select',
		source: [
			// { value: 'admin',         text: 'Admin' },
			// { value: 'super_admin',   text: 'Super Admin' },
			{ value: 'blogger',       text: 'Blogger', selected: 'selected' },
			{ value: 'designer',      text: 'Designer' },
			{ value: 'model',         text: 'Model' },
			{ value: 'photographer',  text: 'Photographer' },
			{ value: 'stylist',       text: 'Stylist' }
		],
		ajaxOptions: {
			type: 'PUT',
			dataType: 'json'
		}
	});

	// simulate click on file field
	$('.upload.upload_square_profile_image').click(function() {
		$('#square_profile_image_file').click()
	});

	// update the profile image via ajax
	$('#square_profile_image_file').change(function() {

		var form = $('#square_profile_image_form');

		// non-ajax version
		// form.submit();

		// ajax version
		var formData = new FormData(form[0]);
		$.ajax({
			method: 'POST',
			url: form.attr('action'),
			data: formData,
			processData: false,
			contentType: false,
			success: function(response) {

				// swap out old image with new
				$('#square_profile_image').replaceWith(
					'<img src="' + response.url + '" id="square_profile_image" />'
				);
			}
		});
	});



	// simulate click on file field
	$('.upload.upload_full_profile_image').click(function() {
		$('#full_profile_image_file').click()
	});

	// update the profile image via ajax
	$('#full_profile_image_file').change(function() {

		var form = $('#full_profile_image_form');

		// non-ajax version
		form.submit();
	});


});