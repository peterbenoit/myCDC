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
.factory('MenuData', function($http, $q, MenuStorage) {})

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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/DOTW.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
    }

    return service;
})

.factory('DotwContent', function($http){
    return {
        getStatus: function(url) {
            return $http.get('http://peterbenoit.com/dev/exists.php?url=' + url);
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/FluView.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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

    service.get = function(idx) {
        return data[idx];
    };

    service.getId = function(idx) {
        return data[idx].id;
    };

    service.getSourceUrl = function(idx) {
        return data[idx].sourceUrl;
    }
    return service;
})

/**
 * Content is an additional query for data, either by sourceUrl or syndicateUrl
 * @param  {[type]} $http
 * @return {[type]}
 */
.factory('FluViewContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/HealthArticles.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
    }

    return service;
})

.factory('HealthArticlesContent', function($http){
    return {
        getStatus: function(url) {
            return $http.get('http://peterbenoit.com/dev/exists.php?url=' + url);
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/VitalSigns.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('VitalSignsContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/FastStats.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('FastStatsContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/WeeklyCaseCounts.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
    }

    return service;
})

.factory('WeeklyCaseCountsContent', function($http){
    return {
        getStatus: function(url) {
            return $http.get('http://peterbenoit.com/dev/exists.php?url=' + url);
        }
    }
})

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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/DidYouKnow.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('DidYouKnowContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/FactoftheWeek.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('FactoftheWeekContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/EID.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('EIDsContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/MMWR.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('MMWRsContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/PCD.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('PCDsContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/NewsRoom.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
    }

    return service;
})

.factory('NewsroomsContent', function($http){
    return {
        getStatus: function(url) {
            return $http.get('http://peterbenoit.com/dev/exists.php?url=' + url);
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/Outbreaks.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
    }

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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/TravelNotices.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
    }

    return service;
})

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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/Blogs.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
.factory('PHMblogsContent', function($http){
    return {
        getContent: function(id) {
            return $http.get('json/content/' + id + '.json');
        }
    }
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
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/Podcasts.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
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
    }

    service.getAudio = function(idx) {
        var src = [];

        angular.forEach(data[idx].enclosures, function(datum){
            if(datum.contentType.indexOf('audio') > -1) {
                src.push(datum.resourceUrl);
                src.push(datum.contentType);
            }
        })

        return src;
    };

    service.getTranscript = function(idx) {
        var src;

        angular.forEach(data[idx].enclosures, function(datum){
            if(datum.contentType.indexOf('text/html') > -1) {
                src = datum.resourceUrl;
            }
        })

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
.factory('PHILsData', function($http, $q, PHILsStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/PHIL.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
            console.log(data);
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
    }

    return service;
})












/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('DirectorsBlogData', function($http, $q, DirectorsBlogStorage) {
    var deferred = $q.defer(),
        promise = deferred.promise,
        data = [],
        service = {};

    service.async = function() {
        $http({
            method: 'GET',
            url: 'json/sources/Blogs.json',
            timeout: 5000
        }).
        then(function(d) {
            data = d.data.results;
            DirectorsBlogStorage.save(data);
            deferred.resolve();
        }).
        catch(function() {
            data = DirectorsBlogStorage.all();
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
.factory('CDCWorksforYou247BlogData', function($http, $q, CDCWorksforYou247BlogStorage) {})

/**
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
.factory('PublicHealthMattersBlogData', function($http, $q, PublicHealthMattersBlogStorage) {})


;
