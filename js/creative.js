/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
    "use strict"; // Start of use strict

    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("mainNav").style.top = "0";
    } else if (currentScrollPos > 0) {
        document.getElementById("mainNav").style.top = "-50px";
    }
    prevScrollpos = currentScrollPos;
    }

    // Initialize WOW.js Scrolling Animations
    // new WOW().init();

})(jQuery); // End of use strict
