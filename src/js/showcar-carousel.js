let as24carousel = Object.assign(Object.create(HTMLElement.prototype), {
    items: [],
    el: null,
    container: null,
    pagination: {
        left: null,
        right: null
    },
    offset: 0,

    wrapContainer() {
        this.container = this.el.children().wrapAll('<div class="as24-carousel-container">').parent();
    },

    hideLeftPagination() {
        this.pagination.left && this.pagination.left.addClass('hide');
    },

    hideRightPagination() {
        this.pagination.right && this.pagination.right.addClass('hide');
    },

    showLeftPagination() {
        this.pagination.left && this.pagination.left.removeClass('hide');
    },

    showRightPagination() {
        this.pagination.right && this.pagination.right.removeClass('hide');
    },

    loadPagination() {
        const pager = $('<a href="#!" class="as24-pagination hide">');
        this.pagination.left = pager.clone().data('dir', 'left').on('click touch', () => {
            this.el.trigger('slide', ['left'])
        });
        this.pagination.right = pager.clone().data('dir', 'right').on('click touch', () => {
            this.el.trigger('slide', ['right'])
        });
        this.el.append(this.pagination.left).append(this.pagination.right);
    },

    paginate(event, direction) {
        const item = this.items.first();
        let distance = this.getItemWidth(item);
        const minOffset = this.getMinOffset();
        let newOffset;

        switch (direction) {
            case 'left':
                let maxOffset = 0;
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
        } else {
            this.showLeftPagination();
        }
        if (minOffset >= this.offset) {
            this.hideRightPagination();
        } else {
            this.showRightPagination();
        }
        this.loadVisibleImages();
        this.container.css('transform', 'translate3d(' + this.offset + 'px, 0, 0)');
    },

    getMinOffset() {
        let fullWidth = 0;
        this.items.each((index, item) => {
            fullWidth += this.getItemWidth($(item));
        });
        return -fullWidth + this.getViewWidth() + 2 * parseInt(this.items.last().css('margin-right'), 10);
    },

    isItemVisible(item) {
        const viewOffset = this.getViewDimension().left;
        const itemDimensions = item.offset();
        const itemIsOuterLeft = itemDimensions.left + itemDimensions.width < viewOffset - this.offset;
        const itemIsOuterRight = itemDimensions.left > viewOffset - this.offset + this.getViewWidth();

        return !itemIsOuterLeft && !itemIsOuterRight;
    },

    loadImagesForItem(item) {
        const images = $('img[data-src]', item);

        images.each((index, image) => {
            const $img = $(image);
            $img.attr('src', $img.data('src')).removeAttr('data-src');
        });
    },

    loadVisibleImages() {
        this.items.each((index, item) => {
            if (this.isItemVisible($(item))) {
                this.loadImagesForItem(item);
            }
        });
    },

    getItemWidth(item) {
        const margin = parseInt(item.css('margin-right'), 10) * 2;
        return item.width() + margin;
    },

    getViewWidth() {
        return this.el.width();
    },

    getViewDimension() {
        "use strict";
        return this.el.offset();
    },

    createdCallback() {
        this.el = $(this);
        this.items = $('as24-carousel-item', this.el);
        this.wrapContainer();
        this.loadPagination();
        this.showRightPagination();
        this.loadVisibleImages();

        this.el.on('slide', this.paginate);
    }
});

try {
    document.registerElement('as24-carousel', {
        prototype: as24carousel
    });
} catch (e) {
    if (window && window.console) {
        window.console.warn('Failed to register CustomElement "as24-carousel".', e);
    }
}
