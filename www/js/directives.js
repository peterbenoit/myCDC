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
    }
})
.directive('quarterwidth', ['ScreenSize', function(ScreenSize){
    return {
        link: function (scope, element, attrs) {
            element.bind('load', function(e) {
                var newwidth = (ScreenSize.width - 20) / 4, // half the screen - padding
                    newheight = (newwidth/16) * 9;          // maintian 16x9 aspect ratio
                    parent = this.parentElement

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
            });
        }
    }
 }])
.directive('halfwidth', ['ScreenSize', function(ScreenSize){
    return {
        link: function (scope, element, attrs) {
            element.bind('load', function(e) {
                var newwidth = (ScreenSize.width - 20) / 2, // half the screen - padding
                    newheight = (newwidth/16) * 9;          // maintian 16x9 aspect ratio
                    parent = this.parentElement

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
            });
        }
    }
 }])
 .directive('fullwidth', ['ScreenSize', function(ScreenSize){
    return {
        link: function (scope, element, attrs) {
            element.bind('load', function(e) {
                var newwidth = ScreenSize.width - 10,       // screen - padding
                    newheight = (newwidth/16) * 9;          // maintian 16x9 aspect ratio
                    parent = this.parentElement

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
            });
        }
    }
 }])
 .directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);

console.log(w);

        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };

        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})
.directive('resize2', function ($window) {
    return function (scope, element) {
        var w = $window;

console.log(w);

        scope.$watch(function () {
            return { 'h': w.innerHeight, 'w': w.innerWidth };
        }, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

//moar jquery
        // w.bind('resize', function () {
        //     scope.$apply();
        // });
    }
});
