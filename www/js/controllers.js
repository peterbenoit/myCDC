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
 * Home Controller
 * @param  {[type]}
 * @return {[type]}
 * Note: This should really be AppCtrl and HomeCtrl saved for the home stream
 */
.controller('HomeCtrl', function($scope, $ionicPlatform, $ionicLoading, $timeout, $rootScope, $ionicPopover, $ionicHistory, returnToState, $stateParams, $cordovaNetwork) {
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
.controller('CommonSourceCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicPopup, $sce, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.ctrlInit = function(blnRefresh) {

        var blnRefresh = blnRefresh || false;

        $scope.sourceName = $stateParams.sourceName;

        $scope.sourceListPromise.then(function(data) {

            // REFRESH REQUESTED SOURCE INDEX DATA?
            if (blnRefresh || !$scope.sourceIndexPromise || false) {

                console.log('ctrlInit Refresh');
                console.log($scope.sourceList);

                var sourceMeta = $rootScope.getSourceMeta($stateParams);

                console.log('sourceMeta');
                console.log(sourceMeta);

                // GET & SAVE THE SOURCE LIST PROMISE
                $scope.sourceIndexPromise = $rootScope.getSourceIndex($stateParams);

                // CONTINUE PROMISE CHAIN
                $scope.sourceIndexPromise.then(function(d) {

                    $scope.datas = $scope.sourceIndex;
                    console.log('$scope.datas');
                    console.log($scope.datas);
                    $ionicLoading.hide();

                    // RETURN TRIMMED DATA TO CHAIN
                    return d.data;
                });
            }
        });
    };

    // INIT ON NEW VISIT OR IF SOURCE HAS CHANGED
    $scope.ctrlInit($scope.sourceName || ($stateParams.sourceName !== $scope.sourceName));

})










/********************************************************************************
!!!!!!!!!!!!!!!!!!!!!!!!     NOT USING ANY OF THIS BELOW       !!!!!!!!!!!!!!!!!!!!
*********************************************************************************/







// ARTICLE: SOURCEURL w/ NOCHROME
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
.controller('DotwCtrl', function($scope, $rootScope, $location, $ionicLoading, DataFactory, LocalStorageFactory, $cordovaNetwork) {
    $scope.viewId = 'DotwView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/disease/';
    $scope.name = 'Disease of the Week';
    $rootScope.showleft = false;

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var DotwData = DataFactory('Dotw', {
        url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Disease%20of%20the%20Week&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language'
    }, function(d) {

        var start = new Date().getTime(),
            end, time, datum;

        console.log('d!!');
        console.log(d);

        var data = d.data.results;

        if (data.length) {
            for (var i = data.length - 1; i >= 0; i--) {
                datum = data[i];
                hasImage = false;

                // format the dateModified
                time = moment(datum.datePublished);
                datum.datePublished = time.format('MMMM Do, YYYY');

                // if there's an enclosure
                if (datum.enclosures.length) {
                    enclosures = datum.enclosures;

                    // look for the image enclosure
                    for (var j = enclosures.length - 1; j >= 0; j--) {
                        if (enclosures[j].contentType.indexOf('image') > -1) {
                            hasImage = true;
                            datum.imageSrc = enclosures[j].resourceUrl;
                            break;
                        }
                    }
                }

                datum.hasImage = hasImage;
            }

            end = new Date().getTime();
            time = (end - start) / 1000;

            if (window.plugins && window.plugins.toast) {
                window.plugins.toast.showShortTop(time);
            } else {
                console.log(time);
            }

            return datum;
        }

        return [];
    });

    var getData = function() {
        DotwData.async().then(
            // successCallback
            function() {
                $scope.datas = DotwData.getAll(true);
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                console.log('YAY $scope.datas');
                console.log($scope.datas);
            },
            // errorCallback
            function() {
                $scope.datas = DotwStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                console.log('NAY $scope.datas');
                console.log($scope.datas);
            },
            // notifyCallback
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('DiseaseCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicPopup, $sce, DotwData, DotwContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    DotwData.async().then(function() {
        init();
    });

    var init = function() {
        $ionicLoading.hide();
        $scope.data = DotwData.get($stateParams.idx);
        $scope.nochrome = false;
        $scope.name = 'Disease of the Week';
        $rootScope.showleft = true;

        var sourceurl = DotwData.getSourceUrl($stateParams.idx),
            filename = sourceurl.split('/').pop(),
            newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
            nochromeurl = sourceurl.replace(filename, newfilename);

        DotwContent.getStatus(nochromeurl).then(
            function(resp) {
                if (resp.data.status === '200') {
                    $scope.nochrome = true;
                    $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
                } else {
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
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
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
.controller('FluViewCtrl', function($scope, $stateParams, $ionicLoading, $ionicPopup, $ionicHistory, $sce, FluViewData, FluViewStorage, FluViewContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    FluViewData.async().then(
        // successCallback
        function() {
            $scope.data = FluViewData.getAll();
            $ionicLoading.hide();
            getContent();
            $scope.$broadcast('scroll.refreshComplete');
        },
        // errorCallback
        function() {
            $scope.data = FluViewStorage.all();
            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
            getContent();
            $scope.$broadcast('scroll.refreshComplete');
        },
        // notifyCallback
        function() {}
    );

    getContent = function() {
        $scope.id = $scope.data.id;
        $scope.name = 'FluView Weekly Summary';

        // if (window.device) {
        //     $scope.devicePlatform = device.platform;
        // }

        FluViewContent.getContent($scope.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
})

// ARTICLE: SOURCEURL w/ NOCHROME
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('HealthArticlesCtrl', function($scope, $location, $ionicLoading, HealthArticlesData, HealthArticlesStorage, ScreenSize, $cordovaNetwork) {
    $scope.viewId = 'HealthArticlesView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/healtharticle/';
    $scope.name = 'Health Articles';
    $scope.hasloaded = true;

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.init = function() {
        //console.log('init');
        $scope.hasloaded = false;
    };

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
        pageSize = 10;

    $scope.screensize = ScreenSize;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('HealthArticleCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicPopup, $sce, HealthArticlesData, HealthArticlesContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    HealthArticlesData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = HealthArticlesData.get($stateParams.idx);
        $scope.nochrome = false;
        $scope.name = 'Health Articles';
        $rootScope.showleft = true;

        var sourceurl = HealthArticlesData.getSourceUrl($scope.data.id),
            filename = sourceurl.split('/').pop(),
            newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
            nochromeurl = sourceurl.replace(filename, newfilename);

        HealthArticlesContent.getStatus(nochromeurl).then(
            function(resp) {
                if (resp.data.status === '200') {
                    $scope.nochrome = true;
                    $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
                } else {
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
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
})

// ARTICLE: SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('CDCAtwsCtrl', function($scope, $location, $ionicLoading, CDCAtwsData, CDCAtwsStorage, $cordovaNetwork) {
    $scope.viewId = 'CDCAtwsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/cdcatw/';
    $scope.name = 'CDC Around the World';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var getData = function() {
        CDCAtwsData.async().then(
            function() {
                $scope.datas = CDCAtwsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = CDCAtwsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('CDCAtwCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, CDCAtwsData, CDCAtwsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    CDCAtwsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = CDCAtwsData.get($stateParams.idx);
        $scope.name = 'CDC Around the World';
        $scope.viewId = 'CDCAtwView';
        $rootScope.showleft = true;

        CDCAtwsContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
})

//////////////////////////////////

// ARTICLE: SYNDICATED CONTENT
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('VitalSignsCtrl', function($scope, $rootScope, $location, $ionicLoading, VitalSignsData, VitalSignsStorage, $cordovaNetwork) {
    $scope.viewId = 'VitalSignsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/vitalsign/';
    $scope.name = 'Vital Signs';
    $rootScope.showleft = false;

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('VitalSignCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, VitalSignsData, VitalSignsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    VitalSignsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = VitalSignsData.get($stateParams.idx);
        $scope.name = 'Vital Signs';
        $scope.viewId = 'VitalSign';
        $rootScope.showleft = true;

        //console.log($scope.data);

        VitalSignsContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
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
.controller('FastStatsCtrl', function($scope, $location, $ionicLoading, FastStatsData, FastStatsStorage, $cordovaNetwork) {
    $scope.viewId = 'FastStatsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/FastStat/';
    $scope.name = 'FastStats';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('FastStatCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, FastStatsData, FastStatsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    FastStatsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = FastStatsData.get($stateParams.idx);
        $scope.name = 'FastStats';
        $scope.viewId = 'FastStat';

        FastStatsContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    // $scope.shareData = function() {
    //     if (window.plugins && window.plugins.socialsharing) {
    //         var subject = $scope.data.name,
    //             message = 'Check out this article from CDC: ' + $scope.data.name,
    //             link = $scope.data.sourceUrl,
    //             image = $scope.data.imageSrc;
    //         message = message.replace(/(<([^>]+)>)/ig, '');

    //         //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
    //         //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
    //         window.plugins.socialsharing.share(message, subject, image, link);
    //     }
    //     else {
    //         $ionicPopup.alert({title: 'Social Sharing not available.'});
    //     }
    // };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
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
.controller('WeeklyDiseaseCaseCountsCtrl', function($scope, $location, $ionicLoading, WeeklyCaseCountsData, WeeklyCaseCountsStorage, $cordovaNetwork) {
    $scope.viewId = 'WeeklyDiseaseCaseCountsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/WeeklyDiseaseCaseCount/';
    $scope.name = 'Disease Case Counts';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('WeeklyDiseaseCaseCountCtrl', function($scope, $stateParams, $sce, $ionicLoading, $ionicPopup, WeeklyCaseCountsData, WeeklyCaseCountsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    WeeklyCaseCountsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = WeeklyCaseCountsData.get($stateParams.idx);
        $scope.name = 'Weekly Disease Case Counts';
        $scope.viewId = 'WeeklyDiseaseCaseCount';

        var sourceurl = WeeklyCaseCountsData.getSourceUrl($stateParams.idx),
            filename = sourceurl.split('/').pop(),
            newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
            nochromeurl = sourceurl.replace(filename, newfilename);

        WeeklyCaseCountsContent.getStatus(nochromeurl).then(
            function(resp) {
                if (resp.data.status === '200') {
                    $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
                } else {
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
    };

    // $scope.shareData = function() {
    //     if (window.plugins && window.plugins.socialsharing) {
    //         var subject = $scope.data.name,
    //             message = 'Check out this article from CDC: ' + $scope.data.name,
    //             link = $scope.data.sourceUrl,
    //             image = $scope.data.imageSrc;
    //         message = message.replace(/(<([^>]+)>)/ig, '');

    //         //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
    //         //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
    //         window.plugins.socialsharing.share(message, subject, image, link);
    //     }
    //     else {
    //         $ionicPopup.alert({title: 'Social Sharing not available.'});
    //     }
    // };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
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
.controller('EIDsCtrl', function($scope, $location, $ionicLoading, EIDsData, EIDsStorage, $cordovaNetwork) {
    $scope.viewId = 'EIDsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/EID/';
    $scope.name = 'Emerging Infectious Disease (EID)';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('EIDCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, EIDsData, EIDsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    EIDsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = EIDsData.get($stateParams.idx);
        $scope.name = 'Emerging Infectious Disease (EID)';
        $scope.viewId = 'EID';

        EIDsContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
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
.controller('MMWRsCtrl', function($scope, $location, $ionicLoading, MMWRsData, MMWRsStorage, $cordovaNetwork) {
    $scope.viewId = 'MMWRsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/MMWR/';
    $scope.name = 'Morbidity and Mortality Weekly Report (MMWR)';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('MMWRCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, MMWRsData, MMWRsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    MMWRsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = MMWRsData.get($stateParams.idx);
        $scope.name = 'Morbidity and Mortality Weekly Report (MMWR)';

        MMWRsContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
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
.controller('PCDsCtrl', function($scope, $location, $ionicLoading, PCDsData, PCDsStorage, $cordovaNetwork) {
    $scope.viewId = 'PCDsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/PCD/';
    $scope.name = 'Preventing Chronic Disease (PCD)';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

    $scope.paginationLimit = function(data) {
        return pageSize * page;
    };

    $scope.hasMoreItems = function() {
        //console.log(page < ($scope.datas.length / pageSize));
        //console.log(page);
        //console.log($scope.datas.length / pageSize);
        //console.log($scope.datas.length);
        //console.log(pageSize);
        return page < ($scope.datas.length / pageSize);
    };

    $scope.loadMore = function() {
        page = page + 1;
        $scope.$broadcast('scroll.infiniteScrollComplete');
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
.controller('PCDCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, PCDsData, PCDsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    PCDsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = PCDsData.get($stateParams.idx);
        $scope.name = 'Preventing Chronic Disease (PCD)';
        $scope.viewId = 'PDC';

        PCDsContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
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
.controller('NewsroomsCtrl', function($scope, $location, $ionicLoading, NewsroomsData, NewsroomsStorage, $cordovaNetwork) {
    $scope.viewId = 'NewsroomsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Newsroom/';
    $scope.name = 'Newsroom';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('NewsroomCtrl', function($scope, $stateParams, $sce, $ionicLoading, $ionicPopup, NewsroomsData, NewsroomsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    NewsroomsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.news = NewsroomsData.get($stateParams.idx);
        $scope.nochrome = false;
        $scope.name = 'Newsroom';
        $scope.viewId = 'Newsroom';

        var sourceurl = NewsroomsData.getSourceUrl($stateParams.idx),
            filename = sourceurl.split('/').pop(),
            newfilename = filename.split('.')[0] + '_nochrome.' + filename.split('.')[1],
            nochromeurl = sourceurl.replace(filename, newfilename);

        NewsroomsContent.getStatus(nochromeurl).then(
            function(resp) {
                if (resp.data.status === '200') {
                    $scope.nochrome = true;
                    $scope.frameUrl = $sce.trustAsResourceUrl(nochromeurl);
                } else {
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
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    // $scope.viewOnCDC = function() {
    //     window.open($scope.data.sourceUrl, '_system');
    // };
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
.controller('OutbreaksCtrl', function($scope, $location, $ionicLoading, OutbreaksData, OutbreaksStorage, $cordovaNetwork) {
    $scope.viewId = 'OutbreaksView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Outbreak/';
    $scope.name = 'Outbreaks';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('OutbreakCtrl', function($scope, $stateParams, $sce, $ionicLoading, $ionicPopup, OutbreaksData, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    OutbreaksData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = OutbreaksData.get($stateParams.idx);
        $scope.name = 'Outbreaks';
        $scope.viewId = 'Outbreak';

        var sourceurl = OutbreaksData.getSourceUrl($stateParams.idx);

        $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);

        $ionicLoading.hide();
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    // $scope.viewOnCDC = function() {
    //     window.open($scope.data.sourceUrl, '_system');
    // };
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
.controller('TravelNoticesCtrl', function($scope, $location, $ionicLoading, TravelNoticesData, TravelNoticesStorage, $cordovaNetwork) {
    $scope.viewId = 'TravelNoticesView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/TravelNotice/';
    $scope.name = 'Travel Notices';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('TravelNoticeCtrl', function($scope, $stateParams, $sce, $ionicLoading, $ionicPopup, TravelNoticesData, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    TravelNoticesData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = TravelNoticesData.get($stateParams.idx);
        $scope.name = 'Travel Notices';
        $scope.viewId = 'TravelNotice';

        var sourceurl = TravelNoticesData.getSourceUrl($stateParams.idx);

        $scope.frameUrl = $sce.trustAsResourceUrl(sourceurl);

        $ionicLoading.hide();
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    // $scope.viewOnCDC = function() {
    //     window.open($scope.data.sourceUrl, '_system');
    // };
})




// NO SYDICATED OR SOURCEURL CONTENT - content is derived from the source feed
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PodcastsCtrl', function($scope, $location, $ionicLoading, PodcastsData, PodcastsStorage, $cordovaNetwork) {
    $scope.viewId = 'PodcastsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Podcast/';
    $scope.name = 'Podcasts';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var getData = function() {
        PodcastsData.async().then(
            function() {
                $scope.datas = PodcastsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = PodcastsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('PodcastCtrl', function($scope, $ionicLoading, $ionicPopup, $stateParams, $sce, PodcastsData, $cordovaNetwork) {
    var position = $stateParams.idx,
        count = PodcastsData.getCount();

    PodcastsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = PodcastsData.get(position);
        $scope.id = PodcastsData.getId(position);
        $scope.name = 'Podcasts';
        $scope.viewId = 'Podcast';

        var audio = PodcastsData.getAudio(position);

        $scope.previous = {
            'visible': position > 0,
            'position': parseInt(position) - 1
        };

        $scope.next = {
            'visible': position < count - 1,
            'position': parseInt(position) + 1
        };

        $scope.transcript = PodcastsData.getTranscript(position);
        $scope.audio = $sce.trustAsResourceUrl(audio[0]);
        $scope.type = audio[1];
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this podcast from CDC:' + $scope.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
})

// NO SYDICATED OR SOURCEURL CONTENT - content is derived from the source feed
/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('PHILsCtrl', function($scope, $location, $ionicLoading, PHILsData, PHILsStorage, $cordovaNetwork) {
    $scope.viewId = 'PHILsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/PHIL/';
    $scope.name = 'Public Health Image Library';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var getData = function() {
        PHILsData.async().then(
            function() {
                $scope.datas = PHILsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = PHILsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 20;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('PHILCtrl', function($scope, $ionicLoading, $ionicPopup, $stateParams, $sce, PHILsData, $cordovaNetwork) {
    var position = $stateParams.idx,
        count = PHILsData.getCount();

    PHILsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = PHILsData.get($stateParams.idx);

        // $scope.data = PHILsData.get(position);
        // $scope.id = PHILsData.getId(position);
        $scope.name = 'Public Health Image Library';
        $scope.viewId = 'PHIL';

        $scope.image = $scope.data.enclosures[0].resourceUrl;

        $scope.previous = {
            'visible': position > 0,
            'position': parseInt(position) - 1
        };

        $scope.next = {
            'visible': position < count - 1,
            'position': parseInt(position) + 1
        };
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this image from CDC:' + $scope.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, 'Public Health Image Library', image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
})



/**
 * *******************************************************************************************
 *                                      BLOGS
 * *******************************************************************************************
 */

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
.controller('PHMblogsCtrl', function($scope, $location, $ionicLoading, PHMblogsData, PHMblogsStorage, $cordovaNetwork) {
    $scope.viewId = 'PHMblogsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/PHMblog/';
    $scope.name = 'Public Health Matters Blog';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var getData = function() {
        PHMblogsData.async().then(
            function() {
                $scope.datas = PHMblogsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = PHMblogsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('PHMblogCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, PHMblogsData, PHMblogsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    PHMblogsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = PHMblogsData.get($stateParams.idx);
        $scope.name = 'Public Health Matters Blog';
        $scope.viewId = 'PHM';

        PHMblogsContent.getContent($scope.data.id).then(
            function(resp) {
                $scope.content = $sce.trustAsHtml(resp.data.results.content);
                $ionicLoading.hide();
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
    $scope.postComment = function() {
        window.open($scope.data.sourceUrl + '#respond', '_system');
    };
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
.controller('DirectorsBlogsCtrl', function($scope, $location, $ionicLoading, DirectorsBlogsData, DirectorsBlogsStorage, $cordovaNetwork) {
    $scope.viewId = 'DirectorsBlogsView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/directorblog/';
    $scope.name = 'CDC Directors Blog';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var getData = function() {
        DirectorsBlogsData.async().then(
            function() {
                $scope.datas = DirectorsBlogsData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = DirectorsBlogsStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('DirectorsBlogCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, DirectorsBlogsData, DirectorsBlogsContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    DirectorsBlogsData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = DirectorsBlogsData.get($stateParams.idx);
        $scope.name = 'CDC Directors Blog';
        $scope.viewId = 'DirectorsBlog';

        DirectorsBlogsContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
    $scope.postComment = function() {
        window.open($scope.data.sourceUrl + '#respond', '_system');
    };
})


/**
 * *******************************************************************************************
 *                                      FACTS
 * *******************************************************************************************
 */

.controller('DYKCtrl', function($scope, $stateParams, $ionicLoading, $ionicPopup, $ionicHistory, $sce, DidYouKnowData, DidYouKnowStorage, DidYouKnowContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    DidYouKnowData.async().then(
        // successCallback
        function() {
            $scope.data = DidYouKnowData.getAll();
            $ionicLoading.hide();
            getContent();
            $scope.$broadcast('scroll.refreshComplete');
        },
        // errorCallback
        function() {
            $scope.data = DidYouKnowStorage.all();
            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
            getContent();
            $scope.$broadcast('scroll.refreshComplete');
        },
        // notifyCallback
        function() {}
    );

    getContent = function() {
        $scope.name = 'Did You Know?';
        $scope.viewId = 'DidYouKnow';

        if (window.device) {
            $scope.devicePlatform = device.platform;
        }

        DidYouKnowContent.getContent($scope.data.id).then(
            function(resp) {
                if (_.isEmpty(resp.data.results)) {
                    $ionicPopup.alert({
                        title: 'Content not available.',
                        template: 'Sorry, we could not seem to find that content. Please try again.'
                    });
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                } else {
                    $scope.content = $sce.trustAsHtml(resp.data.results.content);
                    $ionicLoading.hide();
                }
            },
            function() {
                $ionicPopup.alert({
                    title: 'Content not available.',
                    template: 'Sorry, we could not seem to find that content. Please try again.'
                });
                $ionicLoading.hide();
                $ionicHistory.goBack();
            },
            function() {}
        );
    };

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
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
.controller('FactoftheWeekCtrl', function($scope, $location, $ionicLoading, FactoftheWeekData, FactoftheWeekStorage, $cordovaNetwork) {
    $scope.viewId = 'FactoftheWeekView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/Fact/';
    $scope.name = 'Fact of the Week';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
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
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('FOTWCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $sce, FactoftheWeekData, FactoftheWeekContent, $cordovaNetwork) {
    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    if ($stateParams.idx.length < 6) {
        $scope.data = FactoftheWeekData.get($stateParams.idx);
        $scope.id = FactoftheWeekData.getId($stateParams.idx);
    } else {
        $scope.id = $stateParams.idx;
    }
    $scope.name = 'Fact of the Week';

    FactoftheWeekContent.getContent($scope.id).then(
        function(resp) {
            $scope.content = $sce.trustAsHtml(resp.data.results.content);
            $ionicLoading.hide();
        },
        function() {
            $ionicPopup.alert({
                title: 'Content not available.',
                template: 'Sorry, we could not seem to find that content. Please try again.'
            });
            $ionicLoading.hide();
            $ionicHistory.goBack();
        },
        function() {}
    );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this article from CDC: ' + $scope.data.name,
                link = $scope.data.sourceUrl,
                image = $scope.data.imageSrc;
            // message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    $scope.viewOnCDC = function() {
        window.open($scope.data.sourceUrl, '_system');
    };
})


/**
 * *******************************************************************************************
 *                                      AUDIO/VIDEO
 * *******************************************************************************************
 */


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
.controller('YouTubesCtrl', function($scope, $location, $ionicLoading, YouTubesData, YouTubesStorage, $cordovaNetwork) {
    $scope.viewId = 'YouTubesView';
    $scope.datas = [];
    $scope.storage = '';
    $scope.url = '#/app/YouTube/';
    $scope.name = 'YouTube';

    $scope.loading = $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var getData = function() {
        YouTubesData.async().then(
            function() {
                $scope.datas = YouTubesData.getAll();
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {
                $scope.datas = YouTubesStorage.all();
                $scope.storage = 'Data from local storage';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function() {}
        );
    };

    getData();

    var page = 1,
        pageSize = 10;

    $scope.doRefresh = function() {
        getData();
    };

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
.controller('YouTubeCtrl', function($scope, $ionicLoading, $ionicPopup, $stateParams, $sce, YouTubesData, $cordovaNetwork) {
    var position = $stateParams.idx,
        count = YouTubesData.getCount();

    YouTubesData.async().then(function() {
        init();
    });

    var init = function() {
        $scope.data = YouTubesData.getById($stateParams.idx);
        $scope.id = $stateParams.idx;
        $scope.name = 'YouTube';

        // TODO: interesting that other similiar paging use this instead of that
        // $scope.data = PHILsData.get(position);
        // $scope.id = PHILsData.getId(position);

        $scope.previous = {
            'visible': position > 0,
            'position': parseInt(position) - 1
        };

        $scope.next = {
            'visible': position < count - 1,
            'position': parseInt(position) + 1
        };
    };



    // YouTubesContent.getContent($scope.id).then(
    //     function(resp) {
    //         $scope.content = $sce.trustAsHtml(resp.data.results.content);
    //         $ionicLoading.hide();
    //     },
    //     function() {
    //         $ionicPopup.alert({title: 'Content not available.', template: 'Sorry, we could not seem to find that content. Please try again.'});
    //         $ionicLoading.hide();
    //     },
    //     function() {}
    // );

    $scope.shareData = function() {
        if (window.plugins && window.plugins.socialsharing) {
            var subject = $scope.data.name,
                message = 'Check out this video from CDC:' + $scope.name,
                link = 'http://www.youtube.com/embed/' + $scope.data.sourceUrl.split('?v=')[1]; //$scope.data.sourceUrl;
            message = message.replace(/(<([^>]+)>)/ig, '');

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, image, link);
        } else {
            $ionicPopup.alert({
                title: 'Social Sharing not available.'
            });
        }
    };

    // $scope.viewOnCDC = function() {
    //     window.open($scope.data.sourceUrl, '_system');
    // };

    $scope.getVideoUrl = function() {
        return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.data.sourceUrl.split('?v=')[1]);
    };
})



/**
 * Facebook Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('FacebookCtrl', function($scope, $stateParams, $cordovaNetwork) {
    $scope.viewId = 'Facebook';
    $scope.sources = [{
        title: 'CDC',
        href: 'https://www.facebook.com/CDC',
        icon: 'ion-social-facebook'
    }, {
        title: 'CDC Espanol',
        href: 'https://www.facebook.com/CDCespanol',
        icon: 'ion-social-facebook'
    }];
})

/**
 * Twitter Controller
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.controller('TwitterCtrl', function($scope, $stateParams, $cordovaNetwork) {
    $scope.viewId = 'Twitter';
    $scope.sources = [{
        title: 'CDC',
        href: 'https://www.twitter.com/CDC',
        icon: 'ion-social-twitter'
    }, {
        title: 'CDC Espanol',
        href: 'https://www.twitter.com/CDCespanol',
        icon: 'ion-social-twitter'
    }];
});
