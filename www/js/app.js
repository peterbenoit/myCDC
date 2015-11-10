/**
 *  myCDC
 *  TODO: info.plist NSAppTransportSecurity key needs to be corrected before deployment
 */
angular.module('mycdc', [
    'ionic',
    'mycdc.controllers',
    'mycdc.data',
    'mycdc.directives',
    'mycdc.filters',
    'mycdc.services',
    'mycdc.storage',
    'ngCordova',
    'ngAnimate',
    'angular.filter',
    'ngIOS9UIWebViewPatch'
])
    /*
    add to body class: platform-android
    add to body class: platform-browser
    add to body class: platform-ios
    add to body class: platform-wp8
    */

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.run(function($ionicPlatform, $cordovaStatusbar, $rootScope, $location, $ionicBody, $timeout, $window, DeviceInfo, ScreenSize, $ionicScrollDelegate, $state, $stateParams, $cordovaNetwork, $ionicPopup, $http, $filter, $sce, $q) {

    var rs = $rootScope, href = window.location.href;

    // window.open should use inappbrowser
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
        //window.open = cordova.InAppBrowser.open;

        rs.type = $cordovaNetwork.getNetwork();
        rs.isOnline = $cordovaNetwork.isOnline();
        rs.isOffline = $cordovaNetwork.isOffline();
        rs.stateClasses = {};

        if (rs.isOffline) {
            $ionicPopup.alert({
                title: 'No Connection',
                template: 'You do not appear to be connected to the Internet. Some content you have downloaded may be out of date.'
            });
        }

        // listen for Online event
        rs.$on('$cordovaNetwork:online', function(event, networkState) {
            var onlineState = networkState;
        });

        // listen for Offline event
        rs.$on('$cordovaNetwork:offline', function(event, networkState) {
            var offlineState = networkState,
                isDirty = false;
                rs.log(offlineState);
        });

        $cordovaStatusbar.hide()
        $ionicPlatform.fullScreen();
    }

    // frameready() is called in embed.html, when the iframe has loaded
    // NOTE: this only works on a device
    window.frameready = function() {
        var iframe = $('#contentframe');
            anchors = iframe.contents().find('#contentArea a'); // only anchors in the content area

            //iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument

        $rootScope.$broadcast('source-detail-load-complete');

        body = iframe.contents().find('body');
        $(body).unbind("scroll");
        /*if (body.length) {
            body.append('<style>header, footer, #socialMediaShareContainer { display:none !important; }</style>')
        }*/

        // Capture any anchors clicked in the iframe document
        anchors.on('click', function(e) {
            e.preventDefault();

            alert('CLICK');

            var framesrc = iframe.attr('src'),
                href = $(this).attr('href'),
                anchor = document.createElement('a');
                anchor.href = href;
            var anchorhost = anchor.hostname;

            // create an anchor with the href set to the iframe src to fetch the domain & protocol
            // WARN: cannot assume "http" || "www.cdc.gov"
            var frameanchor = document.createElement('a');
                frameanchor.href = framesrc;
            var framehost = frameanchor.hostname,
                frameprotocol = frameanchor.protocol;

            // if this anchor doesn't have a hostname
            if (anchorhost === '') {
                href = frameprotocol + '//' + framehost + href;
            }

            window.open(href, '_system');
        });
    };

    rs.$viewHistory = {
        histories: { root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 } },
        backView: null,
        forwardView: null,
        currentView: null,
        disabledRegistrableTagNames: []
    };

    rs.logLevel = -99;

    rs.log = function (anyVar, intLevel, anyLabel) {
        intLevel = intLevel || 10;
        if (rs.logLevel >= intLevel) {
            if (anyLabel) {
                console.log('*** ' + anyLabel + ' ***');
            }
            console.log(anyVar);
            if (anyLabel) {
                console.log('*** /' + anyLabel + ' ***');
            }
        }
    };

    $ionicPlatform.ready(function() {
        if (window.device) {
            window.open = cordova.InAppBrowser.open;
        }

        // Open any EXTERNAL link with InAppBrowser Plugin
        $(document).on('click', '[href^=http], [href^=https]', function(e) {
            e.preventDefault();

            var t = $(this),
                href = t.attr('href');

                rs.log('Opening ', href);

            var ref = window.open(href, '_system');

            //TODO: not working in iOS
            // if (href.indexOf('cdc.gov') >= 0) {
            //     ref.addEventListener('loadstop', function() {
            //         ref.insertCSS({
            //             code: 'header#header { display: none; }footer#footer {display:none} div#socialMediaShareContainer.dd {display:none}'
            //         });
            //     });
            // }
        });

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        rs.deviceinfo = DeviceInfo;
        rs.screensize = ScreenSize;

        rs.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };

        /**
         * https://github.com/gbenvenuti/cordova-plugin-screen-orientation
         */
        if (window.cordova && window.cordova.plugins) {
            // lock all devices into portrait mode, except for tablets
            screen.lockOrientation('portrait');
            if (ionic.Platform.isIPad() || ionic.Platform.is('androidtablet')) {
                // unlocking screen for orientation change
                screen.unlockOrientation();
            }
        }

        /*
        // kick off a media query listener to tag the body with a class
        var mq;
        if (window.matchMedia) {
            mq = window.matchMedia('(orientation: portrait)');

            if (mq.matches) {
                //portrait
                rs.orientation = 'portrait';
                $ionicBody.addClass('portrait');
            } else {
                //landscape
                rs.orientation = 'landscape';
                $ionicBody.addClass('landscape');
            }
            rs.$apply();

            mq.addListener(function(m) {
                if (m.matches) {
                    rs.log('changed to portrait');
                    rs.orientation = 'portrait';
                    $ionicBody.removeClass('landscape').addClass('portrait');
                } else {
                    rs.log('changed to landscape');
                    rs.orientation = 'landscape';
                    $ionicBody.removeClass('portrait').addClass('landscape');
                }
                rs.$apply();
            });
        }
        */
    });

    rs.dataProcessor = (function () {
        var processors = {
            cardTemplateInjector: function (d, objSourceMeta) {
                var idx1 = d.length, idx2, obj1, obj2, strCg, strCgStripped;
                var tmp = [];

                rs.log(d, 1, 'CURRENT SOURCE PRE FIX');
                rs.log(objSourceMeta, 1, 'CURRENT SOURCE METADATA');

                while (idx1--) {
                    obj1 = d[idx1];

                    // TEMPORARY FEED BUG WORKAROUND (DEFAULTS DATA WHICH SHOULD BE PRESENT IN TAG DATA)
                    if (!obj1.contentgroup) {
                        obj1.contentgroup = 'FEED ISSUE: ' + objSourceMeta.contentGroupIdentifier + 'doesnt not include a content group key';
                        obj1.appContentGroup = objSourceMeta.contentGroupIdentifier;
                        obj1.templates = angular.extend({}, rs.templateMap[obj1.appContentGroup]);
                        obj1.detailType = objSourceMeta.detailType;
                        obj1.contentType = objSourceMeta.contentType;
                        obj1.home = '#/app/source/' + obj1.appContentGroup;
                        obj1.url = obj1.home + '/';
                    }

                    // PARSE & NORMALIZE TIME(S)
                    if (obj1.datePublished) {
                        var time = moment(obj1.datePublished);
                        obj1.datePublished = time.format('MMMM Do, YYYY');
                    }

                    // PROCESS ENCLOSURES
                    obj1.hasImage = false;
                    if (obj1.enclosures && obj1.enclosures.length) {
                        idx2 = obj1.enclosures.length;
                        while (idx2--) {
                            obj2 = obj1.enclosures[idx2];
                            if (obj2.contentType.indexOf('image') > -1) {
                                obj1.hasImage = true;
                                obj1.imageSrc = obj2.resourceUrl;
                            }
                        }
                    }

                    // PROCESS TAGS
                    if (obj1.tags && obj1.tags.length) {
                        idx2 = obj1.tags.length;
                        while (idx2--) {
                            obj2 = obj1.tags[idx2];
                            if (obj2.type.toLowerCase() == 'contentgroup') {
                                strCg = obj2.name;
                                strCgStripped = rs.cgNormalize(strCg);

                                // UPDATE BASED ON TAG DATA
                                obj1.contentGroupIdentifier = strCg;
                                obj1.appContentGroup = strCgStripped;
                                obj1.templates = rs.templateMap[obj1.appContentGroup];
                                obj1.detailType = objSourceMeta.detailType;
                                obj1.contentType = objSourceMeta.contentType;
                                obj1.home = '#/app/source/' + obj1.appContentGroup;
                                obj1.url = obj1.home + '/';

                                // TODO: consider using config.json for this data
                                if (obj1.appContentGroup === 'eid') {
                                    obj1.hasImage = false;
                                    break;
                                }

                                if (obj1.appContentGroup === 'vitalsigns') {
                                    obj1.hasImage = false;
                                    break;
                                }

                                if (obj1.appContentGroup === 'outbreaks') {
                                    obj1.isOutbreak = true;
                                    obj1.hasImage = false;
                                    break;
                                }

                                if (obj1.appContentGroup === 'travelnotices') {
                                    obj1.isAlert = obj1.name.indexOf('Alert') > -1;
                                    obj1.isWatch = obj1.name.indexOf('Watch') > -1;
                                    obj1.isWarning = obj1.name.indexOf('Warning') > -1;
                                    break;
                                }
                            }
                        }
                    }
                }

                rs.log(d, -1, 'CURRENT SOURCE POST FIX');

                return d;
            },
            feedNormalizer: function(d) {
                return d;
            },
            processTags: function(d) {
                return d;
            },
            parseEncoding: function(d) {
                var currItem, data = d.data.results;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];
                        if (currItem.description) {
                            // remove encoding from description
                            var txt = document.createElement('textarea');
                            txt.innerHTML = currItem.description;
                            currItem.description = txt.value;
                        }
                    }

                    return data;
                }

                return [];
            },
            stripHtml: function(d) {
                var currItem, data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];

                        // remove html from name
                        currItem.name = currItem.name.replace(/<[^>]+>/gm, '');

                        // remove html from description
                        currItem.description = currItem.description.replace(/<[^>]+>/gm, '');
                    }

                    return data;
                }

                return [];
            },
            extractVideoComments: function(d) {
                var currItem, data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];
                        if (currItem.description) {
                            currItem.description = currItem.description.split('Comments on this video')[0].trim();
                        }
                    }

                    return data;
                }

                return [];
            },
            flagOutbreak: function(d) {
                var currItem, data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];
                        currItem.isOutbreak = true;
                    }

                    return data;
                }

                return [];
            },
            firstOnly: function(d) {
                var data = d;
                if (data.length) {
                    return [data[0]];
                }

                return null;
            },
            defaultHandler: function() {
                return [];
            }
        };

        return function (d, objMetaData) {

            var processor;

            data = (d.data && d.data.results) ? d.data.results : [];
            rs.log(data);

            // DID WE GET DATA?
            if (data.length > 0) {

                // PROCESS DATA (IF NEEDED)
                if (objMetaData.processors && objMetaData.processors.length) {

                    // REVERSE ARRA SINCE FOR REVERSE LOOP
                    objMetaData.processors.reverse();

                    // REVERSE LOOP THROUGH PROCESSORS
                    for (var i = objMetaData.processors.length - 1; i >= 0; i--) {
                        processor = objMetaData.processors[i];
                        data = processors[processor].call(this, data, objMetaData);
                    };
                }
            }

            //RETURN IT IN THE PROMISE CHAIN
            return data;

        }
    } ());

    rs.getLocalStore = (function() {

        var storePrefix = 'myCDC-';

        var isFresh = function (storeAgingName) {

            // Find the duration between two dates
            var now = moment().unix();
            var savedTime = moment(window.localStorage[storeAgingName]).unix();
            var diff = moment.duration(now - savedTime);
            if (diff == 0) {

            }
            console.log(moment.duration(now - savedTime) + ' in age' )

            if (!window.localStorage.hasOwnProperty(storeAgingName)) {
                return false;
            }
        };

        return function(stateParams) {

            var storeName = storePrefix + stateParams.storeName;
            var storeAgingName = storeName + '-age';
                    isFresh(storeAgingName);

            return {
                all: function() {

                    var appdata = window.localStorage[storeName];
                    if (appdata) {
                        return angular.fromJson(appdata);
                    }
                    return [];
                },
                save: function(appdata) {
                    window.localStorage[storeAgingName] = moment().unix();
                    window.localStorage[storeName] = angular.toJson(appdata);
                },
                clear: function() {
                    window.localStorage.removeItem(storeName);
                }
            };
        };
    }());

    rs.remoteApi = (function() {
        var apiDefaults = {
            method: 'GET',
            timeout: 30000
        };

        return function(options) {
            options.method = options.method || apiDefaults.method;
            options.timeout = options.timeout || apiDefaults.timeout
            return $http(options);
        }
    }());

    rs.refreshScreenState = function () {

        $rootScope.$broadcast('screen-state-update-started');

        $rootScope.sourceListPromise.then(function() {

            var objReturn = {
                width : $window.innerWidth,
                height : $window.innerHeight
            };

            var sourceMeta = $rootScope.getSourceMeta($stateParams);
            var containerSet = (sourceMeta.countainerSet || 'ui-container-default');

            // GET SCREEN SIZE
            if ($window.innerWidth >= 1024 && $window.innerWidth > $window.innerHeight) {
                objReturn.viewType = 'tablet';
                objReturn.viewOrientation = 'landscape';
            } else if ($window.innerWidth >= 768 && $window.innerWidth < $window.innerHeight) {
                objReturn.viewType = 'tablet';
                objReturn.viewOrientation = 'portrait';
            } else {
                objReturn.viewType = 'phone';
                objReturn.viewOrientation = 'portrait';
            }

            // UPDATE SCOPE
            $rootScope.screenState= objReturn;
            $rootScope.sourceMeta = sourceMeta;

            // WAIT FOR ANY DIGEST TO COMPLETE BEFORE APPLYING
            $timeout(function(){
                // SET BUTTONS
                $rootScope.setButtonState();
                $rootScope.$broadcast('screen-state-update-complete', {
                    templates : sourceMeta.templates,
                    screenState : objReturn
                });
            }, 0);
        });
    };

    rs.streamScroller = function (blnScroll) {

        var id, deviceType, orientation;

        id = id || $stateParams.sourceDetail;
        deviceType = deviceType || rs.screenState.deviceType;
        orientation = orientation || rs.screenState.orientation;

        var objProperties = {
            scrollHandle : "streamScrollVertical",
            offsetGetter : "offsetTop",
            offsetSetter : 'offsetSetterTop',
            offsetSetterTop : 0,
            offsetSetterLeft : 0,
            selector : "#card-" + id,
            destination : null
        };

        // CHANGE PROPERTIES FOR PORTRAIT (HORIZONTAL SCROLLER)
        if (deviceType == 'tablet' && orientation == 'portrait') {
            objProperties.scrollHandle = 'streamScrollHorizontal';
            objProperties.offsetSetter = 'offsetSetterLeft';
            objProperties.offsetGetter = 'offsetLeft';
        }

        // GET LOCATION OF DESTINATION ELEMENT
        objProperties[objProperties.offsetSetter] = angular.element(document.querySelector(objProperties.selector)).prop(objProperties.offsetGetter);

        // SCROLL TO IT
        $ionicScrollDelegate.$getByHandle(objProperties.scrollHandle).scrollTo(objProperties.offsetSetterLeft, objProperties.offsetSetterTop, true);

    };
    rs.setButtonState = function () {
        var buttons = {
            show : {
                home : true || ($stateParams.sourceName !== 'homestream' || rs.sourceDetail),
                back : false || ($stateParams.sourceName !== 'homestream' && $stateParams.sourceDetail)
            }
        };

        rs.buttons = buttons;
    };

    rs.goBack = function() {
        $state.go('app.sourceIndex', {
            sourceName : $stateParams.sourceName
        });
    };

    rs.goHome = function() {
        rs.sourceDetail = "";
        $state.go('app.sourceIndex', {
            sourceName : 'homestream'
        });
    };

    rs.cgNormalize = function (contentgroup) {
        return contentgroup.toLowerCase().replace(/ /g, '');
    };

    // GET SOURCE METADATA FROM SOURCELIST BY NAME (In Route Params)
    rs.getSourceMeta = function(stateParams) {

        // PARAMS
        var arySourceInfo, strSourceName = stateParams.sourceName || stateParams || "";

        // FILTER HERE
        arySourceInfo = $filter('filter')($rootScope.sourceList, {
            contentGroupIdentifier: strSourceName
        }) || [];

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    rs.getSourceList = function() {
        var deferredPromise = $q.defer;

        return rs.remoteApi({
            url: 'json/sources.json'
        });
    };

    rs.getSourceIndex = function(stateParams) {

        var localStore, objMetaData, sourceIndexPromise, data;

        objMetaData = rs.getSourceMeta(stateParams);
        localStore = rs.getLocalStore(stateParams);

        if (objMetaData.url) {

            sourceIndexPromise = rs.remoteApi({
                url: objMetaData.url
            });

            sourceIndexPromise.then(function(d) {

                // NORMALIZE DATA BY SOURCE SPECS
                var data = rs.dataProcessor(d, objMetaData);

                //SAVE IT TO LOCAL
                localStore.save(data);

                // SAVE IT TO RS
                rs.sourceIndex = data;

            }, function(e) {

                // ON ERROR, RETURN WHAT WE HAVE IN LOCAL STORAGE
                return localStore.all();
            });

            return sourceIndexPromise;
        } else {
            return $timeout(function(){
                return {
                    data : []
                };
            }, 0);
        }
    };
/*
    rs.getDetailContent = (function() {

        var getSourceDetailUrl = function(sourceMeta, sourceIndexCard) {
            var url;

            switch (sourceMeta.getContentBy) {
                case 'id':
                    url = 'https://prototype.cdc.gov/api/v2/resources/media/' + sourceIndexCard.id + '/syndicate.json';
                break;
                default: // ID
                    url = sourceIndexCard.sourceUrl;
                break;
            }

            if (sourceIndexCard) {
                return {
                    url : $sce.trustAsResourceUrl(url),
                    nochromeurl : $sce.trustAsResourceUrl(rs.getNoChromeUrl(url))
                }
            };

            return false;
        };

        return function (sourceMeta, sourceIndexCard) {

            var sourceDetailPromise, url;

            url = getSourceDetailUrl(sourceMeta, sourceIndexCard);

            sourceDetailPromise = rs.remoteApi({
                url: url
            }).then(function(d) {
                return d;
            });

            return sourceDetailPromise;
        }
    } ());*/

    rs.appInit = function(blnRefresh) {

        // REFRESH REQUESTED?
        if (blnRefresh || !rs.sourceListPromise || false) {

            // DEBUG
            rs.log('appInit Refresh');

            // GET & SAVE THE SOURCE LIST PROMISE
            rs.sourceListPromise = rs.getSourceList();

            // CONTINUE PROMISE CHAIN
            rs.sourceListPromise.then(function(d) {

                //TRIM OUT UNNESESSARY DATA FROM RETURN
                var sourceList = d.data;

                // CREATE SOURCE TEMPLATE MAP
                rs.templateMap = (function() {

                    // LOCALS
                    var i = sourceList.length, objReturn = {}, objSrc;

                    // LOOP SOURCES
                    while (i--) {

                        // GET THE CURRENT SOURCE
                        objSrc = sourceList[i];

                        // MAP TEMPLATES TO CONTENTGROUPIDENTIFIER
                        objReturn[objSrc.contentGroupIdentifier] = objSrc.templates;
                    }

                    // RETURN MAP
                    return objReturn
                } ());

                // SET SOURCE LIST TO ROOTSCOPE;
                rs.sourceList = sourceList;

                // RETURN TRIMMED DATA TO CHAIN
                return rs.sourceListPromise;
            });
        }

        var listenersAdded = listenersAdded || false;

        if (!listenersAdded) {

            var mq = window.matchMedia('(orientation: portrait)');

            mq.addListener(function(m) {
                $rootScope.refreshScreenState();
            });

            window.addEventListener("orientationchange", $rootScope.refreshScreenState, true);

            // Add Listener for resize changes
            window.addEventListener("resize", $rootScope.refreshScreenState, false);
        }

        // RETURN THE SOURCE LIST PROMISE
        return rs.sourceListPromise;
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.transition('none'); // keep the navbar from animating
    $ionicConfigProvider.views.transition('fade');

    var sp = $stateProvider;

    sp.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/ui-menu.html',
        controller: 'AppCtrl'
    });

    /* WARN: this is temporary
    sp.state('app.homestream', {
        url: '/homestream',
        views: {
            'menuContent': {
                templateUrl: defaultTemplateHandler('dynamic', 'stream-home'),
                controller: 'HomeCtrl'
            }
        }
    });*/

    sp.state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/ui-main-source-list.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    sp.state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    });

    /*sp.state('app.civdemo', {
        url: '/civdemo',
        views: {
            'menuContent': {
                templateUrl: 'templates/civ-demo.html'
            }
        }
    });*/

    sp.state('app.sourceIndex', {
        url: '/source/:sourceName',
        views: {
            'menuContent': {
                templateUrl: 'templates/ui-main.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    sp.state('app.sourceDetail', {
        url: '/source/:sourceName/:sourceDetail',
        views: {
            'menuContent': {
                templateUrl: 'templates/ui-main.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/source/homestream');
})

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

.directive('uiStream', function($rootScope, $state) {
   return {
        restrict: 'E',
        controller: function($scope, $element){

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

                $rootScope.log(uiStreamTemplateUrl, -1, 'UI-STREAM-TEMPLATE');

                return uiStreamTemplateUrl;
            };

            //$('.stream.stream-vertical').width(300).height($window.innerHeight);
            //$('ui-detail-view').width($window.innerWidth - 300).height($window.innerHeight);

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
        },
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

                if (!blnLoader) {

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

                    if ($scope.cardData.id == '152263') {
                        $rootScope.log($scope.cardData, 1, 'UI-CARD-DATA');
                        $rootScope.log(uiCardTemplateUrl, 1, 'UI-CARD-TEMPLATE');
                    }

                }

                // RETURN TEMPLATE
                return uiCardTemplateUrl;
            };
        },
        link: function(scope, element, attrs) {
            scope.template = attrs.template;
        },
        template: '<div class="card-container-pad" ng-include src="getCardTemplate()"></div>',
    };
})

.directive('uiDetail', function($rootScope, $timeout, $sce, $filter, $state, $stateParams, $ionicPopup) {

    // HANDLE DIFFERENT TYPES OF CONTENT DETAIL PROCESSING
    var detailProcessors = {
        video : function ($scope) {

            $scope.processer = 'VIDEO';
            $scope.detailData = $scope.detailCard;

            $scope.getVideoUrl = function() {
                return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.detailData.sourceUrl.split('?v=')[1]);
            };

            return $timeout(function(){
                return $scope.detailData;
            },0);
        },
        iframe : function ($scope) {
            $scope.processer = 'IFRAME';


            var noChromeUrl = createNoChromeUrl($scope.detailCard.sourceUrl);

            $scope.detailData = $scope.detailCard;

            $rootScope.remoteApi({
                url : 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=' + noChromeUrl
            }).then(function(resp) {
                if (resp.data.status === '200') {
                    $scope.frameUrl = $sce.trustAsResourceUrl(noChromeUrl);
                } else {
                    $scope.frameUrl = $sce.trustAsResourceUrl($scope.detailCard.sourceUrl);
                }
                $rootScope.log($scope.frameUrl, 10, 'IFRAME URL');
                return resp;
            },
            function(resp) {
                $scope.frameUrl = $sce.trustAsResourceUrl($scope.detailCard.sourceUrl);
                $rootScope.log($scope.frameUrl, 10, 'IFRAME URL FROM ERROR HANDLER');
                return resp
            });

            // NOTE: $rootScope.$broadcast('source-detail-load-complete'); DELEGATED TO IFRAME LOAD
            return $timeout(function(){
                return $scope.detailData;
            },0);

        },
        default : function ($scope) {

            $rootScope.log($scope, 10, 'DEFAULT DETAIL PROCESSOR');
            $rootScope.log($scope.detailCard, 10, '$scope.detailCard');
            $scope.processer = 'DEFAULT';

            $rootScope.remoteApi({
                url : 'https://prototype.cdc.gov/api/v2/resources/media/' + $scope.detailCard.id + '/syndicate.json'
            }).then(function(d){
                $rootScope.log(d, 1, 'RETURNED DETAIL DATA');
                // NORMALIZE DATA BY SOURCE SPECS
                $scope.detailData = $rootScope.dataProcessor(d, $scope.sourceMeta);
                $rootScope.$broadcast('source-detail-load-complete');
            });
            return $timeout(function(){
                return $scope.detailData;
            },0);
        }
    };

    var createNoChromeUrl = function (sourceUrl) {
        sourceUrl = sourceUrl || '';
        var filename = sourceUrl.split('/').pop();
        var newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1];
        return sourceUrl.replace(filename, newfilename);
    };

    var getDetailCard = function(cardList, contentID) {



        // PARAMS
        var arySourceInfo;

        // FILTER HERE
        arySourceInfo = $filter('filter')(cardList, {
            id: contentID
        });

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    return {
        restrict: 'E',
        controller : function ($scope) {

            // SET LISTENER ONCE
            if (!$scope.uiDetailnit) {
                $scope.uiDetailnit = true;

                $rootScope.$on('screen-state-update-complete', function () {
                    $scope.getDetailTemplate();

                });
                $rootScope.$on('source-detail-changed', function () {
                    $scope.loadDetailData($scope.getDetailTemplate);

                });
                $rootScope.$on('source-detail-load-started', function(event, args) {
                    $rootScope.log('UI DETAIL DIRECTIVE RECEIVED source-detail-load-STARTED', 10, 'EVENT-LISTENER:');
                    $rootScope.log($scope.detailCard, 10, 'SCOPE DETAIL CARD');
                    $rootScope.log($scope.detailData, 10, 'SCOPE DETAIL DATA');
                });
                $rootScope.$on('source-detail-load-complete', function(event, args) {
                    $rootScope.log('UI DETAIL DIRECTIVE RECEIVED source-detail-load-COMPLETED', 10, 'EVENT-LISTENER:');
                    $rootScope.log($scope.detailCard, 10, 'SCOPE DETAIL CARD');
                    $rootScope.log($scope.detailData, 10, 'SCOPE DETAIL DATA');

                    $scope.getDetailTemplate();
                });
            }

            $scope.sourceIndexPromise.then(function(d){

                $scope.loadDetailData();

                return d;

            });


            $scope.loadDetailData = function (callback) {
                $scope.detailCard = getDetailCard($scope.datas, $scope.sourceDetail);
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
                    detailProcessors[$rootScope.sourceMeta.detailType].call(this, $scope);

                    // DEBUG
                    $rootScope.log($scope.processer, 10, 'UI-DETAIL-DIRECTIVE-PROCESSER');
                    $rootScope.log($scope.detailTemplateUrl, 10, 'UI-DETAIL-DIRECTIVE-TEMPLATE');

                    if (callback) {
                        callback.apply();
                    }

                } else {

                    // DETAIL ID DETECTION LOGIC
                    if (!$stateParams.sourceIndex) {

                        // IF NO SOURCE INDEX (DETAIL ID) IS PRESENT, VERIFY INTENT (SHOULD WE REQUIRE ONE)
                        if ($scope.screenState.viewType == 'tablet') {
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
        },
        template: '<div ng-include="getDetailTemplate()"></div>'
    }
})

.directive("splitBy", function($rootScope, $timeout, $state) {

    var setDimensions = function (element, reference, columns, setRatio) {
        // DETERMINE DIVISOR
        columns = columns || 3;

        // DETERMINE WIDTH TO DIVIDE BY (SCREEN OR PARENT ELEMENT WIDTH)
        var parentWidth = $rootScope.screenState.width;
        if (reference === 'parent') {
            parentWidth = $(element).parent().innerWidth();
        }

        // DETERMINE NEW WIDTHE
        var newWidth = Math.floor((parentWidth - columns) / columns);

        // APPLY NEW WIDTH
        $(element).width(newWidth);

        // SET RATIO (HEIGHT)?
        if (setRatio) {

            // DETERMINE NEW RATION SPECIFIC HEIGHT
            var newHeight = Math.floor((newWidth / 16) * 9);

            console.log(newHeight);

            // APPLY NEW HEIGHT
            $(element).height(newHeight);
        }
    };

    return {
        // ISOLATE SCOPE (RESTRIECT TO CARD DATA OBJECT AND TEMPLATE ATTR)
        restrict: 'A',
        scope : {
            splitBy : '@',
            reference : '@', // 'parent' or 'screen',
            setRatio : '@' // 'true' or 'false' (default)
        },
        link: function(scope, element, attrs) {
            attrs.reference = attrs.reference || 'screen';
            attrs.setRatio = attrs.setRatio || false;
            setDimensions(element, attrs.reference, attrs.splitBy, attrs.setRatio);
        }
    };
});