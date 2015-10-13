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
    });
