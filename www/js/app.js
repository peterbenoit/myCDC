/**
 *  myCDC
 *  TODO: info.plist NSAppTransportSecurity key needs to be corrected before deployment
 */
angular.module('mycdc', [
    'ionic',
    'ngSanitize',
    'mycdc.controllers',
    'mycdc.directives',
    'mycdc.filters',
    'mycdc.services',
    'ngCordova',
    'ngAnimate',
    'angular.filter',
    'ngIOS9UIWebViewPatch'
])

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.run(function($ionicPlatform, $cordovaStatusbar, $rootScope, $location, $ionicBody, $timeout, $window, Device, iFrameReady, DataSourceInterface, AppUtil, Globals, $state, $stateParams, $cordovaNetwork, $ionicPopup, $http, $filter, $sce, $q) {

    var rs = $rootScope,
        href = window.location.href,
        dataProcessor,
        appInitialized;

    // APP CONTAINER
    rs.app = {};
    rs.detailUrl = 'https://tools.cdc.gov/api/v2/resources/media/';
    rs.remoteCheck = 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=';
    rs.sourcesUrl = 'json/sources.json';

    // WINDOW.OPEN SHOULD USE INAPPBROWSER
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {

        //window.open = cordova.InAppBrowser.open;

        // BROWSER STATE DEFAULTS
        rs.type = $cordovaNetwork.getNetwork();
        rs.isOnline = $cordovaNetwork.isOnline();
        rs.stateClasses = {};

        // LISTEN FOR ONLINE EVENT
        rs.$on('$cordovaNetwork:online', function(event, networkState) {
            // WERE WE PREVIOUSLY ONLINE?
            if (!rs.isOnline) {

                // NO, UPDATE TO OFFLINE
                rs.isOnline = true;
            }
        });

        // LISTEN FOR OFFLINE EVENT
        rs.$on('$cordovaNetwork:offline', function(event, networkState) {

            // WERE WE PREVIOUSLY ONLINE?
            if (rs.isOnline) {

                // NO, UPDATE TO OFFLINE
                rs.isOnline = false;

                // ALERT USER WE HAVE GONE OFFLINE
                $ionicPopup.alert({
                    title: 'No Connection',
                    template: 'You do not appear to be connected to the Internet. Some content you have downloaded may be out of date.'
                });
            }
        });

        navigator.globalization.getPreferredLanguage(function (langPref) {
            rs.lang = langPref;
            alert(rs.lang);
        }, console.log);

        //$cordovaStatusbar.hide();
        //$ionicPlatform.fullScreen();

        ionic.Platform.fullScreen();
        if (window.StatusBar) {
            return StatusBar.hide();
        }
    }

    // NOTE: THIS ONLY WORKS ON A DEVICE
    // frameready() is called in embed.html, when the iframe has loaded
    window.frameready = iFrameReady;
    // MOVED TO service.js AS iFrameReady - ONCE TESTED ON DEVICES, WE WILL REMOVE THIS COMMENT
    // window.frameready = function() {
    //     var iframe = $('#contentframe');
    //         anchors = iframe.contents().find('#contentArea a'); // only anchors in the content area

    //         //iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument

    //     $rootScope.$broadcast('source-detail-load-complete');

    //     // I RECENTLY COMMENTED THIS OUT AS IT WAS BREAKING THE APP (NOT JUST IFRAME CONTENT)
    //     if (window.device) {
    //       //body = iframe.contents().find('body');
    //       //$(body).unbind("scroll");
    //       //$(body).unbind("click");
    //     }
    //     /*if (body.length) {
    //         body.append('<style>header, footer, #socialMediaShareContainer { display:none !important; }</style>')
    //     }*/

    //     // Capture any anchors clicked in the iframe document
    //     anchors.on('click', function(e) {
    //         e.preventDefault();

    //         //alert('CLICK');

    //         var framesrc = iframe.attr('src'),
    //             href = $(this).attr('href'),
    //             anchor = document.createElement('a');
    //             anchor.href = href;
    //         var anchorhost = anchor.hostname;

    //         // create an anchor with the href set to the iframe src to fetch the domain & protocol
    //         // WARN: cannot assume "http" || "www.cdc.gov"
    //         var frameanchor = document.createElement('a');
    //             frameanchor.href = framesrc;
    //         var framehost = frameanchor.hostname,
    //             frameprotocol = frameanchor.protocol;

    //         // if this anchor doesn't have a hostname
    //         if (anchorhost === '') {
    //             href = frameprotocol + '//' + framehost + href;
    //         }

    //         window.open(href, '_system');
    //     });
    // };

    rs.log = AppUtil.log;

    // rs.$viewHistory = {
    //     histories: { root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 } },
    //     backView: null,
    //     forwardView: null,
    //     currentView: null,
    //     disabledRegistrableTagNames: []
    // };

    $ionicPlatform.ready(function() {
        if (window.device) {
            window.open = cordova.InAppBrowser.open;
        }

        // Open any EXTERNAL link with InAppBrowser Plugin
        $(document).on('click', '[href^=http], [href^=https]', function(e) {
            e.preventDefault();

            var t = $(this),
                href = t.attr('href');

            AppUtil.log('Opening ', href);

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
    });

    // TODO: Neither of these methods work in scope anymore, and I don't know why!
    rs.viewOnCDC = function() {
        alert('THIS NEEDS WIRED UP');
        // window.open($scope.data.sourceUrl, '_system');
    };

    rs.shareData = function() {
        alert('THIS NEEDS WIRED UP');
    };



    rs.getSourceCard = function(sourceDetailId) {

        var arySourceInfo = [];

        // GET OR DEFAULT SOURCE DETAIL ID
        sourceDetailId = Globals.get('appState').sourceDetail || "";

        var sourceIndex = Globals.get('sourceIndex');

        if (!sourceDetailId) {
            if (sourceIndex.length) {
                arySourceInfo = [sourceIndex[0]];
            }
        } else {
            // FILTER HERE
            arySourceInfo = $filter('filter')(sourceIndex, {
                id: sourceDetailId
            }) || [];
        }

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // THIS FLAGS THE CURRENT CARD AS ACTIVE
            // DOING SO MAKES IT THE FIRST IN THE SCROLLER LIST
            arySourceInfo[0].isCurrent = 1;

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    // rs.backButtonDisplay = function (appState) {

    //     appState = appState || AppUtil.getAppState();

    //     var objReturn = {
    //         icon : 'ion-chevron-left',
    //         text : 'Home'
    //     };

    //     if ($stateParams.sourceName != 'homestream') {
    //         if (rs.aryHistory.length > 0) {

    //             // GET THIS STATE
    //             var objThisState = {
    //                 sourceName : $stateParams.sourceName || false ,
    //                 sourceDetail : appState.sourceDetail || false
    //             };

    //             // GET THE LAST STATE IN HISTORY
    //             var objLastState = rs.aryHistory[rs.aryHistory.length - 1] || {};

    //             // ARE THEY THE SAME?
    //             if (objLastState.sourceName == objThisState.sourceName && objLastState.sourceDetail == objThisState.sourceDetail) {

    //                 // YES, GO BACK ONE MORE
    //                 objLastState = rs.aryHistory[rs.aryHistory.length - 2] || {};
    //             }

    //             if (objLastState.hasOwnProperty('sourceName')) {
    //                 if (objLastState.sourceName == 'homestream') {
    //                     objReturn.icon = 'ion-chevron-left';
    //                     objReturn.text = 'Home';
    //                 } else {
    //                     objReturn.icon = 'ion-chevron-left';
    //                     objReturn.text = 'Back';
    //                 }
    //             }
    //         }
    //     }
    //     return objReturn;
    // };

    rs.goHome = function() {
        $state.go('app.sourceIndex', { sourceName: 'homestream' });
    };

    // APP INIT
    rs.appInit = function(blnRefresh) {

        var defer = $q.defer();

        // REFRESH REQUESTED?
        if (blnRefresh || !appInitialized || false) {

            // GET & SAVE THE SOURCE LIST PROMISE
            var sourceListPromise = AppUtil.remoteApi({
                url: rs.sourcesUrl
            });

            // CONTINUE PROMISE CHAIN
            sourceListPromise.then(function(d) {

                var objApp = {
                    // SET SOURCE TYPES
                    sourceTypes: d.data.sourceTypes,
                    // SET SOURCE LIST
                    sourceList: d.data.sourceList,
                    // Language Specific Labels (Enclosed in the sources json file)
                    langLabels : d.data.langLabels,
                    // DEFAULT EMPTY OBJECTS
                    templateMap: {},
                    sourceMetaMap: {},
                    sourceFilters: {},
                    sourceFilterLocks: {}
                };

                window.objApp = objApp;
                console.warn('objApp is available as window.objApp for ease of development only... DO NOT REFERENCE AS window.objApp IN CODE')

                // LOCALS
                var i = objApp.sourceList.length,
                    objReturn = {},
                    objSrc;

                // LOOP SOURCES
                while (i--) {

                    // GET THE CURRENT SOURCE
                    objSrc = objApp.sourceList[i];

                    // MAP TEMPLATES TO feedIDENTIFIER
                    objApp.templateMap[objSrc.feedIdentifier] = objSrc.templates;

                    // MAP TEMPLATES TO feedIDENTIFIER
                    objApp.sourceMetaMap[objSrc.feedIdentifier] = objSrc;

                    // MAP SOURCE FILTER DEFAULTS (LOCAL STORAGE WILL BE MERGED AND OVERRIDE THESE)
                    if (!objApp.sourceFilters.hasOwnProperty(objSrc.typeIdentifier)) {
                        // DEFAULT FEEDTYPE CONTAINER
                        objApp.sourceFilters[objSrc.typeIdentifier] = {};
                    }
                    // FEEDTYPE > FEEDID > FEEDSETTINGS (FROM SOURCES.JSON)
                    objApp.sourceFilters[objSrc.typeIdentifier][objSrc.feedIdentifier] = {
                        isEnabled: objSrc.showByDefault
                    };
                    // MAP SOURCE FILTER DEFAULTS (LOCAL STORAGE WILL BE MERGED AND OVERRIDE THESE)
                    if (!objApp.sourceFilterLocks.hasOwnProperty(objSrc.typeIdentifier)) {
                        // DEFAULT FEEDTYPE CONTAINER
                        objApp.sourceFilterLocks[objSrc.typeIdentifier] = {};
                    }
                    objApp.sourceFilterLocks[objSrc.typeIdentifier][objSrc.feedIdentifier] = {
                        filterLocked: objSrc.filterLocked
                    };
                }

                // TRY TO GET LOCAL SETTINGS OVERRIDES
                var localFilters = AppUtil.getSimpleLocalStore('settings').get() || {};

                // IF WE FOUND LOCAL SETTINGS, MERGE THEM IN
                if (localFilters) {
                    objApp.sourceFilters = angular.extend(objApp.sourceFilters, localFilters);
                }

                // SAVE APPLICATION DATA TO GLOBALS
                Globals.set('applicationData', angular.copy(objApp));

                // SET DEFAULT APP STATE TO GLOBALS
                Globals.set('appState', {
                    sourceName : 'homestream',
                    sourceDetail : ''
                });

                // GO TO THE HOME STREAM ON LOAD / RELOAD
                $state.go('app.sourceIndex', {
                    sourceName : 'homestream',
                    sourceDetail : ''
                })

                // LOCALIZE THE DATA PROCESSOR (MAYBE REMOVE POINTER & ACCESS DIRECTLY IF NOT NEEDED LATER?)
                dataProcessor = DataSourceInterface.dataProcessor;

                // FLAG APP AS INITIALIZED
                appInitialized = true;

                // RESOLVE PROMISE WITH THE NEW DATA
                defer.resolve(objApp);
            });

        } else {

            // RESOLVE PROMISE WITH THE NEW DATA
            defer.resolve(rs.app);

        }

        // RETURN THE SOURCE LIST PROMISE
        return defer.promise;
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

    // http://forum.ionicframework.com/t/scrolling-lags-significantly-on-android/28727/2
    if (!ionic.Platform.isIOS()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }

    var sp = $stateProvider;

    sp.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/ui-master.html',
        controller: 'AppCtrl as global'
    });

    sp.state('app.settings', {
        url: '/settings',
        views: {
            'appContent': {
                templateUrl: 'templates/page-settings.html',
                controller: 'SettingsCtrl as settings'
            }
        }
    });

    sp.state('app.sources', {
        url: '/sources',
        views: {
            'appContent': {
                templateUrl: 'templates/page-source-navigation-menu.html',
                controller: 'SourceListCtrl as sources'
            }
        }
    });

    sp.state('app.sourceIndex', {
        url: '/source/:sourceName',
        views: {
            'appContent': {
                templateUrl: 'templates/page-source-index-and-detail.html',
                controller: 'CommonSourceCtrl as common'
            }
        }
    });

    sp.state('app.sourceDetail', {
        url: '/source/:sourceName/:sourceDetail',
        views: {
            'appContent': {
                templateUrl: 'templates/page-source-index-and-detail.html',
                controller: 'CommonSourceCtrl as common'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/source/homestream');
});
