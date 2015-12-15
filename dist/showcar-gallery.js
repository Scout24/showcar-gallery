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
	    itemName: 'as24-gallery-item',
	
	    createdCallback: function createdCallback() {
	        var _this = this;
	
	        this.el = $(this);
	        //wait for first element to be loaded and position items afterwards
	        //TODO: think about a solution if the load event won't occur
	        // --> maybe only use the load event if there is a gallery item without width
	        $('img[src]', this.el).first().on('load', function () {
	            _this.itemWidth = _this.calculateItemWidth();
	            _this.positionElements();
	        });
	        if (this.isEdgecase()) {
	            this.handleEdgecases();
	            return;
	        }
	
	        //register event handlers
	        $('.left', this.el).click(function () {
	            return _this.moveLeft(_this.itemWidth);
	        });
	        $('.right', this.el).click(function () {
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
	        this.pager();
	    },
	    pager: function pager() {
	        var totalNumber = this.el.children(this.itemName).length;
	        // how to get the current Element?
	        var currentElement = $(this.el.children(this.itemName)[2]).data('number');
	        $('.pager', this.el).html(currentElement + '/' + totalNumber);
	    },
	    calculateItemWidth: function calculateItemWidth() {
	        var firstChild = this.el.children(this.itemName).first();
	        var itemWidth = firstChild.width();
	        itemWidth += parseInt(firstChild.css('margin-left'));
	        itemWidth += parseInt(firstChild.css('margin-right'));
	
	        return itemWidth;
	    },
	
	    //TODO: rename 'init' to something that is more specific, e.g. lazyLoadImages()
	    init: function init() {
	        if (this.isInitialized) {
	            return;
	        }
	        $('[data-src]', this.el).each(function (index, item) {
	            item.src = $(item).data('src');
	        });
	        this.isInitialized = true;
	    },
	    isEdgecase: function isEdgecase() {
	        return this.el.children(this.itemName).length < 3;
	    },
	    handleEdgecases: function handleEdgecases() {
	        var _this2 = this;
	
	        $('.left, .right, .pager', this.el).hide();
	
	        switch (this.el.children(this.itemName).length) {
	            case 0:
	                // no image
	                // display dummy element
	                $('.placeholder', this.el).show();
	                break;
	            case 1:
	                // one image
	                // center aligned
	                var item = this.el.children(this.itemName);
	                var centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
	                $(item).css('left', centerPos);
	                break;
	            case 2:
	                // two images
	                // left/right aligned
	                this.el.children(this.itemName).each(function (index, item) {
	                    $(item).css('left', index * _this2.itemWidth);
	                });
	                break;
	        }
	    },
	    positionElements: function positionElements() {
	        var _this3 = this;
	
	        var itemCount = this.el.children(this.itemName).length;
	        var middleItem = Math.ceil(itemCount / 2);
	        var centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
	
	        this.el.children(this.itemName).each(function (index, item) {
	            if (index < itemCount / 2) {
	                _this3.el.append(item);
	            }
	        });
	
	        this.el.children(this.itemName).each(function (index, item) {
	            var indexDiff = index + 1 - middleItem;
	            $(item).css('left', centerPos + indexDiff * _this3.itemWidth);
	        });
	    },
	    moveLeft: function moveLeft(direction) {
	        var firstElement = this.el.children(this.itemName).first();
	        var firstLeft = firstElement.position()['left'];
	        this.moveItems(direction);
	        var last = this.el.children(this.itemName).last();
	        last.hide().insertBefore(firstElement).css('left', firstLeft).show();
	        this.pager();
	    },
	    moveRight: function moveRight(direction) {
	
	        var lastElement = this.el.children(this.itemName).last();
	        var lastLeft = lastElement.position()['left'];
	        this.moveItems(-direction);
	        var first = this.el.children(this.itemName).first();
	        first.hide();
	        first.insertAfter(lastElement);
	        first.css('left', lastLeft).show();
	        this.pager();
	    },
	    moveItems: function moveItems(direction) {
	        this.el.children(this.itemName).each(function () {
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