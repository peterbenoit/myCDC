/**
 *
 */
angular.module('mycdc.controllers', [])

.controller('AppCtrl', ['$scope','$rootScope','$urlMatcherFactory','$location','$q','$timeout','$state','$stateParams','$filter','$ionicPlatform','$ionicPopup','$ionicLoading','$ionicPopover','$ionicHistory','$sce','$cordovaNetwork','$ionicScrollDelegate','$ionicNavBarDelegate','AppUtil','Device','Globals','DataSourceInterface', function($scope, $rootScope, $urlMatcherFactory, $location, $q, $timeout, $state, $stateParams, $filter, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicPopover, $ionicHistory, $sce, $cordovaNetwork, $ionicScrollDelegate, $ionicNavBarDelegate, AppUtil, Device, Globals, DataSourceInterface) {

    // THIS POINTER (_this & "CONTROLLER AS" FOR EASE IN TRANSITION TO NEXT ANGULAR VERSION)
    var _this = this;

    _this.paginationLimits = {
        tabletPortrait : 20,
        tabletLandscape : 24,
        imageTabletPortrait: 20,
        imageTabletLandscape: 48,
        defaultLimit : 10
    };

    _this.menuPopOver = function() {
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

                _this.closePopover = function() {
                    $scope.popover.hide();
                    $scope.popover.remove();
                };
            });
        }
    };

    _this.getPageState = function (appState, blnIncrement) {

        blnIncrement = blnIncrement || false;

        var sourceName = appState.sourceName || 'homestream';

        if (!_this.pageTracker) {
            _this.pageTracker = {};
        }

        if (!_this.pageTracker.hasOwnProperty(sourceName)) {
            _this.pageTracker[sourceName] = 1;
        }

        if (blnIncrement) {
            _this.pageTracker[sourceName] = _this.pageTracker[sourceName] + 1;
        }

        console.log('Page limit for :' + sourceName, _this.pageTracker[sourceName]);

        _this.page = _this.pageTracker[sourceName];

        return _this.page;
    };

    _this.goBack = function () {
        $ionicHistory.goBack();
    };

    _this.appState = function () {
        return Globals.get('appState');
    };

    // SETUP PAGINATION
    _this.paginationLimit = function(type) {

        var intReturn = (_this.paginationLimits[type] || _this.paginationLimits.defaultLimit) * _this.page;

        console.log('paginationLimit for ' + type, intReturn);

        return intReturn;
    };

    _this.hasMoreItems = function(type) {
        type = type || 'defaultLimit';

        var limit = _this.paginationLimits[type];

        // QUICK CHECK TO SEE IF ALL AVAILABLE CARDS ARE SHOWN
        if (_this.datas) {
            return (_this.page * limit) < _this.datas.length;
        }
        return false;
    };

    _this.loadMore = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var appState = Globals.get('appState');

        $timeout(function(){
            //_this.page = _this.page + 1;
            _this.getPageState(appState, true);

            $scope.$broadcast('scroll.loadMore');
        });
    };

    _this.getSourceListLocal = function (blnRefresh) {

        blnRefresh = blnRefresh || false;

        var   defer = $q.defer(),
                appState = Globals.get('appState');

        // GET & SAVE THE SOURCE LIST PROMISE
        DataSourceInterface.getSourceIndex(blnRefresh, appState).then(function(d) {

            // RESET PAGING
            _this.getPageState(appState);

            // SET DATA TO "$scope.datas" SO DIRECTIVE WILL PICK IT UP & DISPLAY IT WITHIN ITS TEMPLATE(S)
            _this.datas = d;

            AppUtil.log(_this.datas, 1, 'CURRENT SOURCE DATA');

            // BROADCAST REFRESH SO SCROLLER WILL RESIZE APPROPRIATELY
            $scope.$broadcast('scroll.refreshComplete');

            // REDIRECT TO HOME IF NO SOURCE DEFINED
            if (appState.sourceDetail) {
                if (_this.datas.length <= 0) {
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

    _this.ctrlInit = function(blnRefresh) {

        var defer = $q.defer();

        var blnRefresh = blnRefresh || false;

        if (blnRefresh) {

            // GET / REFRESH SCREEN STATE
            Device.ScreenState().then(function (objScreen) {
                _this.screenState = objScreen;
            });

            // APP INIT WILL REFRESH SOURCE LIST
            $rootScope.appInit().then(function(d) {

                // REFRESH REQUESTED SOURCE INDEX DATA?
                if (blnRefresh || false) {

                    // GET THE SOURCE LIST
                    _this.getSourceListLocal().then(function(d){

                        var applicationData = Globals.get('applicationData');

                        // ASSIGNMENT OF MEMORY VARIABLES TO SCOPE FOR ACCESS IN TEMPLATES

                        // GLOBAL SOURCE DATA
                        _this.sourceList = applicationData.sourceList;
                        _this.sourceTypes = applicationData.sourceTypes;
                        _this.sourceFilters = applicationData.sourceFilters;
                        _this.sourceFilterLocks = applicationData.sourceFilterLocks;
                        _this.templateMap = applicationData.templateMap;
                        _this.sourceMetaMap = applicationData.sourceMetaMap;
                        _this.langLabels = applicationData.langLabels;

                        // STATE SPECIFIC SOURCE & DETAIL DATA
                        _this.appState = Globals.get('appState');
                        _this.sourceMeta = Globals.get('sourceMeta'); // THIS IS ALREADY SET BY THE ctrlInitProcess - so we dont need to call it from DataSourceInterface again
                        _this.detailCard = DataSourceInterface.getSourceCard();

                        // PASS / SAVE STATE SPECIFIC DETAILS NOT ALREADY SAVED TO GLOBALS
                        Globals.set('detailCard', _this.detailCard);
                        Globals.set('screenState', _this.screenState);

                        // RESOLVE PROMISE
                        defer.resolve(d);
                    });
                }
            });
        }

        return defer.promise;
    };

    // POINTER FOR TEMPLATES
    _this.doRefresh = function (blnRefresh) {
        _this.getSourceListLocal(blnRefresh);
    };

    _this.isActiveCard = function (cardData) {
        //console.log(cardData);
    };

    _this.activeClasses = {
        "true" : "is-active",
        "false" : ""
    };

    // SET TITLE
    //$ionicNavBarDelegate.title('<img src="img/logo.png" />');

    // SETUP LISTENERS FOR ORIENTATION CHANGE

    // ADD LISTENER ONLY ONCE
    if (!_this.listenersAdded) {

        _this.listenersAdded = true;

        var mq = window.matchMedia('(orientation: portrait)');

        var onScreenChange = function () {
            $timeout(function () {
                 Device.ScreenState().then(function (objScreen) {
                    _this.screenState = objScreen;
                 });
            }, 250);
        };

        mq.addListener(function(m) {
            console.log('listener for matchMedia fired');
            onScreenChange();
        });

        // window.addEventListener("orientationchange", function () {
        //     console.log('listener for orientationchange fired');
        //     onScreenChange();
        // }, true);

        // window.addEventListener("resize", function () {
        //     console.log('listener for resize fired');
        //     onScreenChange();
        // }, false);
    }


    // $scope.$on('$locationChangeSuccess', function(event) {
    //     // ON STATE CHANGE, TRIGGER
    //     console.log('2... @@@@@@@@@@@@@@@@@@@@@@ APP STATE', $rootScope.appState);
    // });


    $scope.$on("$stateChangeStart", function(event, data){
        var backButtonMode = 'hide';
        switch(data.name) {
            case 'app.sources':
                backButtonMode = 'home';
            break;
            case 'app.sourceIndex':
                backButtonMode = 'back';
            break;
            case 'app.sourceDetail':
                backButtonMode = 'back';
            break;
            case 'app.settings':
                backButtonMode = 'home';
            break;
        }
        console.log('???',event,data,backButtonMode);
        $rootScope.backButtonMode = backButtonMode;
        $rootScope.$broadcast('app-state-load-start');
    });

    // UPDATED LISTENERS FOR STATE CHANGE
    // IONIC HAS ISSUES WITH STANDARD ANGULAR STATE CONTROLLER
    // AND OFFERS THIS API INSTEAD TO HANDLE VIEW CHANGES
    $scope.$on("$ionicView.enter", function(event, data){

        console.log('1A... @@@@@@@@@@@@@@@@@@@@@@ VIEW ENTER', data.stateParams);

        if (data.stateParams && data.stateParams.sourceName) {

            $timeout(function (){

                Globals.set('appState', data.stateParams);

                console.log('1A... @@@@@@@@@@@@@@@@@@@@@@ APP STATE AVAILABLE', data.stateParams);

                // ON STATE CHANGE, TRIGGER
                $rootScope.$broadcast('app-state-update');

            })
        }
    });

    $scope.$on('app-state-load-start', function () {

        // TRIGGER INITIAL LOADER DISPLAY
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

    });

    $scope.$on('app-state-load-complete', function () {
        $timeout(function () {
            // HIDE THE LOADER
            $ionicLoading.hide();
        });
    });

    // LISTEN FOR ACTUAL STATE UPDATES
    $scope.$on('app-state-update', function(event){

        // // TRIGGER INITIAL LOADER DISPLAY
        // $ionicLoading.show({
        //     content: 'Loading',
        //     animation: 'fade-in',
        //     showBackdrop: true,
        //     maxWidth: 200,
        //     showDelay: 0
        // });

        $timeout(function () {

            var appState, updateIsReal;

            appState = Globals.get('appState');
            updateIsReal = true;

            console.log('2B... @@@@@@@@@@@@@@@@@@@@@@ APP STATE', appState);

            // PUSH NEW STATE TO HISTORY
            //_this.saveHistory(AppUtil.getAppState());

            // SET TITLE
            //$ionicNavBarDelegate.title('<img src="img/logo.png" />');

            // INIT ON NEW VISIT OR IF SOURCE HAS CHANGED
            _this.ctrlInit(updateIsReal).then(function(d){

                console.log('Contoller INIT');

                //TEMP DEBUG
                var debugTemplates = _this.sourceMeta.templates;
                console.log('State of common right now:', _this);
                console.log('***** Template Hierarchy ******');
                console.log('Main Container:', debugTemplates.containerSet);
                console.log('Stream Template:', debugTemplates.stream);
                console.log('Cards (in its Own Stream) Template:', debugTemplates.card);
                console.log('Cards (in the Home Stream) Template:', debugTemplates.homeCard);
                console.log('Article / Detail Template:', debugTemplates.detail);
                console.log('***** /Template Hierarchy ******');

                console.log('State of Globals:', $rootScope.runtime);

                // WAIT FOR DIGESTS TO COMPLETE
                $timeout(function () {

                    // SHOW POPOVER ON FIRST RUN (OR AFTER CLEAR)
                    _this.menuPopOver();

                    // HIDE THE LOADER
                    $rootScope.$broadcast('app-state-load-complete');
                });

                // UPDATE BACK BUTTON DISPLAY
                //$rootScope.objBackButton = {};//$rootScope.backButtonDisplay(appState);
                //_this.sourceMeta = DataSourceInterface.getSourceMeta(appState);

                return d;

            });
        });
    });
}])

.controller('CommonSourceCtrl', ['$scope', function ($scope) {

}])

/**
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @return {[type]}
 */
.controller('SettingsCtrl', function($scope, $rootScope, $timeout, $cordovaNetwork, $ionicPopup, $ionicNavBarDelegate, AppUtil) {

    var _this = this;

    _this.saveFilters = function (sourceFilters) {
        $timeout(function(){
            var settingsStorage = AppUtil.getSimpleLocalStore('settings');
            console.log('Source Filters', sourceFilters);
            settingsStorage.set(sourceFilters);
        });
    };

    _this.resetSettings = function() {
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

    // HIDE THE LOADER
    $rootScope.$broadcast('app-state-load-complete');
})

/**
 * Source List Controller
 * @param  {[type]}
 * @return {[type]}
 * Note: This should really be AppCtrl and HomeCtrl saved for the home stream
 */
.controller('SourceListCtrl', function($rootScope, $state, $stateParams, $ionicPlatform, $ionicPopup, $ionicLoading, $sce, $cordovaNetwork, $ionicScrollDelegate, Globals) {

    var _this = this;

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
                scope: this,
            }).then(function(popover) {
                this.popover = popover;
                var element = document.getElementById('navicon');
                popover.show(element);

                this.closePopover = function() {
                    this.popover.hide();
                    this.popover.remove();
                };
            });
        }
    });

    var applicationData = Globals.get('applicationData');

    // ASSIGNMENT OF MEMORY VARIABLES TO SCOPE FOR ACCESS IN TEMPLATES

    // GLOBAL SOURCE DATA
    _this.sourceList = applicationData.sourceList;
    _this.sourceTypes = applicationData.sourceTypes;
    _this.templateMap = applicationData.templateMap;
    _this.sourceMetaMap = applicationData.sourceMetaMap;

    // HIDE THE LOADER
    $rootScope.$broadcast('app-state-load-complete');

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

//.controller('CommonSourceCtrl', ['$scope','$rootScope','$urlMatcherFactory','$location','$q','$timeout','$state','$stateParams','$filter','$ionicPlatform','$ionicPopup','$ionicLoading','$ionicPopover','$sce','$cordovaNetwork','$ionicScrollDelegate','$ionicNavBarDelegate','AppUtil','Globals','DataSourceInterface', function($scope, $rootScope, $urlMatcherFactory, $location, $q, $timeout, $state, $stateParams, $filter, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicPopover, $sce, $cordovaNetwork, $ionicScrollDelegate, $ionicNavBarDelegate, AppUtil, Globals, DataSourceInterface) {




// HISTORY HANDLERS
// _this.saveHistory = function(appState) {

//     appState = appState ||_this.knownState;


//     // GET THE LAST STATE IN HISTORY
//     var objLastState = $rootScope.aryHistory[$rootScope.aryHistory.length - 1] || {};

//     // SAVE THE STATE TO HISTORY (IF NEW)
//     var objThisState = {
//         sourceName : appState.sourceName || false ,
//         sourceDetail : appState.sourceDetail || false
//     };

//     // SHOULD WE SAVE IT?
//     if (objThisState.sourceName != objLastState.sourceName || objThisState.sourceDetail != objLastState.sourceDetail) {
//         // IS THIS SAME DIFFERENT FROM THE LAST? SAVE CURRENT
//         $rootScope.aryHistory.push(objThisState);
//     }
// };

// $rootScope.historyBack = function() {

//     $ionicLoading.show({
//         content: 'Loading',
//         animation: 'fade-in',
//         showBackdrop: true,
//         maxWidth: 200,
//         showDelay: 0
//     });

//     $timeout(function() {

//         // // GET COPY OF CURRENT STATE FROM ROOTSCOPE
//         // var appState = angular.extend({},_this.knownState);

//         // GET THIS STATE
//         var objThisState =_this.knownState

//         if ($rootScope.aryHistory.length) {

//             // GET THE LAST STATE (& POP IT OFF THE ARRAY)
//             var objLastState = $rootScope.aryHistory.pop();

//             // IS THE LAST STATE THE SAME AS THE CURRENT STATE?
//             if (objLastState.sourceName == objThisState.sourceName && objLastState.sourceDetail == objThisState.sourceDetail) {

//                 // THEN WE NEED TO GO BACK ONE MORE
//                 if ($rootScope.aryHistory.length) {

//                     // GET THE NEXT IN LINE
//                     objLastState = $rootScope.aryHistory.pop();
//                 }
//             }

//             // UPDATE ROOTSCOPE APP STATE
//             $rootScope.appState = objLastState;

//         } else {

//             // UPDATE ROOTSCOPE APP STATE
//             $rootScope.appState = {
//                 sourceName : 'homestream'
//             };

//         }

//         /* UPDATE STATE PARAMS
//         if ($rootScope.appState.sourceDetail) {
//             $location.path('/app/source' + $rootScope.appState.sourceName + '/' +$rootScope.appState)
//         } else {
//             $location.path('/app/source' + $rootScope.appState.sourceName)
//         }*/

//         // APP STATE UPDATED
//         $rootScope.$broadcast('app-state-update');

//     });
// };

// _this.stateChanged = function (stateParams) {
//     if (!stateParams.sourceName) {
//         return true;
//     }

//     if (stateParams.sourceName !=_this.knownState.sourceName) {
//         return true;
//     }

//     if (stateParams.hasOwnProperty('sourceDetail') && stateParams.sourceDetail !=_this.knownState.sourceDetail) {
//         return true;
//     }

//     return false;
// };
