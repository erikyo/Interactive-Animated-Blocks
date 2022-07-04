(()=>{"use strict";var t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)};function e(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}t.d({},{E:()=>ct});const n={default:[{translateY:["1em",0],translateZ:0}],expo:[{scale:[15,1],opacity:[0,1]}],domino:[{rotateY:[-90,0],transformOrigin:"0 0"}],ghosting:[{translateX:[40,0],translateZ:0},{translateX:[0,-30],opacity:[1,0]}],elasticIn:[{scale:[0,1],elasticity:1200}],rain:[{translateY:["-2em",0],scaleX:[0,1],opacity:[0,1]}],snake:[{scaleX:[0,1],translateY:["1em",0],translateX:[".5em",0],translateZ:0,rotateZ:[90,0],transformOrigin:"100% 50%"}]},r=[];Object.keys(n).map((t=>r.push({label:t,value:t})));const a=function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"data";if(t){let n=[];n=t.split(";").map((t=>t.split(":")));const r={};return n.forEach(((t,n)=>{"style"===e?r[n]={property:t[0],value:t[1]}:r[t[0]]=t[1]})),r}return!1},i="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";var s={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},o={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},c=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],l={CSS:{},springs:{}};function u(t,e,n){return Math.min(Math.max(t,e),n)}function d(t,e){return t.indexOf(e)>-1}function h(t,e){return t.apply(null,e)}var g={arr:function(t){return Array.isArray(t)},obj:function(t){return d(Object.prototype.toString.call(t),"Object")},pth:function(t){return g.obj(t)&&t.hasOwnProperty("totalLength")},svg:function(t){return t instanceof SVGElement},inp:function(t){return t instanceof HTMLInputElement},dom:function(t){return t.nodeType||g.svg(t)},str:function(t){return"string"==typeof t},fnc:function(t){return"function"==typeof t},und:function(t){return void 0===t},nil:function(t){return g.und(t)||null===t},hex:function(t){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t)},rgb:function(t){return/^rgb/.test(t)},hsl:function(t){return/^hsl/.test(t)},col:function(t){return g.hex(t)||g.rgb(t)||g.hsl(t)},key:function(t){return!s.hasOwnProperty(t)&&!o.hasOwnProperty(t)&&"targets"!==t&&"keyframes"!==t}};function f(t){var e=/\(([^)]+)\)/.exec(t);return e?e[1].split(",").map((function(t){return parseFloat(t)})):[]}function m(t,e){var n=f(t),r=u(g.und(n[0])?1:n[0],.1,100),a=u(g.und(n[1])?100:n[1],.1,100),i=u(g.und(n[2])?10:n[2],.1,100),s=u(g.und(n[3])?0:n[3],.1,100),o=Math.sqrt(a/r),c=i/(2*Math.sqrt(a*r)),d=c<1?o*Math.sqrt(1-c*c):0,h=c<1?(c*o-s)/d:-s+o;function m(t){var n=e?e*t/1e3:t;return n=c<1?Math.exp(-n*c*o)*(1*Math.cos(d*n)+h*Math.sin(d*n)):(1+h*n)*Math.exp(-n*o),0===t||1===t?t:1-n}return e?m:function(){var e=l.springs[t];if(e)return e;for(var n=1/6,r=0,a=0;;)if(1===m(r+=n)){if(++a>=16)break}else a=0;var i=r*n*1e3;return l.springs[t]=i,i}}function p(t){return void 0===t&&(t=10),function(e){return Math.ceil(u(e,1e-6,1)*t)*(1/t)}}var v,y,w=function(){var t=.1;function e(t,e){return 1-3*e+3*t}function n(t,e){return 3*e-6*t}function r(t){return 3*t}function a(t,a,i){return((e(a,i)*t+n(a,i))*t+r(a))*t}function i(t,a,i){return 3*e(a,i)*t*t+2*n(a,i)*t+r(a)}return function(e,n,r,s){if(0<=e&&e<=1&&0<=r&&r<=1){var o=new Float32Array(11);if(e!==n||r!==s)for(var c=0;c<11;++c)o[c]=a(c*t,e,r);return function(c){return e===n&&r===s||0===c||1===c?c:a(function(n){for(var s=0,c=1;10!==c&&o[c]<=n;++c)s+=t;--c;var l=s+(n-o[c])/(o[c+1]-o[c])*t,u=i(l,e,r);return u>=.001?function(t,e,n,r){for(var s=0;s<4;++s){var o=i(e,n,r);if(0===o)return e;e-=(a(e,n,r)-t)/o}return e}(n,l,e,r):0===u?l:function(t,e,n,r,i){var s,o,c=0;do{(s=a(o=e+(n-e)/2,r,i)-t)>0?n=o:e=o}while(Math.abs(s)>1e-7&&++c<10);return o}(n,s,s+t,e,r)}(c),n,s)}}}}(),b=(v={linear:function(){return function(t){return t}}},y={Sine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},Circ:function(){return function(t){return 1-Math.sqrt(1-t*t)}},Back:function(){return function(t){return t*t*(3*t-2)}},Bounce:function(){return function(t){for(var e,n=4;t<((e=Math.pow(2,--n))-1)/11;);return 1/Math.pow(4,3-n)-7.5625*Math.pow((3*e-2)/22-t,2)}},Elastic:function(t,e){void 0===t&&(t=1),void 0===e&&(e=.5);var n=u(t,1,10),r=u(e,.1,2);return function(t){return 0===t||1===t?t:-n*Math.pow(2,10*(t-1))*Math.sin((t-1-r/(2*Math.PI)*Math.asin(1/n))*(2*Math.PI)/r)}}},["Quad","Cubic","Quart","Quint","Expo"].forEach((function(t,e){y[t]=function(){return function(t){return Math.pow(t,e+2)}}})),Object.keys(y).forEach((function(t){var e=y[t];v["easeIn"+t]=e,v["easeOut"+t]=function(t,n){return function(r){return 1-e(t,n)(1-r)}},v["easeInOut"+t]=function(t,n){return function(r){return r<.5?e(t,n)(2*r)/2:1-e(t,n)(-2*r+2)/2}},v["easeOutIn"+t]=function(t,n){return function(r){return r<.5?(1-e(t,n)(1-2*r))/2:(e(t,n)(2*r-1)+1)/2}}})),v);function x(t,e){if(g.fnc(t))return t;var n=t.split("(")[0],r=b[n],a=f(t);switch(n){case"spring":return m(t,e);case"cubicBezier":return h(w,a);case"steps":return h(p,a);default:return h(r,a)}}function I(t){try{return document.querySelectorAll(t)}catch(t){return}}function O(t,e){for(var n=t.length,r=arguments.length>=2?arguments[1]:void 0,a=[],i=0;i<n;i++)if(i in t){var s=t[i];e.call(r,s,i,t)&&a.push(s)}return a}function S(t){return t.reduce((function(t,e){return t.concat(g.arr(e)?S(e):e)}),[])}function D(t){return g.arr(t)?t:(g.str(t)&&(t=I(t)||t),t instanceof NodeList||t instanceof HTMLCollection?[].slice.call(t):[t])}function k(t,e){return t.some((function(t){return t===e}))}function P(t){var e={};for(var n in t)e[n]=t[n];return e}function M(t,e){var n=P(t);for(var r in t)n[r]=e.hasOwnProperty(r)?e[r]:t[r];return n}function C(t,e){var n=P(t);for(var r in e)n[r]=g.und(t[r])?e[r]:t[r];return n}function E(t){var e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(t);if(e)return e[1]}function V(t,e){return g.fnc(t)?t(e.target,e.id,e.total):t}function T(t,e){return t.getAttribute(e)}function A(t,e,n){if(k([n,"deg","rad","turn"],E(e)))return e;var r=l.CSS[e+n];if(!g.und(r))return r;var a=document.createElement(t.tagName),i=t.parentNode&&t.parentNode!==document?t.parentNode:document.body;i.appendChild(a),a.style.position="absolute",a.style.width=100+n;var s=100/a.offsetWidth;i.removeChild(a);var o=s*parseFloat(e);return l.CSS[e+n]=o,o}function L(t,e,n){if(e in t.style){var r=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),a=t.style[e]||getComputedStyle(t).getPropertyValue(r)||"0";return n?A(t,a,n):a}}function q(t,e){return g.dom(t)&&!g.inp(t)&&(!g.nil(T(t,e))||g.svg(t)&&t[e])?"attribute":g.dom(t)&&k(c,e)?"transform":g.dom(t)&&"transform"!==e&&L(t,e)?"css":null!=t[e]?"object":void 0}function B(t){if(g.dom(t)){for(var e,n=t.style.transform||"",r=/(\w+)\(([^)]*)\)/g,a=new Map;e=r.exec(n);)a.set(e[1],e[2]);return a}}function F(t,e,n,r){switch(q(t,e)){case"transform":return function(t,e,n,r){var a=d(e,"scale")?1:0+function(t){return d(t,"translate")||"perspective"===t?"px":d(t,"rotate")||d(t,"skew")?"deg":void 0}(e),i=B(t).get(e)||a;return n&&(n.transforms.list.set(e,i),n.transforms.last=e),r?A(t,i,r):i}(t,e,r,n);case"css":return L(t,e,n);case"attribute":return T(t,e);default:return t[e]||0}}function H(t,e){var n=/^(\*=|\+=|-=)/.exec(t);if(!n)return t;var r=E(t)||0,a=parseFloat(e),i=parseFloat(t.replace(n[0],""));switch(n[0][0]){case"+":return a+i+r;case"-":return a-i+r;case"*":return a*i+r}}function Y(t,e){if(g.col(t))return function(t){return g.rgb(t)?(n=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e=t))?"rgba("+n[1]+",1)":e:g.hex(t)?function(t){var e=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(t,e,n,r){return e+e+n+n+r+r})),n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return"rgba("+parseInt(n[1],16)+","+parseInt(n[2],16)+","+parseInt(n[3],16)+",1)"}(t):g.hsl(t)?function(t){var e,n,r,a=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(t),i=parseInt(a[1],10)/360,s=parseInt(a[2],10)/100,o=parseInt(a[3],10)/100,c=a[4]||1;function l(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*(e-t)*n:n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}if(0==s)e=n=r=o;else{var u=o<.5?o*(1+s):o+s-o*s,d=2*o-u;e=l(d,u,i+1/3),n=l(d,u,i),r=l(d,u,i-1/3)}return"rgba("+255*e+","+255*n+","+255*r+","+c+")"}(t):void 0;var e,n}(t);if(/\s/g.test(t))return t;var n=E(t),r=n?t.substr(0,t.length-n.length):t;return e?r+e:r}function j(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function _(t){for(var e,n=t.points,r=0,a=0;a<n.numberOfItems;a++){var i=n.getItem(a);a>0&&(r+=j(e,i)),e=i}return r}function N(t){if(t.getTotalLength)return t.getTotalLength();switch(t.tagName.toLowerCase()){case"circle":return function(t){return 2*Math.PI*T(t,"r")}(t);case"rect":return function(t){return 2*T(t,"width")+2*T(t,"height")}(t);case"line":return function(t){return j({x:T(t,"x1"),y:T(t,"y1")},{x:T(t,"x2"),y:T(t,"y2")})}(t);case"polyline":return _(t);case"polygon":return function(t){var e=t.points;return _(t)+j(e.getItem(e.numberOfItems-1),e.getItem(0))}(t)}}function R(t,e){var n=e||{},r=n.el||function(t){for(var e=t.parentNode;g.svg(e)&&g.svg(e.parentNode);)e=e.parentNode;return e}(t),a=r.getBoundingClientRect(),i=T(r,"viewBox"),s=a.width,o=a.height,c=n.viewBox||(i?i.split(" "):[0,0,s,o]);return{el:r,viewBox:c,x:c[0]/1,y:c[1]/1,w:s,h:o,vW:c[2],vH:c[3]}}function W(t,e,n){function r(n){void 0===n&&(n=0);var r=e+n>=1?e+n:0;return t.el.getPointAtLength(r)}var a=R(t.el,t.svg),i=r(),s=r(-1),o=r(1),c=n?1:a.w/a.vW,l=n?1:a.h/a.vH;switch(t.property){case"x":return(i.x-a.x)*c;case"y":return(i.y-a.y)*l;case"angle":return 180*Math.atan2(o.y-s.y,o.x-s.x)/Math.PI}}function $(t,e){var n=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,r=Y(g.pth(t)?t.totalLength:t,e)+"";return{original:r,numbers:r.match(n)?r.match(n).map(Number):[0],strings:g.str(t)||e?r.split(n):[]}}function z(t){return O(t?S(g.arr(t)?t.map(D):D(t)):[],(function(t,e,n){return n.indexOf(t)===e}))}function X(t){var e=z(t);return e.map((function(t,n){return{target:t,id:n,total:e.length,transforms:{list:B(t)}}}))}function Z(t,e){var n=P(e);if(/^spring/.test(n.easing)&&(n.duration=m(n.easing)),g.arr(t)){var r=t.length;2!==r||g.obj(t[0])?g.fnc(e.duration)||(n.duration=e.duration/r):t={value:t}}var a=g.arr(t)?t:[t];return a.map((function(t,n){var r=g.obj(t)&&!g.pth(t)?t:{value:t};return g.und(r.delay)&&(r.delay=n?0:e.delay),g.und(r.endDelay)&&(r.endDelay=n===a.length-1?e.endDelay:0),r})).map((function(t){return C(t,n)}))}var J={css:function(t,e,n){return t.style[e]=n},attribute:function(t,e,n){return t.setAttribute(e,n)},object:function(t,e,n){return t[e]=n},transform:function(t,e,n,r,a){if(r.list.set(e,n),e===r.last||a){var i="";r.list.forEach((function(t,e){i+=e+"("+t+") "})),t.style.transform=i}}};function G(t,e){X(t).forEach((function(t){for(var n in e){var r=V(e[n],t),a=t.target,i=E(r),s=F(a,n,i,t),o=H(Y(r,i||E(s)),s),c=q(a,n);J[c](a,n,o,t.transforms,!0)}}))}function Q(t,e){return O(S(t.map((function(t){return e.map((function(e){return function(t,e){var n=q(t.target,e.name);if(n){var r=function(t,e){var n;return t.tweens.map((function(r){var a=function(t,e){var n={};for(var r in t){var a=V(t[r],e);g.arr(a)&&1===(a=a.map((function(t){return V(t,e)}))).length&&(a=a[0]),n[r]=a}return n.duration=parseFloat(n.duration),n.delay=parseFloat(n.delay),n}(r,e),i=a.value,s=g.arr(i)?i[1]:i,o=E(s),c=F(e.target,t.name,o,e),l=n?n.to.original:c,u=g.arr(i)?i[0]:l,d=E(u)||E(c),h=o||d;return g.und(s)&&(s=l),a.from=$(u,h),a.to=$(H(s,u),h),a.start=n?n.end:0,a.end=a.start+a.delay+a.duration+a.endDelay,a.easing=x(a.easing,a.duration),a.isPath=g.pth(i),a.isPathTargetInsideSVG=a.isPath&&g.svg(e.target),a.isColor=g.col(a.from.original),a.isColor&&(a.round=1),n=a,a}))}(e,t),a=r[r.length-1];return{type:n,property:e.name,animatable:t,tweens:r,duration:a.end,delay:r[0].delay,endDelay:a.endDelay}}}(t,e)}))}))),(function(t){return!g.und(t)}))}function K(t,e){var n=t.length,r=function(t){return t.timelineOffset?t.timelineOffset:0},a={};return a.duration=n?Math.max.apply(Math,t.map((function(t){return r(t)+t.duration}))):e.duration,a.delay=n?Math.min.apply(Math,t.map((function(t){return r(t)+t.delay}))):e.delay,a.endDelay=n?a.duration-Math.max.apply(Math,t.map((function(t){return r(t)+t.duration-t.endDelay}))):e.endDelay,a}var U=0,tt=[],et=function(){var t;function e(n){for(var r=tt.length,a=0;a<r;){var i=tt[a];i.paused?(tt.splice(a,1),r--):(i.tick(n),a++)}t=a>0?requestAnimationFrame(e):void 0}return"undefined"!=typeof document&&document.addEventListener("visibilitychange",(function(){rt.suspendWhenDocumentHidden&&(nt()?t=cancelAnimationFrame(t):(tt.forEach((function(t){return t._onDocumentVisibility()})),et()))})),function(){t||nt()&&rt.suspendWhenDocumentHidden||!(tt.length>0)||(t=requestAnimationFrame(e))}}();function nt(){return!!document&&document.hidden}function rt(t){void 0===t&&(t={});var e,n=0,r=0,a=0,i=0,c=null;function l(t){var e=window.Promise&&new Promise((function(t){return c=t}));return t.finished=e,e}var d=function(t){var e=M(s,t),n=M(o,t),r=function(t,e){var n=[],r=e.keyframes;for(var a in r&&(e=C(function(t){for(var e=O(S(t.map((function(t){return Object.keys(t)}))),(function(t){return g.key(t)})).reduce((function(t,e){return t.indexOf(e)<0&&t.push(e),t}),[]),n={},r=function(r){var a=e[r];n[a]=t.map((function(t){var e={};for(var n in t)g.key(n)?n==a&&(e.value=t[n]):e[n]=t[n];return e}))},a=0;a<e.length;a++)r(a);return n}(r),e)),e)g.key(a)&&n.push({name:a,tweens:Z(e[a],t)});return n}(n,t),a=X(t.targets),i=Q(a,r),c=K(i,n),l=U;return U++,C(e,{id:l,children:[],animatables:a,animations:i,duration:c.duration,delay:c.delay,endDelay:c.endDelay})}(t);function h(){var t=d.direction;"alternate"!==t&&(d.direction="normal"!==t?"normal":"reverse"),d.reversed=!d.reversed,e.forEach((function(t){return t.reversed=d.reversed}))}function f(t){return d.reversed?d.duration-t:t}function m(){n=0,r=f(d.currentTime)*(1/rt.speed)}function p(t,e){e&&e.seek(t-e.timelineOffset)}function v(t){for(var e=0,n=d.animations,r=n.length;e<r;){var a=n[e],i=a.animatable,s=a.tweens,o=s.length-1,c=s[o];o&&(c=O(s,(function(e){return t<e.end}))[0]||c);for(var l=u(t-c.start-c.delay,0,c.duration)/c.duration,h=isNaN(l)?1:c.easing(l),g=c.to.strings,f=c.round,m=[],p=c.to.numbers.length,v=void 0,y=0;y<p;y++){var w=void 0,b=c.to.numbers[y],x=c.from.numbers[y]||0;w=c.isPath?W(c.value,h*b,c.isPathTargetInsideSVG):x+h*(b-x),f&&(c.isColor&&y>2||(w=Math.round(w*f)/f)),m.push(w)}var I=g.length;if(I){v=g[0];for(var S=0;S<I;S++){g[S];var D=g[S+1],k=m[S];isNaN(k)||(v+=D?k+D:k+" ")}}else v=m[0];J[a.type](i.target,a.property,v,i.transforms),a.currentValue=v,e++}}function y(t){d[t]&&!d.passThrough&&d[t](d)}function w(t){var s=d.duration,o=d.delay,g=s-d.endDelay,m=f(t);d.progress=u(m/s*100,0,100),d.reversePlayback=m<d.currentTime,e&&function(t){if(d.reversePlayback)for(var n=i;n--;)p(t,e[n]);else for(var r=0;r<i;r++)p(t,e[r])}(m),!d.began&&d.currentTime>0&&(d.began=!0,y("begin")),!d.loopBegan&&d.currentTime>0&&(d.loopBegan=!0,y("loopBegin")),m<=o&&0!==d.currentTime&&v(0),(m>=g&&d.currentTime!==s||!s)&&v(s),m>o&&m<g?(d.changeBegan||(d.changeBegan=!0,d.changeCompleted=!1,y("changeBegin")),y("change"),v(m)):d.changeBegan&&(d.changeCompleted=!0,d.changeBegan=!1,y("changeComplete")),d.currentTime=u(m,0,s),d.began&&y("update"),t>=s&&(r=0,d.remaining&&!0!==d.remaining&&d.remaining--,d.remaining?(n=a,y("loopComplete"),d.loopBegan=!1,"alternate"===d.direction&&h()):(d.paused=!0,d.completed||(d.completed=!0,y("loopComplete"),y("complete"),!d.passThrough&&"Promise"in window&&(c(),l(d)))))}return l(d),d.reset=function(){var t=d.direction;d.passThrough=!1,d.currentTime=0,d.progress=0,d.paused=!0,d.began=!1,d.loopBegan=!1,d.changeBegan=!1,d.completed=!1,d.changeCompleted=!1,d.reversePlayback=!1,d.reversed="reverse"===t,d.remaining=d.loop,e=d.children;for(var n=i=e.length;n--;)d.children[n].reset();(d.reversed&&!0!==d.loop||"alternate"===t&&1===d.loop)&&d.remaining++,v(d.reversed?d.duration:0)},d._onDocumentVisibility=m,d.set=function(t,e){return G(t,e),d},d.tick=function(t){a=t,n||(n=a),w((a+(r-n))*rt.speed)},d.seek=function(t){w(f(t))},d.pause=function(){d.paused=!0,m()},d.play=function(){d.paused&&(d.completed&&d.reset(),d.paused=!1,tt.push(d),m(),et())},d.reverse=function(){h(),d.completed=!d.reversed,m()},d.restart=function(){d.reset(),d.play()},d.remove=function(t){it(z(t),d)},d.reset(),d.autoplay&&d.play(),d}function at(t,e){for(var n=e.length;n--;)k(t,e[n].animatable.target)&&e.splice(n,1)}function it(t,e){var n=e.animations,r=e.children;at(t,n);for(var a=r.length;a--;){var i=r[a],s=i.animations;at(t,s),s.length||i.children.length||r.splice(a,1)}n.length||r.length||e.pause()}rt.version="3.2.1",rt.speed=1,rt.suspendWhenDocumentHidden=!0,rt.running=tt,rt.remove=function(t){for(var e=z(t),n=tt.length;n--;)it(e,tt[n])},rt.get=F,rt.set=G,rt.convertPx=A,rt.path=function(t,e){var n=g.str(t)?I(t)[0]:t,r=e||100;return function(t){return{property:t,el:n,svg:R(n),totalLength:N(n)*(r/100)}}},rt.setDashoffset=function(t){var e=N(t);return t.setAttribute("stroke-dasharray",e),e},rt.stagger=function(t,e){void 0===e&&(e={});var n=e.direction||"normal",r=e.easing?x(e.easing):null,a=e.grid,i=e.axis,s=e.from||0,o="first"===s,c="center"===s,l="last"===s,u=g.arr(t),d=u?parseFloat(t[0]):parseFloat(t),h=u?parseFloat(t[1]):0,f=E(u?t[1]:t)||0,m=e.start||0+(u?d:0),p=[],v=0;return function(t,e,g){if(o&&(s=0),c&&(s=(g-1)/2),l&&(s=g-1),!p.length){for(var y=0;y<g;y++){if(a){var w=c?(a[0]-1)/2:s%a[0],b=c?(a[1]-1)/2:Math.floor(s/a[0]),x=w-y%a[0],I=b-Math.floor(y/a[0]),O=Math.sqrt(x*x+I*I);"x"===i&&(O=-x),"y"===i&&(O=-I),p.push(O)}else p.push(Math.abs(s-y));v=Math.max.apply(Math,p)}r&&(p=p.map((function(t){return r(t/v)*v}))),"reverse"===n&&(p=p.map((function(t){return i?t<0?-1*t:-t:Math.abs(v-t)})))}return m+(u?(h-d)/v:d)*(Math.round(100*p[e])/100)+f}},rt.timeline=function(t){void 0===t&&(t={});var e=rt(t);return e.duration=0,e.add=function(n,r){var a=tt.indexOf(e),i=e.children;function s(t){t.passThrough=!0}a>-1&&tt.splice(a,1);for(var c=0;c<i.length;c++)s(i[c]);var l=C(n,M(o,t));l.targets=l.targets||t.targets;var u=e.duration;l.autoplay=!1,l.direction=e.direction,l.timelineOffset=g.und(r)?u:H(r,u),s(e),e.seek(l.timelineOffset);var d=rt(l);s(d),i.push(d);var h=K(i,t);return e.delay=h.delay,e.endDelay=h.endDelay,e.duration=h.duration,e.seek(0),e.reset(),e.autoplay&&e.play(),e},e},rt.easing=x,rt.penner=b,rt.random=function(t,e){return Math.floor(Math.random()*(e-t+1))+t};const st=rt;class ot{constructor(t){var r=this;e(this,"delay",(t=>new Promise((e=>setTimeout(e,t))))),e(this,"unmount",(t=>{t.unWatch()})),e(this,"parallaxController",(t=>{this.parallaxed[t.target.sscItemData.sscItem]=t.target,this.parallaxed.length&&this.parallax(),"leave"===t.target.action&&(this.parallaxed=this.parallaxed.filter((e=>e.sscItemData.sscItem!==t.target.sscItemData.sscItem)),console.log(`ssc-${t.target.sscItemData.sscItem} will be unwatched. current list`,this.parallaxed))})),e(this,"init",(()=>{if(this.collected=this.page.querySelectorAll(".ssc"),this.updateScreenSize(),console.log("SSC ready"),"IntersectionObserver"in window){if(this.observer=new IntersectionObserver(this.screenControl,{root:null,rootMargin:ct.rootMargin,threshold:ct.threshold}),this.collected.forEach((function(t,e){t.dataset.sscItem=e,t.unWatch=this.observer.unobserve(t),t.sscItemData=t.dataset,t.sscItemOpts=t.dataset.sscProps?a(t.dataset.sscProps,"data"):null,t.sscSequence=t.dataset&&t.dataset.sscSequence?a(t.dataset.sscSequence,"style"):null,this.observer.observe(t)}),this),Object.values(this.collected).filter((t=>"sscAnimation"===t.sscItemData.sscAnimation))){const t=document.createElement("link");t.rel="stylesheet",t.id="ssc_animate-css",t.href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",document.head.appendChild(t)}this.parallax(),this.interceptor(this.page),window.addEventListener("resize",this.updateScreenSize)}else console.warn("IntersectionObserver could not enabled")})),e(this,"screenControl",((t,e)=>{this.scrollDirection(),t.forEach((t=>{if(t.target.dataset.lock)return!0;if(t.target.dataset.intersection=this.windowData.viewHeight/2>t.boundingClientRect.top?"up":"down",t.target.action=t.isIntersecting!==t.target.dataset.visible?t.isIntersecting?"enter":"leave":"",t.target.dataset.visible=t.isIntersecting?"true":"false",t.target.action)switch(t.target.sscItemData.sscAnimation){case"sscParallax":this.parallaxController(t);break;case"sscAnimation":this.handleAnimation(t,t.target.action);break;case"sscSequence":this.animationSequence(t,t.target.action);break;case"sscSvgPath":t.target.style.opacity=0,t.target.style.transition="350ms",this.animationSvgPath(t,t.target.action);break;case"sscScrollJacking":t.target.style.minHeight="100.5vh",t.target.style.margin=0,this.scrollJacking(t);break;case"sscCounter":this.animateCount(t);break;case"sscVideoFocusPlay":this.videoFocusPlay(t);break;case"sscVideoControl":this.parallaxVideoController(t);break;case"sscVideoScroll":this.videoWheelController(t);break;case"ssc360":this.video360Controller(t);break;case"sscLevitate":this.itemLevition(t);break;case"sscTextStagger":this.textStagger(t);break;default:console.log(`JS action ${t.target.sscItemData.sscAnimation} missing for ${t.target.sscItemData.sscItem}`)}})),this.windowData.lastScrollPosition=window.pageYOffset})),e(this,"videoFocusPlay",(t=>{const e=t.target.querySelector("video");return"true"===t.target.dataset.visible?this.playVideo(e):e.ended?this.stopVideo(e):e.pause()})),e(this,"playVideo",(t=>t.play())),e(this,"stopVideo",(t=>{t.pause(),t.currentTime=0})),e(this,"handleAnimation",((t,e)=>{"enter"===e&&this.checkVisibility(t.target,"between",50)?(t.target.classList.remove("animate__animated","animate__"+t.target.sscItemOpts.animationExit),t.target.classList.add("animate__animated","animate__"+t.target.sscItemOpts.animationEnter),e="leave"):"leave"!==e||this.checkVisibility(t.target,"between",50)||(t.target.classList.remove("animate__animated","animate__"+t.target.sscItemOpts.animationEnter),t.target.sscItemOpts.animationExit&&t.target.classList.add("animate__animated","animate__"+t.target.sscItemOpts.animationExit),e="enter"),this.checkVisibility(t.target,"partiallyVisible")&&this.delay(100).then((()=>{this.handleAnimation(t,e)}))})),e(this,"animationSequence",((t,e)=>{const n=t.target.sscSequence||{};if(!this.animations[t.target.sscItemData.sscItem]){let e=0;const r={};if(Object.entries(n).forEach((t=>{"duration"===t[1].property?(r[e]={...r[e],duration:t[1].value+"ms"},e++):r[e]={...r[e],[t[1].property]:t[1].value}})),r[0]){const e=st.timeline({targets:t.target,autoplay:!1,easing:"easeOutExpo",direction:"normal",complete(e){console.log(e),t.target.removeAttribute("data-visible"),t.target.removeAttribute("data-ssc-lock")}});Object.entries(r).forEach((t=>{e.add(t[1])})),this.animations[t.target.sscItemData.sscItem]=e}}"enter"===e&&this.checkVisibility(t.target,"between",25)?(e="leave",this.animations[t.target.sscItemData.sscItem].play()):"leave"!==e||this.checkVisibility(t.target,"between",25)||(e="enter",this.animations[t.target.sscItemData.sscItem].pause()),this.checkVisibility(t.target,"partiallyVisible")&&this.delay(100).then((()=>{this.animationSequence(t,e)}))})),e(this,"animationSvgPath",(function(t,e){let n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=n||st;const i=t.target.querySelectorAll("path");"enter"===e&&r.checkVisibility(t.target,"between",25)?(t.target.style.opacity=1,e="leave",a.began&&0!==a.currentTime?a.reverse():a=st({targets:i,strokeDashoffset:[st.setDashoffset,0],easing:"easeInOutSine",duration:t.target.sscItemOpts.duration||5e3,delay:(e,n)=>n*t.target.sscItemOpts.duration/i.length,direction:"normal"})):"leave"!==e||r.checkVisibility(t.target,"between",25)||(e="enter",a.completed||"function"!=typeof a.reverse?a=st({targets:i,strokeDashoffset:[st.setDashoffset,0],easing:"easeInOutSine",duration:t.target.sscItemOpts.duration,delay:(e,n)=>n*t.target.sscItemOpts.duration/i.length,direction:"reverse",complete:()=>{if("leave"===e)return t.target.style.opacity=0}}):a.reverse()),r.checkVisibility(t.target,"partiallyVisible")&&r.delay(100).then((()=>{r.animationSvgPath(t,e,a)}))})),e(this,"itemLevition",(t=>t.target.style.backgroundColor="red")),e(this,"scrollJacking",(t=>{"enter"===t.target.action&&!1===this.hasScrolling&&(this.hasScrolling=t.target.sscItemOpts.sscItem),"leave"===t.target.action&&this.delay(500).then((()=>{t.target.classList.remove("sscLastScrolled")}));const e=t=>{t.preventDefault()};this.checkVisibility(t.target,"partiallyVisible")&&(t=>{this.isScrolling>Date.now()||this.checkVisibility(t.target,"between",t.target.sscItemOpts.intersection)||(window.addEventListener("mousewheel",e,{passive:!1}),this.isScrolling=Date.now()+parseInt(t.target.sscItemOpts.duration,10)+100,t.target.classList.add("sscLastScrolled"),st.remove(),st({targets:[window.document.scrollingElement||window.document.body||window.document.documentElement],scrollTop:t.target.offsetTop,easing:t.target.sscItemOpts.easing||"linear",duration:t.target.sscItemOpts.duration||500,complete:()=>{window.removeEventListener("mousewheel",e,{passive:!1}),window.scroll(0,t.target.offsetTop),this.hasScrolling=!1}}))})(t)})),e(this,"videoOnWheel",(t=>{t.preventDefault();const e=t.target;if(e.currentTime<=0&&t.deltaY<0||e.currentTime===e.duration&&t.deltaY>0)return console.log("unlocked"),e.removeEventListener(i,this.videoOnWheel),!0;e.readyState>=1&&window.requestAnimationFrame((()=>{const n=t.deltaY>0?1/29.7:1/29.7*-1;e.currentTime=e.currentTime+n*t.target.playbackRatio}))})),e(this,"scaleImage",(t=>new Promise((e=>{let n=1;return t.onmousewheel=e=>{e.preventDefault(),n+=-.01*e.deltaY,n=Math.min(Math.max(.125,n),4),t.style.transform=`scale(${n})`},e})))),this.page=t.page||document.body,this.touchPos=!1,this.updateScreenSize=this.updateScreenSize.bind(this),this.observer=[],this.collected=[],this.scheduledAnimationFrame=!1,this.parallaxed=[],this.parallax=this.parallax.bind(this),this.videoParallaxed=[],this.parallaxVideo=this.parallaxVideo.bind(this),this.animations=[],this.staggerPresets=n,this.hasScrolling=!1,this.isScrolling=Date.now()+2e3,this.windowData={viewHeight:window.innerHeight,lastScrollPosition:window.pageYOffset},this.page.ontouchstart=this.touchstartEvent.bind(this),this.page.ontouchmove=this.ontouchmoveEvent.bind(this),this.init()}touchstartEvent(t){this.touchPos=t.changedTouches[0].clientY}ontouchmoveEvent(t){const e=t.changedTouches[0].clientY;e>this.touchPos&&console.log("finger moving down"),e<this.touchPos&&console.log("finger moving up")}updateScreenSize(){(async()=>await(()=>console.log("Old Screensize",this.windowData)))().then((()=>this.delay(250))).then((()=>{this.windowData={viewHeight:window.innerHeight,lastScrollPosition:window.pageYOffset},console.warn("New Screensize",this.windowData)}))}checkVisibility(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"crossing",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:100;const r=t.getBoundingClientRect();switch(e){case"partiallyVisible":return this.isPartiallyVisible(r);case"visible":return this.isFullyVisible(r);case"crossing":return this.isCrossing(r,n);case"between":return this.isBeetween(r,n)}}isPartiallyVisible(t){return t.top<this.windowData.viewHeight&&t.bottom>0}isFullyVisible(t){return t.top>=0&&t.bottom<=this.windowData.viewHeight}isCrossing(t,e){const n=this.windowData.viewHeight*(.01*e);return t.top<n&&t.bottom>n}isBeetween(t,e){const n=this.windowData.viewHeight*(.005*e),r=t.top+.5*t.height;return r>n&&r<this.windowData.viewHeight-n}scrollDirection(){this.windowData.lastScrollPosition<window.pageYOffset?document.body.dataset.direction="down":this.windowData.lastScrollPosition>window.pageYOffset&&(document.body.dataset.direction="up")}parallax(){if(void 0!==this.parallaxed&&this.parallaxed.length){if(window.pageYOffset===this.windowData.lastScrollPosition)return void window.requestAnimationFrame(this.parallax);this.parallaxed.forEach((t=>{const e=this.windowData.viewHeight-t.getBoundingClientRect().top;if(e>0){const n=t.sscItemOpts.speed*t.sscItemOpts.level*e*-.2;t.style.transform="translate3d("+("Y"===t.sscItemOpts.direction?"0,"+n+"px":n+"px,0")+",0)"}window.requestAnimationFrame(this.parallax),this.windowData.lastScrollPosition=window.pageYOffset}))}return!1}initMutationObserver(t,e){t.forEach((function(t){t.addedNodes.forEach((function(t){if("function"!=typeof t.getElementsByTagName)return;const e=t.querySelectorAll(".ssc");e.length&&e.forEach((function(t){this.observer.observe(t)}))}))}))}interceptor(t){this.mutationObserver=new MutationObserver(this.initMutationObserver),this.mutationObserver.observe(t,{attributes:!1,childList:!0,subtree:!0})}animateCount(t){if(t.target.dataset.sscCount)return!0;t.target.dataset.sscCount="true",st({targets:t.target||t.target.lastChild,textContent:[0,parseInt(t.target.lastChild.textContent,10)],round:1,duration:t.target.sscItemOpts.duration||5e3,easing:t.target.sscItemOpts.easing,complete:()=>t.target.removeAttribute("data-ssc-count")})}textStagger(t){const e=t.target;if("enter"===e.action&&this.checkVisibility(t.target,"between",25)){const t=e.sscItemOpts.preset,r=e.sscItemOpts.duration,a=e.sscItemOpts.easing,i=e.sscItemOpts.splitBy||"letter",s="word"===i?/\w+ |\S+/g:/\S/g,o=e.lastChild.textContent.replace(s,`<span class="${e.sscItemOpts.splitBy}">$&</span>`);e.lastChild.innerHTML?e.lastChild.innerHTML=o:e.innerHTML=o,e.style.position="relative";const c=st.timeline({loop:!1,autoplay:!1});return this.staggerPresets[t].forEach(((s,o)=>{switch(o){case 0:c.add({...n[t][o],targets:e.querySelectorAll("."+i),duration:.75*r,easing:a,delay:(t,e)=>r*e*.05,...s});break;case 1:c.add({...n[t][o]||null,targets:e,easing:a,duration:r,delay:r,...s});break;default:c.add({...n[t][o]||null,targets:e,easing:a,...s})}})),c.play()}this.delay(200).then((()=>this.textStagger(t)))}parallaxVideo(){if(void 0!==this.videoParallaxed||Object.keys(this.videoParallaxed).length){if(window.pageYOffset===this.windowData.lastScrollPosition)return void window.requestAnimationFrame(this.parallaxVideo);this.windowData.lastScrollPosition=window.pageYOffset,this.videoParallaxed.forEach((t=>{if(t.readyState>1){const e=t.getBoundingClientRect();t.currentTime=((1+-(e.top+this.windowData.viewHeight)/(2*this.windowData.viewHeight))*t.videoLenght).toFixed(2).toString()}return window.requestAnimationFrame(this.parallaxVideo)}))}return!1}parallaxVideoController(t){const e=t.target.querySelector("video");"enter"===t.target.action?(this.videoParallaxed[t.target.sscItemData.sscItem]=e,this.videoParallaxed[t.target.sscItemData.sscItem].videoLenght=e.duration,this.videoParallaxed[t.target.sscItemData.sscItem].sscItemData=t.target.sscItemData,this.parallaxVideo()):"leave"===t.target.action&&(this.videoParallaxed=this.videoParallaxed.filter((e=>e.sscItemData.sscItem!==t.target.sscItemData.sscItem)))}hasMouseOver(t){const e=t,n=t,r=t.target.getBoundingClientRect();return r.left<e<r.right&&r.top<n<r.bottom}videoWheelController(t){const e=t.target.querySelector("video");e.playbackRatio=t.target.sscItemOpts.playbackRatio,e.controls=!1,e.muted=!0,e.pause(),e.addEventListener(i,this.videoOnWheel)}handleVideo360(t){const e=t.target;window.requestAnimationFrame((function(){const n=e.getBoundingClientRect();e.readyState>2&&(e.currentTime=(t.clientX-n.left)/n.width*e.duration*e.spinRatio)}))}video360Controller(t){const e=t.target.querySelector("video");e.spinRatio=t.target.sscItemOpts.spinRatio,"enter"===t.target.action?e.onmousemove=this.handleVideo360:"leave"===t.target.action&&(e.onmousemove=null)}}const ct={rootMargin:"0px",threshold:[0],container:document.querySelector(".wp-site-blocks")};window.addEventListener("load",(()=>{const t={page:ct.container};window.screenControl,window.screenControl=new ot(t)}))})();