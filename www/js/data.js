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

    service.async = function() {
        $http({
            method: 'GET',
            url: 'http://prototype.cdc.gov/api/v2/resources/media?parentId=150686&fields=id,name,description,mediaType,tags,sourceUrl,syndicateUrl,datePublished,dateModified,enclosures,language',
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

                if (datum.tags.length) {
                    var tags = datum.tags;

                    // look for the ContentGroup enclosure
                    for (var k = tags.length - 1; k >= 0; k--) {
                        if (tags[k].type === 'ContentGroup') {
                            datum.contentGroup = tags[k].name;


                            // TODO: This is terrible.
                            if (datum.contentGroup === 'EID') {
                                hasImage = false;
                                datum.home = '#/app/EIDS';
                                datum.url = '#/app/EID/';
                            }

                            if (datum.contentGroup === 'Vital Signs') {
                                hasImage = false;
                                datum.home = '#/app/VitalSigns';
                                datum.url = '#/app/VitalSign/';
                            }

                            if (datum.contentGroup === 'Image of the Week') {
                                datum.name = '';
                                datum.home = '#/app/PHILs';
                                datum.url = '#/app/PHIL/';
                            }

                            if (datum.contentGroup === 'YouTube') {
                                datum.name = '';
                                datum.home = '#/app/YouTubes';
                                datum.url = '#/app/YouTube/';
                            }
                            break;
                        }
                    }
                }

// console.log(datum);
                datum.hasImage = hasImage;
            }

            // console.log(data);

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
        return data[idx].id;
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
            url: 'json/sources/DOTW.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            DotwStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = DotwStorage.all();
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

    service.getSourceUrl = function(idx) {
        return data[idx].sourceUrl;
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
            url: 'json/sources/FluView.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results[0];   // only the first (and onlyl?) record
            time = moment(data.datePublished);
            data.datePublished = time.format('MMMM Do, YYYY');
            FluViewStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = FluViewStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

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
            return $http.get('json/content/' + id + '.json');
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
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/CDCAroundtheWorld.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            for (var i = data.length - 1; i >= 0; i--) {
                datum = data[i];

                // format the dateModified
                time = moment(datum.datePublished);
                datum.datePublished = time.format('MMMM Do, YYYY');
                datum.hasImage = hasImage;
            }

            // console.log(data);

            CDCAtwsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = CDCAtwsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/HealthArticles.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            var getRandom = function(max, min) {
                    return Math.floor(Math.random() * (max - min + 1));
                },
                socialcards = [
                {
                    name: 'Facebook',
                    description: '',
                    href: '#/app/Facebook',
                    image: 'img/facebook.png'
                },
                {
                    name: 'Twitter',
                    description: '',
                    href: '#/app/Twitter',
                    image: 'img/twitter.png'
                },
                {
                    name: 'Instagram',
                    description: '',
                    href: 'https://instagram.com/cdcgov/',
                    image: 'img/instagram.png'
                },
                {
                    name: 'Google+',
                    description: '',
                    href: 'https://plus.google.com/+CDC/posts',
                    image: 'img/googleplus.png'
                },
                {
                    name: 'Pinterest',
                    description: '',
                    href: 'https://www.pinterest.com/cdcgov/',
                    image: 'img/pinterest.png'
                },
                {
                    name: 'Flickr',
                    description: '',
                    href: 'https://www.flickr.com/photos/CDCsocialmedia',
                    image: 'img/flickr.png'
                }];

            for (var k = data.length - 1; k >= 0; k--) {
                if (k % 10 === 0) {
                    var newdatum = {},
                        socialrandom = socialcards[getRandom(socialcards.length, 1)];

                    newdatum.description = socialrandom.description;
                    newdatum.type = 'social';
                    newdatum.name = socialrandom.name;
                    newdatum.enclosures = [];
                    newdatum.image = socialrandom.image;
                    newdatum.href = socialrandom.href;
                    data.splice(k, 0, newdatum);
                }
            }

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

            // console.log(data);

            HealthArticlesStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = HealthArticlesStorage.all();
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
        return data[idx].id;
    };

    service.getSourceUrl = function(idx) {
        return data[idx].sourceUrl;
    };

    return service;
})

.factory('HealthArticlesContent', function($http, $rootScope) {
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
            url: 'json/sources/VitalSigns.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            for (var i = data.length - 1; i >= 0; i--) {
                datum = data[i];

                // format the dateModified
                time = moment(datum.datePublished);
                datum.datePublished = time.format('MMMM Do, YYYY');
                datum.hasImage = hasImage;
            }

            // console.log(data);

            VitalSignsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = VitalSignsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/FastStats.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            FastStatsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = FastStatsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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

            // console.log(data);

            WeeklyCaseCountsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = WeeklyCaseCountsStorage.all();
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
        return data[idx].id;
    };

    service.getSourceUrl = function(idx) {
        return data[idx].sourceUrl;
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
        hasImage = false;

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/EID.json',
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

                // WE ARE NOT SHOWING EID IMAGES
                datum.hasImage = false;
            }

            // console.log(data);

            EIDsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = EIDsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/MMWR.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            MMWRsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = MMWRsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/PCD.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            for (var i = data.length - 1; i >= 0; i--) {
                datum = data[i];

                // format the dateModified
                time = moment(datum.datePublished);
                datum.datePublished = time.format('MMMM Do, YYYY');

                // WE ARE NOT SHOWING PCD images
                datum.hasImage = hasImage;
            }

            // console.log(data);

            PCDsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = PCDsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/NewsRoom.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            NewsroomsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = NewsroomsStorage.all();
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
        return data[idx].id;
    };

    service.getSourceUrl = function(idx) {
        return data[idx].sourceUrl;
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
            url: 'json/sources/Outbreaks.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

            for (var i = data.length - 1; i >= 0; i--) {
                datum = data[i];

                // flag these as outbreaks
                datum.isOutbreak = true;

                // format the dateModified
                time = moment(datum.datePublished);
                datum.datePublished = time.format('MMMM Do, YYYY');
                datum.hasImage = hasImage;
            }

            // console.log(data);

            OutbreaksStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = OutbreaksStorage.all();
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
        return data[idx].id;
    };

    service.getSourceUrl = function(idx) {
        return data[idx].sourceUrl;
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
            url: 'json/sources/TravelNotices.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            TravelNoticesStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = TravelNoticesStorage.all();
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
        return data[idx].id;
    };

    service.getSourceUrl = function(idx) {
        return data[idx].sourceUrl;
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
            url: 'json/sources/Podcasts.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            PodcastsStorage.save(data);
            deferred.resolve();
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
        return data[idx].id;
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
            url: 'json/sources/PHIL.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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
        }).
        catch(function() {
            data = PHILsStorage.all();
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
        return data[idx].id;
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
            url: 'json/sources/PublicHealthMattersBlog.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            PHMblogsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = PHMblogsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/CDCDirectorsBlog.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            DirectorsBlogsStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = DirectorsBlogsStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/DidYouKnow.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results[0];   // only the first (and onlyl?) record
            time = moment(data.datePublished);
            data.datePublished = time.format('MMMM Do, YYYY');
            DidYouKnowStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = DidYouKnowStorage.all();
            deferred.reject();
        }).
        finally(function() {});

        return promise;
    };

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
            return $http.get('json/content/' + id + '.json');
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
            url: 'json/sources/FactoftheWeek.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            FactoftheWeekStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = FactoftheWeekStorage.all();
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
        return data[idx].id;
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
            return $http.get('json/content/' + id + '.json');
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

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/YouTube_All.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;

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

            // console.log(data);

            YouTubesStorage.save(data);
            deferred.resolve();
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
        return data[idx].id;
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
//             return $http.get('json/content/' + id + '.json');
//         }
//     };
// })
