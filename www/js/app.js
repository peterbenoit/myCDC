/**
 *  myCDC
 */
angular.module('mycdc', [
    'ionic',
    'mycdc.controllers',
    'mycdc.data',
    'mycdc.directives',
    'mycdc.filters',
    'mycdc.services',
    'mycdc.storage',
    'ngCordova'
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
.run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
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
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
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
                templateUrl: 'templates/stream.html',
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
    .state('app.fluviews', {
        url: '/fluviews',
        views: {
            'menuContent': {
                templateUrl: 'templates/stream.html',
                controller: 'FluViewsCtrl'
            }
        }
    })
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
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
                controller: 'DirectorsBlogCtrl'
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
    // CDC Works for You 24/7 Blog
    // *******************************************************************************************
    .state('app.247blogs', {
        url: '/247blogs',
        views: {
            'menuContent': {
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
                controller: 'StreamCtrl'
            }
        }
    })
    .state('app.PHMblog', {
        url: '/PHMblog/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/blog.html',
                controller: 'BlogCtrl'
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
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
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
    .state('app.DidYouKnow', {
        url: '/DidYouKnow',
        views: {
            'menuContent': {
                templateUrl: 'templates/stream.html',
                controller: 'DidYouKnowCtrl'
            }
        }
    })
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
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
                controller: 'MMWRsCtrl'
            }
        }
    })
    .state('app.MMWR', {
        url: '/MMWR/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/journal.html',
                controller: 'JournalCtrl'
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
                templateUrl: 'templates/stream.html',
                controller: 'PCDsCtrl'
            }
        }
    })
    .state('app.PCD', {
        url: '/PCD/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/journal.html',
                controller: 'JournalCtrl'
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
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
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
                templateUrl: 'templates/stream.html',
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
    .state('app.ImageLibrarys', {
        url: '/ImageLibrarys',
        views: {
            'menuContent': {
                templateUrl: 'templates/images.html',
                controller: 'ImageLibrarysCtrl'
            }
        }
    })
    .state('app.ImageLibrary', {
        url: '/ImageLibrary/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/image.html',
                controller: 'ImageCtrl'
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
                templateUrl: 'templates/images.html',
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
                templateUrl: 'templates/images.html',
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
                templateUrl: 'templates/audios.html',
                controller: 'PodcastsCtrl'
            }
        }
    })
    .state('app.Podcast', {
        url: '/Podcast/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/audio.html',
                controller: 'AudioCtrl'
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
                templateUrl: 'templates/videos.html',
                controller: 'YouTubeCtrl'
            }
        }
    })
    .state('app.YouTube', {
        url: '/YouTube/:idx',
        views: {
            'menuContent': {
                templateUrl: 'templates/video.html',
                controller: 'VideoCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
