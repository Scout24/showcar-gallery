var as24gallery = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    itemWidth: 0,
    itemName: 'as24-gallery-item',
    items: null,
    duplicateClass: 'duplicate',
    positions: [],
    touchStart: {},
    touchPrev: {},
    numberOfItemsToPreload: 2,

    createdCallback () {
        var handler,
            timeout = 500;

        $(window).on('resize', () => {
            if(handler) {
                clearTimeout(handler);
            }
            handler = setTimeout(() => {
                this.init();
            }, timeout);
        });

        this.el = $(this);
        this.items = this.el.children(this.itemName);

        if (this.items.length < 2) {
            this.handleEdgecases();
        }

        this.init(true);

        $('.left', this.el).click(() => {
            var positions = this.positions;
            this.moveLeft();
            this.items.each(function (index) {
                $(this).css('left', positions[index]);
            });
            this.load();
        });
        $('.right', this.el).click(() => {
            var positions = this.positions;
            this.moveRight();

            this.items.each(function (index) {
                $(this).css('left', positions[index]);
            });
            this.load();
        });
        this.el.on('touchstart', (e) => {
            $('as24-gallery-item', this.el).addClass('no-transition');
            this.resetTouch();
            if (!$(e.target).hasClass('right') && !$(e.target).hasClass('left')) {
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
                $('as24-gallery-item', this.el).removeClass('no-transition');
                var positions = this.positions;
                this.items.each(function (index) {
                    $(this).css('left', positions[index]);
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
            $('as24-gallery-item', this.el).removeClass('no-transition');
            if (!this.isSwiping()) {
                return;
            }
            const touchCoords = this.getTouchCoords(e.changedTouches[0]);
            var touchDiffX = this.touchStart.x - touchCoords.x;
            var absTouchDiffX = Math.abs(touchDiffX);
            var howMany = Math.ceil(absTouchDiffX / this.itemWidth);

            var direction;
            for (var i = 0; i < howMany; i++) {
                if (touchDiffX > 0) {
                    this.moveRight();
                    this.load()
                } else if (touchDiffX < 0) {
                    this.moveLeft();
                    this.load();
                }
            }
            var positions = this.positions;
            this.items.each(function (index) {
                $(this).css('left', positions[index]);
            });
        });
        this.pager();
    },

    init(reorder) {
        this.itemWidth = this.calculateItemWidth();
        this.fillItems();
        this.positionElements(reorder);
        this.resizeOverlays();
    },

    resizeOverlays: function () {
        var overlays = $('.right, .left', this.el);
        var overlayMinWidth = parseInt(overlays.css('min-width'));
        overlayMinWidth += parseInt(this.items.first().css('margin-left'));
        overlays.toggleClass('pagination-small', (this.itemWidth + 2 * overlayMinWidth) >= this.el.width());
        var overlayWidth = 0;
        if (this.items.length > 1) {
            overlayWidth = this.el[0].clientWidth / 2 - this.itemWidth / 2;
            const firstChild = this.items.first();
            overlayWidth -= parseInt(firstChild.css('margin-left'));
        }
        overlays.css('width', overlayWidth);
    },

    fillItems () {
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

    pager() {
        var items = this.items;
        var duplicates = items.filter('.duplicate');
        var totalPages = items.length - duplicates.length;

        const middleItem = Math.ceil(items.length / 2);
        var currentNumber = $(items[middleItem - 1]).data('number');
        var currentPage = currentNumber % totalPages || totalPages;
        $('.pager', this.el).html(currentPage + '/' + totalPages);
    },

    calculateItemWidth() {
        const firstChild = this.items.first();
        var itemWidth = 0;
        if (firstChild.length > 0) {
            itemWidth = firstChild.width();
            itemWidth += parseInt(firstChild.css('margin-left'));
            itemWidth += parseInt(firstChild.css('margin-right'));
        }

        return itemWidth;
    },

    handleEdgecases() {
        $('.left, .right, .pager', this.el).hide();
        if (this.items.length === 0) {
            $('.placeholder', this.el).show();
        }
    },

    positionElements(reorder) {
        const itemCount = this.items.length;
        const middleItem = Math.ceil(itemCount / 2);
        const centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;

        if (reorder) {
            this.items.each((index, item) => {
                if (index <= itemCount / 2) {
                    this.el.append(item);
                }
            });
            this.items = this.el.children(this.itemName);
        }

        this.positions = [];

        this.items.each((index, item) => {
            var indexDiff = ((index + 1) - middleItem);
            var leftPos = centerPos + (indexDiff * this.itemWidth);

            this.positions.push(leftPos);

            $(item).css('left', leftPos);
        });


        this.load();
    },

    load() {
        const itemCount = this.items.length;
        const middleItem = Math.ceil(itemCount / 2);
        const centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;
        this.items.each((index, item) => {
            var indexDiff = ((index + 1) - middleItem);
            var leftPos = centerPos + (indexDiff * this.itemWidth);

            if (leftPos + this.itemWidth + (this.numberOfItemsToPreload * this.itemWidth) > 0 && leftPos - (this.numberOfItemsToPreload * this.itemWidth) < this.el.width()) {
                var image = $('[data-src]', item);
                if (image.length > 0) {
                    image[0].src = image.data('src');
                    image.attr('data-src', null);
                }
            }
        });
    },

    moveLeft() {
        this.items.last().insertBefore(this.items.first());
        this.items = this.el.children(this.itemName);
        this.pager();
    },

    moveRight() {
        this.items.first().insertAfter(this.items.last());
        this.items = this.el.children(this.itemName);
        this.pager();
    },

    moveItems(direction) {
        var left;
        var itemWidth = this.itemWidth;
        this.items.each( function (index) {
            if (!left) {
                left = parseInt($(this).css('left'));
            }
            $(this).css('left', left + index * itemWidth + direction);
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
        var touch = e.touches && e.touches[0];

        return {
            x: e.clientX || (touch && touch.clientX),
            y: e.clientY || (touch && touch.clientY)
        };
    }
});

document.registerElement('as24-gallery', {
    prototype: as24gallery
});
