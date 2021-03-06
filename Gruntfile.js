/*
 * grunt-onepage-docs
 * https://github.com/al/grunt-onepage-docs
 *
 * Copyright (c) 2016 Al Briggs
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        'swagger-docs-onepage': {
            options: {
                src: 'test/fixtures/*.html',
                serverURLStem: 'http:localhost:1339',
                target: 'tmp'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        },
        copy: {
            libs: {
                files: [
                    {
                        expand: true,
                        cwd: "test/fixtures",
                        src: ["libs/**/*"],
                        dest: "tmp"
                    }
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 1339,
                    hostname: '0.0.0.0',
                    base: 'test/fixtures'
                }
            }
        },
        inlinecss: {
            main: {
                options: {},
                files: [
                    {
                        expand: true,
                        cwd: "tmp",
                        src: ["*-inline.html"],
                        dest: "tmp"
                    }
                ]
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-inline-css');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy','connect:server', 'swagger-docs-onepage','inlinecss']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
