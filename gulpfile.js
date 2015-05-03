'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var karma = require('karma').server;
var derequire = require('derequire/plugin');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');
var rename = require('gulp-rename');

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
        .pipe(gulp.dest('./dist/'))
        .pipe(buffer())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({mangle: false})).on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'))
        .on('end', function () {
            gutil.log('Build done!');
        })
    ;
});

gulp.task('karma:run', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('karma:watch', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

function inc (importance) {
    return gulp.src(['./package.json'])
        .pipe(bump({type: importance}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('Version bump'))
        .pipe(filter('package.json'))
        .pipe(tagVersion())
    ;
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
