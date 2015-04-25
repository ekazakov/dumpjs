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
            debug: true,

            configure: function(bundle) {
                bundle.on('bundled', function(error) {
                    if (error != null)
                        console.error(error.message);
                });
            }
        },

        notifyReporter: {
            reportEachFailure: true,
            reportSuccess: true
        }
    });
};
