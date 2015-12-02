/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	$(document).ready(function () {
	
	    function paginate(direction) {
	        $('.gallery-item').each(function () {
	            var left = parseInt($(this).css('left'));
	            $(this).css('left', left + direction);
	        });
	        if (direction > 0) {
	            //left clicked, move last item to the beginning
	            var last = $('.gallery-item').last();
	            last.hide();
	            $('.gallery-wrapper').prepend(last);
	            last.css('left', -300);
	            last.show();
	        } else if (direction < 0) {
	            //right clicked, move first item to the end
	            var first = $('.gallery-item').first();
	            first.hide();
	            $('.gallery-wrapper').append(first);
	            first.css('left', 500);
	            first.show();
	        }
	    }
	
	    $('#left').click(function () {
	        paginate(200);
	    });
	    $('#right').click(function () {
	        paginate(-200);
	    });
	    var ts;
	    document.addEventListener('touchstart', function (e) {
	        ts = e.touches[0].clientX;
	    });
	
	    document.addEventListener('touchend', function (e) {
	        var te = e.changedTouches[0].clientX;
	        if (ts - te > 0) {
	            paginate(-200);
	        } else {
	            paginate(200);
	        }
	    });
	});

/***/ }
/******/ ]);
//# sourceMappingURL=showcar-gallery.js.map