/**
 *
 */
angular.module('mycdc.directives', [])

.directive('orientation', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('load' , function(e) {
                if (this.naturalHeight > this.naturalWidth) {
                    this.className = 'portrait';
                }
            });
        }
    };
});

