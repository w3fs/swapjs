function logr(str) {
	var el = document.getElementById("logger");
	if (!el) {
		el = document.createElement("div");
		el.id = "logger";
		document.body.insertBefore(el, document.body.firstChild)
	}
	el.innerHTML = el.innerHTML + str;
}

function getElement(node) {
	while (node && node.nodeType != 1) {
		node = node.nextSibling;
	}
	return node;
}

function ID(id) {
	return document.getElementById(id);
}

function TAGS(id, tag) {
	var obj = ID(id) || document.getElementsByTagName('body')[0];
	return obj.getElementsByTagName(tag);
}

function applyCSS() {
}

var SWAP = {};
SWAP.parseDOM = function(obj) {
	var obj = obj || document.getElementsByTagName('body')[0];
	var str = "<ul><li>" + obj.tagName;
	var obj_arr = [];
	if (obj.hasChildNodes()) {
		var child = obj.firstChild;
		while (child) {
			if (child.nodeType === 1 && child.nodeName != 'SCRIPT') {
				str += this.parseDOM(child)
			}
			child = child.nextSibling;
		}
	}
	str += "</li></ul>";
	return str;
}
/*
 * How to call the animate function 
 * var animOptions = { 
	 * element : <html object>,
	 * property : <attribute>, 
	 * unit : <unit, for most of them it iwll be px, but for * opacities it wont have nething>, 
	 * from : <starting value>, 
	 * to : <final value>,
	 * duration : <duration of effects>, 
	 * callBack : <call back function> 
 * }
 * aniMate(animOptions);
 */
SWAP.aniMate = function(options) {
	var Ease = {
		easeInQuad : function(t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOutQuad : function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		easeInOutCirc : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},
		linearTween : function(t, b, c, d) {
			return c * t / d + b;
		},
		linear : function(p, n, firstNum, diff) {
			return firstNum + diff * p;
		},
		swing : function(p, n, firstNum, diff) {
			return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
		}
	};
	var ease = options.ease || 'linear';
	var el = options.element;
	if (typeof el == 'string')
		el = document.getElementById(options.element);
	if (!el)
		return false;
	if (el.style[options.property] === options.to + options.unit) {
		if (options.callBack)
			options.callBack();
		return;
	}
	el.style[options.property] = options.from + options.unit;
	function nudgeProperty(time) {
		change = options.to - options.from;
		if (time <= options.duration) {
			newVal = Ease.easeInOutCirc(time++, options.from, change,
					options.duration)
					+ options.unit;
			el.style[options.property] = newVal;
			setTimeout(function() {
				nudgeProperty(time);
			}, 100)
		} else {
			el.style[options.property] = options.to + options.unit;
			if (options.callBack)
				options.callBack();
		}
	}
	nudgeProperty(0);
};
SWAP.getCleanChildren = function(obj) {
	var children = [];
	if (obj.hasChildNodes()) {
		var child = obj.firstChild;
		while (child) {
			if (child.nodeType === 1) {
				children[children.length] = child;
			}
			child = child.nextSibling;
		}
	}
	return children;
};
SWAP.slider = function(param) {
	var gallery = ID(param.gal);
	var wrapper = ID(param.wrap);
	var navigation = ID(param.nav);
	var nav = TAGS(param.nav, 'a');
	var soloWidth = 0;
	var soloHeight = 0;
	var totalLen = 0;
	if (!wrapper) {
		throw new Error('slider: No wrapper specified.');
	}
	function init() {
		gallery.className = 'active';

		var slides = SWAP.getCleanChildren(wrapper);
		console.log(slides);
		var len = slides.length;
		while (len--) {
			slides[len].style['cssFloat'] = 'left';
			totalLen += slides[len].offsetWidth;
		}
		soloWidth = slides[0].offsetWidth;
		soloHeight = slides[0].offsetHeight;

		/* Navigation Style : START */
		navigation.style['width'] = soloWidth + 'px';
		navigation.className = 'active';
		/* Navigation Style : END */

		wrapper.style['width'] = totalLen + 'px';
		wrapper.className = 'active';
		setNav(nav);
	}
	function setNav(navObj) {
		navObj[0].onclick = slideP;
		navObj[1].onclick = slideN;
	}
	function slideP() {
		var chkP = true;
		if (wrapper.offsetLeft + soloWidth <= 0) {
			navigation.style['display'] = 'none';
			SWAP.aniMate({
				element : wrapper,
				property : 'marginLeft',
				unit : 'px',
				from : wrapper.offsetLeft,
				to : (wrapper.offsetLeft + soloWidth),
				duration : param.duration,
				callBack : function() {
					navigation.style['display'] = 'block';
				}
			});
		}
	}
	function slideN() {
		if ((wrapper.offsetLeft - soloWidth) > -totalLen) {
			navigation.style['display'] = 'none';
			SWAP.aniMate({
				element : wrapper,
				property : 'marginLeft',
				unit : 'px',
				from : wrapper.offsetLeft,
				to : (wrapper.offsetLeft - soloWidth),
				duration : param.duration,
				callBack : function() {
					navigation.style['display'] = 'block';
				}
			});
		}
	}
	init();
}
window.onload = function() {
	/*
	 * var coll = SWAP.parseDOM(); logr(coll);
	 */
};
