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
.controller('AppCtrl', function($scope, $timeout, $cordovaNetwork) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
})

/**
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @return {[type]}
 */
.controller('SettingsCtrl', function($scope, SettingsStorage, $cordovaNetwork) {

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

/**
 * Source List Controller
 * @param  {[type]}
 * @return {[type]}
 * Note: This should really be AppCtrl and HomeCtrl saved for the home stream
 */
.controller('SourceListCtrl', function($scope, $ionicPlatform, $ionicLoading, $timeout, $rootScope, $ionicPopover, $ionicHistory, returnToState, $stateParams, $cordovaNetwork) {
    $scope.menu = [];
    $scope.storage = '';

    $scope.goBack = function() {
        var sn = $ionicHistory.currentView().stateName;

        // In these views, return to the source stream, not the previous item
        if (sn === 'app.YouTube' || sn === 'app.PHIL' || sn === 'app.Podcast') {
            // returnToState('app.home');

            // source streams are always the statename + s
            returnToState(sn + 's');
        } else {
            $ionicHistory.goBack();
        }
    };

    // This little bit of nonsense checks for the existance of the runonce localstorage key and if the Home Controller has already loaded (it loads 2x for some reason)
    // If they key doesn't exist, and the Home Controller hasn't already loaded, load the modal
    $ionicPlatform.ready(function() {

        // DETECT FIRST RUN
        var runonce = window.localStorage.getItem('runonce');

        // NAV MENU POP OVER (SHOW ON FIRST LOAD)
        if (runonce === null && $rootScope.HomeCtrlLoad === false) {
            $rootScope.HomeCtrlLoad = true;
            window.localStorage['runonce'] = true;
            // Show the popover only on first load
            $ionicPopover.fromTemplateUrl('templates/popover.html', {
                scope: $scope,
            }).then(function(popover) {
                $scope.popover = popover;
                var element = document.getElementById('navicon');
                popover.show(element);

                $scope.closePopover = function() {
                    $scope.popover.hide();
                    $scope.popover.remove();
                };
            });
        }

        // CONTROLLER INIT METHOD
        $scope.ctrlInit = function(blnRefresh) {

            blnRefresh = blnRefresh || false;

            // REFRESH NEEDED?
            if (blnRefresh) {

                // APP INIT WILL REFRESH SOURCE LIST
                $scope.appInit().then(function(d) {

                    // DEBUG
                    console.log('appInit completed');

                     // CONTINUE ANY NECESSARY PROCESSING AFTER SOURCE LIST PROMISE IS RETURNED
                    $scope.sourceListPromise.then(function(data) {

                        // DEBUG
                        console.log('ctrlInit Refresh');
                        console.log($scope.sourceList);
                    });
                });
            }
        };

        // EXECUTE INIT
        $scope.ctrlInit(!$scope.sourceListPromise);

    });
})

/**
 * Common Source Controller
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Object}
 * @return {[type]}
 */
.controller('CommonSourceCtrl', function($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPopup, $sce, $cordovaNetwork, $ionicScrollDelegate) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.ctrlInit = function(blnRefresh) {

        var blnRefresh = blnRefresh || false;

        // SAVE STATE PARAMS TO SCOPE SO INHERITING CHILDREN (DIRECTIVE, ETC) CAN ACCESS THEM
        $scope.sourceName = $stateParams.sourceName;
        $scope.sourceDetail = $stateParams.sourceDetail || false;
        $scope.showBackButton = true;
        console.log('SHOW BACK BUTTON: ' + $scope.showBackButton + '-' + $scope.sourceName);

        // INHERITED PROMISE CHAINED TIMING
        $rootScope.sourceListPromise.then(function(data) {

            // REFRESH REQUESTED SOURCE INDEX DATA?
            if (blnRefresh || !$scope.sourceIndexPromise || false) {

                // GET / SET SOURCE META DATA TO SCOPE FROM STATE PARAMETERS
                $scope.sourceMeta = $rootScope.getSourceMeta($stateParams);

                // GET & SAVE THE SOURCE LIST PROMISE
                $scope.sourceIndexPromise = $rootScope.getSourceIndex($stateParams).then(function(d) {

                    var pageSize = 10, page = 1;

                    // SET DATA TO "datas" SO TEMPLATE WILL PICK IT UP & DISPLAY IT
                    $scope.datas = $scope.sourceIndex;

                    // SETUP PAGINATION
                    $scope.paginationLimit = function(data) {
                        return pageSize * page;
                    };

                    $scope.hasMoreItems = function() {
                        return page < ($scope.datas.length / pageSize);
                    };

                    $scope.loadMore = function() {
                        page = page + 1;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    };

                    // BROADCAST REFRESH SO SCROLLER WILL RESIZE APPROPRIATELY
                    $scope.$broadcast('scroll.refreshComplete');

                    // REDIRECT TO HOME IF NO SOURCE DEFINED
                    if ($scope.sourceDetail) {

                        //
                        console.log('GET DETAIL DATA');
                        $scope.frameUrl = $rootScope.getSourceDetailUrl($stateParams);

                        console.log($scope.showBackButton);
                        console.log($scope.sourceName);

                    }

                    // HIDE THE LOADER
                    $ionicLoading.hide();

                    // RETURN TRIMMED DATA TO CHAIN
                    return d.data;
                });

                /* AFTER ALL MAGIC - DETERMINE IF PHONE AND
                $scope.sourceIndexPromise.then(function() {
                    console.log($scope.viewType);
                    if ($scope.datas.length && $scope.viewType != 'phone') {
                        $state.go('app.sourceDetail', {sourceName: $scope.sourceName, sourceDetail: $scope.datas[0].id });
                    }
                });
                */
            }
        });
    };

    // INIT ON NEW VISIT OR IF SOURCE HAS CHANGED
    $scope.ctrlInit($scope.sourceName || ($stateParams.sourceName !== $scope.sourceName));

    $scope.doRefresh = function () {
        $scope.ctrlInit(true);
    }

});