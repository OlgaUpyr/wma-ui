"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var bump = require('gulp-bump');
var sass = require('gulp-sass');
var env = require('gulp-env');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

var scripts = require('./scripts');
var styles = require('./styles');

var autoprefixer = require('gulp-autoprefixer');

gulp.task('images', function () {
    gulp.src('src/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('css', function () {
    gulp.src(styles)
        .pipe(concat('main-static.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sass', function () {
    gulp.src('./src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('js-controller', function () {
    gulp.src("./src/js/controller/*.js")
        .pipe(gulp.dest('./dist/js/controller'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js-service', function () {
    gulp.src("./src/js/service/*.js")
        .pipe(gulp.dest('./dist/js/service'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function () {
    gulp.src(scripts)
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function () {
    return gulp.src('./src/templates/**/*.*')
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('dev', function () {
    gulp.src("./src/js/conf/config-dev.js")
        .pipe(rename('application-properties.js'))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('build', function () {
    gulp.start(['sass', 'css', 'js', 'js-controller', 'js-service', 'html', 'images']);
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        open: false,
        port: 3000,
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('start-dev', function () {
    gulp.start(['dev', 'build', 'browser-sync']);
    gulp.watch(['./src/js/conf/config-dev.js'], ['dev']);
    gulp.watch(['./src/css/**/*.css'], ['css']);
    gulp.watch(['./src/sass/**/*.scss'], ['sass']);
    gulp.watch(['./src/js/app.js'], ['js']);
    gulp.watch(['./src/js/**/*.js'], ['js-controller']);
    gulp.watch(['./src/js/**/*.js'], ['js-service']);
    gulp.watch(['./src/templates/**/*.html'], ['html']);
});
