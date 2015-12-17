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
	
	    init: function init(reorder) {
	        this.itemWidth = this.calculateItemWidth();
	
	        this.fillItems();
	        this.positionElements(reorder);
	
	        $('.right, .left', this.el).toggleClass('pagination-small', this.itemWidth >= this.el.width());
	
	        var overlayWidth = this.el[0].clientWidth / 2 - this.itemWidth / 2;
	        var firstChild = this.el.children(this.itemName).first();
	        overlayWidth -= parseInt(firstChild.css('margin-left'));
	        $('.right, .left', this.el).css('width', overlayWidth);
	    },
	    fillItems: function fillItems() {
	        var noOfItems = this.el.children(this.itemName).length;
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
	
	        this.init(true);
	
	        if (this.isEdgecase()) {
	            this.handleEdgecases();
	            return;
	        }
	
	        //register event handlers
	        $('.left', this.el).click(function () {
	            $('as24-gallery-item', _this.el).addClass('transition');
	            _this.moveItems(_this.itemWidth);
	            _this.moveLeft();
	            $('as24-gallery-item', _this.el).removeClass('transition');
	        });
	        $('.right', this.el).click(function () {
	            $('as24-gallery-item', _this.el).addClass('transition');
	            _this.moveItems(-_this.itemWidth);
	            _this.moveRight();
	            $('as24-gallery-item', _this.el).removeClass('transition');
	        });
	        var ts = 0;
	        var prev = 0;
	        this.el.on('touchstart', function (e) {
	            _this.lazyLoadImages();
	            if ($(e.target).hasClass('right') || $(e.target).hasClass('left')) {
	                ts = null;
	            } else {
	                ts = e.touches[0].clientX;
	                prev = ts;
	            }
	        });
	        this.el.on('click', this.lazyLoadImages);
	
	        this.el.on('touchmove', function (e) {
	            var touchDiffX = e.changedTouches[0].clientX - prev;
	            prev = e.changedTouches[0].clientX;
	            _this.moveItems(touchDiffX);
	        });
	
	        this.el.on('touchend', function (e) {
	            if (ts === null) {
	                return;
	            }
	            // reorder
	            var touchDiffX = ts - e.changedTouches[0].clientX;
	            var absTouchDiffX = Math.abs(touchDiffX);
	            var howMany = Math.ceil(absTouchDiffX / _this.itemWidth);
	
	            for (var i = 0; i < howMany; i++) {
	                if (touchDiffX > 0) {
	                    _this.moveRight();
	                } else if (touchDiffX < 0) {
	                    _this.moveLeft();
	                }
	            }
	            // add transition class
	            $('as24-gallery-item', _this.el).addClass('transition');
	            // go last steps
	            var positions = _this.positions;
	            _this.el.children(_this.itemName).each(function (index) {
	                $(this).css('left', positions[index]);
	            });
	            // remove transition class
	            $('as24-gallery-item', _this.el).removeClass('transition');
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
	    lazyLoadImages: function lazyLoadImages() {
	        $('[data-src]', this.el).each(function (index, item) {
	            item.src = $(item).data('src');
	            $(item).attr('data-src', null);
	        });
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
	    positionElements: function positionElements(reorder) {
	        var _this3 = this;
	
	        var itemCount = this.el.children(this.itemName).length;
	        var middleItem = Math.ceil(itemCount / 2);
	        var centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
	
	        if (reorder) {
	            this.el.children(this.itemName).each(function (index, item) {
	                if (index <= itemCount / 2) {
	                    _this3.el.append(item);
	                }
	            });
	        }
	
	        this.positions = [];
	
	        this.el.children(this.itemName).each(function (index, item) {
	            var indexDiff = index + 1 - middleItem;
	            var leftPos = centerPos + indexDiff * _this3.itemWidth;
	
	            if (leftPos + _this3.itemWidth > 0 && leftPos < _this3.el.width()) {
	                var image = $('[data-src]', item);
	                if (image.length > 0) {
	                    image[0].src = image.data('src');
	                    image.attr('data-src', null);
	                }
	            }
	
	            _this3.positions.push(leftPos);
	
	            $(item).css('left', leftPos);
	        });
	    },
	    moveLeft: function moveLeft() {
	        this.el.children(this.itemName).last().insertBefore(this.el.children(this.itemName).first());
	        this.pager();
	    },
	    moveRight: function moveRight() {
	        this.el.children(this.itemName).first().insertAfter(this.el.children(this.itemName).last());
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
	    }
	});
	
	document.registerElement('as24-gallery', {
	    prototype: as24gallery
	});

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-gallery.js.map