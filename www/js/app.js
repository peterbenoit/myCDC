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
.run(function($ionicPlatform, $rootScope, $location, $ionicBody, DeviceInfo, ScreenSize, $ionicScrollDelegate, $state, $stateParams, $cordovaNetwork, $ionicPopup, $http, $filter, $sce) {
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
    }

    // frameready() is called in embed.html, when the iframe has loaded
    // NOTE: this only works on a device
    window.frameready = function() {
        var iframe = $('#contentframe');
            anchors = iframe.contents().find('#contentArea a'); // only anchors in the content area
            //iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument

        // Capture any anchors clicked in the iframe document
        anchors.on('click', function(e) {
            e.preventDefault();

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

    rs.logLevel = 1;

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

    rs.streamTemplate = function (type, orientation) {
        rs.log(type, 9, 'Stream Template');
        return 'templates/' + type + '-' + orientation +'.html';
    };

    rs.cardTemplate = function (type, orientation) {
        rs.log(type, 8, 'Card Template');
        return 'templates/' + type +'.html';
    };

    rs.getTemplate = function (type, card, orientation) {
        rs.log(type, 8, 'Requested TemplateType');
        rs.log(card, 8, 'Card Data Provided for Template Selection');
        return 'templates/' + card.templates[type] +'.html';
    };

    rs.detailTemplate = function (type, orientation) {
        rs.log(type, 8, 'detailTemplate');
        return '<' + '>';
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

    rs.getScreenState = function () {

        // DEFAULT RETURN
        var objReturn = {
            viewType : 'phone',
            viewOrientation : 'portrait'
        };

        // GET SCREEN SIZE & DETERMINE DEVICE "SCREEN TYPE" & ORIENTATION FROM THAT
        if (window.screen.width >= 1024 && window.screen.width > window.screen.height) {
            objReturn.viewType = 'tablet';
            objReturn.viewOrientation = 'landscape';
        } else if (window.screen.width >= 768 && window.screen.width < window.screen.height) {
            objReturn.viewType = 'tablet';
            objReturn.viewOrientation = 'portrait';
        }

        return objReturn;
    };

    rs.cgNormalize = function (contentgroup) {
        return contentgroup.toLowerCase().replace(/ /g, '');
    };

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
                        obj1.templates = rs.templateMap[obj1.appContentGroup];
                        obj1.detailType = objSourceMeta.detailType;
                        obj1.home = '#/app/source/' + obj1.appContentGroup;
                        obj1.url = obj1.home + '/';
                    }

                    // LOOP TAG - LOOK FOR CONTENT GROUP MATCH
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
                                obj1.home = '#/app/source/' + obj1.appContentGroup;
                                obj1.url = obj1.home + '/';

                                if (tmp.indexOf(strCgStripped) == -1) {
                                    tmp.push(strCgStripped);
                                }
                            }
                        }
                    }
                }

                rs.log('Unique Content Groups Found');
                rs.log(tmp);

                rs.log(d, 1, 'CURRENT SOURCE POST FIX');

                return d;
            },
            feedNormalizer: function(d) {

                var time, currItem;
                var data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];
                        hasImage = false;

                        // format the dateModified
                        time = moment(currItem.datePublished);
                        currItem.datePublished = time.format('MMMM Do, YYYY');

                        // if there's an enclosure
                        if (currItem.enclosures.length) {
                            enclosures = currItem.enclosures;

                            // look for the image enclosure
                            for (var j = enclosures.length - 1; j >= 0; j--) {
                                if (enclosures[j].contentType.indexOf('image') > -1) {
                                    hasImage = true;
                                    currItem.imageSrc = enclosures[j].resourceUrl;
                                    break;
                                }
                            }
                        }
                        // Add image indicator
                        currItem.hasImage = hasImage;
                    }

                    return data;
                }

                return [];
            },
            processTags: function(d) {
                var currItem, data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];

                        // If there are any tags, look for the ContentGroup to identify it (and it's path) here for use in the template
                        if (currItem.tags.length) {
                            var tags = currItem.tags;

                            // look for the ContentGroup enclosure and set the same rules that apply to it in their individual controllers
                            // also set a path to navigate
                            for (var k = tags.length - 1; k >= 0; k--) {
                                if (tags[k].type === 'ContentGroup') {
                                    //currItem.ContentGroup = tags[k].name;
                                    //currItem.appContentGroup = rs.cgNormalize(tags[k].name);
                                    //currItem.home = '#/app/source/' + currItem.appContentGroup;
                                    //currItem.url = currItem.home + '/';

                                    // TODO: consider using config.json for this data
                                    if (currItem.appContentGroup === 'eid') {
                                        currItem.hasImage = false;
                                        break;
                                    }

                                    if (currItem.appContentGroup === 'vitalsigns') {
                                        currItem.hasImage = false;
                                        break;
                                    }

                                    if (currItem.appContentGroup === 'outbreaks') {
                                        currItem.isOutbreak = true;
                                        currItem.hasImage = false;
                                        break;
                                    }

                                    if (currItem.appContentGroup === 'travelnotices') {
                                        currItem.isAlert = currItem.name.indexOf('Alert') > -1;
                                        currItem.isWatch = currItem.name.indexOf('Watch') > -1;
                                        currItem.isWarning = currItem.name.indexOf('Warning') > -1;
                                        break;
                                    }

                                    // WARN: Watch for CGs which don't have a source stream
                                }
                            }
                        }
                    }

                    return data;
                }

                return [];
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

        return function(stateParams) {

            var storeName = storePrefix + stateParams.storeName;

            return {
                all: function() {
                    var appdata = window.localStorage[storeName];
                    if (appdata) {
                        return angular.fromJson(appdata);
                    }
                    return [];
                },
                save: function(appdata) {
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
                    timeout: 5000
                };

        return function(options) {
            options.method = options.method || apiDefaults.method;
            options.timeout = options.timeout || apiDefaults.timeout
            return $http(options);
        }
    }());

    // GET SOURCE METADATA FROM SOURCELIST BY NAME (In Route Params)
    rs.getSourceMeta = function(stateParams) {

        // PARAMS
        var arySourceInfo, strSourceName = stateParams.sourceName || stateParams || "";

        // FILTER HERE
        arySourceInfo = $filter('filter')(rs.sourceList, {
            contentGroupIdentifier: strSourceName
        });

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    rs.getSourceList = function() {
        return rs.remoteApi({
            url: 'json/sources.json'
        });
    };

    rs.getSourceIndex = function(stateParams) {

        var localStore, objMetaData, sourceIndexPromise, data;

        objMetaData = rs.getSourceMeta(stateParams);
        localStore = rs.getLocalStore(stateParams);

        if (objMetaData) {

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
        }
    };

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
    } ());

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
                rs.sourceList = d.data;

                // CREATE SOURCE TEMPLATE MAP
                rs.templateMap = (function() {

                    // LOCALS
                    var i = rs.sourceList.length, objReturn = {}, objSrc;

                    // LOOP SOURCES
                    while (i--) {

                        // GET THE CURRENT SOURCE
                        objSrc = rs.sourceList[i];

                        /* MAP TEMPLATES TO CONTENTGROUPIDENTIFIER
                        if (objSrc.templates) {
                            objReturn[objSrc.contentGroupIdentifier] = {};
                            for (key in objSrc.templates) {
                                objReturn[objSrc.contentGroupIdentifier][key] = objSrc.templates[key];
                            }
                        }
                        */
                        objReturn[objSrc.contentGroupIdentifier] = objSrc.templates;
                    }

                    // RETURN MAP
                    return objReturn
                } ());

                //DEBUG
                rs.log('rs.templateMap');
                rs.log(rs.templateMap);

                // RETURN TRIMMED DATA TO CHAIN
                return rs.sourceList;
            });
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

    $ionicConfigProvider.navBar.transition('none'); // keep the navbar from animating

    var sp = $stateProvider;

    sp.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/ui-menu.html',
        controller: 'SourceListCtrl'
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
                templateUrl: 'templates/home.html',
                controller: 'SourceListCtrl'
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

    sp.state('app.civdemo', {
        url: '/civdemo',
        views: {
            'menuContent': {
                templateUrl: 'templates/civ-demo.html'
            }
        }
    });

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

.directive('uiManager', function($rootScope, $stateParams) {
   return {
        restrict: 'E',
        controller: function($scope, $element){

            // CREATE MAIN TEMPALTE HANDLER (COULD USE IONIC FOR TABLE DETECTION, BUT THIS SEEMS MORE UNIVERSAL WITH LESS isThis, isThat CALLS)
            $scope.uiMainTemplateHandler = function () {

                var objReturn = {
                    uiMainContentUrl : 'templates/ui-container-phone.html',
                    viewType : 'phone',
                    viewOrientation : 'portrait'
                };

                console.log('$scope.$stateParams');
                console.log($scope.$stateParams);

                // GET SCREEN SIZE
                if (window.screen.width >= 1024 && window.screen.width > window.screen.height) {
                    objReturn.uiMainContentUrl = 'templates/ui-container-tablet-landscape.html';
                    objReturn.viewType = 'tablet';
                    objReturn.viewOrientation = 'landscape';
                } else if (window.screen.width >= 768 && window.screen.width < window.screen.height) {
                    objReturn.uiMainContentUrl = 'templates/ui-container-tablet-portrait.html';
                    objReturn.viewType = 'tablet';
                    objReturn.viewOrientation = 'portrait';
                }

                // UPDATE SCOPE
                for (var key in objReturn) {
                    $scope[key] = objReturn[key];
                }

                // WAIT FOR ANY DIGEST TO COMPLETE BEFORE APPLYING
                setTimeout(function(){
                    $scope.$apply();
                }, 0);
            };

            // IF DIRECTIVE NOT INITIALIZED
            if (!$scope.uiMainInit) {
                $scope.uiMainInit = true;

                // Add Listener for resize changes
                window.addEventListener("resize", function() {
                    console.log('uiMainTemplateHandler()');
                    $scope.uiMainTemplateHandler();
                }, false);
            }

            // DEBUG
            console.log('UI-MAIN DIRECTIVE $scope');
            console.log($scope);
        },
        link: function(scope, element, attrs) {
           // ON LINK TO APP/DOM - FIRE TEMPLATE HANDLER TO SELECT APPROPRIATE TEMPLATE
           scope.$stateParams = $stateParams;
           scope.uiMainTemplateHandler();
        },
        template: '<div ng-include="uiMainContentUrl"></div>'
   }
})

.directive('uiCard', function($rootScope) {
   return {
        restrict: 'E',
        scope : {
            card : '=',
            sourceId : '='
        },
        template: '<div>{{card}}</div>'
   }
})

.directive('uiDetail', function($rootScope, $timeout, $sce) {
   return {
        restrict: 'E',
        link : function (scope) {
            scope.init();
        },
        controller : (function () {

            var createNoChromeUrl = function (sourceUrl) {
                sourceUrl = sourceUrl || '';
                var filename = sourceUrl.split('/').pop();
                var newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1];
                return sourceUrl.replace(filename, newfilename);
            };

            // HANDLE DIFFERENT TYPES OF CONTENT DETAIL PROCESSING
            var detailProcessors = {
                video : function ($scope) {

                    $scope.detailData = $scope.detailCard;
                    $scope.getVideoUrl = function() {
                        return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.detailData.sourceUrl.split('?v=')[1]);
                    };

                },
                iframe : function ($scope) {
                    console.log('IFRAME DETAIL PROCESSOR');
                    $scope.processer = 'IFRAME';

                    var noChromeUrl = createNoChromeUrl($scope.detailCard.sourceUrl);

                    $scope.detailData = $scope.detailCard;

                    foo = $rootScope.remoteApi({
                        url : 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=' + noChromeUrl
                    });

                    foo.then(function(resp) {
                        if (resp.data.status === '200') {
                            $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
                        } else {
                            $scope.frameUrl = $sce.trustAsResourceUrl(detailCard.sourceUrl);
                        }
                        $rootScope.log($scope.frameUrl, 1, 'IFRAME URL');
                    },
                    function() {
                        $scope.frameUrl = $sce.trustAsResourceUrl($scope.detailCard.sourceUrl);
                        $rootScope.log($scope.frameUrl, 1, 'IFRAME URL FROM ERROR HANDLER');
                    });

                },
                default : function ($scope) {
                    console.log('DEFAULT DETAIL PROCESSOR');
                    console.log($scope);
                    $scope.processer = 'DEFAULT';

                    console.log('$scope.detailCard');
                    console.log($scope.detailCard);

                    $rootScope.remoteApi({
                        url : 'https://prototype.cdc.gov/api/v2/resources/media/' + $scope.detailCard.id + '/syndicate.json'
                    }).then(function(d){
                        $rootScope.log(d, 1, 'RETURNED DETAIL DATA');

                        // NORMALIZE DATA BY SOURCE SPECS
                        $scope.detailData = $rootScope.dataProcessor(d, $scope.sourceMeta);
                    });

                }
            };

            // RETURN ACTUAL CONTROLLER
            return function ($scope) {

                // SET CARD TEMPLATE
                $scope.detailTemplateUrl = 'templates/' + $scope.sourceMeta.templates.detail + '.html';
                $rootScope.log($scope, 2, 'UI-DETAIL-DIRECTIVE-SCOPE');

                // DEFINE INIT METHOD (TO BE FIRED ON LINK)
                $scope.init = function () {

                    // FALL INLINE WITH PROMISE CHAIN (WAIT FOR SOURCE INDEX RESULTS)
                    $scope.sourceIndexPromise.then(function() {

                        // CONTINUE IF DETAIL CARD EXISTS IN SCOPE (AND NOT INITIALIZED ALREADY)
                        if ($scope.detailCard && !$scope.initialized) {

                            // FLAG INIT
                            $scope.initialized = true;

                            // CALL SPECIFIED PROCESSOR
                            detailProcessors[$scope.sourceMeta.detailType].call(this, $scope);

                            // DEBUG
                            $rootScope.log($scope.processer, 2, 'UI-DETAIL-DIRECTIVE-PROCESSER');
                            $rootScope.log($scope.detailTemplateUrl, 2, 'UI-DETAIL-DIRECTIVE-TEMPLATE');
                        }
                    });
                }
            }
        } ()),
        template: '<div ng-include="detailTemplateUrl"></div>'
   }
});
