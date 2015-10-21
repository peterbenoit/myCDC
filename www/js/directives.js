/**
 *
 */
angular.module('mycdc.directives', [])

.directive('orientation', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function(e) {
                if (this.naturalHeight > this.naturalWidth) {
                    this.className = 'portrait';
                }
            });
        }
    };
})
.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });

            attrs.$observe('ngSrc', function(value) {
                if (!value && attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    };
})
.directive('quarterwidth', function($window) {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function(e) {
                var w = angular.element($window),
                    newwidth = (w.innerWidth - 20) / 4,        // half the screen - padding
                    newheight = (newwidth / 16) * 9,          // maintian 16x9 aspect ratio
                    parent = this.parentElement;

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
            });
        }
    };
 })
.directive('halfwidth', function($window) {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function(e) {
                var w = $(window),
                    newwidth = (w.width() - 20) / 2,        // half the screen - padding
                    newheight = (newwidth / 16) * 9,          // maintian 16x9 aspect ratio
                    parent = this.parentElement;

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
            });
        }
    };
 })
// full width at the correct aspect ratio
 .directive('fullwidth', function($window) {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function(e) {
                var w = $(window),
                    newwidth = w.width() - 10,             // screen - padding
                    newheight = (newwidth / 16) * 9,          // maintian 16x9 aspect ratio
                    parent = this.parentElement;

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
            });
        }
    };
 })
.directive('resize', function($window) {
    return function(scope, element) {
        var w = $(window);

        scope.getWindowDimensions = function() {
            return { 'h': w.height(), 'w': w.width() };
        };

        scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.halfwidth = function() {
                var newwidth = (newValue.w - 20) / 2,        // half the screen - padding
                    newheight = (newwidth / 16) * 9;

                return {
                    'height': newheight + 'px',
                    'width': newwidth + 'px'
                };
            };

            scope.fullwidth = function() {
                var newwidth = newValue.w - 10,             // screen - padding
                    newheight = (newwidth / 16) * 9;

                return {
                    'height': newheight + 'px',
                    'width': newwidth + 'px'
                };
            };
        }, true);

        w.bind('resize', function() {
            scope.$apply();
        });
    };
});
