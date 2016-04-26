
class Gallery {

    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.rootElement = $(element);
        this.container   = $(this.selectors.itemName, this.rootElement).parent();
        this.items       = $(this.selectors.itemName, this.container);

        this.positions  = [];
        this.touchStart = {};
        this.touchPrev  = {};

        this.duplicateClass  = 'duplicate';
        this.centerFirstItem = false !== this.rootElement.data('center-first-item');
        this.focusSingleItem = false !== this.rootElement.data('focus-single-item');

        this.resizeHandler          = null;
        this.numberOfItemsToPreload = 0;

        // do this synchronously to omit side effects
        this.items.each((index, item) => {
            $(item).attr('data-number', index + 1);
        });

        if (this.items.length < 2) {
            this.handleEdgecases();
        }

        this.registerEvent(window, 'resize', this.onResize.bind(this));
        this.registerEvent(this.selectors.leftPager,  'click', this.onPage.bind(this, 'left'));
        this.registerEvent(this.selectors.rightPager, 'click', this.onPage.bind(this, 'right'));
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
            leftPager:  '.left',
            rightPager: '.right',
            pager:      '.pager'
        };
    }

    /**
     * Returns the number of items to preload
     *
     * @returns {Number}
     */
    get preloadItems() {
        return this.rootElement.data('preload-items') || 0;
    }

    /**
     * @param {HTMLElement} element
     * @param {Event} event
     * @param {Function} handler
     * @returns {Zepto}
     */
    registerEvent(element, event, handler) {
        return $(element).on(event, handler);
    }

    onResize() {
        this.resizeHandler && clearTimeout(this.resizeHandler);
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
        const target = $(event.target);

        this.items.addClass('no-transition');
        this.resetTouch();
        if (!target.hasClass('right') && !target.hasClass('left')) {
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
            this.items.removeClass('no-transition');

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
        this.items.removeClass('no-transition');
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
        this.rootElement.trigger('as24-gallery:change', []);
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
        this.items.each((index, item) => {
            $(item).css('left', this.positions[index]);
        });
    }

    resizeOverlays() {
        let overlays        = $(this.selectors.rightPager + ', ' + this.selectors.leftPager, this.rootElement);
        let overlayMinWidth = parseInt(overlays.css('min-width'));

        overlayMinWidth += parseInt(this.items.first().css('margin-left'));
        overlays.toggleClass('pagination-small', (this.itemWidth + 2 * overlayMinWidth) >= this.container.width());
        let overlayWidth = 0;

        if (this.items.length > 1) {
            const firstChild  = this.items.first();
            overlayWidth      = this.rootElement[0].clientWidth / 2 - this.itemWidth / 2;
            overlayWidth     -= parseInt(firstChild.css('margin-left'));
        }

        overlays.css({ 'width': overlayWidth, 'opacity': 100 });
    }

    fillItems () {
        let noOfItems = this.items.length;
        let space     = 1;

        if (noOfItems < 2) {
            return;
        }
        if (noOfItems > 2) {
            space = this.container.get(0).clientWidth - noOfItems * this.itemWidth;
        }

        let itemsToCreate = Math.ceil(Math.ceil(space / this.itemWidth) / noOfItems) * noOfItems;
        let index         = noOfItems;
        for (let i = 1; i <= itemsToCreate; i++) {
            let dataNo  = i % noOfItems;
            dataNo      = dataNo || noOfItems;
            index      += 1;
            let element = $('[data-number="' + dataNo + '"]').clone().data('number', index).addClass(this.duplicateClass);
            let target  = $('[data-number="' + (index - 1) + '"]');

            target.after(element);
        }

        this.items = $(this.selectors.itemName, this.container);
    }

    showPageInfo() {
        const duplicates    = this.items.filter('.duplicate');
        const totalPages    = this.items.length - duplicates.length;
        const middleItem    = this.centerFirstItem ? Math.ceil(this.items.length / 2) : 1;
        const currentNumber = $(this.items[middleItem - 1]).data('number');
        const currentPage   = currentNumber % totalPages || totalPages;

        $(this.selectors.pager, this.rootElement).html(currentPage + '/' + totalPages);
    }

    /**
     * @returns {Number}
     */
    calculateItemWidth() {
        const firstChild = this.items.first();
        let itemWidth    = 0;

        if (firstChild.length > 0) {
            itemWidth = firstChild.width();
            itemWidth += parseInt(firstChild.css('margin-left'), 10);
            itemWidth += parseInt(firstChild.css('margin-right'), 10);
        }

        return itemWidth;
    }

    handleEdgecases() {
        $(this.selectors.leftPager + ', ' + this.selectors.rightPager + ', ' + this.selectors.pager, this.rootElement).hide();
        0 === this.items.length && $('.placeholder', this.rootElement).show();
    }

    /**
     * @param {Boolean} reorder
     */
    positionElements(reorder) {
        const itemCount  = this.items.length;
        const middleItem = Math.ceil(this.items.length / 2);
        const centerPos  = this.centerFirstItem ? (this.container.get(0).clientWidth - this.itemWidth) / 2 : 0;

        if (reorder) {
            this.items.each((index, item) => {
                if (index <= itemCount / 2) {
                    this.container.append(item);
                }
            });
        }

        this.items     = $(this.selectors.itemName, this.container);
        this.positions = [];

        this.items.each((index, item) => {
            let indexDiff = ((index + 1) - middleItem);
            let leftPos   = centerPos + (indexDiff * this.itemWidth);

            this.positions.push(leftPos);
            $(item).css('left', leftPos);
        });

        //position pager to bottom center
        $(this.selectors.pager, this.rootElement).css('left', centerPos + (this.itemWidth / 2) - 30);

        this.showPageInfo();
        this.loadImages();
    }

    loadImages() {
        const itemCount  = this.items.length;
        const middleItem = Math.ceil(itemCount / 2);
        const centerPos  = (this.container.get(0).clientWidth - this.itemWidth) / 2;

        this.items.each((index, item) => {
            let indexDiff = ((index + 1) - middleItem);
            let leftPos   = centerPos + (indexDiff * this.itemWidth);

            if (leftPos + this.itemWidth + (this.numberOfItemsToPreload * this.itemWidth) > 0 && leftPos - (this.numberOfItemsToPreload * this.itemWidth) < this.container.width()) {
                let image = $('[data-src]', item);
                if (image.length > 0) {
                    image[0].src = image.data('src');
                    image.attr('data-src', null);
                }
            }
        });
    }

    moveLeft() {
        this.items.last().insertBefore(this.items.first());
        this.items = $(this.selectors.itemName, this.container);
        this.showPageInfo();
    }

    moveRight() {
        this.items.first().insertAfter(this.items.last());
        this.items = $(this.selectors.itemName, this.container);
        this.showPageInfo();
    }

    /**
     * @param {Number} direction
     */
    moveItems(direction) {
        let left;
        let itemWidth = this.itemWidth;

        this.items.each((index, item) => {
            if (!left) {
                left = parseInt($(item).css('left'));
            }
            $(item).css('left', left + index * itemWidth + direction);
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
