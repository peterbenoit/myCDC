/**
 *
 */
angular.module('mycdc.storage', [])

/**
 * @return {[type]}
 */
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

/**
 * @return {[type]}
 */
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

/**
 * Keeping each source in individual source storage
 */

/**
 * @return {[type]}
 */
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

/**
 * @return {[type]}
 */
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

/**
 * @return {[type]}
 */
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

/**
 * @return {[type]}
 */
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


/**
 * @return {[type]}
 */
.factory('WeeklyCaseCountsStorage', function() {
    return {
        all: function() {
            var weeklycasecounts = window.localStorage['weeklycasecounts'];
            if (weeklycasecounts) {
                return angular.fromJson(weeklycasecounts);
            }
            return {};
        },
        save: function(weeklycasecounts) {
            window.localStorage['weeklycasecounts'] = angular.toJson(weeklycasecounts);
        },
        clear: function() {
            window.localStorage.removeItem('weeklycasecounts');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('DirectorsBlogStorage', function() {
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

/**
 * @return {[type]}
 */
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

/**
 * @return {[type]}
 */
.factory('PHMblogsStorage', function() {
    return {
        all: function() {
            var phm = window.localStorage['phm'];
            if (phm) {
                return angular.fromJson(phm);
            }
            return {};
        },
        save: function(phm) {
            window.localStorage['phm'] = angular.toJson(phm);
        },
        clear: function() {
            window.localStorage.removeItem('phm');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('FastStatsStorage', function() {
    return {
        all: function() {
            var fast = window.localStorage['fast'];
            if (fast) {
                return angular.fromJson(fast);
            }
            return {};
        },
        save: function(fast) {
            window.localStorage['fast'] = angular.toJson(fast);
        },
        clear: function() {
            window.localStorage.removeItem('fast');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('DidYouKnowStorage', function() {
    return {
        all: function() {
            var dyk = window.localStorage['dyk'];
            if (dyk) {
                return angular.fromJson(dyk);
            }
            return {};
        },
        save: function(dyk) {
            window.localStorage['dyk'] = angular.toJson(dyk);
        },
        clear: function() {
            window.localStorage.removeItem('dyk');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('FactoftheWeekStorage', function() {
    return {
        all: function() {
            var fotw = window.localStorage['fotw'];
            if (fotw) {
                return angular.fromJson(fotw);
            }
            return {};
        },
        save: function(fotw) {
            window.localStorage['fotw'] = angular.toJson(fotw);
        },
        clear: function() {
            window.localStorage.removeItem('fotw');
        }
    };
})


/**
 * @return {[type]}
 */
.factory('EIDsStorage', function() {
    return {
        all: function() {
            var eid = window.localStorage['eid'];
            if (eid) {
                return angular.fromJson(eid);
            }
            return {};
        },
        save: function(eid) {
            window.localStorage['eid'] = angular.toJson(eid);
        },
        clear: function() {
            window.localStorage.removeItem('eid');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('MMWRsStorage', function() {
    return {
        all: function() {
            var mmwr = window.localStorage['mmwr'];
            if (mmwr) {
                return angular.fromJson(mmwr);
            }
            return {};
        },
        save: function(mmwr) {
            window.localStorage['mmwr'] = angular.toJson(mmwr);
        },
        clear: function() {
            window.localStorage.removeItem('mmwr');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('PCDsStorage', function() {
    return {
        all: function() {
            var pcd = window.localStorage['pcd'];
            if (pcd) {
                return angular.fromJson(pcd);
            }
            return {};
        },
        save: function(pcd) {
            window.localStorage['pcd'] = angular.toJson(pcd);
        },
        clear: function() {
            window.localStorage.removeItem('pcd');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('NewsroomsStorage', function() {
    return {
        all: function() {
            var nr = window.localStorage['nr'];
            if (nr) {
                return angular.fromJson(nr);
            }
            return {};
        },
        save: function(nr) {
            window.localStorage['nr'] = angular.toJson(nr);
        },
        clear: function() {
            window.localStorage.removeItem('nr');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('OutbreaksStorage', function() {
    return {
        all: function() {
            var ob = window.localStorage['ob'];
            if (ob) {
                return angular.fromJson(ob);
            }
            return {};
        },
        save: function(ob) {
            window.localStorage['ob'] = angular.toJson(ob);
        },
        clear: function() {
            window.localStorage.removeItem('ob');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('TravelNoticesStorage', function() {
    return {
        all: function() {
            var tn = window.localStorage['tn'];
            if (tn) {
                return angular.fromJson(tn);
            }
            return {};
        },
        save: function(tn) {
            window.localStorage['tn'] = angular.toJson(tn);
        },
        clear: function() {
            window.localStorage.removeItem('tn');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('PodcastsStorage', function() {
    return {
        all: function() {
            var pod = window.localStorage['pod'];
            if (pod) {
                return angular.fromJson(pod);
            }
            return {};
        },
        save: function(pod) {
            window.localStorage['pod'] = angular.toJson(pod);
        },
        clear: function() {
            window.localStorage.removeItem('pod');
        }
    };
})



;
