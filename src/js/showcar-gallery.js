var as24gallery = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    itemWidth: 0,
    isInitialized: false,
    itemName: 'as24-gallery-item',

    createdCallback () {
        this.el = $(this);
        //wait for first element to be loaded and position items afterwards
        //TODO: think about a solution if the load event won't occur
        // --> maybe only use the load event if there is a gallery item without width
        $('img[src]', this.el).first().on('load', () => {
            this.itemWidth = this.calculateItemWidth();
            this.positionElements();
        });
        if (this.isEdgecase()) {
            this.handleEdgecases();
            return;
        }

        //register event handlers
        $('.left', this.el).click(() => this.moveLeft(this.itemWidth));
        $('.right', this.el).click(() => this.moveRight(this.itemWidth));
        var ts;
        this.el.on('touchstart', (e) => {
            this.lazyLoadImages();
            ts = e.touches[0].clientX;
        });
        this.el.on('click', this.lazyLoadImages);

        this.el.on('touchend', (e) => {
            var te = e.changedTouches[0].clientX;
            if (ts - te > 0) {
                this.moveRight(this.itemWidth);
            } else {
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
        if (this.isInitialized) {
            return;
        }
        $('[data-src]', this.el).each(function (index, item) {
            item.src = $(item).data('src');
            $(item).attr('data-src', null);
        });
        this.isInitialized = true;
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

    positionElements() {
        const itemCount = this.el.children(this.itemName).length;
        const middleItem = Math.ceil(itemCount / 2);
        const centerPos = (this.el[0].clientWidth - this.itemWidth) / 2;

        this.el.children(this.itemName).each((index, item) => {
            if (index < itemCount / 2) {
                this.el.append(item);
            }
        });

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
