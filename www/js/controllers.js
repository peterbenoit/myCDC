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
        title: 'FastStats -',
        href: '#/app/FastStats',
        id: 8
    }];
})

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
    $scope.article = DotwData.get($stateParams.articleIdx);
    $scope.frameUrl = $sce.trustAsResourceUrl(DotwData.getSourceUrl($stateParams.articleIdx));
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
.controller('FluViewCtrl', function($scope, $stateParams, $sce, FluViewData, FluViewContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = FluViewData.get($stateParams.articleIdx);
    $scope.id = FluViewData.getId($stateParams.articleIdx);

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
.controller('HealthArticleCtrl', function($scope, $stateParams, $sce, $ionicLoading, $cordovaFileTransfer, HealthArticlesData, HealthArticlesContent) {
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });
    $scope.article = HealthArticlesData.get($stateParams.articleIdx);

    var sourceurl = HealthArticlesData.getSourceUrl($stateParams.articleIdx),
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
.controller('VitalSignCtrl', function($scope, $ionicPlatform, $ionicLoading, $stateParams, $sce, VitalSignsData, VitalSignsContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = VitalSignsData.get($stateParams.articleIdx);
    $scope.id = VitalSignsData.getId($stateParams.articleIdx);

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
    $scope.title = 'FastStats';

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

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('VitalSignCtrl', function($scope, $ionicPlatform, $ionicLoading, $stateParams, $sce, VitalSignsData, VitalSignsContent) {
    $scope.article = {};
    $scope.loading = $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> Loading Data',
        showBackdrop: false,
        showDelay: 100
    });

    $scope.article = VitalSignsData.get($stateParams.articleIdx);
    $scope.id = VitalSignsData.getId($stateParams.articleIdx);

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

/**
 * Other non-source Controllers
 */


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
.controller('ArticleCtrl', function($scope, $stateParams) {

})

/**
 * Generic Data Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('DataCtrl', function($scope, $stateParams) {})




;
