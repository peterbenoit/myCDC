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
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});


})

/**
 * Home Controller
 * @param  {[type]}
 * @return {[type]}
 */
.controller('HomeCtrl', function($scope) {

    // app sources, should be maintained by config.json
    $scope.sources = [{
        title: 'Disease of the Week',
        href: '#/app/dotw'
    }, {
        title: 'FluView Weekly Summary',
        href: '#/app/fluviews'
    }, {
        title: 'Health Articles',
        href: '#/app/healtharticles'
    }, {
        title: 'Vital Signs',
        href: '#/app/vitalsigns'
    }, {
        title: 'CDC Director Blog -',
        href: '#/app/cdcdirectorsblog'
    }, {
        title: 'CDC Works for You 24/7 Blog -',
        href: '#/app/247blogs'
    }, {
        title: 'Public Health Matters Blog -',
        href: '#/app/PHMblogs'
    }, {
        title: 'FastStats -',
        href: '#/app/FastStats'
    }, {
        title: 'Weekly Disease Case Counts (No test data)',
        href: '#/app/WeeklyDiseaseCaseCounts'
    }, {
        title: 'Did You Know? -',
        href: '#/app/DidYouKnow'
    }, {
        title: 'Fact of the Week -',
        href: '#/app/FactoftheWeek'
    }, {
        title: 'Emerging Infectious Disease (EID) -',
        href: '#/app/EIDS'
    }, {
        title: 'Morbidity and Mortality Weekly Report (MMWR) -',
        href: '#/app/MMWRS'
    }, {
        title: 'Preventing Chronic Disease (PCD) -',
        href: '#/app/PCDS'
    }, {
        title: 'Newsroom',
        href: '#/app/Newsrooms'
    }, {
        title: 'Outbreaks',
        href: '#/app/Outbreaks'
    }, {
        title: 'Travel Notices',
        href: '#/app/TravelNotices'
    }, {
        title: 'Image Library -',
        href: '#/app/ImageLibrarys'
    }, {
        title: 'Instagram -',
        href: '#/app/Instagrams'
    }, {
        title: 'Flickr -',
        href: '#/app/Flickrs'
    }, {
        title: 'Podcasts -',
        href: '#/app/Podcasts'
    }, {
        title: 'YouTube -',
        href: '#/app/YouTubes'
    }];
})

// SOURCEURL w/ NOCHROME
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
.controller('DotwCtrl', function($scope, $location, $ionicLoading, DotwData, DotwStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/disease/';
    $scope.title = 'Disease of the Week';

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
        pageSize = 6;

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
.controller('DiseaseCtrl', function($scope, $stateParams, $sce, DotwData) {
    $scope.article = DotwData.get($stateParams.idx);
    $scope.frameUrl = $sce.trustAsResourceUrl(DotwData.getSourceUrl($stateParams.idx));
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
.controller('FluViewsCtrl', function($scope, $location, $ionicLoading, FluViewData, FluViewStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/fluview/';
    $scope.title = 'FluView Weekly Summary';

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
        pageSize = 6;

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
.controller('FluViewCtrl', function($scope, $stateParams, $ionicLoading, FluViewData, FluViewContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = FluViewData.get($stateParams.idx);
    $scope.id = FluViewData.getId($stateParams.idx);

    FluViewContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load URL');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('HealthArticlesCtrl', function($scope, $location, $ionicLoading, HealthArticlesData, HealthArticlesStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/healtharticle/';
    $scope.title = 'Health Articles';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
.controller('HealthArticleCtrl', function($scope, $stateParams, $sce, $ionicLoading, HealthArticlesData, HealthArticlesContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });
    $scope.article = HealthArticlesData.get($stateParams.idx);

    var sourceurl = HealthArticlesData.getSourceUrl($stateParams.idx),
        filename = sourceurl.split('/').pop(),
        newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
        nochromeurl = sourceurl.replace(filename, newfilename);

    HealthArticlesContent.getStatus(nochromeurl).then(
        function(resp) {
            if(resp.data.status === 200) {
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
.controller('VitalSignsCtrl', function($scope, $location, $ionicLoading, VitalSignsData, VitalSignsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/vitalsign/';
    $scope.title = 'Vital Signs';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
.controller('VitalSignCtrl', function($scope, $ionicLoading, $stateParams, VitalSignsData, VitalSignsContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = VitalSignsData.get($stateParams.idx);
    $scope.id = VitalSignsData.getId($stateParams.idx);

    VitalSignsContent.getContent($scope.id).then(
        function(resp) {
            console.log(resp);
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load Content');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('FastStatsCtrl', function($scope, $location, $ionicLoading, FastStatsData, FastStatsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/FastStat/';
    $scope.title = 'Fast Stats';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
.controller('FastStatCtrl', function($scope, $ionicLoading, $stateParams, FastStatsData, FastStatsContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = FastStatsData.get($stateParams.idx);
    $scope.id = FastStatsData.getId($stateParams.idx);

    FastStatsContent.getContent($scope.id).then(
        function(resp) {
            console.log(resp);
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load Content');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('WeeklyDiseaseCaseCountsCtrl', function($scope, $location, $ionicLoading, WeeklyCaseCountsData, WeeklyCaseCountsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/WeeklyDiseaseCaseCount/';
    $scope.title = 'Weekly Disease Case Counts';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
    $scope.article = WeeklyCaseCountsData.get($stateParams.idx);

    var sourceurl = WeeklyCaseCountsData.getSourceUrl($stateParams.idx),
        filename = sourceurl.split('/').pop(),
        newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
        nochromeurl = sourceurl.replace(filename, newfilename);

    WeeklyCaseCountsContent.getStatus(nochromeurl).then(
        function(resp) {
            if(resp.data.status === 200) {
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
.controller('DidYouKnowCtrl', function($scope, $location, $ionicLoading, DidYouKnowData, DidYouKnowStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/DYK/';
    $scope.title = 'Did You Know?';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
.controller('DYKCtrl', function($scope, $ionicLoading, $stateParams, DidYouKnowData, DidYouKnowContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = DidYouKnowData.get($stateParams.idx);
    $scope.id = DidYouKnowData.getId($stateParams.idx);

    DidYouKnowContent.getContent($scope.id).then(
        function(resp) {
            console.log(resp);
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load Content');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('FactoftheWeekCtrl', function($scope, $location, $ionicLoading, FactoftheWeekData, FactoftheWeekStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Face/';
    $scope.title = 'Fact of the Week';

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
        pageSize = 6;

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
.controller('FOTWCtrl', function($scope, $ionicLoading, $stateParams, FactoftheWeekData, FactoftheWeekContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = FactoftheWeekData.get($stateParams.idx);
    $scope.id = FactoftheWeekData.getId($stateParams.idx);

    FactoftheWeekContent.getContent($scope.id).then(
        function(resp) {
            console.log(resp);
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load Content');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('EIDsCtrl', function($scope, $location, $ionicLoading, EIDsData, EIDsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/EID/';
    $scope.title = 'Emerging Infectious Disease (EID)';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
.controller('EIDCtrl', function($scope, $ionicLoading, $stateParams, EIDsData, EIDsContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = EIDsData.get($stateParams.idx);
    $scope.id = EIDsData.getId($stateParams.idx);

    EIDsContent.getContent($scope.id).then(
        function(resp) {
            console.log(resp);
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load Content');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('MMWRsCtrl', function($scope, $location, $ionicLoading, MMWRsData, MMWRsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/MMWR/';
    $scope.title = 'Morbidity and Mortality Weekly Report (MMWR)';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
.controller('MMWRCtrl', function($scope, $ionicLoading, $stateParams, MMWRsData, MMWRsContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = MMWRsData.get($stateParams.idx);
    $scope.id = MMWRsData.getId($stateParams.idx);

    MMWRsContent.getContent($scope.id).then(
        function(resp) {
            console.log(resp);
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load Content');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('PCDsCtrl', function($scope, $location, $ionicLoading, PCDsData, PCDsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/PCD/';
    $scope.title = 'Preventing Chronic Disease (PCD)';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
.controller('PCDCtrl', function($scope, $ionicLoading, $stateParams, PCDsData, PCDsContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = PCDsData.get($stateParams.idx);
    $scope.id = PCDsData.getId($stateParams.idx);

    PCDsContent.getContent($scope.id).then(
        function(resp) {
            console.log(resp);
            $scope.content = resp.data.results.content;
            $ionicLoading.hide();
        },
        function() {
            alert('Could not load Content');
            $ionicLoading.hide();
        },
        function() {}
    );
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
.controller('NewsroomsCtrl', function($scope, $location, $ionicLoading, NewsroomsData, NewsroomsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Newsroom/';
    $scope.title = 'Newsroom';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
    $scope.article = NewsroomsData.get($stateParams.idx);

    var sourceurl = NewsroomsData.getSourceUrl($stateParams.idx),
        filename = sourceurl.split('/').pop(),
        newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
        nochromeurl = sourceurl.replace(filename, newfilename);

    NewsroomsContent.getStatus(nochromeurl).then(
        function(resp) {
            if(resp.data.status === 200) {
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
.controller('OutbreaksCtrl', function($scope, $location, $ionicLoading, OutbreaksData, OutbreaksStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Outbreak/';
    $scope.title = 'Outbreaks';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
    $scope.article = OutbreaksData.get($stateParams.idx);

    var sourceurl = OutbreaksData.getSourceUrl($stateParams.idx);

    $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);

    $ionicLoading.hide();
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
.controller('TravelNoticesCtrl', function($scope, $location, $ionicLoading, TravelNoticesData, TravelNoticesStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/TravelNotice/';
    $scope.title = 'Travel Notices';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

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
        pageSize = 6;

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
    $scope.article = TravelNoticesData.get($stateParams.idx);

    var sourceurl = TravelNoticesData.getSourceUrl($stateParams.idx);

    $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);

    $ionicLoading.hide();
})
































/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DirectorsBlogCtrl', function($scope, $location, $ionicLoading, DirectorsBlogData, DirectorsBlogStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/directorblog/';
    $scope.title = 'CDC Directors Blog';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    var getData = function() {
        DirectorsBlogData.async().then(
            function() {
                $scope.datas = DirectorsBlogData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = DirectorsBlogStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 6;

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





// Other non-source Controllers

/**
 * Generic Stream Controller
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('StreamCtrl', function($scope, $location, $ionicLoading) {
    var source = $location.$$url.split('/').pop();
        console.log('StreamCtrl source: ', source);
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
.controller('Video  Ctrl', function($scope, $stateParams) {})
;
