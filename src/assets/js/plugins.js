// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function($) {
    $.fn._trigger = $.fn.trigger;
    $.fn.trigger = function(eventName) {
        this.each(function() {
            var el = $(this).get(0);
            triggerNativeEvent(el, eventName);
        });
        return $.fn._trigger.apply(this, arguments);
    };

    function triggerNativeEvent(el, eventName) {
        var evt = document.createEvent('Events');
        evt.initEvent(eventName, true, false);
        el.dispatchEvent(evt);
    }
}(jQuery));

(function ($) {
    $.url = function (name) {
        var reg = new RegExp('(^\\w*\\?|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);
