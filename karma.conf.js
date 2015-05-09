var istanbul = require('browserify-istanbul');
var isparta = require('isparta');

module.exports = function (config) {
    'use strict';

    config.set({

        browsers: [
            //'PhantomJS',
            'Chrome',
            //'Firefox',
            //'Safari',
            //'Opera'
        ],
        reporters: ['spec', 'notify', 'coverage'],
        frameworks: ['browserify', 'mocha', 'chai-sinon', 'sinon'],

        // list of files / patterns to load in the browser
        files: ['./tests/spec/**/*.js'],

        preprocessors: {
            './tests/spec/**/*.js': ['browserify']
        },

        client: {
            mocha: {reporter: 'html'} // change Karma's debug.html to the mocha web reporter
        },

        browserify: {
            debug: true,
            transform: [
                //'babelify',
                istanbul({
                    instrumenter: isparta,
                    ignore: ['**/node_modules/**', '**/test/**'],
                })
            ],
            configure: function (bundle) {
                bundle.on('bundled', function (error) {
                    if (error != null)
                        console.error(error.message);
                });
            }
        },

        notifyReporter: {
            reportEachFailure: true,
            reportSuccess: true
        },

        logLevel: config.LOG_INFO,
    });
};
