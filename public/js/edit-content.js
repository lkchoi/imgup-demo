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

		}
	});
}

function initCredits()
{
	$('.typeahead_credit').typeahead('destroy');
	var users = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
		  url: '/searchuser?search_term=%QUERY.json',
		  wildcard: '%QUERY'
		}
	});
	$('.typeahead_credit').bind('typeahead:select', function(ev, suggestion)
	{
		console.log(suggestion.groups[0].name);
		$('#user_group').val(suggestion.groups[0].name);
	});

	$('.typeahead_credit').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	},
	{
	  name: 'username',
	  display: 'username',
	  source: users
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
	$('.content-tag-remove-form').submit(function() {
		var content_form_id = $(this).data('content_id');
		var portfolio_form_id = $(this).data('portfolio_id');
		console.log(content_form_id);
		console.log(portfolio_form_id);
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
				}});
			}
		});
	});

	$('.ajax-delete-photo').click(function() {
		var content_id = $(this).data('content_id');
		$.ajax({
				method: 'DELETE',
				url : "/contents/" + content_id,
				method : "DELETE",
				success : function(r) {
					window.location.replace('/contents/manage')
				},
			});
	});
}

var page = 2;
$(function() {


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
			success: function (response) {
				// append timestamp to breack cache
				var rotated_image_url = response.s3_thumbnail_url + '?' + new Date().getTime();
				$('.content-id-' + id).attr('src', rotated_image_url);
			}
		});
	});

	initTag();

	initCredits();

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

});
