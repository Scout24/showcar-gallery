var as24gallery = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    itemWidth: 0,
    isInitialized: false,

    createdCallback () {
        this.el = $(this);
        const firstChild = this.el.children().first();
        this.itemWidth = firstChild.width();
        this.itemWidth += parseInt(firstChild.css('margin-left'));
        this.itemWidth += parseInt(firstChild.css('margin-right'));

        //position elements
        const itemCount = this.el.children().length;
        const middleItem = Math.ceil(itemCount / 2);
        this.el.children().each((index, item) => {
            //TODO: the center xpos needs to pe calculated in a proper way
            //total width of container - half width of item
            var xPos = (this.itemWidth / 2); // 100
            var indexDiff = ((index + 1) - middleItem);
            xPos += (indexDiff * this.itemWidth);
            $(item).css('left', xPos);
        });

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
        $('[data-src]', this.el).each(function (item) {
            item.src = item.data('src');
        });
        this.isInitialized = true;
    },

    moveLeft(direction) {
        this.moveItems(direction);
        var last = this.el.children().last();
        last.hide();
        this.el.prepend(last);
        var widthLeft = this.itemWidth + this.itemWidth / 2;
        last.css('left', -widthLeft);
        last.show();
    },

    moveRight(direction) {
        this.moveItems(-direction);
        var first = this.el.children().first();
        first.hide();
        this.el.append(first);
        var widthRight = this.itemWidth + this.itemWidth + this.itemWidth / 2;
        first.css('left', widthRight);
        first.show();
    },

    moveItems(direction) {
        this.el.children().each(function() {
            var left = parseInt($(this).css('left'));
            $(this).css('left', left + direction);
        });
    }
});


document.registerElement('as24-gallery', {
    prototype: as24gallery
});
