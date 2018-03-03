const gulp = require('gulp');
const angularFilesort = require('gulp-angular-filesort');
const inject = require('gulp-inject');
const naturalSort = require('gulp-natural-sort');
const bowerFiles = require('main-bower-files');
const es = require('event-stream');
const connect = require('gulp-connect');
const angularTemplates = require('gulp-angular-templates');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const streamQueue = require('streamqueue');


gulp.task('connect', function () {
    connect.server({
        root: './app/',
        port: 8888,
        livereload: false,
        fallback: './app/index.html'
    });
});

//https://stormpath.com/blog/angularjs-with-gulp-inject
gulp.task('dev', function () {
    return gulp.src('./app/index.html')
        .pipe(inject(es.merge(
            gulp.src(['./app/assets/css/**/*.css'], {read: false}),
            gulp.src(bowerFiles(), {read: false}),
            gulp.src(['./app/**/*.js', '!./app/dist/**', '!./app/bower_components/**'])
                .pipe(naturalSort())
                .pipe(babel({
                    presets: ['env']
                }))
                .pipe(angularFilesort())
        ), {relative: true, addRootSlash: true }))
        .pipe(gulp.dest('./app'))
        .pipe(connect.reload());
});

gulp.task('build:js', function() {
    return streamQueue(
        { objectMode: true },
        gulp.src(bowerFiles()),
        gulp.src(['./app/**/*.js',  '!./app/bower_components/**', '!./app/dist/**'])
            .pipe(babel({
                presets: ['env']
            }))
            .pipe(angularFilesort()),
        gulp.src(['app/**/*.html', '!./app/bower_components/**'])
            .pipe(angularTemplates({
                module: 'app'
            }))
    )
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./app/dist'));
});


gulp.task('build:css', function() {
    return streamQueue(
        {objectMode: true},
        gulp.src(bowerFiles('**/*.css')),
        gulp.src(['./app/assets/css/*.css',])
    )
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./app/dist'));
});

gulp.task('build', ['build:js', 'build:css'], function () {
    return gulp.src('./app/index.html')
        .pipe(inject(gulp.src(['./app/dist/*'], {read: false}), {
            relative: true
        }))
        .pipe(gulp.dest('./app'))
});

gulp.task('watch', function () {
    gulp.watch(['./app/**/*.js', '!./app/bower_components/**', '!./app/dist/**'], ['dev']);
});

gulp.task('default', ['connect', 'dev', 'watch']);
gulp.task('prod', ['build']);
