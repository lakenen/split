# Split!

Split is a jQuery plugin that splits open a page with a nice animation to reveal content underneath!

*ONLY WORKS IN FIREFOX*

[Demo](http://lakenen.com/split)

## How to use

Include jQuery, [Animation.js](https://github.com/camupod/animation.js) and jquery.split.js in your page.

```html
<div id="example">
	<h4>this thing will be split open!</h4>
	<img src="holycrap.jpg" />
	words and stuff split right down the middle!
</div>
```
```js
// splits it open!
$('#example').split({
	content: '<h1>this is on the inside!</h1>'
});

// unsplits it
$('#example').split(); // could also call unsplit()

//opens it again!
$('#example').split();
```

## Issues

* Only works in Firefox (4.0+)
* Probably broken in so many ways

## License 

(The MIT License)

Copyright 2012 Cameron Lakenen

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
