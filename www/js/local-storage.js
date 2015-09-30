angular.module('mycdc.storage', [])

.factory('AppStorage', function() {
    return {
        all: function() {
            var appdata = window.localStorage['appdata'];
            if (appdata) {
                return angular.fromJson(appdata);
            }
            return {};
        },
        save: function(appdata) {
            window.localStorage['appdata'] = angular.toJson(appdata);
        },
        clear: function() {
            window.localStorage.removeItem('appdata');
        }
    };
})

.factory('MenuStorage', function() {
    return {
        all: function() {
            var menu = window.localStorage['menu'];
            if (menu) {
                return angular.fromJson(menu);
            }
            // default settings, which ideally would come from a JSON file stored locally... say, config.json?
            return {};
        },
        save: function(menu) {
            window.localStorage['menu'] = angular.toJson(menu);
        },
        clear: function() {
            window.localStorage.removeItem('menu');
        }
    };
})

// keeping each source in individual source storage
.factory('DotwStorage', function() {
    return {
        all: function() {
            var dotw = window.localStorage['dotw'];
            if (dotw) {
                return angular.fromJson(dotw);
            }
            return {};
        },
        save: function(dotw) {
            window.localStorage['dotw'] = angular.toJson(dotw);
        },
        clear: function() {
            window.localStorage.removeItem('dotw');
        }
    };
})
.factory('FluViewStorage', function() {
    return {
        all: function() {
            var fluview = window.localStorage['fluview'];
            if (fluview) {
                return angular.fromJson(fluview);
            }
            return {};
        },
        save: function(fluview) {
            window.localStorage['fluview'] = angular.toJson(fluview);
        },
        clear: function() {
            window.localStorage.removeItem('fluview');
        }
    };
})
.factory('HealthArticlesStorage', function() {
    return {
        all: function() {
            var healtharticles = window.localStorage['healtharticles'];
            if (healtharticles) {
                return angular.fromJson(healtharticles);
            }
            return {};
        },
        save: function(healtharticles) {
            window.localStorage['healtharticles'] = angular.toJson(healtharticles);
        },
        clear: function() {
            window.localStorage.removeItem('healtharticles');
        }
    };
})
.factory('VitalSignsStorage', function() {
    return {
        all: function() {
            var vitalsigns = window.localStorage['vitalsigns'];
            if (vitalsigns) {
                return angular.fromJson(vitalsigns);
            }
            return {};
        },
        save: function(vitalsigns) {
            window.localStorage['vitalsigns'] = angular.toJson(vitalsigns);
        },
        clear: function() {
            window.localStorage.removeItem('vitalsigns');
        }
    };
})
.factory('CDCDirectorBlogStorage', function() {
    return {
        all: function() {
            var cdcdirectorsblog = window.localStorage['cdcdirectorsblog'];
            if (cdcdirectorsblog) {
                return angular.fromJson(cdcdirectorsblog);
            }
            return {};
        },
        save: function(cdcdirectorsblog) {
            window.localStorage['cdcdirectorsblog'] = angular.toJson(cdcdirectorsblog);
        },
        clear: function() {
            window.localStorage.removeItem('cdcdirectorsblog');
        }
    };
})
.factory('CDCWorksforYou247BlogStorage', function() {
    return {
        all: function() {
            var cdcworksblog = window.localStorage['cdcworksblog'];
            if (cdcworksblog) {
                return angular.fromJson(cdcworksblog);
            }
            return {};
        },
        save: function(cdcworksblog) {
            window.localStorage['cdcworksblog'] = angular.toJson(cdcworksblog);
        },
        clear: function() {
            window.localStorage.removeItem('cdcworksblog');
        }
    };
})
.factory('FastStatsStorage', function() {
    return {
        all: function() {
            var phmblog = window.localStorage['phmblog'];
            if (phmblog) {
                return angular.fromJson(phmblog);
            }
            return {};
        },
        save: function(phmblog) {
            window.localStorage['phmblog'] = angular.toJson(phmblog);
        },
        clear: function() {
            window.localStorage.removeItem('phmblog');
        }
    };
})
.factory('FastStatsStorage', function() {
    return {
        all: function() {
            var faststats = window.localStorage['faststats'];
            if (faststats) {
                return angular.fromJson(faststats);
            }
            return {};
        },
        save: function(faststats) {
            window.localStorage['faststats'] = angular.toJson(faststats);
        },
        clear: function() {
            window.localStorage.removeItem('faststats');
        }
    };
})


;
