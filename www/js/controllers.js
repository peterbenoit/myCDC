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
.controller('SourceListCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPlatform, $ionicPopup, $ionicLoading, $sce, $cordovaNetwork, $ionicScrollDelegate) {
    $scope.menu = [];
    $scope.storage = '';

    $scope.goBack = function() {

        if ($stateParams.sourceName && $stateParams.sourceDetail && $stateParams.sourceDetail.length) {
            $state.go('app.sourceIndex', $stateParams);
        } else {
            $state.go('app.sourceIndex', {
                sourceName : 'homestream'
            });
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
                    $rootScope.log('appInit completed');

                     // CONTINUE ANY NECESSARY PROCESSING AFTER SOURCE LIST PROMISE IS RETURNED
                    $scope.sourceListPromise.then(function(data) {

                        // DEBUG
                        $rootScope.log('ctrlInit Refresh');
                        $rootScope.log($scope.sourceList);
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
.controller('CommonSourceCtrl', function($scope, $rootScope, $state, $stateParams, $filter, $ionicPlatform, $ionicPopup, $ionicLoading, $sce, $cordovaNetwork, $ionicScrollDelegate) {

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.doRefresh = function () {

        $scope.ctrlInit(true);
    };

    $scope.goBack = function() {

        if ($stateParams.sourceName && $stateParams.sourceDetail && $stateParams.sourceDetail.length) {
            $state.go('app.sourceIndex', $stateParams);
        } else {
            if (!$stateParams.sourceName || $stateParams.sourceName == 'homestream') {
                $state.go('app.home');
            } else {
                $state.go('app.sourceIndex', {
                    sourceName : 'homestream'
                });
            }
        }
    };

    $scope.getDetailCard = function(cardList, contentID) {

        // PARAMS
        var arySourceInfo;

        // FILTER HERE
        arySourceInfo = $filter('filter')(cardList, {
            id: contentID
        });

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    $scope.ctrlInit = function(blnRefresh) {

        var blnRefresh = blnRefresh || false;

         // APP INIT WILL REFRESH SOURCE LIST
        $scope.appInit().then(function(d) {

            // SAVE STATE PARAMS TO SCOPE SO INHERITING CHILDREN (DIRECTIVE, ETC) CAN ACCESS THEM
            $scope.sourceName = $stateParams.sourceName;
            $scope.sourceDetail = $stateParams.sourceDetail || false;
            $scope.showBackButton = true;

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
                        $rootScope.log($scope.datas, 1, 'CURRENT SOURCE DATA');

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

                        $rootScope.log($scope.showBackButton, 5, 'Show Back Button');

                        // REDIRECT TO HOME IF NO SOURCE DEFINED
                        if ($scope.sourceDetail) {

                            if (!$scope.datas.length) {

                                // HIDE THE LOADER
                                $ionicLoading.hide();

                                // NO CARD LIST: ALERT USER, THEN REDIRECT
                                var noCardList = $ionicPopup.alert({title: 'Content not available.', template: 'Sorry, we could not seem to find that content. Please try again.'});
                                noCardList.then(function() {
                                    $state.go('app.sourceIndex', {sourceName: $scope.sourceName, sourceDetail: 'homestream' });
                                });

                            } else {

                                $scope.detailCard = $scope.getDetailCard($scope.datas, $scope.sourceDetail);
                                $rootScope.log($scope.detailCard, 1, 'CURRENT DETAIL CARD');

                                // HIDE THE LOADER
                                $ionicLoading.hide();

                                if (!$scope.detailCard) {

                                    // NO DETAIL CARD FOUND IN CARD LIST: ALERT USER, THEN REDIRECT
                                    var noDetailCard = $ionicPopup.alert({title: 'Content not available.', template: 'Sorry, we could not seem to find that content. Please try again.'});
                                    noDetailCard.then(function() {
                                        $state.go('app.sourceDetail', {sourceName: $scope.sourceName, sourceDetail: $scope.datas[0].id });
                                    });
                                }
                            }
                        } else {

                            // HIDE THE LOADER
                            $ionicLoading.hide();

                        }

                        // RETURN TRIMMED DATA TO CHAIN
                        return d.data;
                    });
                }
            });
        });
    };

    // INIT ON NEW VISIT OR IF SOURCE HAS CHANGED
    $scope.ctrlInit($scope.sourceName || ($stateParams.sourceName !== $scope.sourceName));

});