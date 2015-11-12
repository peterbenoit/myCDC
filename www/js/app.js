/**
 *  myCDC
 *  TODO: info.plist NSAppTransportSecurity key needs to be corrected before deployment
 */
angular.module('mycdc', [
    'ionic',
    'mycdc.controllers',
    'mycdc.data',
    'mycdc.directives',
    'mycdc.filters',
    'mycdc.services',
    'mycdc.storage',
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

            alert('CLICK');

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

    rs.logLevel = -99;

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

                    // SET STREAM TITLE
                    obj1.streamTitle = objSourceMeta.title;
                    // TEMPORARY FEED BUG WORKAROUND (DEFAULTS DATA WHICH SHOULD BE PRESENT IN TAG DATA)
                    if (!obj1.contentgroup) {
                        obj1.contentgroup = 'FEED ISSUE: ' + objSourceMeta.contentGroupIdentifier + 'doesnt not include a content group key';
                        obj1.appContentGroup = objSourceMeta.contentGroupIdentifier;
                        obj1.templates = angular.extend({}, rs.templateMap[obj1.appContentGroup]);
                        obj1.detailType = objSourceMeta.detailType;
                        obj1.contentType = objSourceMeta.contentType;
                        obj1.home = '#/app/source/' + obj1.appContentGroup;
                        obj1.url = obj1.home + '/';
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
                                obj1.contentGroupIdentifier = strCg;
                                obj1.appContentGroup = strCgStripped;
                                obj1.templates = rs.templateMap[obj1.appContentGroup];
                                obj1.detailType = objSourceMeta.detailType;
                                obj1.contentType = objSourceMeta.contentType;
                                obj1.home = '#/app/source/' + obj1.appContentGroup;
                                obj1.url = obj1.home + '/';

                                // SET STREAM TITLE
                                if (rs.sourceMetaMap.hasOwnProperty(obj1.appContentGroup)) {
                                    obj1.streamTitle = rs.sourceMetaMap[obj1.appContentGroup].title;
                                }

                                // TODO: consider using config.json for this data
                                if (obj1.appContentGroup === 'eid') {
                                    obj1.hasImage = false;
                                    break;
                                }

                                if (obj1.appContentGroup === 'vitalsigns') {
                                    obj1.hasImage = false;
                                    break;
                                }

                                if (obj1.appContentGroup === 'outbreaks') {
                                    obj1.isOutbreak = true;
                                    obj1.hasImage = false;
                                    break;
                                }

                                if (obj1.appContentGroup === 'travelnotices') {
                                    obj1.isAlert = obj1.name.indexOf('Alert') > -1;
                                    obj1.isWatch = obj1.name.indexOf('Watch') > -1;
                                    obj1.isWarning = obj1.name.indexOf('Warning') > -1;
                                    break;
                                }
                                break;
                            }
                        }
                    }

                    console.log(obj1);

                }

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
                return d;
            },
            parseEncoding: function(d) {
                var currItem, data = d.data.results;

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

    rs.getLocalStoreByAppState = (function() {

        var storePrefix = 'myCDC-';
        var dateFormat = 'YYYY-MM-DD-HH-mm-ss';
        var dataTimeoutInMinutes = 60;

        var isExpired = function (ageStoreKey) {

            // EXIT IF AGE STORE DOES NOT EXIST
            if (!window.localStorage.hasOwnProperty(ageStoreKey)) {
                rs.log(ageStoreKey + ' does not exist, returning expired', 1);
                return true;
            }

            // STORE EXISTS, CONTINUE
            var then, now, diff;

            // Find the duration between two dates
            now = moment();
            then = moment(window.localStorage[ageStoreKey], dateFormat);
            diff = moment.duration(now - then).asMinutes();

            rs.log(ageStoreKey + ' is ' + diff + ' minutes old', 1);

            // RETURN EXPIRED FLAG
            return diff >= dataTimeoutInMinutes;
        };

        return function(strType) {
            strType = strType || 'sourceIndex'; // Supports sourceIndex or sourceDetail
            var storeName, storeAgingName;

            if (strType == 'sourceDetail') {
                storeName = storePrefix + $stateParams.sourceName + '-' + $stateParams.sourceDetail;
            } else {
                storeName = storePrefix + $stateParams.sourceName;
            }
            storeAgingName = storeName + '-saved';

            return {
                all: function() {

                    // TRY TO GET SAVED DATA
                    var jsonData = window.localStorage[storeName];

                    // RETRUN IT IF FOUND
                    if (jsonData) {
                        var objReturn = {
                            expired : isExpired(storeAgingName),
                            data : angular.fromJson(jsonData)
                        }

                        rs.log(jsonData, 1, storeAgingName + ' data');

                        return objReturn;
                    }

                    // DEFAULT RETURN
                    return {
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

    rs.remoteApi = (function() {
        var apiDefaults = {
            method: 'GET',
            timeout: 7000
        };

        return function(options) {
            options.method = options.method || apiDefaults.method;
            options.timeout = options.timeout || apiDefaults.timeout
            return $http(options);
        }
    }());


    // FROM 'DeviceInfo' DEPENDENCY
    //rs.deviceinfo = DeviceInfo;
    //console.log(rs.deviceinfo);

    // FROM 'ScreenSize' DEPENDENCY
    //rs.screensize = ScreenSize;
    //console.log(rs.screensize);

    rs.refreshScreenState = function () {

        $rootScope.$broadcast('screen-state-update-started');

        $rootScope.sourceListPromise.then(function() {

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
        });
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

    rs.cgNormalize = function (contentgroup) {
        return contentgroup.toLowerCase().replace(/ /g, '');
    };

    // GET SOURCE METADATA FROM SOURCELIST BY NAME (In Route Params)
    rs.getSourceMeta = function() {

        // PARAMS
        var arySourceInfo, strSourceName = $stateParams.sourceName || $stateParams || "";

        // FILTER HERE
        arySourceInfo = $filter('filter')($rootScope.sourceList, {
            contentGroupIdentifier: strSourceName
        }) || [];

        // DID WE FIND IT?
        if (arySourceInfo.length === 1) {

            // RETURN IT
            return arySourceInfo[0];
        }

        // ELSE RETURN FALSE
        return false;
    };

    rs.getSourceList = function() {
        return rs.remoteApi({
            url: 'json/sources.json'
        });
    };

    rs.getSourceIndex = function(blnRefresh) {

        blnRefresh = blnRefresh || false;

        var defer, localStore, localData, objMetaData, data;

        defer = $q.defer(),
        objMetaData = rs.getSourceMeta();
        localStore = rs.getLocalStoreByAppState();
        localData = localStore.all();

        // CHECK IF WE NEED TO REFRESH OR NOT
        if (!blnRefresh && !localData.expired) {

            // LOCAL DATA IS GOOD
            // RESOLVE PROMISE WITH THE STORED DATA
            rs.log('Using Local Stream Data (Still Fresh)', 1);
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
                    rs.log('Using New Stream Data (Remote)', 1);
                    defer.resolve(data);

                }, function(e) {

                    // ON ERROR
                    if (localData.data && localData.data.length) {

                        // FALLBACK TO SAVED DATA
                        rs.log('Using Local Stream Data (Not Fresh)', 1);
                        defer.resolve(localData.data);

                    } else {

                        // ALL FAILED RETURN WHAT WE HAVE IN LOCAL STORAGE
                        rs.log('Could Not Find And Data (Local, Remote, or Default)', 1);
                        defer.reject();
                    }
                });

            } else {

                // LOCAL DATA IS OLD BUT URL UNAVAILABLE, RESOLVE PROMISE WITH THE STORED DATA
                rs.log('Using Local Stream Data (Not Fresh)', 1);
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

        defer = $q.defer(),
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
                url : 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=' + objTemp.noChromeUrl
            }).then(function(resp) {
                var urlToUse;

                // DETERMINE URL BASED ON SERVER STATUS RETURN
                if (resp.data.status === '200') {
                    urlToUse = objTemp.noChromeUrl
                } else {
                    urlToUse = objTemp.sourceUrl
                }

                //SAVE IT TO LOCAL
                localStore.save(urlToUse);

                // RESOLVE THE PROMISE WITH THE NEW DATA
                defer.resolve(urlToUse);

                return resp
            },
            function(resp) {
                console.log('resp');
                console.log(resp);

                // TEMP - SAVE IT TO LOCAL
                localStore.save(objTemp.sourceUrl);

                defer.resolve(objTemp.sourceUrl);
                return resp
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
            rs.log(localData.data, 1, 'Using Local Detail Data (Still Fresh)');
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
                rs.log('Using New Detail Data (Remote)', 1);
                defer.resolve(data);

            }, function(e) {

                // ON ERROR
                if (localData.data && localData.data.length) {

                    // FALLBACK TO SAVED DATA
                    rs.log(localData.data, 1, 'Using Local Detail Data (Not Fresh)');
                    defer.resolve(localData.data);

                } else {

                    // ALL FAILED RETURN WHAT WE HAVE IN LOCAL STORAGE
                    rs.log('Could Not Find And Data (Local, Remote, or Default)', 1);
                    defer.reject();
                }
            });
        }

        return defer.promise;
    };

    rs.appInit = function(blnRefresh) {

        // REFRESH REQUESTED?
        if (blnRefresh || !rs.sourceListPromise || false) {

            // DEBUG
            rs.log('appInit Refresh');

            // GET & SAVE THE SOURCE LIST PROMISE
            rs.sourceListPromise = rs.getSourceList();

            // CONTINUE PROMISE CHAIN
            rs.sourceListPromise.then(function(d) {

                //TRIM OUT UNNESESSARY DATA FROM RETURN
                var sourceList = d.data;

                // CREATE SOURCE TEMPLATE MAP
                rs.templateMap = (function() {

                    // LOCALS
                    var i = sourceList.length, objReturn = {}, objSrc;

                    // LOOP SOURCES
                    while (i--) {

                        // GET THE CURRENT SOURCE
                        objSrc = sourceList[i];

                        // MAP TEMPLATES TO CONTENTGROUPIDENTIFIER
                        objReturn[objSrc.contentGroupIdentifier] = objSrc.templates;
                    }

                    // RETURN MAP
                    return objReturn
                } ());

                // CREATE SOURCE META DATA
                rs.sourceMetaMap = (function() {
                    // LOCALS
                    var i = sourceList.length, objReturn = {}, objSrc;
                    // LOOP SOURCES
                    while (i--) {
                        // GET THE CURRENT SOURCE
                        objSrc = sourceList[i];
                        // MAP TEMPLATES TO CONTENTGROUPIDENTIFIER
                        objReturn[objSrc.contentGroupIdentifier] = objSrc;
                    }
                    // RETURN MAP
                    return objReturn
                } ());
                //console.log(rs.sourceMetaMap);
                // SET SOURCE LIST TO ROOTSCOPE;
                rs.sourceList = sourceList;

                // RETURN TRIMMED DATA TO CHAIN
                return rs.sourceListPromise;
            });
        }

        var listenersAdded = listenersAdded || false;

        if (!listenersAdded) {

            var mq = window.matchMedia('(orientation: portrait)');

            mq.addListener(function(m) {
                $rootScope.refreshScreenState();
            });

            window.addEventListener("orientationchange", $rootScope.refreshScreenState, true);

            // Add Listener for resize changes
            window.addEventListener("resize", $rootScope.refreshScreenState, false);
        }

        // RETURN THE SOURCE LIST PROMISE
        return rs.sourceListPromise;
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

// THESE CAN BE MOVED TO DIRECTIVES FILE
.directive('uiContainer', function($rootScope, $timeout) {
   return {
        restrict: 'E',
        controller: function($scope, $element){
            if ($scope.containerLoading === undefined) {
                $scope.containerLoading = true;
            }

            $scope.getContainerTemplate = function (blnLoader) {

                var uiContainerTemplateUrl;

                if (!blnLoader && $rootScope.screenState && $rootScope.sourceMeta) {
                    if ($rootScope.screenState.viewType == 'phone') {
                        uiContainerTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.containerSet + '-phone.html';
                    } else {
                        uiContainerTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.containerSet + '-tablet-' + $rootScope.screenState.viewOrientation + '.html';
                    }
                } else {
                    uiContainerTemplateUrl = 'templates/ui-loader.html';
                }

                $rootScope.log(uiContainerTemplateUrl, 1, 'UI-CONTAINER-TEMPLATE');

                $scope.containerLoading = false;

                return uiContainerTemplateUrl;
            };

            // SET LISTENER ONCE
            if (!$scope.uiContainerInit) {
                $scope.uiContainerInit = true;
                $scope.$on('screen-state-update-started', function(event, args) {
                    $rootScope.log('UI CONTAINER DIRECTIVE RECEIVED screen-state-update-started', 2, 'EVENT-LISTENER:');
                    $scope.containerLoading = true;
                });
                $scope.$on('screen-state-update-complete', function(event, args) {
                    $rootScope.log('UI CONTAINER DIRECTIVE RECEIVED screen-state-update-complete', 2, 'EVENT-LISTENER:');
                    $timeout($scope.getContainerTemplate, 0);
                });
            }
        },
        scope : '*',
        template: '<div ng-include="getContainerTemplate()"></div>'
   }
})

.directive('uiStream', function($rootScope, $state, $timeout, $ionicPosition, $stateParams) {
   var vsd, hsd;

   return {
        restrict: 'E',
        controller: ['$scope', '$element', function($scope, $element){

            // CREATE MAIN TEMPALTE HANDLER (COULD USE IONIC FOR TABLE DETECTION, BUT THIS SEEMS MORE UNIVERSAL WITH LESS isThis, isThat CALLS)
            $scope.getStreamTemplate = function () {

                var uiStreamTemplateUrl;

                if ($rootScope.screenState && $rootScope.sourceMeta) {
                    if ($rootScope.screenState.viewType == 'tablet') {
                        uiStreamTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.stream + '-' + $rootScope.screenState.viewOrientation + '.html';
                    } else {
                        uiStreamTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.stream + '-universal.html';
                    }
                } else {
                    uiStreamTemplateUrl = 'templates/ui-loader.html';
                }

                //$rootScope.log($('.vertical-scroller').length, -100, 'VERTICAL SCROLLER');
                //$rootScope.log($('.horizontal-scroller').length, -100, 'HORIZONTAL SCROLLER');

                // SCROLLER HEIGHT / WIDTH FIX - IMPORTANT
                var jqVs = $('.vertical-scroller');
                if (jqVs.length) {
                    var intMenuHeight = 44;
                    var jqH3 = $('h3.scroll-header');
                    if (jqVs) {
                        var newHeight = $rootScope.screenState.height - intMenuHeight;
                        if (jqH3.length) {
                            newHeight = newHeight - jqH3.outerHeight();
                        }
                        jqVs.height(newHeight);
                    }
                }

                var jqHs = $('.horizontal-scroller');
                if (jqHs.length) {
                    var newWidth = $rootScope.screenState.width;
                    jqHs.width(newWidth);
                }

                /*
                $rootScope.log($rootScope.screenState.height, -100, 'SCREEN HEIGHT');
                $rootScope.log($('> h3', jsLv).outerHeight(), -100, 'H3 HEIGHT');
                $rootScope.log(newHeight, -100, 'FINAL HEIGHT');
                */
                // END SCROLLER HEIGHT / WIDTH FIX

                $rootScope.log($rootScope.screenState.height, -1, 'SCREEN HEIGHT');

                return uiStreamTemplateUrl;
            };

            // SET LISTENER ONCE
            if (!$scope.uiStreamInit) {
                $scope.uiStreamInit = true;
                $scope.$on('screen-state-update-complete', function(event, args) {
                    $rootScope.log('UI STREAM DIRECTIVE RECEIVED screen-state-update-complete', 2, 'EVENT-LISTENER:');
                    $scope.getStreamTemplate();
                });
                $scope.$on('source-name-changed', function(event, args) {
                    $rootScope.log('SOURCE NAME CHANGED', 2, 'EVENT-LISTENER:');
                    $state.go('app.sourceDetail', {sourceName: $rootScope.sourceName, sourceDetail: $rootScope.sourceDetail });
                });
            }
        }],
        template: '<div ng-include="getStreamTemplate()"></div>'
   }
})

.directive("uiCard", function($rootScope, $timeout, $state) {
    return {
        // ISOLATE SCOPE (RESTRIECT TO CARD DATA OBJECT AND TEMPLATE ATTR)
        scope: {
            cardData: '=',
            template: '@'
        },
        restrict: 'E',
        controller: function($scope) {

            $scope.setState = function (source, detail) {


                if (source && $rootScope.sourceName !== source) {
                    $rootScope.sourceName = source;
                    $rootScope.$broadcast('source-name-changed');

                } else if (detail && $rootScope.sourceDetail != detail) {
                    $rootScope.sourceDetail = detail;
                    $rootScope.$broadcast('source-detail-changed');

                }
            };

            $scope.getCardTemplate = function (blnLoader) {

                blnLoader = blnLoader || false;

                // DEFAULT TO LOADER (IF STATE SCREEN STATE NOT READY, ETC.)
                var uiCardTemplateUrl = 'templates/ui-loader.html';

                if (!blnLoader) {

                    // SCREEN STATE READY?
                    if ($rootScope.screenState) {
                        // TEMPLATE LOGIC
                        if ($scope.template) {
                            // TEMPLATE OVERRIDE PROVIDED - USE IT
                            uiCardTemplateUrl = 'templates/' + $scope.template+ '.html';
                        } else if ($rootScope.sourceName == 'homestream' &&  $scope.cardData.templates.hasOwnProperty('homeCard')) {
                            // USE DEFAULT TEMPLATE FOR CARD
                            uiCardTemplateUrl = 'templates/' + $scope.cardData.templates.homeCard + '.html';
                        } else if ($scope.cardData.templates && $scope.cardData.templates.hasOwnProperty('card')) {
                            // USE DEFAULT TEMPLATE FOR CARD
                            uiCardTemplateUrl = 'templates/' + $scope.cardData.templates.card + '.html';
                        }
                    }

                    if ($scope.cardData.id == '152263') {
                        $rootScope.log($scope.cardData, 1, 'UI-CARD-DATA');
                        $rootScope.log(uiCardTemplateUrl, 1, 'UI-CARD-TEMPLATE');
                    }

                }

                // RETURN TEMPLATE
                return uiCardTemplateUrl;
            };
        },
        link: function(scope, element, attrs) {
            scope.template = attrs.template;
        },
        template: '<div id="card-{{cardData.id}}" class="card-container-pad" ng-include src="getCardTemplate()"></div>',
    };
})

.directive('uiDetail', function($rootScope, $timeout, $sce, $filter, $state, $stateParams, $ionicPopup) {

    // HANDLE DIFFERENT TYPES OF CONTENT DETAIL PROCESSING
    var detailProcessors = {
        video : function ($scope) {

            // VIDEOS - NO ADDITIONAL SERVICE CALLS NEEDED
            // SIMPLY SET DETAIL DATA FROM CURRENT CARD
            $scope.detailData = $scope.detailCard;

            // PROVIDE A VIDEO URL HELPER FOR THE VIDEO PARTIAL
            $scope.getVideoUrl = function() {
                return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.detailData.sourceUrl.split('?v=')[1] + '?rel=0');
            };

        },
        iframe : function ($scope) {

            // IFRAME - NEED TO DETERMINE CHROME OR NO CHROME URL (CACHED TO LOCAL STORAGE FOR SPEED)

            // SIMPLY SET DETAIL DATA FROM CURRENT CARD
            $scope.detailData = $scope.detailCard;

            // GET NO CHROME URL
            return $rootScope.getSourceHtmlUrl().then(function(iframeUrl){

                // SET RESPONSE FOR USE BY HTML PARTIAL (AS IFRAME SRC)
                $scope.frameUrl = $sce.trustAsResourceUrl(iframeUrl);
            });
        },
        default : function ($scope) {

            // GET SOURCE DETAIL DATA
            return $rootScope.getSourceDetail().then(function(d){

                // NORMALIZE DATA BY SOURCE SPECS?
                $scope.detailData = d;

                // BROADCAST DATA IS READY
                $rootScope.$broadcast('source-detail-load-complete');
            });

        }
    };

    return {
        restrict: 'E',
        controller : function ($scope) {

            // SET LISTENER ONCE
            if (!$scope.uiDetailnit) {
                $scope.uiDetailnit = true;

                // LISTEN FOR SCREEN UPDATE
                $rootScope.$on('screen-state-update-complete', function () {
                    $scope.getDetailTemplate();
                });

                // LISTEN FOR DETAIL CHANGE
                $rootScope.$on('source-detail-changed', function () {
                    $scope.loadDetailData();
                });

                /* LISTEN FOR DETAIL LOAD START
                $rootScope.$on('source-detail-load-started', function(event, args) {
                    $rootScope.log('UI DETAIL DIRECTIVE RECEIVED source-detail-load-STARTED', 10, 'EVENT-LISTENER:');
                    $rootScope.log($scope.detailCard, 10, 'SCOPE DETAIL CARD');
                    $rootScope.log($scope.detailData, 10, 'SCOPE DETAIL DATA');
                });*/

                // LISTEN FOR DETAIL LOAD COMPLETE
                $rootScope.$on('source-detail-load-complete', function(event, args) {
                    $rootScope.log('UI DETAIL DIRECTIVE RECEIVED source-detail-load-COMPLETED', 10, 'EVENT-LISTENER:');
                    $rootScope.log($scope.detailCard, 10, 'SCOPE DETAIL CARD');
                    $rootScope.log($scope.detailData, 10, 'SCOPE DETAIL DATA');

                    $scope.getDetailTemplate();
                });
            }

            $scope.sourceIndexPromise.then(function(d){

                $scope.loadDetailData();

                return d;
            });

            $scope.loadDetailData = function (callback) {

                $scope.detailCard = $rootScope.getSourceCard();

                $rootScope.$broadcast('content-card-ready');

                $rootScope.log($scope.detailCard, 10, 'CURRENT DETAIL CARD');

                // SET CARD TEMPLATE
                $scope.detailTemplateUrl = 'templates/' + $rootScope.sourceMeta.templates.detail + '.html';

                $rootScope.log($scope.detailTemplateUrl, 10, 'UI-DETAIL-TEMPLATE');

                // CONTINUE IF DETAIL CARD EXISTS IN SCOPE (AND NOT INITIALIZED ALREADY)
                if ($scope.detailCard) {

                    // FLAG INIT
                    $scope.initialized = false;

                    $rootScope.$broadcast('source-detail-load-started');

                    // CALL SPECIFIED PROCESSOR
                    detailProcessors[$rootScope.sourceMeta.detailType].call(this, $scope);

                    // DEBUG
                    $rootScope.log($scope.processer, 10, 'UI-DETAIL-DIRECTIVE-PROCESSER');
                    $rootScope.log($scope.detailTemplateUrl, 10, 'UI-DETAIL-DIRECTIVE-TEMPLATE');

                    if (callback) {
                        //callback.apply();
                    }

                } else {

                    // DETAIL ID DETECTION LOGIC
                    if (!$stateParams.sourceIndex) {

                        // IF NO SOURCE INDEX (DETAIL ID) IS PRESENT, VERIFY INTENT (SHOULD WE REQUIRE ONE)
                        if ($scope.screenState.viewType == 'tablet') {
                            $state.go('app.sourceDetail', {sourceName: $scope.sourceName, sourceDetail: $scope.datas[0].id });
                        }

                    } else {

                        // NO DETAIL CARD FOUND IN CARD LIST: ALERT USER, THEN REDIRECT
                        var noDetailCard = $ionicPopup.alert({title: 'Content not available.', template: 'Sorry, we could not seem to find that content. Please try again.'});
                        noDetailCard.then(function() {
                            $state.go('app.sourceDetail', {sourceName: $scope.sourceName, sourceDetail: $scope.datas[0].id });
                        });
                    }
                }
            };

            $scope.getDetailTemplate = function () {

                // DEFAULT TO LOADER (IF STATE SCREEN STATE NOT READY, ETC.)
                var uiDetailTemplateUrl = 'templates/ui-loader.html';

                // SCREEN STATE READY?
                if ($rootScope.screenState && $scope.detailCard && $scope.detailData) {
                    // TEMPLATE LOGIC
                    uiDetailTemplateUrl = 'templates/' + $scope.detailCard.templates.detail + '.html';
                }

                $rootScope.log(uiDetailTemplateUrl, 1, 'UI-DETAIL-TEMPLATE');

                // RETURN TEMPLATE
                return uiDetailTemplateUrl;
            };
        },
        template: '<div ng-include="getDetailTemplate()"></div>'
    }
})

.directive("splitBy", function($rootScope) {

    var setDimensions = function (element, reference, columns, setRatio) {
        // DETERMINE DIVISOR
        columns = columns || null;

        // DETERMINE WIDTH TO DIVIDE BY (SCREEN OR PARENT ELEMENT WIDTH)
        var parentWidth = $rootScope.screenState.width;
        if (reference === 'parent') {
            parentWidth = $(element).parent().innerWidth();
        }

        // DETERMINE IF WE NEED TO SET EXPLICIT WIDTH
        if (columns) {
            // DETERMINE NEW WIDTH
        var newWidth = Math.floor((parentWidth - columns) / columns);
        }

        // APPLY NEW WIDTH
        $(element).width(newWidth);

        // SET RATIO (HEIGHT)?
        if (setRatio) {

            var aryArgs = setRatio.split(':');

            if (aryArgs.length == 2) {

                var rW = aryArgs[0];
                var rH = aryArgs[1];

                // DETERMINE NEW RATION SPECIFIC HEIGHT
                var newHeight = Math.floor((newWidth / rW) * rH);

                console.log(newHeight);

                // APPLY NEW HEIGHT
                $(element).height(newHeight);
            }
        }
    };

    return {
        // ISOLATE SCOPE (RESTRIECT TO CARD DATA OBJECT AND TEMPLATE ATTR)
        restrict: 'A',
        scope : {
            splitBy : '@',
            reference : '@', // 'parent' or 'screen',
            setRatio : '@' // '16:9' or 'false' (default)
        },
        link: function(scope, element, attrs) {
            attrs.reference = attrs.reference || 'screen';
            attrs.setRatio = attrs.setRatio || '';
            setDimensions(element, attrs.reference, attrs.splitBy, attrs.setRatio);
        }
    };
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