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


function toggleClass(className, elem) {
    if (containsClass(className, elem)) {
        removeClass(className, elem);
    } else {
        addClass(className, elem);
    }
}

/**
 * Hides provided element
 * @param {Element} el
 */
function hide(el) {
    el.style.display = 'none';
    return el;
}

/**
 * Shows provided element
 * @param {Element} el
 */
function show(el) {
    el.style.display = 'block';
    return el;
}

function on(cb, evtName, elem) {
    if (elem.addEventListener) {
        return elem.addEventListener(evtName, cb);
    } else {
        return elem.attachEvent('on' + evtName, cb);
    }
}

/**
 *
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
 *
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
 * @param {Element} target
 * @param {Element} el
 */
function appendTo(target, el) {
    target.appendChild(el);
    return target;
}

/**
 *
 * @param {NodeList} elList
 * @return {Element}
 */
function last(elList) {
    return elList[elList.length - 1];
}

module.exports = {
    on: on,
    setCSS: setCSS,
    getCSS: getCSS,
    addClass: addClass,
    hide: hide,
    show: show,
    appendTo: appendTo,
    removeClass: removeClass,
    containsClass: containsClass,
    toggleClass: toggleClass,
    getWidth: getWidth
};