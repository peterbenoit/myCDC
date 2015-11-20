/**
 *
 */
angular.module('mycdc.filters', [])

.filter('partition', function($cacheFactory) {
    var arrayCache = $cacheFactory('partition');
    var filter = function(arr, size) {
        if (!arr) { return; }
        var newArr = [];
        for (var i = 0; i < arr.length; i += size) {
            newArr.push(arr.slice(i, i + size));
        }
        var cachedParts;
        var arrString = JSON.stringify(arr);
        cachedParts = arrayCache.get(arrString + size);
        if (JSON.stringify(cachedParts) === JSON.stringify(newArr)) {
            return cachedParts;
        }
        arrayCache.put(arrString + size, newArr);
        return newArr;
    };
    return filter;
})
.filter('characters', function() {
    return function(input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            } else {
                while (input.charAt(input.length - 1) === ' ') {
                    input = input.substr(0, input.length - 1);
                }
            }
            return input + '…';
        }
        return input;
    };
})
.filter('splitcharacters', function() {
    return function(input, chars) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            var prefix = input.substring(0, chars / 2);
            var postfix = input.substring(input.length - chars / 2, input.length);
            return prefix + '...' + postfix;
        }
        return input;
    };
})
.filter('words', function() {
    return function(input, words) {
        if (isNaN(words)) return input;
        if (words <= 0) return '';
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '…';
            }
        }
        return input;
    };
})
.filter('groupBy', function() {
    var mArr = null,
        mGroupBy = null,
        mRetArr = null,
        getMemoArr = function(arr, groupBy) {
            var ret = {};
            angular.forEach(arr, function(item) {
                var groupValue = item[groupBy];
                if (ret[groupValue]) {
                    ret[groupValue].push(item);
                } else {
                    ret[groupValue] = [item];
                }
            });
            return ret;
        };
    return function(arr, groupBy) {
        var newMemoArr = getMemoArr(arr, groupBy);
        if (mGroupBy !== groupBy || !angular.equals(mArr, newMemoArr)) {
            mArr = newMemoArr;
            mGroupBy = groupBy;
            mRetArr = [];
            var groups = {};
            angular.forEach(arr, function(item) {
                var groupValue = item[groupBy];
                if (groups[groupValue]) {
                    groups[groupValue].items.push(item);
                } else {
                    groups[groupValue] = {
                        items: [item]
                    };
                    groups[groupValue][groupBy] = groupValue;
                    mRetArr.push(groups[groupValue]);
                }
            });
        }
        return mRetArr;
    };
})

// TODO: remove all of these, and update json data (similar to images)
.filter('hasAudioEnclosure', ['$sce', function($sce) {
    var resource, enclosuresLength;
    return function(enclosures) {
        enclosuresLength = enclosures.length;
        if (enclosuresLength) {
            console.log(enclosuresLength);
            for (var i = 0; i < enclosuresLength; i++) {
                if (enclosures[i].contentType.indexOf('audio') > -1) {
                    resource = enclosures[i].resourceUrl;
                    break;
                }
            }
        }

        return typeof resource !== 'undefined' ? $sce.trustAsResourceUrl(resource) : false;
    };
}])
.filter('hasPdfEnclosure', ['$sce', function($sce) {
    var resource, enclosuresLength;
    return function(enclosures) {
        enclosuresLength = enclosures.length;
        if (enclosuresLength) {
            console.log(enclosuresLength);
            for (var i = 0; i < enclosuresLength; i++) {
                if (enclosures[i].contentType.indexOf('application/pdf') > -1) {
                    resource = enclosures[i].resourceUrl;
                    break;
                }
            }
        }

        return typeof resource !== 'undefined' ? $sce.trustAsResourceUrl(resource) : false;
    };
}])
.filter('hasHtmlEnclosure', ['$sce', function($sce) {
    var resource, enclosuresLength;
    return function(enclosures) {
        enclosuresLength = enclosures.length;
        if (enclosuresLength) {
            console.log(enclosuresLength);
            for (var i = 0; i < enclosuresLength; i++) {
                if (enclosures[i].contentType.indexOf('application/pdf') > -1) {
                    resource = enclosures[i].resourceUrl;
                    break;
                }
            }
        }

        return typeof resource !== 'undefined' ? $sce.trustAsResourceUrl(resource) : false;
    };
}])


.filter('spliceAtDetailId', ['$filter','$rootScope', function($filter, $rootScope) {
    return function(sourceArray) {
        sourceArray = sourceArray || [];

        var objTmp = {};

        // DO WE HAVE SOMETHING TO FILTER?
        if (sourceArray.length) {
            // DO WE HAVE FILTER CRITERIA?
            if ($rootScope.appState.sourceDetail) {
                objTmp.aryReturn = sourceArray.slice(0).reverse();
                objTmp.srcIndex = sourceArray.length;
                objTmp.detailId = $rootScope.appState.sourceDetail;

                // LOOP TO FIND CURRENT DETAIL
                while (objTmp.srcIndex--) {

                    // GRAB CURRENT ITEM
                    objTmp.objCurrItem = sourceArray[objTmp.srcIndex];

                    // CHECK ITS ID AGAINS PASSED ID
                    if (objTmp.objCurrItem.id == objTmp.detailId) {

                        // IF ITEM FOUND - BREAK OUT OF LOOP (LEAVING THIS AT FIRST POSITION)
                        break;
                    }

                    // ELSE - PUSH CURRENT ITEM TO END
                    objTmp.aryReturn.push(objTmp.aryReturn.shift());
                }

                if (objTmp.aryReturn.length) {

                    return objTmp.aryReturn;
                }
            }
        }

        // JUST RETURN WHAT WAS PASSED (DEFAULT)
        return sourceArray;
    }
}])

.filter('applySourceFilters', ['$filter', function($filter) {
    return function(sourceArray, sourceFilters) {
        sourceArray = sourceArray || [];

        var objTmp = {};

        // console.log('sourceArray');
        // console.log(sourceArray);
        // console.log('sourceArray.length');
        // console.log(sourceArray.length);
        // console.log('sourceFilters');
        // console.log(sourceFilters);

        // DO WE HAVE SOMETHING TO FILTER?
        if (sourceArray.length) {
            objTmp.aryReturn = [];
            objTmp.srcIndex = sourceArray.length;

            // LOOP TO FIND CURRENT DETAIL
            while (objTmp.srcIndex--) {

                // GRAB CURRENT ITEM
                objTmp.objCurrItem = sourceArray[objTmp.srcIndex];

                // CHECK OBJECT DATA AGAINST FILTERS
                if (sourceFilters.hasOwnProperty(objTmp.objCurrItem.typeIdentifier)) {
                    if (sourceFilters[objTmp.objCurrItem.typeIdentifier].hasOwnProperty(objTmp.objCurrItem.feedIdentifier)) {
                        if (sourceFilters[objTmp.objCurrItem.typeIdentifier][objTmp.objCurrItem.feedIdentifier].isEnabled) {
                            // PUSH IT TO RETURN IF IT CHECKS OUT
                            objTmp.aryReturn.push(objTmp.objCurrItem);
                            //console.log('PASS');
                        }
                        // else {
                        //     console.log('fail 3');
                        // }
                    }
                    // else {
                    //     console.log('fail 2');
                    // }
                }
                // else {
                //     console.log('fail 1');
                // }
            }

            return objTmp.aryReturn.reverse();
        }

        // JUST RETURN WHAT WAS PASSED (DEFAULT)
        return sourceArray;
    }
}]);
