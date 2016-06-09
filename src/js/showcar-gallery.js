var customEventPolyfill = require('./custom-event-polyfill');
var H = require('./helper');
let {on, hide, show, appendTo, toggleClass, getWidth, getCSS, setCSS, addClass, removeClass, containsClass} = H;

class Gallery {

    /**
     * @param {Element} element
     */
    constructor(element) {
        customEventPolyfill();
        this.rootElement = element;
        this.galleryID = this.rootElement.getAttribute('data-id') || Math.random().toString(16).substr(2);
        this.container = this.rootElement.querySelector(this.selectors.itemName).parentElement;
        this.items = this.container.querySelectorAll(this.selectors.itemName);

        this.positions = [];
        this.touchStart = {};
        this.touchPrev = {};

        this.duplicateClass = 'duplicate';
        this.centerFirstItem = 'false' !== this.rootElement.getAttribute('data-center-first-item');
        this.focusSingleItem = 'false' !== this.rootElement.getAttribute('data-focus-single-item');

        this.resizeHandler = null;
        this.numberOfItemsToPreload = 0;

        // do this synchronously to omit side effects
        Array.prototype.forEach.call(this.items, (item, index) => {
            item.setAttribute('data-number', index + 1);
        });

        if (this.items.length < 2) {
            this.handleEdgecases();
        }

        this.registerEvent(window, 'resize', this.onResize.bind(this));
        this.registerEvent(this.rootElement.querySelector(this.selectors.leftPager), 'click', this.onPage.bind(this, 'left'));
        this.registerEvent(this.rootElement.querySelector(this.selectors.rightPager), 'click', this.onPage.bind(this, 'right'));
        this.registerEvent(this.rootElement, 'touchstart', this.onTouchStart.bind(this));
        this.registerEvent(this.rootElement, 'touchmove',  this.onTouchMove.bind(this));
        this.registerEvent(this.rootElement, 'touchend',   this.onTouchEnd.bind(this));
    }

    /**
     * @returns {{itemName: string, leftPager: string, rightPager: string, pager: string}}
     */
    get selectors() {
        return {
            itemName:   'as24-gallery-item',
            leftPager:  'as24-gallery .left',
            rightPager: 'as24-gallery .right',
            pager:      'as24-gallery .pager'
        };
    }

    /**
     * Returns the number of items to preload
     *
     * @returns {Number}
     */
    get preloadItems() {
        return parseInt(this.rootElement.getAttribute('data-preload-items') || '0', 10);
    }

    /**
     * @param {Node|HTMLElement} element
     * @param {String} event
     * @param {Function} handler
     * @returns {Zepto}
     */
    registerEvent(element, event, handler) {
        return on(handler, event, element);
    }

    onResize() {
        if (this.resizeHandler) {
            clearTimeout(this.resizeHandler);
        }
        this.resizeHandler = setTimeout(this.render.bind(this), 500);
    }

    /**
     * @param {String} direction left or right
     */
    onPage(direction) {
        if ('left'  === direction) this.moveLeft();
        if ('right' === direction) this.moveRight();

        this.positionItems();
        this.loadImages();
        this.triggerChange();
    }

    /**
     * @param {TouchEvent|Event} event
     */
    onTouchStart(event) {
        const target = event.target;

        Array.prototype.forEach.call(this.items, item => addClass('no-transition', item));
        this.resetTouch();
        if (!containsClass('right', target) && !containsClass('left', target)) {
            this.touchStart = this.getTouchCoords(event);
            this.touchPrev  = this.touchStart;
        }
    }

    /**
     * @param {TouchEvent|Event} event
     */
    onTouchMove(event) {
        if (!this.isSwiping()) {
            return;
        }

        const touchCoords = this.getTouchCoords(event);
        const startDiffX  = Math.abs(touchCoords.x - this.touchStart.x);
        const startDiffY  = Math.abs(touchCoords.y - this.touchStart.y);
        if (startDiffX < startDiffY) {
            Array.prototype.forEach.call(this.items, item => removeClass('no-transition', item));
            this.positionItems();
            this.resetTouch();
        } else {
            event.preventDefault();
            const touchDiffX = touchCoords.x - this.touchPrev.x;
            this.touchPrev = touchCoords;
            this.moveItems(touchDiffX);
        }
    }

    /**
     *
     * @param {TouchEvent|Event} event
     */
    onTouchEnd(event) {
        Array.prototype.forEach.call(this.items, item => removeClass('no-transition', item));

        if (!this.isSwiping()) {
            return;
        }

        const touchCoords = this.getTouchCoords(event.changedTouches[0]);
        let touchDiffX    = this.touchStart.x - touchCoords.x;
        let absTouchDiffX = Math.abs(touchDiffX);
        let howMany       = Math.ceil(absTouchDiffX / this.itemWidth);

        for (let i = 0; i < howMany; i++) {
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

    triggerChange() {
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
    getTouchCoords(event) {
        let touch = event.touches && event.touches[0];

        return {
            x: event.clientX || (touch && touch.clientX),
            y: event.clientY || (touch && touch.clientY)
        };
    }

    resetTouch() {
        this.touchStart = {};
        this.touchPrev  = {};
    }

    /**
     * @returns {boolean}
     */
    isSwiping() {
        return (Object.keys(this.touchStart).length > 0);
    }

    positionItems() {
        Array.prototype.forEach.call(this.items, (item, idx) => {
            setCSS('left', this.positions[idx] + 'px', item);
        });
    }

    resizeOverlays() {
        let rightPager = this.rootElement.querySelector(this.selectors.rightPager);
        let leftPager = this.rootElement.querySelector(this.selectors.leftPager);
        let rightPagerMinWidth = parseInt(getCSS('min-width', rightPager), 10);
        let leftPagerMinWidth = parseInt(getCSS('min-width', leftPager), 10);
        let overlayMinWidth = Math.min(rightPagerMinWidth, leftPagerMinWidth);

        overlayMinWidth += parseInt(getCSS('margin-left', this.items[0]), 10);

        if ((this.itemWidth + 2 * overlayMinWidth) >= getWidth(this.container)) {
            toggleClass('pagination-small', rightPager);
            toggleClass('pagination-small', leftPager);
        }
        let overlayWidth = 0;

        if (this.items.length > 1) {
            const firstChild  = this.items[0];
            overlayWidth      = this.rootElement.clientWidth / 2 - this.itemWidth / 2;
            overlayWidth     -= parseInt(getCSS('margin-left', firstChild), 10);
        }
        
        setCSS('width', overlayWidth + 'px', rightPager);
        setCSS('opacity', 100, rightPager);
        setCSS('width', overlayWidth + 'px', leftPager);
        setCSS('opacity', 100, leftPager);
    }

    fillItems () {
        let noOfItems = this.items.length;
        let space     = 1;

        if (noOfItems < 2) {
            return;
        }
        if (noOfItems > 2) {
            space = this.container.clientWidth - noOfItems * this.itemWidth;
        }

        let itemsToCreate = Math.ceil(Math.ceil(space / this.itemWidth) / noOfItems) * noOfItems;
        let index = noOfItems;
        for (let i = 1; i <= itemsToCreate; i++) {
            let dataNo = i % noOfItems;
            dataNo = dataNo || noOfItems;
            index += 1;
            let clone = this.rootElement.querySelector('[data-number="' + dataNo + '"]').cloneNode(true);
            clone.dataset.number = index;
            addClass(this.duplicateClass, clone);
            let target  = this.rootElement.querySelector('[data-number="' + (index - 1) + '"]');

            target.parentNode.appendChild(clone);
        }

        this.items = this.container.querySelectorAll(this.selectors.itemName);
    }

    showPageInfo() {
        const duplicates    = Array.prototype.filter.call(this.items, (item) => containsClass('.duplicate', item));
        const totalPages    = this.items.length - duplicates.length;
        const middleItem    = this.centerFirstItem ? Math.ceil(this.items.length / 2) : 1;
        const currentNumber = this.items[middleItem - 1].dataset.number;
        const currentPage   = currentNumber % totalPages || totalPages;

        this.rootElement.querySelector(this.selectors.pager).innerHTML = currentPage + '/' + totalPages;
    }

    /**
     * @returns {Number}
     */
    calculateItemWidth() {
        const firstChild = this.items[0];
        let itemWidth    = 0;

        if (firstChild) {
            itemWidth = getWidth(firstChild);
            itemWidth += parseInt(getCSS('margin-left', firstChild), 10);
            itemWidth += parseInt(getCSS('margin-right', firstChild), 10);
        }

        return itemWidth;
    }

    handleEdgecases() {
        hide(this.selectors.leftPager);
        hide(this.selectors.rightPager);
        hide(this.selectors.pager);
        hide(this.rootElement);
        if (0 === this.items.length) {
            show(this.rootElement.querySelector('.placeholder'));
        }
    }

    /**
     * @param {Boolean} reorder
     */
    positionElements(reorder) {
        const itemCount  = this.items.length;
        const middleItem = Math.ceil(this.items.length / 2);
        const centerPos  = this.centerFirstItem ? (this.container.clientWidth - this.itemWidth) / 2 : 0;

        if (reorder) {
            Array.prototype.forEach.call(this.items, (item, index) => {
                if (index <= itemCount / 2) {
                    appendTo(this.container, item);
                }
            });
        }

        this.items     = this.container.querySelectorAll(this.selectors.itemName);// $(this.selectors.itemName, this.container);
        this.positions = [];

        Array.prototype.forEach.call(this.items, (item, index) => {
            let indexDiff = ((index + 1) - middleItem);
            let leftPos   = centerPos + (indexDiff * this.itemWidth);

            this.positions.push(leftPos);
            setCSS('left', leftPos + 'px', item);
        });

        //position pager to bottom center
        let left = (centerPos + (this.itemWidth / 2) - 30) + 'px';
        setCSS('left', left, this.rootElement.querySelector(this.selectors.pager));

        this.showPageInfo();
        this.loadImages();
    }

    loadImages() {
        const itemCount  = this.items.length;
        const middleItem = Math.ceil(itemCount / 2);
        const centerPos  = (this.container.clientWidth - this.itemWidth) / 2;

        Array.prototype.forEach.call(this.items, (item, index) => {
            let indexDiff = ((index + 1) - middleItem);
            let leftPos   = centerPos + (indexDiff * this.itemWidth);

            if (
                leftPos + this.itemWidth + (this.numberOfItemsToPreload * this.itemWidth) > 0 &&
                leftPos - (this.numberOfItemsToPreload * this.itemWidth) < getWidth(this.container)
            ) {
                let image = item.querySelector('[data-src]');
                if (image) {
                    if (image.hasAttribute('data-src')) {
                        image.src = image.getAttribute('data-src');
                        image.removeAttribute('data-src');
                    }
                }
            }
        });
    }

    moveLeft() {
        let last = this.items[this.items.length - 1];
        let parent = last.parentNode;
        parent.insertBefore(last, parent.firstChild);
        this.items = this.container.querySelectorAll(this.selectors.itemName);
        this.showPageInfo();
    }

    moveRight() {
        let parent = this.items[0].parentNode;
        parent.appendChild(parent.removeChild(this.items[0]));
        this.items = this.container.querySelectorAll(this.selectors.itemName);
        this.showPageInfo();
    }

    /**
     * @param {Number} direction
     */
    moveItems(direction) {
        let left;
        let itemWidth = this.itemWidth;

        Array.prototype.forEach((item, index) => {
            if (!left) {
                left = parseInt(getCSS('left', item), 10);
            }
            setCSS('left', left + index * itemWidth + direction + 'px', item);
        });
    }

    /**
     * @param {Boolean} reorder
     */
    render(reorder = false) {
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
    redraw() {
        this.render(true);
    }
}

function onElementCreated() {
    this.gallery = new Gallery(this);
    this.gallery.render();
}

let tagName = 'as24-gallery';

try {
    module.exports = document.registerElement(tagName, {
        prototype: Object.assign(
            Object.create(HTMLElement.prototype, {
                createdCallback: { value: onElementCreated }
            }), {
                redraw: function () {
                    this.gallery.redraw()
                }
            }
        )
    });
} catch (e) {
    if (window && window.console) {
        window.console.warn('Failed to register CustomElement "' + tagName + '".', e);
    }
}
