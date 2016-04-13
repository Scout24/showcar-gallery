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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Carousel = function () {
	    function Carousel(element) {
	        _classCallCheck(this, Carousel);
	
	        this.element = $(element);
	        this.container = null;
	        this.pagination = {
	            left: null,
	            right: null
	        };
	        this.offset = 0;
	        this.itemWidth = 310;
	
	        this.touchStart = {};
	        this.touchPrev = {};
	
	        this.render();
	
	        this.element.on('slide', this.paginate.bind(this));
	
	        this.element.on('touchstart', this.onTouchStart.bind(this));
	        this.element.on('touchmove', this.onTouchMove.bind(this));
	        this.element.on('touchend', this.onTouchEnd.bind(this));
	    }
	
	    _createClass(Carousel, [{
	        key: 'render',
	
	
	        /**
	         * Do all the stuff needed for rendering the carousel
	         */
	        value: function render() {
	            this.wrapContainer();
	            this.loadPagination();
	            this.showRightPagination();
	            this.loadVisibleImages();
	        }
	
	        /**
	         * Redraw the whole carousel (can be triggered from outside)
	         */
	
	    }, {
	        key: 'redraw',
	        value: function redraw() {
	            this.render();
	        }
	
	        /**
	         * @param {TouchEvent|Event} event
	         */
	
	    }, {
	        key: 'onTouchStart',
	        value: function onTouchStart(event) {
	            var target = $(event.target);
	
	            this.items.addClass('no-transition');
	            this.resetTouch();
	            if (!target.hasClass('as24-pagination')) {
	                this.touchStart = this.getTouchCoords(event);
	                this.touchPrev = this.touchStart;
	            }
	        }
	
	        /**
	         * @param {TouchEvent|Event} event
	         */
	
	    }, {
	        key: 'onTouchMove',
	        value: function onTouchMove(event) {
	            if (!this.isSwiping()) {
	                return;
	            }
	
	            var touchCoords = this.getTouchCoords(event);
	            var startDiffX = Math.abs(touchCoords.x - this.touchStart.x);
	            var startDiffY = Math.abs(touchCoords.y - this.touchStart.y);
	
	            if (startDiffX < startDiffY) {
	                this.items.removeClass('no-transition');
	                this.resetTouch();
	            } else {
	                event.preventDefault();
	                this.touchPrev = touchCoords;
	            }
	        }
	
	        /**
	         *
	         * @param {TouchEvent|Event} event
	         */
	
	    }, {
	        key: 'onTouchEnd',
	        value: function onTouchEnd(event) {
	            this.items.removeClass('no-transition');
	            if (!this.isSwiping()) {
	                return;
	            }
	
	            var touchCoords = this.getTouchCoords(event.changedTouches[0]);
	            var touchDiffX = this.touchStart.x - touchCoords.x;
	            var absTouchDiffX = Math.abs(touchDiffX);
	            var howMany = Math.ceil(absTouchDiffX / this.itemWidth);
	
	            for (var i = 0; i < howMany; i++) {
	                if (touchDiffX > 0) {
	                    this.paginate(null, 'right');
	                } else if (touchDiffX < 0) {
	                    this.paginate(null, 'left');
	                }
	            }
	        }
	
	        /**
	         * @param {TouchEvent|Event} event
	         * @returns {{x: (Number), y: (Number)}}
	         */
	
	    }, {
	        key: 'getTouchCoords',
	        value: function getTouchCoords(event) {
	            var touch = event.touches && event.touches[0];
	
	            return {
	                x: event.clientX || touch && touch.clientX,
	                y: event.clientY || touch && touch.clientY
	            };
	        }
	    }, {
	        key: 'resetTouch',
	        value: function resetTouch() {
	            this.touchStart = {};
	            this.touchPrev = {};
	        }
	
	        /**
	         * @returns {boolean}
	         */
	
	    }, {
	        key: 'isSwiping',
	        value: function isSwiping() {
	            return Object.keys(this.touchStart).length > 0;
	        }
	    }, {
	        key: 'wrapContainer',
	        value: function wrapContainer() {
	            this.container = this.element.children().wrapAll('<div class="as24-carousel-container">').parent();
	            this.container.wrapAll('<div class="as24-carousel-wrapper">');
	        }
	    }, {
	        key: 'hideLeftPagination',
	        value: function hideLeftPagination() {
	            this.pagination.left.addClass('hide');
	        }
	    }, {
	        key: 'hideRightPagination',
	        value: function hideRightPagination() {
	            this.pagination.right.addClass('hide');
	        }
	    }, {
	        key: 'showLeftPagination',
	        value: function showLeftPagination() {
	            this.pagination.left.removeClass('hide');
	        }
	    }, {
	        key: 'showRightPagination',
	        value: function showRightPagination() {
	            this.pagination.right.removeClass('hide');
	        }
	    }, {
	        key: 'loadPagination',
	        value: function loadPagination() {
	            var _this = this;
	
	            var pager = $('<a href="#" class="as24-pagination hide">');
	            this.pagination.left = pager.clone().data('dir', 'left').on('click touch', function (event) {
	                event.stopPropagation();
	                event.preventDefault();
	                _this.element.trigger('slide', ['left']);
	            });
	            this.pagination.right = pager.clone().data('dir', 'right').on('click touch', function (event) {
	                event.stopPropagation();
	                event.preventDefault();
	                _this.element.trigger('slide', ['right']);
	            });
	            this.element.append(this.pagination.left).append(this.pagination.right);
	        }
	    }, {
	        key: 'paginate',
	        value: function paginate(event, direction) {
	            var container = this.element[0].querySelector('.as24-carousel-container');
	            var item = this.items.first();
	            var distance = this.getItemWidth(item);
	            var minOffset = this.getMinOffset();
	            var newOffset = void 0;
	
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
	                this.element.css({ 'margin': '0 0 0 20px' });
	            } else {
	                this.showLeftPagination();
	            }
	            if (minOffset >= this.offset) {
	                this.hideRightPagination();
	                this.element.css({ 'margin': '0 20px 0 0' });
	            } else {
	                this.showRightPagination();
	            }
	            this.loadVisibleImages();
	            if ('transform' in container.style) {
	                container.style.transform = 'translate3d(' + this.offset + 'px, 0, 0)';
	            } else {
	                container.style.webkitTransform = 'translate3d(' + this.offset + 'px, 0, 0)';
	            }
	        }
	    }, {
	        key: 'getMinOffset',
	        value: function getMinOffset() {
	            var _this2 = this;
	
	            var fullWidth = 0;
	            this.items.each(function (index, item) {
	                fullWidth += _this2.getItemWidth($(item));
	            });
	            return -fullWidth + this.getViewWidth() + 2 * parseInt(this.items.last().css('margin-right'), 10);
	        }
	    }, {
	        key: 'isItemVisible',
	        value: function isItemVisible(item) {
	            var viewOffset = this.getViewDimension().left;
	            var itemDimensions = item.offset();
	            var itemIsOuterLeft = itemDimensions.left + itemDimensions.width < viewOffset - this.offset;
	            var itemIsOuterRight = itemDimensions.left > viewOffset - this.offset + this.getViewWidth();
	
	            return !itemIsOuterLeft && !itemIsOuterRight;
	        }
	    }, {
	        key: 'loadImagesForItem',
	        value: function loadImagesForItem(item) {
	            var images = $('img[data-src]', item);
	
	            images.each(function (index, image) {
	                var $img = $(image);
	                $img.attr('src', $img.data('src')).removeAttr('data-src');
	            });
	        }
	    }, {
	        key: 'loadVisibleImages',
	        value: function loadVisibleImages() {
	            var _this3 = this;
	
	            this.items.each(function (index, item) {
	                var queriedItem = $(item);
	                // fix width and height for mobile devices
	                var elementOffset = _this3.element.offset();
	                var carouselWidth = elementOffset.width;
	                if (carouselWidth < _this3.itemWidth) {
	                    _this3.itemWidth = elementOffset.width - 20;
	                    queriedItem.css({
	                        width: _this3.itemWidth,
	                        height: elementOffset.height
	                    });
	                }
	
	                if (_this3.isItemVisible(queriedItem)) {
	                    _this3.loadImagesForItem(item);
	                }
	            });
	        }
	    }, {
	        key: 'getItemWidth',
	        value: function getItemWidth(item) {
	            var margin = parseInt(item.css('margin-right'), 10) * 2;
	            return item.width() + margin;
	        }
	    }, {
	        key: 'getViewWidth',
	        value: function getViewWidth() {
	            return this.element.width();
	        }
	    }, {
	        key: 'getViewDimension',
	        value: function getViewDimension() {
	            "use strict";
	
	            return this.element.offset();
	        }
	    }, {
	        key: 'items',
	        get: function get() {
	            return $('as24-carousel-item', this.element);
	        }
	    }]);
	
	    return Carousel;
	}();
	
	function onElementCreated() {
	    this.carousel = new Carousel(this);
	}
	
	try {
	    document.registerElement('as24-carousel', {
	        prototype: _extends(Object.create(HTMLElement.prototype, {
	            createdCallback: { value: onElementCreated }
	        }), {
	            redraw: function redraw() {
	                this.carousel.redraw();
	            }
	        })
	    });
	} catch (e) {
	    if (window && window.console) {
	        window.console.warn('Failed to register CustomElement "as24-carousel".', e);
	    }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-carousel.js.map