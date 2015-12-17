var as24gallery = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    itemWidth: 0,
    itemName: 'as24-gallery-item',
    duplicateClass: 'duplicate',
    positions: [],

    resizeOverlays: function () {
        var overlayWidth = 0;
        if (this.el.children(this.itemName).length > 1) {
            overlayWidth = this.el[0].clientWidth / 2 - this.itemWidth / 2;
            const firstChild = this.el.children(this.itemName).first();
            overlayWidth -= parseInt(firstChild.css('margin-left'));
        }
        $('.right, .left', this.el).css('width', overlayWidth);
    },

    init(reorder) {
        this.itemWidth = this.calculateItemWidth();

        this.fillItems();
        this.positionElements(reorder);

        $('.right, .left', this.el).toggleClass('pagination-small', this.itemWidth >= this.el.width());

        this.resizeOverlays();
    },

    fillItems () {
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

        if (this.isEdgecase()) {
            this.handleEdgecases();
            return;
        }

        this.init(true);

        $('.left', this.el).click(() => {
            var positions = this.positions;
            this.moveLeft();
            this.el.children(this.itemName).each(function (index) {
                $(this).css('left', positions[index]);
            });
        });
        $('.right', this.el).click(() => {
            var positions = this.positions;
            this.moveRight();

            this.el.children(this.itemName).each(function (index) {
                $(this).css('left', positions[index]);
            });
        });
        var ts = 0;
        var prev = 0;
        this.el.on('touchstart', (e) => {
            this.lazyLoadImages();
            $('as24-gallery-item', this.el).addClass('no-transition');
            if ($(e.target).hasClass('right') || $(e.target).hasClass('left')) {
                ts = null;
            } else {
                ts = e.touches[0].clientX;
                prev = ts;
            }
        });
        this.el.on('click', this.lazyLoadImages);

        this.el.on('touchmove', (e) => {
            var touchDiffX = e.changedTouches[0].clientX - prev;
            prev = e.changedTouches[0].clientX;
            this.moveItems(touchDiffX);
        });

        this.el.on('touchend', (e) => {
            $('as24-gallery-item', this.el).removeClass('no-transition');
            if (ts === null) {
                return;
            }
            // reorder
            var touchDiffX = ts - e.changedTouches[0].clientX;
            var absTouchDiffX = Math.abs(touchDiffX);
            var howMany = Math.ceil(absTouchDiffX / this.itemWidth);

            for (var i = 0; i < howMany; i++) {
                if (touchDiffX > 0) {
                    this.moveRight();
                } else if (touchDiffX < 0) {
                    this.moveLeft();
                }
            }
            var positions = this.positions;
            this.el.children(this.itemName).each(function (index) {
                $(this).css('left', positions[index]);
            });
        });
        this.pager();
    },

    pager() {
        var totalNumber = this.el.children(this.itemName).length;
        // how to get the current Element?
        var currentElement = $(this.el.children(this.itemName)[2]).data('number');
        $('.pager', this.el).html(currentElement + '/' + totalNumber);
    },

    calculateItemWidth() {
        const firstChild = this.el.children(this.itemName).first();
        var itemWidth = firstChild.width();
        itemWidth += parseInt(firstChild.css('margin-left'));
        itemWidth += parseInt(firstChild.css('margin-right'));

        return itemWidth;
    },

    lazyLoadImages() {
        $('[data-src]', this.el).each(function (index, item) {
            item.src = $(item).data('src');
            $(item).attr('data-src', null);
        });
    },

    isEdgecase() {
        return this.el.children(this.itemName).length < 1;
    },

    handleEdgecases() {
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

    positionElements(reorder) {
        const itemCount = this.el.children(this.itemName).length;
        const middleItem = Math.ceil(itemCount / 2);
        const centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;

        if (reorder) {
            this.el.children(this.itemName).each((index, item) => {
                if (index <= itemCount / 2) {
                    this.el.append(item);
                }
            });
        }

        this.positions = [];

        this.el.children(this.itemName).each((index, item) => {
            var indexDiff = ((index + 1) - middleItem);
            var leftPos = centerPos + (indexDiff * this.itemWidth);

            if (leftPos + this.itemWidth > 0 && leftPos < this.el.width()) {
                var image = $('[data-src]', item);
                if (image.length > 0) {
                    image[0].src = image.data('src');
                    image.attr('data-src', null);
                }
            }

            this.positions.push(leftPos);

            $(item).css('left', leftPos);
        });
    },

    moveLeft() {
        var items = this.el.children(this.itemName);
        items.last().insertBefore(items.first());
        this.pager();
    },

    moveRight() {
        var items = this.el.children(this.itemName);
        items.first().insertAfter(items.last());
        this.pager();
    },

    moveItems(direction) {
        var left;
        var itemWidth = this.itemWidth;
        this.el.children(this.itemName).each( function (index) {
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
