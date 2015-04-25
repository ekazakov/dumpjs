module.exports = function(config) {
    'use strict';

    config.set({

        browsers: ['Chrome'],
        reporters: ['progress', 'notify'],
        frameworks: ['browserify' ,'mocha', 'chai-sinon', 'sinon'],

        // list of files / patterns to load in the browser
        files: ['tests-index.js'],

        preprocessors: {
            'tests-index.js': ['browserify']
        },

        client: {
            mocha: {reporter: 'html'} // change Karma's debug.html to the mocha web reporter
        },

        browserify: {
            debug: true
        },

        notifyReporter: {
            reportEachFailure: true,
            reportSuccess: true,
        },

    });
};
