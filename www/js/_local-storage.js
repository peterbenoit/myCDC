/**
 *
 */
angular.module('mycdc.storage', [])

/**
 * @return {[type]}
 */
.factory('LocalStorageFactory', function() {

    var storePrefix = 'myCDC-';

    return function (storeName) {

        storeName = storePrefix + storeName;

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
    };
})

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
.factory('SettingsStorage', function() {
    return {
        all: function() {
            var settings = window.localStorage['settings'];
            if (settings) {
                return angular.fromJson(settings);
            }
            return {
                // Initial App Setting Values
                options: [
                {
                    name: 'First Option',
                    checked: true
                },
                {
                    name: 'Second Option',
                    checked: false
                },
                {
                    name: 'Third Option',
                    checked: false
                }],
                sorting: 'A',
                range: 30
            };
        },
        save: function(settings) {
            window.localStorage['settings'] = angular.toJson(settings);
        },
        clear: function() {
            window.localStorage.removeItem('settings');
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
 * *******************************************************************************************
 *                                      BLOGS
 * *******************************************************************************************
 */

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
.factory('DirectorsBlogsStorage', function() {
    return {
        all: function() {
            var directors = window.localStorage['directors'];
            if (directors) {
                return angular.fromJson(directors);
            }
            return {};
        },
        save: function(directors) {
            window.localStorage['directors'] = angular.toJson(directors);
        },
        clear: function() {
            window.localStorage.removeItem('directors');
        }
    };
})


/**
 * *******************************************************************************************
 *                                      AUDIO/VIDEO
 * *******************************************************************************************
 */

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
/**
 * @return {[type]}
 */
.factory('YouTubesStorage', function() {
    return {
        all: function() {
            var youtube = window.localStorage['youtube'];
            if (youtube) {
                return angular.fromJson(youtube);
            }
            return {};
        },
        save: function(youtube) {
            window.localStorage['youtube'] = angular.toJson(youtube);
        },
        clear: function() {
            window.localStorage.removeItem('youtube');
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
.factory('PHILsStorage', function() {
    return {
        all: function() {
            var phil = window.localStorage['phil'];
            if (phil) {
                return angular.fromJson(phil);
            }
            return {};
        },
        save: function(phil) {
            window.localStorage['phil'] = angular.toJson(phil);
        },
        clear: function() {
            window.localStorage.removeItem('phil');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('CDCAtwsStorage', function() {
    return {
        all: function() {
            var atw = window.localStorage['atw'];
            if (atw) {
                return angular.fromJson(atw);
            }
            return {};
        },
        save: function(atw) {
            window.localStorage['atw'] = angular.toJson(atw);
        },
        clear: function() {
            window.localStorage.removeItem('atw');
        }
    };
})

/**
 * @return {[type]}
 */
.factory('HomeStreamStorage', function() {
    return {
        all: function() {
            var homestream = window.localStorage['homestream'];
            if (homestream) {
                return angular.fromJson(homestream);
            }
            return {};
        },
        save: function(homestream) {
            window.localStorage['homestream'] = angular.toJson(homestream);
        },
        clear: function() {
            window.localStorage.removeItem('homestream');
        }
    };
})



;

