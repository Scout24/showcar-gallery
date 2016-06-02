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
	
	/**
	 *
	 * @param {string} className
	 * @param {HTMLElement} domEl
	 * @returns {HTMLElement}
	 */
	function addClass(className, domEl) {
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
	    return domEl;
	}
	
	/**
	 *
	 * @param {string} className
	 * @param {HTMLElement} domEl
	 * @returns {HTMLElement}
	 */
	function removeClass(className, domEl) {
	    var classList = [],
	        classesString = domEl.getAttribute('class');
	    if (classesString) {
	        classList = classesString.split(' ');
	        if (classList.indexOf(className) !== -1) {
	            classList.splice(classList.indexOf(className), 1);
	        }
	        domEl.setAttribute('class', classList.join(' '));
	    }
	    return domEl;
	}
	
	/**
	 *
	 * @param {string} className
	 * @param {HTMLElement} domEl
	 * @returns {boolean}
	 */
	function containsClass(className, domEl) {
	    var classList = [],
	        classesString = domEl.getAttribute('class');
	    if (classesString) {
	        classList = classesString.split(' ');
	    }
	    return classList.indexOf(className) > -1;
	}
	
	var Carousel = function () {
	    function Carousel(element) {
	        _classCallCheck(this, Carousel);
	
	        this.element = element;
	        this.container = null;
	
	        this.pagination = {
	            left: null,
	            right: null
	        };
	
	        this.index = 0;
	        this.refWidth = 330;
	        this.itemWidth = 330;
	        this.touchStart = {};
	        this.touchPrev = {};
	
	        this.speed = Carousel.Speed.SLOW;
	
	        this.pager = document.createElement('a');
	        addClass('as24-pagination', this.pager);
	        addClass('hide', this.pager);
	        this.pager.href = '#';
	
	        this.element.addEventListener('touchstart', this.touchStartEventHandler.bind(this));
	        this.element.addEventListener('touchmove', this.touchMoveEventHandler.bind(this));
	        this.element.addEventListener('touchend', this.touchEndEventHandler.bind(this));
	    }
	
	    /**
	     * Gets all carousel items
	     */
	
	
	    _createClass(Carousel, [{
	        key: 'init',
	
	
	        /**
	         * Initializes the carousel by adding all necessary bits and bolts
	         */
	        value: function init() {
	            this.addContainer();
	            this.resizeItems();
	            this.addPagination();
	            this.calculateEnvironment();
	            this.loadImages();
	        }
	
	        /**
	         * Redraw the whole carousel (can be triggered from outside)
	         */
	
	    }, {
	        key: 'redraw',
	        value: function redraw() {
	            this.index = 0;
	            this.resizeItems();
	            this.calculateEnvironment();
	            this.setPaginationButtonsVisibility();
	            this.loadImages();
	            this.moveContainer(0);
	        }
	
	        /**
	         * Resizes the carousel items
	         */
	
	    }, {
	        key: 'resizeItems',
	        value: function resizeItems() {
	            var _this = this;
	
	            this.orgWidth = this.items[0].getBoundingClientRect().width + 20;
	            if (this.orgWidth === this.refWidth && this.element.offsetWidth < this.refWidth) {
	                this.itemWidth = this.element.offsetWidth - 20;
	                [].forEach.call(this.items, function (element) {
	                    return element.style.width = _this.itemWidth - 20 + 'px';
	                });
	            } else {
	                this.itemWidth = this.items[0].getBoundingClientRect().width + 20;
	            }
	        }
	
	        /**
	         * Handles the touch start event
	         * @param {TouchEvent|Event} event - the event object
	         */
	
	    }, {
	        key: 'touchStartEventHandler',
	        value: function touchStartEventHandler(event) {
	            var target = event.target;
	            this.resetTouch();
	            if (!containsClass('as24-pagination', target)) {
	                this.touchStart = this.getTouchCoords(event);
	                this.touchPrev = this.touchStart;
	            }
	        }
	
	        /**
	         * Handles the touch move event
	         * @param {TouchEvent|Event} event - the event object
	         */
	
	    }, {
	        key: 'touchMoveEventHandler',
	        value: function touchMoveEventHandler(event) {
	            if (!this.isSwiping()) {
	                return;
	            }
	
	            var touchCoords = this.getTouchCoords(event);
	            var startDiffX = Math.abs(touchCoords.x - this.touchStart.x);
	            var startDiffY = Math.abs(touchCoords.y - this.touchStart.y);
	
	            if (startDiffX < startDiffY) {
	                this.resetTouch();
	            } else {
	                event.preventDefault();
	                this.touchPrev = touchCoords;
	            }
	        }
	
	        /**
	         * Handles the touch end event
	         * @param {TouchEvent|Event} event - the event object
	         */
	
	    }, {
	        key: 'touchEndEventHandler',
	        value: function touchEndEventHandler(event) {
	            if (!this.isSwiping()) {
	                return;
	            }
	
	            var touchCoords = this.getTouchCoords(event.changedTouches[0]);
	            var touchDiffX = this.touchStart.x - touchCoords.x;
	            var absTouchDiffX = Math.abs(touchDiffX);
	            var howMany = Math.ceil(absTouchDiffX / this.itemWidth);
	
	            for (var i = 0; i < howMany; i++) {
	                if (touchDiffX > 0) {
	                    this.paginate(Carousel.Direction.RIGHT);
	                } else if (touchDiffX < 0) {
	                    this.paginate(Carousel.Direction.LEFT);
	                }
	            }
	        }
	
	        /**
	         * Gets the touch coordinates by its touch event
	         * @param {TouchEvent|Event} event - the event object
	         * @returns {Coordinate} coordinate - object containing some x and y coordinates
	         */
	
	    }, {
	        key: 'getTouchCoords',
	        value: function getTouchCoords(event) {
	            var touch = event.touches && event.touches[0];
	            return new Carousel.Coordinate(event.clientX || touch && touch.clientX, event.clientY || touch && touch.clientY);
	        }
	
	        /**
	         * Resets the touch coordinates
	         */
	
	    }, {
	        key: 'resetTouch',
	        value: function resetTouch() {
	            this.touchStart = {};
	            this.touchPrev = {};
	        }
	
	        /**
	         * Checks if the carousel is in swiping mode
	         * @returns {boolean}
	         */
	
	    }, {
	        key: 'isSwiping',
	        value: function isSwiping() {
	            return Object.keys(this.touchStart).length > 0;
	        }
	
	        /**
	         * Gets all the necessary dimensions and values for calculating distances and the index
	         */
	
	    }, {
	        key: 'calculateEnvironment',
	        value: function calculateEnvironment() {
	            this.itemsLength = this.container.children.length;
	            this.itemsVisible = Math.floor(this.element.offsetWidth / this.itemWidth);
	            this.totalReach = this.container.offsetWidth - this.element.offsetWidth;
	            this.stepLength = this.speed === Carousel.Speed.SLOW ? this.itemsLength - this.itemsVisible : Math.ceil(this.itemsLength / this.itemsVisible);
	            this.stepWidth = this.speed === Carousel.Speed.SLOW ? this.itemWidth : Math.floor(this.element.offsetWidth / this.itemWidth) * this.itemWidth;
	        }
	
	        /**
	         * Get the new index for paginating depending on the direction
	         * @param {Direction|String} direction - the pagination direction. 'right' or 'left'
	         */
	
	    }, {
	        key: 'getNewIndex',
	        value: function getNewIndex(direction) {
	            if (direction === Carousel.Direction.LEFT && this.index > 0) {
	                this.index -= 1;
	            } else if (direction === Carousel.Direction.RIGHT && this.index < this.stepLength) {
	                this.index += 1;
	            }
	        }
	
	        /**
	         * Wraps all the carousel items in a wrapper plus a container
	         */
	
	    }, {
	        key: 'addContainer',
	        value: function addContainer() {
	            var _this2 = this;
	
	            var wrapper = document.createElement('div');
	            addClass('as24-carousel-wrapper', wrapper);
	
	            this.container = document.createElement('div');
	
	            addClass('as24-carousel-container', this.container);
	
	            [].forEach.call(this.element.children, function (element) {
	                var item = element.cloneNode(true);
	                _this2.container.appendChild(item);
	            });
	
	            wrapper.appendChild(this.container);
	
	            this.element.innerHTML = '';
	            this.element.appendChild(wrapper);
	        }
	
	        /**
	         * Adds the 'left' and 'right 'pagination buttons
	         */
	
	    }, {
	        key: 'addPagination',
	        value: function addPagination() {
	            var _arr = [Carousel.Direction.LEFT, Carousel.Direction.RIGHT];
	
	            for (var _i = 0; _i < _arr.length; _i++) {
	                var direction = _arr[_i];
	                this.createPaginationButton(direction);
	            }
	            removeClass('hide', this.pagination.right);
	        }
	
	        /**
	         * Creates the pagination buttons and event listeners
	         * @param {Direction|String} direction - the pagination direction. 'right' or 'left'
	         */
	
	    }, {
	        key: 'createPaginationButton',
	        value: function createPaginationButton(direction) {
	            var _this3 = this;
	
	            var button = this.pagination[direction] = this.pager.cloneNode(true);
	            button.setAttribute('data-direction', direction);
	
	            button.addEventListener('mouseup', function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	                _this3.paginate(direction);
	            });
	
	            button.addEventListener('click', function (e) {
	                return e.preventDefault();
	            });
	
	            this.element.appendChild(button);
	        }
	
	        /**
	         * The handler for the pagination event
	         * @param {Direction|String} direction - the pagination direction. 'right' or 'left'
	         */
	
	    }, {
	        key: 'paginate',
	        value: function paginate(direction) {
	            this.getNewIndex(direction);
	            var distance = this.calculateDistance();
	            this.setPaginationButtonsVisibility();
	            this.loadImages();
	            this.moveContainer(distance);
	        }
	
	        /**
	         * Calculates the moving distance
	         */
	
	    }, {
	        key: 'calculateDistance',
	        value: function calculateDistance() {
	            var distance = this.index * this.stepWidth;
	            distance = distance > this.totalReach ? this.totalReach : distance;
	            return ~distance + 1;
	        }
	
	        /**
	         * Moves the container by the given distance
	         * @param {Number} distance - the moving distance
	         */
	
	    }, {
	        key: 'moveContainer',
	        value: function moveContainer(distance) {
	            distance = distance | 0;
	            this.container.style.transform = 'translate3d(' + distance + 'px, 0, 0)';
	            this.container.style.webkitTransform = 'translate3d(' + distance + 'px, 0, 0)';
	        }
	
	        /**
	         * Sets the visibility of the pagination buttons
	         */
	
	    }, {
	        key: 'setPaginationButtonsVisibility',
	        value: function setPaginationButtonsVisibility() {
	            if (this.index === 0) {
	                addClass('hide', this.pagination.left);
	            } else {
	                removeClass('hide', this.pagination.left);
	            }
	            if (this.index === this.stepLength) {
	                addClass('hide', this.pagination.right);
	            } else {
	                removeClass('hide', this.pagination.right);
	            }
	        }
	
	        /**
	         * Only loads the images of the carousel items that are currently visible
	         */
	
	    }, {
	        key: 'loadImages',
	        value: function loadImages() {
	            var start = this.index;
	            var itemsVisible = Math.ceil(this.element.offsetWidth / this.itemWidth);
	            var end = this.speed === Carousel.Speed.SLOW ? this.index + itemsVisible : (this.index + 1) * itemsVisible;
	            end = end > this.itemsLength ? this.itemsLength : end;
	            for (var i = start; i < end; i++) {
	                var images = this.container.children[i].querySelectorAll('img');
	                [].forEach.call(images, function (image) {
	                    var src = image.getAttribute('data-src');
	                    if (src !== null) {
	                        image.setAttribute('src', src);
	                        image.removeAttribute('data-src');
	                    }
	                });
	            }
	        }
	    }, {
	        key: 'items',
	        get: function get() {
	            return this.element.querySelectorAll('as24-carousel-item');
	        }
	    }]);
	
	    return Carousel;
	}();
	
	/**
	 * Direction Enum string values.
	 * @enum {string}
	 * @readonly
	 */
	
	
	Carousel.Direction = {
	    LEFT: 'left',
	    RIGHT: 'right'
	};
	
	/**
	 * Speed Enum string values.
	 * @enum {string}
	 * @readonly
	 */
	Carousel.Speed = {
	    SLOW: 'slow',
	    FAST: 'fast'
	};
	
	/**
	 * @typedef Coordinate
	 * @type Object
	 * @property {number} [x = 0] - The X Coordinate
	 * @property {number} [y = 0] - The Y Coordinate
	 */
	Carousel.Coordinate = function () {
	    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	    return {
	        x: x,
	        y: y
	    };
	};
	
	/**
	 * Handler for resizing
	 */
	function resizeHandler() {
	    this.carousel.redraw();
	}
	
	/**
	 * Gets called after the element is created
	 */
	function elementCreatedHandler() {
	    this.carousel = new Carousel(this);
	}
	
	/**
	 * Gets called when the element is attached to the dom
	 */
	function elementAttachedHandler() {
	    var _this4 = this;
	
	    this.carousel.init();
	    window.addEventListener('resize', function () {
	        clearTimeout(resizeHandler);
	        setTimeout(resizeHandler.bind(_this4), 300);
	    });
	}
	
	/**
	 * Registering the carousel component
	 */
	try {
	    document.registerElement('as24-carousel', {
	        prototype: _extends(Object.create(HTMLElement.prototype, {
	            createdCallback: { value: elementCreatedHandler },
	            attachedCallback: { value: elementAttachedHandler }
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