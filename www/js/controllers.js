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
.controller('AppCtrl', function($rootScope, $scope, $timeout, $cordovaNetwork) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $rootScope.appInit().then(function(d) {
        $scope.sourceMetaMap = $rootScope.app.sourceMetaMap;
        $scope.sourceFilters = $rootScope.app.sourceFilters;
        $scope.sourceFilterLocks = $rootScope.app.sourceFilterLocks;
        $scope.sourceList = $rootScope.app.sourceList;
        $scope.sourceTypes = $rootScope.app.sourceTypes;
    });

    $scope.saveFilters = function () {
        $timeout(function(){
            var settingsStorage = $rootScope.getSimpleLocalStore('settings');
            settingsStorage.set($scope.sourceFilters);
        });
    };
})

/**
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @return {[type]}
 */
.controller('SettingsCtrl', function($scope, $rootScope, $cordovaNetwork, $ionicPopup) {

    $rootScope.showSettingsBack = true;

    $rootScope.appInit().then(function(d) {
        $scope.resetSettings = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Reset Application Data',
                template: 'Clear all application settings and data?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    window.localStorage.clear();
                    $rootScope.appInit(true);
                }
            });
        };
    });
})

/**
 * Source List Controller
 * @param  {[type]}
 * @return {[type]}
 * Note: This should really be AppCtrl and HomeCtrl saved for the home stream
 */
.controller('SourceListCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPlatform, $ionicPopup, $ionicLoading, $sce, $cordovaNetwork, $ionicScrollDelegate) {

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
.controller('CommonSourceCtrl', function($scope, $rootScope, $urlMatcherFactory, $location, $q, $timeout, $state, $stateParams, $filter, $ionicPlatform, $ionicPopup, $ionicLoading, $sce, $cordovaNetwork, $ionicScrollDelegate, $ionicNavBarDelegate) {

    var  initialLoad = (!$scope.sourceName), sourceChange, detailChange;

    // SAVE STATE PARAMS TO SCOPE SO INHERITING CHILDREN (DIRECTIVE, ETC) CAN ACCESS THEM
    if (!$rootScope.appState) {
        $rootScope.appState = {
            sourceName : $stateParams.sourceName,
            sourceDetail : $stateParams.sourceDetail || false
        };
    }

    sourceChange = ($stateParams.sourceName !== $rootScope.appState.sourceName),
    detailChange = ($stateParams.sourceDetail !== $rootScope.appState.sourceDetail);

    $scope.activeClasses = {
        "true" : "is-active",
        "false" : ""
    };

    $scope.isActiveCard = function (cardData) {
        console.log(cardData);
    };


    // SET TITLE
    $ionicNavBarDelegate.title('<img src="img/logo.png" />');

    // SETUP LISTENERS FOR STATE CHANGE
    $scope.$on('$locationChangeSuccess', function(event) {

        //PLAIN TEXT FOR THE ARGUMENT FOR CLARITY
        var urlMatcher = $urlMatcherFactory.compile('/app/source/:sourceName/:sourceDetail');
        var newStateParams = urlMatcher.exec($location.url());

        // DEFAULT STATE PARAMS
        if (!newStateParams) {
            newStateParams = {
                sourceName : 'homestream',
                sourceDetail : false
            };
        }

        // PUSH NEW STATE TO HISTORY
        $rootScope.saveHistory(newStateParams);

        // UPDATE BACK BUTTON DISPLAY
        $rootScope.objBackButton = $rootScope.backButtonDisplay($stateParams);

        // UPDATE STATE PARAMETERS
        $stateParams = newStateParams;

        // SET SCOPE.APPSTATE (STATE PARAMETER UPDATE IS BUGGY)
        $rootScope.appState = newStateParams;
        $rootScope.$broadcast('source-detail-changed');
        $scope.detailCard = $rootScope.getSourceCard($rootScope.appState.sourceDetail);

        return true;
    });

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

        $scope.hasMoreItems = function(type) {
            type = type || 'defaultLimit';
            // QUICK CHECK TO SEE IF ALL AVAILABLE CARDS ARE SHOWN
            if ($scope.datas) {
                return ($scope.page * $scope.paginationLimit(type)) < $scope.datas.length;
            }
            return false;
        };

        $scope.loadMore = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $timeout(function(){
                $scope.page = $scope.page + 1;
                $scope.$broadcast('scroll.loadMore');
            });
        };

        $scope.getSourceListLocal = function (blnRefresh) {

            blnRefresh = blnRefresh || false;

            var defer = $q.defer();

            // GET & SAVE THE SOURCE LIST PROMISE
            $rootScope.getSourceIndex(blnRefresh).then(function(d) {

                // RESET PAGING
                $scope.pageSize = 10;
                $scope.page = 1;

                // SET DATA TO "datas" SO TEMPLATE WILL PICK IT UP & DISPLAY IT
                $scope.datas = d;
                $scope.streamItems = $scope.datas;
                $rootScope.log($scope.datas, 1, 'CURRENT SOURCE DATA');

                // BROADCAST REFRESH SO SCROLLER WILL RESIZE APPROPRIATELY
                $scope.$broadcast('scroll.refreshComplete');

                // REDIRECT TO HOME IF NO SOURCE DEFINED
                if ($rootScope.appState.sourceDetail) {
                    if (!$scope.datas.length) {
                        // NO CARD LIST: ALERT USER, THEN REDIRECT
                        var noCardList = $ionicPopup.alert({title: 'Content not available.', template: 'Sorry, we could not seem to find that content. Please try again.'});
                        noCardList.then(function() {
                            $state.go('app.sourceIndex', {sourceName: 'homestream'});
                        });
                    }
                }

                defer.resolve(d);
            });

            // RETURN TRIMMED DATA TO CHAIN
            return defer.promise;
        };

        $scope.ctrlInit = function(blnRefresh) {

            var defer = $q.defer();

            var blnRefresh = blnRefresh || false;

            if (blnRefresh) {

                // APP INIT WILL REFRESH SOURCE LIST
                $scope.appInit().then(function(d) {

                    // REFRESH REQUESTED SOURCE INDEX DATA?
                    if (blnRefresh || false) {

                        // GET / SET SOURCE META DATA TO SCOPE FROM STATE PARAMETERS
                        $scope.sourceMeta = $rootScope.getSourceMeta($stateParams);
                        $scope.getSourceListLocal().then(function(d){

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

        console.log('Contoller Initial Load');
    }

    // TRIGGER INITIAL LOADER DISPLAY
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    // THEN UPDATE VIEW
    $timeout(function(){

        // INIT ON NEW VISIT OR IF SOURCE HAS CHANGED
        $scope.ctrlInit(initialLoad || sourceChange).then(function(d){

            $rootScope.saveHistory($stateParams);
            $rootScope.objBackButton = $rootScope.backButtonDisplay($stateParams);

            $scope.sourceList = $rootScope.app.sourceList;
            $scope.sourceTypes = $rootScope.app.sourceTypes;
            $scope.templateMap = $rootScope.app.templateMap;
            $scope.sourceMetaMap = $rootScope.app.sourceMetaMap;

            // REFRESH SCREEN STATE
            $rootScope.refreshScreenState();

            // HIDE THE LOADER
            $ionicLoading.hide();

            return d;
        }).then(function(){
            $scope.detailCard = $rootScope.getSourceCard($rootScope.appState.sourceDetail);
        });

        console.log('Contoller Load');
    });
});
