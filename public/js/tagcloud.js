/**
 * TagCloud
 * @param {[type]} html [description]
 */
function TagCloud(html)
{
	/**
	 * Get the tags from the html (with their # or @ prefixes)
	 * @return {array} array of tags
	 */
	this.tags = function() {

		// FIXME prevent matches on email addresses?

		var tags = html.replace(/<[^>]*>/g,'')	// remove html tags to prevent matches on links with #
			.match((/[#@][a-zA-Z0-9\-_]+/g));	// sort by longest to shortest to prevent partial replacement

		return (!tags) ? [] : tags.sort(function (a,b) {
			return b.length - a.length; 
		});
	}

	/**
	 * Get the tags without their # or @ prefixes
	 * @return {array} array of terms
	 */
	this.terms = function() {
		var tags = this.tags();
		var terms = [];
		_.each(tags, function(tag, i) {
			terms[i] = tag.substring(1);
		});
		return terms;
	}

	/**
	 * Get a list of urls keyed by tag (with # or @prefixes)
	 * @return {object} urls by tag
	 */
	this.links = function() {
		var tags = this.tags();
		var terms = this.terms();
		var links = {};
		_.each(tags, function(tag, i) {
			var term = terms[i];
			var tag = tags[i];

			// check prefix
			switch (tag[0])
			{
				case '#': 
				links[tag] = '/search?search_term=' + encodeURI(term);
				break;

				case '@':
				links[tag] = '/users/' + encodeURI(term);
				break;
			}
		});
		return links;
	}

	/**
	 * Get the linkified version of the html
	 * @return {[type]} [description]
	 */
	this.linkify = function() {
		var links = this.links();
		var unlinked = html;
		var linked = html;
		_.each(links, function(url, tag) {
			linked = linked.replace(tag, '<a href="'+url+'">'+tag+'</a>')
		});
		return linked;
	}
}

/**
 * Automatically linkify html in elements with the class "tagcloud"
 */
$('.tagcloud').html(function() {
	var cloud = new TagCloud($(this).html());
	// console.log(cloud);
	return cloud.linkify();
});