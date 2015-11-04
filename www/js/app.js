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
.run(function($ionicPlatform, $rootScope, $location, $ionicBody, DeviceInfo, ScreenSize, $ionicScrollDelegate, $state, $stateParams, $cordovaNetwork, $ionicPopup, DataFactory, $http, $filter, $sce) {
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
                console.log(offlineState);
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

    rs.streamTemplate = function (type, orientation) {
        //console.log('streamTemplate');
        //console.log(type);
        return 'templates/' + type + '-' + orientation +'.html';
    };

    rs.cardTemplate = function (type, orientation) {
        //console.log('cardTemplate');
        //console.log(type);
        return 'templates/' + type +'.html';
    };

    rs.detailTemplate = function (type, orientation) {
        //console.log('detailTemplate');
        //console.log(type);
        return 'templates/' + type +'.html';
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

                console.log('Opening ', href);

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
                    console.log('changed to portrait');
                    rs.orientation = 'portrait';
                    $ionicBody.removeClass('landscape').addClass('portrait');
                } else {
                    console.log('changed to landscape');
                    rs.orientation = 'landscape';
                    $ionicBody.removeClass('portrait').addClass('landscape');
                }
                rs.$apply();
            });
        }
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

    rs.dataProcessors = {
        cardTemplateInjector: function (d) {
            var idx1 = d.length, idx2, obj1, obj2, strCg, strCgStripped;
            var tmp = [];

            while (idx1--) {
                obj1 = d[idx1];
                if (obj1.tags && obj1.tags.length) {
                    idx2 = obj1.tags.length;
                    while (idx2--) {
                        obj2 = obj1.tags[idx2];
                        if (obj2.type.toLowerCase() == 'contentgroup') {
                            strCg = obj2.name;
                            strCgStripped = rs.cgNormalize(strCg);

                            obj1.contentGroupIdentifier = strCg;
                            obj1.appContentGroup = strCgStripped;
                            obj1.templates = rs.templateMap[strCgStripped];



                            if (tmp.indexOf(strCgStripped) == -1) {
                                tmp.push(strCgStripped);
                            }
                        }
                    }
                }
            }

            console.log('Unique Content Groups Found');
            console.log(tmp);

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
                                currItem.ContentGroup = tags[k].name;
                                currItem.appContentGroup = rs.cgNormalize(tags[k].name);
                                currItem.home = '#/app/source/' + currItem.appContentGroup;
                                currItem.url = currItem.home + '/';

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
            var currItem, data = d.data.results;

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
            if (d.data && d.data.results && d.data.results.length) {
                return d.data.results[0];
            }

            return null;
        },
        defaultHandler: function() {
            return [];
        }
    };

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

                var processor;

                data = (d.data && d.data.results) ? d.data.results : [];
                console.log(data);

                // DID WE GET DATA?
                if (data.length > 0) {

                    // PROCESS DATA (IF NEEDED)
                    if (objMetaData.processors && objMetaData.processors.length) {

                        // REVERSE ARRA SINCE FOR REVERSE LOOP
                        objMetaData.processors.reverse();

                        // REVERSE LOOP THROUGH PROCESSORS
                        for (var i = objMetaData.processors.length - 1; i >= 0; i--) {
                            processor = objMetaData.processors[i];
                            data = rs.dataProcessors[processor].call(this, data);
                        };
                    }

                    //SAVE IT TO LOCAL
                    localStore.save(data);

                    // SAVE IT TO RS
                    rs.sourceIndex = data;
                }

                //RETURN IT IN THE PROMISE CHAIN
                return data;
            }, function(e) {

                // ON ERROR, RETURN WHAT WE HAVE IN LOCAL STORAGE
                return localStore.all();
            });

            return sourceIndexPromise;
        }
    };

    rs.getSourceDetailUrl = function(stateParams) {
        var aryCardData, objCardData, sourceDetailPromise, data;

        objMetaData = rs.getSourceMeta(stateParams);
        aryCardData = $filter('filter')(rs.sourceIndex, {
            id : stateParams.sourceDetail
        });

        objCardData = (aryCardData.length) ? aryCardData[0] : false;

        console.log('objCardData');
        console.log(objCardData);

        if (objCardData) {
            return {
                url : $sce.trustAsResourceUrl(objCardData.sourceUrl),
                nochromeurl : $sce.trustAsResourceUrl(rs.getNoChromeUrl(objCardData.sourceUrl))
            }
        };

        return false;
    };

    rs.getNoChromeUrl = function(url) {
        var sourceurl = url,
            filename = sourceurl.split('/').pop(),
            newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
            nochromeurl = sourceurl.replace(filename, newfilename);

        return nochromeurl;
    };

    rs.appInit = function(blnRefresh) {

        // REFRESH REQUESTED?
        if (blnRefresh || !rs.sourceListPromise || false) {

            // DEBUG
            console.log('appInit Refresh');

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
                console.log('rs.templateMap');
                console.log(rs.templateMap);

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

    // TODO: consider using this for "lower" end devices
    // $ionicConfigProvider.views.transition('none');      // keep the views from animating

    /* STANDARD TEMPLATE HANDLER
    var defaultTemplateHandler = function(strMode, strPrefix, strPath) {

        strMode = strMode || 'static';
        strPrefix = strPrefix || 'stream';
        strPath = strPath || 'templates/';
        var strReturn;

        // DYNAMIC HANDLER (MULTIPLE TEMPLATES BASED ON OS & ORIENTATION)
        if (strMode === 'dynamic') {

            // RETURN HANDLER METHOD
            if (ionic.Platform.is('androidtablet')) {
                strReturn = strPath + strPrefix + '-tablet.html';
            }
            if (ionic.Platform.isAndroid()) {
                strReturn = strPath + strPrefix + '.html';
            }
            if (ionic.Platform.isIPad()) {
                strReturn = strPath + strPrefix + '-tablet.html';
            }
            if (ionic.Platform.isIOS()) {
                strReturn = strPath + strPrefix + '.html';
            }
            if (ionic.Platform.isWindowsPhone()) {
                strReturn = strPath + strPrefix + '.html';
            }

        } else {

            // STATIC MODE (strMode becomes the path and file name of template to be used)
            // RETURN FILE PATH & NAME
            strReturn = strMode
        }

        console.log('Derived Template is ' + strReturn);

        return strReturn;
    };
    */

    /* PARAMETERIZED IIFE FOR TEMPLATE SELECTION BY STATE PARAMS
    var stateTemplateHandler = (function(fctDefaultHandler) {

        var defaultHandler = fctDefaultHandler;

        return function($stateParams) {

            var strMode, strPrefix,
                sourceIndexMode = "dynamic",
                sourceIndexPrefix = "stream",
                sourceDetailMode = "static",
                sourceDetailPrefix = "templates/article.html";

            switch ($stateParams.sourceName.toLowerCase()) {

                // FACT SHEETS
                case 'dyk':
                case 'factoftheweek':
                    sourceDetailMode = "static";
                    sourceDetailMode = "templates/fact.html";
                    break;

                    // EMBEDS
                case 'dotw':
                case 'healtharticles':
                case 'newsrooms':
                case 'outbreaks':
                case 'travelnotices':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/embed.html";
                    break;

                    // BLOGS
                case 'cdcdirectorsblog':
                //case '247blogs':
                case 'phmblogs':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/blog.html";
                    break;

                    // DATA SHEETS
                case 'faststats':
                case 'weeklydiseasecasecounts':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/data.html";
                    break;

                    // JOURNALS
                case 'eids':
                case 'mmwr':
                case 'pcds':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/journal.html";
                    break;

                    // IMAGES
                case 'phils':
                case 'flickrs':
                    sourceIndexMode = "static",
                        sourceIndexPrefix = "stream-images",
                        sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/journal.html";
                    break;

                    // PODCASTS
                case 'podcasts':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/audio.html";
                    break;

                    // YOUTUBE
                case 'youtube':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/video.html";
                    break;

                    // FACEBOOK
                case 'facebook':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/landing-facebook.html";
                    break;

                    // TWITTER
                case 'twitter':
                    sourceDetailMode = "static";
                    sourceDetailPrefix = "templates/landing-twitter.html";
                    break;

                    // ARTICLES
                default:
                    // cdcatws, vitalsigns, fluview
                    break;
            }

            if ($stateParams.sourceDetail || false) {
                strMode = sourceDetailMode;
                strPrefix = sourceDetailPrefix;
            } else {
                strMode = sourceIndexMode;
                strPrefix = sourceIndexPrefix;
            }

            console.log('$stateParams from stateTemplateHandler');
            console.log($stateParams);
            console.log('strMode from stateTemplateHandler');
            console.log(strMode);
            console.log('strPrefix from stateTemplateHandler');
            console.log(strPrefix);
            console.log(defaultHandler(strMode, strPrefix));

            return defaultHandler(strMode, strPrefix);
        }
    }(defaultTemplateHandler));
    */

    var sp = $stateProvider;

    sp.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
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
        scope : '*',
        controller: function($scope, $element){

            // CREATE MAIN TEMPALTE HANDLER (COULD USE IONIC FOR TABLE DETECTION, BUT THIS SEEMS MORE UNIVERSAL WITH LESS isThis, isThat CALLS)
            $scope.uiMainTemplateHandler = function () {

                // GET SCREEN SIZE
                if (window.screen.width >= 1024 && window.screen.width > window.screen.height) {
                    $scope.uiMainContentUrl = 'templates/ui-container-tablet-landscape.html';
                    $scope.viewType = 'tablet';
                    $scope.viewOrientation = 'landscape';
                } else if (window.screen.width >= 768 && window.screen.width < window.screen.height) {
                    $scope.uiMainContentUrl = 'templates/ui-container-tablet-portrait.html';
                    $scope.viewType = 'tablet';
                    $scope.viewOrientation = 'portrait';
                } else {
                    $scope.uiMainContentUrl = 'templates/ui-container-phone.html';
                    $scope.viewType = 'phone';
                    $scope.viewOrientation = 'portrait';
                }
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

.directive('uiContentCard', function($rootScope) {
   return {
        restrict: 'E',
        scope : {
            card : '=',
            sourceId : '='
        },
        template: '<div>{{card}}</div>'
   }
});


