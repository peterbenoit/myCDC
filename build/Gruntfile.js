module.exports = function(grunt) {
  // load all grunt tasks
  // npm install --save-dev matchdep
  // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // SETUP GLOBAL CONFIGURATION
  global.cfg = {
    pkg: grunt.file.readJSON('package.json'),
    version: function() {
      // {build} -> {major}.{minor}.{point}
      //CDC_TemplatePackage_{build}_RC{RCNumber}

      // SINCE CONFIG IS STRING BASED (AS IS BUILD IDENTIFIER BELOW), UPDATING THIS TO DEFAULT TO "0" AND ALWAYS APPENDING IT (UNLESS PETE DISAGREES)
      var rc = (this.pkg.releaseCandidate && this.pkg.releaseCandidate.length > 0) ? this.pkg.releaseCandidate : "0",
        build = this.pkg.majorVersion + '.' + this.pkg.minorVersion + '.' + this.pkg.buildVersion + "." + rc;

      return build;
    },
    os: function() {
      var dir = (process.platform === 'darwin') ? 'mac' : 'win';
      return dir;
    },
    date: function () {
      var t = new Date(),
      d = t.getDate(),
      m = t.getMonth() +1,
      y = t.getFullYear(),
      hr = t.getHours(),
      min = t.getMinutes(),
      sec = t.getSeconds();

      return m + '/' + d + '/' + y + '@' + hr + ':' + min + ':' + sec;
    }
  };

  // ALLOW SOURCE & DESTINATION FOLDER OVERRIDES
  global.cfg.pkg.directories.src = (grunt.option('source') || global.cfg.pkg.directories.src);
  global.cfg.pkg.directories.dest = (grunt.option('deploy') || global.cfg.pkg.directories.dest);

  // SET PRIVATE VARS: ENVIRONMENT CONFIG, DESIRED GRUNT OPTIONS, ETC
  var ENVS = {
      LOCAL: {
        load: ['grunt-contrib-less'],
        task: ['less:development']
      },
      DEV: {
        load: ['grunt-contrib-less'],
        task: ['less:development','less:wcms']
      },
      PROTOTYPE: {
        load: ['grunt-contrib-less','grunt-contrib-copy','grunt-contrib-uglify','grunt-text-replace'],
        task: ['less:development','copy:dev','less:wcms','uglify','replace','update']
      },
      QA: {
        load: ['grunt-contrib-less','grunt-contrib-copy','grunt-contrib-uglify','grunt-text-replace'],
        task: ['less:production','copy:production','less:wcms','uglify','replace','update']
      },
      PROD: {
        load: ['grunt-contrib-less','grunt-contrib-copy','grunt-contrib-uglify','grunt-text-replace'],
        task: ['less:production','copy:production','less:wcms','uglify','replace','update']
      }
    },
    target = (grunt.option('target') || 'PROD'),
    lessOptions = require('./grunt_options/less');


  // LOG CFG (IF VERBOSE)
  grunt.verbose.writeflags(cfg, "Contents of package.json");

  // OS DETECTION & HANDLING:

  // GET THE CURRENT OS
  global.cfg.currentOs = global.cfg.os();

  // LOG CURRENT OS IF VERBOSE
  grunt.log.ok('Current OS Selected:' + global.cfg.currentOs);

  // DIRECTORY CONFIG SWITCHING
  grunt.verbose.writeln('Checking for OS Specific Directory Config');

  // LOAD REQUIRED NODE MODULES (BY ENVIRONMENT CONFIG)
  if (!ENVS.hasOwnProperty(target)) {

    // FAIL ON BAD ENV
    grunt.fail.fatal('"target" parameter required --> e.g. --target=PROD   Supported target environments: ' + Object.keys(ENVS).toString());

  } else {

    // NORMALIZE / SANITIZE TARGET AS UPPERCASE (TO MAKE CONFIGURATIO(Italian!) VALUE MORE FORGIVING & CONSISTENT)
    target = target.toUpperCase();

    // DEPENDENCY LOADING BY ENVIRONEMNT
    grunt.verbose.write('Target environment: ' + target);

    // GET ARRAY OF CURRENT BUILD DEPENDENCIES & TASKS (node_modules, etc)
    var load = ENVS[target].load;

    // LOG CURRENT OS IF VERBOSE
    grunt.log.ok('Build Dependencies & Tasks Loaded');

    // DIRECTORY CONFIG SWITCHING
    grunt.verbose.writeflags(load, 'Build Dependencies');

    // LOOP ARRAY & LOAD EACH MODULE
    grunt.verbose.writeln('Load Tasks');

    for (var i = 0, len = load.length; i < len; i++) {
      grunt.verbose.writeln('-- Loading: ' + load[i]);
      grunt.loadNpmTasks(load[i]);
    }

    grunt.verbose.writeln('Done Loading Tasks');
  }

  // LOG NODE MODULE LOADING COMPLETED
  grunt.log.ok('node_modules load completed');

  // INIT GRUNT CONFIG
  grunt.initConfig({
    pkg: cfg.pkg,
    src: '<%= grunt.task.current.file.src %>',
    version: cfg.version(),
    os: cfg.os(),
    time: function () {
      var t = new Date().getTime() / 1000,
      h = parseInt(t / 3600) % 24,
      m = parseInt(t / 60) % 60,
      s = parseInt(t % 60, 10);

      return h + '-' + m + '-' + s;
    },
    timeStamp: function () {
      return new Date().getTime();
    },
    less: lessOptions
  });

  // LOAD OUR EXTERNALLY DEFINED GRUNT TASKS
  grunt.loadTasks('./grunt_tasks');

  // REGISTER OUR ENVIRONMENT SPECIFIC BUILD TASK(S)
  grunt.registerTask('default', ENVS[target].task);
};
