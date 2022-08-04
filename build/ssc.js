/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/animejs/lib/anime.es.js":
/*!**********************************************!*\
  !*** ./node_modules/animejs/lib/anime.es.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * anime.js v3.2.1
 * (c) 2020 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

// Defaults

var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};

var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};

var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];

// Caching

var cache = {
  CSS: {},
  springs: {}
};

// Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) { return Array.isArray(a); },
  obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },
  pth: function (a) { return is.obj(a) && a.hasOwnProperty('totalLength'); },
  svg: function (a) { return a instanceof SVGElement; },
  inp: function (a) { return a instanceof HTMLInputElement; },
  dom: function (a) { return a.nodeType || is.svg(a); },
  str: function (a) { return typeof a === 'string'; },
  fnc: function (a) { return typeof a === 'function'; },
  und: function (a) { return typeof a === 'undefined'; },
  nil: function (a) { return is.und(a) || a === null; },
  hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },
  rgb: function (a) { return /^rgb/.test(a); },
  hsl: function (a) { return /^hsl/.test(a); },
  col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)); },
  key: function (a) { return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes'; },
};

// Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];
}

// Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js

function spring(string, duration) {

  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity =  minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? (duration * t) / 1000 : t;
    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }
    if (t === 0 || t === 1) { return t; }
    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];
    if (cached) { return cached; }
    var frame = 1/6;
    var elapsed = 0;
    var rest = 0;
    while(true) {
      elapsed += frame;
      if (solver(elapsed) === 1) {
        rest++;
        if (rest >= 16) { break; }
      } else {
        rest = 0;
      }
    }
    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;

}

// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function

function steps(steps) {
  if ( steps === void 0 ) steps = 10;

  return function (t) { return Math.ceil((minMax(t, 0.000001, 1)) * steps) * (1 / steps); };
}

// BezierEasing https://github.com/gre/bezier-easing

var bezier = (function () {

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }
  function C(aA1)      { return 3.0 * aA1 }

  function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }
  function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) { aB = currentT; } else { aA = currentT; }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) { return aGuessT; }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {

    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) { return; }
    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {

      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;

      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }

    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) { return x; }
      if (x === 0 || x === 1) { return x; }
      return calcBezier(getTForX(x), mY1, mY2);
    }

  }

  return bezier;

})();

var penner = (function () {

  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

  var eases = { linear: function () { return function (t) { return t; }; } };

  var functionEasings = {
    Sine: function () { return function (t) { return 1 - Math.cos(t * Math.PI / 2); }; },
    Circ: function () { return function (t) { return 1 - Math.sqrt(1 - t * t); }; },
    Back: function () { return function (t) { return t * t * (3 * t - 2); }; },
    Bounce: function () { return function (t) {
      var pow2, b = 4;
      while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2)
    }; },
    Elastic: function (amplitude, period) {
      if ( amplitude === void 0 ) amplitude = 1;
      if ( period === void 0 ) period = .5;

      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return (t === 0 || t === 1) ? t : 
          -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
      }
    }
  };

  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () { return function (t) { return Math.pow(t, i + 2); }; };
  });

  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;
    eases['easeOut' + name] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };
    eases['easeInOut' + name] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 
      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };
    eases['easeOutIn' + name] = function (a, b) { return function (t) { return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : 
      (easeIn(a, b)(t * 2 - 1) + 1) / 2; }; };
  });

  return eases;

})();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) { return easing; }
  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);
  switch (name) {
    case 'spring' : return spring(easing, duration);
    case 'cubicBezier' : return applyArguments(bezier, args);
    case 'steps' : return applyArguments(steps, args);
    default : return applyArguments(ease, args);
  }
}

// Strings

function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch(e) {
    return;
  }
}

// Arrays

function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];
  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];
      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }
  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) { return a.concat(is.arr(b) ? flattenArray(b) : b); }, []);
}

function toArray(o) {
  if (is.arr(o)) { return o; }
  if (is.str(o)) { o = selectString(o) || o; }
  if (o instanceof NodeList || o instanceof HTMLCollection) { return [].slice.call(o); }
  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) { return a === val; });
}

// Objects

function cloneObject(o) {
  var clone = {};
  for (var p in o) { clone[p] = o[p]; }
  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o1) { o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]; }
  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o2) { o[p] = is.und(o1[p]) ? o2[p] : o1[p]; }
  return o;
}

// Colors

function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? ("rgba(" + (rgb[1]) + ",1)") : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) { return r + r + g + g + b + b; } );
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return ("rgba(" + r + "," + g + "," + b + ",1)");
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;
  function hue2rgb(p, q, t) {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }
    if (t < 1/6) { return p + (q - p) * 6 * t; }
    if (t < 1/2) { return q; }
    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
    return p;
  }
  var r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return ("rgba(" + (r * 255) + "," + (g * 255) + "," + (b * 255) + "," + a + ")");
}

function colorToRgb(val) {
  if (is.rgb(val)) { return rgbToRgba(val); }
  if (is.hex(val)) { return hexToRgba(val); }
  if (is.hsl(val)) { return hslToRgba(val); }
}

// Units

function getUnit(val) {
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
  if (split) { return split[1]; }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') { return 'px'; }
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) { return 'deg'; }
}

// Values

function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) { return val; }
  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);
  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) { return value; }
  var cached = cache.CSS[value + unit];
  if (!is.und(cached)) { return cached; }
  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = (el.parentNode && (el.parentNode !== document)) ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || (is.svg(el) && el[prop]))) { return 'attribute'; }
  if (is.dom(el) && arrayContains(validTransforms, prop)) { return 'transform'; }
  if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) { return 'css'; }
  if (el[prop] != null) { return 'object'; }
}

function getElementTransforms(el) {
  if (!is.dom(el)) { return; }
  var str = el.style.transform || '';
  var reg  = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;
  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }
  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform': return getTransformValue(target, propName, animatable, unit);
    case 'css': return getCSSValue(target, propName, unit);
    case 'attribute': return getAttribute(target, propName);
    default: return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);
  if (!operator) { return to; }
  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));
  switch (operator[0][0]) {
    case '+': return x + y + u;
    case '-': return x - y + u;
    case '*': return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) { return colorToRgb(val); }
  if (/\s/g.test(val)) { return val; }
  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  if (unit) { return unitLess + unit; }
  return unitLess;
}

// getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return (getAttribute(el, 'width') * 2) + (getAttribute(el, 'height') * 2);
}

function getLineLength(el) {
  return getDistance(
    {x: getAttribute(el, 'x1'), y: getAttribute(el, 'y1')}, 
    {x: getAttribute(el, 'x2'), y: getAttribute(el, 'y2')}
  );
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;
  for (var i = 0 ; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);
    if (i > 0) { totalLength += getDistance(previousPos, currentPos); }
    previousPos = currentPos;
  }
  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
}

// Path animation

function getTotalLength(el) {
  if (el.getTotalLength) { return el.getTotalLength(); }
  switch(el.tagName.toLowerCase()) {
    case 'circle': return getCircleLength(el);
    case 'rect': return getRectLength(el);
    case 'line': return getLineLength(el);
    case 'polyline': return getPolylineLength(el);
    case 'polygon': return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
}

// Motion path

function getParentSvgEl(el) {
  var parentEl = el.parentNode;
  while (is.svg(parentEl)) {
    if (!is.svg(parentEl.parentNode)) { break; }
    parentEl = parentEl.parentNode;
  }
  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width,
    h: height,
    vW: viewBox[2],
    vH: viewBox[3]
  }
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function(property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    }
  }
}

function getPathProgress(path, progress, isPathTargetInsideSVG) {
  function point(offset) {
    if ( offset === void 0 ) offset = 0;

    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }
  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);
  var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
  var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;
  switch (path.property) {
    case 'x': return (p.x - svg.x) * scaleX;
    case 'y': return (p.y - svg.y) * scaleY;
    case 'angle': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
}

// Decompose value

function decomposeValue(val, unit) {
  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var value = validateValue((is.pth(val) ? val.totalLength : val), unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: (is.str(val) || unit) ? value.split(rgx) : []
  }
}

// Animatables

function parseTargets(targets) {
  var targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
  return filterArray(targetsArray, function (item, pos, self) { return self.indexOf(item) === pos; });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {target: t, id: i, total: parsed.length, transforms: { list: getElementTransforms(t) } };
  });
}

// Properties

function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings);
  // Override duration if easing is a spring
  if (/^spring/.test(settings.easing)) { settings.duration = spring(settings.easing); }
  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = (l === 2 && !is.obj(prop[0]));
    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) { settings.duration = tweenSettings.duration / l; }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {value: prop};
    }
  }
  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = (is.obj(v) && !is.pth(v)) ? v : {value: v};
    // Default delay value should only be applied to the first tween
    if (is.und(obj.delay)) { obj.delay = !i ? tweenSettings.delay : 0; }
    // Default endDelay value should only be applied to the last tween
    if (is.und(obj.endDelay)) { obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0; }
    return obj;
  }).map(function (k) { return mergeObjects(k, settings); });
}


function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) { return Object.keys(key); })), function (p) { return is.key(p); })
  .reduce(function (a,b) { if (a.indexOf(b) < 0) { a.push(b); } return a; }, []);
  var properties = {};
  var loop = function ( i ) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};
      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) { newKey.value = key[p]; }
        } else {
          newKey[p] = key[p];
        }
      }
      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop( i );
  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;
  if (keyframes) { params = mergeObjects(flattenKeyframes(keyframes), params); }
  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }
  return properties;
}

// Tweens

function normalizeTweenValues(tween, animatable) {
  var t = {};
  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);
    if (is.arr(value)) {
      value = value.map(function (v) { return getFunctionValue(v, animatable); });
      if (value.length === 1) { value = value[0]; }
    }
    t[p] = value;
  }
  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;
    if (is.und(to)) { to = previousValue; }
    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);
    if (tween.isColor) { tween.round = 1; }
    previousTween = tween;
    return tween;
  });
}

// Tween progress

var setProgressValue = {
  css: function (t, p, v) { return t.style[p] = v; },
  attribute: function (t, p, v) { return t.setAttribute(p, v); },
  object: function (t, p, v) { return t[p] = v; },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);
    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) { str += prop + "(" + value + ") "; });
      t.style.transform = str;
    }
  }
};

// Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
}

// Animations

function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);
  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    }
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) { return !is.und(a); });
}

// Create Instance

function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;
  var getTlOffset = function (anim) { return anim.timelineOffset ? anim.timelineOffset : 0; };
  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration; })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.delay; })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration - anim.endDelay; })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
}

// Core

var activeInstances = [];

var engine = (function () {
  var raf;

  function play() {
    if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
      raf = requestAnimationFrame(step);
    }
  }
  function step(t) {
    // memo on algorithm issue:
    // dangerous iteration over mutable `activeInstances`
    // (that collection may be updated from within callbacks of `tick`-ed animation instances)
    var activeInstancesLength = activeInstances.length;
    var i = 0;
    while (i < activeInstancesLength) {
      var activeInstance = activeInstances[i];
      if (!activeInstance.paused) {
        activeInstance.tick(t);
        i++;
      } else {
        activeInstances.splice(i, 1);
        activeInstancesLength--;
      }
    }
    raf = i > 0 ? requestAnimationFrame(step) : undefined;
  }

  function handleVisibilityChange() {
    if (!anime.suspendWhenDocumentHidden) { return; }

    if (isDocumentHidden()) {
      // suspend ticks
      raf = cancelAnimationFrame(raf);
    } else { // is back to active tab
      // first adjust animations to consider the time that ticks were suspended
      activeInstances.forEach(
        function (instance) { return instance ._onDocumentVisibility(); }
      );
      engine();
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return play;
})();

function isDocumentHidden() {
  return !!document && document.hidden;
}

// Public Instance

function anime(params) {
  if ( params === void 0 ) params = {};


  var startTime = 0, lastTime = 0, now = 0;
  var children, childrenLength = 0;
  var resolve = null;

  function makePromise(instance) {
    var promise = window.Promise && new Promise(function (_resolve) { return resolve = _resolve; });
    instance.finished = promise;
    return promise;
  }

  var instance = createNewInstance(params);
  var promise = makePromise(instance);

  function toggleInstanceDirection() {
    var direction = instance.direction;
    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }
    instance.reversed = !instance.reversed;
    children.forEach(function (child) { return child.reversed = instance.reversed; });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekChild(time, child) {
    if (child) { child.seek(time - child.timelineOffset); }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) { seekChild(time, children[i]); }
    } else {
      for (var i$1 = childrenLength; i$1--;) { seekChild(time, children[i$1]); }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;
    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength];
      // Only check for keyframes if there is more than one tween
      if (tweenLength) { tween = filterArray(tweens, function (t) { return (insTime < t.end); })[0] || tween; }
      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = (void 0);
      for (var n = 0; n < toNumbersLength; n++) {
        var value = (void 0);
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;
        if (!tween.isPath) {
          value = fromNumber + (eased * (toNumber - fromNumber));
        } else {
          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
        }
        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }
        numbers.push(value);
      }
      // Manual Array.reduce for better performances
      var stringsLength = strings.length;
      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];
        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];
          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }
      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) { instance[cb](instance); }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax((insTime / insDuration) * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;
    if (children) { syncInstanceChildren(insTime); }
    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
    }
    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback('loopBegin');
    }
    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }
    if ((insTime >= insEndDelay && instance.currentTime !== insDuration) || !insDuration) {
      setAnimationsProgress(insDuration);
    }
    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }
      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }
    instance.currentTime = minMax(insTime, 0, insDuration);
    if (instance.began) { setCallback('update'); }
    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();
      if (!instance.remaining) {
        instance.paused = true;
        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');
          if (!instance.passThrough && 'Promise' in window) {
            resolve();
            promise = makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback('loopComplete');
        instance.loopBegan = false;
        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function() {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;
    for (var i = childrenLength; i--;) { instance.children[i].reset(); }
    if (instance.reversed && instance.loop !== true || (direction === 'alternate' && instance.loop === 1)) { instance.remaining++; }
    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  };

  // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)
  instance._onDocumentVisibility = resetTime;

  // Set Value helper

  instance.set = function(targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function(t) {
    now = t;
    if (!startTime) { startTime = now; }
    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function(time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function() {
    instance.paused = true;
    resetTime();
  };

  instance.play = function() {
    if (!instance.paused) { return; }
    if (instance.completed) { instance.reset(); }
    instance.paused = false;
    activeInstances.push(instance);
    resetTime();
    engine();
  };

  instance.reverse = function() {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  };

  instance.restart = function() {
    instance.reset();
    instance.play();
  };

  instance.remove = function(targets) {
    var targetsArray = parseTargets(targets);
    removeTargetsFromInstance(targetsArray, instance);
  };

  instance.reset();

  if (instance.autoplay) { instance.play(); }

  return instance;

}

// Remove targets from animation

function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargetsFromInstance(targetsArray, instance) {
  var animations = instance.animations;
  var children = instance.children;
  removeTargetsFromAnimations(targetsArray, animations);
  for (var c = children.length; c--;) {
    var child = children[c];
    var childAnimations = child.animations;
    removeTargetsFromAnimations(targetsArray, childAnimations);
    if (!childAnimations.length && !child.children.length) { children.splice(c, 1); }
  }
  if (!animations.length && !children.length) { instance.pause(); }
}

function removeTargetsFromActiveInstances(targets) {
  var targetsArray = parseTargets(targets);
  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    removeTargetsFromInstance(targetsArray, instance);
  }
}

// Stagger helpers

function stagger(val, params) {
  if ( params === void 0 ) params = {};

  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) { fromIndex = 0; }
    if (fromCenter) { fromIndex = (t - 1) / 2; }
    if (fromLast) { fromIndex = t - 1; }
    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex%grid[0] : (grid[0]-1)/2;
          var fromY = !fromCenter ? Math.floor(fromIndex/grid[0]) : (grid[1]-1)/2;
          var toX = index%grid[0];
          var toY = Math.floor(index/grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (axis === 'x') { value = -distanceX; }
          if (axis === 'y') { value = -distanceY; }
          values.push(value);
        }
        maxValue = Math.max.apply(Math, values);
      }
      if (easing) { values = values.map(function (val) { return easing(val / maxValue) * maxValue; }); }
      if (direction === 'reverse') { values = values.map(function (val) { return axis ? (val < 0) ? val * -1 : -val : Math.abs(maxValue - val); }); }
    }
    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + (spacing * (Math.round(values[i] * 100) / 100)) + unit;
  }
}

// Timeline

function timeline(params) {
  if ( params === void 0 ) params = {};

  var tl = anime(params);
  tl.duration = 0;
  tl.add = function(instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;
    if (tlIndex > -1) { activeInstances.splice(tlIndex, 1); }
    function passThrough(ins) { ins.passThrough = true; }
    for (var i = 0; i < children.length; i++) { passThrough(children[i]); }
    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();
    if (tl.autoplay) { tl.play(); }
    return tl;
  };
  return tl;
}

anime.version = '3.2.1';
anime.speed = 1;
// TODO:#review: naming, documentation
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.random = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (anime);


/***/ }),

/***/ "./src/frontend/_ssc.js":
/*!******************************!*\
  !*** ./src/frontend/_ssc.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var scrollmagic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrollmagic */ "./node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js");
/* harmony import */ var scrollmagic__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scrollmagic__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var scrollmagic_plugins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! scrollmagic-plugins */ "./node_modules/scrollmagic-plugins/index.js");
/* harmony import */ var _ssc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ssc */ "./src/ssc.js");
/* harmony import */ var _utils_fn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/fn */ "./src/utils/fn.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _modules_image360__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/image360 */ "./src/frontend/modules/image360.js");
/* harmony import */ var _modules_screenJumper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/screenJumper */ "./src/frontend/modules/screenJumper.js");
/* harmony import */ var _modules_imageScale__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/imageScale */ "./src/frontend/modules/imageScale.js");
/* harmony import */ var _modules_videoWheel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/videoWheel */ "./src/frontend/modules/videoWheel.js");
/* harmony import */ var _modules_videoFocus__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modules/videoFocus */ "./src/frontend/modules/videoFocus.js");
/* harmony import */ var _modules_scrollJacking__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./modules/scrollJacking */ "./src/frontend/modules/scrollJacking.js");
/* harmony import */ var _modules_textStagger__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modules/textStagger */ "./src/frontend/modules/textStagger.js");
/* harmony import */ var _modules_textEffects__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./modules/textEffects */ "./src/frontend/modules/textEffects.js");
/* harmony import */ var _modules_svgPath__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./modules/svgPath */ "./src/frontend/modules/svgPath.js");
/* harmony import */ var _modules_itemAnimate__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./modules/itemAnimate */ "./src/frontend/modules/itemAnimate.js");
/* harmony import */ var _modules_itemParallax__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./modules/itemParallax */ "./src/frontend/modules/itemParallax.js");
/* harmony import */ var _modules_itemCustomAnimation__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./modules/itemCustomAnimation */ "./src/frontend/modules/itemCustomAnimation.js");
/* harmony import */ var _modules_videoParallax__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./modules/videoParallax */ "./src/frontend/modules/videoParallax.js");
/* harmony import */ var _modules_timeline__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./modules/timeline */ "./src/frontend/modules/timeline.js");


/*!
 * SSC 0.0.1
 * The javascript frontend script of ssc
 * 2022
 * Project Website: http://codekraft.it
 *
 * @version 0.0.1
 * @license GPLv3.
 * @author Erik
 *
 * @file The scc animation frontend scripts.
 */

 // UTILITY



 // MODULES














 // TODO: enable only for admins

(0,scrollmagic_plugins__WEBPACK_IMPORTED_MODULE_2__.ScrollMagicPluginIndicator)((scrollmagic__WEBPACK_IMPORTED_MODULE_1___default())); // on load and on hashchange (usually on history back/forward)

const jumpToHash = () => {
  if (typeof window.location.hash !== 'undefined') {
    // GOTO
    console.log(window.location.hash);
  }
};

window.addEventListener('load', jumpToHash);
window.addEventListener('hashchange', jumpToHash);
/**
 * @class _ssc
 *
 */

class _ssc {
  /**
   * @function Object() { [native code] } - screen control
   * @param {{page: Element}} options
   */
  constructor(options) {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "unmount", el => {
      el.unWatch();
    });

    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "addMetaToCollected", (el, index) => {
      // add a class to acknowledge about initialization
      el.dataset.sscItem = index;

      el.unWatch = () => this.observer.unobserve(el);

      el.sscItemData = el.dataset;
      el.sscItemOpts = el.dataset.sscProps ? (0,_utils_fn__WEBPACK_IMPORTED_MODULE_4__.getElelementData)(el.dataset.sscProps, 'data') : null;
      el.sscSequence = el.dataset && el.dataset.sscSequence ? (0,_utils_fn__WEBPACK_IMPORTED_MODULE_4__.getElelementData)(el.dataset.sscSequence, 'style') : null;
      el.sscScene = el.dataset && el.dataset.sscSequence && el.dataset.sscSequence.scene ? el.dataset.sscSequence.scene : null; // scroll animated video needs custom settings

      if (['sscVideoParallax', 'sscVideoScroll', 'ssc360'].includes(el.sscItemData.sscAnimation)) {
        const videoEl = el.querySelector('video');

        if (videoEl) {
          videoEl.autoplay = false;
          videoEl.controls = false;
          videoEl.loop = false;
          videoEl.muted = true;
          videoEl.playsinline = true;
          videoEl.preload = 'auto';
          videoEl.pause();
        }

        el.classList.add('ssc-video');
      }

      switch (el.sscItemData.sscAnimation) {
        case 'sscScrollJacking':
          el.style.minHeight = 'calc(100vh + 30px)';
          el.style.padding = 0;
          el.style.margin = 0;
          break;

        case 'sscParallax':
          this.itemParallaxed[el.sscItemData.sscItem] = el;
          break;

        case 'sscScrollTimeline':
          el.querySelectorAll('.ssc').forEach(timelineChild => {
            timelineChild.classList.add('ssc-timeline-child');
            timelineChild.dataset.timelineDuration = el.sscItemOpts.duration;
          });
          break;

        case 'sscTimelineChild':
          // init ScrollMagic scene
          el.classList.add('ssc-timeline-scene');
          break;
      }
    });

    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "init", () => {
      if ('IntersectionObserver' in window) {
        /** this is mandatory because animation could exit from left or right*/
        document.body.style.overflowX = 'hidden';
        this.collected = this.page.querySelectorAll('.ssc');
        this.updateScreenSize();
        console.log('SSC ready');
        this.observer = new window.IntersectionObserver(this.screenControl, {
          root: null,
          rootMargin: _ssc__WEBPACK_IMPORTED_MODULE_3__.sscOptions.rootMargin,
          threshold: _ssc__WEBPACK_IMPORTED_MODULE_3__.sscOptions.threshold
        }); // Let's start the intersection observer

        this.collected.forEach(function (el, index) {
          this.addMetaToCollected(el, index);

          if (el.sscItemData.sscAnimation === 'sscScrollTimeline') {
            // init ScrollMagic
            this.timelines[el.sscItemData.sscItem] = el;
          } else {
            // watch the elements to detect the screen margins intersection
            this.observer.observe(el);
          }
        }, this); // start parallax

        this.parallax(); // start timelines

        this.timelines.forEach(el => this.scrollTimeline(el));
        this.jumpToScreen(document.querySelectorAll('.ssc-screen-jumper')); // watch for new objects added to the DOM

        this.interceptor(this.page);
        /**
         * inject the animate.css stylesheet if needed
         * maybe it may seem like an unconventional method but
         * this way this (quite heavy) file is loaded only there is a need
         */

        const hasAnimate = Object.values(this.collected).filter(observed => observed.sscItemData.sscAnimation === 'sscAnimation');

        if (hasAnimate) {
          const animateCSS = document.createElement('link');
          animateCSS.rel = 'stylesheet';
          animateCSS.id = 'ssc_animate-css';
          animateCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
          document.head.appendChild(animateCSS);
        } // update the screen size if necessary


        window.addEventListener('resize', this.updateScreenSize);
      } else {
        console.warn('IntersectionObserver could not enabled');
      }
    });

    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "sscAnimation", entry => {
      // this item is entering the view
      if (entry.target.action) {
        switch (entry.target.sscItemData.sscAnimation) {
          case 'sscParallax':
            this.parallaxController(entry); // yup

            break;

          case 'sscAnimation':
            this.handleAnimation(entry);
            break;

          case 'sscSequence':
            this.animationSequence(entry, entry.target.action);
            break;

          case 'sscSvgPath':
            this.animationSvgPath(entry, entry.target.action); // yup (missing some options)

            break;

          case 'sscScrollJacking':
            this.scrollJacking(entry);
            break;

          case 'sscCounter':
            this.textAnimated(entry);
            break;

          case 'sscVideoFocusPlay':
            this.videoFocusPlay(entry); // yup, but needs to be inline and muted

            break;

          case 'sscVideoParallax':
            this.videoParallaxController(entry);
            break;

          case 'sscVideoScroll':
            this.videoWheelController(entry);
            break;

          case 'ssc360':
            this.video360Controller(entry);
            break;

          case 'sscImageZoom':
            this.imageScaleController(entry); // NO

            break;

          case 'sscTextStagger':
            this.textStagger(entry);
            break;

          default:
            // 😓
            break;
        }
      }
    });

    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "screenControl", entries => {
      // update the last scroll position
      this.windowData.lastScrollPosition = window.scrollY; // store the scroll direction into body

      this.scrollDirection();
      entries.forEach(entry => {
        if (entry.target.dataset.lock) {
          return true;
        } // stores the direction from which the element appeared


        entry.target.dataset.intersection = this.windowData.viewHeight / 2 > entry.boundingClientRect.top ? 'up' : 'down'; // check if the current "is Intersecting" has been changed, eg if was visible and now it isn't the element has left the screen

        if (entry.isIntersecting !== entry.target.dataset.visible) {
          if (typeof entry.target.dataset.visible === 'undefined') {
            entry.target.action = 'enter';
          } else {
            entry.target.action = entry.isIntersecting ? 'enter' : 'leave';
          }
        } else {
          entry.target.action = '';
        } // is colliding with borders // used next loop to detect if the object is inside the screen


        entry.target.dataset.visible = entry.isIntersecting ? 'true' : 'false';
        this.sscAnimation(entry);
      });
    });

    this.page = options.page || document.body;
    this.scrollDirection = _utils_utils__WEBPACK_IMPORTED_MODULE_5__.scrollDirection.bind(this);
    this.updateScreenSize = this.updateScreenSize.bind(this);
    /**
     * This object holds the window data to avoid unnecessary calculations
     * and has 2 properties: viewHeight and lastScrollPosition.
     *
     * @typedef {Object} windowData
     * @property {number} viewHeight         - window.innerHeight alias
     * @property {number} lastScrollPosition - window.scrollY alias
     */

    this.windowData = {
      viewHeight: window.innerHeight,
      lastScrollPosition: window.scrollY
    };
    /**
     * Store the touch position
     *
     * @typedef {Object} touchPos
     * @property {number} x - the touch start x position
     * @property {number} y - the touch start y position
     */

    this.touchPos = {
      x: false,
      y: false
    };
    this.page.ontouchstart = _utils_utils__WEBPACK_IMPORTED_MODULE_5__.touchstartEvent.bind(this);
    this.page.ontouchmove = _utils_utils__WEBPACK_IMPORTED_MODULE_5__.ontouchmoveEvent.bind(this); // the ssc enabled elements found in this page it's not an array but a nodelist (anyhow we can iterate with foreach so at the moment is fine)

    this.collected = []; // will hold the intersection observer

    this.initMutationObserver = this.initMutationObserver.bind(this);
    this.observer = []; // MODULES

    this.video360Controller = _modules_image360__WEBPACK_IMPORTED_MODULE_6__["default"];
    this.jumpToScreen = _modules_screenJumper__WEBPACK_IMPORTED_MODULE_7__["default"];
    this.imageScaleController = _modules_imageScale__WEBPACK_IMPORTED_MODULE_8__["default"];
    this.videoWheelController = _modules_videoWheel__WEBPACK_IMPORTED_MODULE_9__["default"];
    this.videoFocusPlay = _modules_videoFocus__WEBPACK_IMPORTED_MODULE_10__["default"];
    this.textStagger = _modules_textStagger__WEBPACK_IMPORTED_MODULE_12__["default"];
    this.textAnimated = _modules_textEffects__WEBPACK_IMPORTED_MODULE_13__["default"];
    this.animationSvgPath = _modules_svgPath__WEBPACK_IMPORTED_MODULE_14__["default"];
    this.animationSequence = _modules_itemCustomAnimation__WEBPACK_IMPORTED_MODULE_17__["default"];
    this.scrollTimeline = _modules_timeline__WEBPACK_IMPORTED_MODULE_19__["default"]; // The standard animation (animate.css)

    this.animations = [];
    this.handleAnimation = _modules_itemAnimate__WEBPACK_IMPORTED_MODULE_15__["default"].bind(this); // scrolljacking - evil as eval :)

    this.scrollJacking = _modules_scrollJacking__WEBPACK_IMPORTED_MODULE_11__["default"].bind(this); // video playback controlled by scroll Y position

    this.videoParallaxController = _modules_videoParallax__WEBPACK_IMPORTED_MODULE_18__["default"].bind(this);
    this.itemParallaxed = _modules_itemParallax__WEBPACK_IMPORTED_MODULE_16__.itemParallaxed;
    this.parallax = _modules_itemParallax__WEBPACK_IMPORTED_MODULE_16__.parallax.bind(this);
    this.parallaxController = _modules_itemParallax__WEBPACK_IMPORTED_MODULE_16__.parallaxController.bind(this);
    this.init();
  }
  /**
   * It waits 250 milliseconds for resize to be completely done,
   * then updates the windowData object with the current window height and scroll position
   */


  updateScreenSize() {
    (async () => await (() => console.warn('Old Screensize', this.windowData)))().then(() => {
      return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_5__.delay)(250);
    }).then(() => {
      this.windowData.viewHeight = window.innerHeight;
      this.windowData.lastScrollPosition = window.scrollY;
      console.warn('New Screensize', this.windowData);
      return this.windowData;
    });
  } // Detach an element from screen control


  initMutationObserver(mutationsList, mutationObserver) {
    //for every mutation
    mutationsList.forEach(function (mutation) {
      //for every added element
      mutation.addedNodes.forEach(function (node) {
        // Check if we appended a node type that isn't
        // an element that we can search for images inside,
        // like a text node.
        if (typeof node.getElementsByTagName !== 'function') {
          return;
        }

        const objCollection = node.querySelectorAll('.ssc');

        if (objCollection.length) {
          objCollection.forEach(function (el) {
            this.addMetaToCollected(el, this.collected.length); // watch the elements to detect the screen margins intersection

            return this.observer.observe(el);
          });
        }
      });
    });
  }
  /**
   * Create an observer instance linked to the callback function,
   * then start observing the target node for configured mutations.
   *
   * The first line of the function creates an instance of the MutationObserver class, which is a built-in JavaScript class.
   * The second line of the function starts observing the target node for configured mutations
   *
   * @param {HTMLElement} content - The element to watch for changes.
   */


  interceptor(content) {
    // Create an observer instance linked to the callback function
    this.mutationObserver = new window.MutationObserver(this.initMutationObserver); // Start observing the target node for configured mutations

    this.mutationObserver.observe(content, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_ssc);

/***/ }),

/***/ "./src/frontend/modules/image360.js":
/*!******************************************!*\
  !*** ./src/frontend/modules/image360.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * It adds a mousemove event listener to the video element,
 * which updates the video's current time based on the mouse's position creating the image 360 effect
 *
 * @param {IntersectionObserverEntry} entry - The entry object passed to the callback function.
 */
const video360Controller = entry => {
  /** @constant {HTMLVideoElement} videoEl  */
  const videoEl = entry.target.querySelector('video');
  videoEl.timeoutAutoplay = null;
  videoEl.style.cursor = 'ew-resize';
  videoEl.spinRatio = parseFloat(entry.target.sscItemOpts.spinRatio);
  videoEl.control = entry.target.sscItemOpts.control;
  videoEl.loop = true;
  videoEl.isPlaying = false;
  videoEl.currentAngle = 0.5; // the current angle displayed

  videoEl.startAngle = 0.5; // the event initial angle

  videoEl.currentTime = videoEl.duration * 0.5; // Set the center of view

  /**
   * A function that takes the current angle (0-1) and returns the related video time
   * 1 multiplied by the duration of the video is equal the total length of the video
   * in addition we use the spin ratio to provide a control over the "rotation" speed
   *
   * @param {number} currentValue - a number from 0 to 1 that is the representing the progress of the video
   */

  videoEl.angleToVideoTime = currentValue => {
    return currentValue * videoEl.duration * videoEl.spinRatio;
  };

  videoEl.currentVideoTimeToAngle = () => {
    return videoEl.currentTime / videoEl.duration;
  };

  videoEl.autoplayVideo = function () {
    return setTimeout(() => {
      return videoEl.play();
    }, 2000);
  };

  videoEl.getAngle = (video, pointerX) => {
    const rect = video.getBoundingClientRect();
    return parseFloat((pointerX - rect.left) / rect.width);
  };

  videoEl.setAngle = currentAngle => {
    if (videoEl.readyState > 1) {
      // apply the calculated time to this video
      videoEl.nextTime = videoEl.angleToVideoTime(videoEl.currentAngle + (currentAngle - videoEl.startAngle)); // if the current time is after the total time returns to the beginning to create the loop effect

      videoEl.currentTime = // eslint-disable-next-line no-nested-ternary
      videoEl.nextTime > videoEl.duration ? videoEl.nextTime - videoEl.duration : videoEl.nextTime < 0 ? videoEl.nextTime + videoEl.duration : videoEl.nextTime;
      clearTimeout(videoEl.timeoutAutoplay);
    }
  };

  videoEl.handle360byPointerPosition = e => {
    window.requestAnimationFrame(() => {
      const currentAngle = e.target.getAngle(e.target, e.clientX);
      return e.target.setAngle(currentAngle);
    });
  };

  videoEl.handle360byDrag = e => {
    const video = e.target;
    video.style.cursor = 'grab'; // store the event initial position

    videoEl.currentAngle = videoEl.currentVideoTimeToAngle();
    videoEl.startAngle = video.getAngle(e.target, e.clientX); // on mouse move update the current angle

    video.onmousemove = ev => {
      window.requestAnimationFrame(() => {
        const currentAngle = video.getAngle(ev.target, ev.clientX);
        return video.setAngle(currentAngle);
      });
    };
  };

  if (entry.target.action === 'enter') {
    if (entry.target.sscItemOpts.control === 'pointer') {
      videoEl.onmousemove = videoEl.handle360byPointerPosition;
    } else {
      videoEl.onmousedown = videoEl.handle360byDrag;

      videoEl.onmouseup = () => {
        videoEl.onmousemove = null;
        videoEl.style.cursor = 'ew-resize';
      };
    }

    videoEl.onmouseout = e => {
      e.target.pause();
      clearTimeout(e.target.timeoutAutoplay);
      videoEl.timeoutAutoplay = e.target.autoplayVideo();
    };

    videoEl.onmouseenter = e => {
      videoEl.pause(); // store the event initial position

      videoEl.currentAngle = videoEl.currentVideoTimeToAngle();
      videoEl.startAngle = e.target.getAngle(e.target, e.clientX);
    };
  } else if (entry.target.action === 'leave') {
    videoEl.onmousemove = null;
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (video360Controller);

/***/ }),

/***/ "./src/frontend/modules/imageScale.js":
/*!********************************************!*\
  !*** ./src/frontend/modules/imageScale.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_compat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/compat */ "./src/utils/compat.js");

/**
 * It takes a mouse wheel event value,
 * and applies a scale transform to the target image
 *
 * @param {Event} event - The event object.
 */

const imageScale = event => {
  event.preventDefault();
  window.requestAnimationFrame(() => {
    let scale = parseFloat(event.target.dataset.sscZoom) || 1;
    scale += event.deltaY * -0.001; // Restrict scale
    // TODO: options

    scale = Math.min(Math.max(1, scale), 4);
    event.target.dataset.sscZoom = scale; // Apply scale transform

    event.target.style.transform = `scale(${scale})`;
  });
};
/**
 * This controller launches the imagescale "animation" type and is triggered when the mouse is over the image
 *
 * If the mouse enters the image, add the mouse wheel event listener to the image.
 * If the mouse leaves the image, remove the mouse wheel event listener from the image
 *
 * The function is called by the IntersectionObserver.
 *
 * @param {IntersectionObserverEntry} entry - The IntersectionObserverEntry object that is passed to the callback function.
 */


function imageScaleController(entry) {
  const imageEl = entry.target.querySelector('img');

  if (entry.target.action === 'enter') {
    imageEl.addEventListener(_utils_compat__WEBPACK_IMPORTED_MODULE_0__.mouseWheel, imageScale);
  } else if (entry.target.action === 'leave') {
    imageEl.removeEventListener(_utils_compat__WEBPACK_IMPORTED_MODULE_0__.mouseWheel, imageScale);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (imageScaleController);

/***/ }),

/***/ "./src/frontend/modules/itemAnimate.js":
/*!*********************************************!*\
  !*** ./src/frontend/modules/itemAnimate.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");

/**
 * Animate Element using Anime.css when the element is in the viewport
 *
 * @param {IntersectionObserverEntry} entry
 */

function handleAnimation(entry) {
  // if the animation isn't yet stored in "animations" object
  if (!this.animations[entry.target.sscItemData.sscItem]) {
    if (!entry.target.isChildren) {
      const elRect = entry.target.getBoundingClientRect();
      /**
       * @property {Object} animations - the animations collection
       */

      this.animations[entry.target.sscItemData.sscItem] = {
        target: entry.target,
        animatedElements: [],
        animationEnter: entry.target.sscItemOpts.animationEnter,
        animationLeave: entry.target.sscItemOpts.animationLeave,
        stagger: entry.target.sscItemOpts.stagger,
        position: {
          yTop: false,
          yBottom: false
        },
        delay: parseInt(entry.target.sscItemOpts.delay, 10) || 0,
        duration: parseInt(entry.target.sscItemOpts.duration, 10) || 1000,
        easing: entry.target.sscItemOpts.easing || 'EaseInOut',
        locked: false,
        intersection: parseInt(entry.target.sscItemOpts.intersection, 10) || 25,
        lastAction: false,

        /**
         * The element methods
         */
        updatePosition() {
          return {
            yTop: parseInt(window.scrollY + elRect.top),
            yBottom: parseInt(window.scrollY + elRect.top + elRect.height)
          };
        },

        initElement() {
          // stores the current element position (top Y and bottom Y)
          this.position = this.updatePosition(); // we need to set the opposite of the next action
          // eg. enter to trigger the leave animation

          this.lastAction = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isInView)(this.position, this.intersection) ? 'enter' : 'leave'; // set the custom props used by animate.css

          if (this.duration) entry.target.style.setProperty('--animate-duration', this.duration + 'ms');
          if (this.easing) entry.target.style.setProperty('transition-timing-function', this.easing); // check if the item is a single animation

          if (this.stagger !== 'none') {
            // collect item childs
            this.animatedElements = entry.target.querySelectorAll('.ssc'); // if scc animated items aren't found use item childs

            if (this.animatedElements.length === 0) {
              this.animatedElements = entry.target.querySelectorAll('*');
            } // init each childrens


            this.animatedElements.forEach(child => {
              child.classList.add('ssc-animation-child');
              child.isChildren = true;
            });
          } else {
            this.animatedElements = entry.target;
          }

          this.animateItem(this.lastAction);
        },

        addCssClass() {
          let item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.target;
          let cssClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'false';

          if (cssClass !== 'false') {
            const animation = item.animationEnter ? item.animationEnter : cssClass;
            item.classList.add('animate__animated', 'animate__' + animation);
          }

          return this;
        },

        removeCssClass() {
          let item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.target;
          let cssClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'false';

          if (cssClass !== 'false') {
            const animation = item.animationLeave ? item.animationLeave : cssClass;
            item.classList.remove('animate__animated', 'animate__' + animation);
          }

          return this;
        },

        applyAnimation(element, action) {
          return action === 'enter' ? this.removeCssClass(element, this.animationLeave).addCssClass(element, this.animationEnter) : this.removeCssClass(element, this.animationEnter).addCssClass(element, this.animationLeave);
        },

        applyChildAnimation(element, action) {
          return action === 'enter' ? this.removeCssClass(element, element.sscItemOpts.animationLeave).addCssClass(element, element.sscItemOpts.animationEnter) : this.removeCssClass(element, element.sscItemOpts.animationEnter).addCssClass(element, element.sscItemOpts.animationLeave);
        },

        animateItem(action) {
          // if the animated element is single
          if (this.animatedElements && this.animatedElements.nodeType) {
            // check if the action needed is "enter" and if the element is in viewport
            return this.applyAnimation(this.animatedElements, action);
          } // otherwise for each item of the collection fire the animation


          Object.values(this.animatedElements).forEach((child, index) => {
            const animationDelay = child.sscItemOpts ? parseInt(child.sscItemOpts.delay, 10) : this.duration * index * 0.1;
            setTimeout(() => child.sscItemOpts ? this.applyChildAnimation(child, action) : this.applyAnimation(child, action), animationDelay);
          });
        }

      };
      this.animations[entry.target.sscItemData.sscItem].initElement();
    } else {
      // the animation childrens hold a smaller set of properties
      this.animations[entry.target.sscItemData.sscItem] = {
        target: entry.target,
        animatedElements: entry.target,
        lastAction: null,
        animationEnter: entry.target.sscItemOpts.animationEnter || null,
        animationLeave: entry.target.sscItemOpts.animationLeave || null,
        delay: parseInt(entry.target.sscItemOpts.delay, 10) || 0,
        duration: parseInt(entry.target.sscItemOpts.duration, 10) || 1000
      };
      if (entry.target.sscItemOpts && entry.target.sscItemOpts.duration) entry.target.style.setProperty('--animate-duration', (parseInt(entry.target.sscItemOpts.duration, 10) || 5000) + 'ms');
    }
  } // childrens aren't animated independently
  // since the parent container fires the action


  if (entry.target.isChildren) return; // get all the animation data stored

  const el = this.animations[entry.target.sscItemData.sscItem];

  if (!el.locked && (el.lastAction === 'enter' ? (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isInView)(el.position, el.intersection) : !(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isInView)(el.position, el.intersection))) {
    // lock the item to avoid multiple animations at the same time
    el.locked = true;
    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.delay)(el.delay).then(() => {
      el.animateItem(el.lastAction); // wait the animation has been completed before unlock the element

      new Promise(resolve => {
        setTimeout(function () {
          el.locked = false;
          el.lastAction = el.lastAction === 'enter' ? 'leave' : 'enter';
          resolve();
        }, el.duration);
      });
    }).then(() => {
      if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isPartiallyVisible)(el.target)) {
        el.animateItem('leave');
      }
    });
  }

  if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isInView)(el.position, 0)) {
    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.delay)(100).then(() => {
      this.handleAnimation(entry);
    });
  } else {
    this.animations[entry.target.sscItemData.sscItem].locked = false;
    this.animations[entry.target.sscItemData.sscItem].animateItem('leave');
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handleAnimation);

/***/ }),

/***/ "./src/frontend/modules/itemCustomAnimation.js":
/*!*****************************************************!*\
  !*** ./src/frontend/modules/itemCustomAnimation.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var animejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animejs */ "./node_modules/animejs/lib/anime.es.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");


/**
 * It creates an animation sequence for each element that has a `sscSequence` attribute,
 * and then it plays or pauses the animation based on the element's visibility
 *
 * @param {IntersectionObserverEntry} entry  - The entry object passed by the IntersectionObserver.
 * @param {string}                    action - The action to be performed.
 */

function animationSequence(entry, action) {
  const animation = entry.target.sscSequence || {}; // build the animation if isn't already stored

  if (!this.animations[entry.target.sscItemData.sscItem]) {
    let i = 0;
    const currentStep = {}; // loop into animation object in order to create the animation timeline

    Object.entries(animation).forEach(step => {
      // we use the duration as a "marker" for the next step
      if (step[1].property === 'duration') {
        currentStep[i] = { ...currentStep[i],
          duration: step[1].value + 'ms'
        };
        i++;
      } else {
        // otherwise store the step and continue the loop
        currentStep[i] = { ...currentStep[i],
          [step[1].property]: step[1].value
        };
      }
    });

    if (currentStep[0]) {
      // creates the animation initializer
      const a = animejs__WEBPACK_IMPORTED_MODULE_0__["default"].timeline({
        targets: entry.target,
        autoplay: false,
        delay: entry.target.sscItemOpts.delay,
        duration: entry.target.sscItemOpts.duration,
        easing: entry.target.sscItemOpts.easing,
        // Can be inherited
        direction: 'normal',

        // Is not inherited
        complete(anim) {
          console.log(anim);
          entry.target.removeAttribute('data-ssc-lock');
        }

      }); // loop into the rest of the actions adding the timelines step to sequence

      Object.entries(currentStep).forEach(step => {
        a.add(step[1]);
      });
      this.animations[entry.target.sscItemData.sscItem] = a;
    }
  } // The Enter animation sequence


  if (this.animations[entry.target.sscItemData.sscItem]) {
    if (action === 'enter' && (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isActiveArea)(entry.target, 75)) {
      entry.target.action = 'leave';
      this.animations[entry.target.sscItemData.sscItem].play();
    } else if (action === 'leave' && !(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isActiveArea)(entry.target, 75)) {
      entry.target.action = 'enter';
      this.animations[entry.target.sscItemData.sscItem].pause();
    }
  }

  if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isPartiallyVisible)(entry.target)) {
    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(100).then(() => {
      this.animationSequence(entry, action);
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (animationSequence);

/***/ }),

/***/ "./src/frontend/modules/itemParallax.js":
/*!**********************************************!*\
  !*** ./src/frontend/modules/itemParallax.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "itemParallaxed": () => (/* binding */ itemParallaxed),
/* harmony export */   "parallax": () => (/* binding */ parallax),
/* harmony export */   "parallaxController": () => (/* binding */ parallaxController)
/* harmony export */ });
/**
 * The Parallax effect
 * Handles the Parallax effect for each item stored into "itemParallaxed" array
 *
 * If the last scroll position is the same as the current scroll position, then request an animation frame and exit the current loop.
 * Otherwise, apply the parallax style to each element and request an animation frame callback.
 *
 * The parallax function is called on the window's scroll event
 *
 */
let lastParallaxScrollPosition = 0;
let itemParallaxed = [];
function parallax() {
  if (typeof itemParallaxed !== 'undefined') {
    // if last position is the same as current
    if (window.scrollY === lastParallaxScrollPosition) {
      // callback the animationFrame and exit the current loop
      return window.requestAnimationFrame(parallax);
    }

    itemParallaxed.forEach(element => {
      // apply the parallax style (use the element get getBoundingClientRect since we need updated data)
      const rect = element.getBoundingClientRect();
      const motion = window.innerHeight - rect.top;

      if (motion > 0) {
        const styleValue = element.sscItemOpts.speed * element.sscItemOpts.level * motion * -0.08;
        const heightFix = styleValue + rect.height;
        element.style.transform = 'translate3d(' + (element.sscItemOpts.direction === 'y' ? '0,' + heightFix + 'px' : heightFix + 'px,0') + ',0)';
      } // Store the last position


      lastParallaxScrollPosition = window.scrollY; // requestAnimationFrame callback

      window.requestAnimationFrame(parallax);
    });
  }
}
/**
 * If the item is entering the viewport, add it to the watched list and start the parallax function.
 * If the item is leaving the viewport, remove it from the watched list
 *
 * @param {IntersectionObserverEntry} entry - the entry object that is passed to the callback function
 */

function parallaxController(entry) {
  // add this object to the watched list
  itemParallaxed[entry.target.sscItemData.sscItem] = entry.target; // if the parallax function wasn't running before we need to start it

  if (itemParallaxed.length) {
    this.parallax();
  }

  if (entry.target.action === 'leave') {
    // remove the animated item from the watched list
    itemParallaxed = itemParallaxed.filter(item => item.sscItemData.sscItem !== entry.target.sscItemData.sscItem);
  }
}

/***/ }),

/***/ "./src/frontend/modules/screenJumper.js":
/*!**********************************************!*\
  !*** ./src/frontend/modules/screenJumper.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * It takes the click event, finds the target element, and scrolls to it
 *
 * @param {Event} e - The event object.
 */
const jumpTo = e => {
  e.preventDefault();
  const target = e.currentTarget.dataset.sscJumperTarget;
  let destinationY = null;

  if (target !== 'none') {
    const link = e.currentTarget.querySelector('a');
    const anchor = '#' + link.href.split('#').pop();
    const destinationTarget = document.querySelector(anchor);
    destinationY = destinationTarget.getBoundingClientRect().top + window.scrollY;
  } else {
    destinationY = window.scrollY + window.innerHeight;
  }

  window.scrollTo({
    top: destinationY,
    behavior: 'smooth'
  });
};
/**
 * For each jumper, when clicked, jump to the screen.
 *
 * @param {NodeList} jumpers - The array of elements that will be clicked to jump to the screen.
 */


const jumpToScreen = jumpers => {
  jumpers.forEach(jumper => {
    jumper.onclick = jumpTo;
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (jumpToScreen);

/***/ }),

/***/ "./src/frontend/modules/scrollJacking.js":
/*!***********************************************!*\
  !*** ./src/frontend/modules/scrollJacking.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_compat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/compat */ "./src/utils/compat.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var animejs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! animejs */ "./node_modules/animejs/lib/anime.es.js");
// ScrollTo




function scrollJacking(entry) {
  // if there aren't any defined target, store this one
  if (entry.target.action !== 'enter' && this.hasScrolling !== false) return false;
  this.hasScrolling = entry.target.sscItemData.sscItem;

  const screenJackTo = el => {
    // disable the mouse wheel during scrolling to avoid flickering
    window.addEventListener(_utils_compat__WEBPACK_IMPORTED_MODULE_0__.mouseWheel, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.disableWheel, {
      passive: false
    });
    window.addEventListener('touchmove', _utils_utils__WEBPACK_IMPORTED_MODULE_1__.disableWheel, false);
    window.scrollTo({
      top: window.scrollY,
      behavior: 'auto'
    });
    const duration = parseInt(el.target.sscItemOpts.duration, 10);
    /** Stores the history state */

    if (el.target.id) window.history.pushState(null, null, '#' + el.target.id);
    /**
     *  Anime.js animation
     *
     *  @module Animation
     */

    animejs__WEBPACK_IMPORTED_MODULE_2__["default"].remove(); // remove any previous animation

    (0,animejs__WEBPACK_IMPORTED_MODULE_2__["default"])({
      targets: [window.document.scrollingElement || window.document.body || window.document.documentElement],
      scrollTop: el.target.offsetTop + 10,
      easing: el.target.sscItemOpts.easing || 'linear',
      duration: duration || 700,
      delay: 0,
      complete: () => {
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(parseInt(el.target.sscItemOpts.delay, 10) || 200).then(() => {
          // this.windowData.lastScrollPosition = window.scrollY;
          // window.scrollY = el.target.offsetTop;
          this.hasScrolling = false;
          window.removeEventListener(_utils_compat__WEBPACK_IMPORTED_MODULE_0__.mouseWheel, _utils_utils__WEBPACK_IMPORTED_MODULE_1__.disableWheel);
          window.removeEventListener('touchmove', _utils_utils__WEBPACK_IMPORTED_MODULE_1__.disableWheel);
        });
      }
    });
  };

  if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isPartiallyVisible)(entry.target)) {
    screenJackTo(entry);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (scrollJacking);

/***/ }),

/***/ "./src/frontend/modules/svgPath.js":
/*!*****************************************!*\
  !*** ./src/frontend/modules/svgPath.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var animejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animejs */ "./node_modules/animejs/lib/anime.es.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");


/**
 * If the element is in the viewport, animate the SVG paths
 *
 * @param {IntersectionObserverEntry} entry                     - The IntersectionObserverEntry object.
 * @param {string}                    action                    - The action to be performed.
 * @param {SVGAnimateElement}         [animationInstance=false] - This is the instance of the animation. It's used to reverse the animation.
 * @return {SVGAnimateElement}                                  - the function animationSvgPath.
 */

const animationSvgPath = function (entry, action) {
  let animationInstance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let animation = animationInstance ? animationInstance : animejs__WEBPACK_IMPORTED_MODULE_0__["default"];
  const path = entry.target.querySelectorAll('path');

  if (action === 'enter' && (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isActiveArea)(entry.target, entry.target.sscItemOpts.intersection)) {
    action = 'leave';

    if (animation.began && animation.currentTime !== 0) {
      animation.reverse();
    } else {
      animation = (0,animejs__WEBPACK_IMPORTED_MODULE_0__["default"])({
        targets: path,
        direction: 'normal',
        strokeDashoffset: [animejs__WEBPACK_IMPORTED_MODULE_0__["default"].setDashoffset, 0],
        easing: entry.target.sscItemOpts.easing || 'linear',
        duration: entry.target.sscItemOpts.duration || 5000,

        delay(el, i) {
          return i * entry.target.sscItemOpts.duration / path.length;
        }

      });
    }
  } else if (action === 'leave' && !(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isActiveArea)(entry.target, entry.target.sscItemOpts.intersection)) {
    action = 'enter';

    if (!animation.completed && typeof animation.reverse === 'function') {
      animation.reverse();
    } else {
      animation = (0,animejs__WEBPACK_IMPORTED_MODULE_0__["default"])({
        targets: path,
        strokeDashoffset: [animejs__WEBPACK_IMPORTED_MODULE_0__["default"].setDashoffset, 0],
        duration: entry.target.sscItemOpts.duration,

        delay(el, i) {
          return i * entry.target.sscItemOpts.duration / path.length;
        },

        direction: 'reverse'
      });
    }
  }

  if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isPartiallyVisible)(entry.target)) {
    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(100).then(() => {
      animationSvgPath(entry, action, animation);
    });
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (animationSvgPath);

/***/ }),

/***/ "./src/frontend/modules/textEffects.js":
/*!*********************************************!*\
  !*** ./src/frontend/modules/textEffects.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var animejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animejs */ "./node_modules/animejs/lib/anime.es.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/fn */ "./src/utils/fn.js");




const animateWord = el => {
  const animateLetter = letter => {
    const alpha = ['!', '#', '0', '1', '2', '3', '4', '5', '6', 'A', 'M', 'T', 'P', 'W', 'G', 'E', 'R', 'I', 'K'];
    letter.classList.add('changing'); //change color of letter

    const original = letter.innerHTML; //get original letter for use later

    /*.letter{
        &.changing{
          color: lightgray;
        }
      }*/
    //loop through random letters

    let i = 0;
    const letterInterval = setInterval(function () {
      // Get random letter
      const randomLetter = alpha[Math.floor(Math.random() * alpha.length)];
      letter.innerHTML = randomLetter;

      if (i >= Math.random() * 100 || randomLetter === original) {
        //if letter has changed around 10 times then stop
        clearInterval(letterInterval);
        letter.innerHTML = original; //set back to original letter

        letter.classList.remove('changing'); //reset color
      }

      ++i;
    }, 100);
  };

  const letters = el.querySelectorAll('.letter');
  const shuffleDuration = el.sscItemOpts.duration;
  letters.forEach(function (letter, index) {
    //trigger animation for each letter in word
    setTimeout(function () {
      animateLetter(letter, shuffleDuration);
    }, 100 * index); //small delay for each letter
  });
  setTimeout(function () {
    el.removeAttribute('data-ssc-count');
  }, shuffleDuration);
};
/**
 * Animate Numbers
 *
 * @param {Object} el Element to animate.
 */


function animateCount(el) {
  (0,animejs__WEBPACK_IMPORTED_MODULE_0__["default"])({
    targets: el.target || el.target.lastChild,
    textContent: [0, parseInt(el.target.lastChild.textContent, 10)],
    round: 1,
    duration: parseInt(el.target.sscItemOpts.duration) || 5000,
    delay: parseInt(el.target.sscItemOpts.delay) || 500,
    easing: el.target.sscItemOpts.easing,
    complete: () => el.target.removeAttribute('data-ssc-count')
  });
}
/**
 * It splits the text into letters, wraps each letter in a span, and then animates each letter
 *
 * @param {IntersectionObserverEntry} el - The element that is being animated.
 */


function textAnimated(el) {
  if (el.target.dataset.sscCount || el.target.action === 'leave') {
    return true;
  }

  el.target.dataset.sscCount = 'true';

  if (el.target.sscItemOpts.target === 'number') {
    animateCount(el);
  } else {
    if (!el.target.dataset.init) {
      const replaced = (0,_utils_fn__WEBPACK_IMPORTED_MODULE_2__.splitSentence)(el.target.innerHTML, 'letters');

      if (el.target.innerHTML) {
        el.target.innerHTML = replaced;
      }

      el.target.dataset.init = 'true';
    }

    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(el.target.sscItemOpts.delay).then(() => animateWord(el.target));
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (textAnimated);

/***/ }),

/***/ "./src/frontend/modules/textStagger.js":
/*!*********************************************!*\
  !*** ./src/frontend/modules/textStagger.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var animejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animejs */ "./node_modules/animejs/lib/anime.es.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/data */ "./src/utils/data.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/fn */ "./src/utils/fn.js");





function textStagger(entry) {
  const item = entry.target;

  if (item.action === 'enter' && (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.isActiveArea)(entry.target, 75)) {
    const preset = item.sscItemOpts.preset;
    const duration = parseInt(item.sscItemOpts.duration, 10);
    const animationDelay = parseInt(item.sscItemOpts.delay, 10);
    const easing = item.sscItemOpts.easing;
    const splitBy = item.sscItemOpts.splitBy || 'letter';
    const replaced = (0,_utils_fn__WEBPACK_IMPORTED_MODULE_3__.splitSentence)(item.lastChild.textContent, splitBy);

    if (item.lastChild.innerHTML) {
      item.lastChild.innerHTML = replaced;
    } else {
      item.innerHTML = replaced;
    }

    item.style.position = 'relative';
    const anim = animejs__WEBPACK_IMPORTED_MODULE_0__["default"].timeline({
      loop: false,
      autoplay: false,
      animationDelay
    });
    _utils_data__WEBPACK_IMPORTED_MODULE_1__.textStaggerPresets[preset].forEach((data, index) => {
      switch (index) {
        case 0:
          anim.add({ ..._utils_data__WEBPACK_IMPORTED_MODULE_1__.textStaggerPresets[preset][index],
            targets: item.querySelectorAll('.' + splitBy),
            duration: duration * 0.75,
            easing,
            delay: animejs__WEBPACK_IMPORTED_MODULE_0__["default"].stagger(duration * 0.05),
            ...data
          });
          break;

        case 1:
          anim.add({ ...(_utils_data__WEBPACK_IMPORTED_MODULE_1__.textStaggerPresets[preset][index] || null),
            targets: item,
            easing,
            duration,
            delay: duration,
            ...data
          });
          break;

        default:
          anim.add({ ...(_utils_data__WEBPACK_IMPORTED_MODULE_1__.textStaggerPresets[preset][index] || null),
            targets: item,
            easing,
            ...data
          });
          break;
      }
    });
    return anim.play();
  }

  (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.delay)(200).then(() => textStagger(entry));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (textStagger);

/***/ }),

/***/ "./src/frontend/modules/timeline.js":
/*!******************************************!*\
  !*** ./src/frontend/modules/timeline.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "timelines": () => (/* binding */ timelines)
/* harmony export */ });
/* harmony import */ var animejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animejs */ "./node_modules/animejs/lib/anime.es.js");
/* harmony import */ var scrollmagic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrollmagic */ "./node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js");
/* harmony import */ var scrollmagic__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scrollmagic__WEBPACK_IMPORTED_MODULE_1__);


const timelines = [];
const scrollMagic = new (scrollmagic__WEBPACK_IMPORTED_MODULE_1___default().Controller)();

function scrollTimeline(el) {
  el.classList.add('ssc-timeline');
  el.style.maxWidth = '100%'; // Add timeline for each element

  const timeline = animejs__WEBPACK_IMPORTED_MODULE_0__["default"].timeline({
    autoplay: false
  });
  el.querySelectorAll('.ssc-timeline-scene').forEach(scenes => {
    const sceneData = JSON.parse(scenes.sscItemData.scene);
    const sceneOpts = scenes.sscItemOpts;
    sceneOpts.duration = parseInt(sceneOpts.duration, 10);
    sceneOpts.delay = parseInt(sceneOpts.delay, 10);
    const offset = parseInt(sceneOpts.offset, 10);
    const sceneOffset = // eslint-disable-next-line no-nested-ternary
    offset !== 0 ? offset > 0 ? '+=' + offset : '-=' + offset : false; // loop foreach object of the json (each object is a scene of the element timeline)

    Object.values(sceneData).forEach(scene => {
      timeline.add({
        targets: scenes,
        duration: sceneOpts.duration,
        delay: sceneOpts.delay,
        easing: scenes.sscItemOpts.easing,
        ...scene
      }, sceneOffset);
    });
  });
  /**
   * Create a scene
   *
   * @module ScrollMagic
   * @function ScrollMagic.Scene
   */

  timelines[el.sscItemData.sscItem] = new (scrollmagic__WEBPACK_IMPORTED_MODULE_1___default().Scene)({
    triggerElement: el,
    duration: el.sscItemOpts.duration,
    triggerHook: el.sscItemOpts.triggerHook || 0.25
  }) // Add debug indicators
  .addIndicators() // bind animation timeline with anime.js animation progress
  .on('progress', function (event) {
    timeline.seek(timeline.duration * event.progress);
  }).setPin(el).addTo(scrollMagic);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (scrollTimeline);

/***/ }),

/***/ "./src/frontend/modules/videoFocus.js":
/*!********************************************!*\
  !*** ./src/frontend/modules/videoFocus.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * The above code is a function handle the play state of the video and  is called when it is in viewport.
 *
 * @param {IntersectionObserverEntry} entry
 */
const videoFocusPlay = entry => {
  const video = entry.target.querySelector('video');

  if (entry.target.action === 'enter') {
    return video.play();
  }

  if (!video.ended) {
    return video.pause();
  }

  video.pause();
  video.currentTime = 0;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (videoFocusPlay);

/***/ }),

/***/ "./src/frontend/modules/videoParallax.js":
/*!***********************************************!*\
  !*** ./src/frontend/modules/videoParallax.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "parallaxVideo": () => (/* binding */ parallaxVideo)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");

let videoParallaxed = [];
let lastVideoScrollPosition = 0;
function parallaxVideo() {
  if (window.scrollY === lastVideoScrollPosition) {
    // callback the animationFrame and exit the current loop
    return window.requestAnimationFrame(parallaxVideo);
  } // Store the last position


  lastVideoScrollPosition = window.scrollY;
  videoParallaxed.forEach(video => {
    const rect = video.item.getBoundingClientRect();

    if (video.hasExtraTimeline) {
      console.log('scrolling timeline', (window.scrollY - video.distanceTop + rect.top + rect.height) / video.hasExtraTimeline, 'regular timeline', 1 - (rect.top + rect.height) / video.hasExtraTimeline); // the common behaviour

      video.item.currentTime = (((window.scrollY - video.distanceTop) / video.hasExtraTimeline + (1 - (rect.top + rect.height) / video.hasExtraTimeline)) * video.videoDuration * video.playbackRatio).toFixed(5);
    } else {
      // the common behaviour
      video.item.currentTime = ((1 - (rect.top + rect.height) / video.timelineLength) * video.videoDuration * video.playbackRatio).toFixed(5);
    }
  });
  return window.requestAnimationFrame(parallaxVideo);
}

function videoParallaxController(entry) {
  const videoEl = entry.target.querySelector('video');

  if (videoEl && !videoParallaxed[entry.target.sscItemData.sscItem]) {
    if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isPartiallyVisible)(videoEl)) {
      const rect = entry.target.getBoundingClientRect();
      let timelineDuration = parseInt(entry.target.sscItemData.timelineDuration, 10) || 0;
      timelineDuration = entry.target.sscItemData.intersection === 'down' ? timelineDuration : timelineDuration * -1;
      const duration = rect.height + window.innerHeight + timelineDuration;
      videoParallaxed[entry.target.sscItemData.sscItem] = {
        item: videoEl,
        videoDuration: videoEl.duration,
        sscItemData: entry.target.sscItemData,
        hasExtraTimeline: timelineDuration,
        timelineLength: duration,
        distanceTop: rect.height + rect.top + window.scrollY,
        playbackRatio: parseFloat(entry.target.sscItemOpts.playbackRatio).toFixed(2)
      };
    }

    parallaxVideo();
  }

  if (entry.target.action === 'leave') {
    return videoParallaxed = videoParallaxed.filter(item => item.sscItemData.sscItem !== entry.target.sscItemData.sscItem);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (videoParallaxController);

/***/ }),

/***/ "./src/frontend/modules/videoWheel.js":
/*!********************************************!*\
  !*** ./src/frontend/modules/videoWheel.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_compat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/compat */ "./src/utils/compat.js");


const videoOnWheel = event => {
  event.preventDefault();
  const videoEl = event.target;

  if (videoEl.currentTime <= 0 && event.deltaY < 0 || videoEl.currentTime === videoEl.duration && event.deltaY > 0) {
    videoEl.removeEventListener(_utils_compat__WEBPACK_IMPORTED_MODULE_0__.mouseWheel, undefined.videoOnWheel);
    return true;
  }

  window.requestAnimationFrame(() => {
    // set the current frame
    const Offset = event.deltaY > 0 ? 1 / 29.7 : 1 / 29.7 * -1; // e.deltaY is the direction

    videoEl.currentTime = (videoEl.currentTime + Offset * event.target.playbackRatio).toPrecision(5);
  });
}; // Listens mouse scroll wheel


function videoWheelController(el) {
  const videoEl = el.target.querySelector('video');
  videoEl.playbackRatio = parseFloat(el.target.sscItemOpts.playbackRatio);
  videoEl.addEventListener(_utils_compat__WEBPACK_IMPORTED_MODULE_0__.mouseWheel, videoOnWheel);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (videoWheelController);

/***/ }),

/***/ "./src/ssc.js":
/*!********************!*\
  !*** ./src/ssc.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sscOptions": () => (/* binding */ sscOptions)
/* harmony export */ });
/* harmony import */ var _styles_ssc_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/ssc.scss */ "./src/styles/ssc.scss");
/* harmony import */ var _frontend_ssc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frontend/_ssc */ "./src/frontend/_ssc.js");


const sscOptions = {
  rootMargin: '0px',
  // the IntersectionObserver root margin
  // removed because we only need to know if the element is entering or leaving the viewport
  // const intersectionPrecision = 5;
  // threshold: [ ...Array( intersectionPrecision + 1 ).keys() ].map( ( x ) => x / intersectionPrecision ), // 1-100 the precision of intersections (higher number increase cpu usage - use with care!)
  threshold: [0],
  container: document.querySelector('.wp-site-blocks') // maybe document.getElementById( 'page' );

}; // On page scripts load trigger immediately ssc

window.addEventListener('load', () => {
  const options = {
    page: sscOptions.container
  };
  typeof window.screenControl ? window.screenControl = new _frontend_ssc__WEBPACK_IMPORTED_MODULE_1__["default"](options) : console.warn('SSC ERROR: unable to load multiple instances');
});

/***/ }),

/***/ "./src/utils/compat.js":
/*!*****************************!*\
  !*** ./src/utils/compat.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mouseWheel": () => (/* binding */ mouseWheel)
/* harmony export */ });
// Safe event definition
// detect available wheel event
const mouseWheel = 'onwheel' in document.createElement('div') ? 'wheel' // Modern browsers support "wheel"
: document.onmousewheel !== undefined ? 'mousewheel' // Webkit and IE support at least "mousewheel"
: 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

/***/ }),

/***/ "./src/utils/data.js":
/*!***************************!*\
  !*** ./src/utils/data.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "actionsTemplate": () => (/* binding */ actionsTemplate),
/* harmony export */   "animationEasings": () => (/* binding */ animationEasings),
/* harmony export */   "animationList": () => (/* binding */ animationList),
/* harmony export */   "animationTypes": () => (/* binding */ animationTypes),
/* harmony export */   "cssAnimationsEasings": () => (/* binding */ cssAnimationsEasings),
/* harmony export */   "textStaggerPresets": () => (/* binding */ textStaggerPresets),
/* harmony export */   "textStaggerPresetsNames": () => (/* binding */ textStaggerPresetsNames)
/* harmony export */ });
/** the advanced animation available parameters and defaults  */
const actionsTemplate = [{
  actionLabel: 'Keyframe (duration in ms)',
  action: 'duration',
  valueType: 'int',
  valueDefault: '500'
}, {
  actionLabel: 'Opacity',
  action: 'opacity',
  valueType: 'int',
  valueDefault: '1'
}, {
  actionLabel: 'translateY',
  action: 'translateY',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'translateX',
  action: 'translateX',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'translateZ',
  action: 'translateZ',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'Rotate',
  action: 'rotate',
  valueType: 'string',
  valueDefault: '45deg'
}, {
  actionLabel: 'rotateY',
  action: 'translateY',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'rotateX',
  action: 'translateX',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'rotateZ',
  action: 'translateZ',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'Scale',
  action: 'scale',
  valueType: 'number',
  valueDefault: '1.5'
}, {
  actionLabel: 'Background',
  action: 'background',
  valueType: 'color',
  valueDefault: '#000'
}, {
  actionLabel: 'Color',
  action: 'color',
  valueType: 'color',
  valueDefault: '#f00'
}, {
  actionLabel: 'CSS Animation',
  action: 'cssAnimation',
  valueType: 'string',
  valueDefault: 'fadeIn 5s linear 2s infinite alternate'
}];
const cssAnimationsEasings = [{
  label: 'Linear',
  value: 'linear'
}, {
  label: 'Ease',
  value: 'ease'
}, {
  label: 'Ease-in',
  value: 'ease-in'
}, {
  label: 'Ease-out',
  value: 'ease-out'
}, {
  label: 'Ease-in-out',
  value: 'ease-in-out'
}];
const animationEasings = [{
  label: 'Linear',
  value: 'linear'
}, {
  label: 'Elastic (low)',
  value: 'easeInElastic(1, .3)'
}, {
  label: 'Elastic (mid)',
  value: 'easeInElastic(1, .6)'
}, {
  label: 'Elastic (high)',
  value: 'easeInElastic(2, 1)'
}, {
  label: 'easeInQuad',
  value: 'easeInQuad'
}, {
  label: 'easeOutQuad',
  value: 'easeOutQuad'
}, {
  label: 'easeInOutQuad',
  value: 'easeInOutQuad'
}, {
  label: 'easeOutInQuad',
  value: 'easeOutInQuad'
}, {
  label: 'easeInCubic',
  value: 'easeInCubic'
}, {
  label: 'easeOutCubic',
  value: 'easeOutCubic'
}, {
  label: 'easeInOutCubic',
  value: 'easeInOutCubic'
}, {
  label: 'easeOutInCubic',
  value: 'easeOutInCubic'
}, {
  label: 'easeInSine',
  value: 'easeInSine'
}, {
  label: 'easeOutSine',
  value: 'easeOutSine'
}, {
  label: 'easeInOutSine',
  value: 'easeInOutSine'
}, {
  label: 'easeOutInSine',
  value: 'easeOutInSine'
}, {
  label: 'easeInExpo',
  value: 'easeInExpo'
}, {
  label: 'easeOutExpo',
  value: 'easeOutExpo'
}, {
  label: 'easeInOutExpo',
  value: 'easeInOutExpo'
}, {
  label: 'easeOutInExpo',
  value: 'easeOutInExpo'
}];
const animationTypes = [{
  label: 'Animation',
  value: 'sscAnimation',
  default: {
    animationEnter: 'fadeIn',
    animationLeave: 'fadeOut',
    intersection: 75,
    easing: 'linear',
    duration: 0,
    delay: 0,
    reiterate: true,
    stagger: 'none'
  }
}, {
  label: 'Parallax',
  value: 'sscParallax',
  default: {
    direction: 'y',
    level: 1,
    speed: 1,
    motion: 50,
    reiterate: true
  }
}, {
  label: 'Scroll Timeline',
  value: 'sscScrollTimeline',
  default: {
    duration: 400,
    triggerHook: 0.2,
    reiterate: true
  }
}, {
  label: 'Scroll Timeline child',
  value: 'sscTimelineChild',
  default: {
    offset: 0,
    delay: 0,
    duration: 1000,
    reiterate: true,
    easing: 'linear'
  }
}, {
  label: 'Image 360',
  value: 'ssc360',
  default: {
    spinRatio: 1,
    control: 'pointer',
    // drag
    reiterate: true
  }
}, {
  label: 'Image Zoom',
  value: 'sscImageZoom',
  default: {
    zoom: 1,
    reiterate: true
  }
}, {
  label: 'Video scroll-driven playback',
  value: 'sscVideoScroll',
  default: {
    playbackRatio: 1,
    reiterate: true
  }
}, {
  label: 'Video Parallax',
  value: 'sscVideoParallax',
  default: {
    playbackRatio: 1,
    reiterate: true
  }
}, {
  label: 'Video play on screen',
  value: 'sscVideoFocusPlay',
  default: {
    reiterate: true
  }
}, {
  label: 'Svg Path Animation',
  value: 'sscSvgPath',
  default: {
    duration: 5000,
    delay: 500,
    intersection: 80,
    reiterate: true,
    easing: 'easeInOutExpo'
  }
}, {
  label: 'Custom animation',
  value: 'sscSequence',
  default: {
    duration: 2000,
    delay: 500,
    reiterate: true,
    easing: 'easeInOutQuad'
  }
}, {
  label: 'ScrollJacking',
  value: 'sscScrollJacking',
  default: {
    intersection: 90,
    duration: 800,
    delay: 200,
    reiterate: true,
    easing: 'easeOutExpo'
  }
}, {
  label: 'Counter',
  value: 'sscCounter',
  default: {
    duration: 8000,
    delay: 0,
    reiterate: true,
    easing: 'easeInOutExpo',
    target: 'number'
  }
}, {
  label: 'Text Stagger',
  value: 'sscTextStagger',
  default: {
    duration: 5000,
    delay: 1000,
    reiterate: true,
    easing: 'easeInOutQuad',
    preset: 'default',
    splitBy: 'letter'
  }
}, {
  label: 'Screen Jump',
  value: 'sscScreenJump',
  default: {
    target: 'none'
  }
}];
const animationList = [{
  label: 'No Animation',
  value: false
}, {
  label: 'bounce',
  value: 'bounce'
}, {
  label: 'flash',
  value: 'flash'
}, {
  label: 'pulse',
  value: 'pulse'
}, {
  label: 'rubberBand',
  value: 'rubberBand'
}, {
  label: 'shakeX',
  value: 'shakeX'
}, {
  label: 'shakeY',
  value: 'shakeY'
}, {
  label: 'headShake',
  value: 'headShake'
}, {
  label: 'swing',
  value: 'swing'
}, {
  label: 'tada',
  value: 'tada'
}, {
  label: 'wobble',
  value: 'wobble'
}, {
  label: 'jello',
  value: 'jello'
}, {
  label: 'heartBeat',
  value: 'heartBeat'
}, {
  label: 'hinge',
  value: 'hinge'
}, {
  label: 'jackInTheBox',
  value: 'jackInTheBox'
}, {
  label: 'rollIn',
  value: 'rollIn'
}, {
  label: 'rollOut',
  value: 'rollOut'
}, // Back
{
  label: 'backInDown',
  value: 'backInDown'
}, {
  label: 'backInLeft',
  value: 'backInLeft'
}, {
  label: 'backInRight',
  value: 'backInRight'
}, {
  label: 'backInUp',
  value: 'backInUp'
}, {
  label: 'backOutDown',
  value: 'backOutDown'
}, {
  label: 'backOutLeft',
  value: 'backOutLeft'
}, {
  label: 'backOutRight',
  value: 'backOutRight'
}, {
  label: 'backOutUp',
  value: 'backOutUp'
}, // Bouncing
{
  label: 'bounceIn',
  value: 'bounceIn'
}, {
  label: 'bounceInDown',
  value: 'bounceInDown'
}, {
  label: 'bounceInLeft',
  value: 'bounceInLeft'
}, {
  label: 'bounceInRight',
  value: 'bounceInRight'
}, {
  label: 'bounceInUp',
  value: 'bounceInUp'
}, {
  label: 'bounceOut',
  value: 'bounceOut'
}, {
  label: 'bounceOutDown',
  value: 'bounceOutDown'
}, {
  label: 'bounceOutLeft',
  value: 'bounceOutLeft'
}, {
  label: 'bounceOutRight',
  value: 'bounceOutRight'
}, {
  label: 'bounceOutUp',
  value: 'bounceOutUp'
}, // Fade
{
  label: 'fadeIn',
  value: 'fadeIn'
}, {
  label: 'fadeInDown',
  value: 'fadeInDown'
}, {
  label: 'fadeInDownBig',
  value: 'fadeInDownBig'
}, {
  label: 'fadeInLeft',
  value: 'fadeInLeft'
}, {
  label: 'fadeInLeftBig',
  value: 'fadeInLeftBig'
}, {
  label: 'fadeInRight',
  value: 'fadeInRight'
}, {
  label: 'fadeInRightBig',
  value: 'fadeInRightBig'
}, {
  label: 'fadeInUp',
  value: 'fadeInUp'
}, {
  label: 'fadeInUpBig',
  value: 'fadeInUpBig'
}, {
  label: 'fadeInTopLeft',
  value: 'fadeInTopLeft'
}, {
  label: 'fadeInTopRight',
  value: 'fadeInTopRight'
}, {
  label: 'fadeInTopRight',
  value: 'fadeInTopRight'
}, {
  label: 'fadeInBottomLeft',
  value: 'fadeInBottomLeft'
}, // fade exit
{
  label: 'fadeOut',
  value: 'fadeOut'
}, {
  label: 'fadeOutDown',
  value: 'fadeOutDown'
}, {
  label: 'fadeOutDownBig',
  value: 'fadeOutDownBig'
}, {
  label: 'fadeOutLeft',
  value: 'fadeOutLeft'
}, {
  label: 'fadeOutLeftBig',
  value: 'fadeOutLeftBig'
}, {
  label: 'fadeOutRight',
  value: 'fadeOutRight'
}, {
  label: 'fadeOutRightBig',
  value: 'fadeOutRightBig'
}, {
  label: 'fadeOutUp',
  value: 'fadeOutUp'
}, {
  label: 'fadeOutUpBig',
  value: 'fadeOutUpBig'
}, {
  label: 'fadeOutTopLeft',
  value: 'fadeOutTopLeft'
}, {
  label: 'fadeOutTopRight',
  value: 'fadeOutTopRight'
}, {
  label: 'fadeOutTopRight',
  value: 'fadeOutTopRight'
}, {
  label: 'fadeOutBottomLeft',
  value: 'fadeOutBottomLeft'
}, // Lightspeed
{
  label: 'lightSpeedInRight',
  value: 'lightSpeedInRight'
}, {
  label: 'lightSpeedInLeft',
  value: 'lightSpeedInLeft'
}, {
  label: 'lightSpeedOutRight',
  value: 'lightSpeedOutRight'
}, {
  label: 'lightSpeedOutLeft',
  value: 'lightSpeedOutLeft'
}, // Zooming
{
  label: 'zoomIn',
  value: 'zoomIn'
}, {
  label: 'zoomInDown',
  value: 'zoomInDown'
}, {
  label: 'zoomInLeft',
  value: 'zoomInLeft'
}, {
  label: 'zoomInRight',
  value: 'zoomInRight'
}, {
  label: 'zoomInUp',
  value: 'zoomInUp'
}, {
  label: 'zoomOut',
  value: 'zoomOut'
}, {
  label: 'zoomOutDown',
  value: 'zoomOutDown'
}, {
  label: 'zoomOutLeft',
  value: 'zoomOutLeft'
}, {
  label: 'zoomOutRight',
  value: 'zoomOutRight'
}, {
  label: 'zoomOutUp',
  value: 'zoomOutUp'
}, // Sliding
{
  label: 'slideInDown',
  value: 'slideInDown'
}, {
  label: 'slideInLeft',
  value: 'slideInLeft'
}, {
  label: 'slideInRight',
  value: 'slideInRight'
}, {
  label: 'slideInUp',
  value: 'slideInUp'
}, {
  label: 'slideOutDown',
  value: 'slideOutDown'
}, {
  label: 'slideOutLeft',
  value: 'slideOutLeft'
}, {
  label: 'slideOutRight',
  value: 'slideOutRight'
}, {
  label: 'slideOutUp',
  value: 'slideOutUp'
}];
const textStaggerPresets = {
  default: [{
    translateY: ['1em', 0],
    translateZ: 0
  }],
  expo: [{
    scale: [15, 1],
    opacity: [0, 1]
  }],
  domino: [{
    rotateY: [-90, 0],
    transformOrigin: '0 0'
  }],
  ghosting: [{
    translateX: [40, 0],
    translateZ: 0
  }, {
    translateX: [0, -30],
    opacity: [1, 0]
  }],
  elasticIn: [{
    scale: [0, 1],
    elasticity: 1200
  }],
  rain: [{
    translateY: ['-2em', 0],
    scaleX: [0, 1],
    opacity: [0, 1]
  }],
  snake: [{
    scaleX: [0, 1],
    translateY: ['1em', 0],
    translateX: ['.5em', 0],
    translateZ: 0,
    rotateZ: [90, 0],
    transformOrigin: '100% 50%'
  }]
};
const textStaggerPresetsNames = [];
Object.keys(textStaggerPresets).map(item => textStaggerPresetsNames.push({
  label: item,
  value: item
}));

/***/ }),

/***/ "./src/utils/fn.js":
/*!*************************!*\
  !*** ./src/utils/fn.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autoLintCode": () => (/* binding */ autoLintCode),
/* harmony export */   "capitalToloDash": () => (/* binding */ capitalToloDash),
/* harmony export */   "css2obj": () => (/* binding */ css2obj),
/* harmony export */   "dataStringify": () => (/* binding */ dataStringify),
/* harmony export */   "getDefaults": () => (/* binding */ getDefaults),
/* harmony export */   "getElelementData": () => (/* binding */ getElelementData),
/* harmony export */   "loDashToCapital": () => (/* binding */ loDashToCapital),
/* harmony export */   "splitSentence": () => (/* binding */ splitSentence),
/* harmony export */   "styleObj2String": () => (/* binding */ styleObj2String)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/utils/data.js");

/**
 * It takes a data object and a type string, and returns a string of the data object's key/value pairs, separated by semicolons
 *
 * @param {Object} data - The data object to be converted to a string.
 * @param {string} type - The type of data we're working with.
 *
 * @return {string}     - A stringified version of the Object
 */

function dataStringify(data, type) {
  let csv = '';
  csv += Object.entries(data).map(item => {
    if (type === 'sequence') {
      return item[1].action + ':' + item[1].value;
    }

    return item[0] !== 'steps' && item[0] !== 'scene' ? item[0] + ':' + item[1] : null;
  }).join(';');
  return csv || null;
}
/**
 * It takes a string of CSS and returns an object of key/value pairs in jss format
 *
 * @param {string} css - The CSS string to convert to an object.
 * @return {Object} An object with the CSS properties as keys and the CSS values as values.
 */

const css2obj = css => {
  const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
        o = {};
  css.replace(r, (m, p, v) => o[p] = v);
  return o;
};
/**
 * JSON style object to a CSS string
 *
 * It takes an object of CSS styles and returns a string of CSS styles
 *
 * @param {Object} style       - The style object to convert to a string.
 * @param {string} [indent=\t] - The string to use for indentation.
 */

const styleObj2String = function (style) {
  let indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\t';
  return Object.entries(style).map(_ref => {
    let [k, v] = _ref;
    return indent + `${k}: ${v}`;
  }).join(';');
};
/**
 * It takes a string and replaces all capital letters with a dash followed by the lowercase version of the letter
 *
 * @param {string} k - The string to be converted.
 */

const capitalToloDash = k => k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
/**
 * Replace all hyphens followed by a lowercase letter with the same letter capitalized.
 *
 * @param {string} k - The string to be converted.
 */

const loDashToCapital = k => k.replace(/-[a-z]/g, match => `${match[1].toUpperCase()}`);
/**
 * It takes a string of JavaScript code and adds a newline after every semicolon and opening curly brace
 *
 * @param {string} k - The code to be linted.
 * @return {string} the matched value with a new line character appended to it.
 */

const autoLintCode = k => k.replace(/\;| \{/gi, function (matched) {
  return matched + '\n';
});
/**
 * Parses the dataset stored with wp editor and returns an object with the arguments as keys and values
 *
 * @param {string} opts        - The string of data attributes that we want to parse.
 * @param {string} [type=data] - The type of data you want to get. Use style to parse css style
 * @return {Object}            - An object with the key being the first element of the array and the value being the second element of the array.
 */

const getElelementData = function (opts) {
  let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';

  if (opts) {
    const rawArgs = opts.split(';');
    let parsedArgs = [];
    parsedArgs = rawArgs.map(arg => arg.split(':'));
    const args = {};
    parsedArgs.forEach((el, index) => {
      if (type === 'style') {
        args[index] = {
          property: el[0],
          value: el[1]
        };
      } else {
        args[el[0]] = el[1];
      }
    });
    return args;
  }

  return false;
};
/**
 * Split a sentence into words or letters
 *
 * It takes a sentence and splits it into words, then splits each word into letters
 *
 * @param {string} sentence       - The sentence to be split.
 * @param {string} [splitBy=word] - 'word' or 'letter'
 *
 * @return {string} A string of HTML with the words and letters wrapped in span tags.
 */

function splitSentence(sentence) {
  let splitBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'word';
  const words = sentence.split(' ');
  const result = words.map(word => {
    if (splitBy === 'word') {
      return `<span class="word">${word}</span>`;
    }

    return '<span class="word">' + word.replace(/\S/g, `<span class="letter">$&</span>`) + '</span>';
  });
  return result.join(' ');
}
/**
 * It takes an animation type and returns the default values for that animation
 *
 * @param {string} opt - The animation type selected.
 *
 * @return {Object} The default values for the animation type.
 */

const getDefaults = opt => {
  const animationType = _data__WEBPACK_IMPORTED_MODULE_0__.animationTypes.filter(animation => {
    return animation.value ? animation.value === opt : null;
  });
  return animationType[0] ? animationType[0].default : {};
};

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "delay": () => (/* binding */ delay),
/* harmony export */   "disableWheel": () => (/* binding */ disableWheel),
/* harmony export */   "hasMouseOver": () => (/* binding */ hasMouseOver),
/* harmony export */   "isActiveArea": () => (/* binding */ isActiveArea),
/* harmony export */   "isBetween": () => (/* binding */ isBetween),
/* harmony export */   "isCrossing": () => (/* binding */ isCrossing),
/* harmony export */   "isFullyVisible": () => (/* binding */ isFullyVisible),
/* harmony export */   "isInView": () => (/* binding */ isInView),
/* harmony export */   "isPartiallyVisible": () => (/* binding */ isPartiallyVisible),
/* harmony export */   "ontouchmoveEvent": () => (/* binding */ ontouchmoveEvent),
/* harmony export */   "scrollDirection": () => (/* binding */ scrollDirection),
/* harmony export */   "touchstartEvent": () => (/* binding */ touchstartEvent)
/* harmony export */ });
/**
 * This function returns a promise that resolves after the given number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay.
 */
const delay = ms => new Promise(r => setTimeout(r, ms));
/**
 * It prevents That the mouse wheel can change the position on the page
 *
 * @param {Event} e - The event object.
 */

function disableWheel(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}
/**
 * Checks when the element is inside the viewport
 *
 * If the top of the element is above the bottom of the viewport or the bottom of the element is below the top of the viewport, then the element is partially visible.
 *
 * @param {HTMLElement} el - The element you want to check.
 * @return {boolean} true when the element is shown inside the viewport
 */

const isPartiallyVisible = el => {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};
/**
 * Checks when the element is completely inside in the viewport edges
 *
 * "If the top of the element is greater than or equal to 0 and the bottom of the element is less than or equal to the height of the window, then the element is fully visible."
 *
 * @param {HTMLElement} el - The element you want to check if it's fully visible.
 * @return {boolean} if the item edges are completely inside the viewport
 */

const isFullyVisible = el => {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
};
/**
 * Check when the element is inside the active area
 *
 * "Is the element's center within 20% of the viewport's height from the top and bottom?"
 * The function returns true if the element's center is within the range, and false if it's not
 *
 * @param {HTMLElement} el            - The element you want to check if it's in the active area.
 * @param {number}      rangePosition - The percentage of the viewport's height to use as active area
 * @return {boolean}                  - true if the element is inside the active area
 */

const isActiveArea = (el, rangePosition) => {
  const rect = el.getBoundingClientRect();
  const limit = window.innerHeight * (rangePosition * 0.005); // 20% of 1000px is 100px from top and 100px from bottom

  const elementCenter = rect.top + rect.height * 0.5;
  return elementCenter > limit && elementCenter < window.innerHeight - limit;
};
/**
 * Check if the element is above or below a certain percentage of the screen
 *
 * @param {HTMLElement} el            - The element you want to check if it's crossing the center of the screen.
 * @param {number}      rangePosition - The percentage of the viewport height that the element should be at.
 * @return {boolean}                     - return true if above, false if below
 */

const isCrossing = (el, rangePosition) => {
  const rect = el.getBoundingClientRect();
  const center = parseInt(window.innerHeight * (rangePosition * 0.01), 10);
  return rect.top > center && rect.bottom < center;
};
/**
 * If the center of the element is between the top and bottom margins of the active area, then the element is in view
 *
 * @param {Object} position         - The stored original position of the element in the viewport.
 * @param {number} intersectionArea - The percentage of the element that needs to be visible in order to trigger the animation.
 * @return {boolean}                - the element is in view true / false
 */

const isInView = (position, intersectionArea) => {
  position.ycenter = (position.yTop + position.yBottom) * 0.5;
  const activeArea = intersectionArea * (window.innerHeight * 0.01);
  const inactiveArea = (window.innerHeight - activeArea) * 0.5;
  const margins = {
    top: window.scrollY + inactiveArea,
    bottom: window.scrollY + (window.innerHeight - inactiveArea)
  };
  return margins.top < position.ycenter && margins.bottom > position.ycenter;
};
/**
 * It returns true if the element is between the top and bottom margins of the active area
 *
 * @param {HTMLElement} el               - the element we're checking
 * @param {number}      intersectionArea - The percentage of the viewport that the element should be in.
 *
 * @return {boolean} Return true if the element is inside the active area
 */

function isBetween(el, intersectionArea) {
  const elCenter = (el.position.yTop + el.position.yBottom) * 0.5;
  const activeArea = intersectionArea * (window.innerHeight * 0.01);
  const inactiveArea = (window.innerHeight - activeArea) * 0.5;
  const margins = {
    top: window.scrollY + inactiveArea,
    bottom: window.scrollY + (window.innerHeight - inactiveArea)
  };
  return margins.top > elCenter && elCenter < margins.bottom;
}
/**
 * If the last scroll position is less than the current scroll position, the user is scrolling down.
 * If the last scroll position is greater than the current scroll position, the user is scrolling up
 */

function scrollDirection() {
  if (this.windowData.lastScrollPosition < window.scrollY) {
    document.body.dataset.direction = 'down';
  } else if (this.windowData.lastScrollPosition > window.scrollY) {
    document.body.dataset.direction = 'up';
  }
}
/**
 * If the mouse is over the element, return true.
 *
 * @param {Event} e - The event object
 * @return {boolean} - Return true when the given element has the mouse over
 */

const hasMouseOver = e => {
  const mouseX = e;
  const mouseY = e;
  const rect = e.target.getBoundingClientRect();
  return rect.left < mouseX < rect.right && rect.top < mouseY < rect.bottom;
};
/**
 * It sets the touchPos property of the current object to the y-coordinate of the first touch point in the event's changedTouches list
 *
 * @param {TouchEvent} e - The event object.
 */

function touchstartEvent(e) {
  this.touchPos.Y = e.changedTouches[0].clientY;
}
/**
 * detect weather the "old" touchPos is greater or smaller than the newTouchPos
 *
 * If the new touch position is greater than the old touch position, the finger is moving down.
 * If the new touch position is less than the old touch position, the finger is moving up.
 *
 * @param {TouchEvent} e - the event object
 */

function ontouchmoveEvent(e) {
  const newTouchPos = e.changedTouches[0].clientY;

  if (newTouchPos > this.touchPos.Y) {
    console.log('finger moving down');
  } else if (newTouchPos < this.touchPos.Y) {
    console.log('finger moving up');
  }
}

/***/ }),

/***/ "./src/styles/ssc.scss":
/*!*****************************!*\
  !*** ./src/styles/ssc.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/scrollmagic-plugins/index.js":
/*!***************************************************!*\
  !*** ./node_modules/scrollmagic-plugins/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScrollMagicPluginGsap": () => (/* binding */ ScrollMagicPluginGsap),
/* harmony export */   "ScrollMagicPluginIndicator": () => (/* binding */ ScrollMagicPluginIndicator),
/* harmony export */   "ScrollMagicPluginJQuery": () => (/* binding */ ScrollMagicPluginJQuery),
/* harmony export */   "ScrollMagicPluginVelocity": () => (/* binding */ ScrollMagicPluginVelocity)
/* harmony export */ });
/* harmony import */ var _plugins_animation_gsap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plugins/animation.gsap */ "./node_modules/scrollmagic-plugins/plugins/animation.gsap.js");
/* harmony import */ var _plugins_debug_addIndicator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugins/debug.addIndicator */ "./node_modules/scrollmagic-plugins/plugins/debug.addIndicator.js");
/* harmony import */ var _plugins_animation_velocity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plugins/animation.velocity */ "./node_modules/scrollmagic-plugins/plugins/animation.velocity.js");
/* harmony import */ var _plugins_selector_jquery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugins/selector.jquery */ "./node_modules/scrollmagic-plugins/plugins/selector.jquery.js");





const ScrollMagicPluginGsap = _plugins_animation_gsap__WEBPACK_IMPORTED_MODULE_0__["default"];
const ScrollMagicPluginIndicator = _plugins_debug_addIndicator__WEBPACK_IMPORTED_MODULE_1__["default"];
const ScrollMagicPluginVelocity = _plugins_animation_velocity__WEBPACK_IMPORTED_MODULE_2__["default"];
const ScrollMagicPluginJQuery = _plugins_selector_jquery__WEBPACK_IMPORTED_MODULE_3__["default"];


/***/ }),

/***/ "./node_modules/scrollmagic-plugins/plugins/animation.gsap.js":
/*!********************************************************************!*\
  !*** ./node_modules/scrollmagic-plugins/plugins/animation.gsap.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*!
 * @file ScrollMagic GSAP Plugin.
 *
 * @requires {@link http://greensock.com/gsap|GSAP ~1.14.x}
 * @mixin animation.GSAP
 */
function ScrollMagicPluginGsap(ScrollMagic, Tween, Timeline) {
  "use strict";
  var NAMESPACE = "animation.gsap";

  var
    console = window.console || {},
    err = Function.prototype.bind.call(console.error || console.log || function () { }, console);
  if (!ScrollMagic) {
    err("(" + NAMESPACE + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
  }
  if (!Tween) {
    err("(" + NAMESPACE + ") -> ERROR: TweenLite or TweenMax could not be found. Please make sure GSAP is loaded before ScrollMagic or use an asynchronous loader like requirejs.");
  }

  /*
  * ----------------------------------------------------------------
  * Extensions for Scene
  * ----------------------------------------------------------------
  */
  /**
   * Every instance of ScrollMagic.Scene now accepts an additional option.  
   * See {@link ScrollMagic.Scene} for a complete list of the standard options.
   * @memberof! animation.GSAP#
   * @method new ScrollMagic.Scene(options)
   * @example
   * var scene = new ScrollMagic.Scene({tweenChanges: true});
   *
   * @param {object} [options] - Options for the Scene. The options can be updated at any time.
   * @param {boolean} [options.tweenChanges=false] - Tweens Animation to the progress target instead of setting it.  
                            Does not affect animations where duration is `0`.
  */
  /**
   * **Get** or **Set** the tweenChanges option value.  
   * This only affects scenes with a duration. If `tweenChanges` is `true`, the progress update when scrolling will not be immediate, but instead the animation will smoothly animate to the target state.  
   * For a better understanding, try enabling and disabling this option in the [Scene Manipulation Example](../examples/basic/scene_manipulation.html).
   * @memberof! animation.GSAP#
   * @method Scene.tweenChanges
   * 
   * @example
   * // get the current tweenChanges option
   * var tweenChanges = scene.tweenChanges();
   *
   * // set new tweenChanges option
   * scene.tweenChanges(true);
   *
   * @fires {@link Scene.change}, when used as setter
   * @param {boolean} [newTweenChanges] - The new tweenChanges setting of the scene.
   * @returns {boolean} `get` -  Current tweenChanges option value.
   * @returns {Scene} `set` -  Parent object for chaining.
   */
  // add option (TODO: DOC (private for dev))
  ScrollMagic.Scene.addOption(
    "tweenChanges", // name
    false, // default
    function (val) { // validation callback
      return !!val;
    }
  );
  // extend scene
  ScrollMagic.Scene.extend(function () {
    var Scene = this,
      _tween;

    var log = function () {
      if (Scene._log) { // not available, when main source minified
        Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ")", "->");
        Scene._log.apply(this, arguments);
      }
    };

    // set listeners
    Scene.on("progress.plugin_gsap", function () {
      updateTweenProgress();
    });
    Scene.on("destroy.plugin_gsap", function (e) {
      Scene.removeTween(e.reset);
    });

    /**
     * Update the tween progress to current position.
     * @private
     */
    var updateTweenProgress = function () {
      if (_tween) {
        var
          progress = Scene.progress(),
          state = Scene.state();
        if (_tween.repeat && _tween.repeat() === -1) {
          // infinite loop, so not in relation to progress
          if (state === 'DURING' && _tween.paused()) {
            _tween.play();
          } else if (state !== 'DURING' && !_tween.paused()) {
            _tween.pause();
          }
        } else if (progress != _tween.progress()) { // do we even need to update the progress?
          // no infinite loop - so should we just play or go to a specific point in time?
          if (Scene.duration() === 0) {
            // play the animation
            if (progress > 0) { // play from 0 to 1
              _tween.play();
            } else { // play from 1 to 0
              _tween.reverse();
            }
          } else {
            // go to a specific point in time
            if (Scene.tweenChanges() && _tween.tweenTo) {
              // go smooth
              _tween.tweenTo(progress * _tween.duration());
            } else {
              // just hard set it
              _tween.progress(progress).pause();
            }
          }
        }
      }
    };

    /**
     * Add a tween to the scene.  
     * If you want to add multiple tweens, add them into a GSAP Timeline object and supply it instead (see example below).  
     * 
     * If the scene has a duration, the tween's duration will be projected to the scroll distance of the scene, meaning its progress will be synced to scrollbar movement.  
     * For a scene with a duration of `0`, the tween will be triggered when scrolling forward past the scene's trigger position and reversed, when scrolling back.  
     * To gain better understanding, check out the [Simple Tweening example](../examples/basic/simple_tweening.html).
     *
     * Instead of supplying a tween this method can also be used as a shorthand for `TweenMax.to()` (see example below).
     * @memberof! animation.GSAP#
     *
     * @example
     * // add a single tween directly
     * scene.setTween(TweenMax.to("obj"), 1, {x: 100});
     *
     * // add a single tween via variable
     * var tween = TweenMax.to("obj"), 1, {x: 100};
     * scene.setTween(tween);
     *
     * // add multiple tweens, wrapped in a timeline.
     * var timeline = new TimelineMax();
     * var tween1 = TweenMax.from("obj1", 1, {x: 100});
     * var tween2 = TweenMax.to("obj2", 1, {y: 100});
     * timeline
     *		.add(tween1)
    *		.add(tween2);
    * scene.addTween(timeline);
    *
    * // short hand to add a TweenMax.to() tween
    * scene.setTween("obj3", 0.5, {y: 100});
    *
    * // short hand to add a TweenMax.to() tween for 1 second
    * // this is useful, when the scene has a duration and the tween duration isn't important anyway
    * scene.setTween("obj3", {y: 100});
    *
    * @param {(object|string)} TweenObject - A TweenMax, TweenLite, TimelineMax or TimelineLite object that should be animated in the scene. Can also be a Dom Element or Selector, when using direct tween definition (see examples).
    * @param {(number|object)} duration - A duration for the tween, or tween parameters. If an object containing parameters are supplied, a default duration of 1 will be used.
    * @param {object} params - The parameters for the tween
    * @returns {Scene} Parent object for chaining.
    */
    Scene.setTween = function (TweenObject, duration, params) {
      var newTween;
      if (arguments.length > 1) {
        if (arguments.length < 3) {
          params = duration;
          duration = 1;
        }
        TweenObject = Tween.to(TweenObject, duration, params);
      }
      try {
        // wrap Tween into a Timeline Object if available to include delay and repeats in the duration and standardize methods.
        if (Timeline) {
          newTween = new Timeline({
            smoothChildTiming: true
          })
            .add(TweenObject);
        } else {
          newTween = TweenObject;
        }
        newTween.pause();
      } catch (e) {
        log(1, "ERROR calling method 'setTween()': Supplied argument is not a valid TweenObject");
        return Scene;
      }
      if (_tween) { // kill old tween?
        Scene.removeTween();
      }
      _tween = newTween;

      // some properties need to be transferred it to the wrapper, otherwise they would get lost.
      if (TweenObject.repeat && TweenObject.repeat() === -1) { // TweenMax or TimelineMax Object?
        _tween.repeat(-1);
        _tween.yoyo(TweenObject.yoyo());
      }
      // Some tween validations and debugging helpers

      if (Scene.tweenChanges() && !_tween.tweenTo) {
        log(2, "WARNING: tweenChanges will only work if the TimelineMax object is available for ScrollMagic.");
      }

      // check if there are position tweens defined for the trigger and warn about it :)
      if (_tween && Scene.controller() && Scene.triggerElement() && Scene.loglevel() >= 2) { // controller is needed to know scroll direction.
        var
          triggerTweens = Tween.getTweensOf(Scene.triggerElement()),
          vertical = Scene.controller().info("vertical");
        triggerTweens.forEach(function (value, index) {
          var
            tweenvars = value.vars.css || value.vars,
            condition = vertical ? (tweenvars.top !== undefined || tweenvars.bottom !== undefined) : (tweenvars.left !== undefined || tweenvars.right !== undefined);
          if (condition) {
            log(2, "WARNING: Tweening the position of the trigger element affects the scene timing and should be avoided!");
            return false;
          }
        });
      }

      // warn about tween overwrites, when an element is tweened multiple times
      if (parseFloat(Tween.version) >= 1.14) { // onOverwrite only present since GSAP v1.14.0
        var
          list = _tween.getChildren ? _tween.getChildren(true, true, false) : [_tween], // get all nested tween objects
          newCallback = function () {
            log(2, "WARNING: tween was overwritten by another. To learn how to avoid this issue see here: https://github.com/janpaepke/ScrollMagic/wiki/WARNING:-tween-was-overwritten-by-another");
          };
        for (var i = 0, thisTween, oldCallback; i < list.length; i++) {
          /*jshint loopfunc: true */
          thisTween = list[i];
          if (oldCallback !== newCallback) { // if tweens is added more than once
            oldCallback = thisTween.vars.onOverwrite;
            thisTween.vars.onOverwrite = function () {
              if (oldCallback) {
                oldCallback.apply(this, arguments);
              }
              newCallback.apply(this, arguments);
            };
          }
        }
      }
      log(3, "added tween");

      updateTweenProgress();
      return Scene;
    };

    /**
     * Remove the tween from the scene.  
     * This will terminate the control of the Scene over the tween.
     *
     * Using the reset option you can decide if the tween should remain in the current state or be rewound to set the target elements back to the state they were in before the tween was added to the scene.
     * @memberof! animation.GSAP#
     *
     * @example
     * // remove the tween from the scene without resetting it
     * scene.removeTween();
     *
     * // remove the tween from the scene and reset it to initial position
     * scene.removeTween(true);
     *
     * @param {boolean} [reset=false] - If `true` the tween will be reset to its initial values.
     * @returns {Scene} Parent object for chaining.
     */
    Scene.removeTween = function (reset) {
      if (_tween) {
        if (reset) {
          _tween.progress(0).pause();
        }
        _tween.kill();
        _tween = undefined;
        log(3, "removed tween (reset: " + (reset ? "true" : "false") + ")");
      }
      return Scene;
    };

  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollMagicPluginGsap);


/***/ }),

/***/ "./node_modules/scrollmagic-plugins/plugins/animation.velocity.js":
/*!************************************************************************!*\
  !*** ./node_modules/scrollmagic-plugins/plugins/animation.velocity.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*!
 * @file ScrollMagic Velocity Animation Plugin.
 *
 * requires: velocity ~1.2
 * Powered by VelocityJS: http://VelocityJS.org
 * Velocity is published under MIT license.
 */

function ScrollMagicPluginVelocity(ScrollMagic, velocity) {
  "use strict";
  var NAMESPACE = "animation.velocity";

  var
    console = window.console || {},
    err = Function.prototype.bind.call(console.error || console.log || function () { }, console);
  if (!ScrollMagic) {
    err("(" + NAMESPACE + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
  }
  if (!velocity) {
    err("(" + NAMESPACE + ") -> ERROR: Velocity could not be found. Please make sure it's loaded before ScrollMagic or use an asynchronous loader like requirejs.");
  }

  var autoindex = 0;

  ScrollMagic.Scene.extend(function () {
    var
      Scene = this,
      _util = ScrollMagic._util,
      _currentProgress = 0,
      _elems,
      _properties,
      _options,
      _dataID; // used to identify element data related to this scene, will be defined everytime a new velocity animation is added

    var log = function () {
      if (Scene._log) { // not available, when main source minified
        Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ")", "->");
        Scene._log.apply(this, arguments);
      }
    };

    // set listeners
    Scene.on("progress.plugin_velocity", function () {
      updateAnimationProgress();
    });
    Scene.on("destroy.plugin_velocity", function (e) {
      Scene.off("*.plugin_velocity");
      Scene.removeVelocity(e.reset);
    });

    var animate = function (elem, properties, options) {
      if (_util.type.Array(elem)) {
        elem.forEach(function (elem) {
          animate(elem, properties, options);
        });
      } else {
        // set reverse values
        if (!velocity.Utilities.data(elem, _dataID)) {
          velocity.Utilities.data(elem, _dataID, {
            reverseProps: _util.css(elem, Object.keys(_properties))
          });
        }
        // animate
        velocity(elem, properties, options);
        if (options.queue !== undefined) {
          velocity.Utilities.dequeue(elem, options.queue);
        }
      }
    };
    var reverse = function (elem, options) {
      if (_util.type.Array(elem)) {
        elem.forEach(function (elem) {
          reverse(elem, options);
        });
      } else {
        var data = velocity.Utilities.data(elem, _dataID);
        if (data && data.reverseProps) {
          velocity(elem, data.reverseProps, options);
          if (options.queue !== undefined) {
            velocity.Utilities.dequeue(elem, options.queue);
          }
        }
      }
    };

		/**
		 * Update the tween progress to current position.
		 * @private
		 */
    var updateAnimationProgress = function () {
      if (_elems) {
        var progress = Scene.progress();
        if (progress != _currentProgress) { // do we even need to update the progress?
          if (Scene.duration() === 0) {
            // play the animation
            if (progress > 0) { // play forward
              animate(_elems, _properties, _options);
            } else { // play reverse
              reverse(_elems, _options);
              // velocity(_elems, _propertiesReverse, _options);
              // velocity("reverse");
            }
          } else {
            // TODO: Scrollbound animations not supported yet...
          }
          _currentProgress = progress;
        }
      }
    };

		/**
		 * Add a Velocity animation to the scene.  
		 * The method accepts the same parameters as Velocity, with the first parameter being the target element.
		 *
		 * To gain better understanding, check out the [Velocity example](../examples/basic/simple_velocity.html).
		 * @memberof! animation.Velocity#
		 *
		 * @example
		 * // trigger a Velocity animation
		 * scene.setVelocity("#myElement", {opacity: 0.5}, {duration: 1000, easing: "linear"});
		 *
		 * @param {(object|string)} elems - One or more Dom Elements or a Selector that should be used as the target of the animation.
		 * @param {object} properties - The CSS properties that should be animated.
		 * @param {object} options - Options for the animation, like duration or easing.
		 * @returns {Scene} Parent object for chaining.
		 */
    Scene.setVelocity = function (elems, properties, options) {
      if (_elems) { // kill old ani?
        Scene.removeVelocity();
      }

      _elems = _util.get.elements(elems);
      _properties = properties || {};
      _options = options || {};
      _dataID = "ScrollMagic." + NAMESPACE + "[" + (autoindex++) + "]";

      if (_options.queue !== undefined) {
        // we'll use the queue to identify the animation. When defined it will always stop the previously running one.
        // if undefined the animation will always fully run, as is expected.
        // defining anything other than 'false' as the que doesn't make much sense, because ScrollMagic takes control over the trigger.
        // thus it is also overwritten.
        _options.queue = _dataID + "_queue";
      }

      var checkDuration = function () {
        if (Scene.duration() !== 0) {
          log(1, "ERROR: The Velocity animation plugin does not support scrollbound animations (scenes with duration) yet.");
        }
      };
      Scene.on("change.plugin_velocity", function (e) {
        if (e.what == 'duration') {
          checkDuration();
        }
      });
      checkDuration();
      log(3, "added animation");

      updateAnimationProgress();
      return Scene;
    };
		/**
		 * Remove the animation from the scene.  
		 * This will stop the scene from triggering the animation.
		 *
		 * Using the reset option you can decide if the animation should remain in the current state or be rewound to set the target elements back to the state they were in before the animation was added to the scene.
		 * @memberof! animation.Velocity#
		 *
		 * @example
		 * // remove the animation from the scene without resetting it
		 * scene.removeVelocity();
		 *
		 * // remove the animation from the scene and reset the elements to initial state
		 * scene.removeVelocity(true);
		 *
		 * @param {boolean} [reset=false] - If `true` the animation will rewound.
		 * @returns {Scene} Parent object for chaining.
		 */
    Scene.removeVelocity = function (reset) {
      if (_elems) {
        // stop running animations
        if (_options.queue !== undefined) {
          velocity(_elems, "stop", _options.queue);
        }
        if (reset) {
          reverse(_elems, {
            duration: 0
          });
        }

        _elems.forEach(function (elem) {
          velocity.Utilities.removeData(elem, _dataID);
        });
        _elems = _properties = _options = _dataID = undefined;
      }
      return Scene;
    };
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollMagicPluginVelocity);


/***/ }),

/***/ "./node_modules/scrollmagic-plugins/plugins/debug.addIndicator.js":
/*!************************************************************************!*\
  !*** ./node_modules/scrollmagic-plugins/plugins/debug.addIndicator.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*!
 * @file ScrollMagic Debug Indicator Plugin.
 */
/**
 * @mixin debug.addIndicators
 */
var ScrollMagicPluginIndicator = function (ScrollMagic) {
  'use strict';
  var NAMESPACE = 'debug.addIndicators';

  var
    console = window.console || {},
    err = Function.prototype.bind.call(console.error || console.log || function () { }, console);
  if (!ScrollMagic) {
    err('(' + NAMESPACE + ') -> ERROR: The ScrollMagic main module could not be found. Please make sure it\'s loaded before this plugin or use an asynchronous loader like requirejs.');
  }

  // plugin settings
  var
    FONT_SIZE = '0.85em',
    ZINDEX = '9999',
    EDGE_OFFSET = 15; // minimum edge distance, added to indentation

  // overall vars
  var
    _util = ScrollMagic._util,
    _autoindex = 0;



  ScrollMagic.Scene.extend(function () {
    var
      Scene = this,
      _indicator;

    var log = function () {
      if (Scene._log) { // not available, when main source minified
        Array.prototype.splice.call(arguments, 1, 0, '(' + NAMESPACE + ')', '->');
        Scene._log.apply(this, arguments);
      }
    };

		/**
		 * Add visual indicators for a ScrollMagic.Scene.  
		 * @memberof! debug.addIndicators#
		 *
		 * @example
		 * // add basic indicators
		 * scene.addIndicators()
		 *
		 * // passing options
		 * scene.addIndicators({name: "pin scene", colorEnd: "#FFFFFF"});
		 *
		 * @param {object} [options] - An object containing one or more options for the indicators.
		 * @param {(string|object)} [options.parent] - A selector, DOM Object or a jQuery object that the indicators should be added to.  
		 														 														 If undefined, the controller's container will be used.
		 * @param {number} [options.name=""] - This string will be displayed at the start and end indicators of the scene for identification purposes. If no name is supplied an automatic index will be used.
		 * @param {number} [options.indent=0] - Additional position offset for the indicators (useful, when having multiple scenes starting at the same position).
		 * @param {string} [options.colorStart=green] - CSS color definition for the start indicator.
		 * @param {string} [options.colorEnd=red] - CSS color definition for the end indicator.
		 * @param {string} [options.colorTrigger=blue] - CSS color definition for the trigger indicator.
		 */
    Scene.addIndicators = function (options) {
      if (!_indicator) {
        var
          DEFAULT_OPTIONS = {
            name: '',
            indent: 0,
            parent: undefined,
            colorStart: 'green',
            colorEnd: 'red',
            colorTrigger: 'blue',
          };

        options = _util.extend({}, DEFAULT_OPTIONS, options);

        _autoindex++;
        _indicator = new Indicator(Scene, options);

        Scene.on('add.plugin_addIndicators', _indicator.add);
        Scene.on('remove.plugin_addIndicators', _indicator.remove);
        Scene.on('destroy.plugin_addIndicators', Scene.removeIndicators);

        // it the scene already has a controller we can start right away.
        if (Scene.controller()) {
          _indicator.add();
        }
      }
      return Scene;
    };

		/**
		 * Removes visual indicators from a ScrollMagic.Scene.
		 * @memberof! debug.addIndicators#
		 *
		 * @example
		 * // remove previously added indicators
		 * scene.removeIndicators()
		 *
		 */
    Scene.removeIndicators = function () {
      if (_indicator) {
        _indicator.remove();
        this.off('*.plugin_addIndicators');
        _indicator = undefined;
      }
      return Scene;
    };

  });


	/*
	 * ----------------------------------------------------------------
	 * Extension for controller to store and update related indicators
	 * ----------------------------------------------------------------
	 */
  // add option to globally auto-add indicators to scenes
	/**
	 * Every ScrollMagic.Controller instance now accepts an additional option.  
	 * See {@link ScrollMagic.Controller} for a complete list of the standard options.
	 * @memberof! debug.addIndicators#
	 * @method new ScrollMagic.Controller(options)
	 * @example
	 * // make a controller and add indicators to all scenes attached
	 * var controller = new ScrollMagic.Controller({addIndicators: true});
	 * // this scene will automatically have indicators added to it
	 * new ScrollMagic.Scene()
	 *                .addTo(controller);
	 *
	 * @param {object} [options] - Options for the Controller.
	 * @param {boolean} [options.addIndicators=false] - If set to `true` every scene that is added to the controller will automatically get indicators added to it.
	 */
  ScrollMagic.Controller.addOption('addIndicators', false);
  // extend Controller
  ScrollMagic.Controller.extend(function () {
    var
      Controller = this,
      _info = Controller.info(),
      _container = _info.container,
      _isDocument = _info.isDocument,
      _vertical = _info.vertical,
      _indicators = { // container for all indicators and methods
        groups: [],
      };

    var log = function () {
      if (Controller._log) { // not available, when main source minified
        Array.prototype.splice.call(arguments, 1, 0, '(' + NAMESPACE + ')', '->');
        Controller._log.apply(this, arguments);
      }
    };
    if (Controller._indicators) {
      log(2, 'WARNING: Scene already has a property \'_indicators\', which will be overwritten by plugin.');
    }

    // add indicators container
    this._indicators = _indicators;
		/*
			needed updates:
			+++++++++++++++
			start/end position on scene shift (handled in Indicator class)
			trigger parameters on triggerHook value change (handled in Indicator class)
			bounds position on container scroll or resize (to keep alignment to bottom/right)
			trigger position on container resize, window resize (if container isn't document) and window scroll (if container isn't document)
		*/

    // event handler for when associated bounds markers need to be repositioned
    var handleBoundsPositionChange = function () {
      _indicators.updateBoundsPositions();
    };

    // event handler for when associated trigger groups need to be repositioned
    var handleTriggerPositionChange = function () {
      _indicators.updateTriggerGroupPositions();
    };

    _container.addEventListener('resize', handleTriggerPositionChange);
    if (!_isDocument) {
      window.addEventListener('resize', handleTriggerPositionChange);
      window.addEventListener('scroll', handleTriggerPositionChange);
    }
    // update all related bounds containers
    _container.addEventListener('resize', handleBoundsPositionChange);
    _container.addEventListener('scroll', handleBoundsPositionChange);


    // updates the position of the bounds container to aligned to the right for vertical containers and to the bottom for horizontal
    this._indicators.updateBoundsPositions = function (specificIndicator) {
      var // constant for all bounds
        groups = specificIndicator ? [_util.extend({}, specificIndicator.triggerGroup, {
          members: [specificIndicator],
        })] : // create a group with only one element
          _indicators.groups, // use all
        g = groups.length,
        css = {},
        paramPos = _vertical ? 'left' : 'top',
        paramDimension = _vertical ? 'width' : 'height',
        edge = _vertical ?
          _util.get.scrollLeft(_container) + _util.get.width(_container) - EDGE_OFFSET :
          _util.get.scrollTop(_container) + _util.get.height(_container) - EDGE_OFFSET,
        b, triggerSize, group;
      while (g--) { // group loop
        group = groups[g];
        b = group.members.length;
        triggerSize = _util.get[paramDimension](group.element.firstChild);
        while (b--) { // indicators loop
          css[paramPos] = edge - triggerSize;
          _util.css(group.members[b].bounds, css);
        }
      }
    };

    // updates the positions of all trigger groups attached to a controller or a specific one, if provided
    this._indicators.updateTriggerGroupPositions = function (specificGroup) {
      var // constant vars
        groups = specificGroup ? [specificGroup] : _indicators.groups,
        i = groups.length,
        container = _isDocument ? document.body : _container,
        containerOffset = _isDocument ? {
          top: 0,
          left: 0,
        } : _util.get.offset(container, true),
        edge = _vertical ?
          _util.get.width(_container) - EDGE_OFFSET :
          _util.get.height(_container) - EDGE_OFFSET,
        paramDimension = _vertical ? 'width' : 'height',
        paramTransform = _vertical ? 'Y' : 'X';
      var // changing vars
        group,
        elem,
        pos,
        elemSize,
        transform;
      while (i--) {
        group = groups[i];
        elem = group.element;
        pos = group.triggerHook * Controller.info('size');
        elemSize = _util.get[paramDimension](elem.firstChild.firstChild);
        transform = pos > elemSize ? 'translate' + paramTransform + '(-100%)' : '';

        _util.css(elem, {
          top: containerOffset.top + (_vertical ? pos : edge - group.members[0].options.indent),
          left: containerOffset.left + (_vertical ? edge - group.members[0].options.indent : pos),
        });
        _util.css(elem.firstChild.firstChild, {
          '-ms-transform': transform,
          '-webkit-transform': transform,
          'transform': transform,
        });
      }
    };

    // updates the label for the group to contain the name, if it only has one member
    this._indicators.updateTriggerGroupLabel = function (group) {
      var
        text = 'trigger' + (group.members.length > 1 ? '' : ' ' + group.members[0].options.name),
        elem = group.element.firstChild.firstChild,
        doUpdate = elem.textContent !== text;
      if (doUpdate) {
        elem.textContent = text;
        if (_vertical) { // bounds position is dependent on text length, so update
          _indicators.updateBoundsPositions();
        }
      }
    };

    // add indicators if global option is set
    this.addScene = function (newScene) {

      if (this._options.addIndicators && newScene instanceof ScrollMagic.Scene && newScene.controller() === Controller) {
        newScene.addIndicators();
      }
      // call original destroy method
      this.$super.addScene.apply(this, arguments);
    };

    // remove all previously set listeners on destroy
    this.destroy = function () {
      _container.removeEventListener('resize', handleTriggerPositionChange);
      if (!_isDocument) {
        window.removeEventListener('resize', handleTriggerPositionChange);
        window.removeEventListener('scroll', handleTriggerPositionChange);
      }
      _container.removeEventListener('resize', handleBoundsPositionChange);
      _container.removeEventListener('scroll', handleBoundsPositionChange);
      // call original destroy method
      this.$super.destroy.apply(this, arguments);
    };
    return Controller;

  });

	/*
	 * ----------------------------------------------------------------
	 * Internal class for the construction of Indicators
	 * ----------------------------------------------------------------
	 */
  var Indicator = function (Scene, options) {
    var
      Indicator = this,
      _elemBounds = TPL.bounds(),
      _elemStart = TPL.start(options.colorStart),
      _elemEnd = TPL.end(options.colorEnd),
      _boundsContainer = options.parent && _util.get.elements(options.parent)[0],
      _vertical,
      _ctrl;

    var log = function () {
      if (Scene._log) { // not available, when main source minified
        Array.prototype.splice.call(arguments, 1, 0, '(' + NAMESPACE + ')', '->');
        Scene._log.apply(this, arguments);
      }
    };

    options.name = options.name || _autoindex;

    // prepare bounds elements
    _elemStart.firstChild.textContent += ' ' + options.name;
    _elemEnd.textContent += ' ' + options.name;
    _elemBounds.appendChild(_elemStart);
    _elemBounds.appendChild(_elemEnd);

    // set public variables
    Indicator.options = options;
    Indicator.bounds = _elemBounds;
    // will be set later
    Indicator.triggerGroup = undefined;

    // add indicators to DOM
    this.add = function () {
      _ctrl = Scene.controller();
      _vertical = _ctrl.info('vertical');

      var isDocument = _ctrl.info('isDocument');

      if (!_boundsContainer) {
        // no parent supplied or doesnt exist
        _boundsContainer = isDocument ? document.body : _ctrl.info('container'); // check if window/document (then use body)
      }
      if (!isDocument && _util.css(_boundsContainer, 'position') === 'static') {
        // position mode needed for correct positioning of indicators
        _util.css(_boundsContainer, {
          position: 'relative',
        });
      }

      // add listeners for updates
      Scene.on('change.plugin_addIndicators', handleTriggerParamsChange);
      Scene.on('shift.plugin_addIndicators', handleBoundsParamsChange);

      // updates trigger & bounds (will add elements if needed)
      updateTriggerGroup();
      updateBounds();

      setTimeout(function () { // do after all execution is finished otherwise sometimes size calculations are off
        _ctrl._indicators.updateBoundsPositions(Indicator);
      }, 0);

      log(3, 'added indicators');
    };

    // remove indicators from DOM
    this.remove = function () {
      if (Indicator.triggerGroup) { // if not set there's nothing to remove
        Scene.off('change.plugin_addIndicators', handleTriggerParamsChange);
        Scene.off('shift.plugin_addIndicators', handleBoundsParamsChange);

        if (Indicator.triggerGroup.members.length > 1) {
          // just remove from memberlist of old group
          var group = Indicator.triggerGroup;
          group.members.splice(group.members.indexOf(Indicator), 1);
          _ctrl._indicators.updateTriggerGroupLabel(group);
          _ctrl._indicators.updateTriggerGroupPositions(group);
          Indicator.triggerGroup = undefined;
        } else {
          // remove complete group
          removeTriggerGroup();
        }
        removeBounds();

        log(3, 'removed indicators');
      }
    };

		/*
		 * ----------------------------------------------------------------
		 * internal Event Handlers
		 * ----------------------------------------------------------------
		 */

    // event handler for when bounds params change
    var handleBoundsParamsChange = function () {
      updateBounds();
    };

    // event handler for when trigger params change
    var handleTriggerParamsChange = function (e) {
      if (e.what === 'triggerHook') {
        updateTriggerGroup();
      }
    };

		/*
		 * ----------------------------------------------------------------
		 * Bounds (start / stop) management
		 * ----------------------------------------------------------------
		 */

    // adds an new bounds elements to the array and to the DOM
    var addBounds = function () {
      var v = _ctrl.info('vertical');
      // apply stuff we didn't know before...
      _util.css(_elemStart.firstChild, {
        'border-bottom-width': v ? 1 : 0,
        'border-right-width': v ? 0 : 1,
        'bottom': v ? -1 : options.indent,
        'right': v ? options.indent : -1,
        'padding': v ? '0 8px' : '2px 4px',
      });
      _util.css(_elemEnd, {
        'border-top-width': v ? 1 : 0,
        'border-left-width': v ? 0 : 1,
        'top': v ? '100%' : '',
        'right': v ? options.indent : '',
        'bottom': v ? '' : options.indent,
        'left': v ? '' : '100%',
        'padding': v ? '0 8px' : '2px 4px',
      });
      // append
      _boundsContainer.appendChild(_elemBounds);
    };

    // remove bounds from list and DOM
    var removeBounds = function () {
      _elemBounds.parentNode.removeChild(_elemBounds);
    };

    // update the start and end positions of the scene
    var updateBounds = function () {
      if (_elemBounds.parentNode !== _boundsContainer) {
        addBounds(); // Add Bounds elements (start/end)
      }
      var css = {};
      css[_vertical ? 'top' : 'left'] = Scene.triggerPosition();
      css[_vertical ? 'height' : 'width'] = Scene.duration();
      _util.css(_elemBounds, css);
      _util.css(_elemEnd, {
        display: Scene.duration() > 0 ? '' : 'none',
      });
    };

		/*
		 * ----------------------------------------------------------------
		 * trigger and trigger group management
		 * ----------------------------------------------------------------
		 */

    // adds an new trigger group to the array and to the DOM
    var addTriggerGroup = function () {
      var triggerElem = TPL.trigger(options.colorTrigger); // new trigger element
      var css = {};
      css[_vertical ? 'right' : 'bottom'] = 0;
      css[_vertical ? 'border-top-width' : 'border-left-width'] = 1;
      _util.css(triggerElem.firstChild, css);
      _util.css(triggerElem.firstChild.firstChild, {
        padding: _vertical ? '0 8px 3px 8px' : '3px 4px',
      });
      document.body.appendChild(triggerElem); // directly add to body
      var newGroup = {
        triggerHook: Scene.triggerHook(),
        element: triggerElem,
        members: [Indicator],
      };
      _ctrl._indicators.groups.push(newGroup);
      Indicator.triggerGroup = newGroup;
      // update right away
      _ctrl._indicators.updateTriggerGroupLabel(newGroup);
      _ctrl._indicators.updateTriggerGroupPositions(newGroup);
    };

    var removeTriggerGroup = function () {
      _ctrl._indicators.groups.splice(_ctrl._indicators.groups.indexOf(Indicator.triggerGroup), 1);
      Indicator.triggerGroup.element.parentNode.removeChild(Indicator.triggerGroup.element);
      Indicator.triggerGroup = undefined;
    };

    // updates the trigger group -> either join existing or add new one
		/*	
		 * Logic:
		 * 1 if a trigger group exist, check if it's in sync with Scene settings – if so, nothing else needs to happen
		 * 2 try to find an existing one that matches Scene parameters
		 * 	 2.1 If a match is found check if already assigned to an existing group
		 *			 If so:
		 *       A: it was the last member of existing group -> kill whole group
		 *       B: the existing group has other members -> just remove from member list
		 *	 2.2 Assign to matching group
		 * 3 if no new match could be found, check if assigned to existing group
		 *   A: yes, and it's the only member -> just update parameters and positions and keep using this group
		 *   B: yes but there are other members -> remove from member list and create a new one
		 *   C: no, so create a new one
		 */
    var updateTriggerGroup = function () {
      var
        triggerHook = Scene.triggerHook(),
        closeEnough = 0.0001;

      // Have a group, check if it still matches
      if (Indicator.triggerGroup) {
        if (Math.abs(Indicator.triggerGroup.triggerHook - triggerHook) < closeEnough) {
          // _util.log(0, "trigger", options.name, "->", "no need to change, still in sync");
          return; // all good
        }
      }
      // Don't have a group, check if a matching one exists
      // _util.log(0, "trigger", options.name, "->", "out of sync!");
      var
        groups = _ctrl._indicators.groups,
        group,
        i = groups.length;
      while (i--) {
        group = groups[i];
        if (Math.abs(group.triggerHook - triggerHook) < closeEnough) {
          // found a match!
          // _util.log(0, "trigger", options.name, "->", "found match");
          if (Indicator.triggerGroup) { // do I have an old group that is out of sync?
            if (Indicator.triggerGroup.members.length === 1) { // is it the only remaining group?
              // _util.log(0, "trigger", options.name, "->", "kill");
              // was the last member, remove the whole group
              removeTriggerGroup();
            } else {
              Indicator.triggerGroup.members.splice(Indicator.triggerGroup.members.indexOf(Indicator), 1); // just remove from memberlist of old group
              _ctrl._indicators.updateTriggerGroupLabel(Indicator.triggerGroup);
              _ctrl._indicators.updateTriggerGroupPositions(Indicator.triggerGroup);
              // _util.log(0, "trigger", options.name, "->", "removing from previous member list");
            }
          }
          // join new group
          group.members.push(Indicator);
          Indicator.triggerGroup = group;
          _ctrl._indicators.updateTriggerGroupLabel(group);
          return;
        }
      }

      // at this point I am obviously out of sync and don't match any other group
      if (Indicator.triggerGroup) {
        if (Indicator.triggerGroup.members.length === 1) {
          // _util.log(0, "trigger", options.name, "->", "updating existing");
          // out of sync but i'm the only member => just change and update
          Indicator.triggerGroup.triggerHook = triggerHook;
          _ctrl._indicators.updateTriggerGroupPositions(Indicator.triggerGroup);
          return;
        } else {
          // _util.log(0, "trigger", options.name, "->", "removing from previous member list");
          Indicator.triggerGroup.members.splice(Indicator.triggerGroup.members.indexOf(Indicator), 1); // just remove from memberlist of old group
          _ctrl._indicators.updateTriggerGroupLabel(Indicator.triggerGroup);
          _ctrl._indicators.updateTriggerGroupPositions(Indicator.triggerGroup);
          Indicator.triggerGroup = undefined; // need a brand new group...
        }
      }
      // _util.log(0, "trigger", options.name, "->", "add a new one");
      // did not find any match, make new trigger group
      addTriggerGroup();
    };
  };

	/*
	 * ----------------------------------------------------------------
	 * Templates for the indicators
	 * ----------------------------------------------------------------
	 */
  var TPL = {
    start: function (color) {
      // inner element (for bottom offset -1, while keeping top position 0)
      var inner = document.createElement('div');
      inner.textContent = 'start';
      _util.css(inner, {
        position: 'absolute',
        overflow: 'visible',
        'border-width': 0,
        'border-style': 'solid',
        color: color,
        'border-color': color,
      });
      var e = document.createElement('div');
      // wrapper
      _util.css(e, {
        position: 'absolute',
        overflow: 'visible',
        width: 0,
        height: 0,
      });
      e.appendChild(inner);
      return e;
    },
    end: function (color) {
      var e = document.createElement('div');
      e.textContent = 'end';
      _util.css(e, {
        position: 'absolute',
        overflow: 'visible',
        'border-width': 0,
        'border-style': 'solid',
        color: color,
        'border-color': color,
      });
      return e;
    },
    bounds: function () {
      var e = document.createElement('div');
      _util.css(e, {
        position: 'absolute',
        overflow: 'visible',
        'white-space': 'nowrap',
        'pointer-events': 'none',
        'font-size': FONT_SIZE,
      });
      e.style.zIndex = ZINDEX;
      return e;
    },
    trigger: function (color) {
      // inner to be above or below line but keep position
      var inner = document.createElement('div');
      inner.textContent = 'trigger';
      _util.css(inner, {
        position: 'relative',
      });
      // inner wrapper for right: 0 and main element has no size
      var w = document.createElement('div');
      _util.css(w, {
        position: 'absolute',
        overflow: 'visible',
        'border-width': 0,
        'border-style': 'solid',
        color: color,
        'border-color': color,
      });
      w.appendChild(inner);
      // wrapper
      var e = document.createElement('div');
      _util.css(e, {
        position: 'fixed',
        overflow: 'visible',
        'white-space': 'nowrap',
        'pointer-events': 'none',
        'font-size': FONT_SIZE,
      });
      e.style.zIndex = ZINDEX;
      e.appendChild(w);
      return e;
    },
  };
};

// module.exports = { ScrollMagicPluginIndicator: ScrollMagicPluginIndicator };
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollMagicPluginIndicator);


/***/ }),

/***/ "./node_modules/scrollmagic-plugins/plugins/selector.jquery.js":
/*!*********************************************************************!*\
  !*** ./node_modules/scrollmagic-plugins/plugins/selector.jquery.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*!
 * @file ScrollMagic jQuery plugin.
 *
 * requires: jQuery >=1.11
 */
function ScrollMagicPluginJQuery(ScrollMagic, $) {
  "use strict";
  var NAMESPACE = "jquery.ScrollMagic";

  var
    console = window.console || {},
    err = Function.prototype.bind.call(console.error || console.log || function () { }, console);
  if (!ScrollMagic) {
    err("(" + NAMESPACE + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
  }
  if (!$) {
    err("(" + NAMESPACE + ") -> ERROR: jQuery could not be found. Please make sure it's loaded before ScrollMagic or use an asynchronous loader like requirejs.");
  }

  ScrollMagic._util.get.elements = function (selector) {
    return $(selector).toArray();
  };
  ScrollMagic._util.addClass = function (elem, classname) {
    $(elem).addClass(classname);
  };
  ScrollMagic._util.removeClass = function (elem, classname) {
    $(elem).removeClass(classname);
  };
  $.ScrollMagic = ScrollMagic;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollMagicPluginJQuery);


/***/ }),

/***/ "./node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js":
/*!**************************************************************************!*\
  !*** ./node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js ***!
  \**************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * ScrollMagic v2.0.8 (2020-08-14)
 * The javascript library for magical scroll interactions.
 * (c) 2020 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.8
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic main library.
 */
/**
 * @namespace ScrollMagic
 */
(function (root, factory) {
	if (true) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}(this, function () {
	"use strict";

	var ScrollMagic = function () {
		_util.log(2, '(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use \'new ScrollMagic.Controller()\' to create a new controller instance. Use \'new ScrollMagic.Scene()\' to instance a scene.');
	};

	ScrollMagic.version = "2.0.8";

	// TODO: temporary workaround for chrome's scroll jitter bug
	if (typeof (window) !== 'undefined') {
		window.addEventListener("mousewheel", void(0));
	}

	// global const
	var PIN_SPACER_ATTRIBUTE = "data-scrollmagic-pin-spacer";

	/**
	 * The main class that is needed once per scroll container.
	 *
	 * @class
	 *
	 * @example
	 * // basic initialization
	 * var controller = new ScrollMagic.Controller();
	 *
	 * // passing options
	 * var controller = new ScrollMagic.Controller({container: "#myContainer", loglevel: 3});
	 *
	 * @param {object} [options] - An object containing one or more options for the controller.
	 * @param {(string|object)} [options.container=window] - A selector, DOM object that references the main container for scrolling.
	 * @param {boolean} [options.vertical=true] - Sets the scroll mode to vertical (`true`) or horizontal (`false`) scrolling.
	 * @param {object} [options.globalSceneOptions={}] - These options will be passed to every Scene that is added to the controller using the addScene method. For more information on Scene options see {@link ScrollMagic.Scene}.
	 * @param {number} [options.loglevel=2] Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
											 ** `0` => silent
											 ** `1` => errors
											 ** `2` => errors, warnings
											 ** `3` => errors, warnings, debuginfo
	 * @param {boolean} [options.refreshInterval=100] - Some changes don't call events by default, like changing the container size or moving a scene trigger element.  
	 																										 This interval polls these parameters to fire the necessary events.  
	 																										 If you don't use custom containers, trigger elements or have static layouts, where the positions of the trigger elements don't change, you can set this to 0 disable interval checking and improve performance.
	 *
	 */
	ScrollMagic.Controller = function (options) {
		/*
		 * ----------------------------------------------------------------
		 * settings
		 * ----------------------------------------------------------------
		 */
		var
			NAMESPACE = 'ScrollMagic.Controller',
			SCROLL_DIRECTION_FORWARD = 'FORWARD',
			SCROLL_DIRECTION_REVERSE = 'REVERSE',
			SCROLL_DIRECTION_PAUSED = 'PAUSED',
			DEFAULT_OPTIONS = CONTROLLER_OPTIONS.defaults;

		/*
		 * ----------------------------------------------------------------
		 * private vars
		 * ----------------------------------------------------------------
		 */
		var
			Controller = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_sceneObjects = [],
			_updateScenesOnNextCycle = false, // can be boolean (true => all scenes) or an array of scenes to be updated
			_scrollPos = 0,
			_scrollDirection = SCROLL_DIRECTION_PAUSED,
			_isDocument = true,
			_viewPortSize = 0,
			_enabled = true,
			_updateTimeout,
			_refreshTimeout;

		/*
		 * ----------------------------------------------------------------
		 * private functions
		 * ----------------------------------------------------------------
		 */

		/**
		 * Internal constructor function of the ScrollMagic Controller
		 * @private
		 */
		var construct = function () {
			for (var key in _options) {
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			_options.container = _util.get.elements(_options.container)[0];
			// check ScrollContainer
			if (!_options.container) {
				log(1, "ERROR creating object " + NAMESPACE + ": No valid scroll container supplied");
				throw NAMESPACE + " init failed."; // cancel
			}
			_isDocument = _options.container === window || _options.container === document.body || !document.body.contains(_options.container);
			// normalize to window
			if (_isDocument) {
				_options.container = window;
			}
			// update container size immediately
			_viewPortSize = getViewportSize();
			// set event handlers
			_options.container.addEventListener("resize", onChange);
			_options.container.addEventListener("scroll", onChange);

			var ri = parseInt(_options.refreshInterval, 10);
			_options.refreshInterval = _util.type.Number(ri) ? ri : DEFAULT_OPTIONS.refreshInterval;
			scheduleRefresh();

			log(3, "added new " + NAMESPACE + " controller (v" + ScrollMagic.version + ")");
		};

		/**
		 * Schedule the next execution of the refresh function
		 * @private
		 */
		var scheduleRefresh = function () {
			if (_options.refreshInterval > 0) {
				_refreshTimeout = window.setTimeout(refresh, _options.refreshInterval);
			}
		};

		/**
		 * Default function to get scroll pos - overwriteable using `Controller.scrollPos(newFunction)`
		 * @private
		 */
		var getScrollPos = function () {
			return _options.vertical ? _util.get.scrollTop(_options.container) : _util.get.scrollLeft(_options.container);
		};

		/**
		 * Returns the current viewport Size (width vor horizontal, height for vertical)
		 * @private
		 */
		var getViewportSize = function () {
			return _options.vertical ? _util.get.height(_options.container) : _util.get.width(_options.container);
		};

		/**
		 * Default function to set scroll pos - overwriteable using `Controller.scrollTo(newFunction)`
		 * Make available publicly for pinned mousewheel workaround.
		 * @private
		 */
		var setScrollPos = this._setScrollPos = function (pos) {
			if (_options.vertical) {
				if (_isDocument) {
					window.scrollTo(_util.get.scrollLeft(), pos);
				} else {
					_options.container.scrollTop = pos;
				}
			} else {
				if (_isDocument) {
					window.scrollTo(pos, _util.get.scrollTop());
				} else {
					_options.container.scrollLeft = pos;
				}
			}
		};

		/**
		 * Handle updates in cycles instead of on scroll (performance)
		 * @private
		 */
		var updateScenes = function () {
			if (_enabled && _updateScenesOnNextCycle) {
				// determine scenes to update
				var scenesToUpdate = _util.type.Array(_updateScenesOnNextCycle) ? _updateScenesOnNextCycle : _sceneObjects.slice(0);
				// reset scenes
				_updateScenesOnNextCycle = false;
				var oldScrollPos = _scrollPos;
				// update scroll pos now instead of onChange, as it might have changed since scheduling (i.e. in-browser smooth scroll)
				_scrollPos = Controller.scrollPos();
				var deltaScroll = _scrollPos - oldScrollPos;
				if (deltaScroll !== 0) { // scroll position changed?
					_scrollDirection = (deltaScroll > 0) ? SCROLL_DIRECTION_FORWARD : SCROLL_DIRECTION_REVERSE;
				}
				// reverse order of scenes if scrolling reverse
				if (_scrollDirection === SCROLL_DIRECTION_REVERSE) {
					scenesToUpdate.reverse();
				}
				// update scenes
				scenesToUpdate.forEach(function (scene, index) {
					log(3, "updating Scene " + (index + 1) + "/" + scenesToUpdate.length + " (" + _sceneObjects.length + " total)");
					scene.update(true);
				});
				if (scenesToUpdate.length === 0 && _options.loglevel >= 3) {
					log(3, "updating 0 Scenes (nothing added to controller)");
				}
			}
		};

		/**
		 * Initializes rAF callback
		 * @private
		 */
		var debounceUpdate = function () {
			_updateTimeout = _util.rAF(updateScenes);
		};

		/**
		 * Handles Container changes
		 * @private
		 */
		var onChange = function (e) {
			log(3, "event fired causing an update:", e.type);
			if (e.type == "resize") {
				// resize
				_viewPortSize = getViewportSize();
				_scrollDirection = SCROLL_DIRECTION_PAUSED;
			}
			// schedule update
			if (_updateScenesOnNextCycle !== true) {
				_updateScenesOnNextCycle = true;
				debounceUpdate();
			}
		};

		var refresh = function () {
			if (!_isDocument) {
				// simulate resize event. Only works for viewport relevant param (performance)
				if (_viewPortSize != getViewportSize()) {
					var resizeEvent;
					try {
						resizeEvent = new Event('resize', {
							bubbles: false,
							cancelable: false
						});
					} catch (e) { // stupid IE
						resizeEvent = document.createEvent("Event");
						resizeEvent.initEvent("resize", false, false);
					}
					_options.container.dispatchEvent(resizeEvent);
				}
			}
			_sceneObjects.forEach(function (scene, index) { // refresh all scenes
				scene.refresh();
			});
			scheduleRefresh();
		};

		/**
		 * Send a debug message to the console.
		 * provided publicly with _log for plugins
		 * @private
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */
		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};
		// for scenes we have getters for each option, but for the controller we don't, so we need to make it available externally for plugins
		this._options = _options;

		/**
		 * Sort scenes in ascending order of their start offset.
		 * @private
		 *
		 * @param {array} ScenesArray - an array of ScrollMagic Scenes that should be sorted
		 * @return {array} The sorted array of Scenes.
		 */
		var sortScenes = function (ScenesArray) {
			if (ScenesArray.length <= 1) {
				return ScenesArray;
			} else {
				var scenes = ScenesArray.slice(0);
				scenes.sort(function (a, b) {
					return a.scrollOffset() > b.scrollOffset() ? 1 : -1;
				});
				return scenes;
			}
		};

		/**
		 * ----------------------------------------------------------------
		 * public functions
		 * ----------------------------------------------------------------
		 */

		/**
		 * Add one ore more scene(s) to the controller.  
		 * This is the equivalent to `Scene.addTo(controller)`.
		 * @public
		 * @example
		 * // with a previously defined scene
		 * controller.addScene(scene);
		 *
		 * // with a newly created scene.
		 * controller.addScene(new ScrollMagic.Scene({duration : 0}));
		 *
		 * // adding multiple scenes
		 * controller.addScene([scene, scene2, new ScrollMagic.Scene({duration : 0})]);
		 *
		 * @param {(ScrollMagic.Scene|array)} newScene - ScrollMagic Scene or Array of Scenes to be added to the controller.
		 * @return {Controller} Parent object for chaining.
		 */
		this.addScene = function (newScene) {
			if (_util.type.Array(newScene)) {
				newScene.forEach(function (scene, index) {
					Controller.addScene(scene);
				});
			} else if (newScene instanceof ScrollMagic.Scene) {
				if (newScene.controller() !== Controller) {
					newScene.addTo(Controller);
				} else if (_sceneObjects.indexOf(newScene) < 0) {
					// new scene
					_sceneObjects.push(newScene); // add to array
					_sceneObjects = sortScenes(_sceneObjects); // sort
					newScene.on("shift.controller_sort", function () { // resort whenever scene moves
						_sceneObjects = sortScenes(_sceneObjects);
					});
					// insert Global defaults.
					for (var key in _options.globalSceneOptions) {
						if (newScene[key]) {
							newScene[key].call(newScene, _options.globalSceneOptions[key]);
						}
					}
					log(3, "adding Scene (now " + _sceneObjects.length + " total)");
				}
			} else {
				log(1, "ERROR: invalid argument supplied for '.addScene()'");
			}
			return Controller;
		};

		/**
		 * Remove one ore more scene(s) from the controller.  
		 * This is the equivalent to `Scene.remove()`.
		 * @public
		 * @example
		 * // remove a scene from the controller
		 * controller.removeScene(scene);
		 *
		 * // remove multiple scenes from the controller
		 * controller.removeScene([scene, scene2, scene3]);
		 *
		 * @param {(ScrollMagic.Scene|array)} Scene - ScrollMagic Scene or Array of Scenes to be removed from the controller.
		 * @returns {Controller} Parent object for chaining.
		 */
		this.removeScene = function (Scene) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.removeScene(scene);
				});
			} else {
				var index = _sceneObjects.indexOf(Scene);
				if (index > -1) {
					Scene.off("shift.controller_sort");
					_sceneObjects.splice(index, 1);
					log(3, "removing Scene (now " + _sceneObjects.length + " left)");
					Scene.remove();
				}
			}
			return Controller;
		};

		/**
	 * Update one ore more scene(s) according to the scroll position of the container.  
	 * This is the equivalent to `Scene.update()`.  
	 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
	 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.  
	 * _**Note:** This method gets called constantly whenever Controller detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
	 * @public
	 * @example
	 * // update a specific scene on next cycle
 	 * controller.updateScene(scene);
 	 *
	 * // update a specific scene immediately
	 * controller.updateScene(scene, true);
 	 *
	 * // update multiple scenes scene on next cycle
	 * controller.updateScene([scene1, scene2, scene3]);
	 *
	 * @param {ScrollMagic.Scene} Scene - ScrollMagic Scene or Array of Scenes that is/are supposed to be updated.
	 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle.  
	 										  This is useful when changing multiple properties of the scene - this way it will only be updated once all new properties are set (updateScenes).
	 * @return {Controller} Parent object for chaining.
	 */
		this.updateScene = function (Scene, immediately) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.updateScene(scene, immediately);
				});
			} else {
				if (immediately) {
					Scene.update(true);
				} else if (_updateScenesOnNextCycle !== true && Scene instanceof ScrollMagic.Scene) { // if _updateScenesOnNextCycle is true, all connected scenes are already scheduled for update
					// prep array for next update cycle
					_updateScenesOnNextCycle = _updateScenesOnNextCycle || [];
					if (_updateScenesOnNextCycle.indexOf(Scene) == -1) {
						_updateScenesOnNextCycle.push(Scene);
					}
					_updateScenesOnNextCycle = sortScenes(_updateScenesOnNextCycle); // sort
					debounceUpdate();
				}
			}
			return Controller;
		};

		/**
		 * Updates the controller params and calls updateScene on every scene, that is attached to the controller.  
		 * See `Controller.updateScene()` for more information about what this means.  
		 * In most cases you will not need this function, as it is called constantly, whenever ScrollMagic detects a state change event, like resize or scroll.  
		 * The only application for this method is when ScrollMagic fails to detect these events.  
		 * One application is with some external scroll libraries (like iScroll) that move an internal container to a negative offset instead of actually scrolling. In this case the update on the controller needs to be called whenever the child container's position changes.
		 * For this case there will also be the need to provide a custom function to calculate the correct scroll position. See `Controller.scrollPos()` for details.
		 * @public
		 * @example
		 * // update the controller on next cycle (saves performance due to elimination of redundant updates)
		 * controller.update();
		 *
		 * // update the controller immediately
		 * controller.update(true);
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance)
		 * @return {Controller} Parent object for chaining.
		 */
		this.update = function (immediately) {
			onChange({
				type: "resize"
			}); // will update size and set _updateScenesOnNextCycle to true
			if (immediately) {
				updateScenes();
			}
			return Controller;
		};

		/**
		 * Scroll to a numeric scroll offset, a DOM element, the start of a scene or provide an alternate method for scrolling.  
		 * For vertical controllers it will change the top scroll offset and for horizontal applications it will change the left offset.
		 * @public
		 *
		 * @since 1.1.0
		 * @example
		 * // scroll to an offset of 100
		 * controller.scrollTo(100);
		 *
		 * // scroll to a DOM element
		 * controller.scrollTo("#anchor");
		 *
		 * // scroll to the beginning of a scene
		 * var scene = new ScrollMagic.Scene({offset: 200});
		 * controller.scrollTo(scene);
		 *
		 * // define a new scroll position modification function (jQuery animate instead of jump)
		 * controller.scrollTo(function (newScrollPos) {
		 *	$("html, body").animate({scrollTop: newScrollPos});
		 * });
		 * controller.scrollTo(100); // call as usual, but the new function will be used instead
		 *
		 * // define a new scroll function with an additional parameter
		 * controller.scrollTo(function (newScrollPos, message) {
		 *  console.log(message);
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter to the defined custom function
		 * controller.scrollTo(100, "my message");
		 *
		 * // define a new scroll function with an additional parameter containing multiple variables
		 * controller.scrollTo(function (newScrollPos, options) {
		 *  someGlobalVar = options.a + options.b;
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter containing multiple options
		 * controller.scrollTo(100, {a: 1, b: 2});
		 *
		 * // define a new scroll function with a callback supplied as an additional parameter
		 * controller.scrollTo(function (newScrollPos, callback) {
		 *	$(this).animate({scrollTop: newScrollPos}, 400, "swing", callback);
		 * });
		 * // call as usual, but supply an extra parameter, which is used as a callback in the previously defined custom scroll function
		 * controller.scrollTo(100, function() {
		 *	console.log("scroll has finished.");
		 * });
		 *
		 * @param {mixed} scrollTarget - The supplied argument can be one of these types:
		 * 1. `number` -> The container will scroll to this new scroll offset.
		 * 2. `string` or `object` -> Can be a selector or a DOM object.  
		 *  The container will scroll to the position of this element.
		 * 3. `ScrollMagic Scene` -> The container will scroll to the start of this scene.
		 * 4. `function` -> This function will be used for future scroll position modifications.  
		 *  This provides a way for you to change the behaviour of scrolling and adding new behaviour like animation. The function receives the new scroll position as a parameter and a reference to the container element using `this`.  
		 *  It may also optionally receive an optional additional parameter (see below)  
		 *  _**NOTE:**  
		 *  All other options will still work as expected, using the new function to scroll._
		 * @param {mixed} [additionalParameter] - If a custom scroll function was defined (see above 4.), you may want to supply additional parameters to it, when calling it. You can do this using this parameter – see examples for details. Please note, that this parameter will have no effect, if you use the default scrolling function.
		 * @returns {Controller} Parent object for chaining.
		 */
		this.scrollTo = function (scrollTarget, additionalParameter) {
			if (_util.type.Number(scrollTarget)) { // excecute
				setScrollPos.call(_options.container, scrollTarget, additionalParameter);
			} else if (scrollTarget instanceof ScrollMagic.Scene) { // scroll to scene
				if (scrollTarget.controller() === Controller) { // check if the controller is associated with this scene
					Controller.scrollTo(scrollTarget.scrollOffset(), additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", scrollTarget);
				}
			} else if (_util.type.Function(scrollTarget)) { // assign new scroll function
				setScrollPos = scrollTarget;
			} else { // scroll to element
				var elem = _util.get.elements(scrollTarget)[0];
				if (elem) {
					// if parent is pin spacer, use spacer position instead so correct start position is returned for pinned elements.
					while (elem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
						elem = elem.parentNode;
					}

					var
						param = _options.vertical ? "top" : "left", // which param is of interest ?
						containerOffset = _util.get.offset(_options.container), // container position is needed because element offset is returned in relation to document, not in relation to container.
						elementOffset = _util.get.offset(elem);

					if (!_isDocument) { // container is not the document root, so substract scroll Position to get correct trigger element position relative to scrollcontent
						containerOffset[param] -= Controller.scrollPos();
					}

					Controller.scrollTo(elementOffset[param] - containerOffset[param], additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", scrollTarget);
				}
			}
			return Controller;
		};

		/**
		 * **Get** the current scrollPosition or **Set** a new method to calculate it.  
		 * -> **GET**:
		 * When used as a getter this function will return the current scroll position.  
		 * To get a cached value use Controller.info("scrollPos"), which will be updated in the update cycle.  
		 * For vertical controllers it will return the top scroll offset and for horizontal applications it will return the left offset.
		 *
		 * -> **SET**:
		 * When used as a setter this method prodes a way to permanently overwrite the controller's scroll position calculation.  
		 * A typical usecase is when the scroll position is not reflected by the containers scrollTop or scrollLeft values, but for example by the inner offset of a child container.  
		 * Moving a child container inside a parent is a commonly used method for several scrolling frameworks, including iScroll.  
		 * By providing an alternate calculation function you can make sure ScrollMagic receives the correct scroll position.  
		 * Please also bear in mind that your function should return y values for vertical scrolls an x for horizontals.
		 *
		 * To change the current scroll position please use `Controller.scrollTo()`.
		 * @public
		 *
		 * @example
		 * // get the current scroll Position
		 * var scrollPos = controller.scrollPos();
		 *
		 * // set a new scroll position calculation method
		 * controller.scrollPos(function () {
		 *	return this.info("vertical") ? -mychildcontainer.y : -mychildcontainer.x
		 * });
		 *
		 * @param {function} [scrollPosMethod] - The function to be used for the scroll position calculation of the container.
		 * @returns {(number|Controller)} Current scroll position or parent object for chaining.
		 */
		this.scrollPos = function (scrollPosMethod) {
			if (!arguments.length) { // get
				return getScrollPos.call(Controller);
			} else { // set
				if (_util.type.Function(scrollPosMethod)) {
					getScrollPos = scrollPosMethod;
				} else {
					log(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");
				}
			}
			return Controller;
		};

		/**
		 * **Get** all infos or one in particular about the controller.
		 * @public
		 * @example
		 * // returns the current scroll position (number)
		 * var scrollPos = controller.info("scrollPos");
		 *
		 * // returns all infos as an object
		 * var infos = controller.info();
		 *
		 * @param {string} [about] - If passed only this info will be returned instead of an object containing all.  
		 							 Valid options are:
		 							 ** `"size"` => the current viewport size of the container
		 							 ** `"vertical"` => true if vertical scrolling, otherwise false
		 							 ** `"scrollPos"` => the current scroll position
		 							 ** `"scrollDirection"` => the last known direction of the scroll
		 							 ** `"container"` => the container element
		 							 ** `"isDocument"` => true if container element is the document.
		 * @returns {(mixed|object)} The requested info(s).
		 */
		this.info = function (about) {
			var values = {
				size: _viewPortSize, // contains height or width (in regard to orientation);
				vertical: _options.vertical,
				scrollPos: _scrollPos,
				scrollDirection: _scrollDirection,
				container: _options.container,
				isDocument: _isDocument
			};
			if (!arguments.length) { // get all as an object
				return values;
			} else if (values[about] !== undefined) {
				return values[about];
			} else {
				log(1, "ERROR: option \"" + about + "\" is not available");
				return;
			}
		};

		/**
		 * **Get** or **Set** the current loglevel option value.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var loglevel = controller.loglevel();
		 *
		 * // set a new value
		 * controller.loglevel(3);
		 *
		 * @param {number} [newLoglevel] - The new loglevel setting of the Controller. `[0-3]`
		 * @returns {(number|Controller)} Current loglevel or parent object for chaining.
		 */
		this.loglevel = function (newLoglevel) {
			if (!arguments.length) { // get
				return _options.loglevel;
			} else if (_options.loglevel != newLoglevel) { // set
				_options.loglevel = newLoglevel;
			}
			return Controller;
		};

		/**
		 * **Get** or **Set** the current enabled state of the controller.  
		 * This can be used to disable all Scenes connected to the controller without destroying or removing them.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var enabled = controller.enabled();
		 *
		 * // disable the controller
		 * controller.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the controller `true` or `false`.
		 * @returns {(boolean|Controller)} Current enabled state or parent object for chaining.
		 */
		this.enabled = function (newState) {
			if (!arguments.length) { // get
				return _enabled;
			} else if (_enabled != newState) { // set
				_enabled = !!newState;
				Controller.updateScene(_sceneObjects, true);
			}
			return Controller;
		};

		/**
		 * Destroy the Controller, all Scenes and everything.
		 * @public
		 *
		 * @example
		 * // without resetting the scenes
		 * controller = controller.destroy();
		 *
		 * // with scene reset
		 * controller = controller.destroy(true);
		 *
		 * @param {boolean} [resetScenes=false] - If `true` the pins and tweens (if existent) of all scenes will be reset.
		 * @returns {null} Null to unset handler variables.
		 */
		this.destroy = function (resetScenes) {
			window.clearTimeout(_refreshTimeout);
			var i = _sceneObjects.length;
			while (i--) {
				_sceneObjects[i].destroy(resetScenes);
			}
			_options.container.removeEventListener("resize", onChange);
			_options.container.removeEventListener("scroll", onChange);
			_util.cAF(_updateTimeout);
			log(3, "destroyed " + NAMESPACE + " (reset: " + (resetScenes ? "true" : "false") + ")");
			return null;
		};

		// INIT
		construct();
		return Controller;
	};

	// store pagewide controller options
	var CONTROLLER_OPTIONS = {
		defaults: {
			container: window,
			vertical: true,
			globalSceneOptions: {},
			loglevel: 2,
			refreshInterval: 100
		}
	};
	/*
	 * method used to add an option to ScrollMagic Scenes.
	 */
	ScrollMagic.Controller.addOption = function (name, defaultValue) {
		CONTROLLER_OPTIONS.defaults[name] = defaultValue;
	};
	// instance extension function for plugins
	ScrollMagic.Controller.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Controller = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); // copy parent state
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Controller, oldClass); // copy properties
		ScrollMagic.Controller.prototype = oldClass.prototype; // copy prototype
		ScrollMagic.Controller.prototype.constructor = ScrollMagic.Controller; // restore constructor
	};


	/**
	 * A Scene defines where the controller should react and how.
	 *
	 * @class
	 *
	 * @example
	 * // create a standard scene and add it to a controller
	 * new ScrollMagic.Scene()
	 *		.addTo(controller);
	 *
	 * // create a scene with custom options and assign a handler to it.
	 * var scene = new ScrollMagic.Scene({
	 * 		duration: 100,
	 *		offset: 200,
	 *		triggerHook: "onEnter",
	 *		reverse: false
	 * });
	 *
	 * @param {object} [options] - Options for the Scene. The options can be updated at any time.  
	 							   Instead of setting the options for each scene individually you can also set them globally in the controller as the controllers `globalSceneOptions` option. The object accepts the same properties as the ones below.  
	 							   When a scene is added to the controller the options defined using the Scene constructor will be overwritten by those set in `globalSceneOptions`.
	 * @param {(number|string|function)} [options.duration=0] - The duration of the scene. 
	 					Please see `Scene.duration()` for details.
	 * @param {number} [options.offset=0] - Offset Value for the Trigger Position. If no triggerElement is defined this will be the scroll distance from the start of the page, after which the scene will start.
	 * @param {(string|object)} [options.triggerElement=null] - Selector or DOM object that defines the start of the scene. If undefined the scene will start right at the start of the page (unless an offset is set).
	 * @param {(number|string)} [options.triggerHook="onCenter"] - Can be a number between 0 and 1 defining the position of the trigger Hook in relation to the viewport.  
	 															  Can also be defined using a string:
	 															  ** `"onEnter"` => `1`
	 															  ** `"onCenter"` => `0.5`
	 															  ** `"onLeave"` => `0`
	 * @param {boolean} [options.reverse=true] - Should the scene reverse, when scrolling up?
	 * @param {number} [options.loglevel=2] - Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
	 										  ** `0` => silent
	 										  ** `1` => errors
	 										  ** `2` => errors, warnings
	 										  ** `3` => errors, warnings, debuginfo
	 * 
	 */
	ScrollMagic.Scene = function (options) {

		/*
		 * ----------------------------------------------------------------
		 * settings
		 * ----------------------------------------------------------------
		 */

		var
			NAMESPACE = 'ScrollMagic.Scene',
			SCENE_STATE_BEFORE = 'BEFORE',
			SCENE_STATE_DURING = 'DURING',
			SCENE_STATE_AFTER = 'AFTER',
			DEFAULT_OPTIONS = SCENE_OPTIONS.defaults;

		/*
		 * ----------------------------------------------------------------
		 * private vars
		 * ----------------------------------------------------------------
		 */

		var
			Scene = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_state = SCENE_STATE_BEFORE,
			_progress = 0,
			_scrollOffset = {
				start: 0,
				end: 0
			}, // reflects the controllers's scroll position for the start and end of the scene respectively
			_triggerPos = 0,
			_enabled = true,
			_durationUpdateMethod,
			_controller;

		/**
		 * Internal constructor function of the ScrollMagic Scene
		 * @private
		 */
		var construct = function () {
			for (var key in _options) { // check supplied options
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			// add getters/setters for all possible options
			for (var optionName in DEFAULT_OPTIONS) {
				addSceneOption(optionName);
			}
			// validate all options
			validateOption();
		};

		/*
		 * ----------------------------------------------------------------
		 * Event Management
		 * ----------------------------------------------------------------
		 */

		var _listeners = {};
		/**
		 * Scene start event.  
		 * Fires whenever the scroll position its the starting point of the scene.  
		 * It will also fire when scrolling back up going over the start position of the scene. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#start
		 *
		 * @example
		 * scene.on("start", function (event) {
		 * 	console.log("Hit start point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene end event.  
		 * Fires whenever the scroll position its the ending point of the scene.  
		 * It will also fire when scrolling back up from after the scene and going over its end position. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#end
		 *
		 * @example
		 * scene.on("end", function (event) {
		 * 	console.log("Hit end point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene enter event.  
		 * Fires whenever the scene enters the "DURING" state.  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene enters its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#enter
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 * 	console.log("Scene entered.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene - always `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene leave event.  
		 * Fires whenever the scene's state goes from "DURING" to either "BEFORE" or "AFTER".  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene leaves its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#leave
		 *
		 * @example
		 * scene.on("leave", function (event) {
		 * 	console.log("Scene left.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene update event.  
		 * Fires whenever the scene is updated (but not necessarily changes the progress).
		 *
		 * @event ScrollMagic.Scene#update
		 *
		 * @example
		 * scene.on("update", function (event) {
		 * 	console.log("Scene updated.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.startPos - The starting position of the scene (in relation to the conainer)
		 * @property {number} event.endPos - The ending position of the scene (in relation to the conainer)
		 * @property {number} event.scrollPos - The current scroll position of the container
		 */
		/**
		 * Scene progress event.  
		 * Fires whenever the progress of the scene changes.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#progress
		 *
		 * @example
		 * scene.on("progress", function (event) {
		 * 	console.log("Scene progress changed to " + event.progress);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"`, `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene change event.  
		 * Fires whenvever a property of the scene is changed.
		 *
		 * @event ScrollMagic.Scene#change
		 *
		 * @example
		 * scene.on("change", function (event) {
		 * 	console.log("Scene Property \"" + event.what + "\" changed to " + event.newval);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.what - Indicates what value has been changed
		 * @property {mixed} event.newval - The new value of the changed property
		 */
		/**
		 * Scene shift event.  
		 * Fires whenvever the start or end **scroll offset** of the scene change.
		 * This happens explicitely, when one of these values change: `offset`, `duration` or `triggerHook`.
		 * It will fire implicitly when the `triggerElement` changes, if the new element has a different position (most cases).
		 * It will also fire implicitly when the size of the container changes and the triggerHook is anything other than `onLeave`.
		 *
		 * @event ScrollMagic.Scene#shift
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("shift", function (event) {
		 * 	console.log("Scene moved, because the " + event.reason + " has changed.)");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.reason - Indicates why the scene has shifted
		 */
		/**
		 * Scene destroy event.  
		 * Fires whenvever the scene is destroyed.
		 * This can be used to tidy up custom behaviour used in events.
		 *
		 * @event ScrollMagic.Scene#destroy
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 *        // add custom action
		 *        $("#my-elem").left("200");
		 *      })
		 *      .on("destroy", function (event) {
		 *        // reset my element to start position
		 *        if (event.reset) {
		 *          $("#my-elem").left("0");
		 *        }
		 *      });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.reset - Indicates if the destroy method was called with reset `true` or `false`.
		 */
		/**
		 * Scene add event.  
		 * Fires when the scene is added to a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#add
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("add", function (event) {
		 * 	console.log('Scene was added to a new controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.controller - The controller object the scene was added to.
		 */
		/**
		 * Scene remove event.  
		 * Fires when the scene is removed from a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#remove
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("remove", function (event) {
		 * 	console.log('Scene was removed from its controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 */

		/**
		 * Add one ore more event listener.  
		 * The callback function will be fired at the respective event, and an object containing relevant data will be passed to the callback.
		 * @method ScrollMagic.Scene#on
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update progress start end enter leave", callback);
		 *
		 * @param {string} names - The name or names of the event the callback should be attached to.
		 * @param {function} callback - A function that should be executed, when the event is dispatched. An event object will be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.on = function (names, callback) {
			if (_util.type.Function(callback)) {
				names = names.trim().split(' ');
				names.forEach(function (fullname) {
					var
						nameparts = fullname.split('.'),
						eventname = nameparts[0],
						namespace = nameparts[1];
					if (eventname != "*") { // disallow wildcards
						if (!_listeners[eventname]) {
							_listeners[eventname] = [];
						}
						_listeners[eventname].push({
							namespace: namespace || '',
							callback: callback
						});
					}
				});
			} else {
				log(1, "ERROR when calling '.on()': Supplied callback for '" + names + "' is not a valid function!");
			}
			return Scene;
		};

		/**
		 * Remove one or more event listener.
		 * @method ScrollMagic.Scene#off
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update", callback);
		 * // remove listeners
		 * scene.off("change update", callback);
		 *
		 * @param {string} names - The name or names of the event that should be removed.
		 * @param {function} [callback] - A specific callback function that should be removed. If none is passed all callbacks to the event listener will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.off = function (names, callback) {
			if (!names) {
				log(1, "ERROR: Invalid event name supplied.");
				return Scene;
			}
			names = names.trim().split(' ');
			names.forEach(function (fullname, key) {
				var
					nameparts = fullname.split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1] || '',
					removeList = eventname === '*' ? Object.keys(_listeners) : [eventname];
				removeList.forEach(function (remove) {
					var
						list = _listeners[remove] || [],
						i = list.length;
					while (i--) {
						var listener = list[i];
						if (listener && (namespace === listener.namespace || namespace === '*') && (!callback || callback == listener.callback)) {
							list.splice(i, 1);
						}
					}
					if (!list.length) {
						delete _listeners[remove];
					}
				});
			});
			return Scene;
		};

		/**
		 * Trigger an event.
		 * @method ScrollMagic.Scene#trigger
		 *
		 * @example
		 * this.trigger("change");
		 *
		 * @param {string} name - The name of the event that should be triggered.
		 * @param {object} [vars] - An object containing info that should be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.trigger = function (name, vars) {
			if (name) {
				var
					nameparts = name.trim().split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1],
					listeners = _listeners[eventname];
				log(3, 'event fired:', eventname, vars ? "->" : '', vars || '');
				if (listeners) {
					listeners.forEach(function (listener, key) {
						if (!namespace || namespace === listener.namespace) {
							listener.callback.call(Scene, new ScrollMagic.Event(eventname, listener.namespace, Scene, vars));
						}
					});
				}
			} else {
				log(1, "ERROR: Invalid event name supplied.");
			}
			return Scene;
		};

		// set event listeners
		Scene
			.on("change.internal", function (e) {
				if (e.what !== "loglevel" && e.what !== "tweenChanges") { // no need for a scene update scene with these options...
					if (e.what === "triggerElement") {
						updateTriggerElementPosition();
					} else if (e.what === "reverse") { // the only property left that may have an impact on the current scene state. Everything else is handled by the shift event.
						Scene.update();
					}
				}
			})
			.on("shift.internal", function (e) {
				updateScrollOffset();
				Scene.update(); // update scene to reflect new position
			});

		/**
		 * Send a debug message to the console.
		 * @private
		 * but provided publicly with _log for plugins
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */
		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};

		/**
		 * Add the scene to a controller.  
		 * This is the equivalent to `Controller.addScene(scene)`.
		 * @method ScrollMagic.Scene#addTo
		 *
		 * @example
		 * // add a scene to a ScrollMagic Controller
		 * scene.addTo(controller);
		 *
		 * @param {ScrollMagic.Controller} controller - The controller to which the scene should be added.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.addTo = function (controller) {
			if (!(controller instanceof ScrollMagic.Controller)) {
				log(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller");
			} else if (_controller != controller) {
				// new controller
				if (_controller) { // was associated to a different controller before, so remove it...
					_controller.removeScene(Scene);
				}
				_controller = controller;
				validateOption();
				updateDuration(true);
				updateTriggerElementPosition(true);
				updateScrollOffset();
				_controller.info("container").addEventListener('resize', onContainerResize);
				controller.addScene(Scene);
				Scene.trigger("add", {
					controller: _controller
				});
				log(3, "added " + NAMESPACE + " to controller");
				Scene.update();
			}
			return Scene;
		};

		/**
		 * **Get** or **Set** the current enabled state of the scene.  
		 * This can be used to disable this scene without removing or destroying it.
		 * @method ScrollMagic.Scene#enabled
		 *
		 * @example
		 * // get the current value
		 * var enabled = scene.enabled();
		 *
		 * // disable the scene
		 * scene.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the scene `true` or `false`.
		 * @returns {(boolean|Scene)} Current enabled state or parent object for chaining.
		 */
		this.enabled = function (newState) {
			if (!arguments.length) { // get
				return _enabled;
			} else if (_enabled != newState) { // set
				_enabled = !!newState;
				Scene.update(true);
			}
			return Scene;
		};

		/**
		 * Remove the scene from the controller.  
		 * This is the equivalent to `Controller.removeScene(scene)`.
		 * The scene will not be updated anymore until you readd it to a controller.
		 * To remove the pin or the tween you need to call removeTween() or removePin() respectively.
		 * @method ScrollMagic.Scene#remove
		 * @example
		 * // remove the scene from its controller
		 * scene.remove();
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.remove = function () {
			if (_controller) {
				_controller.info("container").removeEventListener('resize', onContainerResize);
				var tmpParent = _controller;
				_controller = undefined;
				tmpParent.removeScene(Scene);
				Scene.trigger("remove");
				log(3, "removed " + NAMESPACE + " from controller");
			}
			return Scene;
		};

		/**
		 * Destroy the scene and everything.
		 * @method ScrollMagic.Scene#destroy
		 * @example
		 * // destroy the scene without resetting the pin and tween to their initial positions
		 * scene = scene.destroy();
		 *
		 * // destroy the scene and reset the pin and tween
		 * scene = scene.destroy(true);
		 *
		 * @param {boolean} [reset=false] - If `true` the pin and tween (if existent) will be reset.
		 * @returns {null} Null to unset handler variables.
		 */
		this.destroy = function (reset) {
			Scene.trigger("destroy", {
				reset: reset
			});
			Scene.remove();
			Scene.off("*.*");
			log(3, "destroyed " + NAMESPACE + " (reset: " + (reset ? "true" : "false") + ")");
			return null;
		};


		/**
		 * Updates the Scene to reflect the current state.  
		 * This is the equivalent to `Controller.updateScene(scene, immediately)`.  
		 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
		 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.
		 * This means an update doesn't necessarily result in a progress change. The `progress` event will be fired if the progress has indeed changed between this update and the last.  
		 * _**NOTE:** This method gets called constantly whenever ScrollMagic detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
		 * @method ScrollMagic.Scene#update
		 * @example
		 * // update the scene on next tick
		 * scene.update();
		 *
		 * // update the scene immediately
		 * scene.update(true);
		 *
		 * @fires Scene.update
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance).
		 * @returns {Scene} Parent object for chaining.
		 */
		this.update = function (immediately) {
			if (_controller) {
				if (immediately) {
					if (_controller.enabled() && _enabled) {
						var
							scrollPos = _controller.info("scrollPos"),
							newProgress;

						if (_options.duration > 0) {
							newProgress = (scrollPos - _scrollOffset.start) / (_scrollOffset.end - _scrollOffset.start);
						} else {
							newProgress = scrollPos >= _scrollOffset.start ? 1 : 0;
						}

						Scene.trigger("update", {
							startPos: _scrollOffset.start,
							endPos: _scrollOffset.end,
							scrollPos: scrollPos
						});

						Scene.progress(newProgress);
					} else if (_pin && _state === SCENE_STATE_DURING) {
						updatePinState(true); // unpin in position
					}
				} else {
					_controller.updateScene(Scene, false);
				}
			}
			return Scene;
		};

		/**
		 * Updates dynamic scene variables like the trigger element position or the duration.
		 * This method is automatically called in regular intervals from the controller. See {@link ScrollMagic.Controller} option `refreshInterval`.
		 * 
		 * You can call it to minimize lag, for example when you intentionally change the position of the triggerElement.
		 * If you don't it will simply be updated in the next refresh interval of the container, which is usually sufficient.
		 *
		 * @method ScrollMagic.Scene#refresh
		 * @since 1.1.0
		 * @example
		 * scene = new ScrollMagic.Scene({triggerElement: "#trigger"});
		 * 
		 * // change the position of the trigger
		 * $("#trigger").css("top", 500);
		 * // immediately let the scene know of this change
		 * scene.refresh();
		 *
		 * @fires {@link Scene.shift}, if the trigger element position or the duration changed
		 * @fires {@link Scene.change}, if the duration changed
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.refresh = function () {
			updateDuration();
			updateTriggerElementPosition();
			// update trigger element position
			return Scene;
		};

		/**
		 * **Get** or **Set** the scene's progress.  
		 * Usually it shouldn't be necessary to use this as a setter, as it is set automatically by scene.update().  
		 * The order in which the events are fired depends on the duration of the scene:
		 *  1. Scenes with `duration == 0`:  
		 *  Scenes that have no duration by definition have no ending. Thus the `end` event will never be fired.  
		 *  When the trigger position of the scene is passed the events are always fired in this order:  
		 *  `enter`, `start`, `progress` when scrolling forward  
		 *  and  
		 *  `progress`, `start`, `leave` when scrolling in reverse
		 *  2. Scenes with `duration > 0`:  
		 *  Scenes with a set duration have a defined start and end point.  
		 *  When scrolling past the start position of the scene it will fire these events in this order:  
		 *  `enter`, `start`, `progress`  
		 *  When continuing to scroll and passing the end point it will fire these events:  
		 *  `progress`, `end`, `leave`  
		 *  When reversing through the end point these events are fired:  
		 *  `enter`, `end`, `progress`  
		 *  And when continuing to scroll past the start position in reverse it will fire:  
		 *  `progress`, `start`, `leave`  
		 *  In between start and end the `progress` event will be called constantly, whenever the progress changes.
		 * 
		 * In short:  
		 * `enter` events will always trigger **before** the progress update and `leave` envents will trigger **after** the progress update.  
		 * `start` and `end` will always trigger at their respective position.
		 * 
		 * Please review the event descriptions for details on the events and the event object that is passed to the callback.
		 * 
		 * @method ScrollMagic.Scene#progress
		 * @example
		 * // get the current scene progress
		 * var progress = scene.progress();
		 *
		 * // set new scene progress
		 * scene.progress(0.3);
		 *
		 * @fires {@link Scene.enter}, when used as setter
		 * @fires {@link Scene.start}, when used as setter
		 * @fires {@link Scene.progress}, when used as setter
		 * @fires {@link Scene.end}, when used as setter
		 * @fires {@link Scene.leave}, when used as setter
		 *
		 * @param {number} [progress] - The new progress value of the scene `[0-1]`.
		 * @returns {number} `get` -  Current scene progress.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */
		this.progress = function (progress) {
			if (!arguments.length) { // get
				return _progress;
			} else { // set
				var
					doUpdate = false,
					oldState = _state,
					scrollDirection = _controller ? _controller.info("scrollDirection") : 'PAUSED',
					reverseOrForward = _options.reverse || progress >= _progress;
				if (_options.duration === 0) {
					// zero duration scenes
					doUpdate = _progress != progress;
					_progress = progress < 1 && reverseOrForward ? 0 : 1;
					_state = _progress === 0 ? SCENE_STATE_BEFORE : SCENE_STATE_DURING;
				} else {
					// scenes with start and end
					if (progress < 0 && _state !== SCENE_STATE_BEFORE && reverseOrForward) {
						// go back to initial state
						_progress = 0;
						_state = SCENE_STATE_BEFORE;
						doUpdate = true;
					} else if (progress >= 0 && progress < 1 && reverseOrForward) {
						_progress = progress;
						_state = SCENE_STATE_DURING;
						doUpdate = true;
					} else if (progress >= 1 && _state !== SCENE_STATE_AFTER) {
						_progress = 1;
						_state = SCENE_STATE_AFTER;
						doUpdate = true;
					} else if (_state === SCENE_STATE_DURING && !reverseOrForward) {
						updatePinState(); // in case we scrolled backwards mid-scene and reverse is disabled => update the pin position, so it doesn't move back as well.
					}
				}
				if (doUpdate) {
					// fire events
					var
						eventVars = {
							progress: _progress,
							state: _state,
							scrollDirection: scrollDirection
						},
						stateChanged = _state != oldState;

					var trigger = function (eventName) { // tmp helper to simplify code
						Scene.trigger(eventName, eventVars);
					};

					if (stateChanged) { // enter events
						if (oldState !== SCENE_STATE_DURING) {
							trigger("enter");
							trigger(oldState === SCENE_STATE_BEFORE ? "start" : "end");
						}
					}
					trigger("progress");
					if (stateChanged) { // leave events
						if (_state !== SCENE_STATE_DURING) {
							trigger(_state === SCENE_STATE_BEFORE ? "start" : "end");
							trigger("leave");
						}
					}
				}

				return Scene;
			}
		};


		/**
		 * Update the start and end scrollOffset of the container.
		 * The positions reflect what the controller's scroll position will be at the start and end respectively.
		 * Is called, when:
		 *   - Scene event "change" is called with: offset, triggerHook, duration 
		 *   - scroll container event "resize" is called
		 *   - the position of the triggerElement changes
		 *   - the controller changes -> addTo()
		 * @private
		 */
		var updateScrollOffset = function () {
			_scrollOffset = {
				start: _triggerPos + _options.offset
			};
			if (_controller && _options.triggerElement) {
				// take away triggerHook portion to get relative to top
				_scrollOffset.start -= _controller.info("size") * _options.triggerHook;
			}
			_scrollOffset.end = _scrollOffset.start + _options.duration;
		};

		/**
		 * Updates the duration if set to a dynamic function.
		 * This method is called when the scene is added to a controller and in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.change}, if the duration changed
		 * @fires {@link Scene.shift}, if the duration changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */
		var updateDuration = function (suppressEvents) {
			// update duration
			if (_durationUpdateMethod) {
				var varname = "duration";
				if (changeOption(varname, _durationUpdateMethod.call(Scene)) && !suppressEvents) { // set
					Scene.trigger("change", {
						what: varname,
						newval: _options[varname]
					});
					Scene.trigger("shift", {
						reason: varname
					});
				}
			}
		};

		/**
		 * Updates the position of the triggerElement, if present.
		 * This method is called ...
		 *  - ... when the triggerElement is changed
		 *  - ... when the scene is added to a (new) controller
		 *  - ... in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.shift}, if the position changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */
		var updateTriggerElementPosition = function (suppressEvents) {
			var
				elementPos = 0,
				telem = _options.triggerElement;
			if (_controller && (telem || _triggerPos > 0)) { // either an element exists or was removed and the triggerPos is still > 0
				if (telem) { // there currently a triggerElement set
					if (telem.parentNode) { // check if element is still attached to DOM
						var
							controllerInfo = _controller.info(),
							containerOffset = _util.get.offset(controllerInfo.container), // container position is needed because element offset is returned in relation to document, not in relation to container.
							param = controllerInfo.vertical ? "top" : "left"; // which param is of interest ?

						// if parent is spacer, use spacer position instead so correct start position is returned for pinned elements.
						while (telem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
							telem = telem.parentNode;
						}

						var elementOffset = _util.get.offset(telem);

						if (!controllerInfo.isDocument) { // container is not the document root, so substract scroll Position to get correct trigger element position relative to scrollcontent
							containerOffset[param] -= _controller.scrollPos();
						}

						elementPos = elementOffset[param] - containerOffset[param];

					} else { // there was an element, but it was removed from DOM
						log(2, "WARNING: triggerElement was removed from DOM and will be reset to", undefined);
						Scene.triggerElement(undefined); // unset, so a change event is triggered
					}
				}

				var changed = elementPos != _triggerPos;
				_triggerPos = elementPos;
				if (changed && !suppressEvents) {
					Scene.trigger("shift", {
						reason: "triggerElementPosition"
					});
				}
			}
		};

		/**
		 * Trigger a shift event, when the container is resized and the triggerHook is > 1.
		 * @private
		 */
		var onContainerResize = function (e) {
			if (_options.triggerHook > 0) {
				Scene.trigger("shift", {
					reason: "containerResize"
				});
			}
		};


		var _validate = _util.extend(SCENE_OPTIONS.validate, {
			// validation for duration handled internally for reference to private var _durationMethod
			duration: function (val) {
				if (_util.type.String(val) && val.match(/^(\.|\d)*\d+%$/)) {
					// percentage value
					var perc = parseFloat(val) / 100;
					val = function () {
						return _controller ? _controller.info("size") * perc : 0;
					};
				}
				if (_util.type.Function(val)) {
					// function
					_durationUpdateMethod = val;
					try {
						val = parseFloat(_durationUpdateMethod.call(Scene));
					} catch (e) {
						val = -1; // will cause error below
					}
				}
				// val has to be float
				val = parseFloat(val);
				if (!_util.type.Number(val) || val < 0) {
					if (_durationUpdateMethod) {
						_durationUpdateMethod = undefined;
						throw ["Invalid return value of supplied function for option \"duration\":", val];
					} else {
						throw ["Invalid value for option \"duration\":", val];
					}
				}
				return val;
			}
		});

		/**
		 * Checks the validity of a specific or all options and reset to default if neccessary.
		 * @private
		 */
		var validateOption = function (check) {
			check = arguments.length ? [check] : Object.keys(_validate);
			check.forEach(function (optionName, key) {
				var value;
				if (_validate[optionName]) { // there is a validation method for this option
					try { // validate value
						value = _validate[optionName](_options[optionName]);
					} catch (e) { // validation failed -> reset to default
						value = DEFAULT_OPTIONS[optionName];
						var logMSG = _util.type.String(e) ? [e] : e;
						if (_util.type.Array(logMSG)) {
							logMSG[0] = "ERROR: " + logMSG[0];
							logMSG.unshift(1); // loglevel 1 for error msg
							log.apply(this, logMSG);
						} else {
							log(1, "ERROR: Problem executing validation callback for option '" + optionName + "':", e.message);
						}
					} finally {
						_options[optionName] = value;
					}
				}
			});
		};

		/**
		 * Helper used by the setter/getters for scene options
		 * @private
		 */
		var changeOption = function (varname, newval) {
			var
				changed = false,
				oldval = _options[varname];
			if (_options[varname] != newval) {
				_options[varname] = newval;
				validateOption(varname); // resets to default if necessary
				changed = oldval != _options[varname];
			}
			return changed;
		};

		// generate getters/setters for all options
		var addSceneOption = function (optionName) {
			if (!Scene[optionName]) {
				Scene[optionName] = function (newVal) {
					if (!arguments.length) { // get
						return _options[optionName];
					} else {
						if (optionName === "duration") { // new duration is set, so any previously set function must be unset
							_durationUpdateMethod = undefined;
						}
						if (changeOption(optionName, newVal)) { // set
							Scene.trigger("change", {
								what: optionName,
								newval: _options[optionName]
							});
							if (SCENE_OPTIONS.shifts.indexOf(optionName) > -1) {
								Scene.trigger("shift", {
									reason: optionName
								});
							}
						}
					}
					return Scene;
				};
			}
		};

		/**
		 * **Get** or **Set** the duration option value.
		 *
		 * As a **setter** it accepts three types of parameters:
		 * 1. `number`: Sets the duration of the scene to exactly this amount of pixels.  
		 *   This means the scene will last for exactly this amount of pixels scrolled. Sub-Pixels are also valid.
		 *   A value of `0` means that the scene is 'open end' and no end will be triggered. Pins will never unpin and animations will play independently of scroll progress.
		 * 2. `string`: Always updates the duration relative to parent scroll container.  
		 *   For example `"100%"` will keep the duration always exactly at the inner height of the scroll container.
		 *   When scrolling vertically the width is used for reference respectively.
		 * 3. `function`: The supplied function will be called to return the scene duration.
		 *   This is useful in setups where the duration depends on other elements who might change size. By supplying a function you can return a value instead of updating potentially multiple scene durations.  
		 *   The scene can be referenced inside the callback using `this`.
		 *   _**WARNING:** This is an easy way to kill performance, as the callback will be executed every time `Scene.refresh()` is called, which happens a lot. The interval is defined by the controller (see ScrollMagic.Controller option `refreshInterval`).  
		 *   It's recomended to avoid calculations within the function and use cached variables as return values.  
		 *   This counts double if you use the same function for multiple scenes._
		 *
		 * @method ScrollMagic.Scene#duration
		 * @example
		 * // get the current duration value
		 * var duration = scene.duration();
		 *
		 * // set a new duration
		 * scene.duration(300);
		 *
		 * // set duration responsively to container size
		 * scene.duration("100%");
		 *
		 * // use a function to randomize the duration for some reason.
		 * var durationValueCache;
		 * function durationCallback () {
		 *   return durationValueCache;
		 * }
		 * function updateDuration () {
		 *   durationValueCache = Math.random() * 100;
		 * }
		 * updateDuration(); // set to initial value
		 * scene.duration(durationCallback); // set duration callback
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|string|function)} [newDuration] - The new duration setting for the scene.
		 * @returns {number} `get` -  Current scene duration.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the offset option value.
		 * @method ScrollMagic.Scene#offset
		 * @example
		 * // get the current offset
		 * var offset = scene.offset();
		 *
		 * // set a new offset
		 * scene.offset(100);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {number} [newOffset] - The new offset of the scene.
		 * @returns {number} `get` -  Current scene offset.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the triggerElement option value.
		 * Does **not** fire `Scene.shift`, because changing the trigger Element doesn't necessarily mean the start position changes. This will be determined in `Scene.refresh()`, which is automatically triggered.
		 * @method ScrollMagic.Scene#triggerElement
		 * @example
		 * // get the current triggerElement
		 * var triggerElement = scene.triggerElement();
		 *
		 * // set a new triggerElement using a selector
		 * scene.triggerElement("#trigger");
		 * // set a new triggerElement using a DOM object
		 * scene.triggerElement(document.getElementById("trigger"));
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {(string|object)} [newTriggerElement] - The new trigger element for the scene.
		 * @returns {(string|object)} `get` -  Current triggerElement.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the triggerHook option value.
		 * @method ScrollMagic.Scene#triggerHook
		 * @example
		 * // get the current triggerHook value
		 * var triggerHook = scene.triggerHook();
		 *
		 * // set a new triggerHook using a string
		 * scene.triggerHook("onLeave");
		 * // set a new triggerHook using a number
		 * scene.triggerHook(0.7);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|string)} [newTriggerHook] - The new triggerHook of the scene. See {@link Scene} parameter description for value options.
		 * @returns {number} `get` -  Current triggerHook (ALWAYS numerical).
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the reverse option value.
		 * @method ScrollMagic.Scene#reverse
		 * @example
		 * // get the current reverse option
		 * var reverse = scene.reverse();
		 *
		 * // set new reverse option
		 * scene.reverse(false);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {boolean} [newReverse] - The new reverse setting of the scene.
		 * @returns {boolean} `get` -  Current reverse option value.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the loglevel option value.
		 * @method ScrollMagic.Scene#loglevel
		 * @example
		 * // get the current loglevel
		 * var loglevel = scene.loglevel();
		 *
		 * // set new loglevel
		 * scene.loglevel(3);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {number} [newLoglevel] - The new loglevel setting of the scene. `[0-3]`
		 * @returns {number} `get` -  Current loglevel.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** the associated controller.
		 * @method ScrollMagic.Scene#controller
		 * @example
		 * // get the controller of a scene
		 * var controller = scene.controller();
		 *
		 * @returns {ScrollMagic.Controller} Parent controller or `undefined`
		 */
		this.controller = function () {
			return _controller;
		};

		/**
		 * **Get** the current state.
		 * @method ScrollMagic.Scene#state
		 * @example
		 * // get the current state
		 * var state = scene.state();
		 *
		 * @returns {string} `"BEFORE"`, `"DURING"` or `"AFTER"`
		 */
		this.state = function () {
			return _state;
		};

		/**
		 * **Get** the current scroll offset for the start of the scene.  
		 * Mind, that the scrollOffset is related to the size of the container, if `triggerHook` is bigger than `0` (or `"onLeave"`).  
		 * This means, that resizing the container or changing the `triggerHook` will influence the scene's start offset.
		 * @method ScrollMagic.Scene#scrollOffset
		 * @example
		 * // get the current scroll offset for the start and end of the scene.
		 * var start = scene.scrollOffset();
		 * var end = scene.scrollOffset() + scene.duration();
		 * console.log("the scene starts at", start, "and ends at", end);
		 *
		 * @returns {number} The scroll offset (of the container) at which the scene will trigger. Y value for vertical and X value for horizontal scrolls.
		 */
		this.scrollOffset = function () {
			return _scrollOffset.start;
		};

		/**
		 * **Get** the trigger position of the scene (including the value of the `offset` option).  
		 * @method ScrollMagic.Scene#triggerPosition
		 * @example
		 * // get the scene's trigger position
		 * var triggerPosition = scene.triggerPosition();
		 *
		 * @returns {number} Start position of the scene. Top position value for vertical and left position value for horizontal scrolls.
		 */
		this.triggerPosition = function () {
			var pos = _options.offset; // the offset is the basis
			if (_controller) {
				// get the trigger position
				if (_options.triggerElement) {
					// Element as trigger
					pos += _triggerPos;
				} else {
					// return the height of the triggerHook to start at the beginning
					pos += _controller.info("size") * Scene.triggerHook();
				}
			}
			return pos;
		};


		var
			_pin,
			_pinOptions;

		Scene
			.on("shift.internal", function (e) {
				var durationChanged = e.reason === "duration";
				if ((_state === SCENE_STATE_AFTER && durationChanged) || (_state === SCENE_STATE_DURING && _options.duration === 0)) {
					// if [duration changed after a scene (inside scene progress updates pin position)] or [duration is 0, we are in pin phase and some other value changed].
					updatePinState();
				}
				if (durationChanged) {
					updatePinDimensions();
				}
			})
			.on("progress.internal", function (e) {
				updatePinState();
			})
			.on("add.internal", function (e) {
				updatePinDimensions();
			})
			.on("destroy.internal", function (e) {
				Scene.removePin(e.reset);
			});
		/**
		 * Update the pin state.
		 * @private
		 */
		var updatePinState = function (forceUnpin) {
			if (_pin && _controller) {
				var
					containerInfo = _controller.info(),
					pinTarget = _pinOptions.spacer.firstChild; // may be pin element or another spacer, if cascading pins

				if (!forceUnpin && _state === SCENE_STATE_DURING) { // during scene or if duration is 0 and we are past the trigger
					// pinned state
					if (_util.css(pinTarget, "position") != "fixed") {
						// change state before updating pin spacer (position changes due to fixed collapsing might occur.)
						_util.css(pinTarget, {
							"position": "fixed"
						});
						// update pin spacer
						updatePinDimensions();
					}

					var
						fixedPos = _util.get.offset(_pinOptions.spacer, true), // get viewport position of spacer
						scrollDistance = _options.reverse || _options.duration === 0 ?
						containerInfo.scrollPos - _scrollOffset.start // quicker
						:
						Math.round(_progress * _options.duration * 10) / 10; // if no reverse and during pin the position needs to be recalculated using the progress

					// add scrollDistance
					fixedPos[containerInfo.vertical ? "top" : "left"] += scrollDistance;

					// set new values
					_util.css(_pinOptions.spacer.firstChild, {
						top: fixedPos.top,
						left: fixedPos.left
					});
				} else {
					// unpinned state
					var
						newCSS = {
							position: _pinOptions.inFlow ? "relative" : "absolute",
							top: 0,
							left: 0
						},
						change = _util.css(pinTarget, "position") != newCSS.position;

					if (!_pinOptions.pushFollowers) {
						newCSS[containerInfo.vertical ? "top" : "left"] = _options.duration * _progress;
					} else if (_options.duration > 0) { // only concerns scenes with duration
						if (_state === SCENE_STATE_AFTER && parseFloat(_util.css(_pinOptions.spacer, "padding-top")) === 0) {
							change = true; // if in after state but havent updated spacer yet (jumped past pin)
						} else if (_state === SCENE_STATE_BEFORE && parseFloat(_util.css(_pinOptions.spacer, "padding-bottom")) === 0) { // before
							change = true; // jumped past fixed state upward direction
						}
					}
					// set new values
					_util.css(pinTarget, newCSS);
					if (change) {
						// update pin spacer if state changed
						updatePinDimensions();
					}
				}
			}
		};

		/**
		 * Update the pin spacer and/or element size.
		 * The size of the spacer needs to be updated whenever the duration of the scene changes, if it is to push down following elements.
		 * @private
		 */
		var updatePinDimensions = function () {
			if (_pin && _controller && _pinOptions.inFlow) { // no spacerresize, if original position is absolute
				var
					after = (_state === SCENE_STATE_AFTER),
					before = (_state === SCENE_STATE_BEFORE),
					during = (_state === SCENE_STATE_DURING),
					vertical = _controller.info("vertical"),
					pinTarget = _pinOptions.spacer.firstChild, // usually the pined element but can also be another spacer (cascaded pins)
					marginCollapse = _util.isMarginCollapseType(_util.css(_pinOptions.spacer, "display")),
					css = {};

				// set new size
				// if relsize: spacer -> pin | else: pin -> spacer
				if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
					if (during) {
						_util.css(_pin, {
							"width": _util.get.width(_pinOptions.spacer)
						});
					} else {
						_util.css(_pin, {
							"width": "100%"
						});
					}
				} else {
					// minwidth is needed for cascaded pins.
					css["min-width"] = _util.get.width(vertical ? _pin : pinTarget, true, true);
					css.width = during ? css["min-width"] : "auto";
				}
				if (_pinOptions.relSize.height) {
					if (during) {
						// the only padding the spacer should ever include is the duration (if pushFollowers = true), so we need to substract that.
						_util.css(_pin, {
							"height": _util.get.height(_pinOptions.spacer) - (_pinOptions.pushFollowers ? _options.duration : 0)
						});
					} else {
						_util.css(_pin, {
							"height": "100%"
						});
					}
				} else {
					// margin is only included if it's a cascaded pin to resolve an IE9 bug
					css["min-height"] = _util.get.height(vertical ? pinTarget : _pin, true, !marginCollapse); // needed for cascading pins
					css.height = during ? css["min-height"] : "auto";
				}

				// add space for duration if pushFollowers is true
				if (_pinOptions.pushFollowers) {
					css["padding" + (vertical ? "Top" : "Left")] = _options.duration * _progress;
					css["padding" + (vertical ? "Bottom" : "Right")] = _options.duration * (1 - _progress);
				}
				_util.css(_pinOptions.spacer, css);
			}
		};

		/**
		 * Updates the Pin state (in certain scenarios)
		 * If the controller container is not the document and we are mid-pin-phase scrolling or resizing the main document can result to wrong pin positions.
		 * So this function is called on resize and scroll of the document.
		 * @private
		 */
		var updatePinInContainer = function () {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) {
				updatePinState();
			}
		};

		/**
		 * Updates the Pin spacer size state (in certain scenarios)
		 * If container is resized during pin and relatively sized the size of the pin might need to be updated...
		 * So this function is called on resize of the container.
		 * @private
		 */
		var updateRelativePinSpacer = function () {
			if (_controller && _pin && // well, duh
				_state === SCENE_STATE_DURING && // element in pinned state?
				( // is width or height relatively sized, but not in relation to body? then we need to recalc.
					((_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) && _util.get.width(window) != _util.get.width(_pinOptions.spacer.parentNode)) ||
					(_pinOptions.relSize.height && _util.get.height(window) != _util.get.height(_pinOptions.spacer.parentNode))
				)
			) {
				updatePinDimensions();
			}
		};

		/**
		 * Is called, when the mousewhel is used while over a pinned element inside a div container.
		 * If the scene is in fixed state scroll events would be counted towards the body. This forwards the event to the scroll container.
		 * @private
		 */
		var onMousewheelOverPin = function (e) {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) { // in pin state
				e.preventDefault();
				_controller._setScrollPos(_controller.info("scrollPos") - ((e.wheelDelta || e[_controller.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || -e.detail * 30));
			}
		};

		/**
		 * Pin an element for the duration of the scene.
		 * If the scene duration is 0 the element will only be unpinned, if the user scrolls back past the start position.  
		 * Make sure only one pin is applied to an element at the same time.
		 * An element can be pinned multiple times, but only successively.
		 * _**NOTE:** The option `pushFollowers` has no effect, when the scene duration is 0._
		 * @method ScrollMagic.Scene#setPin
		 * @example
		 * // pin element and push all following elements down by the amount of the pin duration.
		 * scene.setPin("#pin");
		 *
		 * // pin element and keeping all following elements in their place. The pinned element will move past them.
		 * scene.setPin("#pin", {pushFollowers: false});
		 *
		 * @param {(string|object)} element - A Selector targeting an element or a DOM object that is supposed to be pinned.
		 * @param {object} [settings] - settings for the pin
		 * @param {boolean} [settings.pushFollowers=true] - If `true` following elements will be "pushed" down for the duration of the pin, if `false` the pinned element will just scroll past them.  
		 												   Ignored, when duration is `0`.
		 * @param {string} [settings.spacerClass="scrollmagic-pin-spacer"] - Classname of the pin spacer element, which is used to replace the element.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.setPin = function (element, settings) {
			var
				defaultSettings = {
					pushFollowers: true,
					spacerClass: "scrollmagic-pin-spacer"
				};
			var pushFollowersActivelySet = settings && settings.hasOwnProperty('pushFollowers');
			settings = _util.extend({}, defaultSettings, settings);

			// validate Element
			element = _util.get.elements(element)[0];
			if (!element) {
				log(1, "ERROR calling method 'setPin()': Invalid pin element supplied.");
				return Scene; // cancel
			} else if (_util.css(element, "position") === "fixed") {
				log(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'.");
				return Scene; // cancel
			}

			if (_pin) { // preexisting pin?
				if (_pin === element) {
					// same pin we already have -> do nothing
					return Scene; // cancel
				} else {
					// kill old pin
					Scene.removePin();
				}

			}
			_pin = element;

			var
				parentDisplay = _pin.parentNode.style.display,
				boundsParams = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];

			_pin.parentNode.style.display = 'none'; // hack start to force css to return stylesheet values instead of calculated px values.
			var
				inFlow = _util.css(_pin, "position") != "absolute",
				pinCSS = _util.css(_pin, boundsParams.concat(["display"])),
				sizeCSS = _util.css(_pin, ["width", "height"]);
			_pin.parentNode.style.display = parentDisplay; // hack end.

			if (!inFlow && settings.pushFollowers) {
				log(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled.");
				settings.pushFollowers = false;
			}
			window.setTimeout(function () { // wait until all finished, because with responsive duration it will only be set after scene is added to controller
				if (_pin && _options.duration === 0 && pushFollowersActivelySet && settings.pushFollowers) {
					log(2, "WARNING: pushFollowers =", true, "has no effect, when scene duration is 0.");
				}
			}, 0);

			// create spacer and insert
			var
				spacer = _pin.parentNode.insertBefore(document.createElement('div'), _pin),
				spacerCSS = _util.extend(pinCSS, {
					position: inFlow ? "relative" : "absolute",
					boxSizing: "content-box",
					mozBoxSizing: "content-box",
					webkitBoxSizing: "content-box"
				});

			if (!inFlow) { // copy size if positioned absolutely, to work for bottom/right positioned elements.
				_util.extend(spacerCSS, _util.css(_pin, ["width", "height"]));
			}

			_util.css(spacer, spacerCSS);
			spacer.setAttribute(PIN_SPACER_ATTRIBUTE, "");
			_util.addClass(spacer, settings.spacerClass);

			// set the pin Options
			_pinOptions = {
				spacer: spacer,
				relSize: { // save if size is defined using % values. if so, handle spacer resize differently...
					width: sizeCSS.width.slice(-1) === "%",
					height: sizeCSS.height.slice(-1) === "%",
					autoFullWidth: sizeCSS.width === "auto" && inFlow && _util.isMarginCollapseType(pinCSS.display)
				},
				pushFollowers: settings.pushFollowers,
				inFlow: inFlow, // stores if the element takes up space in the document flow
			};

			if (!_pin.___origStyle) {
				_pin.___origStyle = {};
				var
					pinInlineCSS = _pin.style,
					copyStyles = boundsParams.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
				copyStyles.forEach(function (val) {
					_pin.___origStyle[val] = pinInlineCSS[val] || "";
				});
			}

			// if relative size, transfer it to spacer and make pin calculate it...
			if (_pinOptions.relSize.width) {
				_util.css(spacer, {
					width: sizeCSS.width
				});
			}
			if (_pinOptions.relSize.height) {
				_util.css(spacer, {
					height: sizeCSS.height
				});
			}

			// now place the pin element inside the spacer	
			spacer.appendChild(_pin);
			// and set new css
			_util.css(_pin, {
				position: inFlow ? "relative" : "absolute",
				margin: "auto",
				top: "auto",
				left: "auto",
				bottom: "auto",
				right: "auto"
			});

			if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
				_util.css(_pin, {
					boxSizing: "border-box",
					mozBoxSizing: "border-box",
					webkitBoxSizing: "border-box"
				});
			}

			// add listener to document to update pin position in case controller is not the document.
			window.addEventListener('scroll', updatePinInContainer);
			window.addEventListener('resize', updatePinInContainer);
			window.addEventListener('resize', updateRelativePinSpacer);
			// add mousewheel listener to catch scrolls over fixed elements
			_pin.addEventListener("mousewheel", onMousewheelOverPin);
			_pin.addEventListener("DOMMouseScroll", onMousewheelOverPin);

			log(3, "added pin");

			// finally update the pin to init
			updatePinState();

			return Scene;
		};

		/**
		 * Remove the pin from the scene.
		 * @method ScrollMagic.Scene#removePin
		 * @example
		 * // remove the pin from the scene without resetting it (the spacer is not removed)
		 * scene.removePin();
		 *
		 * // remove the pin from the scene and reset the pin element to its initial position (spacer is removed)
		 * scene.removePin(true);
		 *
		 * @param {boolean} [reset=false] - If `false` the spacer will not be removed and the element's position will not be reset.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.removePin = function (reset) {
			if (_pin) {
				if (_state === SCENE_STATE_DURING) {
					updatePinState(true); // force unpin at position
				}
				if (reset || !_controller) { // if there's no controller no progress was made anyway...
					var pinTarget = _pinOptions.spacer.firstChild; // usually the pin element, but may be another spacer (cascaded pins)...
					if (pinTarget.hasAttribute(PIN_SPACER_ATTRIBUTE)) { // copy margins to child spacer
						var
							style = _pinOptions.spacer.style,
							values = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"],
							margins = {};
						values.forEach(function (val) {
							margins[val] = style[val] || "";
						});
						_util.css(pinTarget, margins);
					}
					_pinOptions.spacer.parentNode.insertBefore(pinTarget, _pinOptions.spacer);
					_pinOptions.spacer.parentNode.removeChild(_pinOptions.spacer);
					if (!_pin.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) { // if it's the last pin for this element -> restore inline styles
						// TODO: only correctly set for first pin (when cascading) - how to fix?
						_util.css(_pin, _pin.___origStyle);
						delete _pin.___origStyle;
					}
				}
				window.removeEventListener('scroll', updatePinInContainer);
				window.removeEventListener('resize', updatePinInContainer);
				window.removeEventListener('resize', updateRelativePinSpacer);
				_pin.removeEventListener("mousewheel", onMousewheelOverPin);
				_pin.removeEventListener("DOMMouseScroll", onMousewheelOverPin);
				_pin = undefined;
				log(3, "removed pin (reset: " + (reset ? "true" : "false") + ")");
			}
			return Scene;
		};


		var
			_cssClasses,
			_cssClassElems = [];

		Scene
			.on("destroy.internal", function (e) {
				Scene.removeClassToggle(e.reset);
			});
		/**
		 * Define a css class modification while the scene is active.  
		 * When the scene triggers the classes will be added to the supplied element and removed, when the scene is over.
		 * If the scene duration is 0 the classes will only be removed if the user scrolls back past the start position.
		 * @method ScrollMagic.Scene#setClassToggle
		 * @example
		 * // add the class 'myclass' to the element with the id 'my-elem' for the duration of the scene
		 * scene.setClassToggle("#my-elem", "myclass");
		 *
		 * // add multiple classes to multiple elements defined by the selector '.classChange'
		 * scene.setClassToggle(".classChange", "class1 class2 class3");
		 *
		 * @param {(string|object)} element - A Selector targeting one or more elements or a DOM object that is supposed to be modified.
		 * @param {string} classes - One or more Classnames (separated by space) that should be added to the element during the scene.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.setClassToggle = function (element, classes) {
			var elems = _util.get.elements(element);
			if (elems.length === 0 || !_util.type.String(classes)) {
				log(1, "ERROR calling method 'setClassToggle()': Invalid " + (elems.length === 0 ? "element" : "classes") + " supplied.");
				return Scene;
			}
			if (_cssClassElems.length > 0) {
				// remove old ones
				Scene.removeClassToggle();
			}
			_cssClasses = classes;
			_cssClassElems = elems;
			Scene.on("enter.internal_class leave.internal_class", function (e) {
				var toggle = e.type === "enter" ? _util.addClass : _util.removeClass;
				_cssClassElems.forEach(function (elem, key) {
					toggle(elem, _cssClasses);
				});
			});
			return Scene;
		};

		/**
		 * Remove the class binding from the scene.
		 * @method ScrollMagic.Scene#removeClassToggle
		 * @example
		 * // remove class binding from the scene without reset
		 * scene.removeClassToggle();
		 *
		 * // remove class binding and remove the changes it caused
		 * scene.removeClassToggle(true);
		 *
		 * @param {boolean} [reset=false] - If `false` and the classes are currently active, they will remain on the element. If `true` they will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.removeClassToggle = function (reset) {
			if (reset) {
				_cssClassElems.forEach(function (elem, key) {
					_util.removeClass(elem, _cssClasses);
				});
			}
			Scene.off("start.internal_class end.internal_class");
			_cssClasses = undefined;
			_cssClassElems = [];
			return Scene;
		};

		// INIT
		construct();
		return Scene;
	};

	// store pagewide scene options
	var SCENE_OPTIONS = {
		defaults: {
			duration: 0,
			offset: 0,
			triggerElement: undefined,
			triggerHook: 0.5,
			reverse: true,
			loglevel: 2
		},
		validate: {
			offset: function (val) {
				val = parseFloat(val);
				if (!_util.type.Number(val)) {
					throw ["Invalid value for option \"offset\":", val];
				}
				return val;
			},
			triggerElement: function (val) {
				val = val || undefined;
				if (val) {
					var elem = _util.get.elements(val)[0];
					if (elem && elem.parentNode) {
						val = elem;
					} else {
						throw ["Element defined in option \"triggerElement\" was not found:", val];
					}
				}
				return val;
			},
			triggerHook: function (val) {
				var translate = {
					"onCenter": 0.5,
					"onEnter": 1,
					"onLeave": 0
				};
				if (_util.type.Number(val)) {
					val = Math.max(0, Math.min(parseFloat(val), 1)); //  make sure its betweeen 0 and 1
				} else if (val in translate) {
					val = translate[val];
				} else {
					throw ["Invalid value for option \"triggerHook\": ", val];
				}
				return val;
			},
			reverse: function (val) {
				return !!val; // force boolean
			},
			loglevel: function (val) {
				val = parseInt(val);
				if (!_util.type.Number(val) || val < 0 || val > 3) {
					throw ["Invalid value for option \"loglevel\":", val];
				}
				return val;
			}
		}, // holder for  validation methods. duration validation is handled in 'getters-setters.js'
		shifts: ["duration", "offset", "triggerHook"], // list of options that trigger a `shift` event
	};
	/*
	 * method used to add an option to ScrollMagic Scenes.
	 * TODO: DOC (private for dev)
	 */
	ScrollMagic.Scene.addOption = function (name, defaultValue, validationCallback, shifts) {
		if (!(name in SCENE_OPTIONS.defaults)) {
			SCENE_OPTIONS.defaults[name] = defaultValue;
			SCENE_OPTIONS.validate[name] = validationCallback;
			if (shifts) {
				SCENE_OPTIONS.shifts.push(name);
			}
		} else {
			ScrollMagic._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + name + "', because it already exists.");
		}
	};
	// instance extension function for plugins
	// TODO: DOC (private for dev)
	ScrollMagic.Scene.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Scene = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); // copy parent state
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Scene, oldClass); // copy properties
		ScrollMagic.Scene.prototype = oldClass.prototype; // copy prototype
		ScrollMagic.Scene.prototype.constructor = ScrollMagic.Scene; // restore constructor
	};



	/**
	 * TODO: DOCS (private for dev)
	 * @class
	 * @private
	 */

	ScrollMagic.Event = function (type, namespace, target, vars) {
		vars = vars || {};
		for (var key in vars) {
			this[key] = vars[key];
		}
		this.type = type;
		this.target = this.currentTarget = target;
		this.namespace = namespace || '';
		this.timeStamp = this.timestamp = Date.now();
		return this;
	};

	/*
	 * TODO: DOCS (private for dev)
	 */

	var _util = ScrollMagic._util = (function (window) {
		var U = {},
			i;

		/**
		 * ------------------------------
		 * internal helpers
		 * ------------------------------
		 */

		// parse float and fall back to 0.
		var floatval = function (number) {
			return parseFloat(number) || 0;
		};
		// get current style IE safe (otherwise IE would return calculated values for 'auto')
		var _getComputedStyle = function (elem) {
			return elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem);
		};

		// get element dimension (width or height)
		var _dimension = function (which, elem, outer, includeMargin) {
			elem = (elem === document) ? window : elem;
			if (elem === window) {
				includeMargin = false;
			} else if (!_type.DomElement(elem)) {
				return 0;
			}
			which = which.charAt(0).toUpperCase() + which.substr(1).toLowerCase();
			var dimension = (outer ? elem['offset' + which] || elem['outer' + which] : elem['client' + which] || elem['inner' + which]) || 0;
			if (outer && includeMargin) {
				var style = _getComputedStyle(elem);
				dimension += which === 'Height' ? floatval(style.marginTop) + floatval(style.marginBottom) : floatval(style.marginLeft) + floatval(style.marginRight);
			}
			return dimension;
		};
		// converts 'margin-top' into 'marginTop'
		var _camelCase = function (str) {
			return str.replace(/^[^a-z]+([a-z])/g, '$1').replace(/-([a-z])/g, function (g) {
				return g[1].toUpperCase();
			});
		};

		/**
		 * ------------------------------
		 * external helpers
		 * ------------------------------
		 */

		// extend obj – same as jQuery.extend({}, objA, objB)
		U.extend = function (obj) {
			obj = obj || {};
			for (i = 1; i < arguments.length; i++) {
				if (!arguments[i]) {
					continue;
				}
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						obj[key] = arguments[i][key];
					}
				}
			}
			return obj;
		};

		// check if a css display type results in margin-collapse or not
		U.isMarginCollapseType = function (str) {
			return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(str) > -1;
		};

		// implementation of requestAnimationFrame
		// based on https://gist.github.com/paulirish/1579671
		var
			lastTime = 0,
			vendors = ['ms', 'moz', 'webkit', 'o'];
		var _requestAnimationFrame = window.requestAnimationFrame;
		var _cancelAnimationFrame = window.cancelAnimationFrame;
		// try vendor prefixes if the above doesn't work
		for (i = 0; !_requestAnimationFrame && i < vendors.length; ++i) {
			_requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			_cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
		}

		// fallbacks
		if (!_requestAnimationFrame) {
			_requestAnimationFrame = function (callback) {
				var
					currTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!_cancelAnimationFrame) {
			_cancelAnimationFrame = function (id) {
				window.clearTimeout(id);
			};
		}
		U.rAF = _requestAnimationFrame.bind(window);
		U.cAF = _cancelAnimationFrame.bind(window);

		var
			loglevels = ["error", "warn", "log"],
			console = window.console || {};

		console.log = console.log || function () {}; // no console log, well - do nothing then...
		// make sure methods for all levels exist.
		for (i = 0; i < loglevels.length; i++) {
			var method = loglevels[i];
			if (!console[method]) {
				console[method] = console.log; // prefer .log over nothing
			}
		}
		U.log = function (loglevel) {
			if (loglevel > loglevels.length || loglevel <= 0) loglevel = loglevels.length;
			var now = new Date(),
				time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2) + ":" + ("00" + now.getMilliseconds()).slice(-3),
				method = loglevels[loglevel - 1],
				args = Array.prototype.splice.call(arguments, 1),
				func = Function.prototype.bind.call(console[method], console);
			args.unshift(time);
			func.apply(console, args);
		};

		/**
		 * ------------------------------
		 * type testing
		 * ------------------------------
		 */

		var _type = U.type = function (v) {
			return Object.prototype.toString.call(v).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
		};
		_type.String = function (v) {
			return _type(v) === 'string';
		};
		_type.Function = function (v) {
			return _type(v) === 'function';
		};
		_type.Array = function (v) {
			return Array.isArray(v);
		};
		_type.Number = function (v) {
			return !_type.Array(v) && (v - parseFloat(v) + 1) >= 0;
		};
		_type.DomElement = function (o) {
			return (
				typeof HTMLElement === "object" || typeof HTMLElement === "function" ? o instanceof HTMLElement || o instanceof SVGElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
			);
		};

		/**
		 * ------------------------------
		 * DOM Element info
		 * ------------------------------
		 */
		// always returns a list of matching DOM elements, from a selector, a DOM element or an list of elements or even an array of selectors
		var _get = U.get = {};
		_get.elements = function (selector) {
			var arr = [];
			if (_type.String(selector)) {
				try {
					selector = document.querySelectorAll(selector);
				} catch (e) { // invalid selector
					return arr;
				}
			}
			if (_type(selector) === 'nodelist' || _type.Array(selector) || selector instanceof NodeList) {
				for (var i = 0, ref = arr.length = selector.length; i < ref; i++) { // list of elements
					var elem = selector[i];
					arr[i] = _type.DomElement(elem) ? elem : _get.elements(elem); // if not an element, try to resolve recursively
				}
			} else if (_type.DomElement(selector) || selector === document || selector === window) {
				arr = [selector]; // only the element
			}
			return arr;
		};
		// get scroll top value
		_get.scrollTop = function (elem) {
			return (elem && typeof elem.scrollTop === 'number') ? elem.scrollTop : window.pageYOffset || 0;
		};
		// get scroll left value
		_get.scrollLeft = function (elem) {
			return (elem && typeof elem.scrollLeft === 'number') ? elem.scrollLeft : window.pageXOffset || 0;
		};
		// get element height
		_get.width = function (elem, outer, includeMargin) {
			return _dimension('width', elem, outer, includeMargin);
		};
		// get element width
		_get.height = function (elem, outer, includeMargin) {
			return _dimension('height', elem, outer, includeMargin);
		};

		// get element position (optionally relative to viewport)
		_get.offset = function (elem, relativeToViewport) {
			var offset = {
				top: 0,
				left: 0
			};
			if (elem && elem.getBoundingClientRect) { // check if available
				var rect = elem.getBoundingClientRect();
				offset.top = rect.top;
				offset.left = rect.left;
				if (!relativeToViewport) { // clientRect is by default relative to viewport...
					offset.top += _get.scrollTop();
					offset.left += _get.scrollLeft();
				}
			}
			return offset;
		};

		/**
		 * ------------------------------
		 * DOM Element manipulation
		 * ------------------------------
		 */

		U.addClass = function (elem, classname) {
			if (classname) {
				if (elem.classList)
					elem.classList.add(classname);
				else
					elem.className += ' ' + classname;
			}
		};
		U.removeClass = function (elem, classname) {
			if (classname) {
				if (elem.classList)
					elem.classList.remove(classname);
				else
					elem.className = elem.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		};
		// if options is string -> returns css value
		// if options is array -> returns object with css value pairs
		// if options is object -> set new css values
		U.css = function (elem, options) {
			if (_type.String(options)) {
				return _getComputedStyle(elem)[_camelCase(options)];
			} else if (_type.Array(options)) {
				var
					obj = {},
					style = _getComputedStyle(elem);
				options.forEach(function (option, key) {
					obj[option] = style[_camelCase(option)];
				});
				return obj;
			} else {
				for (var option in options) {
					var val = options[option];
					if (val == parseFloat(val)) { // assume pixel for seemingly numerical values
						val += 'px';
					}
					elem.style[_camelCase(option)] = val;
				}
			}
		};

		return U;
	}(window || {}));


	ScrollMagic.Scene.prototype.addIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}

	return ScrollMagic;
}));

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/ssc.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=ssc.js.map