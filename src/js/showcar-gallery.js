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

    createdCallback () {
        var handler,
            timeout = 500;

        var preload = $(this).data('preload-items');
        if (preload) {
            this.numberOfItemsToPreload = $(this).data('preload-items');
        }

        $(window).on('resize', () => {
            if(handler) {
                clearTimeout(handler);
            }
            handler = setTimeout(() => {
                this.init();
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

        $(this.selectors.leftPager, this.el).click(() => {
            var positions = this.positions;
            this.moveLeft();
            this.items.each(function (index) {
                $(this).css('left', positions[index]);
            });
            this.load();
        });
        $(this.selectors.rightPager, this.el).click(() => {
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
    },

    init(reorder) {
        this.itemWidth = this.calculateItemWidth();
        this.fillItems();
        this.positionElements(reorder);
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
        var duplicates = this.items.filter('.duplicate');
        var totalPages = this.items.length - duplicates.length;

        const middleItem = Math.ceil(this.items.length / 2);
        var currentNumber = $(this.items[middleItem - 1]).data('number');
        var currentPage = currentNumber % totalPages || totalPages;
        $(this.selectors.pager, this.el).html(currentPage + '/' + totalPages);
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
        $(this.selectors.leftPager + ', ' + this.selectors.rightPager + ', ' + this.selectors.pager, this.el).hide();
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
            this.items = this.el.children(this.selectors.itemName);
        }

        this.positions = [];

        this.items.each((index, item) => {
            var indexDiff = ((index + 1) - middleItem);
            var leftPos = centerPos + (indexDiff * this.itemWidth);

            this.positions.push(leftPos);

            $(item).css('left', leftPos);
        });
        //position pager to left bottom corner
        $(this.selectors.pager, this.el).css('left', centerPos + parseInt(this.items.first().css('margin-left')));

        this.pager();
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
        this.items = this.el.children(this.selectors.itemName);
        this.pager();
    },

    moveRight() {
        this.items.first().insertAfter(this.items.last());
        this.items = this.el.children(this.selectors.itemName);
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
