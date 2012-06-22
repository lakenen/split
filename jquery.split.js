/*!

	jquery.split.js
	Version 0.1.0
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

**/

(function ($) {
	'use strict';
	
	var i = 0,
		domPrefix = '',
		defaults = {
			content: ''
		};
	
	var Splitimation = Animation.extend(function (elt, options) {
		options = $.extend({duration: 0.5}, options);
		this._super(options);
		var transform = getTransform(elt.get(0));
		var oldA = getRotationDegrees(transform).y;
		return {
			update: function (pos) {
				var newA = (((options.a- oldA) * pos) + oldA).toFixed(8);
				elt.css('-' + domPrefix.toLowerCase() + '-transform', 'rotateY('+newA+'deg)');
			}
		}
	});
	
	function split(elt, options) {
		elt = $(elt);
		options = $.extend(defaults, options || {});
		
		var width = elt.width(),
			height = elt.height(),
			position = elt.position(),
			id = elt.attr('id') || 'jqsplit-id-'+(i++),
			container = elt.clone().empty(),
			content = $('<div id="split-'+id+'-content">').append(options.content),
			left = $('<div id="split-'+id+'-left">'),//.append(elt.clone()),
			right = $('<div id="split-'+id+'-right">'),//.append(elt.clone()),
			eltStyle = getComputedStyle(elt.get(0)),
			initCss = {
				display: eltStyle.display,
				position: eltStyle.position,
				top: eltStyle.top,
				left: eltStyle.left,
				width: eltStyle.width,
				height: eltStyle.height
			}, 
			modifiedCss = {
				position: 'absolute',
				display: 'block',
				top: -10000,
				left: -10000,
				width: width,
				height: height
			};
		
		elt.attr('id', id)
		container.append(content).append(left).append(right);
		
		content.css({
			margin: 'auto',
			marginTop: eltStyle.marginTop,
			width: '80%',
			height: height,
			overflow: 'auto'
		});
		container.css({
			position: 'relative',
			width: width,
			height: height,
			//'margin-top': -22
		});
		container.css('-' + domPrefix.toLowerCase() + '-perspective', width*2 + 'px');
		
		left.css({
			width: width/2,
			height: height,
			position: 'absolute',
			overflow: 'hidden',
			top: 0,
			left: 0,
			background: '-moz-element(#'+id+') no-repeat'
		});
		left.css('-' + domPrefix.toLowerCase() + '-transform-origin', '0 0 0');
		
		right.css({
			width: width/2,
			height: height,
			position: 'absolute',
			overflow: 'hidden',
			top: 0,
			left: width/2,
			background: '-moz-element(#'+id+') no-repeat '+Math.floor(-width/2)+'px 0px'
		});
		right.css('-' + domPrefix.toLowerCase() + '-transform-origin', (width/2)+'px 0 0');
		
		function open() {
			if (this._open) return;
			this._open = true;
			Animation.cancelAll();
			elt.after(container).css(modifiedCss);
			new Splitimation(left, { a: -70 });
			new Splitimation(right, { a: 70 });
		}
		
		function close(callback) {
			if (!this._open) return;
			this._open = false;
			Animation.cancelAll();
			new Splitimation(left, { a: 0 });
			new Splitimation(right, { 
				a: 0,
				onStop: function () {
					container.detach();
					elt.css(initCss);
				}
			});
		}
		
		function toggle(callback) {
			if (this._open) this.close();
			else this.open();
		}
		
		return {
			open: open,
			close: close,
			toggle: toggle
		}
	}
	
	function getDomPrefix() {
		var domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
			prefix = '', 
			elt = document.body;
		for (var i = 0; i < domPrefixes.length; i++) {
			if (elt.style[domPrefixes[i] + 'Transform'] !== undefined) {
				prefix = domPrefixes[i];
				break;
			}
		}
		return prefix;
	}
	
	function getRotationDegrees(transform) {
		var rad2deg = 180 / Math.PI,
			rotate = { x: 0, y: 0, z: 0 };

		if (transform.length < 16) {
			rotate.z = Math.atan2(transform[1], transform[0]) * rad2deg;
			//if (rotate.z < 0) rotate.z += 360;
			return rotate;
		}
		
		// 3d
		rotate.y = -Math.asin(transform[2]);
		if (Math.cos(rotate.y) != 0) {
			rotate.x = Math.atan2(transform[6], transform[10]);
			rotate.z = Math.atan2(transform[1], transform[0]);
		} else {
			rotate.x = Math.atan2(-transform[8], transform[5]);
			rotate.z = 0;
		}
		rotate.x *= rad2deg;
		rotate.y *= rad2deg;
		rotate.z *= rad2deg;
		//if (rotate.x < 0) rotate.x += 360;
		//if (rotate.y < 0) rotate.y += 360;
		//if (rotate.z < 0) rotate.z += 360;
		return rotate;
	}
	
	function getTransform(element) {
		var style = window.getComputedStyle(element),
			str = style['-'+domPrefix.toLowerCase()+'-transform'] || style[domPrefix+'Transform'];
		if (!str || str == 'none')
			return [0,0,0,0,0,0];
	
		var splits = str.substr(str.indexOf('(')+1).split(',');
		for (i = 0; i < splits.length; ++i)
			splits[i] = parseFloat(splits[i]);
	
		return splits;
	}
	
	$.fn.split = function (options) {
		return this.each(function () {
			var splitter = $(this).data('splitter');
			if (splitter) {
				splitter.toggle();
			} else {
				splitter = split(this, options);
				splitter.open();
				$(this).data('splitter', splitter);
			}
		});
	};
	
	$.fn.unsplit = function () {
		return this.each(function () {
			var splitter = $(this).data('splitter');
			if (splitter) {
				splitter.close();
			}
		});
	};
	
	$(function () {
		domPrefix = getDomPrefix();
	})
})(jQuery);