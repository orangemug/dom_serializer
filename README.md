# dom_serializer
Serialize a dom for use offline, this should flatten the dom(innerHTML) as well flattening all images in the DOM tree to data URLs.
This is not entended for use by dynamic pages, any dynamic content should be stripped out before processing.


## Todo
Plans to add the following:

 * Flatten images in css style sheets
 * What else can we flatten, hmmmm...


## Example
HTML Before:
	<div id="test_serialze">
		<h2>A tag and a image</h2>
		<img src="images/om.jpeg">
	</div>
    
Javascript:
	new DOMSerializer(document.getElementById("test_serialze")).flatten(function(html) {
		console.log(html);
	});


Generated flattened html:
	<h2>A tag and a image</h2>
	<img src="data:image/png;base64,iVBORw0........uQmCC">

