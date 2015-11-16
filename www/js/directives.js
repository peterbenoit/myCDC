/**
 *
 */
angular.module('mycdc.directives', [])

// THESE CAN BE MOVED TO DIRECTIVES FILE
.directive('uiContainer', function($rootScope, $timeout) {
   return {
        restrict: 'E',
        controller: function($scope, $element){
            if ($scope.containerLoading === undefined) {
                $scope.containerLoading = true;
            }

            $scope.getContainerTemplate = function (blnLoader) {

                var uiContainerTemplateUrl;

                if (!blnLoader && $rootScope.screenState && $rootScope.sourceMeta) {
                    if ($rootScope.screenState.viewType == 'phone') {
                        uiContainerTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.containerSet + '-phone.html';
                    } else {
                        uiContainerTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.containerSet + '-tablet-' + $rootScope.screenState.viewOrientation + '.html';
                    }
                } else {
                    uiContainerTemplateUrl = 'templates/ui-loader.html';
                }

                $rootScope.log(uiContainerTemplateUrl, 1, 'UI-CONTAINER-TEMPLATE');

                $scope.containerLoading = false;

                return uiContainerTemplateUrl;
            };

            // SET LISTENER ONCE
            if (!$scope.uiContainerInit) {
                $scope.uiContainerInit = true;
                $scope.$on('screen-state-update-started', function(event, args) {
                    $rootScope.log('UI CONTAINER DIRECTIVE RECEIVED screen-state-update-started', 2, 'EVENT-LISTENER:');
                    $scope.containerLoading = true;
                });
                $scope.$on('screen-state-update-complete', function(event, args) {
                    $rootScope.log('UI CONTAINER DIRECTIVE RECEIVED screen-state-update-complete', 2, 'EVENT-LISTENER:');
                    $timeout($scope.getContainerTemplate, 0);
                });
            }
        },
        scope : '*',
        template: '<div ng-include="getContainerTemplate()"></div>'
   }
})
.directive('uiStream', function($rootScope, $state, $timeout, $ionicPosition, $stateParams) {
   var vsd, hsd;

   return {
        restrict: 'E',
        controller: ['$scope', '$element', function($scope, $element){

            // CREATE MAIN TEMPALTE HANDLER (COULD USE IONIC FOR TABLE DETECTION, BUT THIS SEEMS MORE UNIVERSAL WITH LESS isThis, isThat CALLS)
            $scope.getStreamTemplate = function () {

                var uiStreamTemplateUrl;

                if ($rootScope.screenState && $rootScope.sourceMeta) {
                    if ($rootScope.screenState.viewType == 'tablet') {
                        uiStreamTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.stream + '-' + $rootScope.screenState.viewOrientation + '.html';
                    } else {
                        uiStreamTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.stream + '-universal.html';
                    }
                } else {
                    uiStreamTemplateUrl = 'templates/ui-loader.html';
                }

                //$rootScope.log($('.vertical-scroller').length, -100, 'VERTICAL SCROLLER');
                //$rootScope.log($('.horizontal-scroller').length, -100, 'HORIZONTAL SCROLLER');

                // SCROLLER HEIGHT / WIDTH FIX - IMPORTANT
                var jqVs = $('.vertical-scroller');
                if (jqVs.length) {
                    var intMenuHeight = 44;
                    var jqH3 = $('h3.scroll-header');
                    if (jqVs) {
                        var newHeight = $rootScope.screenState.height - intMenuHeight;
                        if (jqH3.length) {
                            newHeight = newHeight - jqH3.outerHeight();
                        }
                        jqVs.height(newHeight);
                    }
                }

                var jqHs = $('.horizontal-scroller');
                if (jqHs.length) {
                    var newWidth = $rootScope.screenState.width;
                    jqHs.width(newWidth);
                }

                /*
                $rootScope.log($rootScope.screenState.height, -100, 'SCREEN HEIGHT');
                $rootScope.log($('> h3', jsLv).outerHeight(), -100, 'H3 HEIGHT');
                $rootScope.log(newHeight, -100, 'FINAL HEIGHT');
                */
                // END SCROLLER HEIGHT / WIDTH FIX

                $rootScope.log($rootScope.screenState.height, -1, 'SCREEN HEIGHT');

                return uiStreamTemplateUrl;
            };

            // SET LISTENER ONCE
            if (!$scope.uiStreamInit) {
                $scope.uiStreamInit = true;
                $scope.$on('screen-state-update-complete', function(event, args) {
                    $rootScope.log('UI STREAM DIRECTIVE RECEIVED screen-state-update-complete', 2, 'EVENT-LISTENER:');
                    $scope.getStreamTemplate();
                });
                $scope.$on('source-name-changed', function(event, args) {
                    $rootScope.log('SOURCE NAME CHANGED', 2, 'EVENT-LISTENER:');
                    $state.go('app.sourceDetail', {sourceName: $rootScope.sourceName, sourceDetail: $rootScope.sourceDetail });
                });
            }
        }],
        template: '<div ng-include="getStreamTemplate()"></div>'
   }
})
.directive("uiCard", function($rootScope, $timeout, $state) {
    return {
        // ISOLATE SCOPE (RESTRIECT TO CARD DATA OBJECT AND TEMPLATE ATTR)
        scope: {
            cardData: '=',
            template: '@'
        },
        restrict: 'E',
        controller: function($scope) {

            $scope.setState = function (source, detail) {


                if (source && $rootScope.sourceName !== source) {
                    $rootScope.sourceName = source;
                    $rootScope.$broadcast('source-name-changed');

                } else if (detail && $rootScope.sourceDetail != detail) {
                    $rootScope.sourceDetail = detail;
                    $rootScope.$broadcast('source-detail-changed');

                }
            };

            $scope.getCardTemplate = function (blnLoader) {

                blnLoader = blnLoader || false;

                // DEFAULT TO LOADER (IF STATE SCREEN STATE NOT READY, ETC.)
                var uiCardTemplateUrl = 'templates/ui-loader.html';

                if (blnLoader) {
                    return uiCardTemplateUrl;
                }

                if (!tplInit) {
                    var tplInit = true;

                    // SCREEN STATE READY?
                    if ($rootScope.screenState) {
                        // TEMPLATE LOGIC
                        if ($scope.template) {
                            // TEMPLATE OVERRIDE PROVIDED - USE IT
                            uiCardTemplateUrl = 'templates/' + $scope.template+ '.html';
                        } else if ($rootScope.sourceName == 'homestream' &&  $scope.cardData.templates.hasOwnProperty('homeCard')) {
                            // USE DEFAULT TEMPLATE FOR CARD
                            uiCardTemplateUrl = 'templates/' + $scope.cardData.templates.homeCard + '.html';
                        } else if ($scope.cardData.templates && $scope.cardData.templates.hasOwnProperty('card')) {
                            // USE DEFAULT TEMPLATE FOR CARD
                            uiCardTemplateUrl = 'templates/' + $scope.cardData.templates.card + '.html';
                        }
                    }

                    if ($scope.cardData.id == '152266') {
                        // console.log($scope.cardData);
                        $rootScope.log($scope.cardData, -1000, 'UI-CARD-DATA');
                        $rootScope.log(uiCardTemplateUrl, -1000, 'UI-CARD-TEMPLATE');
                    }

                }

                // RETURN TEMPLATE
                return uiCardTemplateUrl;
            };
        },
        link: function(scope, element, attrs) {
            scope.template = attrs.template;
        },
        template: '<div id="card-{{cardData.id}}" class="card-container-pad" ng-include src="getCardTemplate()"></div>',
    };
})
.directive('uiDetail', function($rootScope, $timeout, $sce, $filter, $state, $stateParams, $ionicPopup) {

    // HANDLE DIFFERENT TYPES OF CONTENT DETAIL PROCESSING
    var detailProcessors = {
        video : function ($scope) {

            // VIDEOS - NO ADDITIONAL SERVICE CALLS NEEDED
            // SIMPLY SET DETAIL DATA FROM CURRENT CARD
            $scope.detailData = $scope.detailCard;

            // PROVIDE A VIDEO URL HELPER FOR THE VIDEO PARTIAL
            $scope.getVideoUrl = function() {
                return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.detailData.sourceUrl.split('?v=')[1] + '?rel=0');
            };

        },
        iframe : function ($scope) {

            // IFRAME - NEED TO DETERMINE CHROME OR NO CHROME URL (CACHED TO LOCAL STORAGE FOR SPEED)

            // SIMPLY SET DETAIL DATA FROM CURRENT CARD
            $scope.detailData = $scope.detailCard;

            // GET NO CHROME URL
            return $rootScope.getSourceHtmlUrl().then(function(iframeUrl){

                // SET RESPONSE FOR USE BY HTML PARTIAL (AS IFRAME SRC)
                $scope.frameUrl = $sce.trustAsResourceUrl(iframeUrl);
            });
        },
        default : function ($scope) {

            // GET SOURCE DETAIL DATA
            return $rootScope.getSourceDetail().then(function(d){

                // NORMALIZE DATA BY SOURCE SPECS?
                $scope.detailData = d;

                // BROADCAST DATA IS READY
                $rootScope.$broadcast('source-detail-load-complete');
            });

        }
    };

    return {
        restrict: 'E',
        controller : function ($scope) {

            // SET LISTENER ONCE
            if (!$scope.uiDetailnit) {
                $scope.uiDetailnit = true;

                // LISTEN FOR SCREEN UPDATE
                $rootScope.$on('screen-state-update-complete', function () {
                    $scope.getDetailTemplate();
                });

                // LISTEN FOR DETAIL CHANGE
                $rootScope.$on('source-detail-changed', function () {
                    $scope.loadDetailData();
                });

                /* LISTEN FOR DETAIL LOAD START
                $rootScope.$on('source-detail-load-started', function(event, args) {
                    $rootScope.log('UI DETAIL DIRECTIVE RECEIVED source-detail-load-STARTED', 10, 'EVENT-LISTENER:');
                    $rootScope.log($scope.detailCard, 10, 'SCOPE DETAIL CARD');
                    $rootScope.log($scope.detailData, 10, 'SCOPE DETAIL DATA');
                });*/

                // LISTEN FOR DETAIL LOAD COMPLETE
                $rootScope.$on('source-detail-load-complete', function(event, args) {
                    $rootScope.log('UI DETAIL DIRECTIVE RECEIVED source-detail-load-COMPLETED', 10, 'EVENT-LISTENER:');
                    $rootScope.log($scope.detailCard, 10, 'SCOPE DETAIL CARD');
                    $rootScope.log($scope.detailData, 10, 'SCOPE DETAIL DATA');

                    $scope.getDetailTemplate();
                });
            }

            $scope.loadDetailData = function (callback) {

                $scope.detailCard = $rootScope.getSourceCard();

                $rootScope.$broadcast('content-card-ready');

                $rootScope.log($scope.detailCard, 10, 'CURRENT DETAIL CARD');

                // SET CARD TEMPLATE
                $scope.detailTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.detail + '.html';

                $rootScope.log($scope.detailTemplateUrl, 10, 'UI-DETAIL-TEMPLATE');

                // CONTINUE IF DETAIL CARD EXISTS IN SCOPE (AND NOT INITIALIZED ALREADY)
                if ($scope.detailCard) {

                    // FLAG INIT
                    $scope.initialized = false;

                    $rootScope.$broadcast('source-detail-load-started');

                    // CALL SPECIFIED PROCESSOR
                    if (detailProcessors.hasOwnProperty($rootScope.sourceMeta.detailType)) {
                        detailProcessors[$rootScope.sourceMeta.detailType].call(this, $scope);
                    } else {
                        detailProcessors.default.call(this, $scope);
                        $rootScope.log('UNABLE TO FIND CARD DETAIL PROCESSOR FOR DETAIL TYPE ' + $rootScope.sourceMeta.detailType, -999);
                    }

                    // DEBUG
                    $rootScope.log($scope.processer, 10, 'UI-DETAIL-DIRECTIVE-PROCESSER');
                    $rootScope.log($scope.detailTemplateUrl, 10, 'UI-DETAIL-DIRECTIVE-TEMPLATE');

                    if (callback) {
                        //callback.apply();
                    }

                } else {

                    // DETAIL ID DETECTION LOGIC
                    if (!$stateParams.sourceIndex) {

                        // IF NO SOURCE INDEX (DETAIL ID) IS PRESENT, VERIFY INTENT (SHOULD WE REQUIRE ONE)
                        if ($scope.screenState.viewType == 'tablet' && $scope.datas && $scope.datas.length) {
                            $state.go('app.sourceDetail', {sourceName: $scope.sourceName, sourceDetail: $scope.datas[0].id });
                        }

                    } else {

                        // NO DETAIL CARD FOUND IN CARD LIST: ALERT USER, THEN REDIRECT
                        var noDetailCard = $ionicPopup.alert({title: 'Content not available.', template: 'Sorry, we could not seem to find that content. Please try again.'});
                        noDetailCard.then(function() {
                            $state.go('app.sourceDetail', {sourceName: $scope.sourceName, sourceDetail: $scope.datas[0].id });
                        });
                    }
                }
            };

            $scope.getDetailTemplate = function () {

                // DEFAULT TO LOADER (IF STATE SCREEN STATE NOT READY, ETC.)
                var uiDetailTemplateUrl = 'templates/ui-loader.html';

                // SCREEN STATE READY?
                if ($rootScope.screenState && $scope.detailCard && $scope.detailData) {
                    // TEMPLATE LOGIC
                    uiDetailTemplateUrl = 'templates/' + $scope.detailCard.templates.detail + '.html';
                }

                $rootScope.log(uiDetailTemplateUrl, 1, 'UI-DETAIL-TEMPLATE');

                // RETURN TEMPLATE
                return uiDetailTemplateUrl;
            };

            $scope.loadDetailData();

        },
        template: '<div ng-include="getDetailTemplate()"></div>'
    }
})
/*
.directive("splitBy", function($rootScope) {

    var setDimensions = function (element, reference, columns, setRatio) {
        // DETERMINE DIVISOR
        columns = columns || null;

        // DETERMINE WIDTH TO DIVIDE BY (SCREEN OR PARENT ELEMENT WIDTH)
        var parentWidth = $rootScope.screenState.width;
        if (reference === 'parent') {
            parentWidth = $(element).parent().innerWidth();
        }

        // DETERMINE IF WE NEED TO SET EXPLICIT WIDTH
        if (columns) {
            // DETERMINE NEW WIDTH
            var newWidth = Math.floor((parentWidth - columns) / columns);
        }

        // APPLY NEW WIDTH
        $(element).width(newWidth);

        // SET RATIO (HEIGHT)?
        if (setRatio) {

            var aryArgs = setRatio.split(':');

            if (aryArgs.length == 2) {

                var rW = aryArgs[0];
                var rH = aryArgs[1];

                // DETERMINE NEW RATION SPECIFIC HEIGHT
                var newHeight = Math.floor((newWidth / rW) * rH);

                console.log(newHeight);

                // APPLY NEW HEIGHT
                $(element).height(newHeight);
            }
        }
    };

    return {
        // ISOLATE SCOPE (RESTRIECT TO CARD DATA OBJECT AND TEMPLATE ATTR)
        restrict: 'A',
        scope : {
            splitBy : '@',
            reference : '@', // 'parent' or 'screen',
            setRatio : '@' // '16:9' or 'false' (default)
        },
        link: function(scope, element, attrs) {
            attrs.reference = attrs.reference || 'screen';
            attrs.setRatio = attrs.setRatio || '';
            setDimensions(element, attrs.reference, attrs.splitBy, attrs.setRatio);
        }
    };
})
 .directive('imageRatio', function() {

    var fixImageRatio = function(element, columns, ratio) {

        var aryArgs = ratio.split(':');

        if (aryArgs.length == 2) {

            var parent, rW, rH, parent, parentWidth, newWidth, newHeight, imgSrc;

            // GET RATIO ARGS
            rW = aryArgs[0];
            rH = aryArgs[1];

            // GET PARENT
            jqParent = $(element).parent();

            // GET WIDTH OF PARENT ELEMENT
            parentWidth = jqParent.innerWidth();

            // DETERMINE NEW WIDTH
            newWidth = Math.floor((parentWidth) / columns);

            // DETERMINE NEW RATION SPECIFIC HEIGHT
            newHeight = Math.floor((newWidth / rW) * rH);

            // GET IMAGE SOURCE
            imgSrc = $(element).attr('src');

            // REMOVE THE ELEMENT
            $(element).remove();

            // APPLY THE NEW SIZES & BACKGROUND IMG TO THE PARENT ELEMENT
            //jqParent.width(newWidth);
            //jqParent.height(newHeight);
            jqParent[0].style.backgroundImage = 'url(' + imgSrc + ')';
        }
    };

    return {
        scope : {
            imageRatio : '@',
            columns : '@'
        },
        link: function(scope, element, attrs) {
            element.on('load', function(e) {
                attrs.columns = attrs.columns || '1';
                attrs.imageRatio = attrs.imageRatio || '16:9';
                fixImageRatio(element, attrs.columns, attrs.imageRatio);
            });
        }
    };
 })
*/
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
.directive('managecontent', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            $timeout(function() {
                $('.contentarea').find('a[href^=#]').each(function() {
                    $(this).replaceWith($(this).text());
                    // .replace(/(\r\n|\n|\r)/gm,"");
                });

                // remove all figures and tables (and following hrs)
                // using jQuery remove instead of hiding with CSS, hoping removal of large HTML markup from the DOM will help with performance
                $('.figure, .table, hr').remove();
            });
        }
    };
})


/*
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
 .directive('halfsize', function() {
    return {
        link: function(scope, element, attrs) {
            element.on('load', function(e) {
                var w = $(window),
                    newwidth = (w.width() - 20) / 2,            // half the screen - padding
                    newheight = (newwidth / 16) * 9,            // maintian 16x9 aspect ratio
                    parent = this.parentElement,
                    src = $(element).attr('src');

                    $(element).remove();

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
                parent.style.backgroundImage = 'url(' + src + ')';
            });
        }
    };
 })
 .directive('fullsize', function() {
    return {
        link: function(scope, element, attrs) {
            element.on('load', function(e) {
                var w = $(window),
                    newwidth = (w.width() - 20),                // half the screen - padding
                    newheight = (newwidth / 16) * 9,            // maintian 16x9 aspect ratio
                    parent = this.parentElement,
                    src = $(element).attr('src');

                    $(element).remove();

                // apply the new sizes to the parent element
                parent.style.width = newwidth + 'px';
                parent.style.height = newheight + 'px';
                parent.style.backgroundImage = 'url(' + src + ')';
                parent.style.backgroundRepeat = 'no-repeat';
                parent.style.backgroundSize = 'cover';
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
})*/;
