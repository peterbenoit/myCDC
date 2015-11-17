/**
 *  myCDC
 *  TODO: info.plist NSAppTransportSecurity key needs to be corrected before deployment
 */
angular.module('mycdc', [
    'ionic',
    'mycdc.controllers',
    //'mycdc.data',
    'mycdc.directives',
    'mycdc.filters',
    'mycdc.services',
    //'mycdc.storage',
    'ngCordova',
    'ngAnimate',
    'angular.filter',
    'ngIOS9UIWebViewPatch'
])
/*
add to body class: platform-android
add to body class: platform-browser
add to body class: platform-ios
add to body class: platform-wp8
*/

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.run(function($ionicPlatform, $cordovaStatusbar, $rootScope, $location, $ionicBody, $timeout, $window, DeviceInfo, ScreenSize, $state, $stateParams, $cordovaNetwork, $ionicPopup, $http, $filter, $sce, $q) {

    var rs = $rootScope, href = window.location.href;

    // APP CONTAINER
    rs.app = {};
    rs.logLevel = -99;
    rs.aryHistory = [];

    // window.open should use inappbrowser
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
        //window.open = cordova.InAppBrowser.open;

        rs.type = $cordovaNetwork.getNetwork();
        rs.isOnline = $cordovaNetwork.isOnline();
        rs.isOffline = $cordovaNetwork.isOffline();
        rs.stateClasses = {};

        if (rs.isOffline) {
            $ionicPopup.alert({
                title: 'No Connection',
                template: 'You do not appear to be connected to the Internet. Some content you have downloaded may be out of date.'
            });
        }

        // listen for Online event
        rs.$on('$cordovaNetwork:online', function(event, networkState) {
            var onlineState = networkState;
        });

        // listen for Offline event
        rs.$on('$cordovaNetwork:offline', function(event, networkState) {
            var offlineState = networkState,
                isDirty = false;
                rs.log(offlineState);
        });

        $cordovaStatusbar.hide()
        $ionicPlatform.fullScreen();
    }

    // frameready() is called in embed.html, when the iframe has loaded
    // NOTE: this only works on a device
    window.frameready = function() {
        var iframe = $('#contentframe');
            anchors = iframe.contents().find('#contentArea a'); // only anchors in the content area

            //iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument

        $rootScope.$broadcast('source-detail-load-complete');

        body = iframe.contents().find('body');
        $(body).unbind("scroll");
        //  $(body).unbind("click");
        /*if (body.length) {
            body.append('<style>header, footer, #socialMediaShareContainer { display:none !important; }</style>')
        }*/

        // Capture any anchors clicked in the iframe document
        anchors.on('click', function(e) {
            e.preventDefault();

            //alert('CLICK');

            var framesrc = iframe.attr('src'),
                href = $(this).attr('href'),
                anchor = document.createElement('a');
                anchor.href = href;
            var anchorhost = anchor.hostname;

            // create an anchor with the href set to the iframe src to fetch the domain & protocol
            // WARN: cannot assume "http" || "www.cdc.gov"
            var frameanchor = document.createElement('a');
                frameanchor.href = framesrc;
            var framehost = frameanchor.hostname,
                frameprotocol = frameanchor.protocol;

            // if this anchor doesn't have a hostname
            if (anchorhost === '') {
                href = frameprotocol + '//' + framehost + href;
            }

            window.open(href, '_system');
        });
    };

    rs.$viewHistory = {
        histories: { root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 } },
        backView: null,
        forwardView: null,
        currentView: null,
        disabledRegistrableTagNames: []
    };

    rs.log = function (anyVar, intLevel, anyLabel) {
        intLevel = intLevel || 10;
        if (rs.logLevel >= intLevel) {
            if (anyLabel) {
                console.log('*** ' + anyLabel + ' ***');
            }
            console.log(anyVar);
            if (anyLabel) {
                console.log('*** /' + anyLabel + ' ***');
            }
        }
    };

    $ionicPlatform.ready(function() {
        if (window.device) {
            window.open = cordova.InAppBrowser.open;
        }

        // Open any EXTERNAL link with InAppBrowser Plugin
        $(document).on('click', '[href^=http], [href^=https]', function(e) {
            e.preventDefault();

            var t = $(this),
                href = t.attr('href');

                rs.log('Opening ', href);

            var ref = window.open(href, '_system');

            //TODO: not working in iOS
            // if (href.indexOf('cdc.gov') >= 0) {
            //     ref.addEventListener('loadstop', function() {
            //         ref.insertCSS({
            //             code: 'header#header { display: none; }footer#footer {display:none} div#socialMediaShareContainer.dd {display:none}'
            //         });
            //     });
            // }
        });

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        /**
         * https://github.com/gbenvenuti/cordova-plugin-screen-orientation
         */
        if (window.cordova && window.cordova.plugins) {
            // lock all devices into portrait mode, except for tablets
            screen.lockOrientation('portrait');
            if (ionic.Platform.isIPad() || ionic.Platform.is('androidtablet')) {
                // unlocking screen for orientation change
                screen.unlockOrientation();
            }
        }

        /*
        // kick off a media query listener to tag the body with a class
        var mq;
        if (window.matchMedia) {
            mq = window.matchMedia('(orientation: portrait)');

            if (mq.matches) {
                //portrait
                rs.orientation = 'portrait';
                $ionicBody.addClass('portrait');
            } else {
                //landscape
                rs.orientation = 'landscape';
                $ionicBody.addClass('landscape');
            }
            rs.$apply();

            mq.addListener(function(m) {
                if (m.matches) {
                    rs.log('changed to portrait');
                    rs.orientation = 'portrait';
                    $ionicBody.removeClass('landscape').addClass('portrait');
                } else {
                    rs.log('changed to landscape');
                    rs.orientation = 'landscape';
                    $ionicBody.removeClass('portrait').addClass('landscape');
                }
                rs.$apply();
            });
        }
        */
    });

    rs.dataProcessor = (function () {
        var processors = {
            cardTemplateInjector: function (d, objSourceMeta) {
                var idx1 = d.length, idx2, obj1, obj2, strCg, strCgStripped;
                var tmp = [];
                // POINTER TO ROOTSCOPE APP OBJECT (WITH SOURCE LIST, META, BLAH BLAH)
                var app = rs.app;
                rs.log(d, 1, 'CURRENT SOURCE PRE FIX');
                rs.log(objSourceMeta, 1, 'CURRENT SOURCE METADATA');

                while (idx1--) {
                    obj1 = d[idx1];

                    // PARSE & NORMALIZE TIME(S)
                    if (obj1.datePublished) {
                        var time = moment(obj1.datePublished);
                        obj1.datePublished = time.format('MMMM Do, YYYY');
                    }

                    // PROCESS ENCLOSURES
                    obj1.hasImage = false;
                    if (obj1.enclosures && obj1.enclosures.length) {
                        idx2 = obj1.enclosures.length;
                        while (idx2--) {
                            obj2 = obj1.enclosures[idx2];
                            if (obj2.contentType.indexOf('image') > -1) {
                                obj1.hasImage = true;
                                obj1.imageSrc = obj2.resourceUrl;
                            }
                        }
                    }

                    // PROCESS TAGS
                    if (obj1.tags && obj1.tags.length) {
                        idx2 = obj1.tags.length;
                        while (idx2--) {
                            obj2 = obj1.tags[idx2];
                            if (obj2.type.toLowerCase() == 'contentgroup') {
                                strCg = obj2.name;
                                strCgStripped = rs.cgNormalize(strCg);

                                // UPDATE BASED ON TAG DATA
                                obj1.feedIdentifier = strCgStripped;
                                obj1.feedIdentifier = strCgStripped;
                                obj1.templates = app.templateMap[obj1.feedIdentifier];
                                obj1.detailType = objSourceMeta.detailType;
                                obj1.contentType = objSourceMeta.contentType;
                                obj1.home = '#/app/source/' + obj1.feedIdentifier;
                                obj1.url = obj1.home + '/';

                                // SET STREAM TITLE
                                if (app.sourceMetaMap.hasOwnProperty(obj1.feedIdentifier)) {
                                    obj1.streamTitle = app.sourceMetaMap[obj1.feedIdentifier].title;
                                    obj1.detailType = app.sourceMetaMap[obj1.feedIdentifier].detailType;
                                    obj1.typeIdentifier = app.sourceMetaMap[obj1.feedIdentifier].typeIdentifier;
                                }

                                // TODO: consider using config.json for this data
                                if (obj1.feedIdentifier === 'eid') {
                                    obj1.hasImage = false;
                                }

                                if (obj1.feedIdentifier === 'vitalsigns') {
                                    obj1.hasImage = false;
                                }

                                if (obj1.feedIdentifier === 'outbreaks') {
                                    obj1.isOutbreak = true;
                                    obj1.hasImage = false;
                                }

                                if (obj1.feedIdentifier === 'travelnotices') {
                                    obj1.isAlert = obj1.name.indexOf('Alert') > -1;
                                    obj1.isWatch = obj1.name.indexOf('Watch') > -1;
                                    obj1.isWarning = obj1.name.indexOf('Warning') > -1;
                                }
                            }
                        }
                    }

                    // SAFETY DEFAULTS (SHOULD BE TEMPORARY UNTIL ALL FEEDS ARE STABILIZED)
                    obj1.contentgroup = obj1.contentgroup || 'homestream';
                    obj1.feedIdentifier = obj1.feedIdentifier || objSourceMeta.feedIdentifier;
                    obj1.typeIdentifier = obj1.typeIdentifier || objSourceMeta.typeIdentifier;
                    obj1.contentType = obj1.contentType || objSourceMeta.contentType;
                    obj1.streamTitle = obj1.streamTitle || objSourceMeta.title;
                    obj1.detailType = obj1.detailType || objSourceMeta.detailType;
                    obj1.templates = obj1.templates || angular.extend({}, app.templateMap[obj1.feedIdentifier]);
                    obj1.home = obj1.home || '#/app/source/' + obj1.feedIdentifier;
                    obj1.url = obj1.url || obj1.home + '/';

                    // IF NO TEMPLATES CAN BE FOUND, THE CONTENT GROUP IS INVALID, FLAG FOR DELETE
                    obj1.delete = !obj1.templates;
                    if (obj1.delete) {
                        rs.log(obj1, -1, 'UNABLE TO FIND CONTENT GROUP FOR THIS ARTICLE');
                    }

                }

                // DELETE BAD EGGS (MORE ACCURATELY, KEEP GOOD EGGS)
                //console.log(d);
                //console.log('I was able to filter ' + d.length);
                d = $filter('filter')(d, {
                    delete: false
                });
                //console.log('down to' + d.length);

                // APPLY SOURCE FILTERS
                d = $filter('applySourceFilters')(d, rs.app.sourceFilters);

                // LIMIT FINAL RESULTS TO 100
                if (d.length > 100) {
                    rs.log('Trimming array from ' + d.length + ' to 100' , -100);
                    d.splice(100)
                }

                rs.log(d, -1, 'CURRENT SOURCE POST FIX');

                return d;
            },
            feedNormalizer: function(d) {
                return d;
            },
            processTags: function(d) {
                // var currItem, data = d;

                // if (data.length) {
                //     for (var i = data.length - 1; i >= 0; i--) {
                //         currItem = data[i];

                //         // remove html from name
                //         currItem.name = $sce.trustAsHtml(currItem.name);
                //     }

                //     return data;
                // }

                // return [];
                //
                return d;
            },
            parseEncoding: function(d) {
                var currItem, data = d.data.results;    //TODO: breaking for fact of the week

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];
                        if (currItem.description) {
                            // remove encoding from description
                            var txt = document.createElement('textarea');
                            txt.innerHTML = currItem.description;
                            currItem.description = txt.value;
                        }
                    }

                    return data;
                }

                return [];
            },
            stripHtml: function(d) {
                var currItem, data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];

                        // TODO: need to talk with Sarah about this, Scientific names will need to be italic in a card name/title

                        // remove html from name
                        currItem.name = currItem.name.replace(/<[^>]+>/gm, '');

                        // remove html from description
                        currItem.description = currItem.description.replace(/<[^>]+>/gm, '');
                    }

                    return data;
                }

                return [];
            },
            extractVideoComments: function(d) {
                var currItem, data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];
                        if (currItem.description) {
                            currItem.description = currItem.description.split('Comments on this video')[0].trim();
                        }
                    }

                    return data;
                }

                return [];
            },
            flagOutbreak: function(d) {
                var currItem, data = d;

                if (data.length) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        currItem = data[i];
                        currItem.isOutbreak = true;
                    }

                    return data;
                }

                return [];
            },
            firstOnly: function(d) {
                var data = d;
                if (data.length) {
                    return [data[0]];
                }

                return null;
            },
            defaultHandler: function() {
                return [];
            }
        };

        return function (d, objMetaData) {

            var processor;

            data = (d.data && d.data.results) ? d.data.results : [];
            rs.log(data);

            // DID WE GET DATA?
            if (data.length > 0) {

                // PROCESS DATA (IF NEEDED)
                if (objMetaData.processors && objMetaData.processors.length) {

                    // REVERSE ARRA SINCE FOR REVERSE LOOP
                    objMetaData.processors.reverse();

                    // REVERSE LOOP THROUGH PROCESSORS
                    for (var i = objMetaData.processors.length - 1; i >= 0; i--) {
                        processor = objMetaData.processors[i];
                        data = processors[processor].call(this, data, objMetaData);
                    };
                }
            }

            //RETURN IT IN THE PROMISE CHAIN
            return data;

        }
    } ());

    rs.getSimpleLocalStore = (function() {

        var storePrefix = 'myCDC';

        return function (storeKey) {

            var storeName = storePrefix + '_' + storeKey;

            return {
                get: function() {

                    // TRY TO GET SAVED DATA
                    var jsonData = window.localStorage[storeName];

                    // RETURN IT IF FOUND
                    if (jsonData) {
                        return angular.fromJson(jsonData);
                    }

                    // DEFAULT RETURN
                    return false;
                },
                set: function(appdata) {
                    window.localStorage[storeName] = angular.toJson(appdata);
                },
                clear: function() {
                    window.localStorage.removeItem(storeName);
                }
            };
        };
    } ());

    rs.getLocalStoreByAppState = (function() {

        var storePrefix = 'myCDC';
        var dateFormat = 'YYYY-MM-DD-HH-mm-ss';
        var dataTimeoutInMinutes = 10;

        var isExpired = function (ageStoreKey) {

            // EXIT IF AGE STORE DOES NOT EXIST
            if (!window.localStorage.hasOwnProperty(ageStoreKey)) {
                rs.log(ageStoreKey + ' does not exist, returning expired', 0);
                return true;
            }

            // STORE EXISTS, CONTINUE
            var then, now, diff;

            // Find the duration between two dates
            now = moment();
            then = moment(window.localStorage[ageStoreKey], dateFormat);
            diff = moment.duration(now - then).asMinutes();

            rs.log(ageStoreKey + ' indicates corresponing data is ' + Math.floor(diff) + ' minutes old', 0);

            // RETURN EXPIRED FLAG
            return diff >= dataTimeoutInMinutes;
        };

        return function(strType) {
            strType = strType || 'sourceIndex'; // Supports sourceIndex, sourceDetail
            var storeName, storeAgingName;

            if (strType == 'sourceDetail') {
                storeName = storePrefix + '_' + $stateParams.sourceName + '_' + $stateParams.sourceDetail;
            } else {
                storeName = storePrefix + '_' + $stateParams.sourceName;
            }
            storeAgingName = storeName + '_saved';

            return {
                all: function() {

                    // TRY TO GET SAVED DATA
                    var jsonData = window.localStorage[storeName];

                    // RETURN IT IF FOUND
                    if (jsonData) {
                        var objReturn = {
                            name : storeName,
                            expired : isExpired(storeAgingName),
                            data : angular.fromJson(jsonData)
                        }

                        rs.log(objReturn, 0, storeName + ' data');

                        return objReturn;
                    }

                    // DEFAULT RETURN
                    return {
                        name : storeName,
                        expired : true,
                        data : []
                    };
                },
                save: function(appdata) {
                    window.localStorage[storeAgingName] = moment().format(dateFormat);
                    window.localStorage[storeName] = angular.toJson(appdata);
                },
                clear: function() {
                    window.localStorage.removeItem(storeName);
                    window.localStorage.removeItem(storeName);
                }
            };
        };
    }());

    rs.viewOnCDC = function () {
        alert('THIS NEEDS WIRED UP');
        // window.open($scope.data.sourceUrl, '_system');
    };

    rs.remoteApi = (function() {
        var apiDefaults = {
            method: 'GET',
            timeout: 30000
        };

        return function(options) {
            options.method = options.method || apiDefaults.method;
            options.timeout = options.timeout || apiDefaults.timeout;
            return $http(options);
        };
    }());

    rs.refreshScreenState = function () {

        $rootScope.$broadcast('screen-state-update-started');

        var objReturn = {
            width : $window.innerWidth,
            height : $window.innerHeight
        };

        var sourceMeta = $rootScope.getSourceMeta();
        var containerSet = (sourceMeta.countainerSet || 'ui-container-default');

        // GET SCREEN SIZE
        if ($window.innerWidth >= 1024 && $window.innerWidth > $window.innerHeight) {
            objReturn.viewType = 'tablet';
            objReturn.viewOrientation = 'landscape';
        } else if ($window.innerWidth >= 768 && $window.innerWidth < $window.innerHeight) {
            objReturn.viewType = 'tablet';
            objReturn.viewOrientation = 'portrait';
        } else {
            objReturn.viewType = 'phone';
            objReturn.viewOrientation = 'portrait';
        }

        // UPDATE SCOPE
        $rootScope.screenState = objReturn;
        $rootScope.sourceMeta = sourceMeta;

        // WAIT FOR ANY DIGEST TO COMPLETE BEFORE APPLYING
        $timeout(function(){
            // SET BUTTONS
            $rootScope.setButtonState();
            $rootScope.$broadcast('screen-state-update-complete', {
                templates : sourceMeta.templates,
                screenState : objReturn
            });
        }, 0);
    };

    rs.setButtonState = function () {
        var buttons = {
            show : {
                home : true || ($stateParams.sourceName !== 'homestream' || rs.sourceDetail),
                back : false || ($stateParams.sourceName !== 'homestream' && $stateParams.sourceDetail)
            }
        };

        rs.buttons = buttons;
    };

    /*
    rs.goBack = function() {
        $state.go('app.sourceIndex', {
            sourceName : $stateParams.sourceName
        });
    };

    rs.goHome = function() {
        rs.sourceDetail = "";
        $state.go('app.sourceIndex', {
            sourceName : 'homestream'
        });
    };
    */

    rs.cgNormalize = function (contentgroup) {
        return contentgroup.toLowerCase().replace(/ /g, '').replace(/\//g, '').replace(/\d/g, '');
    };

    // SOURCE DATA HANDLERS (LIST CFG, SOURCE STREAMS, DETAIL HANDLERS, ETC)
    rs.getSourceMeta = function() {

        // PARAMS
        var arySourceInfo, strSourceName = $stateParams.sourceName || $stateParams || "";

        // FILTER HERE
        arySourceInfo = $filter('filter')($rootScope.app.sourceList, {
            feedIdentifier: strSourceName
        }) || [];

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    rs.getSourceIndex = function(blnRefresh) {

        blnRefresh = blnRefresh || false;

        var defer, localStore, localData, objMetaData, data;

        defer = $q.defer();
        objMetaData = rs.getSourceMeta();
        localStore = rs.getLocalStoreByAppState();
        localData = localStore.all();

        //console.log('localData');
        console.log(localData);
        //console.log('blnRefresh');
        //console.log(blnRefresh);

        // CHECK IF WE NEED TO REFRESH OR NOT
        if (!blnRefresh && !localData.expired) {

            // LOCAL DATA IS GOOD
            // RESOLVE PROMISE WITH THE STORED DATA
            rs.log('Using Local Stream Data for ' + localData.name + ' (Still Fresh)', -1);
            defer.resolve(localData.data);

        } else {

            // REMOTE DATA NEEDED

            // CAN WE FIND URL?
            if (objMetaData.url) {

                rs.remoteApi({
                    url: objMetaData.url
                }).then(function(d) {

                    // NORMALIZE DATA BY SOURCE SPECS
                    var data = rs.dataProcessor(d, objMetaData);

                    //SAVE IT TO LOCAL
                    localStore.save(data);

                    // RESOLVE WITH PROCESSED DATA
                    rs.log('Using New Stream Data for ' + localData.name + ' (Refresh Requested)', -1);
                    defer.resolve(data);

                }, function(e) {

                    // ON ERROR
                    if (localData.data && localData.data.length) {

                        // FALLBACK TO SAVED DATA
                        rs.log('Using Local Stream Data for ' + localData.name + ' (Data Is Expired)', -1);
                        defer.resolve(localData.data);

                    } else {

                        // ALL FAILED RETURN WHAT WE HAVE IN LOCAL STORAGE
                        rs.log('Could Not Find Any Data for ' + localData.name + '  (Local, Remote, or Default)', -1);
                        defer.reject();
                    }
                });

            } else {

                // LOCAL DATA IS OLD BUT URL UNAVAILABLE, RESOLVE PROMISE WITH THE STORED DATA
                rs.log('Using Local Stream Data for ' + localData.name + ' (URL NOT DEFINED)', -1);
                defer.resolve(data);
            }
        }

        // SAVE RETURNED DATA (WHATEVER IT IS) AS THE SOURCE INDEX
        defer.promise.then(function(data){

            // SAVE IT TO RS
            rs.sourceIndex = data;

        });

        return defer.promise;
    };

    rs.getSourceCard = function (sourceDetailId) {

        var arySourceInfo;

        // GET OR DEFAULT SOURCE DETAIL ID
        sourceDetailId = sourceDetailId || $stateParams.sourceDetail;

        // FILTER HERE
        arySourceInfo = $filter('filter')(rs.sourceIndex, {
            id: sourceDetailId
        });

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // THIS FLAGS THE CURRENT CARD AS ACTIVE
            // DOING SO MAKES IT THE FIRST IN THE SCROLLER LIST
            arySourceInfo[0].isCurrent = 1;

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    rs.getSourceHtmlUrl = function(blnRefresh) {

        var defer, localStore, localData, objMetaData, noChromeUrl;

        defer = $q.defer();
        objMetaData = rs.getSourceMeta();
        localStore = rs.getLocalStoreByAppState('sourceDetail');
        localData = localStore.all();
        objTemp = {};

        // CHECK IF WE NEED TO REFRESH OR NOT
        if (!blnRefresh && !localData.expired) {

            // LOCAL DATA IS GOOD
            // RESOLVE PROMISE WITH THE STORED DATA
            rs.log(localData.data, 1, 'Using Local Detail Data (Still Fresh)');
            defer.resolve(localData.data);

        } else {

            // CREATE NOCHROME URL
            objTemp.sourceUrl = $rootScope.getSourceCard().sourceUrl;
            objTemp.filename = objTemp.sourceUrl.split('/').pop();
            objTemp.noChromeUrl = objTemp.filename.split('.')[0] + '_nochrome.' + objTemp.filename.split('.')[1];
            objTemp.noChromeUrl = objTemp.sourceUrl.replace(objTemp.filename, objTemp.noChromeUrl);

            // URL CHECK NEEDED
            $rootScope.remoteApi({
                url : 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=http://' + objTemp.noChromeUrl
            }).then(function(resp) {
                var urlToUse;

                // DETERMINE URL BASED ON SERVER STATUS RETURN
                if (resp.data.status === '200') {
                    urlToUse = objTemp.noChromeUrl;
                } else {
                    urlToUse = objTemp.sourceUrl;
                }

                //SAVE IT TO LOCAL
                localStore.save(urlToUse);

                // RESOLVE THE PROMISE WITH THE NEW DATA
                defer.resolve(urlToUse);

                return resp;
            },
            function(resp) {



                // TEMP - SAVE IT TO LOCAL
                localStore.save(objTemp.sourceUrl);

                defer.resolve(objTemp.sourceUrl);
                return resp;
            });
        }

        // RETURN THE PROMISE
        return defer.promise;
    };

    rs.getSourceDetail = function(blnRefresh) {

        var defer, localStore, localData, objMetaData;

        defer = $q.defer(),
        objMetaData = rs.getSourceMeta();
        localStore = rs.getLocalStoreByAppState('sourceDetail');
        localData = localStore.all();

        // CHECK IF WE NEED TO REFRESH OR NOT
        if (!blnRefresh && !localData.expired) {

            // LOCAL DATA IS GOOD
            // RESOLVE PROMISE WITH THE STORED DATA
            rs.log(localData.data, -100, 'Using Local Detail Data (Still Fresh)');
            defer.resolve(localData.data);

        } else {

            //objCurrentCard = rs.getSourceCard();

            var detailUrl = 'https://prototype.cdc.gov/api/v2/resources/media/' + $stateParams.sourceDetail + '/syndicate.json';

            // REMOTE DATA NEEDED

            // GET DATA
            rs.remoteApi({
                url: detailUrl
            }).then(function(d) {

                // NORMALIZE DATA BY SOURCE SPECS
                var data = rs.dataProcessor(d, objMetaData);

                //SAVE IT TO LOCAL
                localStore.save(data);

                // RESOLVE WITH PROCESSED DATA
                rs.log('Using New Detail Data (Remote)', -100);
                defer.resolve(data);

            }, function(e) {

                // ON ERROR
                if (localData.data && localData.data.length) {

                    // FALLBACK TO SAVED DATA
                    rs.log('Using Local Detail Data (Not Fresh)', -100);
                    //rs.log(localData.data, -100, 'Using Local Detail Data (Not Fresh)');
                    defer.resolve(localData.data);

                } else {

                    // ALL FAILED RETURN WHAT WE HAVE IN LOCAL STORAGE
                    rs.log('Could Not Find And Data (Local, Remote, or Default)', -100);
                    defer.reject();
                }
            });
        }

        return defer.promise;
    };

    // HISTORY HANDLERS
    rs.saveHistory = function() {

        // ENSURE HOME IS ALWAYS THE FIRST SPOT IN THE HISTORY ARRAY
        if (!rs.aryHistory.length) {
            rs.aryHistory.push({
                sourceName : 'homestream',
                sourceDetail : false
            });
        }

        // GET THE LAST STATE IN HISTORY
        var objLastState = rs.aryHistory[rs.aryHistory.length - 1] || {};

        // SAVE THE STATE TO HISTORY (IF NEW)
        var objThisState = {
            sourceName : $stateParams.sourceName || false ,
            sourceDetail : $stateParams.sourceDetail || false
        };

        // SHOULD WE SAVE IT?
        if (objThisState.sourceName != objLastState.sourceName || objThisState.sourceDetail != objLastState.sourceDetail) {
            // IS THIS SAME DIFFERENT FROM THE LAST? SAVE CURRENT
            rs.aryHistory.push(objThisState);
        }
    };

    rs.historyBack = function() {

        console.log('HISTORY BACK CLICKED');

        // ARE THERE ANY SATSTES TO STEP BACK TO?
        if (rs.aryHistory && rs.aryHistory.length) {

            // GE THIS STATE
            var objThisState = {
                sourceName : $stateParams.sourceName || false ,
                sourceDetail : $stateParams.sourceDetail || false
            };

            // GET THE LAST STATE (& POP IT OFF THE ARRAY)
            var objLastState = rs.aryHistory.pop();

            // IS THE LAST STATE THE SAME AS THE CURRENT STATE?
            if (objLastState.sourceName == objThisState.sourceName && objLastState.sourceDetail == objThisState.sourceDetail) {
                // THEN WE NEED TO GO BACK ONE MORE
                if (rs.aryHistory.length) {
                    // GET THE NEXT IN LINE
                    objLastState = rs.aryHistory.pop();
                }
            }

            // IS THE LAST STATE DIFFERENT FROM THE CURRENT STATE?
            if (objLastState.sourceName != objThisState.sourceName || objLastState.sourceDetail != objThisState.sourceDetail) {
                // DETERMINE AND SET APPROPRIATE STATE (INDEX OR DETAIL)
                if (objLastState.sourceDetail && objLastState.sourceDetail) {
                    $state.go('app.sourceDetail', objLastState);
                } else if (objLastState.sourceName && objLastState.sourceName.length) {
                    $state.go('app.sourceIndex', objLastState);
                }
            }
        }
    };

    rs.backButtonDisplay = function (stateParams) {
        var objReturn = {
            show : false,
            icon : '',
            text : ''
        };

        if (stateParams.sourceName == 'homestream') {
            console.log('home stream - no icon');
        } else {
            console.log(objReturn.show);
            if (rs.aryHistory.length > 0) {
                objReturn.show = true;

                // GET THIS STATE
                var objThisState = {
                    sourceName : $stateParams.sourceName || false ,
                    sourceDetail : $stateParams.sourceDetail || false
                };
                // GET THE LAST STATE IN HISTORY
                var objLastState = rs.aryHistory[rs.aryHistory.length - 1] || {};
                // ARE THEY THE SAME?
                if (objLastState.sourceName == objThisState.sourceName && objLastState.sourceDetail == objThisState.sourceDetail) {
                    // YES, GO BACK ONE MORE
                    objLastState = rs.aryHistory[rs.aryHistory.length - 2] || {};
                }

                if (objLastState.hasOwnProperty('sourceName')) {
                    if (objLastState.sourceName == 'homestream') {
                        objReturn.icon = 'ion-home';
                        objReturn.text = 'Home';
                    } else {
                        objReturn.icon = 'ion-chevron-left';
                        objReturn.text = 'Back';
                    }
                }
            }
        }
        return objReturn;
    }

    // APP INIT
    rs.appInit = function(blnRefresh) {

        var defer = $q.defer();

        // REFRESH REQUESTED?
        if (blnRefresh || !rs.app.initialized || false) {

            // GET & SAVE THE SOURCE LIST PROMISE
            var sourceListPromise = rs.remoteApi({
                url: 'json/sources.json'
            });

            // CONTINUE PROMISE CHAIN
            sourceListPromise.then(function(d) {

                var objApp = {
                    // SET SOURCE TYPES
                    sourceTypes : d.data.sourceTypes,
                    // SET SOURCE LIST
                    sourceList : d.data.sourceList,
                    // DEFAULT EMPTY OBJECTS
                    templateMap : {},
                    sourceMetaMap : {},
                    sourceFilters : {},
                    sourceFilterLocks : {}
                };

                // LOCALS
                var i = objApp.sourceList.length, objReturn = {}, objSrc;

                // LOOP SOURCES
                while (i--) {

                    // GET THE CURRENT SOURCE
                    objSrc = objApp.sourceList[i];

                    // MAP TEMPLATES TO feedIDENTIFIER
                    objApp.templateMap[objSrc.feedIdentifier] = objSrc.templates;

                    // MAP TEMPLATES TO feedIDENTIFIER
                    objApp.sourceMetaMap[objSrc.feedIdentifier] = objSrc;

                    // MAP SOURCE FILTER DEFAULTS (LOCAL STORAGE WILL BE MERGED AND OVERRIDE THESE)
                    if (!objApp.sourceFilters.hasOwnProperty(objSrc.typeIdentifier)) {
                        // DEFAULT FEEDTYPE CONTAINER
                        objApp.sourceFilters[objSrc.typeIdentifier] = {};
                    }
                    // FEEDTYPE > FEEDID > FEEDSETTINGS (FROM SOURCES.JSON)
                    objApp.sourceFilters[objSrc.typeIdentifier][objSrc.feedIdentifier] = {
                        isEnabled : objSrc.showByDefault
                    };
                    // MAP SOURCE FILTER DEFAULTS (LOCAL STORAGE WILL BE MERGED AND OVERRIDE THESE)
                    if (!objApp.sourceFilterLocks.hasOwnProperty(objSrc.typeIdentifier)) {
                        // DEFAULT FEEDTYPE CONTAINER
                        objApp.sourceFilterLocks[objSrc.typeIdentifier] = {};
                    }
                    objApp.sourceFilterLocks[objSrc.typeIdentifier][objSrc.feedIdentifier] = {
                        filterLocked : objSrc.filterLocked
                    };
                }

                // TRY TO GET LOCAL SETTINGS OVERRIDES
                var localFilters = rs.getSimpleLocalStore('settings').get() || {};

                //console.log('objApp.sourceFilters');
                //console.log(objApp.sourceFilters);
                //console.log('objApp.sourceFilterLocks');
                //console.log(objApp.sourceFilterLocks);

                // IF WE FOUND LOCAL SETTINGS, MERGE THEM IN
                if (localFilters) {
                    objApp.sourceFilters = angular.extend(objApp.sourceFilters, localFilters);
                }

                //console.log('objApp.sourceFilters');
                //console.log(objApp.sourceFilters);

                // SAVE DATA TO ROOTSCOPE
                rs.app = objApp;
                rs.app.initialized = true;

                //console.log('rs.app.sourceFilters');
                //console.log(rs.app.sourceFilters);

                // RESOLVE PROMISE WITH THE NEW DATA
                defer.resolve(objApp);
            });

        } else {

            // RESOLVE PROMISE WITH THE NEW DATA
            defer.resolve(rs.app);

        }

        // ADD LISTENER ONLY ONCE
        if (!rs.listenersAdded) {
            rs.listenersAdded = true;

            var mq = window.matchMedia('(orientation: portrait)');

            mq.addListener(function(m) {
                $rootScope.refreshScreenState();
            });

            window.addEventListener("orientationchange", $rootScope.refreshScreenState, true);

            // Add Listener for resize changes
            window.addEventListener("resize", $rootScope.refreshScreenState, false);
        }

        // RETURN THE SOURCE LIST PROMISE
        return defer.promise;
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.transition('none'); // keep the navbar from animating
    $ionicConfigProvider.views.transition('fade');

    var sp = $stateProvider;

    sp.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/ui-menu.html',
        controller: 'AppCtrl'
    });

    /* WARN: this is temporary
    sp.state('app.homestream', {
        url: '/homestream',
        views: {
            'menuContent': {
                templateUrl: defaultTemplateHandler('dynamic', 'stream-home'),
                controller: 'HomeCtrl'
            }
        }
    });*/

    sp.state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/ui-main-source-list.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    sp.state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    });

    sp.state('app.test', {
        url: '/test/:sourceName',
        views: {
            'menuContent': {
                templateUrl: 'templates/ui-master.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    sp.state('app.sourceIndex', {
        url: '/source/:sourceName',
        views: {
            'menuContent': {
                templateUrl: 'templates/ui-main.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    sp.state('app.sourceDetail', {
        url: '/source/:sourceName/:sourceDetail',
        views: {
            'menuContent': {
                templateUrl: 'templates/ui-main.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/source/homestream');
})

/* WIP
.directive('uiDump', function() {
   var vsd, hsd;
   return {
        restrict: 'E',
        scope : {
            variable : '='
        },
        template: '<div>{{variable}}</div>'
   }
})*/;
