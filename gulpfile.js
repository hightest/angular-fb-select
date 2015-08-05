var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var rename = require('gulp-rename');
var del = require('del');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');//To prevent pipe breaking caused by errors at 'watch'
var streamqueue = require('streamqueue');
var ngAnnotate = require('gulp-ng-annotate');
var less = require('gulp-less');
var distPath = 'dist';

var config = {
    pkg : JSON.parse(fs.readFileSync('./package.json')),
    banner:
    '/*!\n' +
    ' * <%= pkg.name %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
    ' * License: <%= pkg.license %>\n' +
    ' */\n\n\n'
};

gulp.task('default', ['build']);
gulp.task('build', ['scripts', 'styles']);

gulp.task('watch', ['build'], function() {
    gulp.watch(['src/*.{js,html,less}'], ['build']);
});

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('styles', ['clean'], function() {
    return gulp.src('src/*.less')
        .pipe(header(config.banner, {
            timestamp: (new Date()).toISOString(), pkg: config.pkg
        }))
        .pipe(less())
        .pipe(gulp.dest(distPath))
        .pipe(minifyCSS())
        .pipe(rename({ext:'.min.css'}))
        .pipe(gulp.dest(distPath));
});

gulp.task('scripts', ['clean'], function() {

    var buildTemplates = function () {
        return gulp.src('src/*.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(templateCache({root: 'ht-fb-select/', module: 'ht.fbSelect'}));
    };

    var buildLib = function(){
        return gulp.src('src/*.js')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'));
    };


    //return es.merge(buildLib(), buildTemplates())
    return streamqueue({ objectMode: true },
        buildLib(),
        buildTemplates()
    )
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(concat('ht-fb-select.js'))
        .pipe(header(config.banner, {
            timestamp: (new Date()).toISOString(), pkg: config.pkg
        }))
        .pipe(gulp.dest('dist'))
        .pipe(ngAnnotate())
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({ext:'.min.js'}))
        .pipe(gulp.dest('dist'));

});

var handleError = function (err) {
    console.log(err.toString());
    this.emit('end');
};