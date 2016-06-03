/**
 *
 * @param {string} className
 * @param {HTMLElement} domEl
 * @returns {HTMLElement}
 */
function addClass(className, domEl) {
    let classList = [], classesString = domEl.getAttribute('class');
    if (classesString) {
        classList = classesString.split(' ');
        if (classList.indexOf(className) === -1) {
            classesString = classList.concat(className).join(' ');
        }
    } else {
        classesString = className
    }
    domEl.setAttribute('class', classesString);
    return domEl;
}

/**
 *
 * @param {string} className
 * @param {HTMLElement} domEl
 * @returns {HTMLElement}
 */
function removeClass(className, domEl) {
    let classList = [], classesString = domEl.getAttribute('class');
    if (classesString) {
        classList = classesString.split(' ');
        if(classList.indexOf(className) !== -1){
            classList.splice(classList.indexOf(className), 1);
        }
        domEl.setAttribute('class', classList.join(' '));
    }
    return domEl;
}

/**
 *
 * @param {string} className
 * @param {HTMLElement} domEl
 * @returns {boolean}
 */
function containsClass(className, domEl) {
    let classList = [], classesString = domEl.getAttribute('class');
    if (classesString) {
        classList = classesString.split(' ');
    }
    return classList.indexOf(className) > -1;
}


class Carousel {

    constructor(element) {

        this.element = element;
        this.container = null;

        this.pagination = {
            left: null,
            right: null
        };

        this.index = 0;
        this.refWidth = 330;
        this.itemWidth = 330;
        this.touchStart = {};
        this.touchPrev  = {};

        this.speed = Carousel.Speed.SLOW;

        this.pager = document.createElement('a');
        addClass('as24-pagination', this.pager);
        addClass('hide', this.pager);
        this.pager.href = '#';

        this.element.addEventListener('touchstart', this.touchStartEventHandler.bind(this));
        this.element.addEventListener('touchmove',  this.touchMoveEventHandler.bind(this));
        this.element.addEventListener('touchend',   this.touchEndEventHandler.bind(this));
    }

    /**
     * Gets all carousel items
     */
    get items() {
        return this.element.querySelectorAll('as24-carousel-item');
    }

    /**
     * Initializes the carousel by adding all necessary bits and bolts
     */
    init() {
        this.addContainer();
        this.resizeItems();
        this.addPagination();
        this.calculateEnvironment();
        this.loadImages();
    }

    /**
     * Redraw the whole carousel (can be triggered from outside)
     */
    redraw() {
        this.index = 0;
        this.resizeItems();
        this.calculateEnvironment();
        this.setPaginationButtonsVisibility();
        this.loadImages();
        this.moveContainer(0);
    }

    /**
     * Resizes the carousel items
     */
    resizeItems(){
        this.orgWidth = this.items[0].getBoundingClientRect().width + 20;
        if(this.orgWidth === this.refWidth && this.element.offsetWidth < this.refWidth){
            this.itemWidth = this.element.offsetWidth - 20;
            [].forEach.call(this.items, element => element.style.width = `${this.itemWidth-20}px`);
        } else {
            this.itemWidth = this.items[0].getBoundingClientRect().width + 20;
        }
    }

    /**
     * Handles the touch start event
     * @param {TouchEvent|Event} event - the event object
     */
    touchStartEventHandler(event) {
        const target = event.target;
        this.resetTouch();
        if (!containsClass('as24-pagination', target)) {
            this.touchStart = this.getTouchCoords(event);
            this.touchPrev  = this.touchStart;
        }
    }

    /**
     * Handles the touch move event
     * @param {TouchEvent|Event} event - the event object
     */
    touchMoveEventHandler(event) {
        if (!this.isSwiping()) {
            return;
        }

        const touchCoords = this.getTouchCoords(event);
        const startDiffX  = Math.abs(touchCoords.x - this.touchStart.x);
        const startDiffY  = Math.abs(touchCoords.y - this.touchStart.y);

        if (startDiffX < startDiffY) {
            this.resetTouch();
        } else {
            event.preventDefault();
            this.touchPrev = touchCoords;
        }
    }

    /**
     * Handles the touch end event
     * @param {TouchEvent|Event} event - the event object
     */
    touchEndEventHandler(event) {
        if (!this.isSwiping()) {
            return;
        }

        const touchCoords = this.getTouchCoords(event.changedTouches[0]);
        let touchDiffX    = this.touchStart.x - touchCoords.x;
        let absTouchDiffX = Math.abs(touchDiffX);
        let howMany       = Math.ceil(absTouchDiffX / this.itemWidth);

        for (let i = 0; i < howMany; i++) {
            if (touchDiffX > 0) {
                this.paginate(Carousel.Direction.RIGHT);
            } else if (touchDiffX < 0) {
                this.paginate(Carousel.Direction.LEFT);
            }
        }
    }

    /**
     * Gets the touch coordinates by its touch event
     * @param {TouchEvent|Event} event - the event object
     * @returns {Coordinate} coordinate - object containing some x and y coordinates
     */
    getTouchCoords(event) {
        let touch = event.touches && event.touches[0];
        return new Carousel.Coordinate(
            event.clientX || (touch && touch.clientX),
            event.clientY || (touch && touch.clientY)
        );
    }

    /**
     * Resets the touch coordinates
     */
    resetTouch() {
        this.touchStart = {};
        this.touchPrev  = {};
    }

    /**
     * Checks if the carousel is in swiping mode
     * @returns {boolean}
     */
    isSwiping() {
        return (Object.keys(this.touchStart).length > 0);
    }

    /**
     * Gets all the necessary dimensions and values for calculating distances and the index
     */
    calculateEnvironment(){
        this.itemsLength    = this.container.children.length;
        this.itemsVisible   = Math.floor(this.element.offsetWidth / this.itemWidth);
        this.totalReach     = this.container.offsetWidth - this.element.offsetWidth;
        this.stepLength     = this.speed === Carousel.Speed.SLOW ? this.itemsLength - this.itemsVisible : Math.ceil(this.itemsLength / this.itemsVisible);
        this.stepWidth      = this.speed === Carousel.Speed.SLOW ? this.itemWidth : Math.floor(this.element.offsetWidth / this.itemWidth) * this.itemWidth;
    }

    /**
     * Get the new index for paginating depending on the direction
     * @param {Direction|String} direction - the pagination direction. 'right' or 'left'
     */
    getNewIndex(direction){
        if(direction === Carousel.Direction.LEFT && this.index > 0){
            this.index -= 1;
        } else if(direction === Carousel.Direction.RIGHT && this.index < this.stepLength) {
            this.index += 1;
        }
    }

    /**
     * Wraps all the carousel items in a wrapper plus a container
     */
    addContainer() {
        let wrapper = document.createElement('div');
        addClass('as24-carousel-wrapper', wrapper);

        this.container = document.createElement('div');

        addClass('as24-carousel-container', this.container);

        [].forEach.call(this.element.children, element => {
            let item = element.cloneNode(true);
            this.container.appendChild(item);
        });

        wrapper.appendChild(this.container);

        this.element.innerHTML = '';
        this.element.appendChild(wrapper);
    }

    /**
     * Adds the 'left' and 'right 'pagination buttons
     */
    addPagination() {
        for (let direction of [Carousel.Direction.LEFT, Carousel.Direction.RIGHT]){
            this.createPaginationButton(direction);
        }
        removeClass('hide', this.pagination.right);
    }

    /**
     * Creates the pagination buttons and event listeners
     * @param {Direction|String} direction - the pagination direction. 'right' or 'left'
     */
    createPaginationButton(direction) {
        let button = this.pagination[direction] = this.pager.cloneNode(true);
        button.setAttribute('data-direction',direction);

        button.addEventListener('mouseup', e => {
            e.stopPropagation();
            e.preventDefault();
            this.paginate(direction);
        });

        button.addEventListener('click', e => e.preventDefault());

        this.element.appendChild(button);
    }

    /**
     * The handler for the pagination event
     * @param {Direction|String} direction - the pagination direction. 'right' or 'left'
     */
    paginate(direction){
        this.getNewIndex(direction);
        let distance = this.calculateDistance();
        this.setPaginationButtonsVisibility();
        this.loadImages();
        this.moveContainer(distance);
    }

    /**
     * Calculates the moving distance
     */
    calculateDistance(){
        let distance =  this.index * this.stepWidth;
        distance = distance > this.totalReach ? this.totalReach : distance;
        return ~ distance + 1;
    }

    /**
     * Moves the container by the given distance
     * @param {Number} distance - the moving distance
     */
    moveContainer(distance){
        distance = distance | 0;
        this.container.style.transform = 'translate3d(' + distance + 'px, 0, 0)';
        this.container.style.webkitTransform = 'translate3d(' + distance + 'px, 0, 0)';
    }

    /**
     * Sets the visibility of the pagination buttons
     */
    setPaginationButtonsVisibility(){
        if(this.index === 0){
            addClass('hide', this.pagination.left);
        } else {
            removeClass('hide', this.pagination.left);
        }
        if(this.index === this.stepLength){
            addClass('hide', this.pagination.right);
        } else {
            removeClass('hide', this.pagination.right);
        }
    }

    /**
     * Only loads the images of the carousel items that are currently visible
     */
    loadImages(){
        let start = this.index;
        let itemsVisible = Math.ceil(this.element.offsetWidth / this.itemWidth);
        let end = this.speed === Carousel.Speed.SLOW ? this.index + itemsVisible : (this.index + 1) * itemsVisible;
        end = end > this.itemsLength ? this.itemsLength : end;
        for(let i = start; i < end; i++ ){
            let images = this.container.children[i].querySelectorAll('img');
            [].forEach.call(images, image => {
                let src = image.getAttribute('data-src');
                if(src !== null){
                    image.setAttribute('src',src);
                    image.removeAttribute('data-src');
                }
            });
        }
    }
}



/**
 * Direction Enum string values.
 * @enum {string}
 * @readonly
 */
Carousel.Direction = {
    LEFT: 'left',
    RIGHT: 'right'
};


/**
 * Speed Enum string values.
 * @enum {string}
 * @readonly
 */
Carousel.Speed = {
    SLOW: 'slow',
    FAST: 'fast'
};


/**
 * @typedef Coordinate
 * @type Object
 * @property {number} [x = 0] - The X Coordinate
 * @property {number} [y = 0] - The Y Coordinate
 */
Carousel.Coordinate = function(x = 0, y = 0){
    return {
        x: x,
        y: y
    }
};

/**
 * gets the current client height.
 * @returns {number}
 */
function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

/**
 * Handler for resizing
 */
function resizeHandler() {
    let currentWindowWidth = getWindowWidth();
    if(this.windowWidth !== currentWindowWidth){
        this.windowWidth = currentWindowWidth;
        this.carousel.redraw();
    }
}

/**
 * Gets called after the element is created
 */
function elementCreatedHandler() {
    this.carousel = new Carousel(this);
}

/**
 * Gets called when the element is attached to the dom
 */
function elementAttachedHandler() {
    this.carousel.init();
    this.windowWidth = getWindowWidth();
    window.addEventListener('resize', () =>{
        clearTimeout(resizeHandler);
        setTimeout(resizeHandler.bind(this),300);
    });
}

/**
 * Registering the carousel component
 */
try {
    document.registerElement('as24-carousel', {
        prototype: Object.assign(
            Object.create( HTMLElement.prototype, {
                createdCallback: { value: elementCreatedHandler },
                attachedCallback: { value: elementAttachedHandler }
            }), {
                redraw: function () {
                    this.carousel.redraw();
                }
            }
        )
    });
} catch (e) {
    if (window && window.console) {
        window.console.warn('Failed to register CustomElement "as24-carousel".', e);
    }
}
