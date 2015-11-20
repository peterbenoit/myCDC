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
.controller('SettingsCtrl', function($scope, $rootScope, $cordovaNetwork, $ionicPopup, $ionicNavBarDelegate) {

    $rootScope.settingsActive = true;

    //$ionicNavBarDelegate.title('CDC');

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

    // TOGGLE SHOW SETTING OFF
    $rootScope.settingsActive = false;

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
.controller('CommonSourceCtrl', function($scope, $rootScope, $urlMatcherFactory, $location, $q, $timeout, $state, $stateParams, $filter, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicPopover, $sce, $cordovaNetwork, $ionicScrollDelegate, $ionicNavBarDelegate) {

    // TOGGLE SHOW SETTING OFF
    $rootScope.settingsActive = false;

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
        //console.log(cardData);
    };

    // SET TITLE
    $ionicNavBarDelegate.title('<img src="img/logo.png" />');

    // LISTED FOR APP STATE UPDATE
    $scope.$on('app-state-updated', function(event){

        // PUSH NEW STATE TO HISTORY
        $scope.saveHistory($rootScope.appState);

        $scope.getSourceListLocal().then(function(d){

            // UPDATE STATE PARAMETERS
            //$stateParams = stateParams;

            // UPDATE BACK BUTTON DISPLAY
            $rootScope.objBackButton = $rootScope.backButtonDisplay($rootScope.appState);

            // GET / SET SOURCE META DATA TO SCOPE FROM STATE PARAMETERS
            $scope.sourceMeta = $rootScope.getSourceMeta($rootScope.appState);

            // SET DETAIL CARD
            $scope.detailCard = $rootScope.getSourceCard($rootScope.appState.sourceDetail);

            // REFRESH SCREEN STATE
            $rootScope.refreshScreenState(function(){

                // HIDE THE LOADER
                $ionicLoading.hide();

            });
        });
    });

    // SETUP LISTENERS FOR STATE CHANGE
    $scope.$on('$locationChangeSuccess', function(event) {

        // ON STATE CHANGE, TRIGGER
        $rootScope.$broadcast('app-state-param-update');
    });

    // LISTEN FOR APP STATE CHANGE REQUEST
    $scope.$on('app-state-param-update', function(event) {

        // TRIGGER INITIAL LOADER DISPLAY
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $timeout(function(){

            //PLAIN TEXT FOR THE ARGUMENT FOR CLARITY
            var urlMatcher = $urlMatcherFactory.compile('/app/source/:sourceName/:sourceDetail');
            var newStateParams = urlMatcher.exec($location.url());

            // GET STATE PARAMS FROM ROOTSCOPE IF UNABLE TO RETREIVE FROM URL
            if (!newStateParams) {
                newStateParams = $rootScope.appState;
            }

            // DEFAULT STATE PARAMS (FAILSAFE ON URL AND ROOTSCOPE FAILURE)
            if (!newStateParams) {
                newStateParams = {
                    sourceName : 'homestream',
                    sourceDetail : false
                };
            }

            // UPDATE APP STATE
            $rootScope.appState = newStateParams;

            // ON STATE CHANGE, TRIGGER APP STATE UDPATE
            $rootScope.$broadcast('app-state-updated');

        });
    });

    $scope.menuPopOver = function() {
        var runonce = window.localStorage.getItem('myCDC-runonce');

        if (runonce === null) {
            window.localStorage['myCDC-runonce'] = true;

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
    };

    // HISTORY HANDLERS
    $scope.saveHistory = function(appState) {

        appState = appState || $rootScope.appState;


        // GET THE LAST STATE IN HISTORY
        var objLastState = $rootScope.aryHistory[$rootScope.aryHistory.length - 1] || {};

        // SAVE THE STATE TO HISTORY (IF NEW)
        var objThisState = {
            sourceName : appState.sourceName || false ,
            sourceDetail : appState.sourceDetail || false
        };

        // SHOULD WE SAVE IT?
        if (objThisState.sourceName != objLastState.sourceName || objThisState.sourceDetail != objLastState.sourceDetail) {
            // IS THIS SAME DIFFERENT FROM THE LAST? SAVE CURRENT
            $rootScope.aryHistory.push(objThisState);
        }
    };

    $rootScope.historyBack = function() {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $timeout(function() {

            // GET COPY OF CURRENT STATE FROM ROOTSCOPE
            var appState = angular.extend({}, $rootScope.appState);

            // GET THIS STATE
            var objThisState = {
                sourceName : appState.sourceName,
                sourceDetail : appState.sourceDetail
            };

            if ($rootScope.aryHistory.length) {

                // GET THE LAST STATE (& POP IT OFF THE ARRAY)
                var objLastState = $rootScope.aryHistory.pop();

                // IS THE LAST STATE THE SAME AS THE CURRENT STATE?
                if (objLastState.sourceName == objThisState.sourceName && objLastState.sourceDetail == objThisState.sourceDetail) {

                    // THEN WE NEED TO GO BACK ONE MORE
                    if ($rootScope.aryHistory.length) {

                        // GET THE NEXT IN LINE
                        objLastState = $rootScope.aryHistory.pop();
                    }
                }

                // UPDATE ROOTSCOPE APP STATE
                $rootScope.appState = objLastState;

            } else {

                // UPDATE ROOTSCOPE APP STATE
                $rootScope.appState = {
                    sourceName : 'homestream'
                };

            }

            // APP STATE UPDATED
            $rootScope.$broadcast('app-state-updated');

        });
    };

    $scope.stateChanged = function (stateParams) {
        if (!stateParams.sourceName) {
            return true;
        }

        if (stateParams.sourceName != $rootScope.appState.sourceName) {
            return true;
        }

        if (stateParams.hasOwnProperty('sourceDetail') && stateParams.sourceDetail != $rootScope.appState.sourceDetail) {
            return true;
        };

        return false;
    };

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
            $ionicLoading.show({
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
            $rootScope.getSourceIndex(blnRefresh, $rootScope.appState).then(function(d) {

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

                        // GET THE SOURCE LIST
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

    // THEN UPDATE VIEW
    $timeout(function(){

        // SET TITLE
        $ionicNavBarDelegate.title('<img src="img/logo.png" />');

        // INIT ON NEW VISIT OR IF SOURCE HAS CHANGED
        $scope.ctrlInit(initialLoad || sourceChange).then(function(d){

            // SET SOURCE LIST, TYPES, TEMPLATE MAP & METAMAP
            $scope.sourceList = $rootScope.app.sourceList;
            $scope.sourceTypes = $rootScope.app.sourceTypes;
            $scope.templateMap = $rootScope.app.templateMap;
            $scope.sourceMetaMap = $rootScope.app.sourceMetaMap;

            return d;
        }).then(function(){

            // BROADCAST DETAIL CHANGE
            $rootScope.$broadcast('app-state-param-update');

            // SHOW POPOVER ON FIRST RUN (OR AFTER CLEAR)
            $scope.menuPopOver();
        });

        console.log('Contoller Load');
    });
});
