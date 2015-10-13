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
 }]);
