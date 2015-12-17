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
	    itemName: 'as24-gallery-item',
	    duplicateClass: 'duplicate',
	    positions: [],
	    touchStart: {},
	    touchPrev: {},
	
	    createdCallback: function createdCallback() {
	        var _this = this;
	
	        var handler,
	            timeout = 500;
	
	        $(window).on('resize', function () {
	            if (handler) {
	                clearTimeout(handler);
	            }
	            handler = setTimeout(function () {
	                _this.init();
	            }, timeout);
	        });
	
	        this.el = $(this);
	
	        if (this.isEdgecase()) {
	            this.handleEdgecases();
	            return;
	        }
	
	        this.init(true);
	
	        $('.left', this.el).click(function () {
	            var positions = _this.positions;
	            _this.moveLeft();
	            _this.el.children(_this.itemName).each(function (index) {
	                $(this).css('left', positions[index]);
	            });
	        });
	        $('.right', this.el).click(function () {
	            var positions = _this.positions;
	            _this.moveRight();
	
	            _this.el.children(_this.itemName).each(function (index) {
	                $(this).css('left', positions[index]);
	            });
	        });
	        this.el.on('touchstart', function (e) {
	            _this.lazyLoadImages();
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
	                _this.el.children(_this.itemName).each(function (index) {
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
	
	            for (var i = 0; i < howMany; i++) {
	                if (touchDiffX > 0) {
	                    _this.moveRight();
	                } else if (touchDiffX < 0) {
	                    _this.moveLeft();
	                }
	            }
	            var positions = _this.positions;
	            _this.el.children(_this.itemName).each(function (index) {
	                $(this).css('left', positions[index]);
	            });
	        });
	        this.el.on('click', this.lazyLoadImages);
	        this.pager();
	    },
	    init: function init(reorder) {
	        this.itemWidth = this.calculateItemWidth();
	
	        this.fillItems();
	        this.positionElements(reorder);
	        this.resizeOverlays();
	    },
	
	    resizeOverlays: function resizeOverlays() {
	        var overlays = $('.right, .left', this.el);
	        overlays.toggleClass('pagination-small', this.itemWidth >= this.el.width());
	        var overlayWidth = 0;
	        if (this.el.children(this.itemName).length > 1) {
	            overlayWidth = this.el[0].clientWidth / 2 - this.itemWidth / 2;
	            var firstChild = this.el.children(this.itemName).first();
	            overlayWidth -= parseInt(firstChild.css('margin-left'));
	        }
	        $('.right, .left', this.el).css('width', overlayWidth);
	    },
	
	    fillItems: function fillItems() {
	        var noOfItems = this.el.children(this.itemName).length;
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
	        var items = this.el.children(this.itemName);
	        var duplicates = items.filter('.duplicate');
	        var totalPages = items.length - duplicates.length;
	
	        // how to get the current Element?
	        var middleItem = Math.ceil(items.length / 2);
	        var currentNumber = $(items[middleItem - 1]).data('number');
	        var currentPage = currentNumber % totalPages || totalPages;
	        $('.pager', this.el).html(currentPage + '/' + totalPages);
	    },
	    calculateItemWidth: function calculateItemWidth() {
	        var firstChild = this.el.children(this.itemName).first();
	        var itemWidth = firstChild.width();
	        itemWidth += parseInt(firstChild.css('margin-left'));
	        itemWidth += parseInt(firstChild.css('margin-right'));
	
	        return itemWidth;
	    },
	    lazyLoadImages: function lazyLoadImages() {
	        $('[data-src]', this.el).each(function (index, item) {
	            item.src = $(item).data('src');
	            $(item).attr('data-src', null);
	        });
	    },
	    isEdgecase: function isEdgecase() {
	        return this.el.children(this.itemName).length < 1;
	    },
	    handleEdgecases: function handleEdgecases() {
	        $('.left, .right, .pager', this.el).hide();
	
	        switch (this.el.children(this.itemName).length) {
	            case 0:
	                $('.placeholder', this.el).show();
	                break;
	            case 1:
	                break;
	                var item = this.el.children(this.itemName);
	                var centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
	                $(item).css('left', centerPos);
	                break;
	        }
	    },
	    positionElements: function positionElements(reorder) {
	        var _this2 = this;
	
	        var itemCount = this.el.children(this.itemName).length;
	        var middleItem = Math.ceil(itemCount / 2);
	        var centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
	
	        if (reorder) {
	            this.el.children(this.itemName).each(function (index, item) {
	                if (index <= itemCount / 2) {
	                    _this2.el.append(item);
	                }
	            });
	        }
	
	        this.positions = [];
	
	        this.el.children(this.itemName).each(function (index, item) {
	            var indexDiff = index + 1 - middleItem;
	            var leftPos = centerPos + indexDiff * _this2.itemWidth;
	
	            if (leftPos + _this2.itemWidth > 0 && leftPos < _this2.el.width()) {
	                var image = $('[data-src]', item);
	                if (image.length > 0) {
	                    image[0].src = image.data('src');
	                    image.attr('data-src', null);
	                }
	            }
	
	            _this2.positions.push(leftPos);
	
	            $(item).css('left', leftPos);
	        });
	    },
	    moveLeft: function moveLeft() {
	        var items = this.el.children(this.itemName);
	        items.last().insertBefore(items.first());
	        this.pager();
	    },
	    moveRight: function moveRight() {
	        var items = this.el.children(this.itemName);
	        items.first().insertAfter(items.last());
	        this.pager();
	    },
	    moveItems: function moveItems(direction) {
	        var left;
	        var itemWidth = this.itemWidth;
	        this.el.children(this.itemName).each(function (index) {
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