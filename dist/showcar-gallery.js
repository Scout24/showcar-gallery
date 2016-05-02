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
	
	var Gallery = function () {
	
	    /**
	     * @param {HTMLElement} element
	     */
	
	    function Gallery(element) {
	        _classCallCheck(this, Gallery);
	
	        this.rootElement = $(element);
	        this.container = $(this.selectors.itemName, this.rootElement).parent();
	        this.items = $(this.selectors.itemName, this.container);
	
	        this.positions = [];
	        this.touchStart = {};
	        this.touchPrev = {};
	
	        this.duplicateClass = 'duplicate';
	        this.centerFirstItem = false !== this.rootElement.data('center-first-item');
	        this.focusSingleItem = false !== this.rootElement.data('focus-single-item');
	
	        this.resizeHandler = null;
	        this.numberOfItemsToPreload = 0;
	
	        // do this synchronously to omit side effects
	        this.items.each(function (index, item) {
	            $(item).attr('data-number', index + 1);
	        });
	
	        if (this.items.length < 2) {
	            this.handleEdgecases();
	        }
	
	        this.registerEvent(window, 'resize', this.onResize.bind(this));
	        this.registerEvent(this.selectors.leftPager, 'click', this.onPage.bind(this, 'left'));
	        this.registerEvent(this.selectors.rightPager, 'click', this.onPage.bind(this, 'right'));
	        this.registerEvent(this.rootElement, 'touchstart', this.onTouchStart.bind(this));
	        this.registerEvent(this.rootElement, 'touchmove', this.onTouchMove.bind(this));
	        this.registerEvent(this.rootElement, 'touchend', this.onTouchEnd.bind(this));
	    }
	
	    /**
	     * @returns {{itemName: string, leftPager: string, rightPager: string, pager: string}}
	     */
	
	
	    _createClass(Gallery, [{
	        key: 'registerEvent',
	
	
	        /**
	         * @param {HTMLElement} element
	         * @param {Event} event
	         * @param {Function} handler
	         * @returns {Zepto}
	         */
	        value: function registerEvent(element, event, handler) {
	            return $(element).on(event, handler);
	        }
	    }, {
	        key: 'onResize',
	        value: function onResize() {
	            this.resizeHandler && clearTimeout(this.resizeHandler);
	            this.resizeHandler = setTimeout(this.render.bind(this), 500);
	        }
	
	        /**
	         * @param {String} direction left or right
	         */
	
	    }, {
	        key: 'onPage',
	        value: function onPage(direction) {
	            if ('left' === direction) this.moveLeft();
	            if ('right' === direction) this.moveRight();
	
	            this.positionItems();
	            this.loadImages();
	            this.triggerChange();
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
	            if (!target.hasClass('right') && !target.hasClass('left')) {
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
	
	                this.positionItems();
	                this.resetTouch();
	            } else {
	                event.preventDefault();
	                var touchDiffX = touchCoords.x - this.touchPrev.x;
	                this.touchPrev = touchCoords;
	                this.moveItems(touchDiffX);
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
	                    this.moveRight();
	                    this.loadImages();
	                    this.triggerChange();
	                } else if (touchDiffX < 0) {
	                    this.moveLeft();
	                    this.loadImages();
	                    this.triggerChange();
	                }
	            }
	
	            this.positionItems();
	        }
	    }, {
	        key: 'triggerChange',
	        value: function triggerChange() {
	            this.rootElement.trigger('as24-gallery:change', []);
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
	        key: 'positionItems',
	        value: function positionItems() {
	            var _this = this;
	
	            this.items.each(function (index, item) {
	                $(item).css('left', _this.positions[index]);
	            });
	        }
	    }, {
	        key: 'resizeOverlays',
	        value: function resizeOverlays() {
	            var overlays = $(this.selectors.rightPager + ', ' + this.selectors.leftPager, this.rootElement);
	            var overlayMinWidth = parseInt(overlays.css('min-width'));
	
	            overlayMinWidth += parseInt(this.items.first().css('margin-left'));
	            overlays.toggleClass('pagination-small', this.itemWidth + 2 * overlayMinWidth >= this.container.width());
	            var overlayWidth = 0;
	
	            if (this.items.length > 1) {
	                var firstChild = this.items.first();
	                overlayWidth = this.rootElement[0].clientWidth / 2 - this.itemWidth / 2;
	                overlayWidth -= parseInt(firstChild.css('margin-left'));
	            }
	
	            overlays.css({ 'width': overlayWidth, 'opacity': 100 });
	        }
	    }, {
	        key: 'fillItems',
	        value: function fillItems() {
	            var noOfItems = this.items.length;
	            var space = 1;
	
	            if (noOfItems < 2) {
	                return;
	            }
	            if (noOfItems > 2) {
	                space = this.container.get(0).clientWidth - noOfItems * this.itemWidth;
	            }
	
	            var itemsToCreate = Math.ceil(Math.ceil(space / this.itemWidth) / noOfItems) * noOfItems;
	            var index = noOfItems;
	            for (var i = 1; i <= itemsToCreate; i++) {
	                var dataNo = i % noOfItems;
	                dataNo = dataNo || noOfItems;
	                index += 1;
	                var element = $('[data-number="' + dataNo + '"]').clone().data('number', index).addClass(this.duplicateClass);
	                var target = $('[data-number="' + (index - 1) + '"]');
	
	                target.after(element);
	            }
	
	            this.items = $(this.selectors.itemName, this.container);
	        }
	    }, {
	        key: 'showPageInfo',
	        value: function showPageInfo() {
	            var duplicates = this.items.filter('.duplicate');
	            var totalPages = this.items.length - duplicates.length;
	            var middleItem = this.centerFirstItem ? Math.ceil(this.items.length / 2) : 1;
	            var currentNumber = $(this.items[middleItem - 1]).data('number');
	            var currentPage = currentNumber % totalPages || totalPages;
	
	            $(this.selectors.pager, this.rootElement).html(currentPage + '/' + totalPages);
	        }
	
	        /**
	         * @returns {Number}
	         */
	
	    }, {
	        key: 'calculateItemWidth',
	        value: function calculateItemWidth() {
	            var firstChild = this.items.first();
	            var itemWidth = 0;
	
	            if (firstChild.length > 0) {
	                itemWidth = firstChild.width();
	                itemWidth += parseInt(firstChild.css('margin-left'), 10);
	                itemWidth += parseInt(firstChild.css('margin-right'), 10);
	            }
	
	            return itemWidth;
	        }
	    }, {
	        key: 'handleEdgecases',
	        value: function handleEdgecases() {
	            $(this.selectors.leftPager + ', ' + this.selectors.rightPager + ', ' + this.selectors.pager, this.rootElement).hide();
	            0 === this.items.length && $('.placeholder', this.rootElement).show();
	        }
	
	        /**
	         * @param {Boolean} reorder
	         */
	
	    }, {
	        key: 'positionElements',
	        value: function positionElements(reorder) {
	            var _this2 = this;
	
	            var itemCount = this.items.length;
	            var middleItem = Math.ceil(this.items.length / 2);
	            var centerPos = this.centerFirstItem ? (this.container.get(0).clientWidth - this.itemWidth) / 2 : 0;
	
	            if (reorder) {
	                this.items.each(function (index, item) {
	                    if (index <= itemCount / 2) {
	                        _this2.container.append(item);
	                    }
	                });
	            }
	
	            this.items = $(this.selectors.itemName, this.container);
	            this.positions = [];
	
	            this.items.each(function (index, item) {
	                var indexDiff = index + 1 - middleItem;
	                var leftPos = centerPos + indexDiff * _this2.itemWidth;
	
	                _this2.positions.push(leftPos);
	                $(item).css('left', leftPos);
	            });
	
	            //position pager to bottom center
	            $(this.selectors.pager, this.rootElement).css('left', centerPos + this.itemWidth / 2 - 30);
	
	            this.showPageInfo();
	            this.loadImages();
	        }
	    }, {
	        key: 'loadImages',
	        value: function loadImages() {
	            var _this3 = this;
	
	            var itemCount = this.items.length;
	            var middleItem = Math.ceil(itemCount / 2);
	            var centerPos = (this.container.get(0).clientWidth - this.itemWidth) / 2;
	
	            this.items.each(function (index, item) {
	                var indexDiff = index + 1 - middleItem;
	                var leftPos = centerPos + indexDiff * _this3.itemWidth;
	
	                if (leftPos + _this3.itemWidth + _this3.numberOfItemsToPreload * _this3.itemWidth > 0 && leftPos - _this3.numberOfItemsToPreload * _this3.itemWidth < _this3.container.width()) {
	                    var image = $('[data-src]', item);
	                    if (image.length > 0) {
	                        image[0].src = image.data('src');
	                        image.attr('data-src', null);
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'moveLeft',
	        value: function moveLeft() {
	            this.items.last().insertBefore(this.items.first());
	            this.items = $(this.selectors.itemName, this.container);
	            this.showPageInfo();
	        }
	    }, {
	        key: 'moveRight',
	        value: function moveRight() {
	            this.items.first().insertAfter(this.items.last());
	            this.items = $(this.selectors.itemName, this.container);
	            this.showPageInfo();
	        }
	
	        /**
	         * @param {Number} direction
	         */
	
	    }, {
	        key: 'moveItems',
	        value: function moveItems(direction) {
	            var left = void 0;
	            var itemWidth = this.itemWidth;
	
	            this.items.each(function (index, item) {
	                if (!left) {
	                    left = parseInt($(item).css('left'));
	                }
	                $(item).css('left', left + index * itemWidth + direction);
	            });
	        }
	
	        /**
	         * @param {Boolean} reorder
	         */
	
	    }, {
	        key: 'render',
	        value: function render() {
	            var reorder = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	            this.itemWidth = this.calculateItemWidth();
	            this.fillItems();
	            this.positionElements(reorder);
	            if (this.focusSingleItem) {
	                this.resizeOverlays();
	            }
	        }
	
	        /**
	         * Documented in README.md
	         */
	
	    }, {
	        key: 'redraw',
	        value: function redraw() {
	            this.render(true);
	        }
	    }, {
	        key: 'selectors',
	        get: function get() {
	            return {
	                itemName: 'as24-gallery-item',
	                leftPager: 'as24-gallery .left',
	                rightPager: 'as24-gallery .right',
	                pager: 'as24-gallery .pager'
	            };
	        }
	
	        /**
	         * Returns the number of items to preload
	         *
	         * @returns {Number}
	         */
	
	    }, {
	        key: 'preloadItems',
	        get: function get() {
	            return this.rootElement.data('preload-items') || 0;
	        }
	    }]);
	
	    return Gallery;
	}();
	
	function onElementCreated() {
	    this.gallery = new Gallery(this);
	    this.gallery.render();
	}
	
	var tagName = 'as24-gallery';
	
	try {
	    module.exports = document.registerElement(tagName, {
	        prototype: _extends(Object.create(HTMLElement.prototype, {
	            createdCallback: { value: onElementCreated }
	        }), {
	            redraw: function redraw() {
	                this.gallery.redraw();
	            }
	        })
	    });
	} catch (e) {
	    if (window && window.console) {
	        window.console.warn('Failed to register CustomElement "' + tagName + '".', e);
	    }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-gallery.js.map