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

        $timeout(function() {
            var objSettingsHint = AppUtil.getSimpleLocalStore('settingsHint');

            // DETECT FIRST RUN
            var settingsHint = objSettingsHint.get();

            if (_this.isHomeSource && !settingsHint) {

                // Show the popover only on first load
                $ionicPopover.fromTemplateUrl('templates/popover.html', {
                    scope: $scope,
                }).then(function(popover) {
                    $scope.popover = popover;
                    var element = document.getElementById('settings-menu');
                    popover.show(element);

                    $scope.closePopover = function() {
                        objSettingsHint.set(true);
                        $scope.popover.hide();
                        $scope.popover.remove();
                    };
                });
            }
        }, 250);
    };

    _this.getPageState = function (appState, blnIncrement) {

        blnIncrement = blnIncrement || false;

        var sourceName = appState.sourceName || 'mobileapphomestream';

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
                        $state.go('app.sourceIndex', {sourceName: 'mobileapphomestream'});
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
                    _this.getSourceListLocal().then(function(currentSourceCardList){

                        var applicationData = Globals.get('applicationData');

                        // ASSIGNMENT OF MEMORY VARIABLES TO SCOPE FOR ACCESS IN TEMPLATES

                        // GLOBAL SOURCE DATA
                        //_this.homeStream = applicationData.homeStream;
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
                        _this.isHomeSource = (!!_this.sourceMeta.isHomeFeed);

                        var haveSourceDetailId = (_this.appState.sourceDetail && _this.appState.sourceDetail.length);

                        console.log('currentSourceCardList', currentSourceCardList);

                        if (!haveSourceDetailId && currentSourceCardList && currentSourceCardList.length == 1) {
                            _this.appState.sourceDetail = currentSourceCardList[0].id;
                            Globals.set('appState', _this.appState);
                            haveSourceDetailId = (_this.appState.sourceDetail && _this.appState.sourceDetail.length);
                        }

                        if (haveSourceDetailId) {
                            _this.detailCard = DataSourceInterface.getSourceCard();
                            _this.swipeMode = (currentSourceCardList.length == 1) ? 'source' : 'detail';
                        } else {
                            _this.detailCard = null;
                            _this.swipeMode = 'source';
                        }

                        // PASS / SAVE STATE SPECIFIC DETAILS NOT ALREADY SAVED TO GLOBALS
                        Globals.set('detailCard', _this.detailCard);
                        Globals.set('screenState', _this.screenState);

                        // RESOLVE PROMISE
                        defer.resolve(currentSourceCardList);
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

    $rootScope.swipe = function (direction) {
        if (_this.swipeMode == 'source') {
            _this.changeSource(direction);
        }

        if (_this.swipeMode == 'detail') {
            _this.changeDetail(direction);
        }
    };

    _this.goBack = function () {
        $ionicHistory.goBack();
    };
    _this.goHome = function () {
        $state.go('app.sourceIndex', {sourceName: $rootScope.homeStream});
    };
    _this.changeSource = function (direction) {
        // DISABLING THIS AS I RECALL WE DITCHED THIS CONCEPT
        if (direction && false) {

            // PROVIDE INDEX LOOKUP FOR SWIPE FUNCTIONALITY
            var sourceListIdxRef = [];
            angular.forEach(_this.sourceList, function (objSource, intIndex) {
                if (_this.sourceFilters[objSource.typeIdentifier][objSource.feedIdentifier].isEnabled) {
                    sourceListIdxRef.push(objSource.feedIdentifier);
                }
            });

            console.log('sourceListIdxRef', sourceListIdxRef);

            if (sourceListIdxRef && sourceListIdxRef.length) {
                var tmp = {};
                tmp.currMax = sourceListIdxRef.length - 1;
                tmp.currSource = _this.appState.sourceName;
                tmp.currIdx = sourceListIdxRef.indexOf(tmp.currSource) || 0;
                tmp.newIdx = null;
                tmp.newSource = null;

                if (direction == 'next') {
                    tmp.newIdx = ((tmp.currIdx + 1) > tmp.currMax) ? 0 : tmp.currIdx + 1;
                }

                if (direction == 'prev') {
                    tmp.newIdx = (tmp.currIdx <= 0) ? tmp.currMax : tmp.currIdx - 1;
                }

                if (tmp.newIdx !== null) {
                    tmp.newSource = sourceListIdxRef[tmp.newIdx];
                }

                $timeout(function(){
                    $state.go('app.sourceIndex', {sourceName: tmp.newSource, sourceDetail : ''});
                });
            }
        }
    };

    _this.changeDetail = function (direction) {

        if (direction && _this.datas && !!_this.datas.length && _this.datas.length > 1) {
            var cardListIdxRef = [];
            angular.forEach(_this.datas, function (objCard, intIndex) {
                cardListIdxRef.push(objCard.id);
            });

            if (cardListIdxRef && cardListIdxRef.length) {
                var tmp = {};
                tmp.currMax = cardListIdxRef.length - 1;
                tmp.currCardId = _this.appState.sourceDetail || "";
                tmp.currIdx = cardListIdxRef.indexOf(tmp.currCardId) || 0;
                tmp.newIdx = null;
                tmp.newCardId = null;

                if (direction == 'next') {
                    tmp.newIdx = ((tmp.currIdx + 1) > tmp.currMax) ? 0 : tmp.currIdx + 1;
                }

                if (direction == 'prev') {
                    tmp.newIdx = (tmp.currIdx <= 0) ? tmp.currMax : tmp.currIdx - 1;
                }

                if (tmp.newIdx !== null) {
                    tmp.newCardId = cardListIdxRef[tmp.newIdx];
                }

                $timeout(function(){
                    $state.go('app.sourceDetail', {sourceName: _this.appState.sourceName, sourceDetail : tmp.newCardId});
                });
            }
        }
    }

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
    }

    var listeners = {};

    listeners.stateChangeStart = $scope.$on("$stateChangeStart", function(event, data){
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

        // TRIGGER INITIAL LOADER DISPLAY
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    });

    // UPDATED LISTENERS FOR STATE CHANGE
    // IONIC HAS ISSUES WITH STANDARD ANGULAR STATE CONTROLLER
    // AND OFFERS THIS API INSTEAD TO HANDLE VIEW CHANGES
    listeners.ionicViewEnter = $scope.$on("$ionicView.enter", function(event, data){

        console.log('1A... @@@@@@@@@@@@@@@@@@@@@@ VIEW ENTER', data.stateParams);

        if (data.stateParams && data.stateParams.sourceName) {
            //alert(data.stateParams.sourceDetail);

            Globals.set('appState', data.stateParams);
            _this.appState = data.stateParams;

            $timeout(function (){

                console.log('1A... @@@@@@@@@@@@@@@@@@@@@@ APP STATE AVAILABLE', data.stateParams);

                // ON STATE CHANGE, TRIGGER
                $rootScope.$broadcast('app-state-update');

            })
        }
    });

    listeners.appStateLoadComplete = $scope.$on('loading-complete', function () {
        $timeout(function () {
            // HIDE THE LOADER
            //alert('called');
            $ionicLoading.hide();
        });
    });

    // LISTEN FOR ACTUAL STATE UPDATES
    listeners.appStateUpdate = $scope.$on('app-state-update', function(event){

        // // TRIGGER INITIAL LOADER DISPLAY
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $timeout(function () {

            _this.appState = Globals.get('appState');
            var updateIsReal = true;

            console.log('2B... @@@@@@@@@@@@@@@@@@@@@@ APP STATE', _this.appState);

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

                    // HIDE THE LOADER IF WE ARE LOOKING AT TEH STREAM VIEW (LOAD HIDE IS DELEGATED TO DETAIL LOADER FOR DETAIL VIEWS)
                    if (!(_this.appState.sourceDetail && _this.appState.sourceDetail.length)) {
                        $rootScope.$broadcast('loading-complete');
                        //alert('stream mode?');
                    } else {
                        //alert('detail mode?');
                    }
                });

                return d;
            });
        });
    });

    // REMOVE EVENT LISTENERS ON CONTROLLER DESTROY
    $scope.$on("$destroy", function() {
        console.log('Cleaning Up Listeners!');
        listeners.stateChangeStart();
        listeners.ionicViewEnter();
        listeners.appStateLoadStart();
        listeners.appStateLoadComplete();
        listeners.appStateUpdate();
    });
}])

.controller('CommonSourceCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {

    $scope.global.sourceHome = function () {
        $state.go('app.sourceIndex', {sourceName: $stateParams.sourceName});
    }

    $scope.global.showSourceHome = !!($stateParams.sourceName && ($stateParams.sourceName !== $scope.homeStream) && ($stateParams.sourceDetail && $stateParams.sourceDetail.length));

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
    $timeout(function() {
        $rootScope.$broadcast('loading-complete');
    }, 250);
})

/**
 * Source List Controller
 * @param  {[type]}
 * @return {[type]}
 * Note: This should really be AppCtrl and HomeCtrl saved for the home stream
 */
.controller('SourceListCtrl', function($rootScope, $state, $stateParams, $ionicPlatform, $ionicPopup, $ionicLoading, $sce, $cordovaNetwork, $ionicScrollDelegate, Globals, AppUtil) {

    var _this = this;
    var applicationData = Globals.get('applicationData');

    // ASSIGNMENT OF MEMORY VARIABLES TO SCOPE FOR ACCESS IN TEMPLATES

    // GLOBAL SOURCE DATA
    _this.sourceList = applicationData.sourceList;
    _this.sourceTypes = applicationData.sourceTypes;
    _this.templateMap = applicationData.templateMap;
    _this.sourceMetaMap = applicationData.sourceMetaMap;

    // HIDE THE LOADER
    $rootScope.$broadcast('loading-complete');

});
