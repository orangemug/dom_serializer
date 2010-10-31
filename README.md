# dom_serializer
Serialize a dom for use offline, this should flatten the dom(innerHTML) as well flattening all images in the DOM tree to data URLs.
This is not entended for use by dynamic pages, any dynamic content should be stripped out before processing.

## Features 

 * Flattens images to dataURLs
 * Flattens images in inline styles.

## Todo
Plans to add the following:

 * Tidy my method of walking over the dom we're using far to much memory.
 * Flatten css rules in stylesheets (including images), currently only flattens inline styles.
 * What else can we flatten, hmmmm...
   * Audio/Video tags? We could grab there unsupported values.


## Simple Flatten Example
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

## Chunk Flatten Example
HTML Before:
    <div id="test_serialze">
      <h1>Chunk flatten</h1>
      <div style="background-image:url('images/bullet.jpg');">Hi!</div>
    </div>

Javascript:
    new DOMSerializer($('#test_serialze')[0]).chunk(500,{
      chunk: function(idx,htmlChunk) {          
        console.info("chunk"+idx,htmlChunk);
      },
      complete: function() {          
        console.info("Complete");          
      }
    });   

Logged chunks:
    [log] chunk0:
      <h1>Chunk flatten</h1><div style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAARCAYAAADKZhx3AAAEhklEQVRIib2Vu29TWRDGf/fle42xMVEeiABCvEQBSPRUFqIACRr+AhASEhEVHc1SI6gQEg8hBClShCJUIVSIgCIiWULpUChweBkbE8cmufa5Pt8WrK+c3X6nmtHMOTNzvjnfACiKIgEC5HleqgdBoFwul9qAHMcRoDAM5bruJp/v+/J9P9UH4wdzAMJxHDmOkwZmMplNdv+Q67ppokEfkBYXBEGa6N+Fuq4rx3HSu5x/AgjDEGMM1lqCIGB8fJzh4WGSJKHb7fLhwweSJMH3fXq9HpLYsWMHuVwOay3tdptarQaA67q4rks+n2fbtm34vk+326VSqdAX33EcJNHpdAA4duwY58+fp1QqsWfPHjzP
    [log] chunk1:
      Y2Vlhbm5Oebm5pifnwcgk8lw7tw5Ll68iDGGSqXCtWvX+PLlC9ZaCoUCV65c4fTp0wB8/fqVS5cu0Ww2sdbCIKZ79+7V7Oys+vLu3TuVy2V1Oh1J0sLCgg4ePJjOwsOHD1Pf6uqqTp06lT754cOHVa1WJUlJkqharW6aH/rv77qu7t69K0nqdDq6evWqDh06pP379+vChQtqt9uSpPv372v79u0CdOfOHUmSMUaSND09neI4MTGhJEkkSdZara2tpViniT3PUxRFarVastZqZmZGxWJR2WxWnudpy5YtevLkiYwxarfbGh8fF6Bbt25JkpaWlvTjxw8ZY3TgwAHlcjktLS2pWq1qeXlZxhjVarVNv8F1HIder8euXbvYunUrjuNQLpdZW1tjY2ODXq+HMYY3b97gOA65XI6RkREACoUCACsrK8zOzuL7PhMTExw/fpwjR47w7NkzPn78iO/7WGvxfZ9Op/NHl0QYhuTzeQCMMWxsbGCt
    [log] chunk2:
      pT94ruvSaDTSiRwbGwNgfX2dJEkIw5CpqSlKpRKXL1/m6NGj/Pr1i4WFBQqFAtZa1tfX8TyPJEkIggA3k8nQ6XRoNpsYYwiCgGw2C4DjOAB0Oh3GxsbwPA9jDPV6HYBsNoskgiDg1atXvH//Ht/3KZVKfPv2jZmZmfR7FYtFkiRJm3P7Rr1ep1ar0ev1OHHiBMPDw3ielxZSKpXo9XrEcUylUiGKIhqNRtrF0NAQN2/exHVd4jjmxYsXNJtNMpkM1lokYa0lDMM//9h1Xay1JEnCvXv3uHHjBidPnuT69etMTU0hiTNnznD27Fk8z+PRo0f8/PkTay3FYjEli263y+vXr5mcnCSTyfD06dMUGmvtpuSu60Kf0oIg0M6dOzU5Oanfv39LkiqVipaXlyVJcRxrenpa+/btS6fz8ePHiuNYb9++1ejoaEqZg7z8/PlzSVKr1dpEpR7wVxRFdLtdWq0Wi4uLfP78mXa7zejoKMYYFhcXefDg
    [log] chunk3:
      Abdv3+bTp0/0KRZgZGSE+fl5yuUyq6urACRJQi6XwxjD7t27+f79O+VymZcvXwIgCcf3ffVxBgiCAGMMQ0ND+L6fXtRoNOjDEkURcRyTz+eRBEAcxyRJQhRFqQ2kXO04DvV6PT3LYPtRFP1njfVprs9ug9uGge3T1/vxYRj+Z0MN2ul2+r/lbwHPAkzZjBzRAAAAAElFTkSuQmCC); ">Hi!</div>
    [log] Complete
    
    