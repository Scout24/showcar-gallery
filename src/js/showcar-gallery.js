var as24gallery = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    itemWidth: 0,
    itemName: 'as24-gallery-item',
    duplicateClass: 'duplicate',

    init(reorder) {
        this.itemWidth = this.calculateItemWidth();

        this.fillItems();
        this.positionElements(reorder);


        $('.right, .left', this.el).toggleClass('overlay', this.itemWidth < this.el.width());

        var overlayWidth = this.el[0].clientWidth / 2 - this.itemWidth / 2;
        const firstChild = this.el.children(this.itemName).first();
        overlayWidth -= parseInt(firstChild.css('margin-left'));
        $('.right, .left', this.el).css('width', overlayWidth);
    },

    fillItems () {
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

        this.init(true);

        if (this.isEdgecase()) {
            this.handleEdgecases();
            return;
        }

        //register event handlers
        $('.left', this.el).click(() => this.moveLeft(this.itemWidth));
        $('.right', this.el).click(() => this.moveRight(this.itemWidth));
        var ts = 0;
        this.el.on('touchstart', (e) => {
            this.lazyLoadImages();
            if ($(e.target).hasClass('right') || $(e.target).hasClass('left')) {
                ts = null;
            } else {
                ts = e.touches[0].clientX;
            }
        });
        this.el.on('click', this.lazyLoadImages);

        this.el.on('touchend', (e) => {
            if (ts === null) {
                return;
            }
            var touchDiffX = ts - e.changedTouches[0].clientX;
            if (touchDiffX > 0) {
                this.moveRight(this.itemWidth);
            } else if (touchDiffX < 0) {
                this.moveLeft(this.itemWidth);
            }
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
        return this.el.children(this.itemName).length < 3;
    },

    handleEdgecases() {
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
                this.el.children(this.itemName).each((index, item)  => {
                    $(item).css('left', index * this.itemWidth);
                });
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

            $(item).css('left', leftPos);
        });
    },

    moveLeft(direction) {
        var firstElement = this.el.children(this.itemName).first();
        var firstLeft = firstElement.position()['left'];
        this.moveItems(direction);
        var last = this.el.children(this.itemName).last();
        last.hide()
            .insertBefore(firstElement)
            .css('left', firstLeft)
            .show();
        this.pager();
    },

    moveRight(direction) {
        var lastElement = this.el.children(this.itemName).last();
        var lastLeft = lastElement.position()['left'];
        this.moveItems(-direction);
        var first = this.el.children(this.itemName).first();
        first.hide();
        first.insertAfter(lastElement);
        first.css('left', lastLeft).show();
        this.pager();
    },

    moveItems(direction) {
        this.el.children(this.itemName).each(function() {
            var left = parseInt($(this).css('left'));
            $(this).css('left', left + direction);
        });
    }
});


document.registerElement('as24-gallery', {
    prototype: as24gallery
});
