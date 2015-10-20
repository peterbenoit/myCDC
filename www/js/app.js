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
.run(function($ionicPlatform, $rootScope, $ionicBody, DeviceInfo, ScreenSize, $ionicScrollDelegate, $state, $stateParams) {
    var rs = $rootScope,
        href = window.location.href;

        rs.$state = $state;
        rs.$stateParams = $stateParams;
        rs.HomeCtrlLoad = false;        // for whatever reason, the HomeCtrl controller loads multiple times; setting a flag here, which is modified in the controller, so it only loads once.
        rs.existsUrl = 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=';

    // window.open should use inappbrowser
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        window.open = cordova.InAppBrowser.open;
    }

    // frameready() is called in embed.html, when the iframe has loaded
    // NOTE: this only works on a device
    window.frameready = function() {
        var iframe = $("#contentframe");
            anchors = iframe.contents().find('#contentArea a'); // only anchors in the content area
            //iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument

        // Capture any anchors clicked in the iframe document
        anchors.on('click', function(e) {
            e.preventDefault();

console.log('iframe click');

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

    $ionicPlatform.ready(function() {
        if (window.device) {
            window.open = cordova.InAppBrowser.open;
        }

        // Open any EXTERNAL link with InAppBrowser Plugin
        $(document).on('click', '[href^=http], [href^=https]', function(e) {
            e.preventDefault();

console.log('document click');

            var t = $(this),
                href = t.attr('href');


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

        if (window.plugins && window.plugins.toast) {
            window.plugins.toast.showLongCenter('App Loaded', function(a) {
                console.log('toast success: ' + a);
            }, function(b) {
                console.log('toast error: ' + b);
            });
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
            // lock all devices into portrait mode, except for ipads
            screen.lockOrientation('portrait');
            if (ionic.Platform.isIPad()) {
                // unlocking screen for orientation change
                screen.unlockOrientation();
            }
        }

        // rs.$on('resize', function() {
        //     console.log('rs resize');
        // })

        // angular.element($(window)).bind('resize', _.debounce(function() {
        //     rs.orientation = $('body').hasClass('portrait') ? 'portrait' : 'landscape';
        //     // rs.$broadcast("resize");
        //     // rs.$apply();

        //     // rs.$state.reload();..
        //     //
        //     // window.document.location.reload();

        // }, 150));

        // kick off a media query listener to tag the body with a class
        var mq;
        if (window.matchMedia) {
            mq = window.matchMedia('(orientation: portrait)');

            if (mq.matches) {
                //portrait
                rs.orientation = 'portrait';
                $ionicBody.addClass('portrait');
            }
            else {
                //landscape
                rs.orientation = 'landscape';
                $ionicBody.addClass('landscape');
            }

            mq.addListener(function(m) {
                if (m.matches) {
                    console.log('changed to portrait');
                    rs.orientation = 'portrait';
                    $ionicBody.removeClass('landscape').addClass('portrait');
                }
                else {
                    console.log('changed to landscape');
                    rs.orientation = 'landscape';
                    $ionicBody.removeClass('portrait').addClass('landscape');
                }
            });
        }
    });
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'HomeCtrl'
        // controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/home-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/home-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/home-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/home-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/home-windowsphone.html';
                    }

                    return 'templates/home.html';
                },
                controller: 'HomeCtrl'
            }
        }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })

    .state('app.civdemo', {
        url: '/civdemo',
        views: {
            'menuContent': {
                templateUrl: 'templates/civ-demo.html'
            }
        }
    })


/**
 * Source States
 * Ideally, these would all be dynamic, based off some config file. But I don't know if Angular works that way - yet .
 */
    // *******************************************************************************************
    // Disease of the Week
    // *******************************************************************************************
    .state('app.DOTW', {
        url: '/dotw',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'DotwCtrl'
            }
        }
    })
    .state('app.disease', {
        url: '/disease/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/embed.html',
                controller: 'DiseaseCtrl'
            }
        }
    })
    // *******************************************************************************************
    // FluView Weekly Summary
    // *******************************************************************************************
    .state('app.fluview', {
        url: '/fluview/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/article.html',
                controller: 'FluViewCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Health Articles
    // *******************************************************************************************
    .state('app.healtharticles', {
        url: '/healtharticles',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'HealthArticlesCtrl'
            }
        }
    })
    .state('app.healtharticle', {
        url: '/healtharticle/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/embed.html',
                controller: 'HealthArticleCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Vital Signs
    // *******************************************************************************************
    .state('app.vitalsigns', {
        url: '/vitalsigns',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'VitalSignsCtrl'
            }
        }
    })
    .state('app.vitalsign', {
        url: '/vitalsign/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/article.html',
                controller: 'VitalSignCtrl'
            }
        }
    })
    // *******************************************************************************************
    // CDC Director Blog
    // *******************************************************************************************
    .state('app.cdcdirectorsblog', {
        url: '/cdcdirectorsblog',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'DirectorsBlogsCtrl'
            }
        }
    })
    .state('app.directorblog', {
        url: '/directorblog/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/blog.html',
                controller: 'DirectorsBlogCtrl'
            }
        }
    })
    // *******************************************************************************************
    // CDC Works for You 24/7 Blog - currently unused
    // *******************************************************************************************
    .state('app.247blogs', {
        url: '/247blogs',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'StreamCtrl'
            }
        }
    })
    .state('app.247blog', {
        url: '/247blog/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/blog.html',
                controller: 'BlogCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Public Health Matters Blog
    // *******************************************************************************************
    .state('app.PHMblogs', {
        url: '/PHMblogs',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'PHMblogsCtrl'
            }
        }
    })
    .state('app.PHMblog', {
        url: '/PHMblog/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/blog.html',
                controller: 'PHMblogCtrl'
            }
        }
    })
    // *******************************************************************************************
    // FastStats
    // *******************************************************************************************
    .state('app.FastStats', {
        url: '/FastStats',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'FastStatsCtrl'
            }
        }
    })
    .state('app.FastStat', {
        url: '/FastStat/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/data.html',
                controller: 'FastStatCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Weekly Disease Case Counts
    // *******************************************************************************************
    .state('app.WeeklyDiseaseCaseCounts', {
        url: '/WeeklyDiseaseCaseCounts',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'WeeklyDiseaseCaseCountsCtrl'
            }
        }
    })
    .state('app.WeeklyDiseaseCaseCount', {
        url: '/WeeklyDiseaseCaseCount/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/data.html',
                controller: 'WeeklyDiseaseCaseCountCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Did You Know
    // *******************************************************************************************
    .state('app.DYK', {
        url: '/DYK/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/fact.html',
                controller: 'DYKCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Fact of the Week
    // *******************************************************************************************
    .state('app.FactoftheWeek', {
        url: '/FactoftheWeek',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'FactoftheWeekCtrl'
            }
        }
    })
    .state('app.Fact', {
        url: '/Fact/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/fact.html',
                controller: 'FOTWCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Emerging Infectious Disease (EID)
    // *******************************************************************************************
    .state('app.EIDS', {
        url: '/EIDS',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'EIDsCtrl'
            }
        }
    })
    .state('app.EIDx', {
        url: '/EID/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/journal.html',
                controller: 'EIDCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Morbidity and Mortality Weekly Report (MMWR)
    // *******************************************************************************************
    .state('app.MMWRS', {
        url: '/MMWRS',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'MMWRsCtrl'
            }
        }
    })
    .state('app.MMWR', {
        url: '/MMWR/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/journal.html',
                controller: 'MMWRCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Preventing Chronic Disease (PCD)
    // *******************************************************************************************
    .state('app.PCDS', {
        url: '/PCDS',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'PCDsCtrl'
            }
        }
    })
    .state('app.PCD', {
        url: '/PCD/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/journal.html',
                controller: 'PCDCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Newsroom
    // *******************************************************************************************
    .state('app.Newsrooms', {
        url: '/Newsrooms',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'NewsroomsCtrl'
            }
        }
    })
    .state('app.Newsroom', {
        url: '/Newsroom/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/embed.html',
                controller: 'NewsroomCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Outbreaks
    // *******************************************************************************************
    .state('app.Outbreaks', {
        url: '/Outbreaks',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'OutbreaksCtrl'
            }
        }
    })
    .state('app.Outbreak', {
        url: '/Outbreak/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/embed.html',
                controller: 'OutbreakCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Travel Notices
    // *******************************************************************************************
    .state('app.TravelNotices', {
        url: '/TravelNotices',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'TravelNoticesCtrl'
            }
        }
    })
    .state('app.TravelNotice', {
        url: '/TravelNotice/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/embed.html',
                controller: 'TravelNoticeCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Image Library
    // *******************************************************************************************
    .state('app.PHILs', {
        url: '/PHILs',
        views: {
            'menuContent': {
                templateUrl: 'templates/stream-images.html',
                controller: 'PHILsCtrl'
            }
        }
    })
    .state('app.PHIL', {
        url: '/PHIL/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/image.html',
                controller: 'PHILCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Instagram
    // *******************************************************************************************
    .state('app.Instagrams', {
        url: '/Instagrams',
        views: {
            'menuContent': {
                templateUrl: 'templates/stream-images.html',
                controller: 'InstagramCtrl'
            }
        }
    })
    .state('app.Instagram', {
        url: '/Instagram/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/image.html',
                controller: 'ImageCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Flickr
    // *******************************************************************************************
    .state('app.Flickrs', {
        url: '/Flickrs',
        views: {
            'menuContent': {
                templateUrl: 'templates/stream-images.html',
                controller: 'FlickrCtrl'
            }
        }
    })
    .state('app.Flickr', {
        url: '/Flickr/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/image.html',
                controller: 'ImageCtrl'
            }
        }
    })
    // *******************************************************************************************
    // Podcasts
    // *******************************************************************************************
    .state('app.Podcasts', {
        url: '/Podcasts',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'PodcastsCtrl'
            }
        }
    })
    .state('app.Podcast', {
        url: '/Podcast/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/audio.html',
                controller: 'PodcastCtrl'
            }
        }
    })
    // *******************************************************************************************
    // YouTube
    // *******************************************************************************************
    .state('app.YouTubes', {
        url: '/YouTubes',
        views: {
            'menuContent': {
                templateUrl: function() {
                    if (ionic.Platform.is('androidtablet')) {
                        return 'templates/stream-android-tablet.html';
                    }
                    if (ionic.Platform.isAndroid()) {
                        return 'templates/stream-android.html';
                    }
                    if (ionic.Platform.isIPad()) {
                        return 'templates/stream-ipad.html';
                    }
                    if (ionic.Platform.isIOS()) {
                        return 'templates/stream-ios.html';
                    }
                    if (ionic.Platform.isWindowsPhone()) {
                        return 'templates/stream-windowsphone.html';
                    }

                    return 'templates/stream.html';
                },
                controller: 'YouTubesCtrl'
            }
        }
    })
    .state('app.YouTube', {
        url: '/YouTube/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/video.html',
                controller: 'YouTubeCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
