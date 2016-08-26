/**
 *  myCDC
 *  TODO: info.plist NSAppTransportSecurity key needs to be corrected before deployment
 */
angular.module('mycdc', [
    'ngCordova',
    'ionic',
    'ngSanitize',
    'mycdc.controllers',
    'mycdc.directives',
    'mycdc.filters',
    'mycdc.services',
    'ngAnimate',
    'angular.filter',
    'ngIOS9UIWebViewPatch'
])

.constant('appConfiguration', {
    loaderTimeout : 8000
})

.constant('$ionicLoadingConfig', {
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0,
    template : '<cdc-loader></cdc-loader>',
    duration : 8000
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
 .run(function(appConfiguration, $cordovaNetwork, $cordovaStatusbar, $cordovaGlobalization, $ionicPlatform, $ionicPopup, $state, $rootScope, $filter, $q, Device, iFrameReady, DataSourceInterface, AppUtil, Globals, Share, ImageRatioClasses) {

    var rs = $rootScope,
        href = window.location.href,
        dataProcessor,
        appInitialized;

    // APP CONTAINER
    rs.app = {};
    rs.detailUrl = 'https://tools.cdc.gov/api/v2/resources/media/';
    //rs.detailUrl = 'https://prototype.cdc.gov/api/v2/resources/media/';
    rs.remoteCheck = 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=';
    rs.sourcesUrl = 'json/en/online/sources.json';
    rs.deviceInfo = Device.Info();
    rs.Share = Share;
    rs.supportedLanguages = ['en','es'];
    rs.deferredLangValue = (function () {
        var defer = $q.defer();
        return defer;
    } ());
    rs.deferredOnlineStatus = (function () {
        var defer = $q.defer();
        return defer;
    } ());

    // WINDOW.OPEN SHOULD USE INAPPBROWSER
    document.addEventListener("deviceready", hideStatusBar, false);
    document.addEventListener("deviceready", getLangPreference, false);
    document.addEventListener("deviceready", setNetworkListeners, false);
    document.addEventListener("deviceready", initPushwoosh, false);

    function setNetworkListeners() {
        //console.log('Executing setNetworkListeners');
        // BROWSER STATE DEFAULTS
        rs.type = $cordovaNetwork.getNetwork();
        rs.isOnline = $cordovaNetwork.isOnline();
        rs.stateClasses = {};

        var deregisterOnlineListener, deregisterOfflineListener;

        // LISTEN FOR ONLINE EVENT
        deregisterOnlineListener = rs.$on('$cordovaNetwork:online', function(event, networkState) {
            // WERE WE PREVIOUSLY ONLINE?
            if (!rs.isOnline) {

                // NO, UPDATE TO OFFLINE
                rs.isOnline = true;
            }
        });

        // LISTEN FOR OFFLINE EVENT
        deregisterOfflineListener = rs.$on('$cordovaNetwork:offline', function(event, networkState) {

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

        rs.$on('$destroy', function() {
            deregisterOnlineListener();
            deregisterOfflineListener();
        });

        rs.deferredOnlineStatus.resolve(true);
    }

    function setLangPref (langCode) {
        // SET PASSED LANG CODE
        AppUtil.getSimpleLocalStore('langPref').set(langCode);
        // RETURN PASSED VALUE FOR SIMPLICITY
        return langCode;
    }

    function getLangPreference() {
        //console.log('Executing getLangPreference');

        // GET LOCAL STORAGE OBJECT FOR LANGUAGE
        var objLangStore = AppUtil.getSimpleLocalStore('langPref');

        // RETURN CURRENT VALUE
        rs.lang = objLangStore.get();

        // IF NULL - GET DEFAULT FROM DEVICE
        if (!rs.lang) {
            navigator.globalization.getPreferredLanguage(function (langPref) {

                // SET LANG TO LOCAL STORAGE & ROOTSCOPE
                rs.lang = setLangPref(langPref.value.split('-')[0]);
            }, console.log /* LOG ERROR ON FAIL */);
        }

        rs.deferredLangValue.resolve(true);
    }

    function hideStatusBar() {
        //console.log('Executing hideStatusBar');
        ionic.Platform.fullScreen();
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
            return StatusBar.hide();
        }
    }

    function initPushwoosh() {
        app.receivedEvent('deviceready');

        var pushwoosh = cordova.require("pushwoosh-cordova-plugin.PushNotification");

        // Should be called before pushwoosh.onDeviceReady
        document.addEventListener('push-notification', function(event) {
            var notification = event.notification;
            // handle push open here
        });

        // Initialize Pushwoosh. This will trigger all pending push notifications on start.
        pushwoosh.onDeviceReady({
            appid: "PUSHWOOSH_APP_ID",
            projectid: "GOOGLE_PROJECT_NUMBER",
            serviceName: "MPNS_SERVICE_NAME"
        });
    }

    $ionicPlatform.ready(function () {

        if(!rs.deviceInfo.isRealMobileDevice()) {
            rs.isOnline = true;
            rs.lang = 'en';
            rs.deferredOnlineStatus.resolve(true);
            rs.deferredLangValue.resolve(true);
        }
        // NOTE: THIS ONLY WORKS ON A DEVICE
        // frameready() is called in embed.html, when the iframe has loaded
        window.frameready = iFrameReady;
    });

    rs.log = AppUtil.log;
    rs.openLink = AppUtil.openLink;

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

    rs.goHome = function() {
            $state.go('app.sourceIndex', { sourceName: rs.homeStream });
    };

    // APP INIT
    rs.appInit = function(blnRefresh) {

        var defer = $q.defer();

        $ionicPlatform.ready(function () {

            // REFRESH REQUESTED?
            if (blnRefresh || !appInitialized || false) {

                rs.deferredOnlineStatus.promise.then(function() {
                    rs.deferredLangValue.promise.then(function() {
                        console.log("rs.lang: " + rs.lang + '\n' + "rs.isOnline: " + rs.isOnline);

                        var sourcesUrl, nwsFolder, sourceListPromise;
                        nwsFolder = (rs.isOnline) ? 'online' : 'offline';
                        sourcesUrl = 'json/' + rs.lang + '/' + nwsFolder + '/sources.json';
                        // GET & SAVE THE SOURCE LIST PROMISE
                            sourceListPromise = AppUtil.remoteApi({
                                url: sourcesUrl
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

                            //window.objApp = objApp;
                            //console.warn('objApp is available as window.objApp for ease of development only... DO NOT REFERENCE AS window.objApp IN CODE')

                            // LOCALS
                            var i = objApp.sourceList.length,
                                objReturn = {},
                                objSrc;

                            // LOOP SOURCES
                            while (i--) {

                                // GET THE CURRENT SOURCE
                                objSrc = objApp.sourceList[i];
                                    // CAPTURE HOMESTREAM IDENTIFIER
                                    if (objSrc.isHomeFeed) {
                                        rs.homeStream = objSrc.feedIdentifier;
                                    }

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
                                    sourceName : rs.homeStream
                            });

                            // GO TO THE HOME STREAM ON LOAD / RELOAD
                            $state.go('app.sourceIndex', {
                                    sourceName : rs.homeStream
                            })

                            ImageRatioClasses();

                            // LOCALIZE THE DATA PROCESSOR (MAYBE REMOVE POINTER & ACCESS DIRECTLY IF NOT NEEDED LATER?)
                            dataProcessor = DataSourceInterface.dataProcessor;

                            // FLAG APP AS INITIALIZED
                            appInitialized = true;

                            // RESOLVE PROMISE
                            defer.resolve(true);
                        });


                    })
                })

            } else {

                    // RESOLVE PROMISE
                    defer.resolve(true);

            }

        });

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

    $ionicConfigProvider.navBar.transition('none'); // keep the navbar from animating
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.views.transition('fade');
    $ionicConfigProvider.views.swipeBackEnabled(false);

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
    $urlRouterProvider.otherwise('/app/source/default');
});
