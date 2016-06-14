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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var customEventPolyfill = __webpack_require__(1);
	var H = __webpack_require__(2);
	var on = H.on;
	var hide = H.hide;
	var show = H.show;
	var appendTo = H.appendTo;
	var toggleClass = H.toggleClass;
	var getWidth = H.getWidth;
	var getCSS = H.getCSS;
	var setCSS = H.setCSS;
	var addClass = H.addClass;
	var removeClass = H.removeClass;
	var containsClass = H.containsClass;
	
	var Gallery = function () {
	
	    /**
	     * @param {Element} element
	     */
	
	    function Gallery(element) {
	        _classCallCheck(this, Gallery);
	
	        if (!element) {
	            throw "Root element is needed";
	        }
	        customEventPolyfill();
	        this.rootElement = element;
	        this.galleryID = this.rootElement.getAttribute('data-id') || Math.random().toString(16).substr(2);
	        this.container = this.rootElement.querySelector(this.selectors.itemName).parentElement;
	        this.items = this.container.querySelectorAll(this.selectors.itemName);
	
	        this.rightPager = this.rootElement.querySelector(this.selectors.rightPager);
	        this.leftPager = this.rootElement.querySelector(this.selectors.leftPager);
	        this.pager = this.rootElement.querySelector(this.selectors.pager);
	
	        if (!this.rightPager || !this.leftPager) {
	            throw "Right or left pager is missing";
	        }
	
	        this.positions = [];
	        this.touchStart = {};
	        this.touchPrev = {};
	
	        this.duplicateClass = 'duplicate';
	        this.centerFirstItem = 'false' !== this.rootElement.getAttribute('data-center-first-item');
	        this.focusSingleItem = 'false' !== this.rootElement.getAttribute('data-focus-single-item');
	
	        this.resizeHandler = null;
	        this.numberOfItemsToPreload = 0;
	
	        // do this synchronously to omit side effects
	        Array.prototype.forEach.call(this.items, function (item, index) {
	            item.setAttribute('data-number', index + 1);
	        });
	
	        if (this.items.length < 2) {
	            this.handleEdgecases();
	        }
	
	        this.registerEvent(window, 'resize', this.onResize.bind(this));
	        this.registerEvent(this.leftPager, 'click', this.onPage.bind(this, 'left'));
	        this.registerEvent(this.rightPager, 'click', this.onPage.bind(this, 'right'));
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
	         * @param {Element} element
	         * @param {String} event
	         * @param {Function} handler
	         * @returns {Element}
	         */
	        value: function registerEvent(element, event, handler) {
	            return on(handler, event, element);
	        }
	    }, {
	        key: 'onResize',
	        value: function onResize() {
	            if (this.resizeHandler) {
	                clearTimeout(this.resizeHandler);
	            }
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
	            var target = event.target;
	
	            Array.prototype.forEach.call(this.items, function (item) {
	                return addClass('no-transition', item);
	            });
	            this.resetTouch();
	            if (!containsClass('right', target) && !containsClass('left', target)) {
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
	                Array.prototype.forEach.call(this.items, function (item) {
	                    return removeClass('no-transition', item);
	                });
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
	            Array.prototype.forEach.call(this.items, function (item) {
	                return removeClass('no-transition', item);
	            });
	
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
	            var evt = new CustomEvent('as24-gallery:change', {
	                detail: {
	                    id: this.galleryID
	                }
	            });
	            window.document.dispatchEvent(evt);
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
	
	            Array.prototype.forEach.call(this.items, function (item, idx) {
	                setCSS('left', _this.positions[idx] + 'px', item);
	            });
	        }
	    }, {
	        key: 'resizeOverlays',
	        value: function resizeOverlays() {
	            var rightPagerMinWidth = this.rightPager ? parseInt(getCSS('min-width', this.rightPager), 10) : 0;
	            var leftPagerMinWidth = this.leftPager ? parseInt(getCSS('min-width', this.leftPager), 10) : 0;
	            var overlayMinWidth = Math.min(rightPagerMinWidth, leftPagerMinWidth);
	
	            overlayMinWidth += this.items.length ? parseInt(getCSS('margin-left', this.items[0]), 10) : 0;
	
	            if (this.itemWidth + 2 * overlayMinWidth >= getWidth(this.container)) {
	                toggleClass('pagination-small', this.rightPager);
	                toggleClass('pagination-small', this.leftPager);
	            }
	            var overlayWidth = 0;
	
	            if (this.items.length > 1) {
	                var firstChild = this.items[0];
	                overlayWidth = this.rootElement.clientWidth / 2 - this.itemWidth / 2;
	                overlayWidth -= parseInt(getCSS('margin-left', firstChild), 10);
	            }
	
	            setCSS('width', overlayWidth + 'px', this.rightPager);
	            setCSS('opacity', 100, this.rightPager);
	            setCSS('width', overlayWidth + 'px', this.leftPager);
	            setCSS('opacity', 100, this.leftPager);
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
	                space = this.container.clientWidth - noOfItems * this.itemWidth;
	            }
	
	            var itemsToCreate = Math.ceil(Math.ceil(space / this.itemWidth) / noOfItems) * noOfItems;
	            var index = noOfItems;
	            for (var i = 1; i <= itemsToCreate; i++) {
	                var dataNo = i % noOfItems;
	                dataNo = dataNo || noOfItems;
	                index += 1;
	                var clone = this.rootElement.querySelector('[data-number="' + dataNo + '"]').cloneNode(true);
	                clone.dataset.number = index;
	                addClass(this.duplicateClass, clone);
	                var target = this.rootElement.querySelector('[data-number="' + (index - 1) + '"]');
	
	                target.parentNode.appendChild(clone);
	            }
	
	            this.items = this.container.querySelectorAll(this.selectors.itemName);
	        }
	    }, {
	        key: 'showPageInfo',
	        value: function showPageInfo() {
	            var duplicates = Array.prototype.filter.call(this.items, function (item) {
	                return containsClass('.duplicate', item);
	            });
	            var totalPages = this.items.length - duplicates.length;
	            var middleItem = this.centerFirstItem ? Math.ceil(this.items.length / 2) : 1;
	            var currentNumber = this.items[middleItem - 1].dataset.number;
	            var currentPage = currentNumber % totalPages || totalPages;
	
	            if (this.pager) {
	                this.pager.innerHTML = currentPage + '/' + totalPages;
	            }
	        }
	
	        /**
	         * @returns {Number}
	         */
	
	    }, {
	        key: 'calculateItemWidth',
	        value: function calculateItemWidth() {
	            var firstChild = this.items[0];
	            var itemWidth = 0;
	
	            if (firstChild) {
	                itemWidth = getWidth(firstChild);
	                itemWidth += parseInt(getCSS('margin-left', firstChild), 10);
	                itemWidth += parseInt(getCSS('margin-right', firstChild), 10);
	            }
	
	            return itemWidth;
	        }
	    }, {
	        key: 'handleEdgecases',
	        value: function handleEdgecases() {
	            hide(this.rootElement);
	            hide(this.leftPager);
	            hide(this.rightPager);
	
	            if (this.pager) {
	                hide(this.pager);
	            }
	
	            var placeholder = this.rootElement.querySelector('.placeholder');
	
	            if (!this.items.length && placeholder) {
	                show(placeholder);
	            }
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
	            var centerPos = this.centerFirstItem ? (this.container.clientWidth - this.itemWidth) / 2 : 0;
	
	            if (reorder) {
	                Array.prototype.forEach.call(this.items, function (item, index) {
	                    if (index <= itemCount / 2) {
	                        appendTo(_this2.container, item);
	                    }
	                });
	            }
	
	            this.items = this.container.querySelectorAll(this.selectors.itemName);
	            this.positions = [];
	
	            Array.prototype.forEach.call(this.items, function (item, index) {
	                var indexDiff = index + 1 - middleItem;
	                var leftPos = centerPos + indexDiff * _this2.itemWidth;
	
	                _this2.positions.push(leftPos);
	                setCSS('left', leftPos + 'px', item);
	            });
	
	            //position pager to bottom center
	            var left = centerPos + this.itemWidth / 2 - 30 + 'px';
	            if (this.pager) {
	                setCSS('left', left, this.pager);
	            }
	
	            this.showPageInfo();
	            this.loadImages();
	        }
	    }, {
	        key: 'loadImages',
	        value: function loadImages() {
	            var _this3 = this;
	
	            var itemCount = this.items.length;
	            var middleItem = Math.ceil(itemCount / 2);
	            var centerPos = (this.container.clientWidth - this.itemWidth) / 2;
	
	            Array.prototype.forEach.call(this.items, function (item, index) {
	                var indexDiff = index + 1 - middleItem;
	                var leftPos = centerPos + indexDiff * _this3.itemWidth;
	
	                if (leftPos + _this3.itemWidth + _this3.numberOfItemsToPreload * _this3.itemWidth > 0 && leftPos - _this3.numberOfItemsToPreload * _this3.itemWidth < getWidth(_this3.container)) {
	                    var image = item.querySelector('[data-src]');
	                    if (image) {
	                        if (image.hasAttribute('data-src')) {
	                            image.src = image.getAttribute('data-src');
	                            image.removeAttribute('data-src');
	                        }
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'moveLeft',
	        value: function moveLeft() {
	            var last = this.items[this.items.length - 1];
	            var parent = last.parentNode;
	            parent.insertBefore(last, parent.firstChild);
	            this.items = this.container.querySelectorAll(this.selectors.itemName);
	            this.showPageInfo();
	        }
	    }, {
	        key: 'moveRight',
	        value: function moveRight() {
	            var parent = this.items[0].parentNode;
	            parent.appendChild(parent.removeChild(this.items[0]));
	            this.items = this.container.querySelectorAll(this.selectors.itemName);
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
	
	            Array.prototype.forEach.call(this.items, function (item, index) {
	                if (!left) {
	                    left = parseInt(getCSS('left', item), 10);
	                }
	                setCSS('left', left + index * itemWidth + direction + 'px', item);
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
	            return parseInt(this.rootElement.getAttribute('data-preload-items') || '0', 10);
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function () {
	
	    if (typeof window.CustomEvent === "function") return false;
	
	    function CustomEvent(event, params) {
	        params = params || { bubbles: false, cancelable: false, detail: undefined };
	        var evt = document.createEvent('CustomEvent');
	        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	        return evt;
	    }
	
	    CustomEvent.prototype = window.Event.prototype;
	
	    window.CustomEvent = CustomEvent;
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Adds class to the dom element
	 * @param {string} className
	 * @param {Element} domEl
	 * @returns {Element}
	 */
	function addClass(className, domEl) {
	    if (domEl.classList) {
	        domEl.classList.add(className);
	    } else {
	        var classList = [],
	            classesString = domEl.getAttribute('class');
	        if (classesString) {
	            classList = classesString.split(' ');
	            if (classList.indexOf(className) === -1) {
	                classesString = classList.concat(className).join(' ');
	            }
	        } else {
	            classesString = className;
	        }
	        domEl.setAttribute('class', classesString);
	    }
	    return domEl;
	}
	
	/**
	 * Removed class from the element
	 * @param {string} className
	 * @param {Element} domEl
	 * @returns {Element}
	 */
	function removeClass(className, domEl) {
	    if (domEl.classList) {
	        domEl.classList.remove(className);
	    } else {
	        var classList = [],
	            classesString = domEl.getAttribute('class');
	        if (classesString) {
	            classList = classesString.split(' ');
	            if (classList.indexOf(className) !== -1) {
	                classList.splice(classList.indexOf(className), 1);
	            }
	            domEl.setAttribute('class', classList.join(' '));
	        }
	    }
	    return domEl;
	}
	
	/**
	 *
	 * @param {string} className
	 * @param {Element} domEl
	 * @returns {boolean}
	 */
	function containsClass(className, domEl) {
	    if (domEl.classList) {
	        return domEl.classList.contains(className);
	    } else {
	        var classList = [],
	            classesString = domEl.getAttribute('class');
	        if (classesString) {
	            classList = classesString.split(' ');
	        }
	        return classList.indexOf(className) > -1;
	    }
	}
	
	/**
	 * Toggles class for the domElem
	 * @param {string} className
	 * @param {Element} domElem
	 * @returns {Element}
	 */
	function toggleClass(className, domElem) {
	    if (domElem.classList) {
	        domElem.classList.toggle(className);
	    } else {
	        if (containsClass(className, domElem)) {
	            removeClass(className, domElem);
	        } else {
	            addClass(className, domElem);
	        }
	    }
	    return domElem;
	}
	
	/**
	 * Hides the provided element
	 * @param {Element} domElement
	 * @returns {Element}
	 */
	function hide(domElement) {
	    domElement.style.display = 'none';
	    return domElement;
	}
	
	/**
	 * Shows the provided element
	 * @param {Element} domElement
	 * @returns {Element}
	 */
	function show(domElement) {
	    domElement.style.display = 'block';
	    return domElement;
	}
	
	/**
	 * Add event listener to the element
	 * @param {function} eventHandlerFn
	 * @param {string} eventName
	 * @param {Element} domElement
	 * @returns {Element}
	 */
	function on(eventHandlerFn, eventName, domElement) {
	    if (domElement.addEventListener) {
	        domElement.addEventListener(eventName, eventHandlerFn);
	    } else {
	        domElement.attachEvent('on' + eventName, eventHandlerFn);
	    }
	    return domElement;
	}
	
	/**
	 * Sets the CSS key: value
	 * @param {string} rule
	 * @param {string|number} val
	 * @param {Element} elem
	 * @returns {Element} {*}
	 */
	function setCSS(rule, val, elem) {
	    elem.style[rule] = val;
	    return elem;
	}
	
	/**
	 * Returns CSS value by the key
	 * @param {string} rule
	 * @param {Element} elem
	 * @returns {string}
	 */
	function getCSS(rule, elem) {
	    var cs = window.getComputedStyle(elem, null);
	    return cs.getPropertyValue(rule);
	}
	
	/**
	 * Returns the width of the element
	 * @param {Element} el
	 * @return {Number}
	 */
	function getWidth(el) {
	    return el.getBoundingClientRect().width;
	}
	
	/**
	 * Appends an element to the target
	 * @param {Element} target
	 * @param {Element} element
	 */
	function appendTo(target, element) {
	    target.appendChild(element);
	    return target;
	}
	
	module.exports = {
	    on: on, setCSS: setCSS, getCSS: getCSS, addClass: addClass, hide: hide, show: show, appendTo: appendTo, removeClass: removeClass, containsClass: containsClass, toggleClass: toggleClass, getWidth: getWidth
	};

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-gallery.js.map