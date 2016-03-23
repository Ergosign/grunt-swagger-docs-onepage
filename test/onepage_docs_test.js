'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.onepage_docs = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    simple: function (test) {
        test.expect(1);

        var filepath = 'simple';
        var actual = grunt.file.read('tmp/' + filepath + '-inline.html');
        var expected = grunt.file.read('test/expected/' + filepath + '-inline.html');
        test.equal(actual, expected, 'output does match the expected output for '+filepath);

        test.done();
    },
    referencing: function (test) {
        test.expect(1);

        var filepath = 'referencing';
        var actual = grunt.file.read('tmp/' + filepath + '-inline.html');
        var expected = grunt.file.read('test/expected/' + filepath + '-inline.html');
        test.equal(actual, expected, 'output does match the expected output for '+filepath);

        test.done();
    }
};
