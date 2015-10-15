/**
 *
 */
angular.module('mycdc.controllers', [])

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('AppCtrl', function($scope, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
})
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('SettingsCtrl', function($scope, SettingsStorage) {

    $scope.settings = SettingsStorage.all();

    //console.log(SettingsStorage.all());

    $scope.saveSettings = function() {
        SettingsStorage.save($scope.settings);
    };

    $scope.$watch('settings', function() {
        SettingsStorage.save($scope.settings);
    }, true);

    $scope.resetSettings = function() {
        SettingsStorage.clear();
        $scope.settings = SettingsStorage.all();
    };
})

// TODO: most of this can be reduced to a single controller with params

/**
 * Home Controller
 * @param  {[type]}
 * @return {[type]}
 */
.controller('HomeCtrl', function($scope, MenuData, $ionicPlatform, $timeout, $rootScope, $ionicPopover, $ionicHistory, returnToState) {
    $scope.menu = [];
    $scope.storage = '';

    $scope.goBack = function() {
        var sn = $ionicHistory.currentView().stateName;

        if (sn === 'app.YouTube' || sn === 'app.PHIL' || sn === 'app.Podcast') {
            // returnToState('app.home');

            // source streams are always the statename + s
            returnToState(sn +  's');
        }
        else {
            $ionicHistory.goBack();
        }
    }



    // This little bit of nonsense checks for the existance of the runonce localstorage key and if the Home Controller has already loaded (it loads 2x for some reason)
    // If they key doesn't exist, and the Home Controller hasn't already loaded, load the modal
    $ionicPlatform.ready(function() {
        var runonce = window.localStorage.getItem('runonce');

        if (runonce === null && $rootScope.HomeCtrlLoad === false) {
            $rootScope.HomeCtrlLoad = true;

            $ionicPopover.fromTemplateUrl('templates/popover.html', {
                scope: $scope,
            }).then(function(popover) {
                $scope.popover = popover;
                var element = document.getElementById('navicon');
                popover.show(element);
            });

            // $ionicModal.fromTemplateUrl('templates/modal.html', {
            //     scope: $scope
            // }).then(function(modal) {
            //     $scope.modal = modal;
            //     $scope.modal.show();

            //     window.localStorage['runonce'] = true;
            // });
            //
        }
    });

    MenuData.async().then(
        function() {
            $scope.menu = MenuData.getAll();
            $scope.$broadcast('scroll.refreshComplete');
        },
        function() {
            $scope.menu = MenuStorage.all();
            $scope.storage = 'Data from local storage';
            $scope.$broadcast('scroll.refreshComplete');
        },
        function() {}
    );

    // app sources, should be maintained by config.json
    $scope.sources = [
    {
        title: 'CDC Around the World',
        href: '#/app/cdcatw',
        icon: 'ion-close-circled'
    }, {
        title: 'Disease of the Week',
        href: '#/app/dotw',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'FluView Weekly Summary',
        href: '#/app/fluviews',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Health Articles',
        href: '#/app/healtharticles',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Vital Signs',
        href: '#/app/vitalsigns',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'CDC Director Blog',
        href: '#/app/cdcdirectorsblog',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Public Health Matters Blog',
        href: '#/app/PHMblogs',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'FastStats',
        href: '#/app/FastStats',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Weekly Disease Case Counts (No data)',
        href: '#/app/WeeklyDiseaseCaseCounts',
        icon: 'ion-close-circled'
    }, {
        title: 'Did You Know?',
        href: '#/app/DidYouKnow',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Fact of the Week (Bad data)',
        href: '#/app/FactoftheWeek',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Emerging Infectious Disease (EID)',
        href: '#/app/EIDS',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Morbidity and Mortality Weekly Report (MMWR)',
        href: '#/app/MMWRS',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Preventing Chronic Disease (PCD)',
        href: '#/app/PCDS',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Newsroom',
        href: '#/app/Newsrooms',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Outbreaks',
        href: '#/app/Outbreaks',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Travel Notices',
        href: '#/app/TravelNotices',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Image Library',
        href: '#/app/PHILs',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'Instagram',
        href: '#/app/Instagrams',
        icon: 'ion-close-circled'
    }, {
        title: 'Flickr',
        href: '#/app/Flickrs',
        icon: 'ion-close-circled'
    }, {
        title: 'Podcasts',
        href: '#/app/Podcasts',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'YouTube',
        href: '#/app/YouTubes',
        icon: 'ion-checkmark-circled'
    }, {
        title: 'CIV Demo Page',
        href: '#/app/civdemo',
        icon: 'ion-checkmark-circled'
    }];
})

// ARTICLE: SOURCEURL w/ NOCHROME
/**
 * Disease of the Week Controller
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DotwCtrl', function($scope, $location, $ionicLoading, DotwData, DotwStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/disease/';
    $scope.name = 'Disease of the Week';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    var getData = function() {
        DotwData.async().then(
            // successCallback
            function() {
                $scope.datas = DotwData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // errorCallback
            function() {
                $scope.datas = DotwStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // notifyCallback
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * Specific Disease Controller
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @return {[type]}
 */
.controller('DiseaseCtrl', function($scope, $stateParams, $ionicLoading, $sce, DotwData, DotwContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });
    $scope.data = DotwData.get($stateParams.idx);
    $scope.nochrome = false;
    $scope.name = 'Disease of the Week'; // TODO: is this provided?
    $scope.devicePlatform = device.platform;

    var sourceurl = DotwData.getSourceUrl($stateParams.idx),
        filename = sourceurl.split('/').pop(),
        newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
        nochromeurl = sourceurl.replace(filename, newfilename);

    DotwContent.getStatus(nochromeurl).then(
        function(resp) {
            if (resp.data.status === 200) {
                $scope.nochrome = true;
                $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
            }
            else {
                $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            }
            $ionicLoading.hide();
        },
        function() {
            $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('FluViewsCtrl', function($scope, $location, $ionicLoading, FluViewData, FluViewStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/fluview/';
    $scope.name = 'FluView Weekly Summary';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    var getData = function() {
        FluViewData.async().then(
            // successCallback
            function() {
                $scope.datas = FluViewData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // errorCallback
            function() {
                $scope.datas = FluViewStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // notifyCallback
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @return {[type]}
 */
.controller('FluViewCtrl', function($scope, $stateParams, $ionicLoading, $sce, FluViewData, FluViewContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = FluViewData.get($stateParams.idx);
    $scope.id = FluViewData.getId($stateParams.idx);
    $scope.name = 'FluView Weekly Summary';
    $scope.devicePlatform = device.platform;

    FluViewContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load URL');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// ARTICLE: SOURCEURL w/ NOCHROME
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('HealthArticlesCtrl', function($scope, $location, $ionicLoading, HealthArticlesData, HealthArticlesStorage, ScreenSize, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/healtharticle/';
    $scope.name = 'Health Articles';
    $scope.hasloaded = true;

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.init = function() {
        //console.log('init');
        $scope.hasloaded = false;
    };

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        HealthArticlesData.async().then(
            function() {
                $scope.datas = HealthArticlesData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = HealthArticlesStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.screensize = ScreenSize;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('HealthArticleCtrl', function($scope, $stateParams, $ionicLoading, $sce, HealthArticlesData, HealthArticlesContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });
    $scope.data = HealthArticlesData.get($stateParams.idx);
    $scope.nochrome = false;
    $scope.name = 'Health Articles'; // TODO: is this provided?
    $scope.devicePlatform = device.platform;

    var sourceurl = HealthArticlesData.getSourceUrl($stateParams.idx),
        filename = sourceurl.split('/').pop(),
        newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
        nochromeurl = sourceurl.replace(filename, newfilename);

    HealthArticlesContent.getStatus(nochromeurl).then(
        function(resp) {
            if (resp.data.status === 200) {
                $scope.nochrome = true;
                $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
            }
            else {
                $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            }
            $ionicLoading.hide();
        },
        function() {
            $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// ARTICLE: SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('VitalSignsCtrl', function($scope, $location, $ionicLoading, VitalSignsData, VitalSignsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/vitalsign/';
    $scope.name = 'Vital Signs';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        VitalSignsData.async().then(
            function() {
                $scope.datas = VitalSignsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = VitalSignsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('VitalSignCtrl', function($scope, $ionicLoading, $stateParams, $sce, VitalSignsData, VitalSignsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = VitalSignsData.get($stateParams.idx);
    $scope.id = VitalSignsData.getId($stateParams.idx);
    $scope.name = 'Vital Signs';
    $scope.devicePlatform = device.platform;

    //console.log($scope.data);

    VitalSignsContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('FastStatsCtrl', function($scope, $location, $ionicLoading, FastStatsData, FastStatsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/FastStat/';
    $scope.name = 'FastStats';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        FastStatsData.async().then(
            function() {
                $scope.datas = FastStatsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = FastStatsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('FastStatCtrl', function($scope, $ionicLoading, $stateParams, $sce, FastStatsData, FastStatsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = FastStatsData.get($stateParams.idx);
    $scope.id = FastStatsData.getId($stateParams.idx);
    $scope.name = 'FastStats';
    $scope.devicePlatform = device.platform;

    FastStatsContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SOURCEURL w/ NOCHROME
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('WeeklyDiseaseCaseCountsCtrl', function($scope, $location, $ionicLoading, WeeklyCaseCountsData, WeeklyCaseCountsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/WeeklyDiseaseCaseCount/';
    $scope.name = 'Weekly Disease Case Counts';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        WeeklyCaseCountsData.async().then(
            function() {
                $scope.datas = WeeklyCaseCountsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = WeeklyCaseCountsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('WeeklyDiseaseCaseCountCtrl', function($scope, $stateParams, $sce, $ionicLoading, WeeklyCaseCountsData, WeeklyCaseCountsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = WeeklyCaseCountsData.get($stateParams.idx);
    $scope.name = 'Weekly Disease Case Counts';
    $scope.devicePlatform = device.platform;

    var sourceurl = WeeklyCaseCountsData.getSourceUrl($stateParams.idx),
        filename = sourceurl.split('/').pop(),
        newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
        nochromeurl = sourceurl.replace(filename, newfilename);

    WeeklyCaseCountsContent.getStatus(nochromeurl).then(
        function(resp) {
            if (resp.data.status === 200) {
                $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
            }
            else {
                $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            }
            $ionicLoading.hide();
        },
        function() {
            $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})



// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('EIDsCtrl', function($scope, $location, $ionicLoading, EIDsData, EIDsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/EID/';
    $scope.name = 'Emerging Infectious Disease (EID)';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        EIDsData.async().then(
            function() {
                $scope.datas = EIDsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = EIDsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('EIDCtrl', function($scope, $ionicLoading, $stateParams, $sce, EIDsData, EIDsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = EIDsData.get($stateParams.idx);
    $scope.id = EIDsData.getId($stateParams.idx);
    $scope.name = 'Emerging Infectious Disease (EID)';
    $scope.devicePlatform = device.platform;

    EIDsContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('MMWRsCtrl', function($scope, $location, $ionicLoading, MMWRsData, MMWRsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/MMWR/';
    $scope.name = 'Morbidity and Mortality Weekly Report (MMWR)';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        MMWRsData.async().then(
            function() {
                $scope.datas = MMWRsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = MMWRsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('MMWRCtrl', function($scope, $ionicLoading, $stateParams, $sce, MMWRsData, MMWRsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = MMWRsData.get($stateParams.idx);
    $scope.id = MMWRsData.getId($stateParams.idx);
    $scope.name = 'Morbidity and Mortality Weekly Report (MMWR)';
    $scope.devicePlatform = device.platform;

    MMWRsContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PCDsCtrl', function($scope, $location, $ionicLoading, PCDsData, PCDsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/PCD/';
    $scope.name = 'Preventing Chronic Disease (PCD)';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        PCDsData.async().then(
            function() {
                $scope.datas = PCDsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = PCDsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        //console.log(page < ($scope.datas.length / pageSize));
        //console.log(page);
        //console.log($scope.datas.length / pageSize);
        //console.log($scope.datas.length);
        //console.log(pageSize);
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PCDCtrl', function($scope, $ionicLoading, $stateParams, $sce, PCDsData, PCDsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = PCDsData.get($stateParams.idx);
    $scope.id = PCDsData.getId($stateParams.idx);
    $scope.name = 'Preventing Chronic Disease (PCD)';
    $scope.devicePlatform = device.platform;

    PCDsContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SOURCEURL w/ NOCHROME
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('NewsroomsCtrl', function($scope, $location, $ionicLoading, NewsroomsData, NewsroomsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Newsroom/';
    $scope.name = "Newsroom";

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        NewsroomsData.async().then(
            function() {
                $scope.datas = NewsroomsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = NewsroomsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('NewsroomCtrl', function($scope, $stateParams, $sce, $ionicLoading, NewsroomsData, NewsroomsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });
    $scope.news = NewsroomsData.get($stateParams.idx);
    $scope.nochrome = false;
    $scope.name = "Newsroom";
    $scope.devicePlatform = device.platform;

    var sourceurl = NewsroomsData.getSourceUrl($stateParams.idx),
        filename = sourceurl.split('/').pop(),
        newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
        nochromeurl = sourceurl.replace(filename, newfilename);

    NewsroomsContent.getStatus(nochromeurl).then(
        function(resp) {
            if (resp.data.status === 200) {
                $scope.nochrome = true;
                $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
            }
            else {
                $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            }
            $ionicLoading.hide();
        },
        function() {
            $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SOURCEURL w/ RD CHROME
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('OutbreaksCtrl', function($scope, $location, $ionicLoading, OutbreaksData, OutbreaksStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Outbreak/';
    $scope.name = "Outbreaks";

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        OutbreaksData.async().then(
            function() {
                $scope.datas = OutbreaksData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = OutbreaksStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('OutbreakCtrl', function($scope, $stateParams, $sce, $ionicLoading, OutbreaksData) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });
    $scope.data = OutbreaksData.get($stateParams.idx);
    $scope.name = "Outbreaks";
    $scope.devicePlatform = device.platform;

    var sourceurl = OutbreaksData.getSourceUrl($stateParams.idx);

    $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);

    $ionicLoading.hide();

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SOURCEURL w/ RD CHROME
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('TravelNoticesCtrl', function($scope, $location, $ionicLoading, TravelNoticesData, TravelNoticesStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/TravelNotice/';
    $scope.name = "Travel Notices";

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        TravelNoticesData.async().then(
            function() {
                $scope.datas = TravelNoticesData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = TravelNoticesStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('TravelNoticeCtrl', function($scope, $stateParams, $sce, $ionicLoading, TravelNoticesData) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });
    $scope.data = TravelNoticesData.get($stateParams.idx);
    $scope.name = "Travel Notices";
    $scope.devicePlatform = device.platform;

    var sourceurl = TravelNoticesData.getSourceUrl($stateParams.idx);

    $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);

    $ionicLoading.hide();

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})




// NO SYDICATED OR SOURCEURL CONTENT - content is derived from the source feed
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PodcastsCtrl', function($scope, $location, $ionicLoading, PodcastsData, PodcastsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Podcast/';
    $scope.name = "Podcasts";

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        PodcastsData.async().then(
            function() {
                $scope.datas = PodcastsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = PodcastsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PodcastCtrl', function($scope, $ionicLoading, $stateParams, $sce, PodcastsData) {
    var position = $stateParams.idx,
        count = PodcastsData.getCount();

    $scope.data = PodcastsData.get(position);
    $scope.id = PodcastsData.getId(position);
    $scope.name = "Podcasts";
    $scope.devicePlatform = device.platform;
    var audio = PodcastsData.getAudio(position);

    $scope.previous = {
        'visible': position > 0,
        'position': parseInt(position) - 1
    };

    $scope.next = {
        'visible': position < count - 1,
        'position': parseInt(position) + 1
    };

    //console.log(position);

    $scope.transcript = PodcastsData.getTranscript(position);
    $scope.audio = $sce.trustAsResourceUrl(audio[0]);
    $scope.type = audio[1];

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// NO SYDICATED OR SOURCEURL CONTENT - content is derived from the source feed
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PHILsCtrl', function($scope, $location, $ionicLoading, PHILsData, PHILsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/PHIL/';
    $scope.name = "Public Health Image Library";

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        PHILsData.async().then(
            function() {
                $scope.datas = PHILsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = PHILsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 20;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PHILCtrl', function($scope, $ionicLoading, $stateParams, $sce, PHILsData) {
    var position = $stateParams.idx,
        count = PHILsData.getCount();

    $scope.data = PHILsData.get(position);
    $scope.id = PHILsData.getId(position);
    $scope.name = "Public Health Image Library";
    $scope.devicePlatform = device.platform;
    $scope.image = $scope.data.enclosures[0].resourceUrl;

    $scope.previous = {
        'visible': position > 0,
        'position': parseInt(position) - 1
    };

    $scope.next = {
        'visible': position < count - 1,
        'position': parseInt(position) + 1
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})



/**
 * *******************************************************************************************
 *                                      BLOGS
 * *******************************************************************************************
 */

// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PHMblogsCtrl', function($scope, $location, $ionicLoading, PHMblogsData, PHMblogsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/PHMblog/';
    $scope.name = "Public Health Matters Blog";

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        PHMblogsData.async().then(
            function() {
                $scope.datas = PHMblogsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = PHMblogsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PHMblogCtrl', function($scope, $ionicLoading, $stateParams, $sce, PHMblogsData, PHMblogsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = PHMblogsData.get($stateParams.idx);
    $scope.id = PHMblogsData.getId($stateParams.idx);
    $scope.name = 'Public Health Matters Blog'; // TODO: is this provided?
    $scope.devicePlatform = device.platform;

    PHMblogsContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
    $scope.postComment = function() {
        window.open($scope.data.sourceUrl + '#respond', '_blank');
    };
})


// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DirectorsBlogsCtrl', function($scope, $location, $ionicLoading, DirectorsBlogsData, DirectorsBlogsStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/directorblog/';
    $scope.name = 'CDC Directors Blog';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        DirectorsBlogsData.async().then(
            function() {
                $scope.datas = DirectorsBlogsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = DirectorsBlogsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DirectorsBlogCtrl', function($scope, $ionicLoading, $stateParams, $sce, DirectorsBlogsData, DirectorsBlogsContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = DirectorsBlogsData.get($stateParams.idx);
    $scope.id = DirectorsBlogsData.getId($stateParams.idx);
    $scope.name = 'CDC Directors Blog'; // TODO: is this provided?
    $scope.devicePlatform = device.platform;

    DirectorsBlogsContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
    $scope.postComment = function() {
        window.open($scope.data.sourceUrl + '#respond', '_blank');
    };
})




/**
 * *******************************************************************************************
 *                                      FACTS
 * *******************************************************************************************
 */

// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DidYouKnowCtrl', function($scope, $location, $ionicLoading, DidYouKnowData, DidYouKnowStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/DYK/';
    $scope.name = 'Did You Know?';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        DidYouKnowData.async().then(
            function() {
                $scope.datas = DidYouKnowData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = DidYouKnowStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DYKCtrl', function($scope, $ionicLoading, $stateParams, $sce, DidYouKnowData, DidYouKnowContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = DidYouKnowData.get($stateParams.idx);
    $scope.id = DidYouKnowData.getId($stateParams.idx);
    $scope.name = 'Did You Know?';
    $scope.devicePlatform = device.platform;

    DidYouKnowContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})

// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('FactoftheWeekCtrl', function($scope, $location, $ionicLoading, FactoftheWeekData, FactoftheWeekStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Fact/';
    $scope.name = 'Fact of the Week';

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    var getData = function() {
        FactoftheWeekData.async().then(
            function() {
                $scope.datas = FactoftheWeekData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = FactoftheWeekStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('FOTWCtrl', function($scope, $ionicLoading, $stateParams, $sce, FactoftheWeekData, FactoftheWeekContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.data = FactoftheWeekData.get($stateParams.idx);
    $scope.id = FactoftheWeekData.getId($stateParams.idx);
    $scope.name = 'Fact of the Week';
    $scope.devicePlatform = device.platform;

    FactoftheWeekContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            alert('Content not available.');
            $ionicLoading.hide();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = $scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };
})



/**
 * *******************************************************************************************
 *                                      AUDIO/VIDEO
 * *******************************************************************************************
 */


// SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('YouTubesCtrl', function($scope, $location, $ionicLoading, YouTubesData, YouTubesStorage, $ionicScrollDelegate) {
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/YouTube/';
    $scope.name = 'YouTube';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    var getData = function() {
        YouTubesData.async().then(
            function() {
                $scope.datas = YouTubesData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = YouTubesStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        return page < ($scope.datas.length / pageSize);
    };

    $scope.showMoreItems = function() {
        page = page + 1;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('YouTubeCtrl', function($scope, $ionicLoading, $stateParams, $sce, YouTubesData) {
    // $scope.loading = $ionicLoading.show({
    //     template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
    //     showBackdrop: false,
    //     showDelay: 100
    // });

    $scope.data = YouTubesData.get($stateParams.idx);
    $scope.id = YouTubesData.getId($stateParams.idx);
    $scope.name = 'YouTube';
    $scope.devicePlatform = device.platform;

    // YouTubesContent.getContent($scope.id).then(
    //     function(resp) {
    //         $scope.content = $sce.trustAsHtml(resp.data.results.content);
    //         $ionicLoading.hide();
    //     },
    //     function() {
    //         alert('Content not available.');
    //         $ionicLoading.hide();
    //     },
    //     function() {}
    // );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = $scope.data.description,
                link = 'http://www.youtube.com/embed/' + $scope.data.sourceUrl.split('?v=')[1]; //$scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        else {
            alert('Social Sharing not available in Ionic View');
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_blank');
    };

    $scope.getVideoUrl = function() {
        return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.data.sourceUrl.split('?v=')[1]);
    };
})








// Other non-source Controllers

/**
 * Generic Stream Controller
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('StreamCtrl', function($scope, $location, $ionicLoading) {
        //console.log('StreamCtrl source: ', source);
})

/**
 * Generic Blog Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('BlogCtrl', function($scope, $stateParams) {})

/**
 * Generic Article Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('ArticleCtrl', function($scope, $stateParams) {})

/**
 * Generic Data Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DataCtrl', function($scope, $stateParams) {})

/**
 * Generic Fact Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('FactCtrl', function($scope, $stateParams) {})

/**
 * Generic Journal Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('JournalCtrl', function($scope, $stateParams) {})

/**
 * Generic News Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('NewsCtrl', function($scope, $stateParams) {})

/**
 * Generic Image Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('ImageCtrl', function($scope, $stateParams) {})

/**
 * Generic Audio Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('AudioCtrl', function($scope, $stateParams) {})

/**
 * Generic Video Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('Video  Ctrl', function($scope, $stateParams) {});
