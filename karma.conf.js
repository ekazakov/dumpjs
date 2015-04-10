module.exports = function(config) {
    'use strict';

    config.set({

        browsers: ['Chrome', 'PhantomJS'],
        reporters: ['progress', 'notify'],
        frameworks: ['mocha', 'chai-sinon', 'sinon'],

        // list of files / patterns to load in the browser
        files: ['tests/index.js'],

        client: {
            mocha: {reporter: 'html'} // change Karma's debug.html to the mocha web reporter
        },


        notifyReporter: {
            reportEachFailure: true,
            reportSuccess: true,
        },

    });
};
