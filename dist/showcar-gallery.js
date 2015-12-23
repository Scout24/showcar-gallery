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
	    items: null,
	    duplicateClass: 'duplicate',
	    positions: [],
	    touchStart: {},
	    touchPrev: {},
	    numberOfItemsToPreload: 2,
	
	    selectors: {
	        itemName: 'as24-gallery-item',
	        leftPager: '.left',
	        rightPager: '.right',
	        pager: '.pager'
	    },
	
	    createdCallback: function createdCallback() {
	        var _this = this;
	
	        var handler,
	            timeout = 500;
	
	        var preload = $(this).data('preload-items');
	        if (preload) {
	            this.numberOfItemsToPreload = $(this).data('preload-items');
	        }
	
	        $(window).on('resize', function () {
	            if (handler) {
	                clearTimeout(handler);
	            }
	            handler = setTimeout(function () {
	                _this.init();
	            }, timeout);
	        });
	
	        this.el = $(this);
	        this.items = this.el.children(this.selectors.itemName);
	
	        // do this synchronously to omit side effects
	        for (var i = 0; i <= this.items.length; i++) {
	            $(this.items[i]).attr('data-number', i + 1);
	        }
	
	        if (this.items.length < 2) {
	            this.handleEdgecases();
	        }
	
	        this.init(true);
	
	        $(this.selectors.leftPager, this.el).click(function () {
	            var positions = _this.positions;
	            _this.moveLeft();
	            _this.items.each(function (index) {
	                $(this).css('left', positions[index]);
	            });
	            _this.load();
	        });
	        $(this.selectors.rightPager, this.el).click(function () {
	            var positions = _this.positions;
	            _this.moveRight();
	
	            _this.items.each(function (index) {
	                $(this).css('left', positions[index]);
	            });
	            _this.load();
	        });
	        this.el.on('touchstart', function (e) {
	            $('as24-gallery-item', _this.el).addClass('no-transition');
	            _this.resetTouch();
	            if (!$(e.target).hasClass('right') && !$(e.target).hasClass('left')) {
	                _this.touchStart = _this.getTouchCoords(e);
	                _this.touchPrev = _this.touchStart;
	            }
	        });
	
	        this.el.on('touchmove', function (e) {
	            if (!_this.isSwiping()) {
	                return;
	            }
	            var touchCoords = _this.getTouchCoords(e);
	            var startDiffX = Math.abs(touchCoords.x - _this.touchStart.x);
	            var startDiffY = Math.abs(touchCoords.y - _this.touchStart.y);
	            if (startDiffX < startDiffY) {
	                $('as24-gallery-item', _this.el).removeClass('no-transition');
	                var positions = _this.positions;
	                _this.items.each(function (index) {
	                    $(this).css('left', positions[index]);
	                });
	                _this.resetTouch();
	            } else {
	                e.preventDefault();
	                var touchDiffX = touchCoords.x - _this.touchPrev.x;
	                _this.touchPrev = touchCoords;
	                _this.moveItems(touchDiffX);
	            }
	        });
	
	        this.el.on('touchend', function (e) {
	            $('as24-gallery-item', _this.el).removeClass('no-transition');
	            if (!_this.isSwiping()) {
	                return;
	            }
	            var touchCoords = _this.getTouchCoords(e.changedTouches[0]);
	            var touchDiffX = _this.touchStart.x - touchCoords.x;
	            var absTouchDiffX = Math.abs(touchDiffX);
	            var howMany = Math.ceil(absTouchDiffX / _this.itemWidth);
	
	            var direction;
	            for (var i = 0; i < howMany; i++) {
	                if (touchDiffX > 0) {
	                    _this.moveRight();
	                    _this.load();
	                } else if (touchDiffX < 0) {
	                    _this.moveLeft();
	                    _this.load();
	                }
	            }
	            var positions = _this.positions;
	            _this.items.each(function (index) {
	                $(this).css('left', positions[index]);
	            });
	        });
	    },
	    init: function init(reorder) {
	        this.itemWidth = this.calculateItemWidth();
	        this.fillItems();
	        this.positionElements(reorder);
	        this.resizeOverlays();
	    },
	
	    resizeOverlays: function resizeOverlays() {
	        var overlays = $(this.selectors.rightPager + ', ' + this.selectors.leftPager, this.el);
	        var overlayMinWidth = parseInt(overlays.css('min-width'));
	        overlayMinWidth += parseInt(this.items.first().css('margin-left'));
	        overlays.toggleClass('pagination-small', this.itemWidth + 2 * overlayMinWidth >= this.el.width());
	        var overlayWidth = 0;
	        if (this.items.length > 1) {
	            overlayWidth = this.el[0].clientWidth / 2 - this.itemWidth / 2;
	            var firstChild = this.items.first();
	            overlayWidth -= parseInt(firstChild.css('margin-left'));
	        }
	        overlays.css('width', overlayWidth);
	    },
	
	    fillItems: function fillItems() {
	        var noOfItems = this.items.length;
	        if (noOfItems < 2) {
	            return;
	        }
	        var space = this.el[0].clientWidth - noOfItems * this.itemWidth;
	
	        if (space > 0) {
	            var numberOfItemsToCreate = Math.ceil(Math.ceil(space / this.itemWidth) / noOfItems) * noOfItems;
	            var index = noOfItems;
	            for (var i = 1; i <= numberOfItemsToCreate; i++) {
	                var dataNo = i % noOfItems;
	                dataNo = dataNo || noOfItems;
	                index += 1;
	                var el = $('[data-number="' + dataNo + '"').clone().data('number', index).addClass(this.duplicateClass);
	                var target = $('[data-number="' + (index - 1) + '"]');
	                target.after(el);
	            }
	        }
	    },
	    pager: function pager() {
	        var duplicates = this.items.filter('.duplicate');
	        var totalPages = this.items.length - duplicates.length;
	
	        var middleItem = Math.ceil(this.items.length / 2);
	        var currentNumber = $(this.items[middleItem - 1]).data('number');
	        var currentPage = currentNumber % totalPages || totalPages;
	        $(this.selectors.pager, this.el).html(currentPage + '/' + totalPages);
	    },
	    calculateItemWidth: function calculateItemWidth() {
	        var firstChild = this.items.first();
	        var itemWidth = 0;
	        if (firstChild.length > 0) {
	            itemWidth = firstChild.width();
	            itemWidth += parseInt(firstChild.css('margin-left'));
	            itemWidth += parseInt(firstChild.css('margin-right'));
	        }
	
	        return itemWidth;
	    },
	    handleEdgecases: function handleEdgecases() {
	        $(this.selectors.leftPager + ', ' + this.selectors.rightPager + ', ' + this.selectors.pager, this.el).hide();
	        if (this.items.length === 0) {
	            $('.placeholder', this.el).show();
	        }
	    },
	    positionElements: function positionElements(reorder) {
	        var _this2 = this;
	
	        var itemCount = this.items.length;
	        var middleItem = Math.ceil(itemCount / 2);
	        var centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
	
	        if (reorder) {
	            this.items.each(function (index, item) {
	                if (index <= itemCount / 2) {
	                    _this2.el.append(item);
	                }
	            });
	            this.items = this.el.children(this.selectors.itemName);
	        }
	
	        this.positions = [];
	
	        this.items.each(function (index, item) {
	            var indexDiff = index + 1 - middleItem;
	            var leftPos = centerPos + indexDiff * _this2.itemWidth;
	
	            _this2.positions.push(leftPos);
	
	            $(item).css('left', leftPos);
	        });
	        //position pager to left bottom corner
	        $(this.selectors.pager, this.el).css('left', centerPos + parseInt(this.items.first().css('margin-left')));
	
	        this.pager();
	        this.load();
	    },
	    load: function load() {
	        var _this3 = this;
	
	        var itemCount = this.items.length;
	        var middleItem = Math.ceil(itemCount / 2);
	        var centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
	        this.items.each(function (index, item) {
	            var indexDiff = index + 1 - middleItem;
	            var leftPos = centerPos + indexDiff * _this3.itemWidth;
	
	            if (leftPos + _this3.itemWidth + _this3.numberOfItemsToPreload * _this3.itemWidth > 0 && leftPos - _this3.numberOfItemsToPreload * _this3.itemWidth < _this3.el.width()) {
	                var image = $('[data-src]', item);
	                if (image.length > 0) {
	                    image[0].src = image.data('src');
	                    image.attr('data-src', null);
	                }
	            }
	        });
	    },
	    moveLeft: function moveLeft() {
	        this.items.last().insertBefore(this.items.first());
	        this.items = this.el.children(this.selectors.itemName);
	        this.pager();
	    },
	    moveRight: function moveRight() {
	        this.items.first().insertAfter(this.items.last());
	        this.items = this.el.children(this.selectors.itemName);
	        this.pager();
	    },
	    moveItems: function moveItems(direction) {
	        var left;
	        var itemWidth = this.itemWidth;
	        this.items.each(function (index) {
	            if (!left) {
	                left = parseInt($(this).css('left'));
	            }
	            $(this).css('left', left + index * itemWidth + direction);
	        });
	    },
	    resetTouch: function resetTouch() {
	        this.touchStart = {};
	        this.touchPrev = {};
	    },
	    isSwiping: function isSwiping() {
	        return Object.keys(this.touchStart).length > 0;
	    },
	    getTouchCoords: function getTouchCoords(e) {
	        var touch = e.touches && e.touches[0];
	
	        return {
	            x: e.clientX || touch && touch.clientX,
	            y: e.clientY || touch && touch.clientY
	        };
	    }
	});
	
	document.registerElement('as24-gallery', {
	    prototype: as24gallery
	});

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-gallery.js.map