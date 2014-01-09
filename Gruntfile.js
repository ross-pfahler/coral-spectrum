/*global module:false*/
module.exports = function(grunt) {
  /**
    Build directories
    Any directories used by the build should be defined here
  */
  var dirs = {
    build: 'build',
    modules: 'node_modules',
    shared: 'shared',
    styles: 'styles',
    components: 'components',
    tests: 'tests'
  };

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-subgrunt');

  // Read in package.json
  var pkg = grunt.file.readJSON('package.json');

  var coralComponents = pkg.coral.imports;

  // Meta and build configuration
  var meta = {
    version: pkg.version,
    appName: pkg.name,
    appWebSite: pkg.repository.url
  };

  function getSubgruntTasks(imports) {

    var subrunttasks = {};

    for(var k in imports) {
      var key = imports[k];

      subrunttasks[key] = {};
      subrunttasks[key][dirs.modules + '/' + key] = 'full';
    }

    return subrunttasks;
  }

  grunt.initConfig({

    dirs: dirs,
    meta: meta,

    // Task definitions
    clean: {
      build: '<%= dirs.build %>'
    }, // clean

    copy: {
      res_components: {
        files: [
          {
            // copies the LESS files
            expand: true,
            // goes into the modules folder.
            cwd: '<%= dirs.modules %>/',
            // copies the less files
            src: ['*/build/less/**.less'],
            dest: '<%= dirs.build %>/less',
            // rename to remove the "resources" folder from source
            rename: function (dest, src) {
              var srcPath = src.split('/'),
                  component = srcPath[srcPath.length - 4],
                  filename = srcPath[srcPath.length - 1];

              return dest + '/' + component + '/' + filename;
            }
          },
          // copies the css files. All files are copied in the same level.
          {
            expand: true,
            // goes into the modules folder.
            cwd: '<%= dirs.modules %>/',
            src: ['*/build/styles/**.css'],
            dest: '<%= dirs.build %>/styles',
            flatten: true
          },
          // copies all the examples. They are copied preserving the hierarchy.
          {
            expand: true,
            cwd: '<%= dirs.modules %>/',
            src: ['*/build/examples/**.*'],
            dest: '<%= dirs.build %>/examples',
            // rename to remove the "examples" folder from source
            rename: function (dest, src) {
              var srcPath = src.split('/'),
                  component = srcPath[srcPath.length - 4],
                  filename = srcPath[srcPath.length - 1];

              return dest + '/' + component + '/' + filename;
            }
          },
          // copies the files from shared/scripts into build/js
          {
            expand: true,
            cwd: '<%= dirs.modules %>/',
            src: ['*/build/scripts/**.*'],
            dest: '<%= dirs.build %>/scripts',
            // rename to remove the "scripts" folder from source
            rename: function (dest, src) {
              var srcPath = src.split('/'),
                  filename = srcPath[srcPath.length - 1];

              return dest + '/' + filename;
            }
          }
        ]
      }
    },

    // subgrunt is used to build the dependencies.
    subgrunt: getSubgruntTasks(pkg.coral.imports),

  });
  // end init config

  grunt.task.registerTask('dev', [ // task for developers to work
    'connect',
    'watch'
  ]);

  // performs the subgrunt task to compile every component dependance
  grunt.task.registerTask('full', ['subgrunt', 'default']);

  // Default task
  grunt.task.registerTask('default', ['clean', 'copy']);
};
