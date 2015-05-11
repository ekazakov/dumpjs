var fs = require('fs');
var istanbul = require('browserify-istanbul');
var isparta = require('isparta');

// Use ENV vars on Travis and sauce.json locally to get credentials
if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
        console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
        process.exit(1);
    } else {
        process.env.SAUCE_USERNAME = require('./sauce').username;
        process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
}

// Browsers to run on Sauce Labs
var customLaunchers = {
    'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Mac OS X 10.9'
    },

    //'SL_IE': {
    //    base: 'SauceLabs',
    //    browserName: 'internet explorer',
    //    version: '9'
    //},
    //
    //'SL_Firefox': {
    //    base: 'SauceLabs',
    //    browserName: 'firefox'
    //},

    //'SL_Safari': {
    //    base: 'SauceLabs',
    //    browserName: 'safari',
    //    varsion: '6',
    //    platform: 'Mac OS X 10.8'
    //},

    //'SL_iOS': {
    //    base: 'SauceLabs',
    //    browserName: 'iphone',
    //    version: '6.1'
    //},

    //'SL_Android': {
    //    base: 'SauceLabs',
    //    browserName: 'android'
    //}
};

module.exports = function (config) {
    'use strict';

    config.set({
        reporters: ['dots', 'saucelabs', 'notify', 'coverage'],
        frameworks: ['browserify', 'mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: ['./tests/spec/**/*.js'],

        preprocessors: {
            './tests/spec/**/*.js': ['browserify']
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
        color: true,

        sauceLabs: {
            testName: 'Dumpjs tests',
            build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
        },

        captureTimeout: 200000,
        customLaunchers: customLaunchers,

        browsers: Object.keys(customLaunchers),
        singleRun: true
    });
};
