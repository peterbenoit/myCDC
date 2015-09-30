angular.module('mycdc.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
})

// home stream controller
.controller('HomeCtrl', function($scope) {

    // app sources, should be maintained by config.json
    $scope.sources = [{
        title: 'Disease of the Week',
        href: '#/app/dotw',
        id: 1
    }, {
        title: 'FluView Weekly Summary',
        href: '#/app/fluviews',
        id: 2
    }, {
        title: 'Health Articles',
        href: '#/app/healtharticles',
        id: 3
    }, {
        title: 'Vital Signs',
        href: '#/app/vitalsigns',
        id: 4
    }, {
        title: 'CDC Director Blog -',
        href: '#/app/cdcdirectorsblog',
        id: 5
    }, {
        title: 'CDC Works for You 24/7 Blog -',
        href: '#/app/247blogs',
        id: 6
    }, {
        title: 'Public Health Matters Blog -',
        href: '#/app/PHMblogs',
        id: 7
    }, {
        title: 'FastStats',
        href: '#/app/FastStats',
        id: 8
    }];
})
.controller('DotwCtrl', function($scope, $location, $ionicLoading, DotwData, DotwStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';

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
                console.log($scope.datas)
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
.controller('FluViewCtrl', function($scope, $location, $ionicLoading, FluViewData, FluViewStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';

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
                console.log($scope.datas)
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
.controller('HealthArticlesCtrl', function($scope, $location, $ionicLoading, HealthArticlesData, HealthArticlesStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    var getData = function() {
        HealthArticlesData.async().then(
            // successCallback
            function() {
                $scope.datas = HealthArticlesData.getAll();
                console.log($scope.datas)
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // errorCallback
            function() {
                $scope.datas = HealthArticlesStorage.all();
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
.controller('HealthArticleCtrl', function($scope, $ionicPlatform, $stateParams, $sce, HealthArticlesData) {
    $scope.article = {};
    $scope.article = HealthArticlesData.get($stateParams.healtharticleId);

    console.log($scope.article);

    $scope.content = $sce.trustAsHtml($scope.article.description);
})
.controller('VitalSignsCtrl', function($scope, $location, $ionicLoading, VitalSignsData, VitalSignsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    var getData = function() {
        VitalSignsData.async().then(
            // successCallback
            function() {
                $scope.datas = VitalSignsData.getAll();
                console.log($scope.datas)
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // errorCallback
            function() {
                $scope.datas = VitalSignsStorage.all();
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
.controller('FastStatsCtrl', function($scope, $location, $ionicLoading, FastStatsData, FastStatsStorage) {
    var source = $location.$$url.split('/').pop();
    $scope.datas = [];
    $scope.storage = '';

    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    var getData = function() {
        FastStatsData.async().then(
            // successCallback
            function() {
                $scope.datas = FastStatsData.getAll();
                console.log($scope.datas)
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // errorCallback
            function() {
                $scope.datas = FastStatsStorage.all();
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

// generic stream controller
.controller('StreamCtrl', function($scope, $location, $ionicLoading) {
    var source = $location.$$url.split('/').pop();
        console.log(source)
})

// generic blog controller
.controller('BlogCtrl', function($scope, $stateParams) {})

// generic article controller
.controller('ArticleCtrl', function($scope, $stateParams) {

})

// generic data controller
.controller('DataCtrl', function($scope, $stateParams) {})




;
