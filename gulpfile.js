'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var karma = require('gulp-karma');
var derequire = require('derequire/plugin');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');

gulp.task('dist', function () {
    var b = browserify({
        entries: './src/dump.js',
        debug: true,
        standalone: 'dump'
    });

    return b
        .transform('babelify')
        .plugin(derequire)
        .bundle()
        .pipe(source('dump.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify({mangle: false}))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'))
        .on('end', function () {
            gutil.log('Build done!');
        })
        ;
});

gulp.task('karma:run', function () {
    // Be sure to return the stream
    return gulp.src(['./tests/spec/*'])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            console.log(arguments);
            // Make sure failed tests cause gulp to exit non-zero
            //throw err;
        })
        .on('end', function () {
            gutil.log('Done!');
        });
});

function inc (importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json'])
        // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe(git.commit('bumps package version'))

        // read only one file to get the version number
        .pipe(filter('package.json'))
        // **tag it in the repository**
        .pipe(tagVersion());
}

gulp.task('patch', function () {
    return inc('patch');
});

gulp.task('feature', function () {
    return inc('minor');
});

gulp.task('release', function () {
    return inc('major');
});
