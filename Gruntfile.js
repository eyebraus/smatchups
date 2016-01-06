
module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var _ = require('underscore')._;

    var reloadPort = 35729, files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            options: {
                debug: true,
                extensions: ['.jsx'],
                transform: ['reactify', 'bulkify']
            },

            devApp: {
                options: {
                    alias: ['react:']  // Make React available externally for dev tools
                },
                src: ['./public/js/bootstrap.js'],
                dest: './dist/app/bundle.js'
            },

            prodApp: {
                options: {
                    debug: false
                },
                src: '<%= browserify.devApp.src %>',
                dest: '<%= browserify.devApp.dest %>'
            }
        },

        build: {
            app: {
                options: {
                    developTasks: ['jscs', 'browserify:devApp', 'jsdoc', 'stylus:devApp', 'copy:app'],
                    productionTasks: ['browserify:prodApp', 'stylus:prodApp', 'copy:app']
                }
            }
        },

        copy: {
            app: {
                files: [
                    { expand: true, cwd: './public', src: 'index.html', dest: './dist/app' },
                    { expand: true, cwd: './public', src: 'img/**/*.*', dest: './dist/app' }]
            }
        },

        express: {
            options: {
                script: 'app.js'
            },

            devApp: {
                node_env: 'develop'
            },

            prodApp: {
                node_env: 'production'
            }
        },

        jscs: {
            options: {
                config: '.jscsrc',
                esnext: true
            },

            src: ['model/**/*.js', 'public/**/*.js', 'public/**/*.jsx', 'routes/**/*.js', 'app.js']
        },

        jsdoc: {
            doc: {
                src: ['model/**/*.js', 'public/**/*.js', 'public/**/*.jsx', 'routes/**/*.js', 'app.js'],
                options: {
                    destination: 'dist/doc',
                },
            }
        },

        run: {
            app: {
                options: {
                    developTasks: ['jscs', 'watchify:devApp', 'jsdoc', 'stylus:devApp', 'copy:app', 'express:devApp', 'watch'],
                    productionTasks: ['browserify:prodApp', 'stylus:prodApp', 'copy:app', 'express:prodApp', 'keepalive']
                }
            }
        },

        stylus: {
            devApp: {
                files: {
                    './dist/app/css/style.css': ['./public/css/**/*.styl'],
                }
            },

            prodApp: {
                options: {
                    compress: true
                },

                files: '<%= stylus.devApp.files %>'
            }
        },

        watch: {
            options: {
                nospawn: true,
                livereload: reloadPort
            },
            server: {
                files: [
                    'app.js',
                    'model/*.js',
                    'routes/*.js'
                ],
                tasks: ['express:devApp', 'delayed-livereload']
            },
            js: {
                files: ['public/js/*.js', 'dist/js/*.js'],
                options: {
                  livereload: reloadPort
                }
            },
            css: {
                files: ['public/css/*.css'],
                options: {
                  livereload: reloadPort
                }
            },
            styl: {
                files: ['public/css/*.styl'],
                tasks: ['stylus:devApp'],
                options: {
                  livereload: reloadPort
                }
            },
            jade: {
                files: ['views/*.jade'],
                options: {
                  livereload: reloadPort
                }
            }
        },

        watchify: {
            options: {
                debug: true,
                transform: ['reactify', 'bulkify'],
                extensions: ['.jsx']
            },

            devApp: {
                options: {
                    alias: ['react:']  // Make React available externally for dev tools
                },
                src: ['./public/js/bootstrap.js'],
                dest: './dist/app/bundle.js'
            },

            prodApp: {
                options: {
                    debug: false
                },
                src: '<%= watchify.dev.src %>',
                dest: '<%= watchify.dev.dest %>'
            }
        }
    });

    grunt.config.requires('watch.server.files');
    files = grunt.config('watch.server.files');
    files = grunt.file.expand(files);

    grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
        var request = require('request')
          , done = this.async();

        setTimeout(function () {
            request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
                var reloaded = !err && res.statusCode === 200;
                if (reloaded) {
                    grunt.log.ok('Delayed live reload successful.');
                } else {
                    grunt.log.error('Unable to make a delayed live reload.');
                }
                done(reloaded);
            });
        }, 500);
    });

    grunt.registerMultiTask('build', 'Build and deploy application targets', function () {
        grunt.log.writeln('Building target "' + this.target + '"...');

        var options = this.options()
          , developMode = this.flags.develop
          , tasks = developMode
                ? options.developTasks
                : options.productionTasks;

        grunt.task.run(tasks);
    });

    grunt.registerMultiTask('run', 'Run application targets', function () {
        grunt.log.writeln('Running target "' + this.target + '"...');

        var options = this.options()
          , developMode = this.flags.develop
          , tasks = developMode
                ? options.developTasks
                : options.productionTasks;

        grunt.task.run(tasks);
    });

    grunt.registerTask('default', ['run:app:develop']);
};
