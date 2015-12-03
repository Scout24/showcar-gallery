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
	    isInitialized: false,
	
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
	            return _this.moveLeft(_this.itemWidth);
	        });
	        $('#right').click(function () {
	            return _this.moveRight(_this.itemWidth);
	        });
	        var ts;
	        this.el.on('touchstart', function (e) {
	            _this.init();
	            ts = e.touches[0].clientX;
	        });
	        this.el.on('click', this.init);
	
	        this.el.on('touchend', function (e) {
	            var te = e.changedTouches[0].clientX;
	            if (ts - te > 0) {
	                _this.moveRight(_this.itemWidth);
	            } else {
	                _this.moveLeft(_this.itemWidth);
	            }
	        });
	    },
	    init: function init() {
	        if (this.isInitialized) {
	            return;
	        }
	        $('[data-src]', this.el).each(function (item) {
	            item.src = item.data('src');
	        });
	        this.isInitialized = true;
	    },
	    moveLeft: function moveLeft(direction) {
	        this.moveItems(direction);
	        var last = this.el.children().last();
	        last.hide();
	        this.el.prepend(last);
	        var widthLeft = this.itemWidth + this.itemWidth / 2;
	        last.css('left', -widthLeft);
	        last.show();
	    },
	    moveRight: function moveRight(direction) {
	        this.moveItems(-direction);
	        var first = this.el.children().first();
	        first.hide();
	        this.el.append(first);
	        var widthRight = this.itemWidth + this.itemWidth + this.itemWidth / 2;
	        first.css('left', widthRight);
	        first.show();
	    },
	    moveItems: function moveItems(direction) {
	        this.el.children().each(function () {
	            var left = parseInt($(this).css('left'));
	            $(this).css('left', left + direction);
	        });
	    }
	});
	
	document.registerElement('as24-gallery', {
	    prototype: as24gallery
	});

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-gallery.js.map