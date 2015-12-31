module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

    watch : {
      files : ['public/**/*.js'],
        tasks : ['build']
    },

    concat: {
            options : {
              separator : ';'
            },
            // TODO ignore vend folder
            dist: {
              src  : ['public/**/*.js'],
              dest : 'public/dist/<%= pkg.name %>.js'
            }
        },
     uglify: {
             dist: {
                 files: {
                   'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                 }
            }
      },
    jsdoc : {
      dist : {
        src : [
             'public/app/*.js', 
             'public/app/**/*.js',
             'server/*.js',
             'server/**/*.js'
            ],
        options : {
          destination : 'Doc',
        }
      }
    },
    cssmin: {

          options: {
            keepSpecialComments: 0
          },
          dist: {
            files: {
              'public/dist/style.min.css': 'public/assets/css/*.css'
            }
            }
        }
  });

  grunt.registerTask("build", [
                 'concat',
                 'uglify',
                 'cssmin',
                 'jsdoc'
                 ]);
};