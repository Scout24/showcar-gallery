/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var as24gallery = Object.assign(Object.create(HTMLElement.prototype), {
	
	    el: null,
	    itemWidth: 0,
	
	    createdCallback: function createdCallback() {
	        var _this = this;
	
	        this.el = $(this);
	        var firstChild = this.el.children().first();
	        this.itemWidth = firstChild.width();
	        this.itemWidth += parseInt(firstChild.css('margin-left'));
	        this.itemWidth += parseInt(firstChild.css('margin-right'));
	
	        //position elements
	        var itemCount = this.el.children().length;
	        var middleItem = Math.ceil(itemCount / 2);
	        this.el.children().each(function (index, item) {
	            //TODO: the center xpos needs to pe calculated in a proper way
	            //total width of container - half width of item
	            var xPos = _this.itemWidth / 2; // 100
	            var indexDiff = index + 1 - middleItem;
	            xPos += indexDiff * _this.itemWidth;
	            $(item).css('left', xPos);
	        });
	
	        //register event handlers
	        $('#left').click(function () {
	            return _this.paginate(_this.itemWidth);
	        });
	        $('#right').click(function () {
	            return _this.paginate(-_this.itemWidth);
	        });
	        var ts;
	        this.el.on('touchstart', function (e) {
	            ts = e.touches[0].clientX;
	        });
	
	        this.el.on('touchend', function (e) {
	            var te = e.changedTouches[0].clientX;
	            if (ts - te > 0) {
	                _this.paginate(-_this.itemWidth);
	            } else {
	                _this.paginate(_this.itemWidth);
	            }
	        });
	    },
	    paginate: function paginate(direction) {
	        this.el.children().each(function () {
	            var left = parseInt($(this).css('left'));
	            $(this).css('left', left + direction);
	        });
	        if (direction > 0) {
	            //left clicked, move last item to the beginning
	            var last = this.el.children().last();
	            last.hide();
	            this.el.prepend(last);
	            var widthLeft = this.itemWidth + this.itemWidth / 2;
	            last.css('left', -widthLeft);
	            last.show();
	        } else if (direction < 0) {
	            //right clicked, move first item to the end
	            var first = this.el.children().first();
	            first.hide();
	            this.el.append(first);
	            var widthRight = this.itemWidth + this.itemWidth + this.itemWidth / 2;
	            first.css('left', widthRight);
	            first.show();
	        }
	    }
	});
	
	document.registerElement('as24-gallery', {
	    prototype: as24gallery
	});

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-gallery.js.map