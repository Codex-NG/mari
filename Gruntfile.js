module.exports = function(grunt) {

  //-------------------------------------------------------
  // Plugin Config
  //-------------------------------------------------------
  grunt.initConfig({

    "clean": {
      all: [
        "app/styles/css",
        "app/styles/css-prefixed",
        "dist",
        ".tmp"
      ]
    },

    "sass": {
      all: {
        options: {
          style: "expanded",
          compass: false,
          loadPath: ["app/styles/scss", "app/bower_components/bootstrap-sass/assets/stylesheets"]
        },
        files: [{
            expand: true,
            cwd: "app/styles/scss",
            src: ["**/*.scss"],
            dest: "app/styles/css",
            ext: ".css"
        }]
      }
    },

    "watch": {
      sass: {
        files: "app/styles/scss/*.scss",
        tasks: ['sass:dev']
      }
    },

    "autoprefixer": {
      options: {
        browsers: ["last 2 versions", "ie 9"]
      },
      all: {
        files: [{
          expand: true,
          cwd: "app/styles/css",
          src: ["**/*.css"],
          dest: "app/styles/css-prefixed",
          ext: ".css"
        }]
      }
    },

    "copy": {
      "dist": {
        files: [{
          expand: true,
          cwd: "app/",
          dest: "dist/",
          src: [
            "index.html",
            "img/**",
            "partials/**",
          ],
          filter: "isFile"
        }]
      }
    },

    "useminPrepare": {
      html: ['dist/index.html'],
      options: {
        root: 'app/',
        dest: 'dist/'
      }
    },

    "usemin": {
      css: ['dist/styles/css/*.css'],
      html: ['dist/index.html'],
      options: {
        assetsDirs: ['dist/']
      }
    },

    "ngtemplates": {
      app: {
        cwd: 'app',
        src: ['*.html', 'partials/*.html'],
        dest: '.tmp/js/templates.js',
        options: {
          module: 'mg',
          usemin: '/js/mg.js'
        }
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          env: {
            PORT: '8000',
            APP_ROOT: '/app'
          }
        }
      },
      prod: {
        script: 'server.js',
        options: {
          env: {
            PORT: '8888',
            APP_ROOT: '/dist'
          }
        }
      }
    },

    jshint: {
      src: ['app/js/*/*'],
      options: {
        reporter: require('jshint-stylish')
      }
    },

    filerev: {
      css: {
        src: 'dist/styles/css/*'
      },
      javascript: {
        src: ['dist/js/*']
      },
      images: {
        src: 'dist/img/*.{gif,jpg,jpeg,png,svg}'
      }
    }

  });

  //-------------------------------------------------------
  // Plugins
  //-------------------------------------------------------
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-usemin');

  //-------------------------------------------------------
  // Tasks
  //-------------------------------------------------------
  grunt.registerTask('dist', [
    'clean',
    'jshint',
    'copy:dist',
    'sass',
    'autoprefixer',
    'useminPrepare',
    'ngtemplates',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'filerev',
    'usemin'
  ]);
  grunt.registerTask('default', ['sass', 'autoprefixer', 'jshint', 'nodemon:dev']);
  grunt.registerTask('run', ['nodemon:dev']);
  grunt.registerTask('run-prod', ['nodemon:prod']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('build', ['sass', 'autoprefixer', 'jshint'])
};
