class Carousel {

    constructor(element) {
        this.element   = $(element);
        this.container = null;
        this.pagination = {
            left: null,
            right: null
        };
        this.offset = 0;
        this.itemWidth = 310;

        this.touchStart = {};
        this.touchPrev  = {};

        this.render();

        this.element.on('slide', this.paginate.bind(this));

        this.element.on('touchstart', this.onTouchStart.bind(this));
        this.element.on('touchmove',  this.onTouchMove.bind(this));
        this.element.on('touchend',   this.onTouchEnd.bind(this));
    }

    get items() {
        return $('as24-carousel-item', this.element);
    }

    /**
     * Do all the stuff needed for rendering the carousel
     */
    render() {
        this.wrapContainer();
        this.loadPagination();
        this.showRightPagination();
        this.loadVisibleImages();
    }

    /**
     * Redraw the whole carousel (can be triggered from outside)
     */
    redraw() {
        this.render();
    }

    /**
     * @param {TouchEvent|Event} event
     */
    onTouchStart(event) {
        const target = $(event.target);

        this.items.addClass('no-transition');
        this.resetTouch();
        if (!target.hasClass('as24-pagination')) {
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

    wrapContainer() {
        this.container = this.element.children().wrapAll('<div class="as24-carousel-container">').parent();
        this.container.wrapAll('<div class="as24-carousel-wrapper">');
    }

    hideLeftPagination() {
        this.pagination.left.addClass('hide');
    }

    hideRightPagination() {
        this.pagination.right.addClass('hide');
    }

    showLeftPagination() {
        this.pagination.left.removeClass('hide');
    }

    showRightPagination() {
        this.pagination.right.removeClass('hide');
    }

    loadPagination() {
        const pager = $('<a href="#" class="as24-pagination hide">');
        this.pagination.left = pager.clone().data('dir', 'left').on('click touch', (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.element.trigger('slide', ['left'])
        });
        this.pagination.right = pager.clone().data('dir', 'right').on('click touch', (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.element.trigger('slide', ['right'])
        });
        this.element.append(this.pagination.left).append(this.pagination.right);
    }

    paginate(event, direction) {
        const container = this.element[0].querySelector('.as24-carousel-container');
        const item      = this.items.first();
        let distance    = this.getItemWidth(item);
        const minOffset = this.getMinOffset();
        let newOffset;

        switch (direction) {
            case 'left':
                const maxOffset = 0;
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

            this.pagination.right.css({ 'margin-right': '20px' });
            this.pagination.left.css({ 'margin-left': '0' });
        } else {
            this.showLeftPagination();
        }
        if (minOffset >= this.offset) {
            this.hideRightPagination();
            this.element.css({ 'margin': '0 20px 0 0' });

            this.pagination.left.css({ 'margin-left': '20px' });
            this.pagination.right.css({ 'margin-right': '0' });
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

    getMinOffset() {
        let fullWidth = 0;
        this.items.each((index, item) => {
            fullWidth += this.getItemWidth($(item));
        });
        return -fullWidth + this.getViewWidth() + 2 * parseInt(this.items.last().css('margin-right'), 10);
    }

    isItemVisible(item) {
        const viewOffset = this.getViewDimension().left;
        const itemDimensions = item.offset();
        const itemIsOuterLeft = itemDimensions.left + itemDimensions.width < viewOffset - this.offset;
        const itemIsOuterRight = itemDimensions.left > viewOffset - this.offset + this.getViewWidth();

        return !itemIsOuterLeft && !itemIsOuterRight;
    }

    loadImagesForItem(item) {
        const images = $('img[data-src]', item);

        images.each((index, image) => {
            const $img = $(image);
            $img.attr('src', $img.data('src')).removeAttr('data-src');
        });
    }

    loadVisibleImages() {
        this.items.each((index, item) => {
            let queriedItem = $(item);
            // fix width and height for mobile devices
            let elementOffset = this.element.offset();
            let carouselWidth = elementOffset.width;

            if (carouselWidth < queriedItem.width() && carouselWidth > 0) {
                this.itemWidth = elementOffset.width - 20;
                queriedItem.css({
                    width: this.itemWidth,
                    height: elementOffset.height
                });
            }
            if (this.isItemVisible(queriedItem)) {
                this.loadImagesForItem(item);
            }
        });
    }

    getItemWidth(item) {
        const margin = parseInt(item.css('margin-right'), 10) * 2;
        return item.width() + margin;
    }

    getViewWidth() {
        return this.element.width();
    }

    getViewDimension() {
        "use strict";
        return this.element.offset();
    }

}

function onElementCreated() {
    this.carousel = new Carousel(this);
}

try {
    document.registerElement('as24-carousel', {
        prototype: Object.assign(
            Object.create( HTMLElement.prototype, {
                createdCallback: { value: onElementCreated }
            }), {
                redraw: function () {
                    this.carousel.redraw();
                    this.carousel.element.css({ 'margin': '0 0 0 20px' });
                    this.carousel.pagination.right.css({ 'margin-right': '20px' });
                    this.carousel.pagination.left.css({ 'margin-left': '0' });
                }
            }
        )
    });
} catch (e) {
    if (window && window.console) {
        window.console.warn('Failed to register CustomElement "as24-carousel".', e);
    }
}
