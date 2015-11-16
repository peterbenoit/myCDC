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

.factory('DataFactory', function($http, $cordovaNetwork, $timeout, LocalStorageFactory) {

    return function (strName, objHttpOptions, fctProcessor, fctError) {

        var promise, factoryData = [], service = {};

        service.factoryName = strName + 'Factory';
        service.dataName = strName + 'Data';
        service.storeName = strName + 'Store';
        service.store = LocalStorageFactory(service.factoryName);

        fctProcessor = fctProcessor || function(d){
            return d.data;
        };

        // HTTP DEFAULT
        objHttpOptions = objHttpOptions || {};
        objHttpOptions.method = objHttpOptions.method || 'GET';
        objHttpOptions.timeout = objHttpOptions.timeout || 5000;
        objHttpOptions.url = objHttpOptions.url || 'json/conf.json';

        service.async = function(blnRefresh) {
            blnRefresh = blnRefresh || false;

            if (blnRefresh || !service.promise) {

                // CREATE THE PROMISE
                if (objHttpOptions.url) {
                    service.promise = $http(objHttpOptions);
                } else {
                    service.promise = $timeout(function(){
                        console.log('NO URL PROVIDED FOR FACTORY ' + service.factoryName)
                    }, 0);
                }

                if (fctProcessor) {
                    service.promise.then(function(d) {
                        factoryData = fctProcessor(d);
                    });
                };

                service.promise.then(function(d) {
                    service.store.save(factoryData);
                });

                service.promise.catch(function() {
                    factoryData = service.store.all();

                    if (fctError) {
                        fctError();
                    }

                    service.promise.reject();
                });

                service.promise.finally(function() {});

            }

            return service.promise;
        };

        service.getAll = function() {
            return factoryData;
        };

        service.get = function(idx) {
            return factoryData[idx];
        };

        return service;
    };
})
