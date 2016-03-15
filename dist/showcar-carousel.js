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
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var as24carousel = _extends(Object.create(HTMLElement.prototype), {
	    items: [],
	    el: null,
	    container: null,
	    pagination: {
	        left: null,
	        right: null
	    },
	    offset: 0,
	
	    wrapContainer: function wrapContainer() {
	        this.container = this.el.children().wrapAll('<div class="as24-carousel-container">').parent();
	    },
	    hideLeftPagination: function hideLeftPagination() {
	        this.pagination.left && this.pagination.left.addClass('hide');
	    },
	    hideRightPagination: function hideRightPagination() {
	        this.pagination.right && this.pagination.right.addClass('hide');
	    },
	    showLeftPagination: function showLeftPagination() {
	        this.pagination.left && this.pagination.left.removeClass('hide');
	    },
	    showRightPagination: function showRightPagination() {
	        this.pagination.right && this.pagination.right.removeClass('hide');
	    },
	    loadPagination: function loadPagination() {
	        var _this = this;
	
	        var pager = $('<a href="#!" class="as24-pagination hide">');
	        this.pagination.left = pager.clone().data('dir', 'left').on('click touch', function () {
	            _this.el.trigger('slide', ['left']);
	        });
	        this.pagination.right = pager.clone().data('dir', 'right').on('click touch', function () {
	            _this.el.trigger('slide', ['right']);
	        });
	        this.el.append(this.pagination.left).append(this.pagination.right);
	    },
	    paginate: function paginate(event, direction) {
	        var item = this.items.first();
	        var distance = this.getItemWidth(item);
	        var minOffset = this.getMinOffset();
	        var newOffset = undefined;
	
	        switch (direction) {
	            case 'left':
	                var maxOffset = 0;
	                newOffset = this.offset + distance;
	                if (newOffset > maxOffset) {
	                    distance = maxOffset + Math.abs(this.offset);
	                }
	                this.offset += distance;
	                break;
	            case 'right':
	                newOffset = this.offset - distance;
	                if (newOffset < minOffset) {
	                    distance = Math.abs(minOffset) - Math.abs(this.offset);
	                }
	                this.offset -= distance;
	                break;
	        }
	        if (0 === this.offset) {
	            this.hideLeftPagination();
	        } else {
	            this.showLeftPagination();
	        }
	        if (minOffset >= this.offset) {
	            this.hideRightPagination();
	        } else {
	            this.showRightPagination();
	        }
	        this.loadVisibleImages();
	        this.container.css('transform', 'translate3d(' + this.offset + 'px, 0, 0)');
	    },
	    getMinOffset: function getMinOffset() {
	        var _this2 = this;
	
	        var fullWidth = 0;
	        this.items.each(function (index, item) {
	            fullWidth += _this2.getItemWidth($(item));
	        });
	        return -fullWidth + this.getViewWidth() + 2 * parseInt(this.items.last().css('margin-right'), 10);
	    },
	    isItemVisible: function isItemVisible(item) {
	        var viewOffset = this.getViewDimension().left;
	        var itemDimensions = item.offset();
	        var itemIsOuterLeft = itemDimensions.left + itemDimensions.width < viewOffset - this.offset;
	        var itemIsOuterRight = itemDimensions.left > viewOffset - this.offset + this.getViewWidth();
	
	        return !itemIsOuterLeft && !itemIsOuterRight;
	    },
	    loadImagesForItem: function loadImagesForItem(item) {
	        var images = $('img[data-src]', item);
	
	        images.each(function (index, image) {
	            var $img = $(image);
	            $img.attr('src', $img.data('src')).removeAttr('data-src');
	        });
	    },
	    loadVisibleImages: function loadVisibleImages() {
	        var _this3 = this;
	
	        this.items.each(function (index, item) {
	            if (_this3.isItemVisible($(item))) {
	                _this3.loadImagesForItem(item);
	            }
	        });
	    },
	    getItemWidth: function getItemWidth(item) {
	        var margin = parseInt(item.css('margin-right'), 10) * 2;
	        return item.width() + margin;
	    },
	    getViewWidth: function getViewWidth() {
	        return this.el.width();
	    },
	    getViewDimension: function getViewDimension() {
	        "use strict";
	
	        return this.el.offset();
	    },
	    createdCallback: function createdCallback() {
	        this.el = $(this);
	        this.items = $('as24-carousel-item', this.el);
	        this.wrapContainer();
	        this.loadPagination();
	        this.showRightPagination();
	        this.loadVisibleImages();
	
	        this.el.on('slide', this.paginate);
	    }
	});
	
	try {
	    document.registerElement('as24-carousel', {
	        prototype: as24carousel
	    });
	} catch (e) {
	    if (window && window.console) {
	        window.console.warn('Failed to register CustomElement "as24-carousel".', e);
	    }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-carousel.js.map