let as24gallery = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    itemWidth: 0,
    items: null,
    duplicateClass: 'duplicate',
    positions: [],
    touchStart: {},
    touchPrev: {},
    numberOfItemsToPreload: 2,
    centerFirstItem: true,
    focusSingleItem: true,
    container: null,

    selectors: {
        itemName: 'as24-gallery-item',
        leftPager: '.left',
        rightPager: '.right',
        pager: '.pager'
    },

    createdCallback () {
        let handler;
        const timeout = 500;
        const preload = $(this).data('preload-items');

        if (preload) {
            this.numberOfItemsToPreload = $(this).data('preload-items');
        }

        $(window).on('resize', () => {
            handler && clearTimeout(handler);
            handler = setTimeout(() => {
                this.init();
            }, timeout);
        });

        this.el = $(this);
        this.container = $(this.selectors.itemName, this.el).parent();
        this.items = $(this.selectors.itemName, this.container);
        this.centerFirstItem = false !== $(this).data('center-first-item');
        this.focusSingleItem = false !== $(this).data('focus-single-item');

        // do this synchronously to omit side effects
        this.items.each((index, item) => {
            $(item).attr('data-number', index + 1);
        });

        if (this.items.length < 2) {
            this.handleEdgecases();
        }

        this.init(true);

        $(this.selectors.leftPager, this.el).click(() => {
            const positions = this.positions;
            this.moveLeft();
            this.items.each((index, item) => {
                $(item).css('left', positions[index]);
            });
            this.load();
        });

        $(this.selectors.rightPager, this.el).click(() => {
            const positions = this.positions;
            this.moveRight();
            this.items.each((index, item) => {
                $(item).css('left', positions[index]);
            });
            this.load();
        });

        this.el.on('touchstart', (e) => {
            const target = $(e.target);
            $(this.selectors.itemName, this.container).addClass('no-transition');
            this.resetTouch();
            if (!target.hasClass('right') && !target.hasClass('left')) {
                this.touchStart = this.getTouchCoords(e);
                this.touchPrev = this.touchStart;
            }
        });

        this.el.on('touchmove', (e) => {
            if (!this.isSwiping()) {
                return;
            }
            const touchCoords = this.getTouchCoords(e);
            const startDiffX = Math.abs(touchCoords.x - this.touchStart.x);
            const startDiffY = Math.abs(touchCoords.y - this.touchStart.y);
            if (startDiffX < startDiffY) {
                $(this.selectors.itemName, this.container).removeClass('no-transition');
                let positions = this.positions;
                this.items.each((index, item) => {
                    $(item).css('left', positions[index]);
                });
                this.resetTouch();
            } else {
                e.preventDefault();
                const touchDiffX = touchCoords.x - this.touchPrev.x;
                this.touchPrev = touchCoords;
                this.moveItems(touchDiffX);
            }
        });

        this.el.on('touchend', (e) => {
            $(this.selectors.itemName, this.container).removeClass('no-transition');
            if (!this.isSwiping()) {
                return;
            }
            const touchCoords = this.getTouchCoords(e.changedTouches[0]);
            let touchDiffX = this.touchStart.x - touchCoords.x;
            let absTouchDiffX = Math.abs(touchDiffX);
            let howMany = Math.ceil(absTouchDiffX / this.itemWidth);

            for (let i = 0; i < howMany; i++) {
                if (touchDiffX > 0) {
                    this.moveRight();
                    this.load()
                } else if (touchDiffX < 0) {
                    this.moveLeft();
                    this.load();
                }
            }
            let positions = this.positions;
            this.items.each((index, item) => {
                $(item).css('left', positions[index]);
            });
        });
    },

    init(reorder) {
        this.itemWidth = this.calculateItemWidth();
        this.fillItems();
        this.positionElements(reorder);
        if (this.focusSingleItem) {
            this.resizeOverlays();
        }
    },

    resizeOverlays: function () {
        let overlays = $(this.selectors.rightPager + ', ' + this.selectors.leftPager, this.el);
        let overlayMinWidth = parseInt(overlays.css('min-width'));
        overlayMinWidth += parseInt(this.items.first().css('margin-left'));
        overlays.toggleClass('pagination-small', (this.itemWidth + 2 * overlayMinWidth) >= this.container.width());
        let overlayWidth = 0;
        if (this.items.length > 1) {
            overlayWidth = this.el[0].clientWidth / 2 - this.itemWidth / 2;
            const firstChild = this.items.first();
            overlayWidth -= parseInt(firstChild.css('margin-left'));
        }
        overlays.css('width', overlayWidth);
    },

    fillItems () {
        let noOfItems = this.items.length;
        let space = 1;

        if (noOfItems < 2) {
            return;
        }

        if (noOfItems > 2) {
            space = this.container.get(0).clientWidth - noOfItems * this.itemWidth;
        }

        if (space <= 0) {
            return;
        }
        let numberOfItemsToCreate = Math.ceil(Math.ceil(space / this.itemWidth) / noOfItems) * noOfItems;
        let index = noOfItems;
        for (let i = 1; i <= numberOfItemsToCreate; i++) {
            let dataNo = i % noOfItems;
            dataNo = dataNo || noOfItems;
            index += 1;
            let el = $('[data-number="' + dataNo + '"]').clone().data('number', index).addClass(this.duplicateClass);
            let target = $('[data-number="' + (index - 1) + '"]');
            target.after(el);
        }
        this.items = $(this.selectors.itemName, this.container);
    },

    pager() {
        const duplicates = this.items.filter('.duplicate');
        const totalPages = this.items.length - duplicates.length;
        const middleItem = this.centerFirstItem ? Math.ceil(this.items.length / 2) : 1;
        const currentNumber = $(this.items[middleItem - 1]).data('number');
        const currentPage = currentNumber % totalPages || totalPages;
        $(this.selectors.pager, this.el).html(currentPage + '/' + totalPages);
    },

    calculateItemWidth() {
        const firstChild = this.items.first();
        let itemWidth = 0;
        if (firstChild.length > 0) {
            itemWidth = firstChild.width();
            itemWidth += parseInt(firstChild.css('margin-left'), 10);
            itemWidth += parseInt(firstChild.css('margin-right'), 10);
        }

        return itemWidth;
    },

    handleEdgecases() {
        $(this.selectors.leftPager + ', ' + this.selectors.rightPager + ', ' + this.selectors.pager, this.el).hide();
        0 === this.items.length && $('.placeholder', this.el).show();
    },

    positionElements(reorder) {
        const itemCount = this.items.length;
        const middleItem = Math.ceil(this.items.length / 2);
        const centerPos = this.centerFirstItem ? (this.container.get(0).clientWidth - this.itemWidth) / 2 : 0;

        if (reorder) {
            this.items.each((index, item) => {
                if (index <= itemCount / 2) {
                    this.container.append(item);
                }
            });
        }

        this.items = $(this.selectors.itemName, this.container);
        this.positions = [];

        this.items.each((index, item) => {
            let indexDiff = ((index + 1) - middleItem);
            let leftPos = centerPos + (indexDiff * this.itemWidth);
            this.positions.push(leftPos);
            $(item).css('left', leftPos);
        });
        //position pager to left bottom corner
        $(this.selectors.pager, this.el).css('left', centerPos + parseInt(this.items.first().css('margin-left'), 10));

        this.pager();
        this.load();
    },

    load() {
        const itemCount = this.items.length;
        const middleItem = Math.ceil(itemCount / 2);
        const centerPos = (this.container.get(0).clientWidth - this.itemWidth) / 2;
        this.items.each((index, item) => {
            let indexDiff = ((index + 1) - middleItem);
            let leftPos = centerPos + (indexDiff * this.itemWidth);

            if (leftPos + this.itemWidth + (this.numberOfItemsToPreload * this.itemWidth) > 0 && leftPos - (this.numberOfItemsToPreload * this.itemWidth) < this.container.width()) {
                let image = $('[data-src]', item);
                if (image.length > 0) {
                    image[0].src = image.data('src');
                    image.attr('data-src', null);
                }
            }
        });
    },

    moveLeft() {
        this.items.last().insertBefore(this.items.first());
        this.items = $(this.selectors.itemName, this.container);
        this.pager();
    },

    moveRight() {
        this.items.first().insertAfter(this.items.last());
        this.items = $(this.selectors.itemName, this.container);
        this.pager();
    },

    moveItems(direction) {
        let left;
        let itemWidth = this.itemWidth;
        this.items.each((index, item) => {
            if (!left) {
                left = parseInt($(item).css('left'));
            }
            $(item).css('left', left + index * itemWidth + direction);
        });
    },

    resetTouch() {
        this.touchStart = {};
        this.touchPrev = {};
    },
    isSwiping() {
        return (Object.keys(this.touchStart).length > 0);
    },
    getTouchCoords(e) {
        let touch = e.touches && e.touches[0];

        return {
            x: e.clientX || (touch && touch.clientX),
            y: e.clientY || (touch && touch.clientY)
        };
    },
    redraw() {
        this.init(false);
    }
});

try {
    document.registerElement('as24-gallery', {
        prototype: as24gallery
    });
} catch (e) {
    if (window && window.console) {
        window.console.warn('Failed to register CustomElement "as24-gallery".', e);
    }
}
