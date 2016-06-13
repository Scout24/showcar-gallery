/**
 * Adds class to the dom element
 * @param {string} className
 * @param {Element} domEl
 * @returns {Element}
 */
function addClass(className, domEl) {
    if (domEl.classList) {
        domEl.classList.add(className);
    } else {
        let classList = [],
            classesString = domEl.getAttribute('class');
        if (classesString) {
            classList = classesString.split(' ');
            if (classList.indexOf(className) === -1) {
                classesString = classList.concat(className).join(' ');
            }
        } else {
            classesString = className
        }
        domEl.setAttribute('class', classesString);
    }
    return domEl;
}

/**
 * Removed class from the element
 * @param {string} className
 * @param {Element} domEl
 * @returns {Element}
 */
function removeClass(className, domEl) {
    if (domEl.classList) {
        domEl.classList.remove(className);
    } else {
        let classList = [],
            classesString = domEl.getAttribute('class');
        if (classesString) {
            classList = classesString.split(' ');
            if(classList.indexOf(className) !== -1){
                classList.splice(classList.indexOf(className), 1);
            }
            domEl.setAttribute('class', classList.join(' '));
        }
    }
    return domEl;
}

/**
 *
 * @param {string} className
 * @param {Element} domEl
 * @returns {boolean}
 */
function containsClass(className, domEl) {
    if (domEl.classList) {
        return domEl.classList.contains(className);
    } else {
        let classList = [],
            classesString = domEl.getAttribute('class');
        if (classesString) {
            classList = classesString.split(' ');
        }
        return classList.indexOf(className) > -1;
    }
}

/**
 * Toggles class for the domElem
 * @param {string} className
 * @param {Element} domElem
 * @returns {Element}
 */
function toggleClass(className, domElem) {
    if (domElem.classList) {
        domElem.classList.toggle(className);
    } else {
        if (containsClass(className, domElem)) {
            removeClass(className, domElem);
        } else {
            addClass(className, domElem);
        }
    }
    return domElem;
}

/**
 * Hides the provided element
 * @param {Element} domElement
 * @returns {Element}
 */
function hide(domElement) {
    domElement.style.display = 'none';
    return domElement;
}

/**
 * Shows the provided element
 * @param {Element} domElement
 * @returns {Element}
 */
function show(domElement) {
    domElement.style.display = 'block';
    return domElement;
}

/**
 * Add event listener to the element
 * @param {function} eventHandlerFn
 * @param {string} eventName
 * @param {Element} domElement
 * @returns {Element}
 */
function on(eventHandlerFn, eventName, domElement) {
    if (domElement.addEventListener) {
        domElement.addEventListener(eventName, eventHandlerFn);
    } else {
        domElement.attachEvent('on' + eventName, eventHandlerFn);
    }
    return domElement;
}

/**
 * Sets the CSS key: value
 * @param {string} rule
 * @param {string|number} val
 * @param {Element} elem
 * @returns {Element} {*}
 */
function setCSS(rule, val, elem) {
    elem.style[rule] = val;
    return elem;
}

/**
 * Returns CSS value by the key
 * @param {string} rule
 * @param {Element} elem
 * @returns {string}
 */
function getCSS(rule, elem) {
    var cs = window.getComputedStyle(elem, null);
    return cs.getPropertyValue(rule);
}

/**
 * Returns the width of the element
 * @param {Element} el
 * @return {Number}
 */
function getWidth(el) {
    return el.getBoundingClientRect().width;
}

/**
 * Appends an element to the target
 * @param {Element} target
 * @param {Element} element
 */
function appendTo(target, element) {
    target.appendChild(element);
    return target;
}

module.exports = {
    on, setCSS, getCSS, addClass, hide, show, appendTo, removeClass, containsClass, toggleClass, getWidth
};