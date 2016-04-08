/**
 * Execute a JS function by name
 * 
 * @param  {string} functionName the name of the function to call
 * @param  {context} context     the context of the function call
 * @param  {array} args          the args to the function
 */
function executeFunctionByName(functionName, context, args) {
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(this, [args]);
}


/**
 * Run this when the DOM is finished loading
 */
$(function() {

	/**
	 * Prevent <a> tags with href="#" from going to the top of the page
	 */
	$(document).on('click', 'a[href="#"]', function(e) { e.preventDefault(); });

	/**
	 * AJAX LINKS
	 *
	 * Allows links to send AJAX requests by specifying data-* attributes
	 * Assign the class 'ajax-link' to the DOM and the following data-*
	 *
	 * @required data-url
	 * @optional data-method
	 * @optional data-onsuccess
	 */
	$(document).on('click', '.ajax-link', function() {
		$.ajax({
			method: $(this).data('method') ? $(this).data('method') : 'POST',
			url: $(this).data('url'),
			data: $(this).data('body') ? $(this).data('body') : null,
			context: this,
			success: function(response) {
				if ( $(this).data('onsuccess') ) {
					executeFunctionByName( $(this).data('onsuccess'), window, response);
				}
			}
		});
	});
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// switch to type
$(document).ready(function() {
	$('#tab_' + getUrlParameter('type')).click();
});


/**
 * Run this when all resources on the page are done loading
 */
$(window).load(function() {

	/**
	 * WOOKMARK
	 *
	 * Wookmark-ify images lists into "tiles"
	 * Endless scroll where applicable
	 * Behave nicely with sortable behavior
	 */
	if ($('.wookmark-container').length)
	{
		var wookmark = new Wookmark('.wookmark-container', {
			autoResize: true,
			offset: 5,
			outerOffset: 10,
			itemWidth: 200
		});
	}
});
