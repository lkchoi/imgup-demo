// console.log("Loaded comments.js")



function commentsFormInit()
{
	// Prevents default reload behavior
	$('#create-comment-form').unbind();
	$('#create-comment-form').submit(function(e)
	{
		e.preventDefault();
		createComment();
	});
	$('.delete-comment').unbind();
	$('.delete-comment').click(function() {
		deleteComment($(this).data('comment-id'));
	});
}

// Send AJAX post request to create new comment
function createComment() 
{
	// console.log($('#create-comment-form').serialize());
	$.ajax({
		method: 'POST',
		url: '/comments',
		data: $('#create-comment-form').serialize(),
		success: function(response) {
			commentCreated(response);
		}
	})
}

// Append the new comment to the list
function commentCreated(response)
{
	// console.log(response);


	var linkified_text = (new TagCloud(response.comment.text)).linkify();

	var comment_div = '<li class="clearfix" id="comment_div_' + response.comment.id + '">' +
		'<div class="comment-box clearfix">' +
			'<div class="author clearfix">' +
				'<a class="username" href="#">' + response.user.full_name + '</a>' +
				'<span class="date" style="float:right;"><a data-comment-id="'+ response.comment.id +'" class="delete-comment"><i class="fa fa-times"></i></a></span>' +
				'<p class="comment tagcloud" id="comment-' + response.comment.id + '">'+ linkified_text +'</p>' +
			'</div>' +
		'</div>' +
	'</li>';


	$('#comments_ul').prepend(comment_div);

	// var cloud = new TagCloud(comment_div);


	// Get selector of .deleteComment of the button that was just created
	// console.log('practice getting specific delete comment selector');

	var delete_button_id = '.delete-comment[data-comment-id='+response.comment.id+']';

	// console.log(delete_button_id);

	$(delete_button_id).click(function(e)
	{
		// Disable the Delete Comment button
		$(this).attr('disabled',true);

		// Extract data-comment-id and send AJAX request
		deleteComment($(this).data('comment-id'));
	});

	$('#comment_text').val('');
}


function deleteComment(data_comment_id)
{
	$.ajax({
		method: 'DELETE',
		url: '/comments/' + data_comment_id,
		success: function(response) {
			commentDeleted(response);
		}
	})
}

function commentDeleted(response)
{
	// console.log(response);
	// console.log($('button[data-comment-id='+response.comment_id+']').parent().parent().parent());
	$('a[data-comment-id='+response.comment_id+']').parent().parent().parent().remove();
}


function editComment(data_comment_id, comment_text)
{
	// console.log(data_comment_id, comment_text);
	$.ajax({
		method: 'PUT',
		url: '/comments/' + data_comment_id,
		data: { 'comment_text': comment_text },
		success: function(response) {
			commentEdited(response);
		}
	})
}

function commentEdited(response)
{	
	var comment_id = "#comment-"+response.comment_id;
	$(comment_id).text(response.comment_text);
	$(comment_id).show();
}