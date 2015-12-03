var as24gallery = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    itemWidth: 0,
    isInitialized: false,
    itemName: 'as24-gallery-item',

    createdCallback () {
        this.el = $(this);
        const firstChild = this.el.children(this.itemName).first();
        this.itemWidth = firstChild.width();
        this.itemWidth += parseInt(firstChild.css('margin-left'));
        this.itemWidth += parseInt(firstChild.css('margin-right'));

        //position elements
        this.positionElements();

        //register event handlers
        $('#left').click(() => this.moveLeft(this.itemWidth));
        $('#right').click(() => this.moveRight(this.itemWidth));
        var ts;
        this.el.on('touchstart', (e) => {
            this.init();
            ts = e.touches[0].clientX;
        });
        this.el.on('click', this.init);

        this.el.on('touchend', (e) => {
            var te = e.changedTouches[0].clientX;
            if (ts - te > 0) {
                this.moveRight(this.itemWidth);
            } else {
                this.moveLeft(this.itemWidth);
            }
        });
    },

    init() {
        if (this.isInitialized) {
            return;
        }
        $('[data-src]', this.el).each(function (index, item) {
            item.src = $(item).data('src');
        });
        this.isInitialized = true;
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
            $(item).css('left', centerPos + (indexDiff * this.itemWidth));
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
    },

    moveRight(direction) {
        var lastElement = this.el.children(this.itemName).last();
        var lastLeft = lastElement.position()['left'];
        this.moveItems(-direction);
        var first = this.el.children(this.itemName).first();
        first.hide();
        first.insertChildAfter(lastElement);
        first.css('left', lastLeft).show();
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
