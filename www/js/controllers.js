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

                     // DEBUG
                    $rootScope.log('ctrlInit Refresh');
                    $rootScope.log($scope.sourceList);
                });
            }
        };

        // EXECUTE INIT
        $scope.ctrlInit(!$scope.sourceListPromise);

        // SET BUTTONS
        $scope.setButtonState();

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
.controller('CommonSourceCtrl', function($scope, $rootScope, $q, $timeout, $state, $stateParams, $filter, $ionicPlatform, $ionicPopup, $ionicLoading, $sce, $cordovaNetwork, $ionicScrollDelegate) {

    var   initialLoad = (!$scope.sourceName),
    sourceChange = ($stateParams.sourceName !== $scope.sourceName),
    detailChange = ($stateParams.sourceDetail !== $scope.sourceDetail);

    if (initialLoad) {

        // SETUP PAGINATION
        $scope.paginationLimit = function(type) {
            var objSizes = {
                tabletPortrait : 20,
                tabletLandscape : 24,
                imageTabletPortrait: 20,
                imageTabletLandscape: 48,
                defaultLimit : 10
            };

            return (objSizes[type] || objSizes.defaultLimit) * $scope.page;
        };

        $scope.hasMoreItems = function() {
            // QUICK CHECK TO SEE IF ALL AVAILABLE CARDS ARE SHOWN
            if ($scope.datas) {
                return $scope.page < ($scope.datas.length / $scope.pageSize);
            }
            return false;
        };

        $scope.loadMore = function() {
            $scope.page = $scope.page + 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.getSourceListLocal = function (blnRefresh) {

            blnRefresh = blnRefresh || false;

            var defer = $q.defer();

            // SAVE STATE PARAMS TO SCOPE SO INHERITING CHILDREN (DIRECTIVE, ETC) CAN ACCESS THEM
            $scope.sourceName = $stateParams.sourceName;
            $scope.sourceDetail = $stateParams.sourceDetail || false;

            // GET & SAVE THE SOURCE LIST PROMISE
            $rootScope.getSourceIndex(blnRefresh).then(function(d) {

                // RESET PAGING
                $scope.pageSize = 10
                $scope.page = 1;

                // SET DATA TO "datas" SO TEMPLATE WILL PICK IT UP & DISPLAY IT
                $scope.datas = d;
                $rootScope.log($scope.datas, 1, 'CURRENT SOURCE DATA');

                // BROADCAST REFRESH SO SCROLLER WILL RESIZE APPROPRIATELY
                $scope.$broadcast('scroll.refreshComplete');

                // REDIRECT TO HOME IF NO SOURCE DEFINED
                if ($scope.sourceDetail) {
                    if (!$scope.datas.length) {
                        // NO CARD LIST: ALERT USER, THEN REDIRECT
                        var noCardList = $ionicPopup.alert({title: 'Content not available.', template: 'Sorry, we could not seem to find that content. Please try again.'});
                        noCardList.then(function() {
                            $state.go('app.sourceIndex', {sourceName: $scope.sourceName, sourceDetail: 'homestream' });
                        });
                    }
                }

                defer.resolve(d);
            });

            // RETURN TRIMMED DATA TO CHAIN
            return defer.promise;
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

            var defer = $q.defer();

            var blnRefresh = blnRefresh || false;

            if (blnRefresh) {

                // APP INIT WILL REFRESH SOURCE LIST
                $scope.appInit().then(function(d) {

                    // REFRESH REQUESTED SOURCE INDEX DATA?
                    if (blnRefresh || !$scope.sourceIndexPromise || false) {

                        // GET / SET SOURCE META DATA TO SCOPE FROM STATE PARAMETERS
                        $scope.sourceMeta = $rootScope.getSourceMeta($stateParams);
                        $scope.getSourceListLocal(blnRefresh).then(function(d){

                            // RESOLVE PROMISE
                            defer.resolve(d);
                        });
                    }
                });
            }

            return defer.promise;
        };

        // POINTER FOR TEMPLATES
        $scope.doRefresh = function (blnRefresh) {
            $scope.getSourceListLocal(blnRefresh);
        };
    }

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });


    $timeout(function(){

        // INIT ON NEW VISIT OR IF SOURCE HAS CHANGED
        $scope.ctrlInit(initialLoad || sourceChange).then(function(d){

            $scope.sourceList = $rootScope.app.sourceList;
            $scope.sourceTypes = $rootScope.app.sourceTypes;
            $scope.templateMap = $rootScope.app.templateMap;
            $scope.sourceMetaMap = $rootScope.app.sourceMetaMap;

            // REFRESH SCREEN STATE
            $rootScope.refreshScreenState();

            // HIDE THE LOADER
            $ionicLoading.hide();

            return d;
        });

        console.log('YO');
    });
});