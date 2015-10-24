/**
 *
 */
angular.module('mycdc.data', [])

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('AppData', function($http, $q, AppStorage) {})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('MenuData', function($http, $q, MenuStorage) {
      var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/conf.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d;

            MenuStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = MenuStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    service.getAll = function() {
        return data;
    };

    service.get = function(idx) {
        return data[idx];
    };

    return service;
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('HomeStreamData', function($http, $q, HomeStreamStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;


            // var getRandom = function(max, min) {
            //         return Math.floor(Math.random() * (max - min + 1));
            //     },
            //     socialcards = [
            //     {
            //         name: 'Facebook',
            //         description: '',
            //         href: '#/app/Facebook',
            //         image: 'img/facebook.png'
            //     },
            //     {
            //         name: 'Twitter',
            //         description: '',
            //         href: '#/app/Twitter',
            //         image: 'img/twitter.png'
            //     },
            //     {
            //         name: 'Instagram',
            //         description: '',
            //         href: 'https://instagram.com/cdcgov/',
            //         image: 'img/instagram.png'
            //     },
            //     {
            //         name: 'Google+',
            //         description: '',
            //         href: 'https://plus.google.com/+CDC/posts',
            //         image: 'img/googleplus.png'
            //     },
            //     {
            //         name: 'Pinterest',
            //         description: '',
            //         href: 'https://www.pinterest.com/cdcgov/',
            //         image: 'img/pinterest.png'
            //     },
            //     {
            //         name: 'Flickr',
            //         description: '',
            //         href: 'https://www.flickr.com/photos/CDCsocialmedia',
            //         image: 'img/flickr.png'
            //     }];

            // for (var k = data.length - 1; k >= 0; k--) {
            //     if (k % 10 === 0) {
            //         var newdatum = {},
            //             socialrandom = socialcards[getRandom(socialcards.length, 1)];

            //         newdatum.description = socialrandom.description;
            //         newdatum.type = 'social';
            //         newdatum.name = socialrandom.name;
            //         newdatum.enclosures = [];
            //         newdatum.image = socialrandom.image;
            //         newdatum.href = socialrandom.href;
            //         data.splice(k, 0, newdatum);
            //     }
            // }

    service.async = function() {
        $http({
            method: 'GET',
            url: 'http://prototype.cdc.gov/api/v2/resources/media?parentId=150686&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language&max=100',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            for (var i = data.length - 1; i >= 0; i--) {
                datum = data[i];

                // format the dateModified
                time = moment(datum.datePublished);
                datum.datePublished = time.format('MMMM Do, YYYY');

                // remove html from name
                datum.name = datum.name.replace(/<[^>]+>/gm, '');

                // remove html from description
                datum.description = datum.description.replace(/<[^>]+>/gm, '');

                // if there's an enclosure
                if (datum.enclosures.length) {
                    var enclosures = datum.enclosures;

                    // look for the image enclosure
                    for (var j = enclosures.length - 1; j >= 0; j--) {
                        if (enclosures[j].contentType.indexOf('image') > -1) {
                            hasImage = true;
                            datum.imageSrc = enclosures[j].resourceUrl;
                            break;
                        }
                    }
                }

                // If there are any tags, look for the ContentGroup to identify it (and it's path) here for use in the template
                if (datum.tags.length) {
                    var tags = datum.tags;

                    // look for the ContentGroup enclosure
                    for (var k = tags.length - 1; k >= 0; k--) {
                        if (tags[k].type === 'ContentGroup') {
                            datum.contentGroup = tags[k].name;


                            // TODO: This is terrible!!!!!!!!!!!!!!!!!!!!!!!!!
                            if (datum.contentGroup === 'EID') {
                                hasImage = false;
                                datum.home = '#/app/EIDS';
                                datum.url = '#/app/EID/';
                                break;
                            }

                            if (datum.contentGroup === 'Vital Signs') {
                                hasImage = false;
                                datum.home = '#/app/VitalSigns';
                                datum.url = '#/app/VitalSign/';
                                break;
                            }

                            if (datum.contentGroup === 'Image of the Week') {
                                datum.name = '';
                                datum.home = '#/app/PHILs';
                                datum.url = '#/app/PHIL/';
                                break;
                            }

                            if (datum.contentGroup === 'YouTube') {
                                datum.name = '';
                                datum.home = '#/app/YouTubes';
                                datum.url = '#/app/YouTube/';
                                break;
                            }

                            if (datum.contentGroup === 'MMWR' || datum.contentGroup === 'MMWR 2016') {
                                datum.name = '';
                                datum.home = '#/app/MMWRS';
                                datum.url = '#/app/MMWR/';
                                break;
                            }

                            if (datum.contentGroup === 'Public Health Matters Blog') {
                                datum.name = '';
                                datum.home = '#/app/PHMblogs';
                                datum.url = '#/app/PHMblog/';
                                break;
                            }

                            if (datum.contentGroup === 'Featured Health Articles') {
                                datum.name = '';
                                datum.home = '#/app/healtharticles';
                                datum.url = '#/app/healtharticle/';
                                break;
                            }

                            if (datum.contentGroup === 'Did You Know?') {
                                datum.name = '';
                                datum.home = '#/app/DYK/0';
                                datum.url = '#/app/DYK/0';
                                break;
                            }

                            if (datum.contentGroup === 'Outbreaks') {
                                datum.name = '';
                                datum.isOutbreak = true;
                                hasImage = false;
                                datum.home = '#/app/Outbreaks';
                                datum.url = '#/app/Outbreak/';
                                break;
                            }

                            if (datum.contentGroup === 'Disease of the Week') {
                                datum.name = '';
                                datum.home = '#/app/dotw';
                                datum.url = '#/app/disease/';
                                break;
                            }

                            if (datum.contentGroup === 'Travel Notices') {
                                datum.home = '#/app/TravelNotices';
                                datum.url = '#/app/TravelNotice/';
                                //Warning, Watch, Alert, based off text in the name
                                datum.isAlert = datum.name.indexOf('Alert') > -1;
                                datum.isWatch = datum.name.indexOf('Watch') > -1;
                                datum.isWarning = datum.name.indexOf('Warning') > -1;
                                datum.name = '';
                                break;
                            }

                            if (datum.contentGroup === 'Newsroom') {
                                datum.home = '#/app/Newsrooms';
                                datum.url = '#/app/Newsroom/';
                                datum.name = '';
                                break;
                            }



                            // WARN: Watch for CGs which don't have a source stream
                        }
                    }
                }

                datum.hasImage = hasImage;
            }

            HomeStreamStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = HomeStreamStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    service.getAll = function() {
        return data;
    };

    service.get = function(idx) {
        return data[idx];
    };

    service.getId = function(idx) {
        if (data.length) {
            return data[idx].id;
        }
        else {
            return 0;
        }
    };

    return service;
})


/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('DotwData', function($http, $q, DotwStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Disease%20of%20the%20Week&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                DotwStorage.save(data);
                deferred.resolve();
            }
            else {
                data = DotwStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = DotwStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('DotwContent', function($http, $rootScope) {
    return {
        getStatus: function(url) {
            return $http.get($rootScope.existsUrl + url);
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('FluViewData', function($http, $q, FluViewStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=FluView%20Weekly%20Report&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results[0];   // ONLY THE FIRST

            if (d.data.results.length) {
                time = moment(data.datePublished);
                data.datePublished = time.format('MMMM Do, YYYY');
                FluViewStorage.save(data);
                deferred.resolve();
            }
            else {
                data = FluViewStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = FluViewStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    // there is only one fluview, so this is the only method required
    service.getAll = function() {
        return data;
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('FluViewContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})


/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('CDCAtwsData', function($http, $q, CDCAtwsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false,
        isDirty = false;

    service.async = function() {
        getData();
        return promise;
    };

    var getData = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Global%20Health&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');
                    datum.hasImage = hasImage;
                }

                isDirty = true;
                CDCAtwsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = CDCAtwsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = CDCAtwsStorage.all();
            deferred.reject();
        }).
        finally(function() {});
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('CDCAtwsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('HealthArticlesData', function($http, $q, HealthArticlesStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Featured%20Health%20Articles&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                HealthArticlesStorage.save(data);
                deferred.resolve();
            }
            else {
                data = HealthArticlesStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = HealthArticlesStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

.factory('HealthArticlesContent', function($http, $rootScope) {
    return {
        getStatus: function(url) {
            console.log($rootScope.existsUrl + url);
            return $http.get($rootScope.existsUrl + url);
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('VitalSignsData', function($http, $q, VitalSignsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Vital%20Signs&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];
                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');
                    datum.hasImage = hasImage;
                }

                VitalSignsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = VitalSignsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = VitalSignsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('VitalSignsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('FastStatsData', function($http, $q, FastStatsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=FastStats&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                FastStatsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = FastStatsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = FastStatsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('FastStatsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('WeeklyCaseCountsData', function($http, $q, WeeklyCaseCountsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/WeeklyCaseCounts.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                WeeklyCaseCountsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = WeeklyCaseCountsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = WeeklyCaseCountsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

.factory('WeeklyCaseCountsContent', function($http, $rootScope) {
    return {
        getStatus: function(url) {
            return $http.get($rootScope.existsUrl + url);
        }
    };
})



/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('EIDsData', function($http, $q, EIDsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false,
        isDirty = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=EID&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');

                    // remove html from name
                    datum.name = datum.name.replace(/<[^>]+>/gm, '');

                    // remove html from description
                    datum.description = datum.description.replace(/<[^>]+>/gm, '');

                    // WE ARE NOT SHOWING EID IMAGES
                    datum.hasImage = false;
                }

                isDirty = true;
                EIDsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = EIDsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = EIDsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
        else {
            debugger;
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('EIDsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('MMWRsData', function($http, $q, MMWRsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=MMWR%202016&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                MMWRsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = MMWRsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = MMWRsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('MMWRsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})


/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('PCDsData', function($http, $q, PCDsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=PCD&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');

                    // WE ARE NOT SHOWING PCD images
                    datum.hasImage = hasImage;
                }

                PCDsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = PCDsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = PCDsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('PCDsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('NewsroomsData', function($http, $q, NewsroomsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Newsroom&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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
                                console.log(enclosures[j].contentType);
                                hasImage = true;
                                datum.imageSrc = enclosures[j].resourceUrl;
                                break;
                            }
                        }
                    }

                    datum.hasImage = hasImage;
                }

                NewsroomsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = NewsroomsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = NewsroomsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

.factory('NewsroomsContent', function($http, $rootScope) {
    return {
        getStatus: function(url) {
            return $http.get($rootScope.existsUrl + url);
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('OutbreaksData', function($http, $q, OutbreaksStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Outbreaks&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];

                    // flag these as outbreaks
                    datum.isOutbreak = true;

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');
                    datum.hasImage = hasImage;
                }

                OutbreaksStorage.save(data);
                deferred.resolve();
            }
            else {
                data = NewsroomsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = OutbreaksStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('TravelNoticesData', function($http, $q, TravelNoticesStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Travel%20Notices&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');

                    //Warning, Watch, Alert, based off text in the name
                    datum.isAlert = datum.name.indexOf('Alert') > -1;
                    datum.isWatch = datum.name.indexOf('Watch') > -1;
                    datum.isWarning = datum.name.indexOf('Warning') > -1;
                    datum.hasImage = hasImage;
                }

                TravelNoticesStorage.save(data);
                deferred.resolve();
            }
            else {
                data = TravelNoticesStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = TravelNoticesStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})


/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('PodcastsData', function($http, $q, PodcastsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Podcasts&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                PodcastsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = PodcastsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = PodcastsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    service.getAll = function() {
        return data;
    };

    service.get = function(idx) {
        return data[idx];
    };

    service.getId = function(idx) {
        if (data.length) {
            return data[idx].id;
        }
        else {
            return 0;
        }
    };

    service.getCount = function() {
        return data.length;
    };

    service.getAudio = function(idx) {
        var src = [];

        angular.forEach(data[idx].enclosures, function(datum) {
            if (datum.contentType.indexOf('audio') > -1) {
                src.push(datum.resourceUrl);
                src.push(datum.contentType);
            }
        });

        return src;
    };

    service.getTranscript = function(idx) {
        var src;

        angular.forEach(data[idx].enclosures, function(datum) {
            if (datum.contentType.indexOf('text/html') > -1) {
                src = datum.resourceUrl;
            }
        });

        return src;
    };

    return service;
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('PHILsData', function($http, $q, PHILsStorage, ScreenSize) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Image%20of%20the%20Week&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];
                    hasImage = false;

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');

                    datum.name = '';

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

                PHILsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = PHILsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = PHILsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    service.getCount = function() {
        return data.length;
    };

    return service;
})


/**
 * *******************************************************************************************
 *                                      BLOGS
 * *******************************************************************************************
 */

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('PHMblogsData', function($http, $q, PHMblogsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Public%20Health%20Matters%20Blog&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                PHMblogsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = PHMblogsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = PHMblogsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('PHMblogsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('DirectorsBlogsData', function($http, $q, DirectorsBlogsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=CDC%20Director%20Blog&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
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

                DirectorsBlogsStorage.save(data);
                deferred.resolve();
            }
            else {
                data = DirectorsBlogsStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = DirectorsBlogsStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('DirectorsBlogsContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})


/**
 * *******************************************************************************************
 *                                      FACTS
 * *******************************************************************************************
 */

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('DidYouKnowData', function($http, $q, DidYouKnowStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=Did%20You%20Know&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results[0];   // only the first (and only?) record

            if (d.data.results.length) {
                time = moment(data.datePublished);
                data.datePublished = time.format('MMMM Do, YYYY');
                DidYouKnowStorage.save(data);
                deferred.resolve();
            }
            else {
                data = DidYouKnowStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = DidYouKnowStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    // only ever just this
    service.getAll = function() {
        return data;
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('DidYouKnowContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('FactoftheWeekData', function($http, $q, FactoftheWeekStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=24%2F7%20Facts%20of%20the%20Week&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];
                    hasImage = false;

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');

                    // remove encoding from description
                    var txt = document.createElement('textarea');
                    txt.innerHTML = datum.description;
                    datum.description = txt.value;

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

                FactoftheWeekStorage.save(data);
                deferred.resolve();
            }
            else {
                data = FactoftheWeekStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = FactoftheWeekStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };
    // returns the data object created when async is called
    service.getAll = function() {
        return data;
    };

    // returns the data item (BY INDEX) from the data object
    service.get = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx];
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i]);
                        return data[i];
                    }
                }
            }
        }
    };

    // returns the source url from the data item
    service.getSourceUrl = function(idx) {
        if (data.length) {
            // data by index
            if (typeof data[idx] !== 'undefined') {
                return data[idx].sourceUrl;
            }
            else {
                // look for the data by ID
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id == idx) {
                        console.log(data[i].sourceUrl);
                        return data[i].sourceUrl;
                    }
                }
            }
        }
    };

    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('FactoftheWeekContent', function($http) {
    return {
        getContent: function(id) {
            console.log('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
            return $http.get('https://prototype.cdc.gov/api/v2/resources/media/' + id + '/syndicate.json');
        }
    };
})

/**
 * *******************************************************************************************
 *                                      FACTS
 * *******************************************************************************************
 */

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('YouTubesData', function($http, $q, YouTubesStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        time = new Date(),
        datum = [],
        enclosures = [],
        service = {},
        hasImage = false;

    var getData = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=YouTube&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];
                    hasImage = false;

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');

                    datum.description = datum.description.split('Comments on this video')[0].trim();

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

                YouTubesStorage.save(data);
                deferred.resolve();
            }
            else {
                data = YouTubesStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = YouTubesStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    service.async = function() {
        $http({
            method: 'GET',
            url: 'https://prototype.cdc.gov/api/v2/resources/media.json?contentgroup=YouTube&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            if (d.data.results.length) {
                for (var i = data.length - 1; i >= 0; i--) {
                    datum = data[i];
                    hasImage = false;

                    // format the dateModified
                    time = moment(datum.datePublished);
                    datum.datePublished = time.format('MMMM Do, YYYY');

                    datum.description = datum.description.split('Comments on this video')[0].trim();

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

                YouTubesStorage.save(data);
                deferred.resolve();
            }
            else {
                data = YouTubesStorage.all();
                deferred.reject();

                if (_.isEmpty(data)) {}
            }
        }).
        catch(function() {
            data = YouTubesStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

    service.getAll = function() {
        return data;
    };

    service.get = function(idx) {
        return data[idx];
    };

    service.getId = function(idx) {
        if (data.length) {
            return data[idx].id;
        }
        else {
            return 0;
        }
    };

    service.getById = function(id) {

        if (data.length) {
            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i].id == id) {
                    console.log('old data ', data[i]);
                    return data[i];
                }
            }
        }
        else {
            getData().then(
                function() {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (data[i].id == id) {
                            console.log('new data ', data[i]);
                            return data[i];
                        }
                    }
                },
                function() {
                    return [];
                },
                function() {}
            );
        }
    };

    service.getCount = function() {
        return data.length;
    };

    return service;
});

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
// .factory('YouTubesContent', function($http) {
//     return {
//         getContent: function(id) {
//             re'turn $http.get(https://prototype.cdc.gov/api/v2/resources/media/'+id+'/syndicate.json');
//         }
//     };
// })
