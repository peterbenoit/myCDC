/**
 *  myCDC
 *  TODO: info.plist NSAppTransportSecurity key needs to be corrected before deployment
 */
angular.module('mycdc', [
    'ionic',
    'ngSanitize',
    'mycdc.controllers',
    'mycdc.directives',
    'mycdc.filters',
    'mycdc.services',
    'ngCordova',
    'ngAnimate',
    'angular.filter',
    'ngIOS9UIWebViewPatch'
])

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.run(function($ionicPlatform, $cordovaStatusbar, $rootScope, $location, $ionicBody, $timeout, $window, DeviceInfo, ScreenSize, iFrameReady, $state, $stateParams, $cordovaNetwork, $ionicPopup, $http, $filter, $sce, $q) {

	var rs = $rootScope, href = window.location.href;

	// APP CONTAINER
	rs.app = {};
	rs.logLevel = 100;

	rs.aryHistory = [{
		sourceName : 'homestream',
		sourceDetail : false
	}];

	rs.detailUrl = 'https://tools.cdc.gov/api/v2/resources/media/';
	rs.remoteCheck = 'http://www2c.cdc.gov/podcasts/checkurl.asp?url=';
	rs.sourcesUrl = 'json/sources-local.json';

	// WINDOW.OPEN SHOULD USE INAPPBROWSER
	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady() {

		//window.open = cordova.InAppBrowser.open;

		// BROWSER STATE DEFAULTS
		rs.type = $cordovaNetwork.getNetwork();
		rs.isOnline = $cordovaNetwork.isOnline();
		rs.stateClasses = {};

		// LISTEN FOR ONLINE EVENT
		rs.$on('$cordovaNetwork:online', function(event, networkState){
			// WERE WE PREVIOUSLY ONLINE?
			if (!rs.isOnline) {

				// NO, UPDATE TO OFFLINE
				rs.isOnline = true;
			}
		});

		// LISTEN FOR OFFLINE EVENT
		rs.$on('$cordovaNetwork:offline', function(event, networkState){

			// WERE WE PREVIOUSLY ONLINE?
			if (rs.isOnline) {

				// NO, UPDATE TO OFFLINE
				rs.isOnline = false;

				// ALERT USER WE HAVE GONE OFFLINE
				$ionicPopup.alert({
					title: 'No Connection',
					template: 'You do not appear to be connected to the Internet. Some content you have downloaded may be out of date.'
				});
			}
		});

		$cordovaStatusbar.hide();
		$ionicPlatform.fullScreen();
	}

    // NOTE: THIS ONLY WORKS ON A DEVICE
    // frameready() is called in embed.html, when the iframe has loaded
    window.frameready = iFrameReady;
    // MOVED TO service.js AS iFrameReady - ONCE TESTED ON DEVICES, WE WILL REMOVE THIS COMMENT
    // window.frameready = function() {
    //     var iframe = $('#contentframe');
    //         anchors = iframe.contents().find('#contentArea a'); // only anchors in the content area

    //         //iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument

    //     $rootScope.$broadcast('source-detail-load-complete');

    //     // I RECENTLY COMMENTED THIS OUT AS IT WAS BREAKING THE APP (NOT JUST IFRAME CONTENT)
    //     if (window.device) {
    //       //body = iframe.contents().find('body');
    //       //$(body).unbind("scroll");
    //       //$(body).unbind("click");
    //     }
    //     /*if (body.length) {
    //         body.append('<style>header, footer, #socialMediaShareContainer { display:none !important; }</style>')
    //     }*/

    //     // Capture any anchors clicked in the iframe document
    //     anchors.on('click', function(e) {
    //         e.preventDefault();

    //         //alert('CLICK');

    //         var framesrc = iframe.attr('src'),
    //             href = $(this).attr('href'),
    //             anchor = document.createElement('a');
    //             anchor.href = href;
    //         var anchorhost = anchor.hostname;

    //         // create an anchor with the href set to the iframe src to fetch the domain & protocol
    //         // WARN: cannot assume "http" || "www.cdc.gov"
    //         var frameanchor = document.createElement('a');
    //             frameanchor.href = framesrc;
    //         var framehost = frameanchor.hostname,
    //             frameprotocol = frameanchor.protocol;

    //         // if this anchor doesn't have a hostname
    //         if (anchorhost === '') {
    //             href = frameprotocol + '//' + framehost + href;
    //         }

    //         window.open(href, '_system');
    //     });
    // };

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

    rs.$viewHistory = {
        histories: { root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 } },
        backView: null,
        forwardView: null,
        currentView: null,
        disabledRegistrableTagNames: []
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
    		                    //console.log('obj1.imageSrc');
    		                    //console.log(obj1.imageSrc);
    		                }
    		            }
    		        }

    		        // PROCESS TAGS
    		        if (obj1.tags && obj1.tags.length) {
    		            idx2 = obj1.tags.length;
    		            while (idx2--) {
    		                obj2 = obj1.tags[idx2];
    		                // PROCESS CONTENT GROUPS
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
    		                // PROCESS NAMES
    		                if (obj2.type.toLowerCase() == 'topic') {
    		                    obj1.topic = obj2.name;
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
    		        d.splice(100);
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
    		    var currItem, data = d;

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

    	console.log(d);
    	var data = (d.data && d.data.results) ? d.data.results : [];
    	console.log(data);

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
    			}
    		}
    	}

    	//RETURN IT IN THE PROMISE CHAIN
    	return data;

    	};
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
        var dataTimeoutInMinutes = 60;

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

        return function(strType, appState) {
            strType = strType || 'sourceIndex'; // Supports sourceIndex, sourceDetail
            appState = appState || $$rootScope.appState;
            var storeName, storeAgingName, dataDefault;

            if (strType == 'sourceDetail') {
                storeName = storePrefix + '_' + appState.sourceName + '_' + appState.sourceDetail;
                dataDefault = '';
            } else {
                storeName = storePrefix + '_' + appState.sourceName;
                dataDefault = [];
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
                        };

                        rs.log(objReturn, 0, storeName + ' data');

                        return objReturn;
                    }

                    // DEFAULT RETURN
                    return {
                        name : storeName,
                        expired : true,
                        data : dataDefault
                    };
                },
                save: function(appdata) {
                    window.localStorage[storeAgingName] = moment().format(dateFormat);
                    window.localStorage[storeName] = angular.toJson(appdata);
                },
                clear: function() {
                    window.localStorage.removeItem(storeAgingName);
                    window.localStorage.removeItem(storeName);
                }
            };
        };
    } ());

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
    } ());

    // TODO: Neither of these methods work in scope anymore, and I don't know why!
    rs.viewOnCDC = function () {
        alert('THIS NEEDS WIRED UP');
        // window.open($scope.data.sourceUrl, '_system');
    };

    rs.shareData = function () {
        alert('THIS NEEDS WIRED UP');
    };

    rs.refreshScreenState = function (callback) {

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
            $rootScope.$broadcast('screen-state-update-complete');

            if (callback && callback.call) {
                callback.call();
            }
        }, 0);
    };

    rs.setButtonState = function (appState) {
        appState = appState || $rootScope.appState;
        var buttons = {
            show : {
                home : true || (appState.sourceName !== 'homestream' || rs.sourceDetail),
                back : false || (appState.sourceName !== 'homestream' && appState.sourceDetail)
            }
        };

        rs.buttons = buttons;
    };

    rs.cgNormalize = function (contentgroup) {
        return contentgroup.toLowerCase().replace(/ /g, '').replace(/\//g, '').replace(/\d/g, '');
    };

    // SOURCE DATA HANDLERS (LIST CFG, SOURCE STREAMS, DETAIL HANDLERS, ETC)
    rs.getSourceMeta = function(appState) {

        appState = appState || $rootScope.appState;

        // PARAMS
        var arySourceInfo, strSourceName = appState.sourceName || appState || "";

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

    rs.getSourceIndex = function(blnRefresh, appState) {

        blnRefresh = blnRefresh || false;

        appState = appState || $rootScope.appState;

        var defer, localStore, localData, objMetaData, data;

        defer = $q.defer();
        objMetaData = rs.getSourceMeta(appState);
        localStore = rs.getLocalStoreByAppState('sourceName', appState);
        localData = localStore.all();

        // CHECK IF WE NEED TO REFRESH OR NOT
        if (!blnRefresh && !localData.expired && false) {

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

        var arySourceInfo = [];

        // GET OR DEFAULT SOURCE DETAIL ID
        sourceDetailId = sourceDetailId || $rootScope.appState.sourceDetail;

        if (!sourceDetailId) {
            if (rs.sourceIndex.length) {
                arySourceInfo = [rs.sourceIndex[0]];
            }
        } else {
            // FILTER HERE
            arySourceInfo = $filter('filter')(rs.sourceIndex, {
                id: sourceDetailId
            }) || [];
        }

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

    // rs.backButtonDisplay = function (appState) {

    //     appState = appState || $rootScope.appState;

    //     var objReturn = {
    //         icon : 'ion-chevron-left',
    //         text : 'Home'
    //     };

    //     if (appState.sourceName != 'homestream') {
    //         if (rs.aryHistory.length > 0) {

    //             // GET THIS STATE
    //             var objThisState = {
    //                 sourceName : appState.sourceName || false ,
    //                 sourceDetail : appState.sourceDetail || false
    //             };

    //             // GET THE LAST STATE IN HISTORY
    //             var objLastState = rs.aryHistory[rs.aryHistory.length - 1] || {};

    //             // ARE THEY THE SAME?
    //             if (objLastState.sourceName == objThisState.sourceName && objLastState.sourceDetail == objThisState.sourceDetail) {

    //                 // YES, GO BACK ONE MORE
    //                 objLastState = rs.aryHistory[rs.aryHistory.length - 2] || {};
    //             }

    //             if (objLastState.hasOwnProperty('sourceName')) {
    //                 if (objLastState.sourceName == 'homestream') {
    //                     objReturn.icon = 'ion-chevron-left';
    //                     objReturn.text = 'Home';
    //                 } else {
    //                     objReturn.icon = 'ion-chevron-left';
    //                     objReturn.text = 'Back';
    //                 }
    //             }
    //         }
    //     }
    //     return objReturn;
    // };

    rs.goHome = function () {
        $state.go('app.sourceIndex', { sourceName : 'homestream' });
    };

    // APP INIT
    rs.appInit = function(blnRefresh) {

        var defer = $q.defer();

        // REFRESH REQUESTED?
        if (blnRefresh || !rs.app.initialized || false) {

            // GET & SAVE THE SOURCE LIST PROMISE
            var sourceListPromise = rs.remoteApi({
                url: rs.sourcesUrl
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

                window.objApp = objApp;
                console.warn('objApp is available as window.objApp for ease of development only... DO NOT REFERENCE AS window.objApp IN CODE')

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

                // IF WE FOUND LOCAL SETTINGS, MERGE THEM IN
                if (localFilters) {
               //     objApp.sourceFilters = angular.extend(objApp.sourceFilters, localFilters);
                }

                // SAVE DATA TO ROOTSCOPE
                rs.app = objApp;
                rs.app.initialized = true;

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

    // http://forum.ionicframework.com/t/scrolling-lags-significantly-on-android/28727/2
    if (!ionic.Platform.isIOS()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }

    var sp = $stateProvider;

    sp.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/ui-menu.html',
        controller: 'AppCtrl'
    });

    sp.state('app.settings', {
        url: '/settings',
        views: {
            'appContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    });

    sp.state('app.navigation', {
        url: '/navigation',
        views: {
            'appContent': {
                templateUrl: 'templates/navigation.html',
                controller: 'SettingsCtrl'
            }
        }
    });

    sp.state('app.home', {
        url: '/home',
        views: {
            'appContent': {
                templateUrl: 'templates/ui-main-source-list.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    sp.state('app.sourceIndex', {
        cache: false,
        url: '/source/:sourceName',
        views: {
            'appContent': {
                templateUrl: 'templates/ui-main.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    sp.state('app.sourceDetail', {
        cache: false,
        url: '/source/:sourceName/:sourceDetail',
        reloadOnSearch : false,
        views: {
            'appContent': {
                templateUrl: 'templates/ui-main.html',
                controller: 'CommonSourceCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/source/homestream');
});
