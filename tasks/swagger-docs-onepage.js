/*
 * grunt-swagger-utils
 * https://github.com/Ergosign/grunt-swagger-compile
 *
 * Copyright (c) 2016 Al Briggs
 * Licensed under the MIT license.
 */
'use strict';


module.exports = function (grunt) {
    var path = require('path');
    var sleep = require('sleep');
    var asset = path.join.bind(null, __dirname, '..');

    grunt.task.registerTask('swagger-docs-onepage', 'Inline all CSS and removes Javascript from swagger-ui docs to export a single html document that is easier to distribute.', function (arg1, arg2) {

        var done = this.async();

        grunt.log.writeln('waiting for servers to start');
        sleep.sleep(10);//wait for any servers to be up and running

        var options = this.options();

        var htmlFiles = grunt.file.expand([options.src]);

        var fileNames = [];

        // extract file name
        htmlFiles.forEach(function (path) {
            if (path.indexOf('-inline') === -1) {
                var pathElements = path.split('/');
                var onlyFileName = pathElements.slice(pathElements.length - 1).join();
                var el = onlyFileName.split('.');
                var fileNameWithoutExtension = el.splice(0, el.length - 1).join();
                fileNames.push(fileNameWithoutExtension);
            }
        });



        var completeCounter = 0;

        fileNames.forEach(function (name) {

            var phantomjs = require('grunt-lib-phantomjs').init(grunt);

            // Handle any number of namespaced events like so.
            phantomjs.on('swagger-complete', function (location, result) {
                grunt.log.writeln('swagger-complete for URL:'+location.href);

                var urlElements = location.pathname.split("/");
                var onlyFileName = urlElements[urlElements.length - 1];
                var filenameElements = onlyFileName.split('.');
                var fileNameWithoutExtension = filenameElements.splice(0, filenameElements.length - 1).join();

                var targetFileName = options.target + '/' + fileNameWithoutExtension + '-inline.html';
                grunt.file.write(targetFileName, result);
                grunt.log.writeln('swagger onepage output:' + targetFileName);
                phantomjs.halt();
            });

            phantomjs.on('bridge.initialized', function () {
                grunt.log.writeln('phantomJS Bridge Initialised');
            });

            phantomjs.on('debug', function (msg) {
                grunt.log.writeln('DEBUG::'+msg);
            });

            phantomjs.on('swagger-error', function (err) {
                grunt.warn('swagger-err:' + err);
                phantomjs.halt();
            });

            // Built-in error handlers.
            phantomjs.on('fail.load', function (url) {
                phantomjs.halt();
                grunt.warn('PhantomJS unable to load URL.' + url);
            });

            phantomjs.on('fail.timeout', function () {
                phantomjs.halt();
                grunt.warn('PhantomJS timed out.');
            });

            var pageUrl = options.serverURLStem + "/" + name + '.html';
            grunt.log.writeln('connecting to :' + pageUrl);
            phantomjs.spawn(pageUrl, {
                // Additional PhantomJS options.
                options: {
                    timeout: 50000,
                    inject: asset('phantomjs/bridge.js')
                },
                // Complete the task when done.
                done: function (err) {
                    if (err){
                        done(err);
                        return;
                    }
                    completeCounter = completeCounter+1;
                    if (completeCounter === fileNames.length) {
                        done();
                    }
                }
            });

        });
    });
};
